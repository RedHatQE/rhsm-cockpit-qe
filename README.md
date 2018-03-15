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
