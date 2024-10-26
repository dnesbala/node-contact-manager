const express = require("express");

const {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

router.route("/").get(getAllContacts).post(createContact);

router
  .route("/:id")
  .get(getContactById)
  .patch(updateContact)
  .delete(deleteContact);

module.exports = router;
