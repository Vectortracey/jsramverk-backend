module.exports = app => {
  const documents = require("../controllers/document.controller.js");

  var router = require("express").Router();

  // Create a new Document
  router.post("/", documents.create);

  // Retrieve all Documents
  router.get("/", documents.findAll);

  // Retrieve a single Document with id
  router.get("/:id", documents.findOne);

  // Update a Document with id
  router.put("/:id", documents.update);

  // Delete a Document with id
  router.delete("/:id", documents.delete);

  // Create a new Document
  router.delete("/", documents.deleteAll);

  app.use("/api/documents", router);
};
