# Prerequisites Guide

## Installing/Using oasis-node

Any time the `oasis-node` binary is referenced, we are refering to the binary
that is created from the [oasis-core](https://github.com/oasislabs/oasis-core)
repository's `go/` path. This binary contains both the logic for running a
validator node and also provides a CLI for handling registry and staking
operations.

### Building from source

Although highly suggested, building from source is currently beyond the scope of
the documentation. See [oasis-core](https://github.com/oasislabs/oasis-core) for
details.

As the release management of our open source repositories improves, we will
provide further details to so that building a specific version can be done in a
coordinated way across the network.

### Using inside docker

For those that wish to use the Oasis provided docker container, the `oasis-node`
binary can be accessed by running inside the context of a the
[oasis-node](https://hub.docker.com/r/oasislabs/oasis-node) docker container.

You will need to have docker v18.x.y installed. Once you have docker, you can
execute inside the docker container by using the following:

```
$ docker run -it --rm \
   --entrypoint /bin/bash \
   --volume $(pwd):/workdir \
   --workdir /workdir \
    oasislabs/oasis-node:$VERSION
$ oasis-node --help
```

This invocation will set `/workdir` in the docker container to the current
working directory of the host. It is up to you to set this working directory
correctly. If there are any strange errors, this is a common source of problems.

While the `latest` tag is available with the `oasis-node`, we suggest currently
using one of the `master-YYYYMMDDHHMMSS` tags so that your node doesn't drift.
Also, when deploying nodes on the testnet Oasis will publish the correct version
of the node to use on [this documentation](./current-testnet-parameters.md).
