For the curious ones: <br> Live Demo : https://tweeter-eight.vercel.app <br>
GitHub Repo : https://github.com/ShubhamVerma1811/Tweeter <br>

## Table of Content

<!-- TOC -->

- [Table of Content](#table-of-content)
- [Tech Stack](#tech-stack)
- [Reason for choosing this Tech Stack](#reason-for-choosing-this-tech-stack)
  - [NextJS](#nextjs)
  - [TailwindCSS](#tailwindcss)
  - [Firebase](#firebase)
- [Problems with this Tech Stack](#problems-with-this-tech-stack)
  - [TailwindCSS](#tailwindcss-1)
  - [Firestore](#firestore)
- [Features of this website.](#features-of-this-website)
  - [Authentication](#authentication)
  - [Tweets](#tweets)
  - [Users](#users)
  - [Firebase Storage Bucket](#firebase-storage-bucket)

<!-- /TOC -->

## Tech Stack

The Tech stack that I used for this project is:

- [NextJS](https://nextjs.com) for the frontend framework
- [TailwindCSS](https://tailwindcss.com) for the CSS framework
- [Firebase](https://firebase.com) as the Database.

That's it!

Here's the look at the dependencies in the `package.json` file

```js
{
  "dependencies": {
    "@material-ui/core": "^4.11.1",
    "@material-ui/icons": "^4.9.1",
    "firebase": "^8.1.1",
    "next": "10.0.2",
    "react": "17.0.1",
    "react-dom": "17.0.1",
    "shortid": "^2.2.16"
  }
}
```

## Reason for choosing this Tech Stack

### NextJS

- I chose NextJS because it has SSR capabilities, built-in Routes support.

### TailwindCSS

- I chose TailwindCSS because it's the best! I didn't have to care about class
  names. Even though Tailwind has its limits.

### Firebase

- The big one, Firestore. Now Twitter is highly SQL based and Firestore is a
  NoSQL DB. The reason I chose Firestore because I wanted to learn it.

---

## Problems with this Tech Stack

### TailwindCSS

- The problem with Tailwind is that it has its limits. Not every CSS styles are
  supported, you need to extend it if you need to use it.
- This is a great feature, but for a person like me who never worked with the
  `tailwind.config.js` file, it was an issue and I had to use inline style to
  achieve certain looks.

### Firestore

- Firestore is a NoSQL DB and Tweeter uses SQL relationships.
- So to solve this, I created SQL-like relations in Firestore.
- But due to the nature of Firestore which is NoSQL and me writing SQL-like
  relationships, the query takes a long time to execute.
- This is the thing I realized that why Firebase was a bad choice.
- The major feature of Twitter would be "retweets", but I had to skip that
  implement' in FIrestore because the query would take even more time to
  execute.
- Use of Firestore made me realize how powerful SQL databases are.

For example: A user table that looked like

| userID |     email     |      name | username   |   createdAt   |
| :----- | :-----------: | --------: | :--------- | :-----------: |
| JK12Ac | test@test.com | Rick Roll | rickroll68 | 1st Jan 13:00 |

And a tweets table that looks like

| tweetID | authorID | tweet | parentTweet |    createdAt |
| :------ | :------: | ----: | :---------- | -----------: |
| JL150   |  JK12Ac  | Hello | null        | 2nd Jan 2:30 |

---

## Features of this website.

### Authentication

- The authentication was implemented using Firebase Authentication. It used the
  "Email/Password" method to authenticate.
- To use the service, a user needs to sign up.

### Tweets

- A User can post tweets, add a single image to tweets, comment on other tweets.
- User can also Like tweets and Save them as Bookmarks.
- Deletion of a tweet can also be done.

### Users

- Users can follow other users.
- Followed user tweets are visible on the Home Page.
- The user can also delete their tweets and account.

### Firebase Storage Bucket

- The images present in a tweet are stored in the Firebase Storage Bucket.

---

If you liked this blog then do let me know. I am new to blogging and would love
to know your thoughts.
