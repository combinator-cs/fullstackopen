const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const dbUrl = process.env.MONGO_DB;

mongoose
  .connect(dbUrl)
  .then((result) => {
    console.log("db connected");
  })
  .catch((error) => {
    console.log("error while connecting to db:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);
