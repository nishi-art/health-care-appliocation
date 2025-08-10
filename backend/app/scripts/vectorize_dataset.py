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
    json.dump(embeddings, f, ensure_ascii=False)

print("保存が完了")