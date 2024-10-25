const fs = require("fs");
const express = require("express");
const contacts = require("./contacts.json");

const app = express();
const PORT = 8000;

app.use(express.json());

// Request Logger middleware
app.use((req, res, next) => {
  const data = `${new Date(Date.now()).toLocaleString()}: ${req.method} ${
    req.path
  }\n`;
  fs.appendFile("./request-log.txt", data, (err) => {
    if (err) {
      return res.status(500).json({
        error: "Something Went Wrong",
      });
    }
    next();
  });
});

app.get("/api/contacts", (req, res) => {
  return res.json(contacts);
});

app.get("/api/contacts/:id", (req, res) => {
  const contact = contacts.find(
    (contact) => contact.id === Number(req.params.id)
  );
  if (!contact) {
    res.status(404).json({ error: "Contact Not Found" });
  }
  return res.json(contact);
});

app.post("/api/contacts", (req, res) => {
  if (
    !req.body ||
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.phone_number
  ) {
    return res
      .status(400)
      .json({ error: "Some field is missing on request body" });
  }

  const contact = { id: contacts.length + 1, ...req.body };
  contacts.push(contact);
  writeToContactFile(res, {
    statusCode: 201,
    message: "Contact created successfully",
    contactId: contacts.length,
  });
});

app.patch("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  const indexOfContactToUpdate = contacts.findIndex(
    (contact) => contact.id === id
  );
  if (indexOfContactToUpdate === -1) {
    return res.status(404).json({
      error: "Contact Not Found",
      contact_id: id,
    });
  }

  contacts[indexOfContactToUpdate] = {
    ...contacts[indexOfContactToUpdate],
    ...req.body,
  };
  writeToContactFile(res, {
    message: "Contact updated successfully",
    contactId: id,
  });
});

app.delete("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);

  const contactToDelete = contacts.find((contact) => contact.id === id);
  if (!contactToDelete) {
    return res.status(404).json({
      message: "Contact Not Found",
    });
  }

  const filteredContacts = contacts.filter(
    (contact) => contact.id !== contactToDelete.id
  );
  writeToContactFile(res, {
    message: "Contact deleted successfully",
    contactId: id,
  });
});

function writeToContactFile(res, { statusCode = 200, contactId, message }) {
  fs.writeFile("./contacts.json", JSON.stringify(contacts), (err) => {
    if (err) {
      console.log("Error writing contact to file");
    } else {
      return res.status(statusCode).json({
        message: message,
        contact_id: contactId,
      });
    }
  });
}

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
