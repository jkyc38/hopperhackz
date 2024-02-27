const ocr = require('ocr-space-api-wrapper')
const openai = require('openai')
const prompt = require('./prompt')
const ai = new openai.OpenAI({
  apiKey: OPENAI_KEY
});

OCR_APIKEY = OCR_KEY;
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

 function main () {
    try{
      ocrFunc("./uploads/pic.png")
      .then(result=>{
        console.log(result);
      })
    }
    catch(error){
      console.error(error)
    }
    
  }


  
  // main();
module.exports={
  chatgpt,
  ocrFunc
}

