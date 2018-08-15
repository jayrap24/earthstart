var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/earth_star", {useMongoClient: true})
//add body-parser that's what grabs information from the post data form.
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//SCHEMA Setup for the data
var videoSchema = new mongoose.Schema({
    name: String,
    url: String,
    description: String
});

var Video = mongoose.model("Video", videoSchema);

//INDEX ROUTE
app.get("/", function(req, res){
    res.redirect("/video");  
});

//INDEX ROUTE-- Landing page when people go to the site
app.get("/video", function(req, res){
    Video.find({}, function(err,allVideos){
        if(err){
            console.log(err);
        } else {
            res.render("landing",{videoData: allVideos})
        }
    })  
});

//CREATE ROUTE-- Page where we can see the added videos
app.post("/video", function(req, res){
    //Get the data from the form name,url,description
    var name = req.body.name;
    var url = req.body.url;
    var description = req.body.description;
    var newVideo = {name:name, url:url, description:description};
        Video.create(newVideo, function(err, newlyCreated){
            if (err){
                console.log(err);
            } else {
                res.redirect("/video")
            };
        });
});

//NEW ROUTE-- Display the form to add video
app.get("/video/admin", function(req, res){
    res.render("new");  
});

//SHOW ROUTE- show description of the video
app.get("/video/:id", function(req, res){
    //find video with the provided id from the database
    Video.findById(req.params.id, function(err, foundVideo){
       if(err){
           console.log(err);
       } else {
               //render the show template
    res.render("show", {video:foundVideo}); 
       }
    });  
});

//EDIT ROUTE--
app.get("/video/:id/edit", function(req, res){
    //just like the SHOW route
     Video.findById(req.params.id, function(err, foundVideo){
       if(err){
            console.log(err);
       } else {
            res.render("edit", {video: foundVideo}); 
       }
    });  
});

//UPDATE ROUTE --
app.put("/video/:id", function(req, res){
    //findByIdAndUpdate-- (id, newData, callback)--inputs it back to the form "name"... in this case its video[]
   Video.findByIdAndUpdate(req.params.id, req.body.video, function(err, updatedVideo){
        if (err){
            console.log(err);
        } else {
            res.redirect("/video/" + req.params.id)
        }
    }); 
});


//DELETE ROUTE --
app.delete("/video/:id", function(req,res){
   Video.findByIdAndRemove(req.params.id, function(err, deletedVideo){
       if (err){
           console.log(err);
       } else {
           res.redirect("/video")
       }
   }); 
});


    
app.listen(3000, function(){
    console.log("EarthStar is starting");
});