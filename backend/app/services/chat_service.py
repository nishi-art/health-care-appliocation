import json
from . import vector_service, similarity_search_service, gemini_service
import google.generativeai as genai

# Geminiクライアント、ツール、システムインストラクションを初期化
gemini_service.configure_gemini()
gemini_tool = gemini_service.get_similarity_search_tool()
gemini_system_instruction = gemini_service.get_ai_settings()

model = genai.GenerativeModel(
    'gemini-2.5-flash',
    system_instruction=gemini_system_instruction
)

# ユーザーメッセージと会話履歴を受け取り、AIとの対話処理を行う
async def handle_conversation(user_message: str, history: list):
    # Geminiにリクエストを送信
    print(f"\n--- Geminiへの送信 (History: {len(history)}件) ---")

    formatted_user_message = {"role": "user", "parts": [{"text": user_message}]}

    response = await model.generate_content_async(
        contents=history + [formatted_user_message],
        tools=[gemini_tool]
    )
    # 応答を解析
    part = response.candidates[0].content.parts[0]

    if part.function_call:
        # AIがツール使用を要求
        function_call = part.function_call
        print(f"--- ツール実行: {function_call.name} (クエリ: {function_call.args['query']}) ---")

        if function_call.name == "similarity_search":
            search_query = function_call.args['query']
            query_vector_dict = vector_service.vectorization(search_query) 
            top_3_docs = similarity_search_service.similarity_search(query_vector_dict)
            # Geminiに送るためにJSON形式の文字列に変換
            tool_result_content = json.dumps(
                [{"doc_id": doc['doc_id'], "text": doc['text'], "source": doc.get('metadata', {}).get('source')} for doc in top_3_docs], 
                ensure_ascii=False
            )

            tool_call_part = {
                "role": "model",
                "parts": [{
                    "function_call": {
                        "name": function_call.name,
                        "args": dict(function_call.args)
                    }
                }]
            }

            # ツールを呼び出すまでの会話履歴をまとめる
            history_up_to_tool_call = history + [
                formatted_user_message,
                tool_call_part
            ]

            # ツールの実行結果を辞書で作成
            tool_result_part = {
                "role": "function",
                "parts": [{
                    "function_response": {
                        "name": function_call.name,
                        "response": {"content": tool_result_content}
                    }
                }]
            }

            # 会話履歴とツール結果を結合してGeminiに送信
            tool_response = await model.generate_content_async(
                contents=history_up_to_tool_call + [tool_result_part],
                tools=[gemini_tool],
            )
            final_answer = tool_response.text
            
            # 戻り値に、更新用の履歴も含める
            updated_history_parts = [
                formatted_user_message,
                tool_call_part,
                tool_result_part,
                {"role": "model", "parts": [{"text": final_answer}]} # 最終回答
            ]
            return final_answer, updated_history_parts

        else:
            raise ValueError("AIが不明なツールを呼び出そうとしました。")
    else:
        # AIがツールを使わずに直接回答
        final_answer = response.text
        updated_history_parts = [
            formatted_user_message,
            {"role": "model", "parts": [{"text": final_answer}]}
        ]
        return final_answer, updated_history_parts