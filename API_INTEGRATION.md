# GearUp Frontend - API Integration Map

This document outlines how the Next.js frontend components are mapped to the backend endpoints to fulfill the mandatory assignment requirements.

## 🟢 Customer Endpoints

| Feature / UI Component | Backend API Endpoint | HTTP Method | Description |
|-------------------------|-----------------------|-------------|-------------|
| **Home Page / Gear Listing** | `/api/gear` | `GET` | Fetches all available gear items for the public catalog. |
| **Gear Details Page** | `/api/gear/:id` | `GET` | Fetches details for a single gear item. |
| **Authentication Form** | `/api/auth/login` | `POST` | Authenticates users (returns JWT and sets HttpOnly cookies). |
| **Registration Form** | `/api/auth/register` | `POST` | Registers a new user with a specific role. |
| **Customer Orders Table** | `/api/customer/rentals` | `GET` | Retrieves the rental order history for the logged-in customer. |
| **Place Rental Order** | `/api/customer/rentals` | `POST` | Submits a new rental order (requires selected dates). |
| **Stripe Checkout UI** | `/api/payment/checkout` | `POST` | Initiates the Stripe Checkout session and returns the payment URL. |
| **Submit Review** | `/api/reviews` | `POST` | Submits a review and rating for a returned gear item. |

## 🟣 Provider Endpoints

| Feature / UI Component | Backend API Endpoint | HTTP Method | Description |
|-------------------------|-----------------------|-------------|-------------|
| **Provider Dashboard Grid** | `/api/provider/gear` | `GET` | Fetches all gear items created by the logged-in provider. |
| **Add New Gear Modal** | `/api/provider/gear` | `POST` | Creates a new gear listing in the provider's inventory. |
| **Edit Gear Modal** | `/api/provider/gear/:id` | `PUT` | Updates an existing gear listing (including availability). |
| **Delete Gear Action** | `/api/provider/gear/:id` | `DELETE` | Removes a gear listing from the platform. |
| **Provider Orders Table** | `/api/provider/orders` | `GET` | Fetches all rental orders placed for the provider's gear. |
| **Update Order Status** | `/api/provider/orders/:id` | `PATCH` | Updates the status of an order (e.g. from PLACED to CONFIRMED). |

## 🔴 Admin Endpoints

| Feature / UI Component | Backend API Endpoint | HTTP Method | Description |
|-------------------------|-----------------------|-------------|-------------|
| **Manage Users Table** | `/api/admin/users` | `GET` | Retrieves all registered users across the platform. |
| **Toggle User Status** | `/api/admin/users/:id` | `PATCH` | Suspends or activates a user account. |
| **Global Gear Table** | `/api/admin/gear` | `GET` | Retrieves all gear listings across the entire platform. |
| **Global Orders Table** | `/api/admin/rentals` | `GET` | Retrieves all rental orders across the entire platform. |
| **Category Management** | `/api/gear/categories` | `GET` | Fetches all available gear categories. |
| **Create Category** | `/api/gear/categories` | `POST` | Creates a new category (requires admin privileges). |
| **Update Category** | `/api/gear/categories/:id`| `PUT` | Updates an existing category (including category image). |
| **Delete Category** | `/api/gear/categories/:id`| `DELETE` | Deletes a gear category. |
