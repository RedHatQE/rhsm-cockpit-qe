var Page = require('./Page');
const env = require('env2')('.env');
const url = require('url');

var SubscriptionsPage = Object.create(Page, {
    username: { get: function() { return browser.element('#subscription-register-username')}},
    password: { get: function() { return browser.element('#subscription-register-password')}},
    mainFrame: { get: function() {
        return browser.element('iframe[name="cockpit1:localhost/subscriptions"][data-loaded="1"]')
    }},
    registerButton: { get: function(){
        return browser.element('div.subscription-status-ct button'); 
    }},
    wait: { value: function() {
        this.mainFrame.waitForVisible();
        browser.frame(this.mainFrame.value);
        this.registerButton.waitForVisible();
        return this;
    }},
    registerWithUser: { value: function (username, password){
        this.registerButton.click();
        browser.debug();
        return this;
    }}
});

module.exports = SubscriptionsPage;
