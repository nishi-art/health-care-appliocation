import React from 'react'
import { useState } from 'react'

const QuestionToAI = () => {
    const [userInput, setUserInput] = useState({
        'user_input': '',
    });
    const [aiOutput, setAiOutput] = useState();

    const sendingQuestion = async() => {
        const response = await fetch('http://127.0.0.1:8000/users/question', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userInput),
        })
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
                    <button className='send-button' onClick={sendingQuestion}>
                        <span className='material-symbols-outlined'>autoplay</span>
                    </button>
                </div>
                <p className='tag'>AIからの回答</p>
                <hr/>
                <div className='ai-response'></div>
            </div>
        </>
    )
}

export default QuestionToAI