const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const convert = require('./functionality');
const { error } = require('console');
let questionkey = [];
let answerchoices = [];
let answerkey = [];
let parsedquiz = [];
let gptDone = false;
let quizData;



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});


const upload = multer({ storage: storage }).single("avatar");

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/index', (req, res)=>{
    res.render("index");
});
app.get('/answers',(req,res)=>{
    res.render('answers');
})
//test upload function
// app.post("/upload", (req,res)=>{
//     res.render("webpage");
// })
app.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log("Upload error:", err);
            return res.status(500).send(err.message);
        }

        // Reading the uploaded file
        let pathToFile = `./uploads/${req.file.filename}`;

        fs.readFile(pathToFile, (err, data) => {
            if (err) {
                console.log("Read file error:", err);
                return res.status(500).send(err.message);
            }

            // Process the file data as needed

            // Send a response back to the client
            console.log("file uploaded!");
            
        });
        convert.ocrFunc(pathToFile)
            .then(output => {
                console.log(output);
                convert.chatgpt(output) //creates the quiz
                .then(quiz=>{
                    console.log(quiz);
                    //this parses the gpt output into lists to add into webpage
                    parsedquiz = quiz.split(/\r?\n/); //regex
                    answerkey = parsedquiz.splice(-10);
                    console.log(parsedquiz);
                    for (i=0;i<58;i+=6) {
                    questionkey.push(parsedquiz[i]);
                    answerchoices.push(parsedquiz.slice(i+1, i+5));
                    }

                    console.log("this is the question key");
                    console.log(questionkey);

                    console.log("this is the answer choices");
                    console.log(answerchoices);

                    console.log("this is the answer key");
                    console.log(answerkey);

                    quizData = {
                        questions: questionkey,
                        choices: answerchoices,
                        answers: answerkey
                    }

                    gptDone = true;
                    res.render("webpage");
                    
                })
                .catch(error=>{
                    console.error('Error', error);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
        

    });
});
//TODO
//WHEN YOU GET THE THREE DATA TYPES PUT IT IN QUIZ DATA AND HAVE THE KEY

app.get('/get-quiz', (req,res)=>{
    res.json(quizData);
})


const PORT = 3000;

app.listen(PORT, () => console.log(`Hey, I'm running on port ${PORT}`));
