const amqp = require('amqplib');
require('dotenv').config();
const ProcessedTransaction = require('../models/transaction.model');

let channel, connection;
const QUEUE_NAME = 'transaction_queue';

const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URI);
        channel = await connection.createChannel();

        // Assert the queue immediately
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(`🐰 RabbitMQ connection established `);
        console.log(`📦 And queue "${QUEUE_NAME}" asserted`);
    } catch (err) {
        console.error('RabbitMQ connection error:', err);
        process.exit(1);
    }
};

const publishMessages = async (messages) => {
    if (!channel) await connectRabbitMQ();

    messages.forEach(msg => {
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(msg)), { persistent: true });
    });
    console.log(`${messages.length} messages published`);
};

// Consumer: listens to the queue and saves into ProcessedTransaction collection
const startConsumer = (ch) => {
    ch.consume(
        QUEUE_NAME,
        async (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log('📥 Consumed message:', data);

                try {
                    await ProcessedTransaction.create(data);
                    ch.ack(msg);
                    console.log('✅ Message processed and saved to ProcessedTransaction DB');
                } catch (err) {
                    console.error('❌ Error processing message:', err.message);

                }
            }
        },
        { noAck: false }
    );

    console.log(`🟢 Consumer started for queue "${QUEUE_NAME}"`);
};

module.exports = {
    connectRabbitMQ,
    publishMessages,
    QUEUE_NAME
};
