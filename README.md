# RHSM functional/system tests for a plugin Subscriptions in Cockpit

`RHSM` - Red Hat Subscription Management is a sort of tools that a customer uses to entitlement Red Hat products.

Customer can use `subscription-manager` command line tool
or Cockpit plugin `Subscriptions`.

There are tests for the whole entitlement game in this repo.

The main focus is to test the cockpit plugin.
The tests are webdriver based mostly.

## Installation

1) install firefox 

2) install `RHSM Services` on a tested machine
> it is necessary to install [RHSM Services](https://github.com/RedHatQE/rhsm-services) into a tested machine.

3) install `nodejs`
The tests use `nodejs`.

4) install testing environment

```shell
cd src/rhsm-cockpit-qe
npm install
npm run e2e-setup
```
## How To Run it

```shell
./node_modules/.bin/wdio wdio.conf.js

# or just one specification
./node_modules/.bin/wdio wdio.conf.js --spec test/specs/subscriptions.js
```

It will fire up a browser firefox and start clicking on a cockpit page.

## Design
It is based on [WebdriverIO](http://webdriver.io/)

### Page objects
Each page and page element has its own definition.
The definition describes main parts of the element.
It offers main functionality that the element provides (from user perspective).

The definitions are stored in a directory `./page_objects`.

[PageObject Pattern in WebdriverIO](http://webdriver.io/guide/testrunner/pageobjects.html)

Each method returns `this`. You can chain method calls.

> There are methods aka 'atProxyDialog' in page objects. 
> Those methods run a code in a context of another page element
> It helps a code to be better structured

```javascript
SubscriptionPage.wait()
  .atUnregisterStatus((element) => element.wait.registerButton.click())
  .atRegisterDialog((dialog) => dialog.wait().enableProxy().wait());
```

### WebdriverIO with Wdio

### RHSM-services

[RHSM Services Repo](https://github.com/RedHatQE/rhsm-services)

  It offers a bunch of websocket services to work with tested machine:
  
  - monitor of a file - realtime stream of changes of a file
  - execution of a binary
  - rhsm/status - realtime stream of changes of an entitlement system status
  
### Reactive programming

Tests uses `RxJS` library. It helps to solve `callback hell` at least. 
Next reason for using it is an async nature of the library. It makes living in async world much easier.

See [ReactiveX Page](http://reactivex.io).

## Development workflow

### Debugging

If you want to pause of a test execution,
you can put `debug` statement in the place you want.

```javascript
browser.debug()
```

> Each page object derived from `./page_objects/Page.js` offers you the debug statement to be a part of code chaining.

```javascript
SubscriptionsPage.wait()
      .atUnregisterStatus((el) => el.wait().registerButton.click())
      .debug() // pause right after a user clicks on 'register' button
      .atRegisterDialog((dialog) => {
      // ...
});
```

[Debugging in WebSocketIO](http://webdriver.io/guide/testrunner/debugging.html)
