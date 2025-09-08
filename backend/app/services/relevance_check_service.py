import google.generativeai as genai
import os
from dotenv import load_dotenv

# AIの回答とAIに渡した外部データに関連性があるかのチェック
# 参考情報のソースを回答のテキストに含めるため
def relevance_check(ai_answer, top_3_docs):
    load_dotenv()
    API_KEY = os.getenv("GOOGLE_API_KEY")
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')
    used_sources = []

    for doc in top_3_docs:
        prompt = f"""
        以下の「回答」は、「参考情報」の内容を実質的に含んでいますか？
        YesかNoだけで答えてください

        ## 回答
        {ai_answer}


        ## 参考情報
        {doc['text']}
        """
        check_response = model.generate_content(prompt).text
        print(check_response)
        if "yes" in check_response.lower():
            used_sources.append(doc['metadata']['source'])
    
    final_answer = ai_answer

    if used_sources:
        # 重複を除いて回答に出典を追加
        used_source = list(set(used_sources))
        final_answer += f"\n\n**[参考情報: {', '.join(used_source)}]**"
    
    return final_answer