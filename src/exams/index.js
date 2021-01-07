/** @format */

const express = require("express");
const uniqid = require("uniqid");
const { join } = require("path");
const { readExam, readQuestions, writeExam } = require("../lib/utilities");
const Router = express.Router();

Router.post("/start", async (req, res) => {
    try {
        const examsDB = await readExam();
        const questionsDB = await readQuestions();

        const actualQuestions = [];

        let examDuration = 0
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
                console.log(index)
                examDuration += questionsDB[index].duration
            });
        } catch (error) {
            console.log(error);
        }

        examsDB.push({
            ...req.body,
            _id: uniqid(),
            examDate: new Date(),
            isCompleted: false,
            totalDuration: examDuration,
            questions: actualQuestions,
        });
        await writeExam(examsDB);
        res.send("added");
    } catch (error) {
        console.log(error);
    }
});

Router.post("/:examID/answer", async (req, res) => {
    try {
        const examsDB = await readExam();
        const selectedExamIndex = examsDB.findIndex(
            (exam) => exam._id === req.params.examID
        );
        if (selectedExamIndex !== -1) {
            examsDB[selectedExamIndex].questions[req.body.question].providedAnswer =
                req.body.answer;
            await writeExam(examsDB);
            res.send("answer recieved");
        } else {
            res.send("Can't find exam bruv");
        }
    } catch (error) {
        console.log(error);
    }
});

Router.get("/:examID", async (req, res) => {
    try {
        const examsDB = await readExam();
        const selectedExam = examsDB.find((exam) => exam._id === req.params.examID);

        let score = 0;
        selectedExam.questions.forEach((question) => {
            if (question.answers[question.providedAnswer].isCorrect === true) { score += 1; }
        })
        selectedExam.score = score;
        selectedExam.isCompleted = true;
        res.send(selectedExam)
    } catch (error) {
        console.log(error);
    }
});

module.exports = Router;
