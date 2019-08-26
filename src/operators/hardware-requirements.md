# Node Hardware Requirements

_The hardware requirements listed on this page are recommended minimum
configurations. It might be possible to configure a system with less resources,
but you run the risk of being underprovisioned and thereby prone to loss of
stake._

## Minimum System Requirements

As noted in the [Architectural Overview](./architectural-overview.md), the Oasis
Network is composed of multiple classes of Nodes that perform specific
functions. The majority of Node classes have common system requirements. All
node types should support the following minimum requirements:

* 2.0 GHz x86-64
  * Must have AES-NI support
* 4 GB ECC RAM
* 500GB High Speed Storage

### Node Class Additional Requirements

Beyond the common system requirements, the following section details
additional requirements for operating the different Node classes.

#### Confidential Compute Layer Nodes

As part of supporting confidential smart contracts in the future, the Oasis
Network will utilize SGX in order to ensure privacy preserving computation. At
this time, supporting SGX hardware is optional for Node Operators. However, for
Node Operators who want to be to prepared for the eventual release of the
confidential runtime, the following requirements should be met:

* CPU supports SGXv1 Support
* BIOS supports enabling SGX
* EPC limits should be set to the maximum 128MB

#### Storage Nodes

At this time, the growth rate of state stored on storage nodes is unknown. Node
operators should expect the minimum recommendations for storage to change over
time.

Recommended Minimum Configuration:

* 2TB High Speed Storage

#### Key Management Nodes

At this time, Key Management Nodes will only be operated by Oasis. However
system requirements for the Key Manager nodes are currently identical to the
confidential compute worker nodes.

### HSMs

It is critical that the Node Keys used to sign actions taken by Nodes are
protected from loss. The economic model has yet to be completed, but it is
expected that slashing from double signing will incur a heavy penalty. The HSM
needs to support the Ed25519 signing scheme.
