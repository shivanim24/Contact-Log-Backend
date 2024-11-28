const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://sivanimoparthi:Shivani%401234@cluster0.ka9f9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Function to connect to MongoDB
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
};

module.exports = connectToMongo; // Export the function
