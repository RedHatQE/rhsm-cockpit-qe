var assert = require('assert');
var LoginPage = require('../../page_objects/login.page');
var MainPage = require('../../page_objects/main.page');
var SubscriptionsPage = require('../../page_objects/subscriptions.page');

const  env = require('env2')('.env');

describe('cockpit subscriptions page', function() {
    it('offers a way to register a system', function () {
        LoginPage.open()
            .wait()
            .login(process.env.COCKPIT_USER_NAME,
                   process.env.COCKPIT_USER_PASSWORD);
        MainPage.wait()
            .subscriptions();

        SubscriptionsPage.wait()
            .registerWithUser('jan','stavel');
    });
});
