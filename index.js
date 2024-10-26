const express = require("express");

const { requestLogger } = require("./middlewares");
const contactRoutes = require("./contacts/routes/contactRoutes");

const app = express();
const PORT = 8000;

app.use(express.json());

// Request Logger middleware
app.use(requestLogger());

app.use("/api/contacts", contactRoutes);

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
