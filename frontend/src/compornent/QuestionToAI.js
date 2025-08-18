import React from 'react'
import { useState } from 'react'

const QuestionToAI = () => {
    const [userInput, setUserInput] = useState({
        'user_input': '',
    });
    const [aiOutput, setAiOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tagText, setTagText] = useState('AIからの回答');
    const [controller, setController] = useState(null);

    const sendingQuestion = async() => {
        const newController = new AbortController();
        setController(newController);
        setIsLoading(true);
        setTagText('回答生成中...');
        setAiOutput('');
        try {
            const response = await fetch('http://127.0.0.1:8000/users/question', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userInput),
                signal: newController.signal,
            });
            if (!response.ok) throw new Error('AIが回答に失敗しました');
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
            setTagText('AIからの回答');
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
                <div className='question-form'>
                    <textarea className='question-container' value={userInput.user_input} onChange={handleChangeUserInput}></textarea>
                    {isLoading ? 
                    (
                        <button className='send-button' onClick={stopRequest}> 
                            <span className='material-symbols-outlined'>autostop</span>            
                        </button>
                    ) : 
                    (
                        <button className='send-button' onClick={sendingQuestion}> 
                            <span className='material-symbols-outlined'>autoplay</span>            
                        </button>
                    )}
                </div>
                <p className='tag'>{tagText}</p>
                <hr/>
                <div className='ai-response'>{aiOutput}</div>
            </div>
        </>
    )
}

export default QuestionToAI