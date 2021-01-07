const express = require('express');
const { readExams, writeExams, readQuestions } = require('../lib/utilities')
const Router = express.Router()

Router.post("/start", async (req, res) => {
    try {
        const examsDB = await readExams()
        const questionsDB = await readQuestions()
        try {
            const selectedQuestions = []

            for (let i = 0; i < 5; i++) {
                let questionIndex = Math.floor(Math.random() * questionsDB.length)
                if (selectedQuestions.includes(questionIndex)) {
                    i--
                } else {
                    selectedQuestions.push(questionIndex)
                }
            }
            console.log(selectedQuestions)
        } catch (error) {
            console.log(error)
        }
        examsDB.push({
            ...req.body,
            _id: uniqid(),
            examDate: new Date,
            isCompleted: false,
            totalDuration: 30,
            questions: []
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = Router