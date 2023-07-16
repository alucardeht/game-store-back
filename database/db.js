const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

async function close() {
    try {
        await mongoose.connection.close();
        console.log('Connection to the database closed');
    } catch (error) {
        console.error('Error closing the database connection:', error);
        throw error;
    }
}

// Verificamos se o módulo é o arquivo principal
if (require.main === module) {
    connect();
}

module.exports = {
    connect,
    close,
};
