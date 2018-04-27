const Rx = require('rxjs/Rx');
const WebSocket = require('ws');
const ini = require('ini');

async function prepareServices () {
  let services = {
    RHSMConfig: {
      ws: null,
      responses: null
    },
    RHSMStatus: {
      ws: null,
      responses: null
    },
    SubscriptionManager: {
      ws: null,
      responses: null
    }
  };

  console.log('initializing of a service rhsm monitor');
  services.RHSMConfig.ws = new WebSocket(process.env.RHSM_SERVICES_URL + '/monitor/etc/rhsm/rhsm.conf');
  await Rx.Observable.fromEvent(services.RHSMConfig.ws,'open')
    .take(1)
    .map((x) => Rx.Observable.fromEvent(services.RHSMConfig.ws,'message').publish())
    .forEach((x) => { console.log('rhsm monitor service has been connected');
                      services.RHSMConfig.responses = x;
                      services.RHSMConfig.responses.connect();});

  console.log('initializing of a service rhsm executor');
  services.SubscriptionManager.ws = new WebSocket(process.env.RHSM_SERVICES_URL
                                                  + '/execute/usr/bin/subscription-manager');
  await Rx.Observable.fromEvent(services.SubscriptionManager.ws,'open')
    .take(1)
    .map((x) => Rx.Observable.fromEvent(services.SubscriptionManager.ws,'message').publish())
    .forEach((x) => { console.log('rhsm executing service has been connected');
                      services.SubscriptionManager.responses = x;
                      services.SubscriptionManager.responses.connect();});

  console.log('initializing of a service rhsm status');
  services.RHSMStatus.ws = new WebSocket(process.env.RHSM_SERVICES_URL + '/rhsm/status');
  await Rx.Observable.fromEvent(services.RHSMStatus.ws,'open')
    .take(1)
    .map((x) => Rx.Observable.fromEvent(services.RHSMStatus.ws,'message').publish())
    .forEach((x) => { console.log('rhsm status service has been connected');
                      services.RHSMStatus.responses = x;
                      services.RHSMStatus.responses.connect(); });
  return services;
}
module.exports = prepareServices;
