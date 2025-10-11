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
    ユーザーからの「質問」に対し、以下のルールに従って回答を生成してください。

    # 回答生成ルール

    1.  **【分析】** まず、「参考情報」を注意深く読み、ユーザーの「質問」に対する答えが**含まれているか、いないか**を判断します。

    2.  **【条件分岐】**
        * **答えが「参考情報」に含まれている場合**: ルールAに従って回答してください。
        * **答えが「参考情報」に含まれていない場合**: ルールBに従って回答してください。

    ---
    ### ### ルールA：参考情報に答えがある場合の指示
    - 回答は、必ず「参考情報」に含まれる事実**だけ**に基づいて作成してください。
    - あなた自身の知識や、インターネット上の情報は**一切使用しないでください**。
    - 情報を分かりやすく要約したり、構成を整理したりすることは許可しますが、元の情報の意味を変えたり、新しい情報を付け加えたりしてはいけません。

    ---
    ### ### ルールB：参考情報に答えがない場合の指示
    - あなた自身の専門知識を使って、ユーザーの質問に回答してください。
    - 回答の最後には、**必ず以下の免責事項**を改行して付け加えてください。

    # 免責事項
    **【ご注意】** この回答はAIに渡している情報に記載がなかったため、一般的な知識に基づいて生成されています。最新の情報や正確な情報は自身で調べてください。

    ## 参考情報
    {context}

    ## 質問
    {user_query}

    ## 回答
    """


    '''
    rag_prompt = f"""
    あなたはペットの健康に関する専門家アシスタントです。
    以下の「参考情報」を**最優先の事実として参考にし、あなた自身の知識も補いながら**ユーザーからの「質問」に総合的かつ分かりやすく回答してください。

    ## 参考情報
    {context}

    ## 質問
    {user_query}

    ## 回答
    """
    '''

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