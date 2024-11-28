const connectToMongo = require('./db'); // Import the function from db.js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON

// Routes
app.use('/api/auth', require('./routes/auth')); // Authentication routes
app.use('/api/notes', require('./routes/contacts')); // Notes-related routes

// Default Route
app.get('/', (req, res) => {
  res.send('Hello Puneeth!');
});

// Function to start the server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectToMongo(); // Wait for MongoDB connection
    console.log('Connected to MongoDB!');

    app.listen(port, () => {
      console.log(`ContactLog backend listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1); // Exit the process if server setup fails
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  // Add any cleanup logic here, e.g., closing database connections
  process.exit(0);
});

// Start the server
startServer();
