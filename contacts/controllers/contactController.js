const fs = require("fs");
const contacts = require("../../contacts.json");

function getAllContacts(req, res) {
  return res.json(contacts);
}

function getContactById(req, res) {
  const contact = contacts.find(
    (contact) => contact.id === Number(req.params.id)
  );
  if (!contact) {
    res.status(404).json({ error: "Contact Not Found" });
  }
  return res.json(contact);
}

function createContact(req, res) {
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

  if (req.body.phone_number.length !== 10) {
    return res
      .status(400)
      .json({ error: "Phone number should be 10 characters long" });
  }

  const contact = { id: contacts.length + 1, ...req.body };
  contacts.push(contact);
  writeToContactFile(res, {
    statusCode: 201,
    message: "Contact created successfully",
    contactId: contacts.length,
  });
}

function updateContact(req, res) {
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
}

function deleteContact(req, res) {
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
    data: JSON.stringify(filteredContacts),
    message: "Contact deleted successfully",
    contactId: id,
  });
}

function writeToContactFile(
  res,
  { data = JSON.stringify(contacts), statusCode = 200, contactId, message }
) {
  fs.writeFile("./contacts.json", data, (err) => {
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

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
