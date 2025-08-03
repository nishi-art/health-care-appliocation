import textwrap
import google.generativeai as genai
import os

def print_text(text):
    text = text.replace('・', ' *')
    indented_text = ""
    for line in text.splitlines():
        indented_text += f"> {line}\n"
    print(indented_text)

genai.configure(api_key="***REMOVED***")
model = genai.GenerativeModel('gemini-2.5-pro')
response = model.generate_content("買っているトイプードルの体重が1か月で5kg増えたのですが食事の量を減らした方が良いですか？")
print_text(response.text)