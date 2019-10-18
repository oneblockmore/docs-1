(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{222:function(e,t,a){"use strict";a.r(t);var s=a(0),o=Object(s.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"quickstart"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#quickstart"}},[e._v("#")]),e._v(" Quickstart")]),e._v(" "),a("p",[e._v("In this guide we will take you through setting up your Oasis dev environment, testing a simple Rust service using cargo, testing the same service using a locally running blockchain, and finally testing it using our Devnet 2.0.")]),e._v(" "),a("p",[e._v("If you run into any issues or have a question, you can chat with us in our public "),a("a",{attrs:{href:"https://join.slack.com/t/oasiscommunity/shared_invite/enQtNjQ5MTA3NTgyOTkzLWIxNTg1ZWZmOTIwNmQ2MTg1YmU0MzgyMzk3OWM2ZWQ4NTQ0ZDJkNTBmMTdlM2JhODllYjg5YmJkODc2NzgwNTg",target:"_blank",rel:"noopener noreferrer"}},[e._v("Slack channel"),a("OutboundLink")],1),e._v(".")]),e._v(" "),a("h2",{attrs:{id:"set-up-the-oasis-sdk"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#set-up-the-oasis-sdk"}},[e._v("#")]),e._v(" Set Up the Oasis SDK")]),e._v(" "),a("h3",{attrs:{id:"install-the-oasis-toolchain"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#install-the-oasis-toolchain"}},[e._v("#")]),e._v(" Install the Oasis Toolchain")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("curl --proto '=https' --tlsv1.2 -sSL https://get.oasis.dev | python\n")])])]),a("p",[e._v("Alternatively, pipe into "),a("code",[e._v("python - --help")]),e._v(" to see installation options.")]),e._v(" "),a("h2",{attrs:{id:"unit-test-the-hello-world-service-using-cargo"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#unit-test-the-hello-world-service-using-cargo"}},[e._v("#")]),e._v(' Unit Test the "Hello World" Service Using Cargo')]),e._v(" "),a("ol",[a("li",[a("code",[e._v("git clone https://github.com/oasislabs/tutorials")])]),e._v(" "),a("li",[a("code",[e._v("cd tutorials/hello-world/service")])]),e._v(" "),a("li",[a("code",[e._v("oasis test -- --nocapture")])])]),e._v(" "),a("p",[e._v("The test will do the following:")]),e._v(" "),a("ol",[a("li",[e._v('Retrieve "Hello World!" in Slovenian')]),e._v(" "),a("li",[e._v('Attempt to retrieve "Hello World!" in Samoan, but fail because it doesn\'t exist')]),e._v(" "),a("li",[e._v("Attempt to insert a duplicate greeting (this will fail)")]),e._v(" "),a("li",[e._v('Insert "Hello World!" in Samoan')]),e._v(" "),a("li",[e._v('Retrieve "Hello World!"" successfully in Samoan')])]),e._v(" "),a("p",[e._v("You should see the following console output:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('running 1 test\nIn Slovenian: "Pozdravljen, svet!"\nIn Samoan: None\nAdding "Zeno World!" for "en"\nErr(DuplicateEntry)\nAdding "alofa fiafia i le lalolagi!" for "ws"\nIn Samoan: "alofa fiafia i le lalolagi!"\ntest tests::test_paths ... ok\n\ntest result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out\n')])])]),a("p",[e._v("Great!\nNow that the tests pass, it's time build the service for deployment and test it on the local chain.")]),e._v(" "),a("h2",{attrs:{id:"integration-test-using-the-local-chain"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#integration-test-using-the-local-chain"}},[e._v("#")]),e._v(" Integration Test Using the Local Chain")]),e._v(" "),a("p",[e._v("In this step we will use the JavaScript-based test in the test directory.\nThis script uses "),a("a",{attrs:{href:"https://github.com/oasislabs/oasis.js",target:"_blank",rel:"noopener noreferrer"}},[e._v("oasis.js"),a("OutboundLink")],1),e._v(" to interact with either the local chain or Devnet 2.0.")]),e._v(" "),a("ol",[a("li",[a("code",[e._v("oasis build")])]),e._v(" "),a("li",[a("code",[e._v("cd ../app")])]),e._v(" "),a("li",[e._v("Install app dependencies using "),a("code",[e._v("oasis build")])]),e._v(" "),a("li",[e._v("In a separate terminal, run the local chain using "),a("code",[e._v("oasis chain")])])]),e._v(" "),a("p",[e._v("You can now test on the local chain using "),a("code",[e._v("oasis test")]),e._v(".\nNote that the "),a("code",[e._v("app")]),e._v(" tests will run when in a subdirectory of "),a("code",[e._v("app")]),e._v(". You will see the following output,")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v(" PASS  test/service.spec.ts (5.965s)\n  HelloWorld Test\n    ✓ deployed (2ms)\n    ✓ known greeting (409ms)\n    ✓ insert new greeting in Samoan (400ms)\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total\n")])])]),a("h2",{attrs:{id:"deploy-on-devnet-2-0"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#deploy-on-devnet-2-0"}},[e._v("#")]),e._v(" Deploy on Devnet 2.0")]),e._v(" "),a("ol",[a("li",[e._v("Login to the "),a("a",{attrs:{href:"https://dashboard.oasiscloud.io",target:"_blank",rel:"noopener noreferrer"}},[e._v("Oasis developer dashboard"),a("OutboundLink")],1),e._v(" and visit "),a("code",[e._v("My Account")]),e._v(".")]),e._v(" "),a("li",[e._v("Make sure you are in a secure location, and then "),a("em",[e._v("Click to reveal")]),e._v(" your API token in the "),a("code",[e._v("Credentials")]),e._v(" section of the "),a("code",[e._v("Account Info")]),e._v(" tab. You must never lose your API token nor share it with anyone!")]),e._v(" "),a("li",[e._v("Give your local toolchain access to deploy services on your behalf by running the following command, which will begin to read your credential from stdin.\nYou should then paste your credential in and hit enter."),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("oasis config profile.default.credential -\n")])])])])]),e._v(" "),a("p",[e._v("You can now deploy your service to Devnet 2.0, using "),a("code",[e._v("oasis deploy")]),e._v(".\nWhen you run that command, with any luck, you'll see something like the following:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("   Deploying hello-world\n         ...\n    Deployed HelloWorld at 0xf8b476862dd4bcaaabb988aa5a459d95e319ac0e\n")])])]),a("p",[e._v("You can now point an app at "),a("code",[e._v("0xf8b476862dd4bcaaabb988aa5a459d95e319ac0e")]),e._v(" using the client's "),a("a",{attrs:{href:"https://oasis-labs-oasis-client.readthedocs-hosted.com/en/latest/service.html#service-at",target:"_blank",rel:"noopener noreferrer"}},[e._v("Service.at"),a("OutboundLink")],1),e._v(" constructor and interact with the spiffy decentralized backend you just deployed!")]),e._v(" "),a("h2",{attrs:{id:"where-to-go-from-here"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#where-to-go-from-here"}},[e._v("#")]),e._v(" Where to go from here?")]),e._v(" "),a("ul",[a("li",[e._v("Check out the "),a("a",{attrs:{href:"/tutorials/ballot"}},[e._v("tutorials")]),e._v("!")]),e._v(" "),a("li",[a("a",{attrs:{href:"https://doc.rust-lang.org/book/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Learn Rust!"),a("OutboundLink")],1),e._v(" (protip: if you use DuckDuckGo, you can search the Rust docs with "),a("code",[e._v("!rust <query>")]),e._v(")")]),e._v(" "),a("li",[e._v("Browse "),a("a",{attrs:{href:"https://crates.io",target:"_blank",rel:"noopener noreferrer"}},[e._v("crates.io"),a("OutboundLink")],1),e._v(" for libraries to use in your services")])])])}),[],!1,null,null,null);t.default=o.exports}}]);