# What Neon requires of a deployed TypeORM Postgres

Research for [What Neon requires of a deployed TypeORM Postgres](https://github.com/joseaplwork/junta/issues/18). This file records what Neon requires of the deployed API. It does not decide whether Junta should use Neon.

Scope of the question: only a future deployed database would move. Local development and CI stay on Postgres 16. The deployed environment uses one database. It does not use the end-to-end path that connects to a maintenance database named `postgres` and runs `CREATE DATABASE`.

This repo has no research-notes convention. This file is the note for that ticket.

## What the API connects with today

`databaseOptions` in `apps/api/src/app/database/database-options.ts` builds a TypeORM `DataSource` with `type: 'postgres'` and the fields host, port, username, password, and database name. It sets no `ssl` option and no connection URL. The Nest app and the migration CLI share those options (`apps/api/src/app/database/data-source.ts`). `loadDatabaseConfig` reads `DB_HOST`, `DB_PORT` (default 5432), `DB_USERNAME`, `DB_PASSWORD`, and `DB_NAME`.

Migrations are SQL run through `queryRunner.query`. The first migration runs `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"` and then creates tables, an enum type, and foreign keys. Later migrations alter, rename, and drop. None of them issues `CREATE DATABASE`, `CREATE TABLESPACE`, `CREATE INDEX CONCURRENTLY`, `LISTEN` / `NOTIFY`, a session-level `SET`, or an advisory lock. Startup calls `showMigrations` and refuses to boot while any migration is pending.

## Postgres 16, and how a project pins it

Postgres 16 is supported. Neon currently supports Postgres 14, 15, 16, 17, and 18, the five latest majors.

A project pins the **major** version by selecting it when the project is created. That major stays with the project. Moving to a newer major means creating a new project and migrating data. Neon does not support `pg_upgrade` for that move.

Neon does not pin a minor release. It runs only the latest minor of the chosen major and applies that minor the next time the compute restarts. Skipping a minor, or staying on an older 16.x, is not supported. As of the version-support page's August 2026 table, the Postgres 16 minor on Neon was 16.15. Check the live minor with `SELECT version();`, the project's Overview page, or `neon projects get <project_id> --output json` (`pg_version`).

A deployed Neon project created as Postgres 16 matches the major used in local development and CI. It will not stay on a chosen 16.x point release.

Sources:

- [Postgres version support](https://neon.com/docs/postgresql/postgres-version-support)
- [Upgrading your Postgres version](https://neon.com/docs/postgresql/postgres-upgrade)
- [Postgres compatibility](https://neon.com/docs/reference/compatibility) (versions)

## SSL

Neon requires SSL/TLS on every connection and rejects a client that does not use it, the same way a server with only `hostssl` lines in `pg_hba.conf` does.

Neon documents three `sslmode` values, from `require` through `verify-ca` to `verify-full`, and recommends `verify-full`. It also documents `channel_binding=require` (SCRAM-SHA-256-PLUS) as further protection against a man-in-the-middle. The TypeORM guide tells you to set `ssl: true` on the `DataSource` and to append `sslmode=require&channel_binding=require` to the connection string.

This API never sets `ssl`. In node-postgres, TLS starts only when `ssl` is set; otherwise the driver keeps the plain socket. With `ssl: true`, the driver upgrades the socket and, when the host is a hostname rather than an IP, sets TLS `servername` to that host. That `servername` is the SNI value Neon uses to route the connection to the compute. Neon returns `The endpoint ID is not specified` when the client does not send SNI. The `pg` version locked here, 8.16.0, sends SNI for a hostname once SSL is on, so the endpoint-id workaround is for older clients and for `libpq` before Postgres 14. The TypeORM guide's optional `pg-native` / `NODE_PG_FORCE_NATIVE` path uses `libpq`, where SNI depends on that library version. This API does not enable that path.

Channel binding is separate from the SSL requirement. Neon recommends `channel_binding=require` on the connection string. node-postgres 8.16.0 turns it on only when the client config sets `enableChannelBinding: true`.

The connection still uses host, port, username, password, and database name. Neon's examples use the endpoint hostname and port 5432, which is already this API's default port. The hostname is the Neon endpoint host, pooled or direct as below.

Sources:

- [Connect to Neon securely](https://neon.com/docs/connect/connect-securely)
- [Connect from TypeORM to Neon](https://neon.com/docs/guides/typeorm)
- [Connection errors: the endpoint ID is not specified](https://neon.com/docs/connect/connection-errors)
- [node-postgres SSL](https://node-postgres.com/features/ssl)
- [node-postgres 8.16.0 `connection.js` (sets `servername` when the host is not an IP)](https://github.com/brianc/node-postgres/blob/pg@8.16.0/packages/pg/lib/connection.js)
- [node-postgres 8.16.0 `client.js` (`enableChannelBinding`)](https://github.com/brianc/node-postgres/blob/pg@8.16.0/packages/pg/lib/client.js)

## Direct connection and the pooled endpoint

Neon exposes two hostnames for the same database. The direct host connects to Postgres. The pooled host is the same endpoint id with `-pooler` inserted, and it goes through PgBouncer in transaction mode (`pool_mode=transaction`).

Use the direct hostname for TypeORM migrations. Neon's TypeORM guide says a pooled string is for the application at runtime, and a direct string is required when running migrations, because transaction-mode pooling does not support every session-level operation migration tools rely on. The pooling guide lists schema migrations on the direct-connection row for the same reason. Session features the pooler does not keep are `SET` / `RESET`, `LISTEN` / `NOTIFY`, `WITH HOLD CURSOR`, SQL-level `PREPARE` / `DEALLOCATE`, temporary tables with `PRESERVE` / `DELETE ROWS`, `LOAD`, and session-level advisory locks.

`migration-run` and `migration-check` both use `databaseOptions`, so both need a connection Neon will accept (SSL, hostname, role). The direct-endpoint rule is the one Neon states for applying migrations. `migration-check` reads the schema; it does not get a separate pooling rule on the TypeORM page.

A direct connection counts against `max_connections` (about 100 to 4,000, depending on compute size, with 7 slots reserved). One migration session fits. The pooled endpoint exists so a running app can hold many client connections. The general connection guide also warns against stacking a client-side pool on top of the Neon pooler. TypeORM always uses a node-postgres `Pool`, and the TypeORM guide still says to point that runtime pool at the pooled hostname.

Sources:

- [Connect from TypeORM to Neon](https://neon.com/docs/guides/typeorm)
- [Connection pooling](https://neon.com/docs/connect/connection-pooling)
- [Choosing your connection method](https://neon.com/docs/connect/choose-connection)

## node-postgres or `@neondatabase/serverless`

For a long-running Node process, Neon says to use a TCP driver. On a persistent server (Railway, Render, a VPS, Docker, or any self-hosted process that stays up), the recommended drivers are `pg` (node-postgres), `postgres.js`, or `Bun.SQL`. The TypeORM row in that guide lists one driver: `pg`. The TypeORM guide says TypeORM connects through a node-postgres `Pool`, which is what `type: 'postgres'` already does.

`@neondatabase/serverless` is the driver for serverless and edge runtimes. It speaks HTTP or WebSockets instead of TCP. Its WebSocket `Pool` and `Client` exist so that code which expects the node-postgres API can run where TCP is unavailable. The driver requires Node.js 19 or later.

Where this API process will run is still open. If that process is a long-running Node server, Neon requires node-postgres, which this API already uses. The serverless driver is the requirement for an edge or serverless host without TCP, and it is not the driver Neon documents for TypeORM.

Sources:

- [Choosing your connection method](https://neon.com/docs/connect/choose-connection)
- [Connect from TypeORM to Neon](https://neon.com/docs/guides/typeorm)
- [Neon serverless driver](https://neon.com/docs/serverless/serverless-driver)

## What a role can and cannot do

There is no login as the Postgres `superuser`. Neon substitutes `neon_superuser`, which itself has `NOLOGIN`. Roles created in the Console, CLI, or API, including the role created with the project, are members of `neon_superuser` and inherit its privileges. Roles created with SQL are ordinary new roles and are not members.

Privileges on `neon_superuser` that matter here:

- `CREATEDB`. A member can run `CREATE DATABASE`. The name `postgres` is reserved, along with `template0` and `template1`, so it cannot be given to a database. Creating a database owned by the `neon_superuser` role itself is not permitted. This repo's migrations never create a database, and the deployed path does not use the maintenance-database flow, so `CREATEDB` and the reserved name do not block `migration-run` or `migration-check`.
- `CREATEROLE`, bypass RLS (projects created after 15 August 2023), replication, and broad read/write via `pg_read_all_data` and `pg_write_all_data`.
- `GRANT ALL` on tables and sequences in `public`.

On Postgres 15 and later, which includes 16, only the database owner has `CREATE` on the `public` schema. Other roles need `GRANT CREATE ON SCHEMA public`. The role Neon creates with the project owns the project's database (the default name is `neondb` when you do not choose one). That owner can create the tables, enum, and constraints in these migrations. A least-privilege SQL role cannot, until it is granted `CREATE` on the schema.

Extensions: a Neon role can install only extensions Neon supports. `uuid-ossp` is supported on Postgres 16 at version 1.1. The documented install statement is `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`, and the extensions table says to double-quote the name. The initial migration already runs that statement. Installing it does not require a support ticket or a preload library. `CREATE EXTENSION` from the migration is how Neon says to enable it.

`migration-check` needs a role that can connect and read the schema. It does not need `CREATEDB` or the superuser account. Run both commands as the database owner (the project role).

Sources:

- [Manage roles](https://neon.com/docs/manage/roles)
- [Postgres compatibility](https://neon.com/docs/reference/compatibility) (roles)
- [Manage databases](https://neon.com/docs/manage/databases) (SQL `CREATE DATABASE`, reserved names, owner and `public`)
- [Manage database access](https://neon.com/docs/manage/database-access) (public-schema privileges on Postgres 15+)
- [Postgres extensions](https://neon.com/docs/extensions/pg-extensions) (`uuid-ossp` on PG16, install with `CREATE EXTENSION`)
- [The uuid-ossp extension](https://neon.com/docs/extensions/uuid-ossp)

## What would stop the migration runner

The migration SQL can be applied unchanged. These are the conditions that stop the runner before that SQL succeeds:

1. **No SSL.** `databaseOptions` opens a plain connection. Neon rejects it. `migration-run` and `migration-check` both fail to connect until SSL is enabled on that shared config.
2. **The pooled hostname.** Applying TypeORM migrations has to use the direct hostname. The pooler is for the running app.
3. **A role that cannot create objects in `public`.** The project owner can. A SQL-created role without `CREATE` on `public` cannot apply the `CREATE TABLE`, `CREATE TYPE`, and `CREATE EXTENSION` statements.
4. **An unsupported extension.** `uuid-ossp` is supported, and the migration's statement matches Neon's install statement. An extension Neon does not list would fail here. Nothing else in these files is an extension.
5. **A short connect timeout against a suspended compute.** After 5 minutes without queries, Neon idles the compute (and on the Free plan it always suspends; scale to zero can be turned off only on a paid plan). The next connection wakes it, usually in a few seconds. The TypeORM guide says the client's default `connect_timeout` of 5 seconds can fire first, and to set `connect_timeout=10` on the connection string. node-postgres's `connectionTimeoutMillis` defaults to no timeout, and this `DataSource` sets neither a URL nor a timeout, so that 5-second default is not in force today. It becomes a failure mode if a timeout is added and left at a few seconds.
6. **SNI missing.** Routing needs the endpoint hostname in TLS SNI. node-postgres sends that when `ssl` is set and `DB_HOST` is the Neon hostname. An IP address in `DB_HOST` does not get SNI (`connection.js` leaves `servername` unset for IPs).

Checked against the documented incompatibilities and not present in these migrations: tablespaces, unlogged tables, `file_fdw`, `sslinfo`, `CREATE INDEX CONCURRENTLY`, session `SET`, `LISTEN` / `NOTIFY`, and `CREATE DATABASE`. Enums, `ALTER COLUMN ... TYPE ... USING`, renames, and drops are ordinary SQL, and Neon describes itself as Postgres aside from the differences in the compatibility page. None of those differences rewrites this SQL.

`idle_in_transaction_session_timeout` is 5 minutes (300000 milliseconds). These migrations are short DDL and do not sit idle inside a transaction, so that timeout does not stop them.

A long-running pool can later see its sockets closed when the compute suspends. That is a runtime reconnect concern for the Nest process, documented as an `SSL SYSCALL error: EOF detected` when a pooled connection is reused after suspend. It does not change the migration files.

Sources:

- [Connect to Neon securely](https://neon.com/docs/connect/connect-securely)
- [Connect from TypeORM to Neon](https://neon.com/docs/guides/typeorm) (direct hostname for migrations, `connect_timeout`)
- [Connection pooling](https://neon.com/docs/connect/connection-pooling)
- [Postgres compatibility](https://neon.com/docs/reference/compatibility) (tablespaces, unlogged tables, session context, scale to zero, the timeout parameter)
- [Connection errors](https://neon.com/docs/connect/connection-errors) (SNI, idle-in-transaction timeout stated as 5 minutes)
- [node-postgres `Client` config](https://node-postgres.com/apis/client) (`connectionTimeoutMillis` defaults to no timeout)
- [Connect an Express application to Neon](https://neon.com/docs/guides/express) (connection reset after the compute suspends)
