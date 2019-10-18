(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{214:function(t,a,e){"use strict";e.r(a);var s=e(0),r=Object(s.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"utils"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils"}},[t._v("#")]),t._v(" utils")]),t._v(" "),e("p",[e("code",[t._v("oasis.utils")]),t._v(" provides a collection of client utilities.")]),t._v(" "),e("h2",{attrs:{id:"utils-encrypt"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils-encrypt"}},[t._v("#")]),t._v(" utils.encrypt")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[t._v("utils"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("encrypt")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n  nonce"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  plaintext"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  peerPublicKey"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  publicKey"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  privateKey"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  aad"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h3",{attrs:{id:"parameters"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#parameters"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),e("ul",[e("li",[e("code",[t._v("nonce")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": The nonce used to encrypt the ciphertext.")]),t._v(" "),e("li",[e("code",[t._v("plaintext")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": The text to be encrypted")]),t._v(" "),e("li",[e("code",[t._v("peerPublicKey")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": The public key to which the ciphertext will be encrypted.")]),t._v(" "),e("li",[e("code",[t._v("publicKey")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": The public key of the entity encrypting the data.")]),t._v(" "),e("li",[e("code",[t._v("privateKey")]),t._v(" - "),e("code",[t._v("Uint7Array")]),t._v(": The private key of the entity encrypting the data.")]),t._v(" "),e("li",[e("code",[t._v("aad")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(" the additional authenticated data for the AEAD.")])]),t._v(" "),e("h3",{attrs:{id:"returns"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#returns"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),e("p",[e("code",[t._v("Uint8Array")]),t._v(": The encoded wire format of the ciphertext "),e("code",[t._v("PUBLIC_KEY || CIPHER_LENGTH || AAD_LENGTH || CIPHER ||AAD || NONCE")]),t._v(", where "),e("code",[t._v("CIPHER_LENGTH")]),t._v(" AND "),e("code",[t._v("AAD_LENGTH")]),t._v(" are encoded as big endian uint64.")]),t._v(" "),e("h2",{attrs:{id:"utils-decrypt"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils-decrypt"}},[t._v("#")]),t._v(" utils.decrypt")]),t._v(" "),e("p",[t._v("Decrypts the given ciphertext using "),e("a",{attrs:{href:"https://github.com/oasislabs/deoxysii.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("deoxysii.js"),e("OutboundLink")],1),t._v(" and the wire format specified above.")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[t._v("utils"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("decrypt")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("encryption"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" secretKey"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h3",{attrs:{id:"parameters-2"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#parameters-2"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("encryption")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": The encrypted data in the wire formated specified above.")]),t._v(" "),e("li",[e("code",[t._v("secretKey")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": The secret key to which the data was encrypted.")])]),t._v(" "),e("h3",{attrs:{id:"returns-2"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#returns-2"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),e("p",[e("code",[t._v("Object")]),t._v(": The decryption of the object with a key for each component of the decryption.")]),t._v(" "),e("ul",[e("li",[e("code",[t._v("nonce")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": The nonce used to encrypt the ciphertext.")]),t._v(" "),e("li",[e("code",[t._v("plaintext")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": The decrypted ciphertext.")]),t._v(" "),e("li",[e("code",[t._v("peerPublicKey")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": The public key from which the ciphertext encrypted.")]),t._v(" "),e("li",[e("code",[t._v("aad")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(" the additional authenticated data for the AEAD.")])]),t._v(" "),e("h2",{attrs:{id:"utils-header-parsefromcode"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils-header-parsefromcode"}},[t._v("#")]),t._v(" utils.header.parseFromCode")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[t._v("oasis"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("utils"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("header"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("parseHex")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("deploycode"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h3",{attrs:{id:"parameters-3"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#parameters-3"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("deploycode")]),t._v(" - "),e("code",[t._v("Uint8Array | String")]),t._v(": The deployed bytecode of a service, prefixed with the header wire format:")])]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[t._v("b"),e("span",{pre:!0,attrs:{class:"token string"}},[t._v("'\\0sis'")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("||")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("version")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),t._v(" bytes big endian"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("||")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("length")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),t._v(" bytes big endian"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("||")]),t._v(" json"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("header\n")])])]),e("h3",{attrs:{id:"returns-3"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#returns-3"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),e("p",[e("code",[t._v("Object")]),t._v(":  The deploy header with all fields.")]),t._v(" "),e("ul",[e("li",[e("code",[t._v("version")]),t._v(" - "),e("code",[t._v("number")]),t._v(": The version number of the header.")]),t._v(" "),e("li",[e("code",[t._v("expirty")]),t._v(" - "),e("code",[t._v("number")]),t._v(": Service expiry timestamp")]),t._v(" "),e("li",[e("code",[t._v("confidential")]),t._v(" -  "),e("code",[t._v("boolean")]),t._v(": True if the service is confidential.")])]),t._v(" "),e("h2",{attrs:{id:"utils-bytes-parsehex"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils-bytes-parsehex"}},[t._v("#")]),t._v(" utils.bytes.parseHex")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[t._v("oasis"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("utils"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("bytes"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("parseHex")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("hexStr"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h3",{attrs:{id:"parameters-4"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#parameters-4"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("hexStr")]),t._v(" - "),e("code",[t._v("String")]),t._v(": Hex string to parse.")])]),t._v(" "),e("h3",{attrs:{id:"returns-4"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#returns-4"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),e("p",[e("code",[t._v("Uint8Array")]),t._v(": Transformed representation the given hex string.")]),t._v(" "),e("h2",{attrs:{id:"utils-bytes-tohex"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils-bytes-tohex"}},[t._v("#")]),t._v(" utils.bytes.toHex")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("oasis.utils.bytes.toHex(byteArray);\n")])])]),e("h3",{attrs:{id:"parameters-5"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#parameters-5"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("byteArray")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": Byte array to convert into a hex string")])]),t._v(" "),e("h3",{attrs:{id:"returns-5"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#returns-5"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),e("p",[e("code",[t._v("String")]),t._v(": Transformed representation of the given byte array.")]),t._v(" "),e("h2",{attrs:{id:"utils-bytes-encodeutf8"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils-bytes-encodeutf8"}},[t._v("#")]),t._v(" utils.bytes.encodeUtf8")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[t._v("oasis"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("utils"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("header"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("encodeUtf8")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("input"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h3",{attrs:{id:"parameters-6"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#parameters-6"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("input")]),t._v(" - "),e("code",[t._v("string")]),t._v(": String to encode into a utf8 encoded byte array")])]),t._v(" "),e("h3",{attrs:{id:"returns-6"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#returns-6"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),e("p",[e("code",[t._v("Uint8Array")]),t._v(": Utf8 encoded byte earray")]),t._v(" "),e("h2",{attrs:{id:"utils-bytes-decodeutf8"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils-bytes-decodeutf8"}},[t._v("#")]),t._v(" utils.bytes.decodeUtf8")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[t._v("oasis"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("utils"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("header"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("decodeUtf8")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("input"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h3",{attrs:{id:"parameters-7"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#parameters-7"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("input")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": Byte array previously encoded with "),e("code",[t._v("utils.bytes.encodeUtf8")])])]),t._v(" "),e("h3",{attrs:{id:"returns-7"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#returns-7"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),e("p",[e("code",[t._v("String")]),t._v(": Utf8 encoded string")]),t._v(" "),e("h2",{attrs:{id:"utils-cbor-encode"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils-cbor-encode"}},[t._v("#")]),t._v(" utils.cbor.encode")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[t._v("oasis"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("utils"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cbor"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("encode")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("input"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h3",{attrs:{id:"parameters-8"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#parameters-8"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("input")]),t._v(" - "),e("code",[t._v("Object")]),t._v(": JSON object to cbor encode")])]),t._v(" "),e("h3",{attrs:{id:"returns-8"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#returns-8"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),e("p",[e("code",[t._v("Uint8Array")]),t._v(": Cbor encoded byte array")]),t._v(" "),e("h2",{attrs:{id:"utils-cbor-decode"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils-cbor-decode"}},[t._v("#")]),t._v(" utils.cbor.decode")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[t._v("oasis"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("utils"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("cbor"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("decode")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("input"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h3",{attrs:{id:"parameters-9"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#parameters-9"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("input")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": Cbor encoded byte array")])]),t._v(" "),e("h3",{attrs:{id:"returns-9"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#returns-9"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),e("p",[e("code",[t._v("Object")]),t._v(": Decoded JSON object")]),t._v(" "),e("h2",{attrs:{id:"utils-keccak256"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils-keccak256"}},[t._v("#")]),t._v(" utils.keccak256")]),t._v(" "),e("p",[t._v("Keccak256 implementation from "),e("a",{attrs:{href:"https://github.com/emn178/js-sha3",target:"_blank",rel:"noopener noreferrer"}},[t._v("js-sha3"),e("OutboundLink")],1),t._v(".")]),t._v(" "),e("h2",{attrs:{id:"utils-idl-fromwasm"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils-idl-fromwasm"}},[t._v("#")]),t._v(" utils.idl.fromWasm")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[t._v("oasis"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("utils"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("idl"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("fromWasm")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bytecode"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("h3",{attrs:{id:"parameters-10"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#parameters-10"}},[t._v("#")]),t._v(" Parameters")]),t._v(" "),e("ol",[e("li",[e("code",[t._v("bytecode")]),t._v(" - "),e("code",[t._v("Uint8Array")]),t._v(": Raw wasi bytecode compiled with "),e("code",[t._v("oasis build")]),t._v(".\nSee the "),e("a",{attrs:{href:"https://github.com/oasislabs/oasis-cli",target:"_blank",rel:"noopener noreferrer"}},[t._v("oasis-cli"),e("OutboundLink")],1),t._v(".")])]),t._v(" "),e("h3",{attrs:{id:"returns-10"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#returns-10"}},[t._v("#")]),t._v(" Returns")]),t._v(" "),e("p",[e("code",[t._v("Promise<Object>")]),t._v(": Promise resolving to the Idl extracted from the "),e("code",[t._v("oasis-interface")]),t._v(" section of the given bytecode.")]),t._v(" "),e("h2",{attrs:{id:"utils-idl-fromwasmsync"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#utils-idl-fromwasmsync"}},[t._v("#")]),t._v(" utils.idl.fromWasmSync")]),t._v(" "),e("div",{staticClass:"language-javascript extra-class"},[e("pre",{pre:!0,attrs:{class:"language-javascript"}},[e("code",[t._v("oasis"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("utils"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("idl"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("fromWasmSync")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("input"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[t._v("A synchronous version of "),e("code",[t._v("utils.idl.fromWasm")]),t._v(".")])])}),[],!1,null,null,null);a.default=r.exports}}]);