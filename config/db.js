const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongohost = process.env.MONGOHOST;
    const mongoport = process.env.MONGOPORT;
    const databasename = process.env.DATABASENAME;

    let mongoString =
      "mongodb://" + mongohost + ":" + mongoport + "/" + databasename;
    const conn = await mongoose.connect(mongoString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err, "Error");
  }
};

module.exports = connectDB;
