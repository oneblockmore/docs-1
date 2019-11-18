# Troubleshooting

## oasis-core Binary

### Building from Source: Go Errors

First, make sure you have go version >=go1.13.0 and protocol buffers installed (use `brew install protobuf` on Mac).

Error message example:
```
PWD: /home/oasis/oasis-core/go/grpc
CMD: [protoc -I ./ --go_out=plugins=grpc,paths=source_relative:. common/common.proto]
protoc-gen-go: program not found or is not executable
--go_out: protoc-gen-go: Plugin failed with status code 1.
FAILED: exit status 1
exit status 1
grpc/generate.go:3: running "go": exit status 1
```
Resolve this error by ensuring you have `protoc-gen-go` installed and adding `$GOPATH/bin` to your path:
Check installation:
```bash
which protoc-gen-go
```
Install:
```bash
go get github.com/golang/protobuf/protoc-gen-go
```
Add to your path variable:
```bash
export PATH=$PATH:$GOPATH/bin
```

If you don't see a helpful error message while building, scroll up to see if any additional information was provided.

### Building from Source: Rust Errors

Error message example:
```
error[E0412]: cannot find type `ucontext_t` in this scope
```

Error messages from `rustc` can be ignored; all you need from `oasis-core` are the `go` components. In general, avoid trying to build the rust components.
You can use the following command to stick to go:
```bash
make go
```

## Running a Node

### Invalid Permissions

#### Permissions for node and entity
Error Message:
```
common/Mkdir: path '/serverdir/node' has invalid permissions: -rwxr-xr-x
```
The `entity` and `node` directories in your `serverdir` diretory both need to have permissions `rwx------` in order to deploy the node.
Make sure you initialize the directory with correct permissions or change them using `chmod`:
```bash
mkdir -m700 -p {entity,node}
```
```bash
chmod 700 /serverdir/node
chmod 700 /serverdir/entity
```

#### Permissions for .pem files
Error Message example:
```
signature/signer/file: invalid PEM file permissions 700 on /serverdir/node/identity.pem
```
All `.pem` files should have the permissions `600`.
You can set the permissions for all `.pem` files in a directory using the following command:
```bash
chmod -R 600 /path/*.pem
```

#### Docker host ownership

Another possible cause of permission issues is not giving ownership of your `serverdir` to the docker host:

```bash
chown -R docker-host:docker-host /serverdir
```
### Cannot Find File

Error Message examples:

`no such file or directory`

`file does not exist`
```
ts=2019-11-17T03:42:09.778647033Z level=error module=cmd/registry/node caller=node.go:127 msg="failed to load entity" err="file does not exist"
```

More often than you'd expect, this error is the result of setting the path incorrectly.
You may have left something like ` --genesis.file $GENESIS_FILE_PATH` in the command without setting `$GENESIS_FILE_PATH` first, or set the path incorrectly.
Check that `echo $GENESIS_FILE_PATH` matches your expectation or provide a path in the command.

Another possible cause: the files in your localhost directory cannot be read from the container. Make sure to run commands in the same session within the container.

## Staking and Registering

### Transaction Out of Gas

Error message:
```
module=cmd/stake caller=stake.go:70 msg="failed to submit transaction" err="rpc error: code = Unknown desc = staking: add escrow transaction failed: out of gas" attempt=1
```
The docs are now updated to show that you need to add `--stake.transaction.fee.gas` and `--stake.transaction.fee.amount` flags when generating your transaction. Note that if you're re-generating a transaction, you will need to increment the `--nonce` flag.

### SSH Tunnel

Error message from trying to create ssh tunnel from localhost's docker:
```
bind: Cannot assign requested address
```
Error was fixed by making the `oasis-node` binary from source instead of using the docker image.
