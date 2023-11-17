# How to set up the project

1. Postgres setup

Install postgres: https://www.postgresql.org/download/

Postgres Setup:

```
sudo -i -u postgres
psql
ALTER USER postgres PASSWORD 'mynewpassword';
```

For simplicity's sake, for your dev environemnt, set the password to 'postgres' or something else easy to remember. If you change it to something other than 'postgres', save it as you will need it later for setting up environment variables.

2. Project setup

Make an env file (a file called `.env` in the root folder of the project (the same folder that has `package.json` in it)) with the following line:

```
DATABASE_URL="postgres://postgres:postgres@localhost:5432/reviews?schema=public"
```

If you changed the root password or made a custom config, the format for the connection string is

```
DATABASE_URL="postgres://<USERNAME>:<PASSWORD>@localhost:<PORT>/reviews?schema=public"
```

Port 5432 is the postgres default.

Then run

```
pnpm i
npx prisma db push
npx prisma generate
npx prisma db seed
```

You can run `npx prisma studio` to visualize data in the databases;
Run `npx prisma db seed` to seed the database with tags

Admin page password setup:
Generate admin password:

```
openssl rand -hex 4096
```

Add line to env file:

```
SECRET_KEY="<random bytes>"

```

You can then access the page by going to /admin?password=\<the password you generated\>

Finally, for image upload support, ask ezra for lines to add in your env file

Planned features (in decreasing order of importance):

- item search
- email notifications for specific meals
- multiple dining hall support
