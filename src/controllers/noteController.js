const noteModel = require("../models/note");
const dotenv = require("dotenv");
dotenv.config();

const createNote = async (req, res, next) => {
  const { title, description } = req.body;
  const newNote = await noteModel.create({
    title: title,
    description: description,
    userId: req.userId,
  });
  try {
    await newNote.save();
    //execution ruki rhy gi jab tak new note save nahi hojata
    res.status(201).json(newNote);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
const updateNote = async (req, res, next) => {
  const id = req.params.id;
  const { title, description } = req.body;

  const newNote = { title: title, description: description };

  try {
    await noteModel.findByIdAndUpdate(id, newNote, { new: true });
    res.status(200).json(newNote);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
const deleteNote = async (req, res, next) => {
  const id = req.params.id;
  try {
    const note = await noteModel.findByIdAndRemove(id);
    res.status(202).json(note);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
const getNote = async (req, res, next) => {
  try {
    let notes = await noteModel.find({ userId: req.userId });
    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = { createNote, updateNote, deleteNote, getNote };
