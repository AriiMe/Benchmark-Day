const express = require('express')
const { readQuestions } = require('../lib/utilities')
const Router = express.Router()

Router.delete("/:questionID", async (req, res, next) => {
    try {
        const questionsDB = await readQuestions()

        
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})


module.exports = Router