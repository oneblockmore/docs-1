# Wiping Node State

In some cases you might want (or need) to do a full redeploy with clean state
before deploying a new version of the network. This should never actually be
used during a Mainnet unless there is some serious corruption, but your node
will have to spend time catching up to the rest of the network.

The following instructions assume that your `datadir` is defined as
`/serverdir/node` in your node's config.

## State Wipe and Keep Node Identity

1. Stop the `oasis-node` server process (this will depend on your own deployment
   setup)
2. Remove blockchain state

    ```bash
    $ rm -rf /serverdir/node/tendermint
    $ rm -rf /serverdir/node/bleve-tag-index.bleve.db
    $ rm /serverdir/node/abci-mux-state.bolt.db
    ```

3. Restart the oasis-node server process

## Full State Wipe

A full state wipe will also mean that you'll need to generate a new node
identity (or copy the old one). This is likely not what you want.

1. Stop the `oasis-node` server process (this will depend on your own deployment
   setup)
2. Remove the the `/serverdir/node` directory.
3. Redeploy your node. You'll need to copy your Node artifacts or create brand
   new ones.
