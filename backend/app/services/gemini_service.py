import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

def request_gemini(user_input):
    load_dotenv()
    API_KEY = os.getenv("GOOGLE_API_KEY")

    def print_text(text):
        text = text.replace('・', ' *')
        indented_text = ""
        for line in text.splitlines():
            indented_text += f"> {line}\n"
        print(indented_text)

    def load_documents(filepath):
        print(f"{dataset_path}を読み込んでいます")
        document = []
        with open(dataset_path, 'r', encoding='utf-8') as f:
            for line in f:
                document.append(json.loads(line))
        print(f"{len(document)}件のドキュメントを読み込みました")
        return document
    
    # データセットの読み込み
    documents = load_documents(dataset_path)
    manual_selection = documents[:1]

    # ユーザーの質問
    user_query = user_input
    print("\n--- ユーザーの質問 ---")
    print(user_query)

    # 参考情報として使うテキストを準備
    context = ""
    for doc in manual_selection:
        context += f"(doc_id: {doc['doc_id']}): {doc['text']}\n"

    # プロンプトを構築
    rag_prompt = f"""
    あなたはペットの健康に関する専門家アシスタントです。
    以下の「参考情報」を**最優先の事実として参考にし、あなた自身の知識も補いながら**ユーザーからの「質問」に総合的かつ分かりやすく回答してください。

    ## 参考情報
    {context}

    ## 質問
    {user_query}

    ## 回答
    """
    # モデルにリクエスト
    print(f"\n--- 最終的な回答を生成中... ---")
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-2.5-pro')
    response = model.generate_content(rag_prompt)
    # 結果の表示
    print_text(f"\n--- Geminiからの回答 ---")
    print_text(response.text)
    return response.text

dataset_path = './datasets/dataset_2.jsonl'