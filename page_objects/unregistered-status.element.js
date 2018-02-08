var Page = require('./Page');
const RegisterDialog = require('./register.dialog');

var UnregisteredStatusElement = Object.create(Page, {
    status:  { get: function() { return browser.element('div.subscription-status-ct')}},
    statusLabel: { get: function() { return browser.element('div.subscription-status-ct label')}},
    button: { get: function() { return this.status.element('button.btn-primary')}},
    wait: { value: function() {
        browser.waitForText('div.subscription-status-ct button',20000,'Register');
        return this;
    }},
    textOfStatus: { value: function() {
        return this.status.element('label').getText();
    }},
    registerWithUser: { value: function (username, password){
        this.button.click();
        RegisterDialog.wait()
            .registerWithUser(username, password)
        return this;
    }}
});
module.exports = UnregisteredStatusElement;
