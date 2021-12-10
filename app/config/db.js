const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoDB = process.env.MONGO_URI;

    const conn = await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
