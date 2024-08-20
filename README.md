# Project Structure and Application Documentation

This project is designed to simulate a wallet service for managing user wallets and facilitating transactions between them. The project structure is organized into the following directories and files:

**index.ts**: This file defines the entry point of our app and showcases the usage of the functions defined in the *usecases* folder

**constants.ts**: This file defines constants for error codes, currencies, and exchange rates used throughout the application.

**utils/index.ts**: This file contains utility functions for creating success and error responses, generating unique IDs, validating currency matches, converting currencies, and validating email addresses.

**db/**: This folder is the db layer and consists of our db (array) and the persistence functions for interacting with the db. This functions should only be imported and used in the services folder.

**services/**: This folder contains the logic for each service and how they interact with the db layer. This is where other parts of the app utilizes any function to perform any action on the db. Services should not be imported into other services. If you need that, it means you need to create a *usecase* that does that.

**usecases/**: This folder contains the business logic of the app and it can make use of any and all services. If this was a Nextjs app, NextJs specific features can be implemented here.

**.gitignore**: This file specifies directories and files to be ignored by the Git version control system.

The application is designed to provide a simple wallet management system with the following features:

1. **Wallet Management**: Users can create, manage, and delete their wallets.
2. **Intra-User Transfers**: Users can transfer funds between their own wallets.
3. **Inter-User Transfers**: Users can transfer funds to other users' wallets.
4. **Transaction History**: The system maintains a record of all transactions, allowing users to view their transaction history. Not fully complete as getting transaction history wasn't worked on.
5. **Currency Conversion**: The system supports transactions in multiple currencies, with automatic conversion based on the exchange rate.

To use this application, follow these steps:

1. Initialize the project by running `npm install` or `yarn install`.
2. Start the application by running `npm run start` or `yarn start`.
3. Check your terminal console for the results of the computation.
