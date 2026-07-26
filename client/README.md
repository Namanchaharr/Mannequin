# Mannequin Frontend

A modern React frontend for **Mannequin**, a social media platform built with a scalable feature-based architecture.

The goal of this project is to build a maintainable frontend where features remain isolated, infrastructure is centralized, and responsibilities are clearly separated.

---

# Architecture Goal

The project follows a layered architecture where dependencies flow in **one direction only**.

```
app
 │
 ▼
features
 │
 ▼
shared
```

Every layer has a single responsibility.

- **app** composes the application.
- **features** contain business logic.
- **shared** contains reusable infrastructure and UI.

---

# Tech Stack

## Frontend

- React 19
- Vite
- React Router

## API

- Axios *(currently being integrated)*

## Styling

- CSS

## Testing

- Jest
- React Testing Library

---

# Getting Started

## Clone

```bash
git clone <repository-url>
cd mannequin/client
```

---

## Install

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

Runs on

```
http://localhost:5173
```

---

## Build

```bash
npm run build
```

---

# Project Structure

```text
src/
├── app/
│
├── assets/
│
├── features/
│   └── auth/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── tests/
│       ├── utils/
│       └── index.js
│
├── shared/
│   ├── hooks/
│   ├── lib/
│   ├── ui/
│   └── utils/
│
├── index.css
└── main.jsx
```

---

# Folder Responsibilities

## app/

Responsible for application composition.

Contains

- Router
- Providers
- Route definitions

The app layer should never contain feature logic.

---

## features/

Business features live here.

Every feature owns its own

- API
- Components
- Hooks
- Pages
- Tests
- Utilities

Example

```text
features/
└── auth/
    ├── api/
    ├── components/
    ├── hooks/
    ├── pages/
    ├── tests/
    ├── utils/
    └── index.js
```

Each feature exposes a public API through `index.js`.

Everything else inside the feature is considered private.

---

## shared/

Contains code reused across multiple features.

Current structure

```text
shared/
├── hooks/
├── lib/
├── ui/
└── utils/
```

### ui/

Reusable UI components.

Current components

- Button
- Card
- Input
- Spinner

UI components are presentation only.

They never perform HTTP requests or contain business logic.

---

### lib/

Shared infrastructure.

Examples

- Axios client
- API configuration
- Authentication helpers

---

### hooks/

Hooks shared across multiple features.

---

### utils/

Pure utility functions shared across features.

---

# Current Feature Structure

```
SignupPage
    │
    ▼
SignupForm
    ├────────────► validateSignup()
    │
    ▼
useSignup()
    │
    ▼
signup()
    │
    ▼
apiClient
    │
    ▼
Backend
```

Every layer has one responsibility.

---

# Layer Responsibilities

## SignupPage

Responsible for

- Page layout
- Composing components

Should not contain

- Business logic
- Validation
- API calls

---

## SignupForm

Responsible for

- Form state
- User interaction
- Calling validation
- Calling the signup hook

Should not

- Communicate with the backend directly

---

## validateSignup()

Responsible for

- Client-side validation

Rules

- Pure function
- No React
- No API calls
- No side effects

---

## useSignup()

Responsible for

- Signup business logic
- Loading state
- Server errors
- Calling signup()

Should not

- Render UI
- Perform validation

---

## signup()

Responsible for

- Communicating with the backend

Should

- Send HTTP requests
- Return data
- Throw errors

Should not

- Navigate
- Show alerts
- Manage React state

---

## apiClient

Responsible for

- Axios configuration
- Base URL
- Default headers

Future responsibilities

- JWT
- Interceptors
- Authentication

---

# Dependency Rules

Allowed

```
app
    ↓
features

app
    ↓
shared

features
    ↓
shared
```

Forbidden

```
features
      ↓
features

shared
      ↓
features

shared
      ↓
app
```

Features should remain independent.

---

# Public API Rule

Every feature exposes a public API.

Example

```
features/
└── auth/
    └── index.js
```

Import from

```javascript
import { SignupPage } from "@/features/auth";
```

Avoid

```javascript
import SignupPage from "@/features/auth/pages/SignupPage";
```

Internal implementation should stay private.

---

# Shared UI Components

Every UI component lives inside its own folder.

Example

```text
Button/
├── Button.jsx
└── Button.css
```

The project intentionally uses **one barrel file**.

```
shared/ui/index.js
```

There are **no** `index.js` files inside individual components.

---

# Import Convention

Use path aliases.

Good

```javascript
import { Button, Input } from "@/shared/ui";
```

Avoid

```javascript
import Button from "../../../shared/ui/Button/Button";
```

---

# Design Principles

- Features are isolated.
- Features never import other features.
- Shared code is introduced only after it is reused.
- Components own presentation.
- Hooks own business logic.
- API modules own backend communication.
- Validation is implemented using pure functions.
- Infrastructure is centralized.
- Dependencies always flow downward.

---

# Current Progress

## Completed

- [x] React setup
- [x] Vite
- [x] React Router
- [x] Feature-based architecture
- [x] Shared folder architecture
- [x] Path aliases
- [x] Shared UI components
- [x] Signup page
- [x] Signup form
- [x] Client-side validation

## In Progress

- [ ] Shared Axios client
- [ ] Signup API
- [ ] useSignup hook

## Upcoming

- [ ] Login
- [ ] Authentication
- [ ] Protected routes
- [ ] User session management

---

# Testing

Tests are owned by the feature they belong to.

Example

```text
features/
└── auth/
    └── tests/
        ├── api/
        ├── components/
        ├── pages/
        └── utils/
```

Keeping tests close to the feature improves maintainability.

---

# Roadmap

Authentication

- Signup
- Login
- JWT Authentication
- Protected Routes

Posts

- Feed
- Create Post
- Edit Post
- Delete Post

Users

- Profile
- Avatar
- Bio

Social

- Comments
- Likes
- Follow System
- Notifications

General

- Search
- Infinite Scroll
- Settings

---

# Version History

## v0.1.0

- Initial project setup
- React Router
- Feature architecture
- Shared UI components
- Signup UI
- Client-side validation

## Next

- Axios integration
- Shared API client
- Signup backend integration
- Login feature