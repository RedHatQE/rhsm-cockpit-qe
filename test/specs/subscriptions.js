const LoginPage = require('../../page_objects/login.page');
const MainPage = require('../../page_objects/main.page');
const SubscriptionsPage = require('../../page_objects/subscriptions.page');
const StatusElement = require('../../page_objects/status.element');

const env = require('env2')('.env');

beforeAll(async () => {
  let services = await require('../services.js')();
  require('../commands.js')(browser, services);
});

describe('cockpit subscriptions page', function() {
  it('offers a way to register a system', function () {
    // starting point of this story
    // a system is unregistered and proxy is not used
    if( browser.getRHSMStatus() !== "Unknown"){
      console.log('unregister a system');
      browser.executeSubscriptionManager("unregister");
    };
    browser.waitForRHSMStatus((status) => status === "Unknown");
    browser.setNoProxyConfig();

    LoginPage.open().wait()
      .login(process.env.COCKPIT_USER_NAME,
             process.env.COCKPIT_USER_PASSWORD);
    MainPage.wait()
      .subscriptions();
    SubscriptionsPage.wait()
      .atUnregisterStatus((el) => el.wait().registerButton.click())
      .atRegisterDialog((dialog) => {
        dialog.wait().registerWithUser(process.env.COCKPIT_SUBSCRIPTION_USER_NAME,
                                       process.env.COCKPIT_SUBSCRIPTION_PASSWORD,
                                       process.env.COCKPIT_SUBSCRIPTION_ORG_ID);
      });

    // wait for changes in entitlement to be propagated into a system environment
    let status = browser.waitForRHSMStatus(status => status !== "Unknown");
    let text = StatusElement.wait().textOfStatus();
    if( status === 'Invalid'){
      expect(text).toBe('Status: Invalid');
    } else {
      expect(text).toBe('Status: Valid');
    }
  });
});
