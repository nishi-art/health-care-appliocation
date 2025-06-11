import React from 'react'

const Menu = ({activeMenuCompornent, SetactiveMenuCompornent}) => {
    return (
        <>
            <ul className='menu'>
                <li onClick={() => SetactiveMenuCompornent('health-care')}>健康管理</li>
                <li onClick={() => SetactiveMenuCompornent('question-to-AI')}>AIへの質問</li>
            </ul>
        </>
    )
}

export default Menu