const LoginPage = require('../../page_objects/login.page');
const MainPage = require('../../page_objects/main.page');
const SubscriptionsPage = require('../../page_objects/subscriptions.page');
const env = require('env2')('.env');

beforeAll(async () => {
  let services = await require('../services.js')();

  // add sync commands into browser
  require('../commands.js')(browser, services);
});

describe('proxy dialog', function() {
  it("saves it's values into /etc/rhsm/rhsm.conf", function () {
    // starting point of this story
    // a system is unregistered and proxy is not used
    if( browser.getRHSMStatus() !== "Unknown"){
      browser.executeSubscriptionManager("unregister");
    };
    browser.waitForRHSMStatus((status) => status === "Unknown");
    browser.setNOProxyConfig();

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
    let config = browser.getRHSMConfig();
    let serverConfig = config.content.server;
    expect(serverConfig.proxy_hostname).toBe(process.env.COCKPIT_SUBSCRIPTION_PROXY_HOSTNAME);
    expect(serverConfig.proxy_port).toBe(process.env.COCKPIT_SUBSCRIPTION_PROXY_PORT);
    expect(serverConfig.proxy_user).toBe(process.env.COCKPIT_SUBSCRIPTION_PROXY_USER);
    expect(serverConfig.proxy_password).toBe(process.env.COCKPIT_SUBSCRIPTION_PROXY_PASSWORD);
    });
});
