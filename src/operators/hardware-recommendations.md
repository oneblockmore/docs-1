# Node Hardware Recommendations

_The hardware configurations listed on this page are recommended minimum
configurations. It might be possible to configure a system with less resources,
but you run the risk of being underprovisioned and thereby prone to loss of
stake._

## Suggested Minimum Configurations

As noted in the [Architectural Overview](./architectural-overview.md), the Oasis
Network is composed of multiple classes of Nodes that participate in different
committees. The majority of committees have common system configurations for the
participant Nodes. We suggest the following minimum recommendations:

* 2.0 GHz x86-64
  * Must have AES-NI support
* 2 GB ECC RAM
* 500GB High Speed Storage

### Additional Attributes By Committee

Beyond the common system configurations, the following section details
additional requirements or recommendations for operating Nodes to participate in
different committees.

#### Confidential Compute Committee Nodes

As part of supporting confidential smart contracts in the future, the Oasis
Network will utilize SGX in order to ensure privacy preserving computation. At
this time, supporting SGX hardware is optional for Node Operators. However, for
Node Operators who want to be to prepared for the eventual release of the
confidential runtime, the network will require at least the following hardware:

* CPU supports SGXv1 Support
* BIOS supports enabling SGX
* EPC limits should be set to the maximum 128MB
  * Setting this value to the maximum is recommended but is not required.

#### Storage Committee Nodes

At this time, the growth rate of state stored on storage nodes is unknown. We
suggest that Node Operators configure their systems with the following
hardware in order to handle storage growth over time:

* 2TB High Speed Storage

#### Key Manager Committee Nodes

At this time, Key Management Nodes will only be operated by Oasis. However
system requirements for the Key Manager nodes are currently identical to the
Confidential Compute Committee nodes.

### HSMs

It is critical that the Node Keys used to sign actions taken by Nodes are
protected from loss. The economic model has yet to be completed, but it is
expected that slashing from double signing will incur a heavy penalty. The HSM
needs to support the Ed25519 signing scheme.
