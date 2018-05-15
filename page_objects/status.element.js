var Page = require('./Page');

var StatusElement = Object.create(Page, {
  status: { get: function() { return browser.element('div.subscription-status-ct');}},
  button: { get: function() { return this.status.element('button.btn-primary');}},

  wait: { value: function() {
    browser.waitForText('div.subscription-status-ct button', 20000, 'Unregister');
    return this;
  }},
  textOfStatus: { value: function() {
    let st = this.status;
    return this.status.element('label').getText();
  }}
});

module.exports = StatusElement;
