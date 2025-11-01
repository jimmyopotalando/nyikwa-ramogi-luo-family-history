# Nyikwa Ramogi Luo Family History

A web application showcasing the Nyikwa Ramogi Luo family history, integrated with M-Pesa payment processing and SMS notifications. Users can explore clan histories, support the project through donations, and leave comments.

---

## Table of Contents

- [Features]
- [Technology Stack]
- [Setup and Installation]
- [Environment Variables]
- [Running the Application]
- [Testing]
- [Contributing]
- [License]

---

## Features

- Browse family clan history by county and clan.
- Secure payment via M-Pesa STK Push for accessing clan information.
- Donations via M-Pesa to support research efforts.
- SMS notifications sent upon successful payment or donation.
- User comments submission.
- Admin logs for payments, donations, SMS, and comments.

---

## Technology Stack

- **Frontend:** React (or Vue/Svelte)
- **Backend:** Node.js with Express
- **Payments:** Safaricom Lipa na M-Pesa API
- **SMS:** Africa's Talking or Twilio
- **Testing:** Jest, Supertest

---

## Setup and Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/nyikwa-ramogi-luo-family-history.git
   cd nyikwa-ramogi-luo-family-history
   ```

2.Install dependencies
npm install
cd frontend
npm install
cd ..

3.Configure environment variables
.Rename .env.example to .env

.Fill in your Safaricom M-Pesa credentials, SMS gateway keys, and other config values.

Running the Application
Backend

npm run dev
This will start the backend server with hot reloading using nodemon.

Frontend

If using React or similar:
cd frontend
npm start

Testing

Run all tests with:
npm test

License

This project is licensed under the MIT License.

Research by Rozenval Solutions
