/** @format */

const express = require("express");
const uniqid = require("uniqid");
const { join } = require("path")
const { readExam, readQuestions, writeExam } = require("../lib/utilities");
const Router = express.Router();

Router.post("/start", async (req, res) => {
    try {
        const examsDB = await readExam();
        const questionsDB = await readQuestions();
        const actualQuestions = [];
        try {
            const selectedQuestions = [];

            for (let i = 0; i < 5; i++) {
                let questionIndex = Math.floor(Math.random() * questionsDB.length);
                if (selectedQuestions.includes(questionIndex)) {
                    i--;
                } else {
                    selectedQuestions.push(questionIndex);
                }
            }

            selectedQuestions.forEach((index) => {
                actualQuestions.push(questionsDB[index]);
            });


        } catch (error) {
            console.log(error);
        }

        examsDB.push({
            ...req.body,
            _id: uniqid(),
            examDate: new Date(),
            isCompleted: false,
            totalDuration: 30,
            questions: actualQuestions,
        });
        await writeExam(examsDB)
        res.send("added")
    } catch (error) {
        console.log(error);
    }
});

Router.post('/start', async (req, res) => { })

Router.post('/examID/answer', async (req, res) => {
    try {
        const examsDB = await readExam
        const selectedExamIndex = examsDB.findIndex((exam) => exam._id === req.params.examID)
        if (selectedExamIndex !== -1) {
            examsDB[selectedExamIndex].questions[req.body.question].providedAnswer = req.body.answer
            await writeExam(examsDB)
            res.send("answer recieved")
        } else {
            res.send("Can't find exam bruv")
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = Router;
