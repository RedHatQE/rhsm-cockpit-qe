const Rx = require('rxjs/Rx');
const ini = require('ini');

function addCommands(browser, services){
  browser.addCommand('getRHSMConfig', () => {
    let service = services.RHSMConfig;
    let response = service.responses
      .map((x) => JSON.parse(x.data))
      .filter(x => x.event === "pong")
      .take(1)
      .map(x => { return {'time': x.time,
                          'content': ini.decode(new Buffer(x.content,'base64').toString('utf8'))}; });
    service.ws.send('ping');
    return response.toPromise();
  });

  browser.addCommand('executeSubscriptionManager', (args) => {
    let service = services.SubscriptionManager;
    let response = service.responses
        .take(1)
        .map((x) => JSON.parse(x.data));
    service.ws.send(args);
    return response.toPromise();
  });

  browser.addCommand('getRHSMStatus', async () => {
    let service = services.RHSMStatus;
    let response = service.responses
        .map((x) => JSON.parse(x.data))
        .take(1)
        .map((x) => x.overallStatus);
    service.ws.send("ping");
    return response.toPromise();
  });

  browser.addCommand('waitForRHSMStatus', async (fn) => {
    let response = services.RHSMStatus.responses
        .map((x) => JSON.parse(x.data))
        .map((x) => x.overallStatus)
        .filter((status) => fn(status))
        .take(1);
    const ticks = Rx.Observable.interval(1000);
    ticks.takeUntil(response)
      .subscribe(() => { console.log("tick");
                         services.RHSMStatus.ws.send("ping");});
    return response.toPromise();
  });

  browser.addCommand('setNOProxyConfig', async (fn) => {
    return browser.executeSubscriptionManager("config --server.proxy_hostname='' --server.proxy_password='' --server.proxy_user='' --server.proxy_port=''");
  });
}

module.exports = addCommands;
