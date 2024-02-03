import openai
import os 
APIKEY = "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"
openai.api_key = APIKEY

prompt = input("What do you want to generate? ")
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages = [
        {"role": "user", 
         "content": prompt}
    ],
    

)

response = response['choices'][0]['message']['content']

print(response)