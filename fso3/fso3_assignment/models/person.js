const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const dbUrl = process.env.MONGODB_URI;

mongoose
	.connect(dbUrl)
	.then((result) => {
		console.log("db connected");
	})
	.catch((error) => {
		console.log("error while connecting to db:", error.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 2,
		maxLength: 50,
		required: true,
	},
	number: {
		type: String,
		minLength: 6,
		maxLength: 20,
		required: true,
	},
});

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
