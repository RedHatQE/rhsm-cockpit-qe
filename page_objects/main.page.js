var Page = require('./Page');
const url = require('url');

var MainPage = Object.create(Page, {
    username: { get: function() { return browser.element('#content-user-name')}},
    subscriptionsLink: { get: function() { return browser.element('a[href="/subscriptions"]')}},
    open : { value: function() {
        browser.url(url.resolve(this.url,"/system"));
        return this;
    }},
    wait: { value: function() {
        this.username.waitForVisible();
        this.subscriptionsLink.waitForVisible();
        return this;
    }},
    subscriptions: { value: function (){
        browser.execute('document.querySelector("a[href=\'/subscriptions\']").click()');
        //this.subscriptionsLink.click(); // this does not work
        return this;
    }}
});

module.exports = MainPage;
