import numpy as np
import json
from pathlib import Path

def similarity_search(question):
    current_file_path = Path(__file__)
    current_dir = current_file_path.parent
    dataset_path = current_dir.parent.parent / 'datasets' / 'embeddings.jsonl'
    similarities = {}
    # ユーザーの質問のベクトルをNumpy配列にする
    question_vector = np.array(question['user_input'])
    
    # 内積を用いて類似度を求める
    with open(dataset_path, 'r', encoding='utf-8') as f:
        line = f.readline()
        doc_embeddings_dict = json.loads(line)
    for doc_key, vector_list in doc_embeddings_dict.items():
        # pythonのリストをNUmpy配列にする
        doc_vector = np.array(vector_list)
        # 類似度を計算する
        similarity = np.dot(question_vector, doc_vector)
        similarities[doc_key] = similarity

    sorted_docs = sorted(similarities.items(), key=lambda item: item[1], reverse=True)
    print("\n類似度が高い上位３つのドキュメント:")
    for doc_id, score in sorted_docs[:3]:
        print(f"{doc_id} (スコア: {score: .4f})")