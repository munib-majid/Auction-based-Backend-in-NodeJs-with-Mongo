const {
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const auth = require("../middlewares/auth");

const notesRouter = require("express").Router();

notesRouter.get("/", auth, getNote);
notesRouter.post("/", auth, createNote);
notesRouter.put("/:id", auth, updateNote);
notesRouter.delete("/:id", auth, deleteNote);
//these end point are for authenticated users with valid tokens
//we are using auth that is middleware to check system
// auth, xyz yeh jo xyz hai yeh hamara next ki jagha run hota
module.exports = notesRouter;
