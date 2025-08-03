import json
import torch
from transformers import AutoTokenizer, AutoModel

def vectorization(userinput):
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

    # ユーザーの質問をベクトル化して保存する辞書
    embeddings = {}

    print("ベクトル化を開始")

    print(f"『{userinput}』をベクトル化中...")

    # feature-extractionタスクでベクトル化を実行
    embedding_vector = get_embedding(userinput)

    if embedding_vector:
        embeddings["user_input"] = embedding_vector
        print("-> 成功。")
    else:
        print("-> 失敗。")
    
    return embeddings