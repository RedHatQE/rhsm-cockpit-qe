var Page = require('./Page');

var InvalidStatusElement = Object.create(Page, {
  status: { get: function() { return browser.element('div.subscription-status-ct');}},
  statusLabel: { get: function() { return browser.element('div.subscription-status-ct label');}},
  button: { get: function() { return this.status.element('button.btn-primary');}},
  wait: { value: function() {
        browser.waitForText('div.subscription-status-ct button',20000,'Unregister');
        //this.button.waitForText('Unregister');
        return this;
    }},
    textOfStatus: { value: function() {
        return this.status.element('label').getText();
    }}
});
module.exports = InvalidStatusElement;
