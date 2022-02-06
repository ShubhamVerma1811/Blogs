Protecting Routes from unauthenticated users is a crucial part of any app.

In this blog, I'll show you exactly how to do that with your NextJS pages using Higher-Order Components. [[1]](#footer)

There can be several ways of authenticating a user like using cookies or JWT tokens.[[2]](#footer)

I'll be using JWT token as an example, where the `accessToken` is stored in the `localStorage`

Let's consider a page "/dashboard". This page should be only accessed by authenticated users

## In our `Dashboard.jsx`

```jsx
// pages/dashboard.jsx
import withAuth from "HOC/withAuth.js";
const Dashboard = ({ user }) => {
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>{user.name}</h2>
    </div>
  );
};

export default withAuth(Dashboard);
```

Notice that we are importing `withAuth.jsx` and exporting the page by passing it as an argument. That is all we need to do for our pages.

---

## In our `withAuth.jsx`

I'll show you two methods of implementations:

- Method 1: We don't verify the token
- Method 2: We verify the token

### Method 1: (We don't verify the token)

```js
// HOC/withAuth.jsx
import { useRouter } from "next/router";
const withAuth = (WrappedComponent) => {
  return (props) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const Router = useRouter();

      const accessToken = localStorage.getItem("accessToken");

      // If there is no access token we redirect to "/" page.
      if (!accessToken) {
        Router.replace("/");
        return null;
      }

      // If this is an accessToken we just render the component that was passed with all its props

      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export default withAuth;
```

---

### Method 2: We need to verify the token.

```js
// HOC/withAuth.jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import verifyToken from "services/verifyToken";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(async () => {
      const accessToken = localStorage.getItem("accessToken");
      // if no accessToken was found,then we redirect to "/" page.
      if (!accessToken) {
        Router.replace("/");
      } else {
        // we call the api that verifies the token.
        const data = await verifyToken(accessToken);
        // if token was verified we set the state.
        if (data.verified) {
          setVerified(data.verified);
        } else {
          // If the token was fraud we first remove it from localStorage and then redirect to "/"
          localStorage.removeItem("accessToken");
          Router.replace("/");
        }
      }
    }, []);

    if (verified) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
};

export default withAuth;
```

---

# Footer

1. [React Higher-Order Components](https://reactjs.org/docs/higher-order-components.html)

2. [User authentication in NodeJS](https://debbie.hashnode.dev/a-beginners-guide-to-user-authentication-and-authorization-with-json-web-tokens-versus-sessions-in-nodejs)

---

Wasn't that easy!

I hope this blog helped you. If you got any queries or feedback then let me know 😀
