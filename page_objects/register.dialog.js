var Page = require('./Page');
const ProxyDialog = require('./proxy.dialog');

var RegisterDialog = Object.create(Page, {
  username: { get: function() { return browser.element('#subscription-register-username');}},
  password: { get: function() { return browser.element('#subscription-register-password');}},
  org: { get: function() { return browser.element('#subscription-register-org');}},
  activationKey: { get: function() { return browser.element('#subscription-register-key');}},
  mainFrame: { get: function() {
    return browser.element('iframe[name="cockpit1:localhost/subscriptions"][data-loaded="1"]');
  }},
  registerButton: { get: function(){
    return browser.element('div.modal-footer button.btn-primary'); 
  }},

  wait: { value: function() {
    this.username.waitForVisible();
    this.password.waitForVisible();
    return this;
  }},
  enableProxy: { value: function(){
    ProxyDialog.useProxy.click();
    return this;
  }},
  setNoAuthProxy: { value: function(location){
    this.enableProxy();
    ProxyDialog.setNoAuthProxy(location);
    return this;
  }},
  registerWithUser: { value: function (username, password, orgid){
    this.username.setValue(username);
    this.password.setValue(password);
    this.org.setValue(orgid);
    browser.debug();
    this.registerButton.click();
    return this;
  }}
});

module.exports = RegisterDialog;
