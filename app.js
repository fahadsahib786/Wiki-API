const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set("view-engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added the new article!");
      } else {
        res.send(err);
      }
    });
  })
  .get(function (res, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all the articles!");
      } else {
        res.send(err);
      }
    });
  });

///////////Finding just a single articles///////

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("Not article found with this title!");
        }
      }
    );
  })
  .put(function(req, res){

    Article.updateOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully updated the selected article.");
        }
      }
    );
  })
  .patch(function (req, res) {
      Article.updateOne(
          {title: req.params.articleTitle},
        {$set: req.body},
        function (err) {
            if (!err) {
                res.send("Successfully updated the artilce.");
            } else {
                res.send(err);
            }
        }
      );
  })
  .delete(function (req, res) {
      Article.deleteOne(
          {title: req.params.articleTitle},
          function (err) {
              if (!err) {
                  res.send("Successfully deleted!");
              } else {
                  res.send(err);
              }
          }
      );
  });

app.listen(3000, function () {
  console.log("Server started at port 3000!");
});
