'''
import json
import torch
from transformers import AutoTokenizer, AutoModel
import json

model_name = "SAVSNET/PetBERT"

print(f"モデル『{model_name}』をダウンロード中...")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

def get_embedding(text):
    encode_input = tokenizer(text, padding=True, truncation=True, return_tensors='pt')

    with torch.no_grad():
        model_output = model(**encode_input)
    
    token_vectors = model_output.last_hidden_state
    sentence_embedding = torch.mean(token_vectors[0], dim=0).tolist()

    return sentence_embedding

file_path = "../../datasets/dataset.jsonl"
documents = []
with open(file_path, 'r', encoding='utf-8') as f:
    for line in f:
        documents.append(json.loads(line))

# 各ドキュメントをベクトル化して保存する辞書
embeddings = {}

print("ベクトル化を開始")

for doc in documents:
    doc_id = doc["doc_id"]
    text = doc["text"]

    print(f"{doc_id} をベクトル化中...")

    # feature-extractionタスクでベクトル化を実行
    embedding_vector = get_embedding(text)

    if embedding_vector:
        embeddings[doc_id] = embedding_vector
        print(f"-> 成功。ベクトルの次元数: {len(embedding_vector)}")

    else:
        print(f"-> 失敗。")

output_filepath = "../../datasets/embeddings.jsonl"

print(f"ベクトルデータを'{output_filepath}'に保存中...")

with open(output_filepath, 'w', encoding='utf-8') as f:
    for doc_id, vector in embeddings.items():
        # 1行分のデータを作成
        line_data = {'doc_id': doc_id, 'vector': vector}
        f.write(json.dumps(line_data, ensure_ascii=False) + '\n')
print("保存が完了")
'''


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