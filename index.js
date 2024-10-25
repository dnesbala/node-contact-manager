const fs = require("fs");
const express = require("express");
const contacts = require("./contacts.json");

const app = express();
const PORT = 8000;

app.use(express.json());

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
  fs.writeFile("./contacts.json", JSON.stringify(contacts), (err) => {
    if (err) {
      console.log("Error writing contact to file");
    } else {
      return res.status(201).json({
        message: "Contact created successfully",
        contact_id: contacts.length,
      });
    }
  });
});

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
