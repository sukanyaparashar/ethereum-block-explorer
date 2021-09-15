# Ethereum Block Explorer Tool

## Technologies Used

1) Nodejs and Expressjs to develop the backend API connecting to Ethereum blockchain network.
2) Angular 12.2.0 to develop the front-end UI for user input.

## Purpose:

This is a Ethereum block explorer tool which, given a range of blocks, displays Ether transfer report as follows-

1) How much Ether was transferred in total?
2) Which addresses received Ether and how much they received in total?
3) Which addresses sent Ether and how much they sent in total?
4) Which are the contract addresses which received Ether and how much they received in total?
5) Which are the contract addresses which sent Ether and how much did they received in total?
6) How many unique addresses sent Ether?
7) How many unique addresses received Ether?
8) How many uncles were there?
9) How many contracts were created?
10) What percentage of transactions were contract transactions?

## Installation:

1) Clone the repository
2) Navigate inside the directory and run -
	$ npm install
   This will download all the packages required.
3) Navigate to the ui directory inside the root directory -
	$ cd ui
	$ npm install
   This will download all the packages required to run the front-end application built using Angular version 12.2.0.

## Run automated test:

This project includes a simple solidity hello smart contract (inside the /contracts directory) and a compile.js file to compile the smart contract before using it to run the automated tests for sending Ether to the smart contract.

1) Inside the root directory, compile the smart contract -
	$ node compile.js
2) Run ganache-cli from a terminal -
	$ ganache-cli
3) From a different terminal, run the test -
	$ npm run test

## Run the Backend API:

The code includes the network for conecting to ganache-cli. If you need to connect to the Testnets using Infura, then change the /ethereum/main.js file by replacing the ethNetwork variable with the Infura url.

Keep the ganache-cli running in a separate terminal and inside the root directory, run -
	$ nodemon

## Run the Angular Application:

Keep the ganache-cli and backend API running in two different terminals.

Navigate inside the ui directory inside the root directory and run -
	$cd ui
	$ ng serve --open
Once you run this, it will automatically open a browser tab with http://localhost:4200 where the UI will be displayed for user input.










