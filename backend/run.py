import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",         # main.pyのFastAPIインスタンス'app'を指す
        host="127.0.0.1",   # ホスト
        port=8000,          # ポート
        reload=True,        # コード変更時にリロード
        timeout_keep_alive=60  # タイムアウトを60秒に設定
    )