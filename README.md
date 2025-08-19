🐰 CSV RabbitMQ Processor








A Node.js application to process CSV files in chunks, store original records in MongoDB, publish to RabbitMQ, and automatically consume messages into a processed collection.

✨ Features

🚀 Upload CSV via Postman (multipart/form-data)

🗂️ Chunk processing (default 50 records per chunk)

🔒 MongoDB transactions with validation (duplicate & missing st_brand_id)

📦 RabbitMQ publishing with persistent messages

🟢 Automatic consumer saves messages to ProcessedTransaction collection

📋 Logs for every step: DB insert, message publishing, and consumption

🛠 Tech Stack

Node.js + Express

MongoDB (Mongoose)

RabbitMQ (amqplib)

CSV parsing (csv-parser)

Multer for file uploads

⚡ Installation

Clone the repo:

git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>


Install dependencies:

npm install


Create a .env file in the root:

PORT=3000
MONGODB_URI=mongodb://localhost:27017/your_db
RABBITMQ_URI=amqp://localhost


Start the server:

node server.js

🚀 Usage

Open Postman.

Make a POST request to:

http://localhost:3000/api/transactions/xxx


In Body → form-data, add key file and select your CSV file.

Send the request. The server will:

📥 Parse CSV

🗄️ Insert chunks into Transaction collection

📦 Publish messages to RabbitMQ

✅ Consumer saves messages to ProcessedTransaction

📄 CSV Format
st_brand_id	brand_name	product_name
1	Brand A	Product X
2	Brand B	Product Y

st_brand_id must be unique per CSV chunk.

🗂 Project Structure
.
├── controllers/
│   └── transaction.controller.js
├── models/
│   ├── transaction.model.js
│   └── processedTransaction.model.js
├── routes/
│   └── transaction.routes.js
├── services/
│   └── rabbitmq.service.js
├── utils/
│   └── csvReader.js
├── app.js
├── server.js
└── .env

📝 Logs

✅ DB insert successful

📦 Messages published to RabbitMQ

📥 Consumer consumed message

✅ Message saved to ProcessedTransaction

🐳 Optional: Run with Docker

RabbitMQ Docker container

docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management


Management UI: http://localhost:15672

Default user/pass: guest/guest

Start your Node.js app (ensure .env points to amqp://localhost)

📦 License

MIT © Eisha Ayub
