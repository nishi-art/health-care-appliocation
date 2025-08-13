import json
import google.generativeai as genai
import time
import os
from dotenv import load_dotenv

def translate_text(text):
    load_dotenv()
    API_KEY = os.getenv("GOOGLE_API_KEY")
    source_file = './datasets/dataset_3.jsonl'
    output_file = './datasets/translated.jsonl'
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')

    prompt = f"""
    Translate the following Japanese text to English.
    Return only the plain, unformatted text. Do not use any Markdown formatting such as headings, bolding, or line breaks.

    Japanese: {text}
    English:
    """
    response = model.generate_content(prompt)
    print(response.text)
    return response.text

'''
with open(source_file, 'r', encoding='utf-8') as f:
    first_line = f.readline()
    data = translate_text(first_line)
    print(data)
'''