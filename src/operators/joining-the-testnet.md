# Joining the Testnet

This guide will cover setting up your nodes on the Public Testnet. There is some
assumption of knowledge on the use of basic command line tools and docker.

## Prerequisites

Before following this guide, make sure you've followed the [Prerequisites
Guide](./prerequisites.md) and understand how to use the `oasis-node` binary.

### Systems

This guide assumes that you have two different physical machines that you will
use for deployment. These machines are the following:

* Your local system, henceforth called the `localhost`.
* A remote system to run as an Oasis node, henceforth called the `server`.

The reason for this is to ensure protection of the keys used to
setup your node. This guide does not include the use of HSMs, but
should be used in the future.

## Creating Your Entity

Everything in this section should be done on the `localhost` as there are
sensitive items that will be created.

### Creating a Working Directory

During this entity initialization process, we will create keys and other
important artifacts that are necessary for the deployment of nodes on the
network. It is important that you save and protect the generated artifacts in
this directory if you intend to use them to register your entity and nodes. We
will reference the working directory on `localhost` as `/localhostdir`
throughout the documentation. Inside `/localhostdir` you should create the
following directories:

* `entity` - This will store your entity. The private contents in this directory
  are safest if used on a machine kept disconnected from the internet. The
  directory permissions should be `rwx------`
* `node1` - This will store a node we are calling "node1". The name is not
  important. It simply represents one of your nodes. You can rename it to whatever you
  wish. The private contents of this directory will be used on the node itself.
  You should initialize this information on a system with access to the entity's
  private key. The directory permissions should be `rwx------`

To create the directory structure, use the following command:

```bash
$ mkdir -m700 -p {entity,node}
```

### Copying the Genesis File

The latest genesis file can be found [here](./current-testnet-parameters.md).
You should download the latest `genesis.json` file, copy it to the working
directory and save its path into an environment variable:
```bash
$ export GENESIS_FILE_PATH=/localhostdir/genesis.json
```

This will be needed later when generating transactions.

### Initializing an Entity

