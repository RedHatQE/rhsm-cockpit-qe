const LoginPage = require('../../page_objects/login.page');
const MainPage = require('../../page_objects/main.page');
const SubscriptionsPage = require('../../page_objects/subscriptions.page');

const Rx = require('rxjs/Rx');
const env = require('env2')('.env');
const WebSocket = require('ws');
const ini = require('ini');

let ws;
let rhsm; //a stream of contents of a file /etc/rhsm/rhsm.conf

let subscriptioManagerService;
let subscriptionManagerResponses; // a stream of responses of subscription-manager command run

let RHSMStatusService;
let RHSMStatusResponses; // a stream of responses of subscription-manager command run


beforeAll(() => {
  console.log('initializing of a service rhsm monitor');
  ws = new WebSocket(process.env.RHSM_SERVICES_URL + '/monitor/etc/rhsm/rhsm.conf');
  return Rx.Observable.fromEvent(ws,'open')
    .take(1)
    .map((x) => Rx.Observable.fromEvent(ws,'message').publish())
    .forEach((x) => { console.log('rhsm monitor service has been connected');
                      rhsm = x;
                      rhsm.connect();});
});
beforeAll(() => {
  console.log('initializing of a service rhsm executor');
  subscriptionManagerService = new WebSocket(process.env.RHSM_SERVICES_URL + '/execute/usr/bin/subscription-manager');
  return Rx.Observable.fromEvent(subscriptionManagerService,'open')
    .take(1)
    .map((x) => Rx.Observable.fromEvent(subscriptionManagerService,'message').publish())
    .forEach((x) => { console.log('rhsm executing service has been connected');
                      subscriptionManagerResponses = x;
                      subscriptionManagerResponses.connect();});
});
beforeAll(() => {
  console.log('initializing of a service rhsm status');
  RHSMStatusService = new WebSocket(process.env.RHSM_SERVICES_URL + '/rhsm/status');
  return Rx.Observable.fromEvent(RHSMStatusService,'open')
    .take(1)
    .map((x) => Rx.Observable.fromEvent(RHSMStatusService,'message').publish())
    .forEach((x) => { console.log('rhsm status service has been connected');
                      RHSMStatusResponses = x;
                      RHSMStatusResponses.connect(); });
});

function RHSMSubscription(){
  return rhsm
    .map((x) => JSON.parse(x.data))
    .filter(x => x.event === "pong")
    .take(1)
  //.map(x => {console.log(x); return x;})
    .map(x => { return {'time': x.time,
                        'content': ini.decode(new Buffer(x.content,'base64').toString('utf8'))};});
};

async function getRHSMContent(){
  ws.send('ping');
  return RHSMSubscription().toPromise();
};

async function executeSubscriptionManager(args){
  let response = subscriptionManagerResponses
      .map((x) => JSON.parse(x.data))
      //.map((x) => {console.log(x); return x;})
      .take(1);
  subscriptionManagerService.send(args);
  return response.toPromise();
};

browser.addCommand('getRHSMContent', () => {
  return getRHSMContent();
});

browser.addCommand('executeSubscriptionManager', (args) => {
  return executeSubscriptionManager(args);
});

async function getRHSMStatus(){
  let response = RHSMStatusResponses
      .map((x) => JSON.parse(x.data))
      .take(1);
  RHSMStatusService.send("ping");
  return response.toPromise();
}

browser.addCommand('getRHSMStatus', async () => {
  let response = RHSMStatusResponses
      .map((x) => JSON.parse(x.data))
      .take(1)
      .map((x) => x.overallStatus);
  RHSMStatusService.send("ping");
  return response.toPromise();
});

browser.addCommand('waitForRHSMStatus', async (fn) => {
  let response = RHSMStatusResponses
      .map((x) => JSON.parse(x.data))
      .map((x) => x.overallStatus)
      .filter((status) => fn(status))
      .take(1);
  const ticks = Rx.Observable.interval(1000);
  ticks.takeUntil(response)
    .subscribe(() => { console.log("tick");
                       RHSMStatusService.send("ping");});
  return response.toPromise();
});

describe('proxy dialog', function() {
  it("saves it's values into /etc/rhsm/rhsm.conf", function () {
    // starting point of this story
    // a system is unregistered and proxy is not used
    if( browser.getRHSMStatus() !== "Unknown"){
      browser.executeSubscriptionManager("unregister");
    };
    browser.waitForRHSMStatus((status) => status === "Unknown");

    // a story begins right now
    LoginPage.open().wait()
      .login(process.env.COCKPIT_USER_NAME,
             process.env.COCKPIT_USER_PASSWORD);
    MainPage.wait().subscriptions();
    SubscriptionsPage.wait()
      .atUnregisterStatus((el) => el.wait().registerButton.click())
      .atRegisterDialog((dialog) => {
        let proxyLocation = process.env.COCKPIT_SUBSCRIPTION_PROXY_HOSTNAME
            + ":"
            + process.env.COCKPIT_SUBSCRIPTION_PROXY_PORT;
        dialog.wait()
          .setCustomURL(process.env.RHSM_TEST_CANDLEPIN_URL)
          .atProxyDialog((dialog) => {
            dialog.enableProxy().wait()
              .setAuthProxy(proxyLocation,
                            process.env.COCKPIT_SUBSCRIPTION_PROXY_USER,
                            process.env.COCKPIT_SUBSCRIPTION_PROXY_PASSWORD);})
          .registerWithUser(process.env.COCKPIT_SUBSCRIPTION_USER_NAME,
                            process.env.COCKPIT_SUBSCRIPTION_PASSWORD,
                            process.env.COCKPIT_SUBSCRIPTION_ORG_ID);
      });

    // wait for changes in entitlement to be propagated into a system environment
    browser.waitForRHSMStatus(status => status !== "Unknown");

    // all verification fights go here
    let config02 = browser.getRHSMContent();
    let serverConfig = config02.content.server;
    expect(serverConfig.proxy_hostname).toBe(process.env.COCKPIT_SUBSCRIPTION_PROXY_HOSTNAME);
    expect(serverConfig.proxy_port).toBe(process.env.COCKPIT_SUBSCRIPTION_PROXY_PORT);
    expect(serverConfig.proxy_user).toBe(process.env.COCKPIT_SUBSCRIPTION_PROXY_USER);
    expect(serverConfig.proxy_password).toBe(process.env.COCKPIT_SUBSCRIPTION_PROXY_PASSWORD);
    });
});
