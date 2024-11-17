# Disciplinary Review App

A web application built to manage disciplinary reviews for users. The app provides features such as user registration, login, and access to protected routes. It includes functionality to handle different types of errors, validate user inputs, and securely manage passwords using bcrypt.

## Features

- **User Registration**: Allows new users to sign up with a valid email and password.
- **User Login**: Provides users with the ability to log in with their credentials and receive a valid JWT token.
- **Protected Routes**: Ensures access control via token-based authentication for accessing protected routes.
- **Error Handling**: Handles various error scenarios including missing fields and database errors.

## Setup

To run the project locally:

1. Clone the repository.
2. Install dependencies:
   
    ```bash
    npm install
    ```
    
3. Set up the environment variables (e.g., JWT_SECRET). You can create a `.env` file in the root directory of the project and add the following:

    ```bash
    JWT_SECRET=your_secret_key
    ```
    
4. Start the application:

    ```bash
    npm start
    ```

## Testing

This project includes a suite of unit tests written using Jest. The tests cover various scenarios such as user registration, login validation, and protected route access. To run the tests:

    ```bash
    npm test
    ```

## What I Learned

### Mocking and Testing with Jest
I learned how to mock external dependencies like databases and libraries (bcrypt, jsonwebtoken) to simulate different scenarios and test how the application handles them.

### Parameterizing Tests
I used parameterized tests to handle multiple test cases more efficiently, reducing code duplication and making the tests easier to manage.

### Organizing Tests
By grouping related test scenarios in separate files and moving repetitive logic to helper functions, I improved the organization and maintainability of the tests.

### Improving Test Readability
I added descriptive scenario names to make the tests more readable and understandable for future development.

### Refactoring Helpers
I moved commonly used functions (like database mock setup and validation checks) into helper files to keep the test files clean and concise.

### JWT Authentication Testing
I implemented tests for protected routes by mocking JWT verification and testing how the app handles valid and invalid tokens.

### Error Handling in Tests
I focused on testing how the app handles different error scenarios such as missing fields, invalid credentials, and database errors, ensuring that the app behaves as expected in edge cases.

## Future Improvements

### Implement User Profile Management
Allow users to update their profiles (e.g., change email or password).

### Improve Test Coverage
Add more test cases to cover edge cases and improve the overall test coverage of the app.

### Implement User Roles
Add user roles (e.g., Admin, User) with different access privileges for better access control in the application.
