# Secure Web Portal (authorization sba)

A backend REST API built with Node.js, Express, and MongoDB that handles user authentication (local registration/login and GitHub OAuth 2.0) and private bookmark management. Each user can only view, update, or delete their own saved bookmarks.

## Tech Stack

- **Runtime & Framework:** Node.js, Express.js (ES Modules)
- **Database:** MongoDB Atlas & Mongoose
- **Authentication & Security:** `bcrypt`, `jsonwebtoken` (JWT), `passport`, `passport-github2`, `dotenv`

# How Every Endpoint Was Tested
All endpoints were tested locally against http://localhost:3001 using Chrome (for the GitHub OAuth browser redirect) and Postman (for JSON API requests)

# GitHub OAuth Flow (Chrome)
Visited http://localhost:3001/api/users/auth/github in the browser and authorized the GitHub OAuth app.

Confirmed redirection to /api/users/auth/github/callback returning 200 OK with a signed JWT token and the created GitHub user profile.

# Local Registration & Login (Postman)
Sent POST /api/users/register with a JSON body (username, email, password) for a test user (alice) :- verified 201 Created with a JWT token and no password exposed in the response.

Sent POST /api/users/login with Alice's email and password :- verified 200 OK with a fresh JWT token.

# Authentication Gatekeeper (Postman)

Sent GET /api/bookmarks with No Auth :- verified 401 Unauthorized ("Access denied. No token provided.")

# Bookmark Creation & Retrieval (Postman)

Sent POST /api/bookmarks with Alice's Bearer Token and JSON body (title, url, description) :- verified 201 Created with Alice's user ID attached.

Sent GET /api/bookmarks with Alice's Bearer Token :- verified 200 OK returning an array containing Alice's bookmark.

# Cross-User Ownership Isolation (Postman)

Registered a second user (bob) via POST /api/users/register and switched Authorization to Bob's Bearer Token.

Sent GET /api/bookmarks :- verified 200 OK returning an empty array [] (Bob cannot see Alice's bookmarks).

Sent GET /api/bookmarks/:id, PUT /api/bookmarks/:id, and DELETE /api/bookmarks/:id using Alice's bookmark ID with Bob's token :- verified all three returned 403 Forbidden.

# Owner Update & Delete (Postman)

Switched Authorization back to Alice's Bearer Token.

Sent PUT /api/bookmarks/:id with a new title :- verified 200 OK with the updated bookmark.

Sent DELETE /api/bookmarks/:id :- verified 200 OK ("Bookmark deleted successfully!").