# Vibe Commerce

A full-stack e-commerce application (Shopping Cart) with a React frontend and Node.js/Express/MongoDB backend.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Backend API Documentation](#backend-api-documentation)
  - [Products Endpoints](#products-endpoints)
  - [Cart Endpoints](#cart-endpoints)
  - [Checkout Endpoint](#checkout-endpoint)
  - [Health Check](#health-check)
- [Backend Setup](#backend-setup)
- [Frontend Overview](#frontend-overview)
- [Frontend Setup](#frontend-setup)
- [Technologies Used](#technologies-used)
- [License](#license)

---

## Project Overview

Vibe Commerce is a simple shopping cart SPA where users can browse and add products to their cart, edit cart quantities, and complete a checkout process. The app features:
- React-based intuitive UI
- Backend API built with Express & MongoDB
- Product, cart, and checkout functionality
- Order summary/receipt slip

## Backend API Documentation

**Base URL (development):** `http://localhost:5000/api/`

### Products Endpoints

#### `GET /api/products`
- **Description:** Fetch all available products.
- **Response:** List of product objects.
- **Fallback:** If MongoDB is down or empty, returns in-memory mock products.

#### Example Response:
```json
[
  {
    "_id": "661e71b89d937bb2f47d1fcb",
    "name": "Wireless Headphones",
    "price": 79.99,
    "description": "Premium noise-canceling headphones",
    "image": "/images/headphones.svg"
  }
]
```

### Cart Endpoints

#### `GET /api/cart`
- **Description:** Retrieve all items in the current cart with totals.
- **Response:**
```json
{
  "items": [
    {
      "id": "1714527329221",
      "productId": "661e71b89d937bb2f47d1fd2",
      "name": "Wireless Mouse",
      "price": 34.99,
      "quantity": 2,
      "subtotal": "69.98",
      "image": "/images/mouse.svg"
    }
  ],
  "total": "159.98",
  "itemCount": 2
}
```

#### `POST /api/cart`
- **Description:** Add a product to the cart or update its quantity if already in cart.
- **Body:**
```json
{
  "productId": "<string>",
  "qty": "<number>"
}
```
- **Success Response:** `{ "message": "Item added to cart successfully" }`

#### `PUT /api/cart/:id`
- **Description:** Update the quantity of a given cart item.
- **Body:** `{ "quantity": "<number>" }`
- **Success Response:** `{ "message": "Cart item updated successfully" }`

#### `DELETE /api/cart/:id`
- **Description:** Remove an item from the cart.
- **Success Response:** `{ "message": "Item removed from cart successfully" }`

### Checkout Endpoint

#### `POST /api/checkout`
- **Description:** Process the cart for checkout and generate a receipt.
- **Body:**
```json
{
  "cartItems": [ { "productId": "<string>", "quantity": "<number>" } ],
  "name": "<string>",
  "email": "<string>"
}
```
- **Success Response (receipt):**
```json
{
  "orderId": "ORD-1714527721903",
  "customer": { "name": "John Doe", "email": "john@example.com" },
  "items": [
    { "name": "Wireless Headphones", "quantity": 1, "price": 79.99, "subtotal": "79.99" }
  ],
  "total": "173.96",
  "tax": "13.92",
  "grandTotal": "187.88",
  "timestamp": "2024-04-01T10:02:01.903Z",
  "status": "completed"
}
```

### Health Check

#### `GET /api/health`
- **Response:** `{ status: 'OK', message: 'Vibe Commerce API is running' }`

## Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file:** Copy `.env.example` (if any) or create `.env` and set `MONGODB_URI` (MongoDB connection string).

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. The server runs on `http://localhost:5000` by default.

## Frontend Overview

- **UI:** Modern React SPA using functional components and hooks
- **Key features:**
  - Product listing from backend API
  - Cart modal with item controls & total
  - Smooth "Add to Cart", "Remove", and "Update Quantity"
  - Checkout form with validation
  - Order summary slip generation

## Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start local dev server:**
   ```bash
   npm run dev
   ```

3. The app is served on `http://localhost:5173` (or as shown by Vite)

## Technologies Used
- Frontend: React, Axios, Vite, CSS
- Backend: Node.js, Express, MongoDB, Mongoose, CORS, Dotenv


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - surajdwivedi644@gmail.com
Project Link: https://github.com/suryadwd/Nexora

---

Feel free to star ⭐ this repository if you find it helpful!