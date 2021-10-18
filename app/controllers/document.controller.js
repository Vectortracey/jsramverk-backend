const db = require("../models");
const Document = db.documents;

// Create and Save a new Document
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Document
  const document = new Document({
    name: req.body.name,
    contents: req.body.contents,
  });

  // Save Document in the database
  document.save(document)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Document.",
      });
    });
};

// Retrieve all Documents from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  Document.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving documents.",
      });
    });
};

// Find a single Document with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Document.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Document with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Document with id=" + id });
    });
};

// Update a Document by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Document.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Document with id=${id}. Maybe Document was not found!`,
        });
      } else res.send({ message: "Document was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Document with id=" + id,
      });
    });
};

// Delete a Document with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Document.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Document with id=${id}. Maybe Document was not found!`,
        });
      } else {
        res.send({
          message: "Document was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Document with id=" + id,
      });
    });
};

// Delete all Documents from the database.
exports.deleteAll = (req, res) => {
  Document.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Documents were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all documents.",
      });
    });
};
