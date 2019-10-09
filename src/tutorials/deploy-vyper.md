# Deploying Vyper Contracts on Oasis (Uniswap)

This tutorial demonstrates how to deploy Vyper contracts onto the Oasis platform using Truffle and Web3.js. 
These techniques should work with _any_ Vyper contract, but we've chosen to use [Uniswap](https://uniswap.io/) as an illustrative example.
Uniswap is an open-source decentralized exchange (DEX) for ERC20 tokens built on Ethereum. 
This tutorial's methods for deploying Vyper contracts using Truffle and Web3.js are applicable to any Ethereum contract written in Vyper.
For contracts written in Solidity, see the [Solidity tutorial](./deploy-solidity.md).

If you want to deploy the contracts for yourself, a copy of the Uniswap contracts along with a `truffle.js` file and sample deployment through `Web3` can be found [here](https://github.com/oasislabs/uniswap).

## Prerequisites

You will need to have installed the Oasis Toolchain and know your public address. Click [here](./deploy-solidity.md#prerequisites) for more information.

## Compiling the Contracts

### Install Vyper

Clone the [Vyper repository](https://github.com/ethereum/vyper).
```bash
git clone https://github.com/ethereum/vyper
cd vyper
```
To retrieve the version that the Uniswap contracts are compatible with, you should reset to a previous version. If you don't have the correct version, you may get compiler errors.
```bash
git reset --hard 35038d20bd9946a35261c4c4fbcb27fe61e65f78
```

Vyper requires Python version 3.6 or higher. The best way to install vyper is to use `virtualenv` to create a python virtual environment:

First make sure you have Python 3.6 installed, then get your path to python 3.
```bash
which python3
```
Start a virtualenv.
```
virtualenv -p /path/to/python3.6 my_project
source my_project/bin/activate
```
Then, run `make` in your `vyper` directory. You may need to use `sudo` if on mac:
```bash
sudo make
```
Vyper should be installed now and you should be able to compile contracts.
The [Vyper Documentation](https://vyper.readthedocs.io/en/latest/installing-vyper.html) has more installation information.

Uniswap Vyper contracts can be found [here](https://github.com/Uniswap/contracts-vyper).
You can compile using the `vyper` command or using Truffle.

```
vyper uniswap_factory.vy
vyper uniswap_exchange.vy
```

Don't forget to deactivate your virtualenv at the end.

```bash
deactivate
```

## Deploying the Contracts

### Deploy Using Truffle

If you choose to deploy using Truffle, you'll need to create migrations contracts.

The first are a `Migrations.sol` in your project's `./contracts` folder and `1_initial_migrations` in your project's `./migrations` folder, both of which can be automatically generated using `truffle init`.

You also need a `2_deploy_contracts` which should look like this:
```js
var uniswap_exchange = artifacts.require('./uniswap_exchange'); //note there is no '.vy'
var uniswap_factory = artifacts.require('./uniswap_factory'); //note there is no '.vy'

module.exports = function(deployer, network, accounts) {
  deployer.deploy(uniswap_exchange, accounts[0]);
  deployer.deploy(uniswap_factory);
}
```
Run `truffle migrate` to deploy.

### Deploy Using Web3

First, connect to Web3 using a `truffle-hdwallet-provider`. You can run `oasis chain` to start up a local blockchain server and retrieve your mnemonic and URL.

```js
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const MNEMONIC = 'range drive remove bleak mule satisfy mandate east lion minimum unfold ready';
const URL = 'http://localhost:8545';
const provider = new HDWalletProvider(MNEMONIC, URL);
const web3 = new Web3(provider);
```

Using the contract ABI and bytecode from the compilation of your vyper contracts, instantiate new contract objects.
Uniswap requires a **factory** contract to create new exchanges, and an **exchange** contract that serves as a template for each exchange.

```js
const factory_json = fs.readFileSync('./path/to/file.json', 'utf8');
const factory_abi = JSON.parse(factory_json)['abi'];
const factory_bytecode = JSON.parse(factory_json)['bytecode'];
const exchange_json = fs.readFileSync('./path/to/file.json', 'utf8');
const exchange_abi = JSON.parse(exchange_json)['abi'];
const exchange_bytecode = JSON.parse(exchange_json)['bytecode'];
```

Initialize your contract objects.

```js
const factory_contract = new web3.eth.Contract(factory_abi);
const exchange_contract = new web3.eth.Contract(exchange_abi);
```

Finally, deploy your contracts and save their addresses for future use.

```js
factory_contract.deploy({
    data: factory_bytecode,
}).send({
    from: my_address,
}).on('error', (err) => {
    console.log(`Deploy failed with error: ${err}`)
}).then((deployment) => {
    console.log(`Factory deployed successfully, at address: ${deployment.options.address}`);
    factory_contract.options.address = deployment.options.address;
});
exchange_contract.deploy({
    data: exchange_bytecode,
}).send({
    from: my_address,
}).on('error', (err) => {
    console.log(`Deploy failed with error: ${err}`)
}).then((deployment) => {
    console.log(`Exchange deployed successfully: ${deployment.options.address}`);
    exchange_contract.options.address = deployment.options.address;
});
```

The HD Wallet Provider may continue running and cause execution to hang at the end. To gracefully exit, use the stop function:

```js
provider.engine.stop();
```

## Testing the Deployment

Once you've deployed your contracts, you can interact with them!
Try initializing the factory by giving it a template (the exchange contract address).
Make sure to do all of this before you call the stop function.

Assuming you have your factory and exchange contracts already deployed, fill these in with their corresponding addresses:

```js
const factory_address = '0x...';
const exchange_address = '0x...';
const factory_contract = new web3.eth.Contract(factory_abi, factory_address);
const exchange_contract = new web3.eth.Contract(exchange_abi, exchange_address);
```

To initialize the factory:

```js
factory_contract.methods.initializeFactory(exchange_address).send({
    from: my_address,
}).then(() => {
    factory_contract.methods.exchangeTemplate().call((err, result) => {
        console.log(`\n\nSuccessfully initialized Uniswap factory with template: ${result}`);
    });
}).catch(console.log);
```

You can also create a new exchange for the ERC20 token of your choice. All you need is the address to the token contract.

```js
const token_address = '0x...';
factory_contract.methods.createExchange(token_address).send({
    from: my_address,
}).then(() => {
  factory_contract.methods.getExchange( token_contract.options.address).call((err, result) => {
      console.log(`Successfully created a new exchange for token at ${result}`);
  });
})
```

Now you can deploy and interact with any Vyper contract on the Oasis platform!
