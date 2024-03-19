const express = require("express");
const morgan = require("morgan");

const app = express();
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
// app.use(printPostData);

function printPostData(request, response, next) {
  response.on("finish", function () {
    if (request.method === "POST") {
      console.log(request.body);
    }
  });
  next();
}

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((note) => note.id === id);
  if (person) {
    response.json(person);
  } else {
    response.statusMessage = "Person not found";
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  if (person) {
    if (person.name && person.number) {
      if (!persons.find((p) => p.name === person.name)) {
        person.id = Math.round(1000000 * Math.random());
        persons.push(person);
        response.json(person);
      } else {
        response.json({ error: "name must be unique" });
      }
    } else if (person.name) {
      response.json({ error: "Number not present" });
    } else {
      response.json({ error: "Name not present" });
    }
  } else {
    response.json({ error: "bad request" });
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

const PORT = 3031;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
