# Sentry node architecture

Sentry node architecture enables protecting validators by not having to expose
validator nodes directly on the public network. This guide assumes a setup where
oasis validator node is only accessible over a private network, with only its
sentry nodes having access to it. The guide does not cover setting this
infrastructure up. Knowledge about tendermint sentry node setup is assumed as
well. TODO: refs to existing tendermint docs, or explain here.

## Configuring the Oasis Sentry Node

### Initializing Sentry node

Sentry node identity keys can be initialized with:

```
$ oasis-node registry node init \
  --entity /localhostdir/entity
```

TODO: we need to use the `registry node init` command which requires `--entity`,
but instead, we should expose the "signer factory" through some CLI command to
enable pre-provisioning identities without any references to entity.

The generated `tls_identity_cert.pem` (which is the node's TLS cert for grpc's
TLS) needs to be available on any nodes that will be running behind the sentry
node.

### Configuration

Oasis-node can be configured to run as a sentry node by setting the
`--worker.sentry.enabled` flag. Additionally, the `--tendermint.private_peer_id`
flag can be used to configure list of tendermint private peers, which should be
set to Tendermint IDs of validator nodes, protected by this sentry node.

An example of full `YAML` configuration of a sentry node:

```yaml
##
# Oasis Sentry Node Configuration
#
# This file's configurations are derived from the command line args found in the
# root command of the oasis-node binary. For more information execute:
#
#     oasis-node --help
#
# Settings on the command line that are separated by a dot all belong to the
# same nested object. So "--foo.bar.baz hello" would translate to:
#
#     foo:
#       bar:
#         baz: hello
##

# Set this to where you wish to store node data. The node artifacts
# should also be located in this directory (for us this is /serverdir/node)
datadir: /serverdir/node

# Logging.
#
# Per-module log levels are defined below. If you prefer just one unified log
# level, you can use:
#
# log:
#   level: debug
log:
  level:
    # Per-module log levels. Longest prefix match will be taken. Fallback to
    # "default", if no match.
    default: debug
    tendermint: warn
    tendermint/context: error
  format: JSON
  # By default logs are output to stdout. If you're running this in docker keep the
  # default
  #file: /var/log/oasis-node.log

# Path to the genesis file for the current version of the network.
genesis:
  file: /serverdir/etc/genesis.json

worker:
  sentry:
    # Enable sentry node.
    enabled: true
    # Port used by validator nodes to query sentry node for registry information.
    # IMPORTANT: Only validator nodes protected by the sentry node should have
    # access to this port. This port should not be exposed on the public network.
    control_port: 9009

# Tendermint backend configuration.
tendermint:
  core:
    listen_address: tcp://0.0.0.0:26656
    external_address: tcp://{{ external_address }}:26656

  seeds: "{{ seed_node_address }}"

  # Sentry node should set validator IDs as private peer IDs.
  private_peer_id:
    - "{{ validator_tendermint_id }}"
```

variables present in the above configuration file:

`{{ validator_tendermint_id }}`

This is the Tendermint ID of the validator node that will be protected by the
sentry node. This ID can be obtained by running:

```
$ oasis-node debug tendermint show-node-id \
--datadir /serverdir/node
```

on the validator node. (TODO: there is probably an easier way to get this out of
our identity files )

`{{ seed_node_address }}`

This is the seed node address in the form `{{ ID }}@{{ IP }}:{{ PORT }}` this is
published [here](./current-testnet-parameters.md)

`{{ external_address }}`

This is the external IP on which sentry node is accessible.

Multiple sentry nodes can be provisioned using following the above steps.

## Configuring the Oasis Validator Node

In this setup the validator should not be exposed directly on the public
network. The validator only needs access to its sentry nodes, preferably via a
private network.

### Initializing a Validator Node

If our validator is already registered and running in a "non-sentry" setup, this
step should be skipped as validator will update it's address in the registry
once we redeploy it with sentry node configuration.

When doing the initial initialization (TODO: link to the docs) of the node, the
external address of the sentry node should be used:
`--node.consensus_address $SENTRY_STATIC_IP:26656`. If we are running multiple
sentry nodes, multiple addresses can be provided by specifying the
`--node.consensus_address` flag multiple times:

