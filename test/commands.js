const Rx = require('rxjs/Rx');
const ini = require('ini');

function addCommands(browser, services){
  browser.addCommand('getRHSMConfig', () => {
    let service = services.RHSMConfig;
    let response = service.responses
        .map((x) => {console.log('got a response from RHSMConfig'); return x;})
        .map((x) => JSON.parse(x.data))
        .filter(x => x.event === "pong")
        .take(1)
        .map(x => { return {'time': x.time,
                            'content': ini.decode(new Buffer(x.content,'base64').toString('utf8'))}; });
    console.log('ask for getRHSMConfig');
    service.ws.send('ping');
    return response.toPromise();
  });

  browser.addCommand('executeSubscriptionManager', (args) => {
    let service = services.SubscriptionManager;
    let response = service.responses
        .map((x) => {console.log('got a reponse from executeSubscriptionManager'); return x;})
        .take(1)
        .map((x) => JSON.parse(x.data));
    console.log('ask for executeSubscriptionManager',args);
    service.ws.send(args);
    return response.toPromise();
  });

  browser.addCommand('getRHSMStatus', async () => {
    let service = services.RHSMStatus;
    let response = service.responses
        .map((x) => {console.log('got a response from getRHSMStatus'); return x;})
        .map((x) => JSON.parse(x.data))
        .take(1)
        .map((x) => x.overallStatus);
    console.log('ask for getRHSMStatus');
    service.ws.send("ping");
    return response.toPromise();
  });

  browser.addCommand('waitForRHSMStatus', async (fn) => {
    let response = services.RHSMStatus.responses
        .map((x) => {console.log('got a response from waitForRHSMStatus'); return x;})
        .map((x) => JSON.parse(x.data))
        .map((x) => x.overallStatus)
        .filter((status) => fn(status))
        .take(1);
    // const ticks = Rx.Observable.interval(5000);
    // ticks.takeUntil(response)
    //   .subscribe(() => { console.log("ask for getRHSMStatus");
    //                      services.RHSMStatus.ws.send("ping");});

    // once a service (actually the binary subscription-manager ends) returns a status, ask for next one
    services.RHSMStatus.responses.takeUntil(response).subscribe(() => {
      console.log('ask for getRHSMStatus');
      services.RHSMStatus.ws.send("ping");
    });
    services.RHSMStatus.ws.send("ping");
    return response.timeout(15000).toPromise();
  });

  browser.addCommand('setNoProxyConfig', async (fn) => {
    return browser.executeSubscriptionManager("config --server.proxy_hostname='' --server.proxy_password='' --server.proxy_user='' --server.proxy_port=''");
  });
}

module.exports = addCommands;
