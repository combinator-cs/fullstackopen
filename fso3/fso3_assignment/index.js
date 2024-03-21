require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(express.json());

// Middleware
morgan.token("body", function (request) {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
  return "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// app.use(printPostData);

// function printPostData(request, response, next) {
//   response.on("finish", function () {
//     if (request.method === "POST") {
//       console.log(request.body);
//     }
//   });
//   next();
// }

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(
    request.params.id.then((person) => {
      response.json(person);
    })
  );
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  if (person && person.name && person.number) {
    const personData = new Person({
      name: person.name,
      number: person.number,
    });
    personData.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  } else {
    response.json({ error: "content missing" });
    response.status(400).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/api/info", (request, response) => {
  response.send(
    "<p>Phonebook has info for " +
      persons.length +
      " people <br><br>" +
      new Date() +
      "</p>"
  );
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
