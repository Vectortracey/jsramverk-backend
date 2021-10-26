const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../../server.js");
const should = chai.should()

chai.use(chaiHttp)

describe("Documents", () => {
  describe("Should get all documents", () => {

    it("All document returned", (done) => {
      chai
        .request(server)
        .get("/api/documents/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("Array");
          done();
        });
    });
  });

  describe("Should create a new document, update it and retrive it", () => {
    let newDocumentId = "";
    const contents = "<p>hello</p>";
    const name = "Another test document";
    it("Document created", (done) => {
      chai
        .request(server)
        .post("/api/documents/")
        .set("content-type", "application/json")
        .send({ contents: "<p>hello world</p>", name: "A test document" })
        .end((err, res) => {
          res.should.have.status(200);
            //console.log(res.res.text.id);
           // console.log(res.body.id)
            res.body.id.should.be.a("string");
          newDocumentId = res.body.id;
          done();
        });
    });
    it("Document updated", (done) => {
      var newDocumentId2 = "6177ad976f26d016949d6baf";
      chai
        .request(server)
        .put(`/api/documents/${newDocumentId}`)
        .set("content-type", "application/json")
        .send({
          contents: "<p>updated hello world</p>",
          name: "updated test document",
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it("Document retrieved", (done) => {
        var newDocumentId3 = "6177ad976f26d016949d6baf";
      chai
        .request(server)
        .get(`/api/documents/${newDocumentId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.id.should.equal(newDocumentId);
          done();
        });
    });
    it("Document deleted", (done) => {
      var newDocumentId2 = "6177ad976f26d016949d6baf";
      chai
        .request(server)
        .delete(`/api/documents/${newDocumentId}`)
        .set("content-type", "application/json")
        .send({
          contents: "<p>updated hello world</p>",
          name: "updated test document",
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe("Should fail to update a non existent document", () => {
    it("Failed to update new document", (done) => {
      chai
        .request(server)
        .put("/api/documents/")
        .set("content-type", "application/json")
        .send({
          id: "asdf",
          contents: "<p>hello</p>",
          name: "Another test document",
        })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe("Should fail to create a new document", () => {
    it("Failed to create new document", (done) => {
      chai
        .request(server)
        .post("/api/documents/")
        .set("content-type", "application/json")
        .send({ contentss: "<p>hello world</p>", namee: "A test document" })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe("Should fail to retrieve non existent document", () => {
    it("Failed to retrieve non existent document", (done) => {
        let newDocumentId3 = "12341231";
      chai
        .request(server)
        .get(`/api/documents/${newDocumentId3}`)
        .end((err, res) => {
          res.should.have.status(500);
          //console.log(res)
          done();
        });
    });
  });
  describe("Should serve HTML when not hitting api", () => {
    it("HTML served", (done) => {
      chai
        .request(server)
        .get("/asdf")
        .end((err, res) => {
          res.should.have.status(404);
          //console.log(res.text);
          res.text.should.include("<pre>Cannot GET /asdf</pre>");
          done();
        });
    });
  });
});
