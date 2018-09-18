const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Idea = mongoose.model("ideas");
const User = mongoose.model("users");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

// Ideas Index
router.get("/", (req, res) => {
  Idea.find({ status: "public" })
    .populate("user")
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// Show Single Idea
router.get("/show/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .populate("user")
    .populate("comments.commentUser")
    .then(idea => {
      var allowComments = null;
      if (idea.allowComments == "true") {
        allowComments = true;
      } else {
        allowComments = false;
      }
      if (idea.status == "public") {
        res.render("ideas/show", {
          idea: idea,
          allowComments: allowComments
        });
      } else {
        // Access control of private ideas
        if (req.user) {
          if (req.user.id == idea.user._id) {
            res.render("ideas/show", {
              idea: idea,
              allowComments: allowComments
            });
          } else {
            res.redirect("/ideas");
          }
        } else {
          res.redirect("/ideas");
        }
      }
    });
});

// List ideas from a user
router.get("/user/:userId", (req, res) => {
  Idea.find({ user: req.params.userId, status: "public" })
    .populate("user")
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// Logged in users ideas
router.get("/my", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .populate("user")
    .then(ideas => {
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// Add Idea Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

// Edit Idea Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user != req.user.id) {
      res.redirect("/ideas");
    } else {
      var allowComments = null;
      if (idea.allowComments == "true") {
        allowComments = true;
      } else {
        allowComments = false;
      }
      res.render("ideas/edit", {
        idea: idea,
        allowComments: allowComments
      });
    }
  });
});

// Process Add Idea
router.post("/", (req, res) => {
  // Log data into the object
  const newIdea = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: !!req.body.allowComments,
    user: req.user.id
  };
  // Create Idea
  new Idea(newIdea).save().then(idea => {
    res.redirect(`/ideas/show/${idea.id}`);
  });
});

// Edit Form Process
router.put("/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // Get the new values from the form
    idea.title = req.body.title;
    idea.body = req.body.body;
    idea.status = req.body.status;
    idea.allowComments = !!req.body.allowComments;
    idea.user = req.user.id;
    idea.save().then(idea => {
      res.redirect("/dashboard");
    });
  });
});

// Delete Idea
// Can implement flash messages if you want
router.delete("/:id", (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    res.redirect("/dashboard");
  });
});

// Add Comment
router.post("/comment/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };

    // Add to comments array
    // Unshift adds to the begining of the array O(N)
    // It would be better to do this with push O(1) and
    // read the array in reverse if this were in production
    idea.comments.unshift(newComment);

    idea.save().then(idea => {
      res.redirect(`/ideas/show/${idea.id}`);
    });
  });
});

module.exports = router;
