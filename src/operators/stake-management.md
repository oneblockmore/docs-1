# Stake Management in detail using CLI

For node operators Oasis node binary offers command line interface tooling for
various native token stake operations.

The following commands are available for running **online** Oasis node on server:
* `oasis-node stake info` shows the native token information,
* `oasis-node stake list` lists all accounts with positive balance,
* `oasis-node stake account info` shows detailed account information,
* `oasis-node stake account submit` submits a pregenerated transaction given the
filename.

In addition the following transaction generation commands are meant to be run
offline, because signing a transaction requires a private key which **should not
be accessible** from outside in any way:
* `oasis-node stake account gen_transfer`
* `oasis-node stake account gen_burn`
* `oasis-node stake account gen_escrow`
* `oasis-node stake account gen_reclaim_escrow`

## Staking basics

We will run the staking operations in a local testing environment. If you are
already a validator on a testnet, you can skip this step. All required
parameters will be passed directly using CLI, so there is no need for a config
file. To spin up the Oasis network locally, move to your oasis-core folder and
run

```bash
$ ./go/oasis-net-runner/oasis-net-runner \
 --net.node.binary go/oasis-node/oasis-node \
 --net.runtime.binary target/debug/simple-keyvalue \
 --net.runtime.loader target/debug/oasis-core-runtime-loader \
 --net.keymanager.binary target/debug/oasis-core-keymanager-runtime
```

Shortly, three compute nodes, storage nodes and a key manager will start. If you
track the output on the terminal, it should contain a similar line to this:

```bash
level=info module=net-runner caller=root.go:145 ts=2019-10-25T10:54:09.198642162Z msg="client node socket available" path=/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock
```

In our case `unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock`
is the path to the local unix socket of the Oasis node. If you are running a
testnet validator node, a similar `internal.sock` unix socket exists in your
server directory. We will use this address for performing online stake
operations, so let's store it as `ADDR` environmental variable:
```bash
$ export ADDR=unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock
```

First, let's see what is the native token of our platform:

```bash
$ ./go/oasis-node/oasis-node stake info -a $ADDR
Name: "Buffycoin"
Symbol: "BUF"
Total supply: 200000000000
Common pool: 0
Staking threshold (entity): 0
Staking threshold (validator): 0
Staking threshold (compute): 0
Staking threshold (storage): 0
```

There is a native token named `Buffycoin` with symbol `BUF` in our environment
with total supply of 200 billion. All tokens are allocated in their respective
accounts and no tokens are in the *common pool*. Finally we see no staking
thresholds for any node kind (entity, validator, compute, storage).

Let's list all accounts with positive balance:

```bash
$ ./go/oasis-node/oasis-node stake list -a $ADDR
4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35
```

There exists one account `4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35`
with positive balance. In our case, this is the so called *test entity* account
for debugging. Let's get more information about the account:
```bash
$ ./go/oasis-node/oasis-node stake account info \
    --stake.account.id 4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35 \
    -a $ADDR
{"id":"TqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"100000000000","escrow_balance":"100000000000","nonce":0}
```

We notice that:
* `id` stores the Base4 encoded address of the account.
* `general_balance` is the number of tokens which can be spent by a transfer
  transaction signed by the account's private key.
* Each account can also serve as an escrow. `escrow_balance` is the number of
  tokens this account contains as an escrow and which can be reclaimed by the
  depositor. In our environment, both balances have 100 billion tokens.
* Any outgoing transaction of the account must have an incremental `nonce`. In
  our case, the next outgoing transaction of the account will have `nonce: 0`.

## Example: Burning tokens

We will generate and sign our first transaction. Let's start with *burn*
transaction which destroys the given number of account's tokens. To generate a
burn transaction of 2000 tokens, sign and store the transaction to file `b.json`,
type:
```bash
$ ./go/oasis-node/oasis-node stake account gen_burn \
    --stake.transaction.amount 2000 \
    --stake.transaction.file b.json \
    --stake.transaction.nonce 0 \
    --stake.transaction.fee.gas 1000 \
    --stake.transaction.fee.amount 1 \
    --debug.test_entity
```

We used the following parameters:
* `--stake.transaction.amount` specifies the number of tokens,
* `--stake.transaction.file` the output filename of the transaction stored in
JSON format,
* `--stake.transaction.nonce` the incremental nonce. Since this is our first
transaction which changes the account balance, `nonce` equals `0`,
* `--stake.transaction.fee.gas` is the maximum amount of gas we allow this
  transaction to spend,
* `--stake.transaction.fee.amount` is the fee in tokens we will pay for this
  transaction,
* `--debug.test_entity` will sign the transaction using the test entity account.
  If you are running a validator node, you should use `--entity` instead and the
  directory containing `entity.json` with your private key.

The above generation and signing of the transaction is done offline. To submit
our transaction however, we need to connect to our local Oasis node:
```bash
$ ./go/oasis-node/oasis-node stake account submit \
    --stake.account.id 4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35 \
    --stake.transaction.file b.json \
    -a $ADDR
```

