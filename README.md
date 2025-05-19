# Sync-api

This project is a news sync system built with NestJS, TypeORM, and TypeScript.  
This backend service will manage the sync of news from webz to a postgres db and ensure proper system operation.


## Table of Contents

- [Installation](#Installation)
- [Environment Variables](#Environment-variables)
- [Migrations](#Migrations)


## Installation

1. Clone the repository:
    ```bash
    git clone git@github.com:sidhommoez/sync-api.git
    cd sync-api
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up the database:
    - Create a `.env` file in the root directory and add your  configuration:
    - look example.env file

## Environment Variables

| Variable              | Description                                                                          |
|-----------------------|--------------------------------------------------------------------------------------|
| `HOST`                | The host address for the application.                                                |
| `CORS_ORIGIN`         | The allowed origin for CORS requests.                                                |
| `NODE_ENV`            | The environment in which the application is running (e.g., development, production). |
| `LOG_LEVEL`           | The level of logging (e.g., debug, info, warn).                                      |
| `INIT_CONTAINER`      | Flag to initialize the container.                                                    |
| `PORT`                | The port on which the application will run.                                          |
| `PSQL_HOST`           | The host address for the PostgreSQL database.                                        |
| `PSQL_PORT`           | The port for the PostgreSQL database.                                                |
| `PSQL_USERNAME`       | The username for the PostgreSQL database.                                            |
| `PSQL_PASSWORD`       | The password for the PostgreSQL database.                                            |
| `PSQL_DB`             | The name of the PostgreSQL database.                                                 |
| `PSQL_DROP_SCHEMA`    | Flag to drop the schema on startup.                                                  |
| `PSQL_MIGRATIONS_DIR` | The directory for database migrations.                                               |
| `PSQL_MIGRATION`      | Flag to run migrations on startup.                                                   |
| `PSQL_POOL_SIZE`      | The pool size for database connections.                                              |
| `DB_LOGGING`          | Flag to enable database logging.                                                     |
| `WEBZ_TOKEN`          | Webz TOKEN.                                                                          |
| `WEBZ_BASE_URL`       | Webz base url.                                                                       |


## Usage

1. Start the application:
    ```bash
    npm run dev
    ```
   via docker (this will start the postgres db)
    ```bash
    docker-compose up -d
    ```

2. The application will be running at `http://localhost:3000`.

3. swagger documentation is available at `http://localhost:3000/docs`.

## Scripts 

Build: Builds the project using NestJS with tsc  
```bash
npm run build
```
Start: Starts the application  
```bash
npm run start
```
Dev: Starts the application in development mode with tsc and watch mode  
```bash
npm run dev
```
Lint: Runs ESLint to check for linting errors  
```bash
npm run lint
```
Lint Fix: Runs ESLint and automatically fixes linting errors  
```bash
npm run lint:fix
```
Test: Runs the tests using Vitest  
```bash
npm run test
```


## Migrations

If you have changes to your entities, you can generate a migration:
Migration Run: Runs the database migrations
```bash
npm run migration:run <your-migration-name>
```
