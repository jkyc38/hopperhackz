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
                    parsedquiz = quiz.split(/\r?\n/);
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


                    module.exports = {
                        questionkey,
                        answerchoices,
                        answerkey
                    };
                    gptDone = true;
                    res.render("webpage");
                    console.log(questionkey[0]);
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

// const exportvars = [
//     questionkey,
//     answerchoices,
//     answerkey
// ];

// export {exportvars};

app.get('/get-question-key', (req,res)=>{
    res.json(questionkey);
})
app.get('/get-answer-choices', (req,res)=>{
    res.json(answerchoices);
})
app.get('/get-answer-key', (req,res)=>{
    res.json(answerkey);
})

const PORT = 3000;

app.listen(PORT, () => console.log(`Hey, I'm running on port ${PORT}`));