The submit operation above requires two parameters:
* `--stake.transaction.file` is the input filename of the transaction,
* `--stake.account.id` is the staking account which pays the transaction fee and
serves as an escrow. This accounts gets slashed, if invalid transaction is
submitted.

Finally, let's check the new balance of the account:

```bash
$ ./go/oasis-node/oasis-node stake account info \
    --stake.account.id 4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35 \
    -a $ADDR
{"id":"TqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"99999998000","escrow_balance":"100000000000","nonce":0}
```

Usually, the new balance is seen immediately, but some transactions (for example
escrow reclaiming) requires a debonding period so you might need to wait a few
blocks for the balances to update. Notice that `2000` tokens have been deducted
from the `general_balance` in our case.  

## Example: Transferring tokens

Token transfer transaction transfers tokens from the signer's account to the
given destination account. Let's generate a transfer transaction of 1000 tokens
to account `5ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35`:
```bash
$ ./go/oasis-node/oasis-node stake account gen_transfer \
 --stake.transaction.amount 1000 \
 --stake.transaction.file t.json \
 --stake.transaction.nonce 1 \
 --stake.transfer.destination 5ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35 \
 --stake.transaction.fee.gas 1000 \
 --stake.transaction.fee.amount 1 \
 --debug.test_entity
```

We used similar parameters to the ones used for generating the burn transaction:
* `--stake.transaction.amount` is the number of tokens to transfer,
* `--stake.transaction.file` is the output filename,
* `--stake.transaction.nonce` is the incremental nonce. In our case, this is the
second transaction on the account, thus `nonce` equals `1`,
* `--stake.transfer.destination` is a hex-encoded address of the receiving
account of tokens,
* `--debug.test_entity`, `--stake.transaction.fee.gas`, and `--stake.transaction.fee.amount`
  behave the same as before.

Let's submit the transaction stored in `t.json`:

```bash
$ ./go/oasis-node/oasis-node stake account submit \
    --stake.account.id 4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35\
    --stake.transaction.file t.json \
    -a $ADDR
```

Finally let's list all the accounts and their balances by adding `-v` flag for
increased verbosity:
```bash
$ ./go/oasis-node/oasis-node stake list -a $ADDR
{"id":"TqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"99999997000","escrow_balance":"100000000000","nonce":2}
{"id":"XqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"1000","escrow_balance":"0","nonce":0}
```

Notice another 1000 tokens have been deducted from the first account and
transferred to the second one.

## Example: Escrowing tokens and reclaiming them

In the third example we will put 3000 tokens to an escrow account
`6ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35` and then
reclaim them. First, let's generate an escrow transaction and store it to `e.json`:

```bash
$ ./go/oasis-node/oasis-node stake account gen_escrow \
 --stake.transaction.amount 3000 \
 --stake.transaction.file e.json \
 --stake.transaction.nonce 2 \
 --stake.escrow.account 6ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35 \
 --stake.transaction.fee.gas 1000 \
 --stake.transaction.fee.amount 1 \
 --debug.test_entity
```

Let's submit the escrow transaction and list the accounts:
```bash
$ ./go/oasis-node/oasis-node stake account submit \
    --stake.account.id 4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35 \
    --stake.transaction.file e.json \
    -a $ADDR
$ ./go/oasis-node/oasis-node stake list -a $ADDR -v
{"id":"TqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"99999994000","escrow_balance":"100000000000","nonce":3}
{"id":"XqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"1000","escrow_balance":"0","nonce":0}
{"id":"bqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"0","escrow_balance":"3000","nonce":0}
```

Notice 3000 tokens have been deducted from the first account's `general_balance`
and added to an `escrow_balance` of the third account.

We reclaim 3000 escrowed tokens by generating the reclaim escrow transaction:
```bash
$ ./go/oasis-node/oasis-node stake account gen_reclaim_escrow \
    --stake.transaction.amount 3000 \
    --stake.transaction.file r.json \
    --stake.transaction.nonce 3 \
    --stake.escrow.account 6ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35 \
    --stake.transaction.fee.gas 1000 \
    --stake.transaction.fee.amount 1 \
    --debug.test_entity
```

Let's submit it and in a few moments list the accounts:
```bash
$ ./go/oasis-node/oasis-node stake account submit \
    --stake.account.id 4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35 \
    --stake.transaction.file r.json \
    -a $ADDR
$ ./go/oasis-node/oasis-node stake list -a $ADDR -v
{"id":"TqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"99999997000","escrow_balance":"100000000000","nonce":4}
{"id":"XqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"1000","escrow_balance":"0","nonce":0}
{"id":"bqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"0","escrow_balance":"0","nonce":0}
 ```

Notice 3000 tokens have been reclaimed by the first account from the third
account's `escrow_balance`. The `general_balance` of the first accound is
correctly updated and the `escrow_balance` of the third account is now empty.
