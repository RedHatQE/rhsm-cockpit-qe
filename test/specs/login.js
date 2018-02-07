var assert = require('assert');
var LoginPage = require('../../page_objects/login.page');
var MainPage = require('../../page_objects/main.page');
const  env = require('env2')('.env');

describe('cockpit login page', function() {
    it('offers a way to login to cockpit', function () {
        LoginPage.open();
        LoginPage.wait();
        LoginPage.login(process.env.COCKPIT_USER_NAME,
                        process.env.COCKPIT_USER_PASSWORD);
        MainPage.wait();
    });
});
