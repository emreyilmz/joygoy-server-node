const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Grammer = mongoose.model("Grammer");
const GrammerItem = mongoose.model("GrammerItem");
const Post = mongoose.model("Movie");
const requireLogin = require("../middleware/requireLogin")


router.get("/grammer", requireLogin,(req, res) => {
    Grammer.find()
        .then((lists) => {
            res.json({ lists: lists });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get("/grammerItem", (req, res) => {
    Grammer.find()
        .then((lists) => {
            res.json({ lists: lists });
        })
        .catch((err) => {
            console.log(err);
        });
});

router.post("/grammer", (req, res) => {
    const { name, type } = req.body;

    if (!name ||  !type ) {
        return res.status(422).json({ error: "please fill all fields" });
    }

    const list = new Grammer({
        name,
        type,
    });

    list.save()
        .then((list) => {
            res.json({ message: "succesfully" });
        })
        .catch((err) => {
            return res.status(422).json({ error: err });
        });
});

router.post("/grammerItem", (req, res) => {
    const { status,grammerBy,regex } = req.body;

    if (!status || !grammerBy ||!regex ) {
        return res.status(422).json({ error: "please fill all fields" });
    }

    const grammerItem = new GrammerItem({
        status,
        grammerBy,
        regex
    });

    grammerItem.save()
        .then((list) => {
            res.json({ message: "succesfully" });
        })
        .catch((err) => {
            return res.status(422).json({ error: err });
        });
});

router.post("/search-grammer", (req, res) => {
    const { regex,language,id,status } = req.body;

    GrammerItem.find({ grammerBy: id,status:status })
        .then((lists) => {
           
             Post.find({
        $and: [
            {
                name: {
                    $regex: lists[0].regex,
                    $options: "i",
                },
            },
        ],
    })
        .select("_id  name number tr")
        .limit(200)
        .then((posts) => {
            console.log(posts)
            var count = posts.length;
            res.json({ count, posts });
        })
        .catch((err) => {
            console.log(err);
        }); 
        })
        .catch((err) => {
            console.log(err);
        });

   
});



module.exports = router;