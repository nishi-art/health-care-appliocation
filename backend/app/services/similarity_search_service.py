import numpy as np
import json
from pathlib import Path

def similarity_search(question):
    current_file_path = Path(__file__)
    current_dir = current_file_path.parent
    dataset_path = current_dir.parent.parent / 'datasets' / 'embeddings.jsonl'
    document = {}
    similarities = {}
    
    # ユーザーの質問のベクトルをNumpy配列にする
    question_vector = np.array(question['user_input'])

    # 質問のベクトルを正規化
    question_norm = np.linalg.norm(question_vector)
    if question_norm != 0:
        question_vector = question_vector / question_norm
    
    # 内積を用いて類似度を求める
    with open(dataset_path, 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
            doc_id = data['doc_id']
            vector_list = data['vector']

            # データセットをpython辞書で保存しておく
            document[doc_id] = data

            # pythonのリストをNUmpy配列にする
            doc_vector = np.array(vector_list)

            # データセットのベクトルを正規化
            doc_norm = np.linalg.norm(doc_vector)
            if doc_norm != 0:
                doc_vector = doc_vector / doc_norm

            # 類似度を計算する
            similarity = np.dot(question_vector, doc_vector)
            similarities[doc_id] = similarity

    sorted_docs = sorted(similarities.items(), key=lambda item: item[1], reverse=True)
    top_3_docs = []
    print("\n類似度が高い上位３つのドキュメント")
    for doc_id, score in sorted_docs[:3]:
        print(doc_id)
        top_3_docs.append(document[doc_id])
        print(top_3_docs)
    return top_3_docs