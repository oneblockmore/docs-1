<span style="display:block;font-size:1.5em">Welcome to the Oasis developer documentation!</span>

## What's New

At Oasis Labs we’re building a platform that brings the benefits of confidentiality and decentralized computing to developers irrespective of their experience with blockchain technology.
To make our platform more accessible, our next release, includes a few fundamental changes to the core experience with our new Oasis Development SDK.
Along with this release, we're also launching an upgraded developer network: Devnet 2.0.

Our new development experience allows seasoned blockchain developers, developers learning to build on blockchain platforms, and even cloud developers, to seamlessly build and take advantage of integrity, confidentiality, and privacy built into the Oasis Network.

Thanks to all the developers who provided meaningful feedback via phone calls, Gitter, GitHub and more—your feedback  has been critical to understanding how we can make the platform better.

Here’s a summary of what’s changing:

| Features | Devnet 1.0 | Devnet 2.0 |
|----------|------------|------------|
| Nomenclature | Smart Contract | Service |
| Runtime | WASM, EVM | WASM (+WASI), EVM
| Solidity | Ethereum standard | Ethereum standard |
| Rust | – | oasis-rs v0.2 |
| Local dev tools | contract-kit, Truffle | oasis-cli |
| Web client | web3c.js | oasis.js |
| Deployment tools | Web3 gateway | oasis-gateway |
| Platform credits | Faucet | Auto-funding via<br>Oasis Dashboard |
| Dashboard | &bull; External block explorer<br>&bull; Per-contract analytics<br>&bull; Google SSO | &bull; Oasis Explorer<br>&bull; Project-wide analytics<br>&bull; SSO with Google,<br>&nbsp;&nbsp;&nbsp;Github, and WeChat |

### From Smart Contracts to Services

Throughout our updated documentation you’ll notice that we now refer to contracts as services, starting in this release.
We would like to think of smart contracts as services that can be deployed and interacted with.
A service provides a well-defined piece of functionality with application backends composed of a single service or multiple interacting services.
For example, a service may be a single-use smart contract to execute an atomic trade between two tokens, or a set of interacting smart contracts that support holding collateralized debt positions.

### New Devnet, New Tools

![New devnet flow](/whats_new/system_diagram.png)

Oasis Dashboard and Oasis CLI are frontend tools to manage services on the Oasis Network.
We are introducing Oasis Client SDK and Oasis Gateway to simplify interacting with the Oasis Network and the services deployed on the Oasis Network.

#### Write Services Using Rust

