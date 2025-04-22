/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const mongoose = require("mongoose");

mongoose.connect(process.env.DB);

const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    title: { type: String, required: true },
    comments: { type: [String], default: [] },
  })
);

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      const result = await Book.find().exec();
      const books = result.map((book) => {
        return {
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length,
        };
      });
      return res.json(books);
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (!title) {
        return res.status(200).send("missing required field title");
      }
      const newBook = new Book({ title });
      const result = await newBook.save();
      return res.json({
        _id: result._id,
        title: result.title,
      });
    })

    .delete(async function (req, res) {
      await Book.deleteMany();
      res.send("complete delete successful");
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      try {
        const result = await Book.findById(bookid).exec();
        if (!result) {
          return res.status(200).send("no book exists");
        } else {
          return res.json({
            _id: result._id,
            title: result.title,
            comments: result.comments,
          });
        }
      } catch (e) {
        return res.status(200).send("no book exists");
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        return res.status(200).send("missing required field comment");
      }
      try {
        const result = await Book.findByIdAndUpdate(
          bookid,
          { $push: { comments: comment } },
          { new: true }
        ).exec();
        if (!result) {
          return res.status(200).send("no book exists");
        } else {
          return res.json({
            _id: result._id,
            title: result.title,
            comments: result.comments,
          });
        }
      } catch (e) {
        return res.status(200).send("no book exists");
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      try {
        const result = await Book.findByIdAndDelete(bookid).exec();
        if (!result) {
          return res.status(200).send("no book exists");
        } else {
          return res.send("delete successful");
        }
      } catch (e) {
        return res.status(200).send("no book exists");
      }
    });
};
