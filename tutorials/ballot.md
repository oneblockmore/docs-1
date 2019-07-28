# Creating a Secret Ballot

In this tutorial we will create a secret ballot service that allows participants to vote for a candidate without revealing their identity or their vote.
Because the service runs on the Oasis platform, we can be confident that the election cannot be rigged.

**tl;dr:** The code for this example can be found at [https://github.com/oasislabs/oasis-rs/tree/master/examples/ballot](https://github.com/oasislabs/oasis-rs/tree/master/examples/ballot).

## Prerequisites

Building and running this tutorial will require the Oasis toolchain.
If you haven't yet installed it, please peruse the [Quickstart guide](/quickstart).

## Create a New Project

Oasis services are currently developed using the Rust programming language.
If you are unfamiliar with Rust, the [Rust book](https://doc.rust-lang.org/nightly/book/) is an excellent place to start.

Since an Oasis service is just a Rust program with an extra library and build step, we can use standard Rust tooling.
Accordingly, you can create a new project using Rust's package manager, `cargo`:

```
oasis init ballot && cd ballot
```

If you type `ls -r`  you will find yourself in a Git repo that has been populated with `Cargo.toml` and `src/main.rs`, among other things.
If you're coming from JavaScript, `Cargo.toml` is the Rust version of `package.json` and `main.rs` is akin to `index.js`.
For more information, the [Cargo book](https://doc.rust-lang.org/nightly/cargo/) is an fine reference.
The [Creating a New Package](https://doc.rust-lang.org/nightly/cargo/guide/creating-a-new-project.html), [Dependencies](https://doc.rust-lang.org/nightly/cargo/guide/dependencies.html), and [Package Layout](https://doc.rust-lang.org/nightly/cargo/guide/project-layout.html) sections are particularly relevant for this tutorial.

## Setting up dependencies

Dependencies are specified in the _package manifest_: `Cargo.toml`.
If you open `Cargo.toml`, you'll see a line at the bottom of the file that says `[dependencies]`, which is the syntax for a TOML table called `dependencies`.
At this point you're probably thinking that this is where you'd add the necessary library dependencies.

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
You'll also want to add build and dev (test) dependencies:

```toml
[dev-dependencies]
oasis-test = "0.2"
```

[`oasis-test`](https://docs.rs/oasis-test) is an in-memory blockchain simulator that you can use to semi-integration test your services.

## Defining the Ballot Service

### From Cargo to Cargo Cult

Let's start with some scaffolding.
Pop open `main.rs` and add some lines:

```rust
use oasis_std::{Address, Context};

#[derive(oasis_std::Service)]
pub struct Ballot {}

fn main() {
  oasis_std::service!(Ballot);
}
```

There are three things going on here, but none of them are particularly eventful.

The first line has a [use](https://doc.rust-lang.org/reference/items/use-declarations.html) (import) statement that tells the Rust compiler where to look for the `Address` and `Context` types that we'll use later.

The next group defines an empty struct (think object) that _derives_ (automatically implements) the `Service` [trait](https://doc.rust-lang.org/rust-by-example/trait.html), which allows it to be stored on the blockchain.

Finally, there's a main function that has the `oasis_std::service!` macro with the name of your service as an argument.
The macro generates a dispatcher that processes an incoming request–-it's just like a webserver listener.
You can include code before and after the macro invocation, if you so desire.

Okay, enough boilerplate.
Now for the actual content!

### Defining service state

The remaining steps to defining a service are 1) deciding what is contained in the state and 2) implementing the RPCs that manipulate the state.

The fields of service state are defined in the struct annotated with `#[derive(Service)]`.
In our case, it's `Ballot` and it should end up looking like this:

```rust
#[derive(Service)]
pub struct Ballot {
    description: String,
    candidates: Vec<String>,
    tally: Vec<u32>,
    accepting_votes: bool,
    admin: Address,
    voters: map_vec::Map<Address, u32>,
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

Like any Rust struct, a service state object can have methods attached using an [`impl` item](https://doc.rust-lang.org/std/keyword.impl.html).
In our case, all of the RPCs will be public functions inside of an `impl Ballot { ... }`.

#### The constructor

All services must have a constructor that returns an instance of the state.
The constructor is called before a service is deployed and initializes the state object.
As in normal Rust parlance, the constructor is `new`.

Here's the constructor for a `Ballot`.

```rust
pub fn new(ctx: &Context, description: String, candidates: Vec<String>) -> Self {
    Self {
        description,
        tally: vec![0; candidates.len()],
        candidates,
        accepting_votes: true,
        admin: ctx.sender(),
        voters: map_vec::Map::new(),
    }
}
```

Let's break that down a bit.
First the function signature.

```rust
pub fn new(ctx: &Context, description: String, candidates: Vec<String>) -> Self
```

The `pub` is the visibility modifier and denotes that the function is an RPC method.
`ctx: &Context` is a reference to a [`Context`](https://docs.rs/oasis-std/0.1.0/oasis-std/exe/struct.Context.html) object that contains the---you guessed it---context of the invoked method.
`description` and `candidates` are `String` arguments that are passed in by the client.
`-> Self` denotes that the function returns a `Self`, which is just an alias to the `<Thing>` in `impl <Thing>`.
The constructor must return either `Self` or `<Thing>`.

### Some simple getters

It'd probably be helpful if clients could retrieve the description of the ballot and the names of the candidates, right?
One could even imagine a web app that finds public polls and shows them in a spiffy UI.

With this use case in mind, let's add some methods that return the desired data.

```rust
/// Returns the description of this ballot.
pub fn description(&self, _ctx: &Context) -> &str {
    &self.description
}

/// Returns the candidates being voted upon.
pub fn candidates(&self, _ctx: &Context) -> Vec<&str> {
    self.candidates.iter().map(String::as_ref).collect()
}
```

These are similar to the constructor but a bit different.
In non-constructor RPC methods, we have access to the state of the service, as provided by a reference to `self`.
We can pick the items out of `self` that we want and return them to the user.
Note that _all_ RPC methods---even those that do not use `self` and `Context`---receive these two arguments, but you are free to ignore them.

### Mutating state

Now to implement the core of the ballot service.

```rust
/// Cast a vote for a candidate.
/// `candidate_num` is the index of the chosen candidate in `Ballot::candidates`.
/// If you have already voted, this will change your vote to the new candidate.
/// Voting for an invalid candidate or after the ballot has closed will return an `Err`.
pub fn vote(&mut self, ctx: &Context, candidate_num: u32) -> Result<(), &str> {
    if !self.accepting_votes {
        return Err("Voting is closed.");
    }
    if candidate_num as usize >= self.candidates.len() {
        return Err(&format!("Invalid candidate `{}`.", candidate_num));
    }
    if let Some(prev_vote) = self.voters.insert(ctx.sender(), candidate_num) {
        self.tally[prev_vote as usize] -= 1;
    }
    self.tally[candidate_num as usize] += 1;
    Ok(())
}

/// Closes this ballot so that it no longer collects votes.
/// Only the ballot creator can close voting.
pub fn close(&mut self, ctx: &Context) -> Result<(), &str> {
    if self.admin != ctx.sender() {
        return Err("You cannot close the ballot.");
    }
    self.accepting_votes = false;
    Ok(())
}
```

Again, pretty close to what we've already seen.
`pub fn`s, `Context`s, and all that.
If you look closely, though, you'll see that `&self` has changed to `&mut self`, but this is just Rust's way to know that you want a mutable reference to `self`; it just _happens_ to be the case that modifying `self` will be persisted to storage.

The other new thing here is error handling.
In Rust, this is done by returning a [`Result<T, E>`](https://doc.rust-lang.org/std/result/index.html).
The `T` type in both `Result`-returning functions is nothing: `()`, but we return string slices as errors to let the caller know what went wrong.
Returning errors will _not_ revert the transaction, but panicking will.
You can trigger a panic using the `panic!` macro (or, if you look closely, the overflowing arithmetic in `vote`).

A-okay, this is starting to look like a ballot service to me!

### Winner, winner!

And what ballot would be complete without a way to tell who got the most votes?
(Other than a rigged ballot, perhaps, but that's why you're using blockchain!)
Let's add one more getter:

```rust
/// Returns the index of the candidate with the most votes.
/// This method can only be called after voting has closed.
pub fn winner(&self, _ctx: &Context) -> Result<u32, &str> {
    if self.accepting_votes {
        return Err("Voting is not closed.");
    }
    Ok(self
        .tally
        .iter()
        .enumerate()
        .max_by_key(|(_i, v)| *v)
        .unwrap()
        .0 as u32)
}
```

## Testing

Although Rust might sometimes feel like "if it compiles, it works," it's nice to be able to convince oneself of correctness through tests.
"But I just copied the code you gave me?" say you, the diligent reader.
What? You think tutorial code _just works_?
What kind of developer experience would that be!
You'd better believe that there's some subtle bug in here somewhere.

At the beginning of the tutorial, Cargo generated a bit of test scaffolding at the bottom of your `lib.rs`.
It should look a like this:

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
```

The [Rust book](https://doc.rust-lang.org/book/ch11-00-testing.html), as ever, will tell you all you need to know about `#[cfg(test)]`, `#[test]`, and the like.
For our purposes, we'll want to replace the generated code with the following chunk.
I promise that this isn't where the bug is.

```rust
#[cfg(test)]
mod tests {
    use super::*;

    /// Creates a new account and a `Context` with the new account as the sender.
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

        assert_eq!(ballot.winner(&voter_ctx).unwrap(), 1);
    }
}
```

There are two things to note here.
The first is that, when external to the service (i.e. not in `mod service`), `Ballot` refers to the service client which can deploy and/or interact with a deployed service.
The other is that you can create your own `Context` to pass to the service RPCs.
When testing, you can explicitly set the `sender`, but this will be your account when deploying in production.
Testing accounts are created using `oasis_test::create_account`.

You can now run the test using `oasis test`.
(protip: use `oasis test -- --nocapture` to pass through stdout and stderr).
This will run your tests using the blockchain simulator in `oasis-test`.
If all goes well, you should see your test pass.
Okay, so maybe there was no bug, but at least you now know how to test your service!

## Onward to (messages of) victory!

Congratulations on completing the first tutorial!
You can now imagine that you could hold elections on dinner, your fantasy sportsball team, or the supreme ruler of your digital nation state (digital nation state not included).

Up next is a confidential message board service that demonstrates more advanced concepts like events and custom types.
