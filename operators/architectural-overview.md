# Architectural Overview

As an operator of a Node on the Oasis Network, it is suggested that you have an
understanding of the system architecture of the Oasis Network. Here we will
provide a high level overview of the Oasis Network's architecture. This overview
is used to provide enough guidance to be useful for the purposes of getting
started as a Node Operator. In the future, our blockchain paper, which contains
much more in-depth information, will be made available.

## Modular Architecture

The Oasis Network uses a modular architecture similar to that of a Service
Oriented Archiecture or a Microservices Architecture. Any given node
participates in one of many different committees. These committees each have
different responsibilities in the execution of smart contracts on the Oasis
Network. The responsibilities of these committees can be mapped to a set of 4
different layers: Consensus, Compute (Confidential and Non-confidential),
Storage, and Key Management. For a Node Operator, these layers map distinctly to
different classes Nodes and potentially to different hardware.

### Transaction Processing Diagram

![Transaction Processing](/operator_images/web3_diagram_v2.png)

## Networking Protocols

The Oasis Network uses 3 main protocols for communication:

* [Tendermint](https://github.com/tendermint/tendermint)
* [grpc](https://grpc.io/)
* [libp2p](https://github.com/libp2p)

## Confidentiality

Confidentiality is achieved in the Oasis Network by relying on trusted execution
environments (TEEs) to secure the execution of any given smart contract.
Initially, the Oasis Network will utilize Intel SGX. As more TEE technologies
mature, we expect to support more than TEEs than Intel SGX.
