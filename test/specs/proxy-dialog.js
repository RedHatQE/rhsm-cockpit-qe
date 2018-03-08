const LoginPage = require('../../page_objects/login.page');
const MainPage = require('../../page_objects/main.page');
const SubscriptionsPage = require('../../page_objects/subscriptions.page');
const InvalidStatusElement = require('../../page_objects/invalid-status.element');
const UnregisteredStatusElement = require('../../page_objects/unregistered-status.element');
const RegisterDialog = require('../../page_objects/register.dialog');

const Rx = require('rxjs/Rx');
const env = require('env2')('.env');
const WebSocket = require('ws');
const ini = require('ini');

let ws;
let rhsm;

beforeAll(() => {
  console.log('before hook called');
  ws = new WebSocket(process.env.RHSM_SERVICES_URL + '/monitor/etc/rhsm/rhsm.conf');
  return Rx.Observable.fromEvent(ws,'open')
    .take(1)
    .map((x) => Rx.Observable.fromEvent(ws,'message').publish())
    .forEach((x) => {console.log('rhsm service connected');
                     rhsm = x;
                     rhsm.connect();});
});

async function getRHSMContent(){
  ws.send('ping');
  return rhsm
    .map((x) => JSON.parse(x.data))
    .filter(x => x.event === "pong")
    .take(1)
    //.map(x => {console.log(x); return x;})
    .map(x => { return {'time': x.time,
                        'content':ini.decode(new Buffer(x.content,'base64').toString('utf8'))};})
    .toPromise();
};

browser.addCommand('getRHSMContent', () => {
  return getRHSMContent();
});

describe('proxy dialog', function() {
  it("saves it's values into /etc/rhsm/rhsm.conf", function () {
    console.log('proxy dialog test');
    console.log((new Date()).toISOString());
    let contentBefore = browser.getRHSMContent();
    // getRHSMContent().then((result) => {console.log('prirazeni');
    //                                    console.log('result:',result);
    //                                    contentBefore = result;});
    LoginPage.open()
      .wait()
      .login(process.env.COCKPIT_USER_NAME,
             process.env.COCKPIT_USER_PASSWORD);
    MainPage.wait()
      .subscriptions();
    SubscriptionsPage.wait();
    UnregisteredStatusElement.wait()
      .registerButton.click();
    RegisterDialog.wait()
      .setNoAuthProxy(process.env.COCKPIT_SUBSCRIPTION_PROXY_LOCATION)
      .registerWithUser(process.env.COCKPIT_SUBSCRIPTION_USER_NAME,
                        process.env.COCKPIT_SUBSCRIPTION_PASSWORD,
                        process.env.COCKPIT_SUBSCRIPTION_ORG_ID);
    console.log((new Date()).toISOString());
    let contentBefore02 = browser.getRHSMContent();
    // InvalidStatusElement.wait();
        // browser.waitForText(InvalidStatusElement.statusLabel.selector,20000,'Status: Invalid');
    });
    // it("submit its form", function () {
    //     LoginPage.open()
    //         .wait()
    //         .login(process.env.COCKPIT_USER_NAME,
    //                process.env.COCKPIT_USER_PASSWORD);
    //     MainPage.wait()
    //         .subscriptions();
    //     SubscriptionsPage.wait();
    //     UnregisteredStatusElement.wait()
    //         .registerWithUser(process.env.COCKPIT_SUBSCRIPTION_USER_NAME,
    //                           process.env.COCKPIT_SUBSCRIPTION_PASSWORD);
    // });
});
