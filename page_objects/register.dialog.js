var Page = require('./Page');
const env = require('env2')('.env');
const url = require('url');

var RegisterDialog = Object.create(Page, {
    username: { get: function() { return browser.element('#subscription-register-username')}},
    password: { get: function() { return browser.element('#subscription-register-password')}},
    activationKey: { get: function() { return browser.element('#subscription-register-key')}},
    useProxy:  { get: function() { return browser.element('#subscription-register-proxy-use')}},
    mainFrame: { get: function() {
        return browser.element('iframe[name="cockpit1:localhost/subscriptions"][data-loaded="1"]')
    }},
    registerButton: { get: function(){
        return browser.element('div.modal-footer button.btn-primary'); 
    }},
    wait: { value: function() {
        this.username.waitForVisible();
        this.password.waitForVisible();
        return this;
    }},
    registerWithUser: { value: function (username, password){
        this.username.setValue(username);
        this.password.setValue(password);
        this.registerButton.click();
        return this;
    }}
});

module.exports = RegisterDialog;
