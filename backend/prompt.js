function gptPrompt(topic){
    return `make a 10 question quiz with four multiple choice questions each on ${topic}. Make sure you dont add any label like "questions"
     before the multiple choice questions. I strictly want the multiple choice questions ONLY. I want you to provide the answers at the bottom 
     labeled Answer Key; however, I want the answer key to only have the multiple choice, not the answers that come with the multiple choice. No headers     
     `
}

module.exports = {
    gptPrompt
}