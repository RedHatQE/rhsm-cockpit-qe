const LoginPage = require('../../page_objects/login.page');
const MainPage = require('../../page_objects/main.page');
const SubscriptionsPage = require('../../page_objects/subscriptions.page');
const env = require('env2')('.env');

beforeAll(async () => {
  let services = await require('../services.js')();

  // add sync commands into browser
  require('../commands.js')(browser, services);
});

describe('register dialog', function() {
  it("can register a system using activation key", function () {
    // starting point of this story
    // a system is unregistered and proxy is not used
    if( browser.getRHSMStatus() !== "Unknown"){
      browser.executeSubscriptionManager("unregister");
    };
    browser.waitForRHSMStatus((status) => status === "Unknown");
    browser.setNoProxyConfig();

    // a story begins right now
    LoginPage.open().wait()
      .login(process.env.COCKPIT_USER_NAME,
             process.env.COCKPIT_USER_PASSWORD);
    MainPage.wait().subscriptions();
    SubscriptionsPage.wait()
      .atUnregisterStatus((el) => el.wait().registerButton.click())
      .atRegisterDialog((dialog) => {
        dialog.wait()
          .setCustomURL(process.env.RHSM_TEST_CANDLEPIN_URL)
          .registerWithActivationKey(process.env.COCKPIT_SUBSCRIPTION_ACTIVATION_KEY_WITH_PARTIAL_SUBSCRIPTION,
                                     process.env.COCKPIT_SUBSCRIPTION_ORG_ID);
      });
    // wait for changes in entitlement to be propagated into a system environment
    browser.waitForRHSMStatus(status => status !== "Unknown");

    // all verification fights go here
    });
});
