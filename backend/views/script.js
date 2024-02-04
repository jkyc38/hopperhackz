const express = require('express')
const app = express()
const data = require("../app")

const question = document.getElementById("questions")

question.textContent = "hello"


const answer1 = document.getElementById("answers1")
answer1.onclick = function(){
    question.textContent = "hello"
}
