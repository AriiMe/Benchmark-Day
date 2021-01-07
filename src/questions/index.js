/** @format */

const express = require("express");
const { readQuestions, writeQuestions } = require("../lib/utilities");
const Router = express.Router();
const uniqid = require("uniqid");

Router.post("/giveID", async (req, res) => {
    try {
        const questionDB = await readQuestions();

        questionDB.forEach((question) => (question._id = uniqid()));
        await writeQuestions(questionDB);
    } catch (error) {
        console.log(error);
    }
});

Router.delete("/:questionID", async (req, res, next) => {
    try {
        const questionsDB = await readQuestions();

        const newDB = questionsDB.filter(
            (question) => question._id !== req.params.questionID
        );
        await writeQuestions(newDB);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

module.exports = Router;
