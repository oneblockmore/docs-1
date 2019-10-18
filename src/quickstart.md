# Quickstart

In this guide we will take you through setting up your Oasis dev environment, testing a simple Rust service using cargo, testing the same service using a locally running blockchain, and finally testing it using our Devnet 2.0.
You can choose to install the Oasis toolchain [locally](#install-the-oasis-toolchain-locally) or [with Docker](#install-with-docker).

If you run into any issues or have a question, you can chat with us in our public [Slack channel](https://join.slack.com/t/oasiscommunity/shared_invite/enQtNjQ5MTA3NTgyOTkzLWIxNTg1ZWZmOTIwNmQ2MTg1YmU0MzgyMzk3OWM2ZWQ4NTQ0ZDJkNTBmMTdlM2JhODllYjg5YmJkODc2NzgwNTg).

## Set Up the Oasis SDK

### Install the Oasis Toolchain Locally

```
curl --proto '=https' --tlsv1.2 -sSL https://get.oasis.dev | python
```

Alternatively, pipe into `python - --help` to see installation options.

### Install with Docker

```
docker pull oasislabs/tutorials
```

## Unit Test the "Hello World" Service Using Cargo

First, clone our tutorials repository from GitHub:

```
git clone https://github.com/oasislabs/tutorials
```

If you installed the Oasis toolchain locally, simply

```
cd tutorials/hello-world/service
```

or if you installed with Docker:

```
docker run -v /path/to/tutorials/repo:/tutorials -it oasislabs/tutorials /bin/bash
cd /tutorials/hello-world/service
```

Now you can test the `hello-world` service!

```
oasis test -- --nocapture
```

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

In this step we will use the JavaScript-based test in the test directory.
This script uses [oasis.js](https://github.com/oasislabs/oasis.js) to interact with either the local chain or Devnet 2.0.

1. `oasis build`
2. `cd ../app`
3. Install app dependencies using `oasis build`
4. In a separate terminal, run the local chain using `oasis chain`

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

## Deploy on Devnet 2.0

1. Login to the [Oasis developer dashboard](https://dashboard.oasiscloud.io) and visit `My Account`.
2. Make sure you are in a secure location, and then *Click to reveal* your API token in the `Credentials` section of the `Account Info` tab. You must never lose your API token nor share it with anyone!
3. Give your local toolchain access to deploy services on your behalf by running the following command, which will begin to read your credential from stdin.
You should then paste your credential in and hit enter.
   ```
   oasis config profile.default.credential -
   ```
You can now deploy your service to Devnet 2.0, using `oasis deploy`.
When you run that command, with any luck, you'll see something like the following:

```
   Deploying hello-world
         ...
    Deployed HelloWorld at 0xf8b476862dd4bcaaabb988aa5a459d95e319ac0e
```

You can now point an app at `0xf8b476862dd4bcaaabb988aa5a459d95e319ac0e` using the client's [Service.at](https://oasis-labs-oasis-client.readthedocs-hosted.com/en/latest/service.html#service-at) constructor and interact with the spiffy decentralized backend you just deployed!

## Where to go from here?

- Check out the [tutorials](/tutorials/ballot)!
- [Learn Rust!](https://doc.rust-lang.org/book/) (protip: if you use DuckDuckGo, you can search the Rust docs with `!rust <query>`)
- Browse [crates.io](https://crates.io) for libraries to use in your services
