# Getting Started with Web3

## Summary

This document will walk you through how to use Web3 on Oasis, including how to connect your Web3-enabled wallet and interact with smart contracts through Web3. 
For tutorials on deploying contracts on Web3, visit our other docs ([Solidity](./tutorials/deploy-solidity.md) and [Vyper](./tutorials/deploy-vyper.md)). 

- [Intro to Web3](#intro-to-web3)
- [Connecting Wallets](#connecting-wallets)
- [Getting Funded](#getting-funded)
- [Connecting to Oasis.js](#connecting-to-oasisjs)

## Intro to Web3

[Web3.js](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html) is a Javascript module used by many Ethereum developers to deploy and interact with deployed smart contracts on various Ethereum networks. 
The Oasis network fully supports Web3 interactions, so you can use it to deploy your contracts (read the docs for deploying [Solidity](./tutorials/deploy-solidity.md) and [Vyper](./tutorials/deploy-vyper.md) contracts) and interact with them. 

### Using Web3 in an Application
To use Web3, install it as you would any other module. 

```
npm install web3
```

You're ready to create an application that interacts with the Oasis network. 
In your application, you'll need to include two new dependencies.
The first is Web3, obviously.
Secondly, Web3 requires you to specify a [provider](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#providers). 
A provider can be a `WebsocketProvider`, `IpcProvider` or, in our case, a Hierarchical Deterministic Wallet Provider `truffle-hdwallet-provider`. 
This particular provider manages a set of keys derived from a seed. 

```js
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
```
**Connecting to Local Oasis Chain:** Initializing the HD Wallet provider requires a seed phrase (or mnemonic) from which it extracts your accounts (private keys and public addresses). 
It also requires a URL to create a connection through which all communication to the network will be done. 
To connect to your local `oasis chain`, use `http://localhost:8545` and the `mnemonic` provided to you there. 

```js
const MNEMONIC = 'range drive remove bleak mule satisfy mandate east lion minimum unfold ready';
const URL = 'http://localhost:8545';
const provider = new HDWalletProvider(MNEMONIC, URL);
```

**Connecting to Oasis Devnet:** To connect to the Oasis Devnet, use the link `wss://web3.devnet.oasiscloud.io/ws`. 
You will likely want to connect your own account; do this by providing your mnemonic (if you're using an HD wallet), private key, or array of private keys.
The [Oasis Dashboard](https://dashboard.oasiscloud.io) accounts are not compatible with Web3. 

To keep your mnemonic or private key secret, instead of including them in your code, you may want to input them at runtime as  environment variables.

```js
const MNEMONIC = process.env.MNEMONIC;
const URL = 'wss://web3.devnet.oasiscloud.io/ws';
const provider = new HDWalletProvider(MNEMONIC, URL);
```

```
MNEMONIC="<MNEMONIC>" node my_web3_project.js
```

Finally, create your Web3 instance.
Conventionally, we call it (lowercase) `web3`, not to be confused with the (uppercase) module `Web3`.

```js
const web3 = new Web3(provider);
```

Test your connection:

```js
web3.eth.net.isListening()
   .then(() => console.log('Web3 is connected.'))
   .catch(e => console.log('Something went wrong.'));
```

With your web3 instance, you should be able to sign and send transactions without the laborious process of calculating a nonce, creating a raw transaction object, signing it, etc. 
For example, try querying an account balance and sending tokens from one account to the other:

```js
web3.eth.sendTransaction({from: my_addr, to: other_addr, value: 10})
  .then( () => {
    web3.eth.getBalance(other_addr)
      .then(console.log)
      .catch(console.log);
  })
  .catch(console.log);
```

## Connecting Wallets

Oasis supports Web3, so any wallet compatible with Web3 (such as the [Metamask](https://metamask.io/) browser extension) can be used to sign and send transactions. 

If you want to use your Metamask wallet, just use your seed phrase as the `MNEMONIC` when setting up your provider. 
You can obtain your seed phrase by going to Settings > Security and Privacy > Reveal Seed Words. 
You can also send a transaction on a local `oasis chain` network directly from the Metamask interface. 
Just select `Localhost 8545` from the Networks dropdown menu, then send a transaction like you would normally on the Ethereum network.

For any other wallet, just make sure you are able to provide a mnemonic (if you're using an HD wallet), private key, or array of private keys.
Most wallets will tell you your mnemonic or private key when you first create your account, and/or let you view it later.
Check your wallet provider's docs to see what options you have.

Here is an example with a private key, represented as a string (no need to make it a `Buffer`). 
Note that your private key should not have the '0x' in front. 

```js
// single private key
const priv_key = '...';
let provider = new HDWalletProvider(priv_key, URL);

// multiple private keys
const private_keys = ['...', '...', '...']
const num_keys = 3;
let provider = new HDWalletProvider(private_keys, URL, 0, num_keys); 
```

## Getting Funded

Our faucet is now deprecated. 
The best way to get funded is to email <support@oasislabs.com> with your public address. 

## Connecting to Oasisjs

[`oasis.js`](https://oasis-labs-oasis-client.readthedocs-hosted.com/en/latest/index.html) is our version of Web3, a Javascript SDK for building applications on top of Oasis platform services. 
It features confidentiality and support for confidential Rust contracts built on the Oasis platform; Web3 does not. 
In `oasis.js`, you use a `wallet` and a `gateway`, similarly to how you needed a `MNEMONIC` and `URL` in Web3. 
An example using `oasis.js` can be found [here](https://oasis-labs-oasis-client.readthedocs-hosted.com/en/latest/examples.html).

Once you've deployed contracts or sent transactions on an Oasis network via `Web3` or `oasis.js`, everything is accessible from either endpoint, but remember that Web3 interactions do not make the same confidentiality guarantees.

