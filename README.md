
# Events-Planner - An Event Planning Application

Events-Planner is a Node.js application for event planning, complete with API endpoints for event management, user registration, and login. This README document provides an overview of the project, the database schema, API endpoints, testing, and CI/CD setup using GitHub Actions.

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Running the Application](#running-the-application)
  - [Running Tests](#running-tests)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
	- [User authentication](#user-authentication)
	- [Event Management](#event-management)
- [Testing](#testing)
- [Continuous Integration and Continuous Deployment (CI/CD)](#continuous-integration-and-continuous-deployment-cicd)
- [Contributing](#contributing)
- [Email Sending](#email-sending)
- [Frontend Development](#frontend-development)
- [License](#license)

## Project Overview

Events-Planner is an event planning application that allows users to create and manage events. The application consists of a Node.js backend that provides API endpoints for event and user management. The frontend is built using React.js.

## Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:

- Node.js and npm
- MongoDB (for local development)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/authme-flophy/events-planner
   cd events-planner
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

- Create a `.env` file in the project root and add the following configuration options:

   ```env
   MONGODB_URI=mongodb://localhost/yourdb
   SECRET_CODE=your-secret-key
   NODE_ENV=dev
   REFRESH_SECRET_CODE=your-refresh-secret-key
   EXPIRY=token-expiry
   REFRESH_EXPIRY=refresh-token-expiry
   EMAIL_ADDRESS=your-email-address
   EMAIL_PASSWORD=your-email-password
   ```

   Replace `MONGODB_URI` with your MongoDB URI (or use a remote MongoDB service). Set `SECRET_CODE` and `REFRESH_SECRET_CODE` to a secure string for JWT token generation and `EXPIRY` and `REFRESH_EXPIRY` for setting the expiry for the token and refresh-token . You can use the environment variables `EMAIL_ADDRESS`, and `EMAIL_PASSWORD` to configure your nodemailer settings for sending emails. Events-Planner uses **GMAIL** as the email service.

## Usage

### Running the Application

Start the application by running:

```bash
npm start
```

Start the application in development by running:

```bash
npm run dev
```

Your Node.js server will start, and the application will be accessible at `http://localhost:4000` by default.

### Running Tests

To run tests, use the following command:

```bash
npm test
```

This will execute the test suite using Jest and an in-memory MongoDB database for efficient testing. More information on tests can be found in the [Testing](#testing) section of this document.

## Database Schema

Eventify uses a MongoDB database to store event and user information. The schema for these collections is as follows:

### Events Collection

- `title` (String): The title of the event.
- `description` (String): A description of the event.
- `date` (Date): The date and time of the event.
- `location` (String): The location of the event.
- `creator` (ObjectID): References the user who created the event.

### Users Collection

- `username` (String): The username of the user.
- `email` (String): The email address of the user.
- `password` (String): The user's hashed password for secure storage.

### TokenBlacklist Collection
-  `token` (String): The invalidated token, typically a JWT token.
-   `createdAt` (Date): The timestamp when the token was invalidated.

## API Endpoints

Eventify provides the following API endpoints:

### User Authentication

### 1. `POST /auth/register`

- **Description:** This endpoint is used for user registration. Users can create a new account by providing their username, email, and password.

- **Request Body:**
  - `username` (string): The desired username for the user.
  - `email` (string): The user's email address (must be unique).
  - `password` (string): The user's chosen password.

Example Request Body:
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "newpassword123"
}
```

### 2. `POST /auth/login`

- **Description:** Users can log in to their accounts by providing their email and password.

- **Request Body:**
  - `email` (string): The user's registered email address.
  - `password` (string): The user's password.

Example Request Body:
```json
{
  "email": "existinguser@example.com",
  "password": "existingpassword123"
}
```

### 3. `POST /auth/forgot-password`

- **Description:** This endpoint initiates the process of resetting a forgotten password. Users provide their email address, and if an account with that email exists, a password reset email will be sent.

- **Request Body:**
  - `email` (string): The user's registered email address.

Example Request Body:
```json
{
  "email": "existinguser@example.com"
}
```

### 4. `POST /auth/reset-password/:resetToken`

- **Description:** This endpoint allows users to reset their password using a valid reset token received via email.

- **Request Body:**
  - `password` (string): The new password the user wants to set.

Example Request Body:
```json
{
  "password": "newpassword123"
}
```

### 5. `POST /auth/logout`

- **Description:** Logging out invalidates the current user's token. The user needs to provide their authentication token in the request headers to log out.

- **Request Body:** No request body is required. The authentication token should be provided in the request headers.

Example Request Header:
```
Authorization: Bearer your-auth-token
```

## Note

- In each of the above request bodies, the values are examples, and users should replace them with their actual data.

- For enhanced security, it's important to implement validation and error handling for request bodies to ensure that the data meets the application's requirements and to prevent potential security issues like SQL injection or cross-site scripting (XSS).

- The authentication token for endpoints like `/auth/reset-password` should be provided as a request header (as shown in the example header). Ensure that the token is valid and corresponds to the user making the request.

### Event Management

#### 1. Create an Event  `POST /api/events`
- **Description:** Create a new event by providing the following details:
  - `title` (String): The title of the event.
  - `description` (String): A description of the event.
  - `date` (Date): The date and time of the event.
  - `location` (String): The location of the event.
- **Request Body Example:**
  ```json
  {
    "title": "Awesome Party",
    "description": "Join us for a night of fun and celebration!",
    "date": "2023-12-31T20:00:00Z",
    "location": "123 Main Street"
  }
  ```
- **Response:** Returns the created event with a unique identifier.

#### 2. Get Event Details `GET /api/events/:id`
- **Description:** Retrieve the details of a specific event by providing the event's unique identifier.
- **Response:** Returns the details of the requested event.

#### 3. Update Event `PUT /api/events/:id`
- **Description:** Update an existing event by providing the updated event details. The request body should include the following fields (similar to event creation):
  - `title` (String): The updated title of the event.
  - `description` (String): The updated description of the event.
  - `date` (Date): The updated date and time of the event.
  - `location` (String): The updated location of the event.
- **Request Body Example:**
  ```json
  {
    "title": "Updated Party",
    "description": "Join us for an even better night of fun!",
    "date": "2023-12-31T21:00:00Z",
    "location": "456 Elm Street"
  }
  ```
- **Response:** Returns the updated event with the same unique identifier.

#### 4. Delete Event `DELETE /api/events/:id`
- **Description:** Delete a specific event by providing its unique identifier.
- **Response:** Returns a success message indicating that the event has been deleted.

#### 5. List Events `GET /api/events`
- **Description:** Retrieve a list of all events.
- **Response:** Returns an array of events, each containing its details.


## Testing

Events-Planner includes a comprehensive suite of tests to ensure the functionality and security of the authentication system. We use the [Jest](https://jestjs.io/) testing framework and `mongodb-memory-server` to run tests with an in-memory MongoDB database. Running tests is a critical step before deploying the application to ensure everything works as expected.


- **Test Suites**: Test suites group related test cases. In this application, we have the following test suites:
  - User Registration
  - User Login
  - Password Reset
  - Token Management
  - Event Creation
  - Event details retrieval
  - Event updating
  - Event deletion
  - Event listing

- The `beforeEach` and `afterEach` hooks ensure that the database state is reset before and after each test.

- Specific tests can be skipped using `test.skip` if the `beforeEach` setup is not needed for that particular test.

## Continuous Integration and Continuous Deployment (CI/CD)

Events-Planner has implemented CI/CD using GitHub Actions. The CI/CD pipeline includes testing the application and automatically deploying changes to the production server upon merging into the main branch.

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or would like to contribute to the project, please open an issue or create a pull request.

## Email Sending

Events-Planner plans to incorporate email functionality for user notifications and event reminders. SendGrid or Twilio can be used for sending emails.

## Frontend Development

The frontend for Eventify is built using React.js. It will provide a user-friendly interface for event management, user registration, and login.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
