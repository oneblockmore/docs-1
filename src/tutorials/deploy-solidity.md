# Deploying Solidity Contracts on Oasis (Compound)

[Compound Money Market](https://github.com/compound-finance/compound-money-market) is a lending market built on Ethereum. Here, it is configured for deployment on Oasis.
This tutorial's methods for deploying Solidity contracts using Truffle and Web3.js are applicable to any Ethereum contract written in Solidity.
For contracts written in Vyper, see the [Uniswap tutorial](./deploy-vyper.md).

If you want to deploy the contracts for yourself, a copy of the Compound Money Market contracts along with a `truffle.js` file and sample deployment through `Web3` can be found [here](https://github.com/oasislabs/compound).

## Prerequisites

This tutorial assumes that you have [already installed the Oasis toolchain](https://docs.oasis.dev/quickstart.html#install-the-oasis-toolchain). Your installation was successful if the following command works without error:

```bash
oasis --version
```

Using the Oasis toolchain, you can run a local blockchain server, just like you can with [`truffle develop`](https://www.trufflesuite.com/docs/truffle/getting-started/using-truffle-develop-and-the-console) or [Ganache](https://github.com/trufflesuite/ganache-cli), as follows:

```bash
oasis chain
```

This command will spawn a local network with 10 accounts (private keys and public addresses) each funded with 100 DEV (Oasis' equivalent of ether). The output will look something like this:

```bash
2019-09-27 10:54:21,448 INFO  [oasis_chain] Starting Oasis local chain
Accounts (100 DEV each)
==================
(0) 0xb8b3666d8fea887d97ab54f571b8e5020c5c8b58
(1) 0xff8c7955506c8f6ae9df7efbc3a26cc9105e1797
(2) 0x0056b9346d9a64dcdd9d7be4ee3f5cf65940167d
(3) 0x4bbbf0653dab1e8abbe603fe3c4300032ff9224e
(4) 0xb99e5a84415e4bf715efd8a390344d7121015920
(5) 0xfa5c64dbcc09bdceaea11ca1f413c40031fa4412
(6) 0x17ef28e540a7cf63a8cbfd533cbbec530eac356f
(7) 0x223b7e8dda3afeb788259de0bc7bf157c8e18888
(8) 0x5e66f3176cb59205d4897509a11d117ed855502e
(9) 0x07b23940821ea777b9a26e3c8dc3027648236bbf
Private Keys
==================
(0) 0xb5144c6bda090723de712e52b92b4c758d78348ddce9aa80ca8ef51125bfb308
(1) 0x7ec6102f6a2786c03b3daf6ac4772491f33925902326a0d2d83521b964a87402
(2) 0x069f89ed3070c73586672b4d64f08dcc0f91d65dbdd201b27d5949a437035e4a
(3) 0x142b968d9b046c5545ed5d0c97c2f4b89c0ed78e19ec600d2ea8c703231d13f4
(4) 0x1a8722ce2d1f296e73a8a0de6ffecea349197188feb32e949f95f0f5d404db5d
(5) 0xf47bf050ec19b8573b32fda50436526e8c3f5b1c7f260bbdb55d4ca39585d78d
(6) 0x2424da82ad906f131674f05f207af85e7f6046fd9e0b6a4d4f37414c4933ab09
(7) 0x133e548822a035a5db2a43a091146db96f10a5c680d2114145493b921df1b19e
(8) 0xb67377abfa1a229ba56826661736ceca99d2b0be055e84498c7b0847431e4d9d
(9) 0xa08930847a93d725a62f6866afac2642eaebb4d0410610822833b0474871b7b8
HD Wallet
==================
Mnemonic:      range drive remove bleak mule satisfy mandate east lion minimum unfold ready
Base HD Path:  m/44'/60'/0'/0/{account_index}
2019-09-27 10:54:21,491 INFO  [ws] Listening for new connections on 127.0.0.1:8546.
2019-09-27 10:54:21,492 INFO  [oasis_chain] Oasis local chain is running
```

Save the Mnemonic; you will need it later. 

_Note_: The port :8546 corresponds to ws. You will need to use the port :8545 for http connections. 
You might also want to save one of the public addresses to serve as your account to deploy contracts with. For example you can copy-paste an account like so:

```js
const my_address = '0xb8b3666d8fea887d97ab54f571b8e5020c5c8b58';
```

## Deploy Using Truffle

The Oasis Network supports the deployment of Solidity contracts using Truffle, a common tool used by Ethereum developers to compile, test, and deploy smart contracts. Truffle is the easiest way to deploy a smart contract; all you really need to do is make sure you have Migrations and edit the Truffle configuration file.

### Truffle Configuration File

The configuration file is typically called `truffle.js` or `truffle-config.js`. You will add the Truffle HDWallet Provider, a Hierarchical Deterministic (HD) Wallet that uses a mnemonic to extract your keys. Take the mnemonic you saved earlier from running `oasis chain` and input it here.

```js
const HDWalletProvider = require('truffle-hdwallet-provider');
const MNEMONIC = 'range drive remove bleak mule satisfy mandate east lion minimum unfold ready';
```
Make sure you install the HDWallet Provider:

```bash
npm install truffle-hdwallet-provider
```

Add the Oasis Network as one of the networks (listed under `module.exports`) in your configuration file. If you want the default network to be the Oasis Network, call it the development network. Otherwise, you will need to specify it with a flag later on.

```js
module.exports = {
  networks: {
    development: {
      provider: () => new HDWalletProvider(MNEMONIC, 'https://localhost:8545'),
      network_id: '*',
    },
}
```

If you want to use the Oasis Devnet, you will need to use the following URL:

```js
provider: () => new HDWalletProvider(MNEMONIC, 'https://web3.devnet.oasiscloud.io')
```

If it doesn't exist already, you need to include the version of the Solidity compiler, `solc`, you need for the Compound contracts, which is likely not your installed Truffle's configured default. You'll need the highest version used by the contracts, which is stated at the top (e.g.` pragma solidity ^0.4.24`). Add to `module.exports`:

```js
compilers: {
  solc: {
    version: '0.4.24'
  }
},
```

### Migrations

Migrations are files that help Truffle deploy your contracts. If your repository is lacking Migrations files, you will need to write some - these docs detail how to do so.

### Deploy

Compile your contracts:

```bash
truffle compile
```
Run your migrations and deploy:

```bash
truffle migrate
truffle deploy
```

## Deploy Using Web3

The Oasis Network also has support for [Web3.js](https://web3js.readthedocs.io/en/v1.2.0/getting-started.html), a Javascript module to help build frontends for contracts on Ethereum. This method is more involved, but useful in creating your frontend application.

First, you'll want to initialize `web3` with a URL and `truffle-hdwallet-provider` as the provider - the same one used to deploy on Truffle earlier. If you are using a local Oasis chain, your URL will be `'http://localhost:8545'`. If you want to use the devnet, the URL will be `'https://web3.devnet.oasiscloud.io'`.

```js
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const MNEMONIC = 'range drive remove bleak mule satisfy mandate east lion minimum unfold ready';
const URL = 'http://localhost:8545';
const fs = require('fs'); // for reading files
const provider = new HDWalletProvider(MNEMONIC, URL);
const web3 = new Web3(provider);
```

When you compile your contract, there should be a JSON representation of the contract in your project's `./build/contracts` folder. You need the ABI and bytecode of your contract to deploy it; retrieve it like so:

```js
const json = fs.readFileSync('./path/to/file.json', 'utf8');
const abi = JSON.parse(json)['abi'];
const bytecode = JSON.parse(json)['bytecode'];
```

Initialize the new contract object. Deploy the contract and save its address.

```js
const contract = new web3.eth.Contract(abi);
contract.deploy({
    data: bytecode,
}).send({
    from: my_address,
}).on('error', (err) => {
    console.log(`Deploy failed with error: ${err}`)
}).then((deployment) => {
    console.log(`Factory deployed successfully, at address: ${deployment.options.address}`);
    contract.options.address = deployment.options.address;
});
```

Now you can deploy any Solidity contract on Oasis!
