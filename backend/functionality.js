const ocr = require('ocr-space-api-wrapper')
const openai = require('openai')
const prompt = require('./prompt')
const ai = new openai.OpenAI({
  apiKey: "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"
});

OCR_APIKEY = "K84003519488957";
let quiz;
let topic;
let questionkey = [];
let answerchoices = [];
let answerkey = [];
let parsedquiz = [];


async function ocrFunc(filename){
  const ocrRes = await ocr.ocrSpace(filename, { apiKey: OCR_APIKEY });
  return ocrRes.ParsedResults[0].ParsedText;
}

async function chatgpt(topic){
  let subject = prompt.gptPrompt(topic);
  const results = await ai.chat.completions.create({
    messages:[{role: "user", content: subject}],
    model: 'gpt-3.5-turbo-0301',
  });
  return results.choices[0].message.content;
}

async function main () {
    try {
        
      // OCR FUNCTIONALITY
      // topic = await ocrFunc(filename);
    
    
      //CHAT GPT FUNCTIONALITY
      topic = "smash bros";
      quiz = await chatgpt(topic);

    } catch (error) {
      console.log("error");
      console.error(error);
    }


    parsedquiz = quiz.split(/\r?\n/);

    answerkey = parsedquiz.splice(-10);

    console.log(parsedquiz);
    
    for (i=0;i<parsedquiz.length;i+=6) {
      questionkey.push(parsedquiz[i]);
      answerchoices.push(parsedquiz.slice(i+1, i+5));
    }

    console.log("this is the question key");
    console.log(questionkey);

    console.log("this is the answer choices");
    console.log(answerchoices);

    console.log("this is the answer key");
    console.log(answerkey);
    
  }


  
  // main();
module.exports={
  chatgpt,
  ocrFunc
}

