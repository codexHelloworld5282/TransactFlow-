require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./services/rabbitmq.service');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();
    await connectRabbitMQ();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
};

startServer();
