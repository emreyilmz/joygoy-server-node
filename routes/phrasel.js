const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Phrasel = mongoose.model("Phrasel");
const requireLogin = require("../middleware/requireLogin")

router.get("/phrasel",requireLogin, (req, res) => {

    Phrasel.find({ })
        .select("_id word translate")
        .then((word) => {
            res.json({ word });
        })
        .catch((err) => {
            console.log(err);
        });
});


router.post("/phrasel",requireLogin, (req, res) => {
    const { word, translate } = req.body;
    
    if (!word || !translate) {
        return res.status(404).json("Lütfen gerekli alanları doldurunuz");
    }


    const phrasel = new Phrasel({
        word,
        translate,
    });

    phrasel
        .save()
        .then((result) => {
            res.json({ data: result });
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;