With the new SDK, developers will be able to use [oasis-rs](https://github.com/oasislabs/oasis-rs) to write and test their contracts using the Rust toolchain.
oasis-rs hides mostly hides blockchain specific programming patterns, so that developers can focus on rapid, safe application development.

#### Build Apps Using Oasis.js

We have a new client, [oasis.js](https://github.com/oasislabs/oasis.js), for deploying and interacting with services.
The new client works with the new developer gateway to support confidential transactions and replaces web3c that was used prior to this release.
Compared to previous client libraries, oasis.js is easier to use because it is a simpler RPC API and more secure because it uses Deoxys II, a constant-time authenticated encryption primitive that provides stronger security properties than those provided by web3c (and is faster, to boot!).

#### Platform Credits

Prior to this release, the developer flow for funds to deploy and run transactions was by visiting our faucet and funding a wallet.
This has been replaced by an auto-funding model that automatically funds each developer up to 1 DEV a day with automatic top-off.
This reduces friction, taking us a step closer to making our platform accessible to both blockchain and non-blockchain developers.
Developers who need more additional funds can send a request to [support@oasislabs.com](mailto:support@oasislabs.com).

#### Streamline Deployment With the Developer Gateway

The new developer gateway supports the new client and exposes an API that can be used by developers to create a public API to consume their deployed services.

#### BYO LLVM Frontend

Starting with this release we have a new WASM runtime with support for the WebAssembly System Interface (WASI).
Using a WASI-based WASM environment not only gives us the sandboxing abilities inherent to WASM, but also allows developers to port "legacy" applications as long as they can use the WASI libc.
Don't like Rust? That's okay (*sob*) you can use C, C++, Zig, and others!

#### Gain Insight Through the Dashboard

With this release, we have made multiple refinements to improve user experience on the Dashboard:

* simpler flow to upload and deploy new services
* project-level analytics of active users and cost based on recent usage
* a new Oasis Explorer to debug transactions within the dashboard

This is the first step in a series of releases that will turn the dashboard into a one-stop shop for understanding the usage of developers' deployed services.

#### Bid Farewell to Confidential Solidity

In this release we are deprecating web3c.
As a result, Solidity contracts will no longer have the same confidentiality guarantees going forward.
In other words, all Solidity contracts will be non-confidential while continuing to benefit from better performance compared to other Solidity platforms.
Existing services and clients using web3 will continue to work in Devnet 2.0 against the web3 gateway.
For future Ethereum contracts, we recommend either web3.js or ether.js.

### Migrating Existing Services

* After Devnet 2.0 is launched, migrate your contracts to use the new runtime and re-deploy on Devnet 2.0 by September 30.
* Devnet 1.0 will no longer be supported after September 30.
* Devnet 2.0 deployment and our new flow will work end-to-end starting July 19, our Beta release.
* For all new development, use our new libraries.

#### Migration Timelines

##### July

* Beta Release in July.
* Provide early feedback on this latest release.
* Use the new toolchain to build and deploy services.

##### August

* Launch Devnet 2.0 in August.
* Dashboard upgrade supporting Devnet 2.0 runtime. Dashboard 2.0 will support deploying services using new runtime only

**Legacy support for 60 days**:
Legacy contracts are served through the old Dashboard. A link will be available from the main Dashboard for up to 2 months.
During this time, contracts deployed on Devnet 1.0 and their state will remain accessible.
We encourage developers to migrate their contracts to our new platform in this time
Devnet 2.0 will have fresh state and state maintained in Devnet 1.0 is non-portable.


##### September 30

* Old Dashboard is sunset.
* Devnet 1.0 is sunset.

### Looking Forward

Over the next few months, we are heavily focusing on increasing ease of use and efficiency for developers.
Here are a few things that are on our priority list to drive this goal.

#### Additional Language Support

With the change to WASI for the system interface in our WASM runtime, we have the ability to support languages that can be compiled to WASI.
his opens the possibility to support languages like C, C++, JavaScript, and Go.
If you have a specific need for your use-case, please send us a note at [devrel@oasislabs.com](mailto:devrel@oasislabs.com) to help us prioritize.

### Enhancements to the Local Developer Toolchain

The local chain enables testing of services with state. We have a number of additions planned for the future including:

* more precise cost profiling of services
* enhancements to measure additional cost for confidential services

### Wallet Management

Current end-user flows in blockchain have been clunky and limited because of existing wallets. Typically, users end up self-authenticating to the blockchain and paying for usage by signing the transaction with a single wallet key.
We are exploring new models that help developers build better end-user engagement.

We are working on updates to the oasis-gateway, where the identity for the end-user would be separated from the identity for transaction payment.
This allows hybrid models where different wallets can be used to identify the end user and to pay for the transaction.

Stay tuned for more on this feature soon.

### Launching a Public Testnet

Over the course of the next two quarters we expect to deploy a Public Testnet and allow more developers to deploy nodes on our network.
More on this to come in future releases and blog posts.

### Feedback
Lastly, our priorities are driven by developer needs and would love to hear from you.
If there are any particular needs for your use-cases that you would like to see in future releases, please reach out to us at [devrel@oasislabs.com](mailto:devrel@oasislabs.com).

## Where Next

* ****NEW\*\*** [Join the Oasis + IDEO + CoinList Hackathon](https://coinlist.co/build/ideo)
* [Understand the Oasis Platfom](/overview)
* [Run through the Quickstart](/quickstart)
* [Complete the tutorials](/tutorials/ballot)
* [Watch some Oasis videos](https://www.youtube.com/channel/UC35UFPcZ2F1wjPxhPrSsESQ)
