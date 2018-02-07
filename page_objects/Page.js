const env = require('env2')('.env');

function Page () {
    this.title = 'Cockpit Page';
    this.url = process.env.COCKPIT_URL;
}

Page.prototype.open = function (path) {
    browser.url(path);
};

module.exports = new Page();