The entity, as [described
here](../architectural-overview.md#entities-and-key-management) is critical to
operating nodes on the network as it controls the stake attached to a given
individual or organization on the network. In the future we will support using
entity keys through HSMs to ensure that entity keys cannot be easily
compromised. We strongly suggest that you do not use any entity that is generated
with the current process on the Mainnet. During the Public Testnet and staking
competition we would also suggest that you generate the entity on a system that has
no network connection to provide rudimentary protection for the entity key.
However, it is up to you to determine your own security practices.

To initialize an entity simply run the following from `/localhostdir/entity`:

```
$ oasis-node registry entity init
```

This will generate 3 files in `/localhostdir/entity`

* `entity.pem` - The private key of the entity. **NEVER SHARE THIS AS IT CAN BE
  USED TO TRANSFER STAKE**
* `entity.json` - The entity descriptor. This is the JSON of the unsigned
  information to be sent to the registry application on the network.
* `entity_genesis.json`- This JSON object contains the entity descriptor that
  has been signed with the the `entity.pem`. This is meant to be shared for
  inclusion on the genesis block.

### Initializing a Node

A node registers itself to the network when the node starts up. However, in
order to validate itself, the entity signs a public key associated to the
node. This allows the node registration to happen without the uploading entity key
to the internet. To initialize a validator node, run the following from
the `/localhostdir/node1` directory.

```bash
$ export STATIC_IP=<YOUR_STATIC_IP>
$ oasis-node registry node init \
  --entity /localhostdir/entity \
  --node.consensus_address $STATIC_IP:26656 \
  --node.is_self_signed \
  --node.role validator
```

This command will create a validator node's identity so that it can be a
self-signed node (this is what allows self registration). There are more options
for this that you can explore by running `oasis-node registry node init --help`.
The options shown above are the minimum.

The command will generate the following files:

* `consensus.pem` - The node's private key used for consensus. **DO NOT SHARE**
* `consensus_pub.pem` - The node's public key for consensus
* `identity.pem` - The node's identity private key. **DO NOT SHARE**
* `identity_pub.pem` - The node's identity public key.
* `node_genesis.json` - The node's details if you wish to include this node on
  the genesis file of the network.
* `p2p.pem` - The node's private key for libp2p. **DO NOT SHARE**
* `p2p_pub.pem` - The node's public key for libp2p.
* `tls_identity.pem` - The node's TLS key for grpc's TLS . **DO NOT SHARE**
* `tls_identity_cert.pem` - The node's TLS cert for grpc's TLS.

#### Adding the Node to the Entity Descriptor

Once the node has been initialized, we need to add it to the entity descriptor
so that it can properly register itself when the node starts up.

Execute the following command in the `/localhostdir/node1` directory:

```
$ oasis-node registry entity update \
  --datadir /localhostdir/entity \
  --entity.node.descriptor node_genesis.json
```

This will update the entity descriptor `entity.json` and subsequently the
`entity_genesis.json` file that contains the signed entity descriptor payload.

#### Initializing Additional Nodes

At the time of Public Testnet, the network will only have validators and no
other committees (no compute, no key management, no storage, etc.). At this time
this documentation does not include instructions in configuring anything beyond
a single validator. If you'd like to create more validator nodes you can simply
repeat the process above to initialize the artifacts for an additional node (and
renaming the proper things). Each node will require at least the network's
defined minimum staking amount (at this time this is 100 tokens).

## Running an Oasis Node on the `server`

### Setting up the Oasis Node's Working Directory

Before we run the node on the `server` we need to ensure that we have a place to
store necessary files for the node. For this guide, we will call this working
directory `/serverdir` directory.

#### Setting up the the `/serverdir` Directory

In the `/serverdir` directory we will create the following subdirectories:

* `etc/` - this is to store the configuration
* `node/` - this is to store the node's data
* `node/entity/` - this is to store the public components of the node's entity

You can make this directory structure by calling the following command:

```bash
$ mkdir -p /serverdir/{etc,node/entity}
```

#### Copying the Node Artifacts from `/localhostdir`

In order for the node registration to work properly, as defined in
`/localhostdir/entity.json`, you must copy the node's artifacts you generated in
the [Initializing a Node](#initializing-a-node) section. To do so upload the
following files from `/localhostdir/node1` to `/serverdir/node` over a secure channel:

* `consensus.pem`
* `consensus_pub.pem`
* `identity.pem`
* `identity_pub.pem`
* `node_genesis.json`
* `p2p.pem`
* `p2p_pub.pem`
* `tls_identity.pem`
* `tls_identity_cert.pem`

_You may notice that some of these files were listed as **DO NOT SHARE**. In the
future these keys should be generated and referenced from HSM. Before we have
HSM support, these keys should be kept as secure as possible on the `server`.

#### Copying the Public Entity Artifacts from `/localhostdir`

We will also need to have public entity artifacts from the `/localhostdir`. Copy
the file from `/localhostdir/entity/entity.json` to
`/serverdir/node/entity/entity.json`.

#### Copying the Genesis Files

The latest genesis files can be found [here](./current-testnet-parameters.md).
You should download the latest `genesis.json` file and copy it to
`/serverdir/etc/genesis.json`.

#### Configuring the Oasis Node

There are a variety of options available when running an Oasis node. The
following YAML file is a basic configuration for a validator node on the
network.

Before using this configuration you should collect the following information to
replace the
::: v-pre
`{{ var }}`
:::

variables present in the configuration file:

::: v-pre
`{{ external_address }}`
:::

This is the external IP you wish to use when
  registering this node. If you are using a Sentry Node, you should use the
  public IP of that machine.

::: v-pre
`{{ seed_node_address }}`
:::

This the seed node address in the form
::: v-pre
`{{ ID }}@{{ IP }}:{{ PORT }}`
:::
this is published [here](./current-testnet-parameters.md)

Create a file, `/serverdir/etc/config.yml`, with the following
contents:

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

## THESE NEXT 3 LINES ARE TEMPORARY YOU SHOULD NOT EXPOSE THIS PORT IN ANY WAY
grpc:
  debug:
    port: "42261"

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

    # The external_address option is used when registering this node to the
    # network. If you are using a sentry node then this should be the public
    # ip of the sentry node.
    external_address: tcp://{{ external_address }}:26656

  db:
    backend: boltdb
  debug:
    addr_book_lenient: False
  seeds: "{{ seed_node_address }}"
```

### Starting the Oasis Node

#### Starting with docker

For those of you who are relying on the
[oasis-node](https://hub.docker.com/r/oasislabs/oasis-node) docker container,
the command to start the oasis-node is:

```bash
$ docker run --entrypoint /oasis/bin/oasis-node \
    --name oasis_node \
    --volume /serverdir:/serverdir \
    --workdir /serverdir/node \
    -p 26656:26656 \
    -p 42261:42261 \
    oasislabs/oasis-node:$OASIS_NODE_TAG \
    --config /servernode/etc/config.yml
```

_Note: the `-p 42261:42261` port binding is temporary. We will notify all of you
when this no longer needs to be bound._

This will create a docker container named `oasis_node`. This is useful to have a
named container so it can be referenced later. If you name it something else,
then be aware that the docs will reference `oasis_node` for this docker
container.

_It is up to you to configure these options how you see fit. This invocation of
the server process will not restart automatically. If you'd like to run this in
the background add the docker flag `--detach`_

#### Starting without docker

If you have built the `oasis-node` binary on your own, you can start the server
by running the command below. Please note, the node is, by default, configured to run in the
foreground. You will need to use a process supervisor like
[supervisord](http://supervisord.org/),
[systemd](https://github.com/systemd/systemd), etc.

```
$ oasis-node --config /serverdir/etc/config.yml
```

### Verifying the Connection to the Network

As part of the starting the server process, the `oasis-node` binary will, by
default, setup an internal unix socket in the `datadir` of the Node. This socket
can be used to communicate to the node and query details about the network.

```bash
$ oasis-node registry entity list -a /serverdir/node/internal.sock
```

If this command fails, you'll receive a non-zero exit code and there's a high
likelihood that you are not connected to the network. However, if it does work
properly it should respond with output like:

```
2317a8eef10e470434411aebac8f1a8c0f1c6a0d35ff53921f8bc70588bb66b2
8e3873f84f7f2250eb456dc598dc56b812f561137fe41c383128e6c14e0e2e74
cf3b004bd98f3e1eab92e97c5fa6cbe4d42a00133c515a2440fefaca514a48ff
```

Once you get to a node that's connected you can move on to the next section as
your node is not yet registered as a validator on the Oasis Testnet.

## Signing up for Testnet Tokens

_This won't be necessary if you are in the genesis file or already have tokens
through some other means. For most people, this will not be true._

In order to participate on the Testnet you'll need to have tokens. You'll use
these tokens to register your entity and stake on the network. To get tokens,
you'll need to sign up with [this
form](https://oasisfoundation.typeform.com/to/dlcekq). While filling out the
form, it will ask for your Entity Public Key. This is the same as your Entity
Account ID and can be found in the `/localhostdir/entity/entity.json`. In this
JSON file, the Entity Public Key is the `id` field.

### Example

In the following example `entity.json`, the Entity Public Key is
`TszGIrC1X08czcik0DgAnmGPzjf8pfQ47bgrjpTmbro=`.

```json
{
  "id": "TszGIrC1X08czcik0DgAnmGPzjf8pfQ47bgrjpTmbro=",
  "nodes": [
    "C93lKVNNkca3Oo9m1exiz22NvMBxxYjkyBrt2+eFAds="
  ],
  "registration_time": 1573585972,
  "allow_entity_signed_nodes": false
}
```

## Staking and Registering

_This won't be necessary if your Entity is in the genesis file._

Once you have been funded, you can now complete the process of connecting your
node by staking so that you can register your entity and register your node.

### Generating a Staking (Escrow) Transaction on the `localhost`

Your Entity private key should ideally be disconnected from the internet on the
`localhost`. You want this because the Entity private key is used to authorize
transactions on your staking account. To ensure that the Entity private key
isn't sent to the `server` we will generate a transaction on the `localhost`.
The staking application calls "staking" an escrow. For the testnet, the current
minimum stake required to register an entity and register a node as a validator
is 100 tokens. So we will generate an escrow transaction that escrows 100 tokens
on your own Entity.

```
$ oasis-node stake account gen_escrow \
    --genesis.file $GENESIS_FILE_PATH \
    --entity $ENTITY_DIR_PATH \
    --stake.escrow.account $ACCOUNT_ID \
    --stake.transaction.amount 100000000000000000000 \
    --stake.transaction.file $OUTPUT_TX_FILE_PATH \
    --stake.transaction.nonce 0
```

The parameters are as follows:

* `$ENTITY_DIR_PATH` - For this guide this would be `/localhostdir/entity/`
* `$OUTPUT_TX_FILE_PATH` - This is where you wish to output the signed
  transaction file. For this guide we will use `/localhostdir/signed-escrow.tx`
* `$ACCOUNT_ID` - This is the hex encoding of the Entity Public Key. To derive this you
  can use the following python3 code:

  ```
  import binascii, base64

  def account_id_from_b64(base64_id):
      """base64_id can be found in entity.json in the `id` field"""
      return binascii.hexlify(base64.b64decode(base64_id))

  account_id_from_b64("<YOUR ENTITY PUBLIC KEY>")
  >>> "deadbeefdeadbeefdeadbeef..."
  ```

Note that the option `--stake.transaction.amount` looks like a very large
number. This is actually equivalent to 100 tokens on the Testnet as each unit
value used to track the account balance is 1x10^-18 tokens.

### Submitting Your Transaction on the `server`

To complete the staking process we need to submit your escrow transaction:

1. Copy the file `/localhostdir/signed-escrow.tx` on the `localhost` to
   `/serverdir/signed-escrow.tx` on the `server`.
2. Call `oasis-node` like so:

  If you're using docker use:

  ```
  $ docker exec -it oasis_node /bin/bash
  $ oasis-node stake account submit \
    --stake.transaction.file /serverdir/signed-escrow.tx \
    -a /serverdir/node/internal.sock
  ```

  Without docker:
  
  ```
  $ oasis-node stake account submit \
    --stake.transaction.file /serverdir/signed-escrow.tx \
    -a /serverdir/node/internal.sock
  ```

### Registering Your Entity

As a final step, you now need to register your entity onto the network.

**TEMPORARY FIX**: At this time many of these instructions are a temporary fix
due to missing features on the current `oasis-node` cli.

#### Port Forwarding

On one instance of a terminal on the `localhost` execute the following to handle
a port forwarding so you can make entity requests. _Unfortunately, if you're
using docker on your `localhost` you will also have to ssh to your `server`
within your the docker container. We apologize for the inconvenience this is a
temporary measure._

```
$ ssh $USER@$SERVER_IP -L 42261:127.0.0.1:42261 -N
```

#### Registering Your Node on the Network

On a different terminal from your ssh port forward above, execute the following:

```
$ oasis-node registry entity register --datadir /localhostdir/entity
```

If everything is successful you will get a zero exit code.

### Checking that Your Node is Properly Registered

_We understand these instructions for verification need to improve. Any
assistance is welcome ;)_

To ensure that your node is properly connected as a Validator on the network, We
can check to see the node's identity on in the registry's node list.
Unfortunately, at this time this is a bit of a manual process.

### Getting the Node's consensus_pub.pem Identity

```
cat /serverdir/node/consensus_pub.pem
```

This will look like:

```
-----BEGIN ED25519 PUBLIC KEY-----
s+vZ71qeZnlq0HmQSDBiWn2OKcy3fXOuPMu76/5GkUI=
-----END ED25519 PUBLIC KEY-----
```

We will use `s+vZ71qeZnlq0HmQSDBiWn2OKcy3fXOuPMu76/5GkUI=`. As the key to search for.

### grepping for the Node's Identity

Finally to see if the node is properly registered, run the command (you may need
to be in a docker container if you are using that):

```
$ export NODE_PUB_KEY="s+vZ71qeZnlq0HmQSDBiWn2OKcy3fXOuPMu76/5GkUI="
$ oasis-node registry node list -v -a /serverdir/node/internal.sock | grep $NODE_PUB_KEY
```

If `grep` found the key, then you're properly connected!

## You're a Validator!

If you've made it this far you've properly connected your node to the network
and you're now a Validator on the Public Testnet.

### Maintenance Guides

* [Wiping Node State](./maintenance/wiping-node-state.md)
