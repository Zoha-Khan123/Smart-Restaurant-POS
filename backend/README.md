# Smart Restaurant POS — Backend (Phase 1)

Production-ready Authentication, Authorization, Session Management, Security, and Super Admin foundation for Multi-Tenant Restaurant POS SaaS.

---

## 📋 Quick Setup & Running

### 1. Environment Configuration
Ensure `.env` exists in the `backend/` directory:
```bash
cp .env.example .env
```

### 2. Provision the Super Admin Account
Run the one-time provisioning script:
```bash
npm run seed:super-admin
```
*Default Credentials configured in `.env`:*
* **Email:** `superadmin@restaurantpos.com`
* **Password:** `SuperAdmin@SecurePass123!`

### 3. Start the Server
```bash
# Development mode (with live reload)
npm run dev

# Production mode
npm start
```
The server will run on: `http://localhost:5000`

### 4. Run Automated Tests
```bash
npm test
```

---

## 🧪 Step-by-Step API Testing Guide (Postman / Thunder Client / cURL)

**Base URL:** `http://localhost:5000/api/auth`

---

### Step 1: Health Check
* **Method:** `GET`
* **URL:** `http://localhost:5000/health`
* **Headers:** None
* **Expected Response (200 OK):**
```json
{
  "status": "ok",
  "uptime": 12.34,
  "timestamp": "2026-09-16T12:00:00.000Z"
}
```

---

### Step 2: Login (Super Admin)
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/auth/login`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "email": "superadmin@restaurantpos.com",
  "password": "SuperAdmin@SecurePass123!"
}
```
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "requires2FA": false,
    "user": {
      "id": "6aaae3c2e1603e0551d94be9",
      "name": "Super Administrator",
      "email": "superadmin@restaurantpos.com",
      "role": "super_admin",
      "tenantId": null,
      "status": "active",
      "emailVerified": true,
      "twoFactorEnabled": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```
> 📌 **Important:** Save the `accessToken` and `refreshToken` values for subsequent requests!

---

### Step 3: Get Current User Profile (`/me`)
* **Method:** `GET`
* **URL:** `http://localhost:5000/api/auth/me`
* **Headers:**
  * `Authorization: Bearer <accessToken>`
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "6aaae3c2e1603e0551d94be9",
      "email": "superadmin@restaurantpos.com",
      "name": "Super Administrator",
      "role": "super_admin",
      "tenantId": null,
      "status": "active",
      "emailVerified": true,
      "twoFactorEnabled": false
    }
  }
}
```

---

### Step 4: Refresh Access Token (Token Rotation)
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/auth/refresh`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "refreshToken": "<your_current_refreshToken>"
}
```
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "<new_accessToken>",
    "refreshToken": "<new_rotated_refreshToken>",
    "user": { ... }
  }
}
```

---

### Step 5: View Active Sessions
* **Method:** `GET`
* **URL:** `http://localhost:5000/api/auth/sessions`
* **Headers:**
  * `Authorization: Bearer <accessToken>`
  * `x-refresh-token: <refreshToken>` *(optional: highlights current session)*
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Sessions retrieved successfully",
  "data": {
    "sessions": [
      {
        "id": "6aaae3c2e1603e0551d94bee",
        "device": "Desktop",
        "userAgent": "PostmanRuntime/7.39.0",
        "ipAddress": "::1",
        "createdAt": "2026-09-16T12:00:00.000Z",
        "lastUsedAt": "2026-09-16T12:00:00.000Z",
        "isCurrent": true
      }
    ]
  }
}
```

---

### Step 6: Revoke a Specific Session
* **Method:** `DELETE`
* **URL:** `http://localhost:5000/api/auth/sessions/<sessionId>`
* **Headers:**
  * `Authorization: Bearer <accessToken>`
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Session revoked successfully"
}
```

---

### Step 7: Revoke All Active Sessions
* **Method:** `DELETE`
* **URL:** `http://localhost:5000/api/auth/sessions`
* **Headers:**
  * `Authorization: Bearer <accessToken>`
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "All active sessions have been revoked"
}
```

---

### Step 8: Change Password
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/auth/change-password`
* **Headers:**
  * `Authorization: Bearer <accessToken>`
  * `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "currentPassword": "SuperAdmin@SecurePass123!",
  "newPassword": "NewAdmin@SecurePass456!",
  "confirmPassword": "NewAdmin@SecurePass456!"
}
```
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully. Please log in again with your new password."
}
```

---

### Step 9: Forgot Password
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/auth/forgot-password`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "email": "superadmin@restaurantpos.com"
}
```
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "If the provided email address is registered, you will receive password reset instructions shortly."
}
```

---

### Step 10: Reset Password with Token
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/auth/reset-password`
* **Headers:** `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "token": "<token_from_reset_email_or_db>",
  "password": "SuperAdmin@SecurePass123!",
  "confirmPassword": "SuperAdmin@SecurePass123!"
}
```
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Password has been successfully reset. Please log in with your new password."
}
```

---

### Step 11: Email Verification
* **Resend Verification Link:**
  * **Method:** `POST`
  * **URL:** `http://localhost:5000/api/auth/resend-verification`
  * **Body:** `{ "email": "user@example.com" }`
* **Verify Email:**
  * **Method:** `POST`
  * **URL:** `http://localhost:5000/api/auth/verify-email`
  * **Body:** `{ "token": "<token_from_verification_email>" }`

---

### Step 12: Two-Factor Authentication (2FA) Flow

#### 1. Setup 2FA
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/auth/2fa/setup`
* **Headers:**
  * `Authorization: Bearer <accessToken>`
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "2FA setup initiated. Scan QR code with your authenticator app.",
  "data": {
    "secret": "JBSWY3DPEHPK3PXP...",
    "qrCode": "data:image/png;base64,...",
    "otpauthUrl": "otpauth://totp/Smart%20Restaurant%20POS:..."
  }
}
```
> 📱 Add the `secret` into Google Authenticator or Authy to get live 6-digit codes.

#### 2. Verify & Activate 2FA
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/auth/2fa/verify`
* **Headers:**
  * `Authorization: Bearer <accessToken>`
  * `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "code": "123456"
}
```
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Two-factor authentication has been successfully enabled."
}
```

#### 3. Login with 2FA Challenge
* Attempting login without code will return challenge:
```json
{
  "success": true,
  "message": "Two-factor authentication required",
  "data": {
    "requires2FA": true
  }
}
```
* Send login with `totpCode`:
```json
{
  "email": "superadmin@restaurantpos.com",
  "password": "SuperAdmin@SecurePass123!",
  "totpCode": "123456"
}
```

#### 4. Disable 2FA
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/auth/2fa/disable`
* **Headers:** `Authorization: Bearer <accessToken>`
* **Body (JSON):**
```json
{
  "password": "SuperAdmin@SecurePass123!"
}
```

---

### Step 13: Logout
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/auth/logout`
* **Headers:**
  * `Authorization: Bearer <accessToken>`
  * `Content-Type: application/json`
* **Body (JSON):**
```json
{
  "refreshToken": "<your_current_refreshToken>"
}
```
* **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🔒 Security Architecture Highlights
* **Password Hashing:** Bcrypt (12 salt rounds).
* **Token Storage:** Refresh tokens, reset tokens, and verification tokens stored purely as SHA-256 hashes.
* **Token Rotation:** Replay detection revokes all user sessions.
* **Super Admin Isolation:** `tenantId = null` strictly enforced.
* **Tenant Isolation:** Cross-tenant access strictly blocked at backend middleware.
