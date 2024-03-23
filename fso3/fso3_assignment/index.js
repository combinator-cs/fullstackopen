require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

// Middleware

app.use(express.json());

morgan.token("body", function (request) {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
  return "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

//Endpoints

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(
    request.params.id
      .then((person) => {
        if (person) {
          response.json(person);
        } else {
          response.status(404).end();
        }
      })
      .catch((error) => {
        next(error);
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

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findById(
    request.params.id
      .then((result) => {
        response.status(404).end();
      })
      .catch((error) => {
        next(error);
      })
  );
});

app.put("/api/persons/:id", (request, response, next) => {
  const person = request.body;
  const personData = new Person({
    name: person.name,
    number: person.number,
  });
  Person.findByIdAndUpdate(request.params.id, personData, { new: true })
    .then((updatedRes) => {
      response.json(updatedRes);
    })
    .catch((error) => next(error));
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

//Later middlewares
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
