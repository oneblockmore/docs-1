# disconnect

The ``oasis.disconnect`` method disconnects the client from the default [OasisGateway](./gateways#OasisGateway), set via [oasis.setGateway](./set-gateway).
When using websockets, this method should be called to clean up any outstanding connections, e.g., when testing.

```
oasis.disconnect()
```
