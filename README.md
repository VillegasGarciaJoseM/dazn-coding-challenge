# dazn-coding-challenge
The purpose of this service is to show the technical knowledge of Javascript and Node, as well as the analytical skills of the candidate José Manuel Villegas García.This is a service made only for 

# Installation
This application run in node, so **npm** and **node** must be installed in the system. If you haven't installed them yet please, follow the instructions in [this tutorial](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

To install all the dependencies you must run 
>npm install

# Run the service locally
First we need to instantiate the database
> npm run database-init

Then, you just have to execute this command to run the service,

> npm start

# Tests
To run the tests, execute this command
> npm test 

# Assumptions 
- Assumption 1: I have decided that the max_devices attribute returned by the external API entitlement corresponds to the maximum number of playable devices that a user can have.

# Future work
- More unit testings: I couldn't make a good coverage of the service. There are still some blocks of code that are not being tested. 
- Integration tests: integration tests are missing. It is important as the integration with the database is critical for the solution-
- Log service: An error monitoring is important and it is not included.
