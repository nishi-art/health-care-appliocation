import React from 'react'
import { useState } from 'react'
import AiResponseField from './AiResponseField';

const QuestionToAI = () => {
    const [userInput, setUserInput] = useState({
        'user_input': '',
    });
    const [aiOutput, setAiOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [controller, setController] = useState(null);

    const sendingQuestion = async() => {
        const newController = new AbortController();
        setController(newController);
        setIsLoading(true);
        setAiOutput('');
        try {
            const response = await fetch('http://127.0.0.1:8000/users/question', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userInput),
                signal: newController.signal,
            });
            if (!response.ok) {
                if (response.status === 429) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || '現在別の処理を行っています。10秒ほど待って再度操作を行ってください。');
                }
                throw new Error('AIが回答に失敗しました');
            }
            setAiOutput(await response.json());
            setUserInput({'user_input': ''});
        } catch (error) {
            if (error.name === 'AbortError') {
                setAiOutput('')
            } else {
                alert(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }
    const stopRequest = () => {
        if (controller) controller.abort();
    }

    const handleChangeUserInput = (e) => {
        setUserInput({
            'user_input': e.target.value
        });
    }

    return (
        <>
            <div className='question-to-ai'>
                <div className='cautionary-note'>
                    <p>※</p>
                    <p className='text'>
                        このAIは様々な病気に関する情報を参照させているため、様々な病気に関することが回答に含まれることがあります。<br />
                        しかし重要なのはまず獣医師に相談することです。AIの回答は参考程度に考えてください。<br />
                        動物とは意思疎通が出来ません。些細な症状でも早急に獣医師に相談することが最重要です。
                    </p>
                </div>
                <div className='question-form'>
                    <textarea className='question-container' value={userInput.user_input} onChange={handleChangeUserInput}></textarea>
                    {isLoading ? 
                    (
                        <button className='send-button' onClick={stopRequest}> 
                            <span className='material-symbols-outlined'>autostop</span>            
                        </button>
                    ) : 
                    (
                        <button 
                        className='send-button' 
                        onClick={sendingQuestion}
                        disabled={isLoading || userInput.user_input.trim() === ''}
                        > 
                            <span className='material-symbols-outlined'>autoplay</span>            
                        </button>
                    )}
                </div>
                {isLoading ? 
                (
                    // <p className='tag loading-animation'>回答生成中...</p>
                    <div className='tag loading-animation'>
                        <span>回</span>
                        <span>答</span>
                        <span>生</span>
                        <span>成</span>
                        <span>中</span>
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                    </div>
                ) : 
                (
                    <p className='tag'>AIからの回答</p>
                )}
                <hr/>
                <AiResponseField aiOutput={aiOutput} />
            </div>
        </>
    )
}

export default QuestionToAI