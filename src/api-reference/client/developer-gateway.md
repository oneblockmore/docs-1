# oasis.gateways.Gateway

``oasis.gateways.Gateway`` provides an implementation of ``OasisGateway`` that communicates with a developer-gateway.

It currently only supports HTTP.

## constructor

```javascript
new oasis.gateways.Gateway(url, httpHeaders);
```

### Parameters

1. ``url`` - ``String``: The url of the gateway.
2. `apiToken` - `String`: Api token created by the [dashboard](https://dashboard.oasiscloud.io/login).
2. ``httpHeaders`` - ``Object``: The http headers to use for authentiication with the gateway.
For example, `{ headers: new Map([['X-OASIS-INSECURE-AUTH', 'VALUE']]) }`.

::: warning
The ``oasis.gateways.Gateway`` server is not yet readily availiable in public Oasis infrastructure.
For now, it's recommended to use ``oasis.gateways.Web3Gateway``.
:::
