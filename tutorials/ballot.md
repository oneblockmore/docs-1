# Creating a Secret Ballot

By now, you should know how to create, build, and test an Oasis service using our CLI. If you don't, consider (re)visiting our [Quickstart Guide](/quickstart). Now, we will dive deeper into semantics, learning how to define and implement Oasis service RPCs in Rust. 

We'll do this via the motivating example of a voting service that allows participants to fill out a _secret ballot_ to vote for a candidate of their choice. Because the service runs on the Oasis network, we can be confident that the voting process cannot be rigged and that participants' identity and vote are not revealed either to other participants or to the service itself.

**tl;dr:** The code for this example can be found [at this link](https://github.com/oasislabs/tutorials/tree/master/examples/ballot).

## Prerequisites

Building and running this tutorial will require the Oasis CLI.
If you haven't yet installed it, please peruse the [Quickstart guide](/quickstart).

Oasis services are currently developed using the Rust programming language. If you are unfamiliar with Rust, the [Rust book](https://doc.rust-lang.org/nightly/book/) is an excellent place to start.

## Create a New Project

Now that you've satisfied all the prerequisites, creating your secret ballot application is easy:

```
oasis init ballot && cd ballot
```

You should find yourself in a Git repo that has been populated with the following directory structure:

```
ballot 
│
└───app
│   │   package.json
│   │   tsconfig.json
│   │   tslint.json
│   └───src
│   │   │   index.ts
│   └───test
│       │   service.spec.ts
└───service
    │   Cargo.toml
    └───src
        │   main.rs
```
As you'd expect, `service` is where your Oasis service(s) will live, while `app` is for your client to interact with them. 

Now that you have an overview of your project structure, let's jump right into writing and building your first `service`.

```
cd service
```
If you're coming from JavaScript, `Cargo.toml` is the Rust version of `package.json` and `src/main.rs` is akin to `index.js`. For more information, the [Cargo book](https://doc.rust-lang.org/nightly/cargo/) is a fine reference. The [Creating a New Package](https://doc.rust-lang.org/nightly/cargo/guide/creating-a-new-project.html), [Dependencies](https://doc.rust-lang.org/nightly/cargo/guide/dependencies.html), and [Package Layout](https://doc.rust-lang.org/nightly/cargo/guide/project-layout.html) sections are particularly relevant for this tutorial.

## Setting up dependencies

Dependencies are specified in the _package manifest_: `Cargo.toml`. If you open `Cargo.toml`, you'll see a line at the bottom of the file that says [dependencies], which is the syntax for a TOML table called dependencies. Two of the three required dependencies for building your voting service should already be initialized for you by default, and all you need to do is add one for `map_vec`. This should make your dependencies look as follows:

```toml
[dependencies]
map_vec = "0.2"
oasis-std = "0.2"
serde = { version = "1.0", features = ["derive"] }
```

[`oasis-std`](https://docs.rs/oasis-std) contains a collection of types and utilities that make writing blockchain services more pleasant.
[`serde`](https://serde.rs) is a SERialization/DEserialization library that's used quite ubiquitously throughout the service and client.
[`map_vec`](https://docs.rs/map_vec) contains `Map` and `Set` data structures that trade asymptopic complexity for low constant factors; this tends to be more efficient when writing simple services.

Those are the only two runtime dependencies that you need to specify.
You'll also want to note the following dev (test) dependency:

```toml
[dev-dependencies]
oasis-test = "0.2"
```

[`oasis-test`](https://docs.rs/oasis-test) is an in-memory blockchain simulator that you can use to semi-integration test your services before deployment.

## Defining the Ballot Service

### From Cargo to Cargo Cult

Let's start with some scaffolding. If you pop open `main.rs` , you'll notice that a service named `Ballot` has already been initialized for you with some barebones starter code. We'll now analyze this service piece-by-piece and extend it to act as the voting service we envision it to be.

The top of our Oasis services will always contain relevant imports. By default, we only have one:

```rust
use oasis_std::Context;
```

[`Context`](https://docs.rs/oasis-std/0.1.0/oasis-std/exe/struct.Context.html) is a construct that you'll need in mostly every service, and serves as an object that we'll use to keep track of the -- you guessed it -- context of invoked service methods (e.g. the method caller). Let's also include the `Address`  construct from `oasis_std`, which we will later use to verify ballot participants' identities, and the `map_vec` object we decided we needed above. Now we should have two imports:

```rust
use map_vec::Map;
use oasis_std::{Address, Context};
```
which covers everything we'll need to use for building our voting service.

### Defining service state

The remaining steps to defining a service are 1) deciding what is contained in the state and 2) implementing the RPCs that manipulate that state.

The fields of service state are defined in the struct annotated with `#[derive(oasis_std::Service)]`.
This annotation is a trait which is necessary for handling persisting and loading your service state from platform storage. Currently, though, `Ballot` is empty and maintains no state:

```rust
#[derive(oasis_std::Service)]
struct Ballot;
```

Let's fix that, by populating it with a few fields we'll want to keep track of:

```rust
#[derive(oasis_std::Service)]
struct Ballot {
    description: String,
    candidates: Vec<String>,
    tally: Vec<u32>,
    accepting_votes: bool,
    admin: Address,
    voters: Map<Address, u32>,
}
```

Cool, it looks like a regular ol' struct.
The only thing to keep in mind is that the types must be serializable so that their data can be persisted to storage, but it's okay because [most of the useful ones are](https://serde.rs/data-model.html#types).
`*Map` and `*Set`? Most certainly.
`Vec`? Verily!
Simple `enum`s? Surely!
But references? Risky.
`Rc<RefCell<Pin<Box<T>>>>`? Not so much.
And of course, pointers: please don't.
Don't worry about remembering these, though.
The compiler will let you know if something won't fly.

Great, so that's all there really is to defining service state.

### Defining service methods (RPCs)

Like any Rust struct, a service state object can have RPCs attached using an [impl item](https://doc.rust-lang.org/std/keyword.impl.html). In our case, all of the RPCs will be defined as public functions inside of an `impl Ballot { ... }`, which has already been initialized for you. Before we forge ahead with defining the RPCs we want, let's first add a type definition before `impl Ballot { ... }`:

```rust
type Result<T> = std::result::Result<T, String>;
```

[Result](https://doc.rust-lang.org/std/result/) is a convenient way to propagate errors in your Rust code and/or recover from them in an ergonomic manner. Since all of our RPCs will return values of type `std::result::Result<T, String>`, this will help make our code a bit less verbose.

#### The constructor

All services must have a constructor that returns an instance of the state.
The constructor is called before a service is deployed and initializes the state object.
As in normal Rust parlance, the constructor is `new`.

Here's the constructor for a `Ballot`.

```rust
pub fn new(ctx: &Context, description: String, candidates: Vec<String>) -> Self {
    Ok(Self {
        description,
        tally: vec![0; candidates.len()],
        candidates,
        accepting_votes: true,
        admin: ctx.sender(),
        voters: Map::new(),
    })
}
```

Let's break that down a bit.
First the function signature.

```rust
pub fn new(ctx: &Context, description: String, candidates: Vec<String>) -> Self
```

The `pub` is the visibility modifier and denotes that the function is an RPC method.
As we discussed above, `ctx: &Context` is a reference to a `Context` object that contains the invoked method context.
`description` and `candidates` are `String` arguments that are passed in by the client.
`-> Self` denotes that the function returns a `Self`, and `Self` is just an alias to the `<Thing>` in `impl <Thing>`.
The constructor must return either `Self` or `<Thing>`.

### Some simple getters

It'd probably be helpful if clients could retrieve information like the description of the ballot, the names of the candidates, and whether voting is open? One could even imagine a web app that finds public polls and shows them in a spiffy UI.

With this use case in mind, you can replace the existing `say_hello` example RPC with some methods that return the desired data.

```rust
/// Returns the candidates being voted upon.
pub fn candidates(&self, _ctx: &Context) -> Vec<&str> {
    self.candidates.iter().map(String::as_ref).collect()
}

/// Returns the description of this ballot.
pub fn description(&self, _ctx: &Context) -> &str {
    &self.description
}

/// Returns whether voting is still open.
pub fn voting_open(&self, _ctx: &Context) -> bool {
    self.accepting_votes
}
```
These are similar to the constructor but a bit different. In non-constructor RPC methods, we have access to the state of the service, as provided by a reference to `self`. We can pick the items out of `self` that we want and return them to the user. Note that _all_ RPC methods -- even those that do not use `self` and `Context` -- receive these two arguments, but you are free to ignore them.

### Mutating state

Now to implement the core of the ballot service. We'll want to support functionality for 1) general participants to vote and 2) the ballot owner to close voting.

```rust
/// Cast a vote for a candidate.
/// candidate_num is the index of the chosen candidate in Ballot::candidates.
/// If you have already voted, this will change your vote to the new candidate.
/// Voting for an invalid candidate or after the ballot has closed will return an Err.
pub fn vote(&mut self, ctx: &Context, candidate_num: u32) -> Result<()> {
    if !self.accepting_votes {
        return Err("Voting is closed.".to_string());
    }
    if candidate_num as usize >= self.candidates.len() {
        return Err(format!("Invalid candidate `{}`.", candidate_num));
    }
    if let Some(prev_vote) = self.voters.insert(ctx.sender(), candidate_num) {
        self.tally[prev_vote as usize] -= 1;
    }
    self.tally[candidate_num as usize] += 1;
    Ok(())
}

/// Closes this ballot so that it no longer collects votes.
/// Only the ballot creator can close voting.
pub fn close(&mut self, ctx: &Context) -> Result<()> {
    if self.admin != ctx.sender() {
        return Err("You cannot close the ballot.".to_string());
    }
    self.accepting_votes = false;
    Ok(())
}
```

Again, pretty close to what we've already seen.
`pub fn`s, `Context`s, and all that.
If you look closely, you'll see that `&self` has changed to `&mut self`, but this is just Rust's way to know that you want a mutable reference to `self`; it just _happens_ to be the case that modifying `self` will be persisted to storage.

The other new thing here is error handling.
When the service encounters an error condition, it can return an `Err`. This will revert any pending changes to state and return the error message to the caller. _Note_: this will eventually change so failure is indicated by panicking with an error message (if you're curious, the reason for this was so the client and service had the same syntax, but it's kind of onerous writing `Ok(())` everywhere).

A-okay, this is starting to look like a ballot service to me!

### Winner, winner!

And what ballot would be complete without a way to tell who got the most votes?
(Other than a rigged ballot, perhaps, but that's why you're using blockchain!)
Let's add two more getters to get vote results:

```rust
/// Returns the index of the candidate with the most votes.
/// This method can only be called after voting has closed.
pub fn winner(&self, _ctx: &Context) -> Result<u32> {
    if self.accepting_votes {
        return Err("Voting is not closed.".to_string());
    }
    Ok(self
        .tally
        .iter()
        .enumerate()
        .max_by_key(|(_i, v)| *v)
        .unwrap()
        .0 as u32)
}

/// Returns the number of votes cast for each candidate.
/// This method can only be called after voting has closed.
pub fn results(&self, _ctx: &Context) -> Result<Vec<u32>> {
    if self.accepting_votes {
        return Err("Voting is not closed.".to_string());
    }
    Ok(self.tally.clone())
}
```

## Testing

Although Rust might sometimes feel like "if it compiles, it works," it's nice to be able to convince oneself of correctness through tests.
"But I just copied the code you gave me?" say you, the diligent reader.
What? You think tutorial code _just works_?
What kind of developer experience would that be!
You'd better believe that there's some subtle bug in here somewhere.

At the beginning of the tutorial, Cargo generated a bit of test scaffolding at the bottom of your `main.rs`.
It should look like this:

```rust
#[cfg(test)]
mod tests {
    extern crate oasis_test;

    use super::*;

    #[test]
    fn test() {
        let sender = oasis_test::create_account(1);
        let ctx = Context::default().with_sender(sender);
        let mut client = Ballot::new(&ctx);
        println!("{}", client.say_hello(&ctx));
    }
}
```

The [Rust book](https://doc.rust-lang.org/book/ch11-00-testing.html), as ever, will tell you all you need to know about `#[cfg(test)]`, `#[test]`, and the like.
For our purposes, we'll want to replace the generated code with the following chunk.
I promise that this isn't where the bug is.

```rust
#[cfg(test)]
mod tests {
    // This is required even in Rust 2018.
    // If omitted, rustc will not link in the testing
    // library and will produce a giant error message.
    extern crate oasis_test;

    use super::*;

    /// Creates a new account and a Context with the new account as the sender.
    fn create_account() -> (Address, Context) {
        let addr = oasis_test::create_account(0 /* initial balance */);
        let ctx = Context::default().with_sender(addr).with_gas(100_000);
        (addr, ctx)
    }

    #[test]
    fn functionality() {
        let (_admin, admin_ctx) = create_account();
        let (_voter, voter_ctx) = create_account();

        let description = "What's for dinner?";
        let candidates = vec!["beef".to_string(), "yogurt".to_string()];
        let mut ballot =
            Ballot::new(&admin_ctx, description.to_string(), candidates.clone());

        assert_eq!(ballot.description(&admin_ctx), description);
        assert_eq!(ballot.candidates(&admin_ctx), candidates);
        assert_eq!(ballot.voting_open(&admin_ctx), true);

        // Can't get winner before voting has closed.
        assert!(ballot.winner(&voter_ctx).is_err());

        ballot.vote(&voter_ctx, 0).unwrap();
        ballot.vote(&voter_ctx, 1).unwrap();
        ballot.vote(&admin_ctx, 1).unwrap();

        // Non-admin can't close ballot.
        ballot.close(&voter_ctx).unwrap_err();
        ballot.close(&admin_ctx).unwrap();

        // Votes can't be cast after ballot has closed.
        ballot.vote(&admin_ctx, 0).unwrap_err();

        assert_eq!(ballot.voting_open(&voter_ctx).unwrap(), false);
        assert_eq!(ballot.winner(&voter_ctx).unwrap(), 1);
        assert_eq!(ballot.results(&voter_ctx).unwrap(), vec![0, 2]);
    }
}
```

There are two things to note here.
The first is that, when external to the service (i.e. not in `impl Ballot { ... }`), `Ballot` refers to the service client which can deploy and/or interact with a deployed service.
The other is that you can create your own `Context` to pass to the service RPCs.
When testing, you can explicitly set the `sender` (the method invoker), but this will be your account when deploying in production.
Testing accounts are created using `oasis_test::create_account`.

You can now run the test using `oasis test`.
(protip: use `oasis test -- --nocapture` to pass through stdout and stderr).
This will run your tests using the blockchain simulator in `oasis-test`.
If all goes well, you should see your test pass.
Okay, so maybe there was no bug, but at least you now know how to test your service!

### Building for deployment

Finally, it's time to ready your service for deployment. You'll notice the following block that's been initialized for you in your `Ballot` service:

```rust
fn main() {
    oasis_std::service!(Ballot);
}
```
This Rust macro automatically builds your service when you run `oasis build` from within `service` and creates a deployable Wasm service for you in `target/service/ballot.wasm`. Great! Now all you have left to learn is how to deploy this service to the Oasis platform and set up a client to interact with it.

## Onward to (messages of) victory!

Congratulations on completing the first tutorial!
You can now imagine that you could hold elections on dinner, your fantasy sportsball team, or the supreme ruler of your digital nation state (digital nation state not included).

Up next is a confidential message board service that demonstrates more advanced concepts like events and custom types.
