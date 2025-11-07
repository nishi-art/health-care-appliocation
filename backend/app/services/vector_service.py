from google import genai
from google.api_core import exceptions as google_exceptions

def vectorization(userinput):
    embeddings = {}

    client = genai.Client()

    try:
        result = client.models.embed_content(
            model="gemini-embedding-001",
            contents=userinput,
        )
        embedding_vector = result.embeddings[0].values
        embeddings["user_input"] = embedding_vector
        print("-> 成功。")
    except google_exceptions.ResourceExhausted as e:
        print("--- ERROR: embedding-001 ---")
        raise e
    except Exception as e:
        print("-> 失敗。")
        raise e
    
    return embeddings