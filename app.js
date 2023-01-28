const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");




mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});


const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Blog post title can't be empty."]
    },
    content: {
        type: String,
        required: [true, "Blog post body can't be empty."]
    }
});


const Post = mongoose.model("Post", postSchema);



const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); 


const homeStartingContent = "This is a simple blogging web application. Click on the 'CREATE POST' link to create a new post with a title and a body. After you're done composing, click on 'Publish Post' and you'll be redirected to the home page where a part of it will be displayed. Click on the 'Read More' link beside each post you create, and you'll navigate to the respective post's page with the full post body text shown. While there, click on 'Delete Post' to delete the post and you'll navigate to the home page after the respective post is deleted.";

const aboutContent = "Hello Guys! I am Priyank Rawat. I am currently pursuing B.Tech. in CSE from MAIT.";
const contactContent = "You can Contact us via my EmailID: abc @gmail.com and Phone Number: 98940.";


app.get("/", (req, res) => {
  
    Post.find({}, (err, foundPosts) => {
        if (err) {
            console.log(err);
        } else {
            res.render("home", {startingContent: homeStartingContent, blogPosts: foundPosts});
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", (req, res) => {
    res.render("contact", {contactContent: contactContent});
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post("/compose", (req, res) => {
   
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });
  
    post.save(err => {
        if (!err) {
            res.redirect("/");
        } else {
            console.log(err);
        }
    });
});

app.get("/posts/:postId", (req, res) => {

    const requestedPostId = req.params.postId;

    Post.findOne({_id: requestedPostId}, (err, foundPost) => {
        if (!err) {
            res.render("post", {title: foundPost.title, content: foundPost.content, id: requestedPostId});
        } else {
            console.log(err);
            res.render("post", {title: "Not Found", content: ""});
        }
    });
});

app.post("/delete", (req, res) => {
   
    const requestedId = req.body.deleteButton;

    Post.findByIdAndDelete({_id: requestedId}, (err) => {
        if (!err) {

            res.redirect("/");
        } else {
            console.log(err);
        }
    });
});


let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("Server is up and running on port 3000");
});