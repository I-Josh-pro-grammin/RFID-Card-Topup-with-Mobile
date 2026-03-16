# Database Schema Documentation

The system uses **MongoDB** as the persistent storage engine. The database is named `rfid_commerce`.

## Collections

### 1. `wallets`
Stores student card information and current balances.
- `rfid_uid` (String, Unique): Physical card UID.
- `balance` (Number): Current credit balance.
- `user_name` (String): Display name of the student.
- `status` (String): `active` or `blocked`.

### 2. `transactions`
Records every financial activity in the system.
- `rfid_uid` (String): UID of the card used.
- `amount` (Number): Transaction amount.
- `type` (String): `credit` (Top-up) or `debit` (Payment).
- `description` (String): Human-readable details.
- `timestamp` (Number): Unix timestamp.
- `terminal` (String): ID of the device that processed the request (e.g., `Mobile-App`, ESP8266 MAC).

### 3. `products`
Catalog of available services for purchase.
- `name` (String): Service name.
- `price` (Number): Cost in credits.
- `category` (String): Food, Service, Internet, etc.
