# Muma Bike Shop API Documentation

## User & Authentication APIs

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

## Product APIs

- `GET /api/products` - Get all products with pagination, filtering, and search
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update product information (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)
- `PATCH /api/products/:id/toggle-featured` - Toggle product featured status (admin only)

## Category APIs

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category details and its products
- `POST /api/categories` - Create a new category (admin only)
- `PUT /api/categories/:id` - Update category information (admin only)
- `DELETE /api/categories/:id` - Delete a category (admin only)
- `PATCH /api/categories/:id/toggle-homepage` - Toggle category homepage display (admin only)

## Cart APIs

- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add product to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

## Order APIs

- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update order status (admin only)

## Payment APIs

- `POST /api/payments` - Process payment for an order
- `GET /api/payments/callback` - Payment gateway callback endpoint

## Event APIs

- `GET /api/events` - Get all events with filtering options
  - Query parameters: `status`, `type`, `startAfter`, `startBefore`, `sort`
  - Returns: List of events with summary information
- `GET /api/events/:id` - Get event details
  - Returns: Complete event information including description, status, and remaining slots
- `POST /api/events` - Create a new event (admin only)
  - Request body: Event details (title, description, type, times, location, etc.)
  - Returns: Newly created event with ID
- `PUT /api/events/:id` - Update event information (admin only)
  - Request body: Updated event details
  - Returns: Updated event information
- `DELETE /api/events/:id` - Delete an event (admin only)
- `PATCH /api/events/:id/status` - Update event status (admin only)
  - Request body: `{ status: "published"|"ongoing"|"completed"|"cancelled" }`

## Event Registration APIs

- `GET /api/events/:id/registrations` - Get list of registrations for an event (admin only)
  - Returns: List of users who registered for the event with payment and check-in status
- `POST /api/events/:id/register` - Register for an event
  - Request body: `{ additional_info: string, need_pay: boolean }`
  - Returns: Registration confirmation or payment information for paid events
- `POST /api/events/:id/cancel` - Cancel event registration
  - Returns: Confirmation of cancellation and refund status if applicable

## Event Check-in APIs

- `POST /api/events/:id/checkin/:userId` - Check in a user for an event (admin only)
  - Returns: Updated check-in status and timestamp
- `POST /api/events/:id/checkin` - Self check-in for an event (authenticated user)
  - Returns: Confirmation of successful check-in

## User Profile APIs

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/me/points` - Get user's point history
- `GET /api/users/me/coupons` - Get user's coupons

## Appointment APIs

- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/:id` - Update appointment details
- `DELETE /api/appointments/:id` - Cancel an appointment

## Coupon APIs

- `GET /api/coupons` - Get available coupons
- `POST /api/coupons/:id/claim` - Claim a coupon
- `POST /api/coupons/validate` - Validate a coupon for an order

## API Response Format

All APIs follow a consistent response format:

```json
{
  "success": true/false,
  "data": {}, // Response data for successful requests
  "error": {  // Error information for failed requests
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Authentication

Most endpoints require authentication through an Authorization header with a JWT token:
```
Authorization: Bearer <token>
```

Admin-only endpoints require both authentication and admin privileges. 