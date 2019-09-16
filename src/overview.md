# Overview

## What is Oasis?

At Oasis Labs, we believe in empowering individual developers, startups, and enterprises to take advantage of the rapidly evolving technologies around blockchain and build applications that are both secure and decentralized.

We designed the Oasis platform to provide not only integrity, as other blockchain platforms do, but also confidentiality and privacy at the compute, storage, and application layer of our platform. This enables privacy-preserving and computationally complex applications on blockchain, and for individual developers and companies alike to build applications that protect user data by design—fostering the creation of new applications that couldn’t otherwise be built.

## Cloud Computing with Blockchain

Similar to functions in serverless cloud computing, a smart contract on a blockchain network is akin to a group of functions, with state persisted on a distributed immutable ledger. A smart contract run on the Oasis network—as opposed to other blockchain platforms—provides confidentiality and privacy at every layer of the stack.

## Key Features

### Integrity and security

Using a decentralized consensus-based architecture, with a heterogenous mixture of compute nodes including those with trusted execution environments (TEEs), Oasis mitigates the risk of malicious hacking, tampering, and other forms of compromise. This design helps ensure that cloud services only take approved, correct actions—protecting deployments and critical systems from attacks and identifying internal errors.

### Privacy

Oasis offers full-stack privacy, providing confidentiality and privacy at every layer of the protocol—from the application, to the network, down to each node. This allows for trustless privacy, where data is protected automatically with strong security guarantees and decrypted inside of a trusted execution environment.

### Scalability

Oasis is built on an entirely new blockchain architecture that separates computation from consensus. This new design makes Oasis platform both faster and more robust—capable of supporting computationally complex applications unseen in the other blockchain systems of today.

### Tools to make your life easy

Oasis provides a number of tools and SDKs to rapidly build privacy-preserving applications. From weekend warriors, to startups, to Fortune 500 companies—we aim to enable anyone to build applications on our platform.

### FAQ

#### What languages do you support now?

Currently we support Rust for confidential and non-confidential smart contracts and Solidity for non-confidential smart contracts. 

#### For solidity contracts, what is the URL for web3 gateway? 

With HTTPS: 

https://web3.devnet.oasiscloud.io

With WebSockets over SSL/TLS:

wss://web3.devnet.oasiscloud.io/ws

For solidity development, you can continue to use your usual tools/libraries such as truffle, web3.js and ethers.js.

#### What languages do you plan to support in the future?

With our recent runtime change to WASM we also have the ability to support languages that can be compiled to WASI. 

This opens the possibility to support languages like C, C++, Java, and Go. 

If you have a specific need for your use-case, please send us a note at devrel@oasislabs.com to help us prioritize.  

#### How do I debug transactions on the network? 

Use Oasis Explorer: https://dashboard.oasiscloud.io/explorer. 

You can search network logs for wallet address or transaction id or a block address. 

For your deployed service, you can also view Logs tab on the dashboard for recent transactions.

#### Can I write a confidential smart contract in Solidity?

With the current release of Devnet 2.0 confidential smart contracts can only be written in Rust. 

We hope to support Solidity confidential smart contracts in the future.  

Currently Solidity does not expose confidential semantics, making it difficult to take existing solidity contracts and translating them to run in a confidential environment without making inappropriate inferences as to what should run confidentially and what should not.

#### Is there way to make confidential call between services (Rust > Rust) ?

Yes.  Look at the tests inside oasis-rs github repo to see this in action. 

#### How do I get more credits for increased consumption beyond 1 DEV per day?

Please send a note to devrel@oasislabs.com and we would be happy to assist you.

#### Are you a proof of stake or proof of work platform?

Oasis is a proof of stake platform. 

Unlike many other proof of stake networks however, we have a different architectural design that separates compute from consensus and allows the system to scale to support transactions with greater complexity than many traditional sharding platforms.

#### Is Oasis a unique platform or built on top of Ethereum? 

Oasis is a unique platform and is not built on top of Ethereum or any other protocol. 

To learn more about our platform read our [white paper](https://www.oasis-protocol.org/whitepapers)!

#### How does this compare to a private blockchain like Hyperledger?

At Oasis our goal is to build a public decentralized network that offers additional properties of confidentiality and privacy for your data. 

Conversely, Hyperledger is a siloed network typically run and owned by one entity that retains some of the properties often found in blockchain computing systems. 

It does not support confidentiality across a public network.

#### When will you open source your code?

We’ve open sourced different pieces of our code which you can find at [https://github.com/oasislabs](https://github.com/oasislabs).

#### How can I become a node operator or a validator on Oasis Network?

The Oasis network is a proof of stake system and we’ll look to community members to run nodes for everything from storage to computation to consensus. 

While our network is not quite ready for node operators, we should be getting there soon! 

If you’re interested in signing up to run a node, please go to [https://oasis-protocol.org/node](https://oasis-protocol.org/node) and we’ll be in touch as soon as we’re ready.
