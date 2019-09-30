# oasis.setGateway

The `oasis.setGateway` function configures the client so that all service communication is done through the given [OasisGateway](./gateways#OasisGateway).
This method should be called before interacting with any services.

```javascript
oasis.setGateway(gateway)
```

### Parameters
1. `gateway` - [OasisGateway](./gateways#OasisGateway): The gateway to facilitate all service communications.
