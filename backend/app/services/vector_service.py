import json
import torch
from transformers import AutoTokenizer, AutoModel

def vectorization(userinput):
    model_name = "SAVSNET/PetBERT"

    # print(f"モデル『{model_name}』をダウンロード中...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)

    def get_embedding(text):
        encode_input = tokenizer(text, padding=True, truncation=True, return_tensors='pt')

        with torch.no_grad():
            model_output = model(**encode_input)
        
        
            
        '''
        token_vectors = model_output.last_hidden_state
        sentence_embedding = torch.mean(token_vectors[0], dim=0).tolist()
        '''


        sentence_embedding = model_output.last_hidden_state[0, 0, :].tolist()

        return sentence_embedding

    # ユーザーの質問をベクトル化して保存する辞書
    embeddings = {}

    # print("ベクトル化を開始")

    # print(f"『{userinput}』をベクトル化中...")

    # feature-extractionタスクでベクトル化を実行
    embedding_vector = get_embedding(userinput)

    if embedding_vector:
        embeddings["user_input"] = embedding_vector
        print("-> 成功。")
    else:
        print("-> 失敗。")
    
    return embeddings


'''
from google import genai
import json
import os
from dotenv import load_dotenv

def vectorization(userinput):
    API_KEY = os.getenv("GOOGLE_API_KEY")
    load_dotenv()
    client = genai.Client(api_key=API_KEY)
    embeddings = {}

    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=userinput,
    )

    if result:
        result_list = result.embeddings
        embedding_list = [{"vector": embedding.values} for embedding in result_list]
        embeddings["user_input"] = embedding_list[0]["vector"]
        print("-> 成功。")
    else:
        print("-> 失敗。")
    
    return embeddings
'''