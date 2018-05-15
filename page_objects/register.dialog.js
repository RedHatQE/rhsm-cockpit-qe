var Page = require('./Page');
const ProxyDialog = require('./proxy.dialog');

var RegisterDialog = Object.create(Page, {
  registerURL: { get: function(){ return browser.element('button[data-id="subscription-register-url"]');}},
  registerCustomURL: { get: function(){ return browser.element('span=Custom URL');}},
  registerCustomURLInput: { get: function(){ return browser.element('#subscription-register-url-custom');}},
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

  setCustomURL: { value: function(url){
    this.registerURL.click();
    this.registerCustomURL.waitForVisible();
    this.registerCustomURL.click();
    this.registerCustomURLInput.waitForVisible();
    this.registerCustomURLInput.setValue(url);
    return this;
  }},

  atProxyDialog: { value: function(fn){
    fn(ProxyDialog);
    return this;
  }},

  registerWithUser: { value: function (username, password, orgid){
    this.username.setValue(username);
    this.password.setValue(password);
    this.org.setValue(orgid);
    this.registerButton.click();
    return this;
  }},

  registerWithActivationKey: { value: function (keyid, orgid){
    this.activationKey.setValue(keyid);
    this.org.setValue(orgid);
    this.registerButton.click();
    return this;
  }}
});

module.exports = RegisterDialog;
