# Mini Order Management CRM --- Frontend

A React-based frontend for a Shopify-integrated Order Management CRM. It
allows users to browse orders, search and filter the order list, and
view order details from the backend API.

## Live Demo

**Frontend:** https://order-crm.netlify.app/

**Backend API:** https://mini-order-management-crm-backend.onrender.com

The frontend is deployed on Netlify and connects to the NestJS backend for order listing, searching, filtering, pagination, and order details.

Shopify order creation and update events are handled by the backend through configured webhooks.

## Tech Stack

-   React
-   Vite
-   JavaScript
-   Tailwind CSS v4
-   Ant Design
-   Backend REST API

## Features

-   View orders retrieved from the backend.
-   Search and filter orders.
-   Navigate through paginated order results.
-   View individual order details, including customer information, order
    date, status, total amount, and line items.
-   Connect to the deployed NestJS backend.

## Prerequisites

-   Node.js (use a version supported by the project's `package.json`)
-   npm
-   The backend API running locally or deployed

## Getting Started

### 1. Install dependencies

``` bash
npm install
```

### 2. Configure the backend URL

If the frontend reads its API URL from an environment variable, create a
`.env` file in the frontend project root and set the variable name
expected by the source code. For example:

``` env
VITE_API_BASE_URL=https://mini-order-management-crm-backend.onrender.com
```

If the project currently defines the backend URL directly in its API
client, update that location instead. Vite exposes client-side
environment variables prefixed with `VITE_`; never put secrets in
frontend environment variables.

### 3. Start the development server

``` bash
npm run dev
```

Vite prints the local URL in the terminal, commonly
`http://localhost:5173`.

### 4. Build for production

``` bash
npm run build
```

To preview the production build locally:

``` bash
npm run preview
```

Check `package.json` for the exact scripts configured in this
repository.

## Backend Connection

The frontend is intended to use the backend API:

`https://mini-order-management-crm-backend.onrender.com`

Ensure the backend is deployed and reachable. If the browser reports a
CORS error, configure CORS on the backend to allow the frontend's local
or deployed origin. Do not attempt to fix CORS by adding secret
credentials to the frontend.

## Order Management Workflow

1.  The frontend requests order data from the backend.
2.  Users browse the order list and use available search, filter, and
    pagination controls.
3.  Selecting an order opens its detail view.
4.  The backend returns the order and associated line items stored in
    PostgreSQL.

Shopify webhooks are processed by the backend; the frontend does not
receive Shopify webhooks directly.

## Deployment

Deploy the frontend to a static hosting provider that supports Vite
builds.

Typical deployment settings:

-   **Build command:** `npm run build`
-   **Output directory:** `dist`

Set the backend API base URL using the environment variable or
configuration method used by the project. If the frontend is deployed to
a different domain, ensure the backend CORS configuration allows that
origin.

## Deployment on Netlify

The frontend is configured for deployment on Netlify.

### Build settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`

### Deploy steps

1. Push the frontend project to a Git repository.
2. In Netlify, choose **Add new site** and import the repository.
3. Set the build command to `npm run build` and the publish directory to `dist`.
4. Add the frontend environment variable used by the API client, if applicable. For example:

   ```env
   VITE_API_BASE_URL=https://mini-order-management-crm-backend.onrender.com
   ```

5. Deploy the site and open the generated Netlify URL.
6. Confirm the deployed frontend can reach the backend API.

Use the exact environment variable name referenced in the frontend source code. Vite environment variables are included in the browser bundle, so do not store Shopify secrets, database credentials, or other private keys in them.

### SPA routing

If the application uses React Router or another client-side router, configure a Netlify redirect so direct navigation to nested routes serves `index.html`. Create `public/_redirects` with:

```text
/*    /index.html   200
```

This file should be included in the production `dist` output.

### Troubleshooting

- **Orders fail to load:** Check the deployed API base URL and the browser Network tab.
- **CORS errors:** Configure the backend to allow the Netlify site origin.
- **Environment changes are not applied:** Trigger a new Netlify deployment after updating environment variables.
- **Nested routes return 404:** Confirm the SPA redirect rule is included in the deployed output.

## Troubleshooting

-   **Orders do not load:** Check the browser Network tab and verify the
    backend URL and API route.
-   **CORS error:** Add the frontend origin to the backend's CORS
    allowlist.
-   **API returns an error:** Check the backend logs and response
    status.
-   **Environment changes are not reflected:** Restart the Vite
    development server after editing `.env`.
-   **Production build fails:** Run `npm run build` locally and resolve
    TypeScript or bundler errors shown by the project.

## Security Notes

-   Do not put Shopify API secrets, webhook secrets, or database
    credentials in frontend code.
-   Treat frontend environment variables as public because they are
    included in the client bundle.
-   Use HTTPS for production API requests.

## Project Structure

Typical Vite areas include:

-   `src/` --- React components and application code
-   API client/service files --- backend requests
-   `public/` --- static assets
-   `index.html` --- Vite HTML entry point

Use the actual folder and file names in this repository if they differ.

## License

Add the applicable license if this project is distributed publicly.
