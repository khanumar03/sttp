# Installation and Initialization Guide for STTP

This guide provides instructions on how to set up and run the STTP project.

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js**: [https://nodejs.org/](https://nodejs.org/) (LTS version recommended)
* **npm** (comes with Node.js) or **Yarn**: [https://yarnpkg.com/](https://yarnpkg.com/)

For PostgreSQL, choose one of the following methods:
* **Docker or Podman**: If using containers, ensure you have Docker Desktop or Podman installed.
    * Docker: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
    * Podman: [https://podman.io/docs/installation](https://podman.io/docs/installation)
* **Cloud PostgreSQL Platform**: Familiarity with services like Aiven, Supabase, or ElephantSQL.

## Getting Started

1.  **Clone the Repository:**

    ```bash
    git clone [https://github.com/khanumar03/sttp.git](https://github.com/khanumar03/sttp.git)
    cd sttp
    ```

2.  **Install Dependencies:**

    Install the dependencies for both the root project (backend) and the client application.

    ```bash
    npm install # or yarn install
    cd client
    npm install # or yarn install
    cd ..
    ```

## Database Setup (Prisma with PostgreSQL)

This project uses Prisma with PostgreSQL for its database. You'll need to set up your database connection and generate Prisma clients.

### PostgreSQL Database Provisioning

Choose one of the following methods to provision your PostgreSQL database:

#### Option 1: Using Docker or Podman (Local Container)

This is the recommended method for local development.

1.  **Run PostgreSQL Container:**
    Use the following command to start a PostgreSQL container. Replace `your_db_user`, `your_db_password`, and `your_database_name` with your desired credentials.

    ```bash
    # For Docker
    docker run --name sttp-postgres -e POSTGRES_USER=your_db_user -e POSTGRES_PASSWORD=your_db_password -e POSTGRES_DB=your_database_name -p 5432:5432 -d postgres:16-alpine

    # For Podman (if Docker is not installed or preferred)
    podman run --name sttp-postgres -e POSTGRES_USER=your_db_user -e POSTGRES_PASSWORD=your_db_password -e POSTGRES_DB=your_database_name -p 5432:5432 -d postgres:16-alpine
    ```
    This command will:
    * Create a container named `sttp-postgres`.
    * Set the database user, password, and database name.
    * Map port `5432` from the container to your host machine, making the database accessible at `localhost:5432`.
    * Run the `postgres:16-alpine` image in detached mode (`-d`).

2.  **Verify Container Status (Optional):**
    You can check if the container is running:

    ```bash
    docker ps # or podman ps
    ```

#### Option 2: Using a Cloud PostgreSQL Platform (e.g., Aiven, Supabase, ElephantSQL)

If you prefer a managed database service, you can use a cloud platform.

1.  **Create a PostgreSQL Instance:**
    * Go to your chosen platform (e.g., Aiven, Supabase, ElephantSQL).
    * Follow their instructions to create a new PostgreSQL database instance.
    * Make sure to note down the **host**, **port**, **database name**, **username**, and **password** provided by the service.

2.  **Ensure Network Accessibility:**
    * If you are running your application locally, ensure your cloud database instance is configured to accept connections from your development machine's IP address (if applicable, often handled by default or via connection strings).

### Environment Variables

Environment variables are crucial for configuring the application. Template files are provided to guide you.

1.  **Create Server Environment File (`.env`):**
    Copy the template file for the server's environment variables from the root directory:

    Open the newly created `.env` file and replace the placeholder values with your actual PostgreSQL connection details and desired port.

    Example `.env` content:
    ```dotenv
    # .env
    # Database Connection URL for PostgreSQL
    # Replace with your actual PostgreSQL credentials
    # If using local container:
    DATABASE_URL="postgresql://your_db_user:your_db_password@localhost:5432/your_database_name?schema=public"
    # If using a cloud platform, replace localhost:5432 with your cloud provider's host and port:
    DATABASE_URL="postgresql://your_db_user:your_db_password@your_cloud_host:your_cloud_port/your_database_name?\schema=public"
    ```

2.  **Create Client Environment File (`.env`):**
    Navigate into the `client` directory and copy the template file for the client's environment variables:

    Open the newly created `client/.env` file and replace the placeholder values.

    Example `client/.env` content:
    ```dotenv
    # client/.env
    # Base URL for the backend API
    # This should point to your backend server's address
    SERVER_URL="http://localhost:3001"

    # for database
    DATABASE_URL=postgresql://postgres:password@localhost:5432/prisma

    
    ```
    *For additional examples of environment variables, please refer to the .env.template file.*

### Prisma Client Generation and Migrations

1.  **Generate Prisma Client (Backend):**

    From the root directory of the project, generate the Prisma client for the backend:

    ```bash
    npx prisma generate
    ```

2.  **Generate Prisma Client (Client/Frontend):**

    Navigate into the `client` directory and then generate the Prisma client specifically for the frontend, making sure to specify the schema path:

    ```bash
    cd client
    npx prisma generate --schema=../prisma/schema.prisma
    cd ..
    ```

3.  **Run Prisma Migrations (Initial Database Setup):**

    If this is your first time setting up the database and you need to apply migrations to create the database schema, run the following from the root directory:

    ```bash
    npx prisma migrate dev --name init
    ```
    *Replace `init` with a descriptive name for your migration.*

## Running the Applications

### 1. Start the Server

From the root directory, run the backend server:

```bash
npm run dev # or yarn dev
```

### 1. Start the Frontend

navigate to client directory, run the frontend

```bash
cd client
npm run dev # or yarn dev
```

