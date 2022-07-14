
![Twitter screenshot of me crying over how I managed to get it to work.](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/96b10d7d-5b49-4aab-8be8-79051638acc8/flexeetclub.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220714T061436Z&X-Amz-Expires=3600&X-Amz-Signature=cabc7d3cee7979cbcadf71c6b7a684f78305c8c2bf5bdb2cf8a932a7504ffc77&X-Amz-SignedHeaders=host&x-id=GetObject)

> This blog is not meant to be a tutorial for Remix, Prisma or Auth0. It is only meant to show how to setup a simple authentication system using them.

---

## Getting Started

For the curious ones, here’s the direct Repo link: https://github.com/ShubhamVerma1811/remix-prisma-auth0-starter

Or you can start off by installing these dependencies in the **existing Remix project.**.

I chose Vercel as the hosting platform while creating the project so you might see some file differences and remix config differences. But those should not matter.

```bash
yarn add @prisma/client remix-auth remix-auth-auth0
```

```bash
yarn add -D prisma ts-node typescript
```

---

## Project structure

```plain text
.
|-- README.md
|-- app
|   |-- entry.client.tsx
|   |-- entry.server.tsx
|   |-- root.tsx
|   |-- routes
|   |   |-- auth
|   |   |   |-- auth0
|   |   |   |   `-- callback.tsx
|   |   |   `-- auth0.tsx
|   |   |-- index.tsx
|   |   |-- login.tsx
|   |   `-- logout.tsx
|   |-- services
|   |   `-- session.server.ts
|   `-- utils
|       |-- auth.server.ts
|       `-- db.server.ts
|-- package.json
|-- prisma
|   |-- schema.prisma
|   `-- seed.ts
|-- public
|   |-- build
|   `-- favicon.ico
|-- remix.config.js
|-- remix.env.d.ts
|-- server.js
|-- tsconfig.json
`-- yarn.lock
```

---

## Integration

### Setup Prisma

You can directly follow the steps for this written in the Remix docs for Prisma

> https://remix.run/docs/en/v1/tutorials/jokes#connect-to-the-database

```typescript
// app/utils/db.server.ts
import { PrismaClient } from '@prisma/client';

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}

export { db };
```

### Creating session in Remix

So we can store the user’s session in the cookies

> More info on sessions in the Remix docs. https://remix.run/docs/en/v1/api/remix#using-sessions

```typescript
// app/services/session.server.ts
import { createCookieSessionStorage } from '@remix-run/node';

// export the whole sessionStorage object
export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ['s3cr3t'], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production', // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
export let { getSession, commitSession, destroySession } = sessionStorage;
```

### Creating the authenticator client that uses Auth0 strategy.

- In this file, you’ll be setting up the Auth0 strategy using remix-auth. You’ll be needing callback URL, client ID, client secret and tenant ID of your application.

- Here were are creating a new instance of the Authenticator from remix-auth.

- And creating Auth0 strategy config to the authenticator.

- The 2nd argument of the strategy takes a callback that would return you the Auth0 profile after successful login.

- We take that profile data and make an `upsert` operation using Prisma.

- `upsert` would either create a new user in the DB or return as the user that already exists.

```typescript
// app/utils/auth.server.ts
import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';
import { sessionStorage } from '~/services/session.server';
import { db as prisma } from './db.server';

// Create an instance of the authenticator, pass a generic (optional) with what your
// strategies will return and will be stored in the session

export const authenticator = new Authenticator(sessionStorage);

let auth0Strategy = new Auth0Strategy(
  {
    callbackURL: process.env.AUTH0_CALLBACK_URL!,
    clientID: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    domain: process.env.AUTH0_DOMAIN_URL!,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const email = profile.emails?.[0]?.value;
    // Get the user data from your DB or API using the tokens and profile
    return prisma.user.upsert({
      where: {
        email,
      },
      create: {
        email,
        name: profile.displayName,
      },
      update: {},
    });
  }
);

authenticator.use(auth0Strategy);
```

---

### Routing

### Create auth0 route.

```typescript
// app/routes/app/auth0/auth0.tsx
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/utils/auth.server';

// If user directly goes to this page, we redirect to login
export const loader: LoaderFunction = () => redirect('/login');

// Post request sent to this route would be handled by the authenticator and redirect you to the Auth0's login page.
export const action: ActionFunction = ({ request }) => {
  return authenticator.authenticate('auth0', request);
};
```

### Creating callback route

```typescript
// app/routes/app/auth0/callback.tsx
import type { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/utils/auth.server';

/*
We import the authenticator and based on the login state we redirect them to the
either success or failure redirect
*/

export const loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate('auth0', request, {
    successRedirect: '/',
    failureRedirect: '/login',
  });
};
```

### Creating login route

```typescript
import type { LoaderFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { authenticator } from '~/utils/auth.server';

// If the user lands on this page, we redirect back to / if they are already logged in.
export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });
};

// This form would take us to the auth0 route, which would redirect to the Auth0 login page.

export default function Login() {
  return (
    <Form action="/auth/auth0" method="post">
      <button>Login with Auth0</button>
    </Form>
  );
}
```

### Creating the logout route

```typescript
// app/routes/app/auth0/logout.tsx
import type { LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/utils/auth.server';

// Here we use the logout function of the authenticator to logout the user and clear the Auth0 session.
export const loader: LoaderFunction = async ({ request }) => {
  return authenticator.logout(request, {
    redirectTo: '/login',
  });
};
```

---

## Protecting routes using our Authenticator.

We are now ready for our routes to be protected.You can simple add the authenticator to the route’s loader.

For example, If you want to protect the route `/`, you can do the following:

```typescript

import type { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

// When the loader of this page is ran, we will check if the user is logged in.
//  and on failure we redirect to the login page.
export const loader: LoaderFunction = async ({ request }) => {
   await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  //... other code here that returns something from the loader..

};

export default function Index() {
  return (
    // ...
  );
}

```

That’s it! You have now added Authentication and Protected routes for your application using Remix + Prisma + Auth0.

---

## References:

- [Starter Template for this blog](https://github.com/ShubhamVerma1811/remix-prisma-auth0-starter)

- [Remix-Auth](https://github.com/sergiodxa/remix-auth/)

- [Remix-Auth-Auth0](https://github.com/danestves/remix-auth-auth0)

- [Prisma Upsert](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert)