```
$ oasis-node registry node init \
  --entity /localhostdir/entity \
  --node.consensus_address $STATIC_IP:26656 \
  --node.consensus_address $STATIC_IP2:26656 \
  --node.is_self_signed \
  --node.role validator
```

(TODO: technically, this actually shouldn't even be needed as the nodes could be
discovered through the seed node, even if it doesn't register a consensus
address - but we currently require setting the consensus address when
registering - and i don't see a good reason for that)

### Configuration

There are some configuration changes needed for the oasis validator node to
enable proxying through its sentry node. Most of these flags should be familiar
from the tendermint sentry node architecture setup (TODO: ref).

Since the validator node behind the sentry does not have an external address,
the `--tendermint.core.external_address` parameter should be skipped. Similarly
the `--tendermint.seed` can be skipped, as the `oasis-node` won't be conecnting
directly to any of the nodes.

Tendermint peer exchange should be disabled on the validator with the
`--tendermint.disable_peer_exchange` flag.

Sentry nodes should be configured as tendermint persistent-peers with the
`--tendermint.persistent_peer` flag.

Additional to the familiar tendermint setup above, the node should be configured
to query sentry nodes for external addresses every time the validator preforms a
re-registration. This is configured with `--worker.sentry.address` and
`--worker.sentry.cert_file` flags. `--worker.sentry.address` should be (the
private) address of the sentry node control endpoint.
`--worker.sentry.cert_file` should be the sentry node client certificate (the
`tls_identity_cert.pem` file) created when provisioning the sentry node.

Putting it all together, an example configuration of a validator node behind a
sentry node would be:

```yaml
##
# Oasis Node Configuration
#
# This file's configurations are derived from the command line args found in the
# root command of the oasis-node binary. For more information execute:
#
#     oasis-node --help
#
# Settings on the command line that are separated by a dot all belong to the
# same nested object. So "--foo.bar.baz hello" would translate to:
#
#     foo:
#       bar:
#         baz: hello
##

# Set this to where you wish to store node data. The node artifacts
# should also be located in this directory (for us this is /serverdir/node)
datadir: /serverdir/node

# Logging.
#
# Per-module log levels are defined below. If you prefer just one unified log
# level, you can use:
#
# log:
#   level: debug
log:
  level:
    # Per-module log levels. Longest prefix match will be taken. Fallback to
    # "default", if no match.
    default: debug
    tendermint: warn
    tendermint/context: error
  format: JSON
  # By default logs are output to stdout. If you're running this in docker keep the
  # default
  #file: /var/log/oasis-node.log

# Path to the genesis file for the current version of the network.
genesis:
  file: /serverdir/etc/genesis.json

# Worker configuration.
worker:
  registration:
    # In order for the node to register itself the entity.json of the entity used to
    # provision the node must be available on the node
    entity: /serverdir/node/entity/entity.json
  sentry:
    address:
      - "{{ sentry_node_private_ip }}:9009"
    cert_file:
      - "{{ sentry_node_ceritificate }}"

# Consensus backend.
consensus:
  # Setting this to true will mean that the node you're deploying will attempt
  # to register as a validator.
  validator: True

# Tendermint backend configuration.
tendermint:
  abci:
    prune:
      strategy: keep_n
      num_kept: 86400
  core:
    listen_address: tcp://0.0.0.0:26656

  persistent_peer:
    - "{{ sentry_node_tendermint_id }}@{{ sentry_node_private_ip }}:26656"

  disable_peer_exchange: True

  db:
    backend: boltdb
  debug:
    addr_book_lenient: False
```

variables present in the above configuration file:

`{{ sentry_node_private_ip }}`

This is the private ip address of the sentry node over which sentry node should
be accessible to the validator.

`{{ sentry_node_ceritificate }}`

Path to sentries gRPC TLS certificate ('tls_identity_cert.pem). This file is
generated when provisioning the sentry node. This certificate needs to be
accessible on any node that's connecting to the sentry controll endpoint.

`{{ sentry_node_tendermint_id }}`

This is the Tendermint ID of the sentry node that will be configured as a
persistent peer. This ID can be obtained by running:

```
$ oasis-node debug tendermint show-node-id \
--datadir /serverdir/node
```

on the sentry node. (TODO: there is probably an easier way to get this out of
our identity files)
