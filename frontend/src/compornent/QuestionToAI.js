import React from 'react'
import { useState } from 'react'

const QuestionToAI = () => {
    const [userInput, setUserInput] = useState();
    const [aiOutput, setAiOutput] = useState();

    return (
        <>
            <div className='question-to-ai'>
                <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)}></textarea>
                <button>回答</button>
                <p>{aiOutput}a</p>
            </div>
        </>
    )
}

export default QuestionToAI