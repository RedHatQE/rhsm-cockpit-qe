# RHSM functional/system tests for a plugin Subscriptions in Cockpit

`RHSM` - Red Hat Subscription Management is a sort of tools that a customer uses to entitlement Red Hat products.

Customer can use `subscription-manager` command line tool
or Cockpit plugin `Subscriptions`.

There are tests for the whole entitlement game in this repo.

The main focus is to test the cockpit plugin.
The tests are webdriver based mostly.


## How To Run it

```shell
./node_modules/.bin/wdio wdio.conf.js

# or just one specification
./node_modules/.bin/wdio wdio.conf.js --spec test/specs/subscriptions.js
```

It will fire up a browser firefox and start clicking on a cockpit page.

## Design
### Page objects
Each page and page element has its own definition.
The definition describes main parts of the element.
It offers main functionality that the element provides (from user perspective).

The definitions are stored in a directory `./page_objects`.

### RHSM-services

[RHSM Services Repo](https://github.com/RedHatQE/rhsm-services)

  It offers a bunch of websocket services to work with tested machine:
  
  - monitor of a file - realtime stream of changes of a file
  - execution of a binary
  - rhsm/status - realtime stream of changes of an entitlement system status
  
### Reactive programming

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
