# Quickstart

In this guide we will take you through setting up your Oasis dev environment, testing a simple Rust service using cargo, testing the same service using a locally running blockchain, and finally testing it using our Devnet 2.0.

## Set Up the Oasis SDK

### Prerequisites

To run the local Oasis blockchain (`oasis-chain`), you will need a C compiler like`clang` or `gcc`.
If you're reading these docs, you probably already have one, but if you don't, you can run one of

- macOS: `xcode-select --install`
- Ubuntu/Debian: `sudo apt-get install build-essential`
- CentOS/Amazon Linux/Fedora: `sudo yum groupinstall "Development Tools" "Development Libraries"`

### Installing the Oasis toolchain

1. [Install Rust using rustup](https://rustup.rs)
2. `rustup default nightly-2019-07-25`
3. `rustup target add wasm32-wasi`
4. `cargo install oasis-cli oasis-build oasis-chain`
5. Ensure that the `$HOME/.cargo/bin` is in your `$PATH`

Note: If you change your Rust toolchain to another nightly, you'll need to `cargo install --force oasis-build`.
We're working on automating this!

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
Note that the `app` tests will run when in a subdirectory of `app`.
You will see the following output,

```
 PASS  test/service.spec.ts (5.965s)
  HelloWorld Test
    ✓ deployed (2ms)
    ✓ known greeting (409ms)
    ✓ insert new greeting in Samoan (400ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

## Where to go from here?

- Check out the [tutorials](/tutorials/ballot)!
- [Learn Rust!](https://doc.rust-lang.org/book/) (protip: if you use DuckDuckGo, you can search the Rust docs with `!rust <query>`)
- Browse [crates.io](https://crates.io) for libraries to use in your services
