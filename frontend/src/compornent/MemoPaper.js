import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function MemoPaper() {
    const navigate = useNavigate();
    const { year, month, day } = useParams();
    const [meal, setMeal] = useState('');
    const [exercise, setExercise] = useState('');
    const [hospital, setHospital] = useState('');
    const [other, setOther] = useState('');

    const fetchMemo = async() => {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/healthcare/get');
            if(!response.ok) throw new Error('データの取得に失敗しました。');
            const data = await response.json();
            setMeal(data.meal || '');
            setExercise(data.exercise || '');
            setHospital(data.hospital || '');
            setOther(data.other || '');
        } catch (error) {
            alert(error.message);
        }
    };
    const handleSave = async() => {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/healthcare/save', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    year, month, day,
                    meal, exercise, hospital, other,
                })
            });
            if (!response.ok) throw new Error('保存に失敗しました。');
        } catch (error) {
            alert(error.message);
        }

    }
    useEffect(() => {
        //fetchMemo();
    }, [year, month, day]);

    return (
        <>
            <p className='back-calender' onClick={() => navigate('/healthcare')}>カレンダーに戻る</p>
            <p className='current-date'>{year}年{month}月{day}日</p>
            <div className='memo-paper'>
                <div className='meal'>
                    <p>＜食事＞</p>
                    <textarea value={meal} onChange={(e) => setMeal(e.target.value)}></textarea>
                </div>
                <div className='exercise'>
                    <p>＜運動＞</p>
                    <textarea value={exercise} onChange={(e) => setExercise(e.target.value)}></textarea>
                </div>
                <div className='hospital'>
                    <p>＜病院＞</p>
                    <textarea value={hospital} onChange={(e) => setHospital(e.target.value)}></textarea>
                </div>
                <div className='other'>
                    <p>＜その他＞</p>
                    <textarea value={other} onChange={(e) => setOther(e.target.value)}></textarea>
                </div>
            </div>
        </>
    )
}

export default MemoPaper