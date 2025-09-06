import numpy as np
import json
from pathlib import Path

def similarity_search(question):
    current_file_path = Path(__file__)
    current_dir = current_file_path.parent
    vector_dataset_path = current_dir.parent.parent / 'datasets' / 'vectorize_by_gemini.jsonl'
    original_dataset_path = current_dir.parent.parent / 'datasets' / 'japanese_data.jsonl'
    document = {}
    similarities = {}
    
    # ユーザーの質問のベクトルをNumpy配列にする
    question_vector = np.array(question['user_input'])

    # 質問のベクトルを正規化
    question_norm = np.linalg.norm(question_vector)
    if question_norm != 0:
        question_vector = question_vector / question_norm
    
    # 内積を用いて類似度を求める
    with open(vector_dataset_path, 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
            doc_id = data['doc_id']
            vector_list = data['vector']

            # pythonのリストをNUmpy配列にする
            doc_vector = np.array(vector_list)

            # データセットのベクトルを正規化
            doc_norm = np.linalg.norm(doc_vector)
            if doc_norm != 0:
                doc_vector = doc_vector / doc_norm

            # 類似度を計算する
            similarity = np.dot(question_vector, doc_vector)
            similarities[doc_id] = similarity

    # ベクトル化されていないドキュメントを保存
    with open(original_dataset_path, 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
            doc_id = data['doc_id']
            document[doc_id] = data

    sorted_vector_docs = sorted(similarities.items(), key=lambda item: item[1], reverse=True)
    sorted_docs = [
        {"doc_id": doc_id, "similarity": score}
        for doc_id, score in sorted_vector_docs
    ]
    top_3_docs = []
    # print("\n類似度が高い上位３つのドキュメント")
    for doc_data in sorted_docs[:3]:
        doc_id = doc_data['doc_id']
        print(doc_id)
        print(similarities[doc_id])
        top_3_docs.append(document[doc_id])
    return top_3_docs