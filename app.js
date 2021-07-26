//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

const localDBAddress = "mongodb://localhost:27017/blogDB";

const atlasDBAddress = `mongodb+srv://${process.env.ATLAS_DB_USER}:${process.env.ATLAS_DB_PASSWORD}@cluster0.1igbd.mongodb.net/min_blog?retryWrites=true&w=majority`

// mongoose.connect(localDBAddress, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
mongoose.connect(atlasDBAddress, { useCreateIndex : true, useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
                .then(() => console.log("Connected with the database server"))
                .catch((err) => console.log("Failed to connect with the database server:", err));

const postSchema = new Schema(
  {
    title: String,
    content: String,
  }
);

const Post = mongoose.model("Post", postSchema);

app.get("/", async  function(req, res){
  
  let posts = []; 
  // await Post.find()
  //     .exec(
  //       (err, items) => 
  //       {
  //         if(err)
  //         {
  //           console.log("There appeared an error during searching posts.");
  //           docs = [];
  //           console.log(docs);
  //           res.render("home", {
  //             startingContent: homeStartingContent,
  //             //posts: posts
  //             posts: docs,
  //           });
  //         }
  //         else
  //         {
  //           console.log("Found such posts: ");
  //           console.log(items);
  //           docs = items;
  //           console.log(docs);
  //           res.render("home", {
  //             startingContent: homeStartingContent,
  //             //posts: posts
  //             posts: docs,
  //           });
  //         }
  //       }
  //     )

  await Post.find()
      .then((docs) => posts = docs)
      .catch(console.dir);
  
  res.render("home", {
    startingContent: homeStartingContent,
    //posts: posts
    posts: posts,
  });
      
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  const newPost = new Post(post);

  newPost.save()
         .then(() => { console.log("New post was saved."); res.redirect("/"); })
         .catch((err) => { console.log("Failed to save new post."); console.log(err); });
});

app.get("/posts/:postID", function(req, res){
  //const requestedTitle = _.lowerCase(req.params.postName);

  const postID = req.params.postID;

  Post.findById(postID)
      .then(
        (post) =>
        {
          res.render("post", 
            {
              title: post.title,
              content: post.content,
            }
          );
        }
      )
      .catch((err) => { console.dir(err); res.redirect('/'); });

  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
