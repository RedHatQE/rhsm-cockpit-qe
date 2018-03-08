const LoginPage = require('../../page_objects/login.page');
const MainPage = require('../../page_objects/main.page');
const SubscriptionsPage = require('../../page_objects/subscriptions.page');
const InvalidStatusElement = require('../../page_objects/invalid-status.element');
const UnregisteredStatusElement = require('../../page_objects/unregistered-status.element');

const  env = require('env2')('.env');

describe('cockpit subscriptions page', function() {
    it('offers a way to register a system', function () {
        LoginPage.open()
            .wait()
            .login(process.env.COCKPIT_USER_NAME,
                   process.env.COCKPIT_USER_PASSWORD);
        MainPage.wait()
            .subscriptions();
        SubscriptionsPage.wait();
        UnregisteredStatusElement.wait()
             .registerWithUser(process.env.COCKPIT_SUBSCRIPTION_USER_NAME,
                               process.env.COCKPIT_SUBSCRIPTION_PASSWORD);
        InvalidStatusElement.wait();
        browser.waitForText(InvalidStatusElement.statusLabel.selector,20000,'Status: Invalidd');
        //expect(InvalidStatusElement.textOfStatus()).to.contain('Status: Invalid');
        //browser.debug();
    });
});
