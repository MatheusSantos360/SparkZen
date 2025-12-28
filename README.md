# SparkZen — Official Documentation

**SparkZen** is a high‑performance TypeScript framework focused on extreme simplicity, aggressively smooth DX, and stylish logs that make any developer smile. Designed for builders who want fast, scalable APIs with an organized architecture — *without corporate bureaucracy*.

Minimal on the outside, powerful on the inside.

---

# 🚀 1. Overview

SparkZen follows three core principles:

* **Zero initial configuration** – import → use → run.
* **Folder‑driven architecture** – routes are auto‑registered.
* **DX first** – schemas, middlewares, and handlers fully typed.

Perfect for modern REST APIs, microservices, and backends that demand clarity.

---

# 📦 2. Creating a New SparkZen Project

Kickstart a new SparkZen application using the official CLI:

```bash
npx sparkzen init
```

The CLI will walk you through scaffolding, project structure, and essentials.

---

Installation

```bash
npm install sparkzen
```

or:

```bash
yarn add sparkzen
```

---

# 🏗️ 3. API Initialization

```ts
import sparkzen from "sparkzen";

async function spark() {
  try {
    const app = await sparkzen();
    await app.listen({ port: 3000 });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

spark();
```

When you run this, SparkZen automatically:

* initializes the server
* loads all routes inside `src/routes`
* applies default middlewares
* prints clean, structured logs

---

# 📂 4. Folder Structure

SparkZen uses a modern, intuitive pattern:

```
src/
 └── routes/
      ├── users/
      │     ├── get.ts       → GET /users
      │     └── [id]/
      │           └── post.ts → POST /users/:id
      └── auth/
            └── login/post.ts → POST /auth/login
```

📌 **Golden Rule:**

* File name → HTTP method
* Folder name → endpoint path
* `[id]` → dynamic param

Simple. Beautiful. Powerful.

---

# 🧩 5. Handlers

Handlers are the core of each route.

### Basic Example

```ts
import type { Handler } from "sparkzen";

const handler: Handler = async (request, reply) => {
  return reply.status(200).send({ message: "Hello, SparkZen!" });
};

export default handler;
```

### What you get inside a handler?

* `request.params`
* `request.body`
* `request.query`
* `request.headers`

All fully typed.

---

# 🛡️ 6. Schemas (TypeBox Powered)

SparkZen uses **TypeBox** for strong validation + auto‑generated TypeScript types.

### Example Schema

```ts
export const schema = {
  params: T.Object({
    id: T.Number({ description: "User ID", examples: [1] }),
  }),

  body: T.Object({
    name: T.String({ minLength: 2 }),
    nick: T.Optional(T.String()),
  }),

  response: {
    200: T.Object({
      ok: T.Boolean(),
      message: T.String(),
      received: T.Object({
        id: T.Number(),
        name: T.String(),
        nick: T.Optional(T.String()),
      }),
    }),
  },
};
```

Define once → SparkZen types everything.

---

# ⚙️ 7. Middlewares

Clean, lightweight, powerful.

### Example

```ts
export const middlewares: Middleware<typeof schema> = [
  (request, _reply, done) => {
    console.log("[SparkZen] Incoming request:", {
      params: request.params,
      body: request.body,
    });
    done();
  },

  (_request, _reply, done) => {
    console.log("[SparkZen] Second middleware executed");
    done();
  },
];
```

Each middleware receives:

* `request`
* `reply`
* `done()`

Similar to Fastify — but tighter and more TS‑integrated.

---

# 🔥 8. Full Route (Schema + Middleware + Handler)

```ts
import { Middleware, T, type Handler } from "sparkzen";

export const schema = {
  params: T.Object({
    id: T.Number({ description: "User ID", examples: [1] }),
  }),
  body: T.Object({
    name: T.String({ minLength: 2 }),
    nick: T.Optional(T.String()),
  }),
  response: {
    200: T.Object({
      ok: T.Boolean(),
      message: T.String(),
      received: T.Object({
        id: T.Number(),
        name: T.String(),
        nick: T.Optional(T.String()),
      }),
    }),
  },
};

export const middlewares: Middleware<typeof schema> = [
  (request, _reply, done) => {
    console.log("[SparkZen] Incoming request:", {
      params: request.params,
      body: request.body,
    });
    done();
  },
  () => {
    console.log("[SparkZen] Second middleware executed");
  },
];

const handler: Handler<typeof schema> = async (request, reply) => {
  const { id } = request.params;
  const { name, nick } = request.body;

  return reply.status(200).send({
    ok: true,
    message: "User processed successfully",
    received: { id, name, nick },
  });
};

export default handler;
```

---

# 📡 9. Boot Logs

On startup, SparkZen prints something like:

```
SPARKZEN   INITIALIZING API   SPARKZEN

SPARKZEN   LOADING ROUTES   SPARKZEN

ROUTE   GET  /api/users        .../src/routes/users/get.ts
ROUTE   POST /api/users/:id    .../src/routes/users/[id]/post.ts

SPARKZEN   STARTING SERVER   SPARKZEN

SERVER  Running at: http://localhost:3000
```

Logs are designed for:

* maximum clarity
* fast debugging
* clean aesthetics

---

# 🧠 10. Best Practices

* Always use **schemas** for strong typing
* Keep **handlers minimal**
* Group middlewares by responsibility
* Keep route folders small and focused
* Name files after HTTP methods (SparkZen standard ❤️)

---

# 🔮 11. SparkZen Roadmap

Planned features:

* Advanced CLI
* Official plugins
* Simplified authentication utilities
* Auto‑generated documentation
* Edge‑runtime adapters

SparkZen was built to scale — and you scale with it.
