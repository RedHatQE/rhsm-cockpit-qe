var Page = require('./Page');
const env = require('env2')('.env');
const url = require('url');
const UnregisterStatusElement = require('./unregistered-status.element.js');
const RegisterDialog = require('./register.dialog.js');

var SubscriptionsPage = Object.create(Page, {
  mainFrame: { get: function() {
    return browser.element('iframe[name="cockpit1:localhost/subscriptions"][data-loaded="1"]');
  }},
  wait: { value: function() {
    this.mainFrame.waitForVisible();
    browser.frame(this.mainFrame.value);
    return this;
  }},
  atUnregisterStatus: { value: function(fn){
    fn(UnregisterStatusElement);
    return this;
  }},
  atRegisterDialog:{ value: function(fn){
    fn(RegisterDialog);
    return this;
  }}
});

module.exports = SubscriptionsPage;
