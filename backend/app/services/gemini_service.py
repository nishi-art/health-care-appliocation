import google.generativeai as genai
import os
from dotenv import load_dotenv

def request_gemini(user_input, dataset):
    load_dotenv()
    API_KEY = os.getenv("GOOGLE_API_KEY")

    def print_text(text):
        text = text.replace('・', ' *')
        indented_text = ""
        for line in text.splitlines():
            indented_text += f"> {line}\n"
        print(indented_text)

    # ユーザーの質問
    user_query = user_input
    print("\n--- ユーザーの質問 ---")
    print(user_query)

    # 参考情報として使うテキストを準備
    context = ""
    for doc in dataset:
        source = doc.get('metadata', {}).get('source', '不明な情報源')
        context += f"doc_id: {doc['doc_id']}\n"
        context += f"source: {source}\n"
        context += f"text: {doc['text']}\n"
        context += "---\n"

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
    response_text = response.text
    # 結果の表示
    # print_text(f"\n--- Geminiからの回答 ---")
    # print_text(response_text)
    
    return response_text