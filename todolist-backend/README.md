# TodoList API

This is the API for the TodoList application. It's built with Express.js and uses MySQL for the database and Redis for caching.

## Getting Started

To get started, you need to have Node.js, MySQL, and Redis installed on your machine. Then, clone this repository and install the dependencies:

```bash
git clone <repository-url>
cd <repository-directory>
npm install
```

You also need to set up your environment variables. Create a .env file in the root directory of the project, and add the following variables:

```bash
DB_HOST=<your-database-host>
DB_USER=<your-database-user>
DB_PASS=<your-database-password>
DB_NAME=<your-database-name>
PORT=<port-number>
```

Finally, start the server:

```bash
npm start
```

## API Endpoints
`GET /`
Returns a welcome message.

`POST /users/register`
Registers a new user.

Request body:

```json
{
  "username": "<username>",
  "password": "<password>"
}
```

Response body:

```json
{
  "token": "<jwt-token>"
}
```
`POST /users/login`
Logs in a user.

Request body:

```json
{
  "username": "<username>",
  "password": "<password>"
}
```
Response body:

```json
{
  "token": "<jwt-token>"
}
```

`GET /users/:id`

Retrieves the details of a user. Requires authentication.

`PUT /users/:id`

Updates a user’s details. Requires authentication.

Request body (at least one of these):

```json
{
  "username": "<new-username>",
  "password": "<new-password>"
}
```

`DELETE /users/:id`
Deletes a user. Requires authentication.

Authentication
This API uses JWT for authentication. To authenticate a request, include the JWT token in the Authorization header:

```json
Authorization: Bearer <jwt-token>
```

```json
Please replace `<repository-url>`, `<repository-directory>`, `<your-database-host>`, `<your-database-user>`, `<your-database-password>`, `<your-database-name>`, `<port-number>`, `<username>`, `<password>`, and `<jwt-token>` with your actual values.
```
