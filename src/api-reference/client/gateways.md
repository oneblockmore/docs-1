# oasis.gateways

## namespace

The ``oasis.gateways`` namespace provides objects implementing the ``OasisGateway`` interface, defining the client's backend used to send transactions to the Oasis network.
It should be rare to need to directly implementthis interface.
However, the definition is provided for those who'd like to implement it.

## OasisGateway

The **OasisGateway interface** is defined with the following TypeScript [source](https://github.com/oasislabs/oasis.js/blob/master/packages/service/src/oasis-gateway.ts).

In most cases, you should use one of the following two impementations: [Gateway](./developer-gateway) or [Web3Gateway](./web3-gateway).
