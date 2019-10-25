# Stake Management using CLI

For node operators Oasis node binary offers CLI tooling for various native token
stake operations.

The following commands are available when running **online** Oasis node:
* `oasis-node stake info` shows the native token information,
* `oasis-node stake list` lists all accounts with positive balance,
* `oasis-node stake account info` shows detailed account information,
* `oasis-node stake account submit` submits a pregenerated transaction given the
filename.

In addition the following transaction generation commands can be run offline:
* `oasis-node stake account gen_transfer`
* `oasis-node stake account gen_burn`
* `oasis-node stake account gen_escrow`
* `oasis-node stake account gen_reclaim_escrow`

## Staking basics

We will run the staking operations in a testing environment. To spin the Oasis
network locally, move to your oasis-core folder and run

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

In our case `/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock`
is the path to the internal unix socket we will use to perform staking
operations.

First, let's see what is the native token of our platform:

```bash
$ ./go/oasis-node/oasis-node stake info \
 -a unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock
Name: "Buffycoin"
Symbol: "BUF"
Total supply: 200000000000
Common pool: 0
ts=2019-10-25T10:55:16.808009722Z level=warn module=cmd/stake caller=stake.go:68 msg="failed to query staking threshold(s)" err="rpc error: code = Unknown desc = staking: invalid threshold" attempt=1
```

TODO: Error above should not be there!

TODO: Describe the fields above. Should they be JSON encoded?

To list accounts with positive balance, try:

```bash
$ ./go/oasis-node/oasis-node stake list \
 -a unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock
4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35
```

In our test environment there is one account `4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35`
with positive balance. This is the so called *test entity* account meant for
debugging. Let's get more information about the account:
```bash
$ ./go/oasis-node/oasis-node stake account info \
 --stake.account.id 4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35 \
 -a unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock
{"id":"TqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"100000000000","escrow_balance":"100000000000","nonce":0}
```

`id` stores the Base4 encoded address of the account. `general_balance` is the
number of tokens which can be spent by a transfer transaction signed by the
account's private key. Each account can also serve as an escrow. `escrow_balance`
is the number of tokens this account contains as an escrow and which can be
reclaimed by the depositor. In our environment, both balances have 10^11 tokens.
Any outgoing transaction of the account must have an incremental `nonce`. In our
case, the next outgoing transaction of the account will have `nonce: 0`.

## Example: Burning tokens

We will generate and sign a *burn* transaction which destroys the given number
of account's tokens. To generate a burn transaction of 2000 tokens and store
it to file `b.json`, type:
```bash
$ ./go/oasis-node/oasis-node stake account gen_burn \
 --stake.transaction.amount 2000 \
 --stake.transaction.file b.json \
 --stake.transaction.nonce 0 \
 --debug.test_entity
```

We used the following parameters:
* `--stake.transaction.amount` specifies the number of tokens,
* `--stake.transaction.file` the output filename of the transaction stored in
JSON format,
* `--stake.transaction.nonce` the incremental nonce. Since this is our first
transaction which changes the account balance, `nonce` equals `0`,
* `--debug.test_entity` will sign the transaction using the test entity account.

Alternatively, user can put `--entity` and the directory containing `entity.json`
with a private key used for signing.

TODO: Instructions for signing transactions using HSM once it is implemented.

The generation and signing of the transaction can be done offline. To submit our
transaction however, we need to connect to our local Oasis node as follows:
```bash
./go/oasis-node/oasis-node stake account submit \
 -a unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock \
 --stake.account.id 4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35\
 --stake.transaction.file b.json
```

The submit operation above requires two parameters:
* `--stake.transaction.file` is the input filename of the transaction,
* `--stake.account.id` is the staking account which pays the transaction fee and
serves as an escrow and gets slashed, if malicious transaction is to be
submitted.

TODO: Have I described `stake.account.id` correctly? It has nothing to do witch
actual transaction content, right (burning tokens etc.)?  

Finally, let's check the new balance of the account:

```bash
$ ./go/oasis-node/oasis-node stake account info \
 --stake.account.id 4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35 \
 -a unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock
{"id":"TqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"99999998000","escrow_balance":"100000000000","nonce":0}
```

Notice `2000` tokens have been deducted from the `general_balance`. 

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
 --debug.test_entity
```

We used similar parameters to the ones used for generating the burn transaction:
* `--stake.transaction.amount` is the number of tokens to transfer,
* `--stake.transaction.file` is the output filename,
* `--stake.transaction.nonce` is the incremental nonce. In our case, this is the
second transaction on the account, thus `nonce` equals `1`,
* `--stake.transfer.destination` is a hex-encoded address of the receiving
account of tokens,
* `--debug.test_entity` will sign the transaction using the test entity account.

Let's submit the transaction stored in `t.json`:

```bash
./go/oasis-node/oasis-node stake account submit \
 -a unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock \
 --stake.account.id 4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35\
 --stake.transaction.file t.json
```

Finally let's list all the accounts and their balances by adding `-v` flag for
increased verbosity:
```bash
$ ./go/oasis-node/oasis-node stake list \
 -a unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock
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
 --debug.test_entity
```

Let's submit the escrow transaction and list the accounts:
```bash
$ ./go/oasis-node/oasis-node stake account submit \
 -a unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock \
 --stake.account.id 4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35 \
 --stake.transaction.file e.json
$ ./go/oasis-node/oasis-node stake list \
-a unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock -v
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
 --debug.test_entity
```

Let's submit it and in a few moments list the accounts:
```bash
$ ./go/oasis-node/oasis-node stake account submit \
 -a unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock \
 --stake.account.id 4ea5328f943ef6f66daaed74cb0e99c3b1c45f76307b425003dbc7cb3638ed35 \
 --stake.transaction.file r.json
$ ./go/oasis-node/oasis-node stake list \
 -a unix:/tmp/oasis-net-runner236357163/net-runner/network/client-0/internal.sock -v
{"id":"TqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"99999997000","escrow_balance":"100000000000","nonce":4}
{"id":"XqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"1000","escrow_balance":"0","nonce":0}
{"id":"bqUyj5Q+9vZtqu10yw6Zw7HEX3Ywe0JQA9vHyzY47TU=","general_balance":"0","escrow_balance":"0","nonce":0}
 ```

Notice 3000 tokens have been reclaimed by the first account from the third
account's `escrow_balance`.

TODO: Why is the third account still shown? It does not have a positive balance
anymore?!
