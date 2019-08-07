# Quickstart

In this guide we will take you through setting up your Oasis dev environment, testing a simple Rust service using cargo, testing the same service using a locally running blockchain, and finally testing it using our Devnet 2.0.

## Set Up the Oasis SDK

### Install the Oasis Toolchain

```
curl --proto '=https' --tlsv1.2 -sSL https://get.oasis.dev | python
```

Alternatively, pipe into `python - --help` to see installation options.

## Unit Test the "Hello World" Service Using Cargo

1. `git clone https://github.com/oasislabs/tutorials`
2. `cd tutorials/hello-world/service`
3. `oasis test -- --nocapture`

The test will do the following:

1. Retrieve "Hello World!" in Slovenian
2. Attempt to retrieve "Hello World!" in Samoan, but fail because it doesn't exist
3. Attempt to insert a duplicate greeting (this will fail)
4. Insert "Hello World!" in Samoan
5. Retrieve "Hello World!"" successfully in Samoan

You should see the following console output:

```
running 1 test
In Slovenian: "Pozdravljen, svet!"
In Samoan: None
Adding "Zeno World!" for "en"
Err(DuplicateEntry)
Adding "alofa fiafia i le lalolagi!" for "ws"
In Samoan: "alofa fiafia i le lalolagi!"
test tests::test_paths ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

Great!
Now that the tests pass, it's time build the service for deployment and test it on the local chain.

## Integration Test Using the Local Chain

In this step we will use the Javascript based test in the test directory.
This script uses [oasis.js](https://github.com/oasislabs/oasis.js) to interact with the local chain or Devnet 2.0.

1. `oasis build`
2. `cd ../app`
3. Install app dependencies using `npm install` (or `yarn install` if that's more your style)
4. In a separate terminal, run the local chain using `oasis-chain`

You can now test on the local chain using `oasis test`.
Note that the `app` tests will run when in a subdirectory of `app`. You will see the following output,

```
 PASS  test/service.spec.ts (5.965s)
  HelloWorld Test
    ✓ deployed (2ms)
    ✓ known greeting (409ms)
    ✓ insert new greeting in Samoan (400ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

## Integration Test Using Devnet 2.0

1. Login to the [Oasis developer dashboard](https://dashboard.oasiscloud.io) and visit `My Account`. Navigate to the `Payments` tab
   _Note:_ If you are a first-time user, you may be prompted to generate an Oasis-managed wallet, which you should do. Your wallet is what serves as your identity and enables you to interact with Oasis services.
2. Make sure you are in a secure location, and then `Click to reveal`. This will reveal your _private key_, which is used to access your wallet.
   You must never lose your private key nor share it with anyone unless you want to lose control of your wallet.
3. Set your private key for use by the client using `oasis config profile.default.private_key "<private key>"`

## Where to go from here?

- Check out the [tutorials](/tutorials/ballot)!
- [Learn Rust!](https://doc.rust-lang.org/book/) (protip: if you use DuckDuckGo, you can search the Rust docs with `!rust <query>`)
- Browse [crates.io](https://crates.io) for libraries to use in your services
