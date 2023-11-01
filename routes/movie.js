const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const requireLogin = require("../middleware/requireLogin")
const Movie = mongoose.model("Movie")
const User = mongoose.model("User")



/* router.get('/allmovie',(req,res)=>{
    Movie.find()
    .limit(75)
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
}) */

router.get('/allmovie',requireLogin,(req,res)=>{
    console.log("çalıştı")
    Movie.aggregate([
        {$match: {}},
        {$sample: {size: 500}}
    ], ).then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post("/search-movie",requireLogin,(req, res) => {
   

    Movie.find({
        $or:[
            

        {name: new RegExp(" "+ req.body.text + " ", "i"),},

        {name: new RegExp(" "+ req.body.text+"\\.", "i"),},
        {name: new RegExp(" "+ req.body.text+"\\,", "i"),},





        ]
    })
        .select("_id number name tr movie")
        .limit(250)
        .then((posts) => {
            res.json({ posts });
            console.log(posts)

        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/search-movie-single",requireLogin,(req, res) => {
   

    Movie.find({
        $or:[
            

        {name: new RegExp(" "+ req.body.text + " ", "i"),},

        {name: new RegExp(" "+ req.body.text+"\\.", "i"),},
        {name: new RegExp(" "+ req.body.text+"\\,", "i"),},





        ]
    })
        .select("_id number name tr movie")
        .limit(1)
        .then((posts) => {
            res.json({ posts });
            console.log(posts)

        })
        .catch((err) => {
            console.log(err);
        });
});




/* router.get("/allmovie", (req, res) => {
    const page = 1;
    Movie.aggregate([
        {
            $group: {
                _id: "$_id",
                name: { $push: "$name" },
                number: { $push: "$number" },

                tr: { $push: "$tr" },
            },
        },
        {
            $project: {
                _id: "$_id",
                name: 1,
                tr: 1,
                number: 1,
            },
        },
        { $skip: (page - 1) * 5 },
        { $limit: 50 },
    ], { "allowDiskUse" : true })
        .then((posts) => {
            res.json({posts})
        })
        .catch((err) => {
            console.log(err);
        });
}); */




/* router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body}= req.body
    if(!title || !body){
        res.status(422).json({error:"Please add all the fields"})
    }
    console.log(req.user)
    

    const post = new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/myposts',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
}) */


module.exports = router