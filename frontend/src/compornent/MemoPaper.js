import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function MemoPaper() {
    const navigate = useNavigate();
    const { year, month, day } = useParams();

    return (
        <>
            <p className='back-calender' onClick={() => navigate('/healthcare')}>カレンダーに戻る</p>
            <p className='current-date'>{year}年{month}月{day}日</p>
            <div className='memo-paper'>
                <p>＜食事＞</p>
                <p>＜運動＞</p>
                <p>＜病院＞</p>
                <p>＜その他＞</p>
            </div>
        </>
    )
}

export default MemoPaper