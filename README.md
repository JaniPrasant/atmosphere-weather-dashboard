# Recipely - Recipe Finder & Meal Planner

A full-stack MERN application that allows users to search for recipes from a vast database, save their favorites, and add personal notes. This project showcases a complete development cycle from backend API design to a polished, responsive, and interactive frontend.

**Live Demo Link:** [Recipely](https://recipely-app.netlify.app/)

---

## About The Project

![Recipe Finder Screenshot](docs/screenshot.png)

Recipe Finder is more than just a search tool; it's a personalized digital cookbook. In a world full of recipe websites cluttered with ads and complex user interfaces, this application provides a clean, focused, and user-centric experience. Users can instantly search for thousands of recipes from TheMealDB API, view detailed instructions and ingredients, and create a personal account to curate their own collection of favorites.

The real power comes from the personalization features. Logged-in users can not only save recipes but also add their own personal notes—perfect for tracking modifications, substitutions, or cooking tips. This project was built from the ground up to demonstrate a full mastery of the MERN stack, including secure user authentication with JWT, a custom-themed and responsive UI with Material-UI, and a well-structured RESTful API.

### Built With

This project leverages a modern and powerful set of technologies:

*   **Backend:**
    *   [Node.js](https://nodejs.org/)
    *   [Express.js](https://expressjs.com/)
    *   [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
    *   [JSON Web Tokens (JWT)](https://jwt.io/) for authentication
    *   [bcrypt.js](https://www.npmjs.com/package/bcryptjs) for password hashing
*   **Frontend:**
    *   [React.js](https://reactjs.org/)
    *   [Vite](https://vitejs.dev/) as a build tool
    *   [Material-UI (MUI)](https://mui.com/) for a comprehensive component library and styling
    *   [React Router](https://reactrouter.com/) for client-side routing
    *   [Axios](https://axios-http.com/) for API communication
    *   [React Context API](https://reactjs.org/docs/context.html) for global state management

---

## Features

*   **Recipe Search:** Instantly search a massive public recipe database.
*   **Detailed Recipe View:** See a recipe's image, ingredients, measurements, and step-by-step instructions.
*   **Secure User Authentication:** Users can register for an account and log in securely. Passwords are encrypted and sessions are managed with JWT.
*   **Favorite Recipes:** Logged-in users can save their favorite recipes to their personal collection.
*   **Personal Notes:** Add, edit, and view personal notes on any saved recipe.
*   **Responsive Design:** A beautiful, consistent user experience across all devices, from mobile phones to desktops.
*   **Polished UI:** A professional and modern interface built with the Material-UI component library and a custom theme.

---

## Advanced Features Deep Dive

### 1. Advanced Search Filters (Dietary & Intolerances)

The basic keyword query mechanism has been extended with custom Material-UI dropdowns, selection chips, and specialized API query structures. Users can now filter the entire recipe database using combined matrix parameters:

*   **Dietary Preferences:** Filter recipes explicitly marked as *Vegan*, *Vegetarian*, *Gluten-Free*, or *Keto*.
*   **Max Cooking Time:** Filter options based on prep speed boundaries, returning recipes taking under *20, 30, or 45 minutes*.

### 2. Automated Kitchen Shopping List

Say goodbye to writing ingredients down manually. Users can click a single button on any individual recipe details layout page to extract and push its complete inventory card straight into a global **Kitchen Assistant** workspace.

*   **Smart Categorization:** The backend parses, segments, and groups incoming checklist rows beautifully under clear, distinct headings matching the source recipe's name rather than letting items fall into a generic pile.
*   **Cross-Session Persistence:** Built directly into the MongoDB user tracking collection schema (`shoppingList: [shoppingListItemSchema]`), ensuring a user's grocery checkmarks and items persist seamlessly across multiple machines, logins, or mobile views.
*   **Interactive Tracking:** Users can dynamically toggle items as checked off or clear out their array with a single global reset utility.

---

## Getting Started

To get a local copy up and running, please follow these simple steps.

### Prerequisites

You need to have the following software installed on your machine:
*   Node.js (which includes npm) - [https://nodejs.org/](https://nodejs.org/)
*   Git - [https://git-scm.com/](https://git-scm.com/)
*   A MongoDB Atlas account or a local MongoDB installation - [https://www.mongodb.com/atlas/database](https://www.mongodb.com/atlas/database)

### Local Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Setup the Backend:**
    *   Navigate to the backend directory:
        ```sh
        cd backend
        ```
    *   Install the necessary NPM packages:
        ```sh
        npm install
        ```
    *   Create a `.env` file in the `backend` directory and add the following environment variables. Replace the placeholder values with your own.
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_super_secret_jwt_key
        ```
    *   Start the backend server:
        ```sh
        npm start
        ```
        The server will be running on `http://localhost:5000`.

3.  **Setup the Frontend:**
    *   Open a new terminal window and navigate to the frontend directory:
        ```sh
        cd frontend
        ```
    *   Install the necessary NPM packages:
        ```sh
        npm install
        ```
    *   Create a `.env.local` file in the `frontend` directory and add the following variable. This should point to your running backend server.
        ```env
        VITE_BACKEND_API_URL=http://localhost:5000
        ```
    *   Start the frontend development server:
        ```sh
        npm run dev
        ```
        The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

---

## Contact

Prasant Jani - [jani.prasant2810@gmail.com](mailto:jani.prasant2810@gmail.com)

Project Link: [https://github.com/JaniPrasant/Recipe-Finder-with-Favorites](https://github.com/JaniPrasant/Recipe-Finder-with-Favorites)
