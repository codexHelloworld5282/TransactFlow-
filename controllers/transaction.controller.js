const path = require('path');
const mongoose = require('mongoose');
const readCSV = require('../utils/csvReader');
const { publishMessages } = require('../services/rabbitmq.service');
const Transaction = require('../models/transaction.model');

const CHUNK_SIZE = 50;
let currentChunkIndex = 0;
let transactions = [];

// STEP 1: Load all data once
const loadTransactions = async () => {
    const filePath = path.join(__dirname, '../data/transactions.csv');
    transactions = await readCSV(filePath);
    console.log(`✅ CSV file loaded. Total records: ${transactions.length}`);
};

// STEP 2: Process 50 chunk
const processNextChunk = async (req, res) => {
    try {
        if (transactions.length === 0) {
            await loadTransactions();
        }

        if (currentChunkIndex >= transactions.length) {
            return res.status(200).json({ message: "🎉 All chunks processed successfully." });
        }

        const chunk = transactions.slice(currentChunkIndex, currentChunkIndex + CHUNK_SIZE);

        // Start MongoDB transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Check for missing or duplicate st_brand_id in chunk
            const missingId = chunk.find(item => !item.st_brand_id);
            if (missingId) {
                throw new Error("❌ Missing st_brand_id in chunk. Rolling back transaction.");
            }

            const ids = chunk.map(c => c.st_brand_id);
            const uniqueIds = new Set(ids);
            if (uniqueIds.size !== ids.length) {
                throw new Error("❌ Duplicate st_brand_id found in chunk. Rolling back transaction.");
            }

            // Save to DB
            await Transaction.insertMany(chunk, { session });
            console.log(`✅ DB insert successful for chunk ${currentChunkIndex / CHUNK_SIZE + 1}`);

            // Publish to RabbitMQ
            await publishMessages(chunk);
            console.log(`✅ Published ${chunk.length} messages to RabbitMQ.`);

            await session.commitTransaction();
            session.endSession();

            currentChunkIndex += CHUNK_SIZE;

            res.status(200).json({
                message: `✅ Chunk ${currentChunkIndex / CHUNK_SIZE} processed successfully.`,
                nextStep: currentChunkIndex < transactions.length
                    ? "Do you want to process the next 50 records? Call this endpoint again."
                    : "🎉 All data processed."
            });

        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            console.error(err.message);
            return res.status(400).json({ error: err.message });
        }

    } catch (err) {
        console.error("❌ Error processing transactions:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

module.exports = { processNextChunk };
