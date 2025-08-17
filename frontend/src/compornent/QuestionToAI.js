import React from 'react'
import { useState } from 'react'

const QuestionToAI = () => {
    const [userInput, setUserInput] = useState({
        'user_input': '',
    });
    const [aiOutput, setAiOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const controller = new AbortController();
    const signal = controller.signal;

    const sendingQuestion = async() => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/users/question', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userInput),
                signal,
            });
            if (!response.ok) throw new Error('AIが回答に失敗しました');
            setAiOutput(await response.json());
            setUserInput({'user_input': ''});
            console.log(aiOutput);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    }
    const stopRequest = () => {
        controller.abort();
        setIsLoading(false);
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
                <p className='tag'>AIからの回答</p>
                <hr/>
                <div className='ai-response'></div>
            </div>
        </>
    )
}

export default QuestionToAI