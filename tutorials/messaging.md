# Creating a Private Chat Server

In this tutorial we will create a private, uncensorable messaging service.
This tutorial demonstrates intermediate concepts: events and composed types.

## Prerequisites

This tutorial assumes that you're already familiar with the concepts presented in the [previous tutorial](../ballot-tutorial).
As such, this won't be a step-by-step tutorial, but rather more of a sightseeing tour.
The full example can be found [here](https://github.com/oasislabs/oasis-rs/tree/master/examples/messaging).

## Optional and User-Defined Types

### Optional types

Any item of state or RPC argument can be made optional by wrapping it in [`Option`](https://doc.rust-lang.org/std/option/enum.Option.html) type.
`Option` is comparable to `null`/`None`/`Maybe` in other languages.
You will hopefully find this very unsurprising.

You'll find the first use of `Option` in the definition of the `MessageBoard` service state on [line 17](https://github.com/oasislabs/oasis-rs/blob/master/examples/messaging/src/main.rs#L17):

```rust
#[derive(Service)]
pub struct MessageBoard {
    // ...
    bcast_char_limit: Option<u32>,
    // ...
}
```

and, on [line 242](https://github.com/oasislabs/oasis-rs/blob/master/examples/messaging/src/main.rs#L242), an example of setting the character limit to one: `Some(1)`.

On [line 148](https://github.com/oasislabs/oasis-rs/blob/master/examples/messaging/src/main.rs#L148) a tuple of optional types are observed in the context of an RPC function signature: `range: (Option<PostId>, Option<PostId>)`.

### User-defined types

Any composition of RPC types is an RPC type.
So basically things like `HashMap<Vec<(u8, i8)>, Option<String>>` and any `struct` containing things like that.
As a concrete example, on [line 45](https://github.com/oasislabs/oasis-rs/blob/master/examples/messaging/src/main.rs#L45), we define a `Message` with the fields `user: UserId` and `text: String`.

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct Message {
    from: UserId,
    text: String,
}
```

There's no special syntax for this; the new type is just a Rust struct.
Like any struct you can add methods and trait implementations using `impl` and `#[derive(..)]`.
Indeed, we derive `PartialEq` on we `Message` so that we can `assert_eq!` in the tests.

Then, on [line 33](https://github.com/oasislabs/oasis-rs/blob/master/examples/messaging/src/main.rs#L33) we increase the level of abstraction by creating a `Post` type that stores a list of comments as `Vec<Message>`.

```rust
pub struct Post {
    // ...
    comments: Vec<Message>,
}
```

And a `MessageBoard` then stores a list of `Posts`.

## Events!

Whereas RPC methods send data back to the caller, events send data to every client watching the blockchain.

Events are a versatile primitive and can be used for beyond the standard "hey something happened!" that one would see in Node.js.
For example, because events are emitted by confidential services running on the Oasis platform, they can be used to notarize their inputs.
Concretely, one could make a validation service that certifies its input by emitting a hash of the data; because the service runs on the Oasis platform, clients can trust the certificate.
Furthermore, confidential services can securely encrypt event data so that it can only be read by a restricted set of recipients.
Enough exposition, though: on to the main event!

### Defining events

Events are defined similarly to service state in that they're (de)serializable structs that derive a particular trait.
For events, they derive [`Event`](https://docs.rs/oasis-std/latest/oasis_std/exe/trait.Event.html) instead of [`Service`](https://docs.rs/oasis-std/latest/oasis_std/exe/trait.Service.html).
Aptly named, yes?

The message board helpfully notifies participants of a new post or direct message using the `MessagePosted` event on [line 61](https://github.com/oasislabs/oasis-rs/blob/master/examples/messaging/src/main.rs#L61) (reproduced below).
The [comment above the definition](https://github.com/oasislabs/oasis-rs/blob/master/examples/messaging/src/main.rs#L55-L59) explains how events might be used safely in a confidential context.

```rust
#[derive(Serialize, Deserialize, Event)]
pub struct MessagePosted {
    #[indexed]
    pub author: UserId,
    #[indexed]
    pub recipient: Option<UserId>,
}
```

The only thing that should give you pause here is the `#[indexed]` attribute.
The explanation is simple: the contents of a field annotated with `#[indexed]` will be... wait for it... indexed so that clients watching the blockchain can efficiently find matching events.
Note that currently only three events may be indexed, but this may change in the future.
And, of course, events may contain as much non-indexed data as you want.
All data, indexed and otherwise, is emitted with the event.

### Emitting events

Speaking of emitting events, here's how to do it!
Just construct the event struct and the `Event` trait provides the rest:

```rust
Event::emit(&MessagePosted {
    author: ctx.sender(),
    recipient: None,
});
```

or, equivalently, as called on the event object itself:

```rust
MessagePosted {
    author: ctx.sender(),
    recipient: None,
}.emit()
```

Hopefully you found that exposition of events eventful!  
Bonus joke: What's a blockchain developer's favorite event? A block party! Ha ha.

"Ugh, get this over with already," you think to yourself.

## You made it!

Congratulations on completing the second tutorial!
You should now feel confident that you can confidentially discuss your dinner ballot choices, trash talk other sportsball teams, and keep up with your community of fellow Rust enthusiasts.

Well, that's basically all there is to writing blockchain services.
The only other thing to mention is that there's a wealth of libraries for you to use on [crates.io](https://crates.io), the Cargo registry (c.f. NPM).
You're now fully equipped to start building on the Oasis platform.
We look forward to seeing what you create!
If you need any help, you can check out the [oasis.js API reference](https://oasis-labs-oasis-client.readthedocs-hosted.com/en/latest/) and get support from the [community](https://join.slack.com/t/oasiscommunity/shared_invite/enQtNjQ5MTA3NTgyOTkzLWIxNTg1ZWZmOTIwNmQ2MTg1YmU0MzgyMzk3OWM2ZWQ4NTQ0ZDJkNTBmMTdlM2JhODllYjg5YmJkODc2NzgwNTg).
