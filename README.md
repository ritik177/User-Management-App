# User Management Application

## Overview

The User Management Application is a CRUD (Create, Read, Update, Delete) application built with React that allows users to manage user information efficiently. It uses the JSONPlaceholder API to simulate data fetching, creating, updating, and deleting user data.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Additional Requirements](#additional-requirements)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Fetch Users**: Retrieve a list of users from the JSONPlaceholder API and display them in a table format.
- **Create User**: A form to create a new user with validation. Users can be added via a modal.
- **Update User**: Users can edit existing user information, with pre-filled data in the modal for easy modification.
- **Delete User**: Remove a user with a confirmation modal to prevent accidental deletions.
- **Responsive Design**: The application is designed to be mobile-friendly and adjusts to different screen sizes.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Axios**: A promise-based HTTP client for making requests to the JSONPlaceholder API.
- **Material-UI**: A React UI framework that provides components for building responsive web applications.
- **React Router**: For routing and navigating between views.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ritik177/User-Management-App.git

2. Navigate to the project directory:
   ```bash
   cd User-Management-App

3. Install dependencies:
   ```bash
    npm install


## Usage

1. Start the development server
   ```bash
   npm start

2. Open your browser and navigate to http://localhost:3000 to view the application.

## API Endpoints
1. Fetch Users:
    GET https://jsonplaceholder.typicode.com/users

2. Create User:
    POST https://jsonplaceholder.typicode.com/users

3. Update User:
   PUT https://jsonplaceholder.typicode.com/users/{id}

4. Delete User:
   DELETE https://jsonplaceholder.typicode.com/users/{id}

## Additional Requirements
# Table UI: 
    The application features a table with alternating row colors for better readability.
# React Functional Components & Hooks: 
    Utilizes React functional components and hooks (useState, useEffect, etc.) for state management and lifecycle methods.
#  Routing using React Router:
    Implements routing for home view and detailed user view.

## Contributing
   Contributions are welcome! If you have suggestions or improvements, please create a pull request or open an issue.