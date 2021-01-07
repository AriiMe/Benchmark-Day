/** @format */

const express = require("express");
const { check, validationResult } = require("express-validator");
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

Router.post(
    "/",
    [
        check("duration")
            .exists()
            .isInt()
            .withMessage("give a duration number in sec"),
        check("text")
            .exists()
            .isLength({ min: 4 })
            .withMessage("write the question"),
        check("answers")
            .exists()
            .isArray({ min: 4, max: 4 })
            .withMessage("write the 4 answers"),
        check("answers.*.isCorrect")
            .exists()
            .isBoolean()
            .withMessage("true or false"),
        check("answers.*.text").exists().withMessage("give text for the answers"),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors)
            res.send(errors)
        } else {
            try {
                const questionDB = await readQuestions();
                questionDB.push({
                    ...req.body,
                    _id: uniqid(),
                });
                await writeQuestions(questionDB);
                res.send("Question added")
                console.log(req.body)
            } catch (error) {
                console.log(error);
            }
        }
    }

);

Router.put("/")

module.exports = Router;
