from google import genai
import json
import os
from dotenv import load_dotenv

API_KEY = os.getenv("GOOGLE_API_KEY")
load_dotenv()
client = genai.Client(api_key=API_KEY)

file_path = "../../datasets/dataset.jsonl"
out_file_path = "../../datasets/embeddings_dataset_3.jsonl"
original_documents = []
vector_lists = []
with open(file_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        original_documents.append(data)
        vector_lists.append(data["text"])

result = client.models.embed_content(
    model="gemini-embedding-001",
    contents=vector_lists,
)
result_list = result.embeddings

with open(out_file_path, 'w', encoding='utf-8') as f:
    for doc, vector in zip(original_documents, result_list):
        line_data = {
            "doc_id": doc["doc_id"],
            "vector": vector.values,
            }
        f.write(json.dumps(line_data, ensure_ascii=False) + '\n')
    print("保存が完了")