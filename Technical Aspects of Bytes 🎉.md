> # ⚠️ ⚠️ This project is no longer maintained or hosted. The code available on Github

> If you are unaware of Bytes then check out this blog that I wrote:
> [Bytes - A Platform to share bite-sized learnings!](https://blogs.shubhamverma.me/introducing-bytes-a-platform-to-share-bite-sized-learnings)

In this blog, I'll talk about the decision to choosing the tech stack, the
database modeling of Bytes

---

## Table of Contents

- [Tech Stack](#tech-stack)
  - [NextJS](#nextjs)
  - [HarperDB](#harperdb)
  - [TailwindCSS](#tailwindcss)
  - [Firebase ( Storage and Authentication )](#firebase--storage-and-authentication-)
- [Database Modelling](#database-modelling)
  - [Schemas](#schemas)
    - [User Schema](#user-schema)
    - [Post Schema](#post-schema)
    - [Tag Schema](#tag-schema)
    - [Post_Tag Schema](#post_tag-schema)
  - [Relationships](#relationships)
    - [User <-> Post](#user---post)
    - [Post <-> Tags](#post---tags)
- [Protecting Routes](#protecting-routes)
- [Socials](#socials)

---

## Tech Stack

- NextJS
- HarperDB
- TailwindCSS
- Firebase

### NextJS

- I chose to go with NextJS because it provides SSR support and Pages support
  out of the box.

### HarperDB

- Since Bytes is made as a part of the HashNode-HarperDB hackathon, HarperDB
  acts as the Database for Bytes.
- The ability to queries in SQL way or NoSQL ways make it so easy to work with
  it.

### TailwindCSS

- I always praise Tailwind in my blogs, It's easier to write CSS with all the
  utilites classes
- It also has Dark/Light theme support.

### Firebase ( Storage and Authentication )

- Images for Bytes are handled by Firebase storage.
- All the URLs of the uploaded image are then stored in Harper
- Authentication is implemented using Firebase authentication as it handles also
  the user sessions gracefully.

---

## Database Modelling

- This is the fun part of working with databases for me. In this section, I'll
  share the schemas of the tables and their relationships.
- I have tried to keep the models and their relationships normalized.

### Schemas

#### User Schema

```ts
export type UserSchema = {
  uid: string;
  email: string;
  name: string;
  username: string;
  verified: boolean;
  __createdtime__?: string;
  __updatedtime__?: string;
};
```

#### Post Schema

```ts
export type PostSchema = {
  pid: string;
  images: Array<string>;
  slug: string;
  title: string;
  uid: string;
  reactions: number;
  __createdtime__?: string;
  __updatedtime__?: string;
};
```

#### Tag Schema

```ts
export type TagType = {
  tid: string;
  name: string;
  color: string;
  image?: string;
  slug?: string;
  __createdtime__?: string;
  __updatedtime__?: string;
};
```

#### Post_Tag Schema

```ts
export type Post_Tag_Type = {
  pid: string;
  ptid: string;
  tid: string;
  __createdtime__?: string;
  __updatedtime__?: string;
};
```

### Relationships

#### User <-> Post

- This relationship would be one-to-many
- So the Post Schema would have a foreign key i.e User's uuid as `uid`
- To get a user posts, I would just inner join User and Post on this `uid`

```sql
-- Gets all the Posts of a User
SELECT p.*,u.name,u.username FROM bytes.post AS p INNER JOIN bytes.user AS u ON u.uid=p.uid WHERE u.username='${username}'
```

#### Post <-> Tags

- The relationships b/w Post and Tags would be many-to-many.
- One post can have many tags and One tag can have posts
- I found this amazing article that shows various ways on implementing N:M
  relationships
  - [Tags: Database schemas](https://howto.philippkeller.com/2005/04/24/Tags-Database-schemas/)
- Based on it, I made separate table called `Post_Tag` that would contain a post
  id as `pid` and tag id as `tid`
- So now to get a post with all it's tags, I would write this SQL query

```sql
-- Gets all Tags for a Post
SELECT t.* FROM bytes.post_tag AS pt INNER JOIN bytes.tag AS t ON pt.tid=t.tid WHERE pt.pid='${post.pid}'
```

```sql
-- Get all Posts of a Tag
SELECT p.*,u.name,u.username FROM bytes.post_tag AS pt INNER JOIN bytes.post AS p ON pt.pid=p.pid INNER JOIN bytes.user AS u ON p.uid = u.uid WHERE pt.tid='${tag.tid}'

```

---

## Protecting Routes

- At the moment, Bytes has the following routes:
  - /
  - /upload
  - /login
  - /profile/:id/
  - /byte/:id/
  - /tag/:id/

Out of this routes, the `/upload` route is protected, It can be only accessed if
the user is logged in.

- So to do so, I made a custom hook that would check for user.
- If user is logged in, it allows the user else redirect to "/login"

```jsx
// useRequireLogin.tsx
const router = useRouter();

const { user, setUser } = useContext(UserContext);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const authUser = await getAuthUserFromHarper(user.uid);
      setUser({ ...authUser, isLoggedIn: true });
      setLoading(false);
      router.push(to);
    } else {
      setUser({});
      setLoading(false);
      router.push('/login');
    }
  });
}, []);

return { user, loading };

// ------------------------
// Using in the Upload Page
// /pages/upload.tsx
// ------------------------

const { user, loading } = useRequireLogin({ to: '/upload' });

if (loading || !user.isLoggedIn) return null;
```

---

Hope you liked this blog and learned something from it. There are still some
improvements and features that I am adding to Bytes.

## Socials

You can follow me on my Twitter -
[@Shubham_Verma18](https://twitter.com/Shubham_Verma18)

<a href="https://www.buymeacoffee.com/shubhamverma"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=shubhamverma&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"></a>
