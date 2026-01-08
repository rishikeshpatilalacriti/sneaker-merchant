# sneaker-merchant
Sneaker Merchant Project To Demonstrate The Payment Gateway Implementation

🏪 Sneaker Merchant – Payment Gateway Integration (Full Stack)--

A full-stack payment processing project demonstrating merchant → payment gateway → database communication using React, Spring Boot, PostgreSQL (Docker).
This project focuses on real-world backend integration, API communication, Dockerized databases, and end-to-end testing, rather than just UI.

--------------------------------------------------------------------------------------------------------------------------------------------------------

📌 Project Overview--

The Sneaker Merchant project simulates an e-commerce payment flow where:
A frontend (React) allows users to purchase sneakers
A Merchant Backend forwards payment requests
A Payment Gateway validates cards, processes payments, and stores transactions
A PostgreSQL database stores card and payment data
The goal of this project is to understand how payment systems work internally, including validations, failures, and transaction tracking.

-----------------------------------------------------------------------------------------------------------------------------------------

🧠 Design & Thought Process--

Before coding, the project was designed with simplicity and clarity:
Only two core entities were required  :  credit_cards   |   payments
Merchant backend should NOT have a database
Payment gateway should handle all business logic
Frontend should stay completely decoupled from the database
All communication must happen via REST APIs
This helped keep the architecture clean and realistic.

----------------------------------------------------------------------

🏗 High-Level Architecture--
┌─────────────────┐
│  React Frontend │  (Port 5173)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Merchant Backend│  (Spring Boot – Port 8080)
│ (Middleware)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Payment Gateway │  (Spring Boot – Port 8081)
│ (Business Logic)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PostgreSQL DB   │  (Docker – Port 5434)
└─────────────────┘

-----------------------------------------------------------------------

🛠 Technology Stack--

Frontend
React 18 (Vite)
JavaScript (ES6)
CSS / Tailwind
Axios (API calls)
Backend
Java 17
Spring Boot 3
Spring Web
Spring WebClient
Spring Data JPA
Maven
Database
PostgreSQL 15
Docker

------------------------------------------------------------------------

Tools--

IntelliJ IDEA (Backend)
VS Code (Frontend)
Postman (API testing)
Git & GitHub

-------------------------------------------------------------------------

📦 Prerequisites--

Make sure all these are installed and verified:

java -version        # Java 17+
mvn -version
node -v              # Node 18+
npm -v
git --version
docker --version

-------------------------------------------------------------------------

📂 Project Structure--
sneaker-merchant/
├── frontend/               # React application
├── backend/                # Merchant Spring Boot app
├── payment-gateway/        # Payment Gateway Spring Boot app
└── README.md

--------------------------------------------------------------------------

⚙️ Project Setup – Step by Step--

1️⃣ Clone the Repository
git clone <your-github-repo-url>
cd sneaker-merchant

--------------------------------------------------------------------------

🐘 Database Setup (Docker)--

2️⃣ Start PostgreSQL Container :
docker run -d \
  --name postgres-merchant \
  -e POSTGRES_DB=payment_gateway_db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -p 5434:5432 \
  postgres:15

Verify  :  docker ps

3️⃣ Connect to Database :
docker exec -it postgres-merchant psql -U admin -d payment_gateway_db

4️⃣ Create Tables (Manually) :
CREATE TABLE credit_cards (
    id SERIAL PRIMARY KEY,
    card_number VARCHAR(16) UNIQUE,
    cardholder_name VARCHAR(100),
    expiry_date VARCHAR(5),
    cvv VARCHAR(3),
    card_balance DECIMAL(10,2),
    is_active BOOLEAN,
    password VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_ref VARCHAR(50),
    card_number VARCHAR(16),
    amount DECIMAL(10,2),
    currency VARCHAR(10),
    order_id VARCHAR(100),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

5️⃣ Insert Demo Data :
INSERT INTO credit_cards
(card_number, cardholder_name, expiry_date, cvv, card_balance, is_active, password)
VALUES
('9523182134960001', 'Rohit Sharma', '12/27', '123', 53002, true, 'rohit@0001'),
('9523182134960002', 'Ananya Verma', '08/26', '234', 28001, true, 'ananya@0002'),
('9523182134960003', 'Karan Mehta', '11/28', '345', 94002, true, 'karan@0003'),
('9523182134960004', 'Priya Iyer', '06/25', '456', 30000, true, 'priya@0004'),
('9523182134960005', 'Amit Kulkarni', '09/27', '567', 67000, false, 'amit@0005');

More Docker Commands :

# Check container  :  docker ps
# Enter postgres  :  docker exec -it postgres-merchant psql -U admin -d payment_gateway_db
# Start DB  :  docker start postgres-merchant
# Stop DB  :  docker stop postgres-merchant
# Restart DB  :  docker restart postgres-merchant
# \dt  :  to check tables
# \q  : to exit DB

-------------------------------------------------------------------------------------

▶️ Running the Applications (Terminal Based)--

6️⃣ Run Payment Gateway (Port 8081) :
cd payment-gateway
mvn clean install
mvn spring-boot:run

Verify  :  Tomcat started on port(s): 8081

7️⃣ Run Merchant Backend (Port 8080) :
cd backend
mvn clean install
mvn spring-boot:run

Verify  :  Tomcat started on port(s): 8080

8️⃣ Run Frontend (Port 5173)
cd frontend
npm install
npm run dev

Open  :  http://localhost:5173

--------------------------------------------------------------------------------------

📡 API Endpoints (Postman Tested)--

🔹 Payment Gateway APIs (8081) :
1. Make Payment  :  POST  :  http://localhost:8081/payment
body
{
  "cardNumber": "9523182134960001",
  "cardholderName": "Rohit Sharma",
  "expiryDate": "12/27",
  "cvv": "123",
  "amount": 12999,
  "currency": "INR",
  "orderId": "ORD-TEST-001"
}

3. Get Payment Status  :  GET  :  http://localhost:8081/payment_status/PAY-XXXXXXXX

4. Get Transactions  :  POST  :  http://localhost:8081/transactions
body
{
  "cardholderName": "Rohit Sharma",
  "cardNumber": "9523182134960001",
  "password": "rohit@0001"
}

🔹 Merchant Backend APIs (8080) :

Merchant backend exposes the same APIs, acting as a middleware:
POST /api/payment
GET  /api/payment_status/{paymentRef}
POST /api/transactions

-------------------------------------------------------------------------------------

🧪 Testing Scenarios--

✅ Successful Cases :
Valid card
Active card
Sufficient balance

❌ Failure Cases :
Invalid CVV
Expired card
Inactive card
Insufficient balance
Wrong cardholder name
Wrong password
All scenarios were tested using Postman

--------------------------------------------------------------------------------------

📌 Key Learnings--
End-to-end payment flow design
WebClient based service-to-service communication
Dockerized PostgreSQL
Manual database control
Clear separation of responsibilities 
Realistic backend validation & error handling

🚀 Future Enhancements--
Swagger / OpenAPI documentation
Authentication & authorization
Deployment using Docker Compose
Payment retries & refunds

---------------------------------------------------------------------------------------

👤 Author
Rishikesh Patil
