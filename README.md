# Purrfect-Match
Think Tinder, but for pets swiping to like or dislike.

## 🔐 `res.cookie("token", token, { ... })` – Options Explained

### 1. ### `httpOnly: true`

**➡️ Purpose:**
Prevents JavaScript on the frontend from accessing the cookie via `document.cookie`.

**✅ Why it's used:**

* Mitigates **XSS attacks** (Cross-Site Scripting).
* Even if a malicious script runs, it **can’t steal the token** from cookies.

**🛡️ Always keep this `true`** for sensitive cookies like JWT or session tokens.

---

### 2. ### `secure: false` *(should be `true` in production)*

**➡️ Purpose:**
Cookie is **only sent over HTTPS** connections.

**✅ Why it's `false` here:**
You're likely testing on **localhost** without HTTPS.

**🔐 In production:**

```js
secure: true // Forces cookie to be sent only over HTTPS
```

This protects the token from being intercepted over insecure (HTTP) traffic.

---

### 3. ### `sameSite: "Lax"`

**➡️ Purpose:**
Controls when cookies are sent with **cross-site requests**.

| Value    | Behavior                                                               |
| -------- | ---------------------------------------------------------------------- |
| `Strict` | Never sends cookies on cross-site (even if clicking a link)            |
| `Lax`    | Sends cookies on top-level navigations (like clicking a link)          |
| `None`   | Sends cookies in **all cross-site** requests — must use `secure: true` |

**✅ Why `Lax` is used:**

* A good balance of **security and usability**.
* Allows cookie to be sent when user **clicks from another site**, but not with hidden requests (like from CSRF attacks).

**🌍 If you're doing cross-origin requests from frontend to backend (like different domains or ports), you might need:**

```js
sameSite: "None",
secure: true // REQUIRED when sameSite is "None"
```

---

### 4. ### `expires: new Date(Date.now() + 900000)`

**➡️ Purpose:**
Sets the **expiry time** of the cookie (in this case, 15 minutes from now).

**Why it's used:**

* Short-lived tokens improve **security**.
* After expiration, the browser automatically removes the cookie.

You can also use `maxAge` (in ms) instead:

```js
maxAge: 15 * 60 * 1000 // 15 minutes
```

---

## ✅ Summary

| Option     | Purpose                                    | Value Reasoning                           |
| ---------- | ------------------------------------------ | ----------------------------------------- |
| `httpOnly` | Prevent JS from accessing token            | ✅ Prevents XSS token theft                |
| `secure`   | Send cookie only on HTTPS                  | ❌ false in dev, ✅ true in production      |
| `sameSite` | Controls cross-site cookie behavior        | `Lax` allows safe usage without CSRF risk |
| `expires`  | Controls how long the cookie remains valid | 15 mins for better security               |

---


# purrfect match

- create user
- login user
- get user profile
- search for friends 
- send request 
- accept request 

- chat with connections