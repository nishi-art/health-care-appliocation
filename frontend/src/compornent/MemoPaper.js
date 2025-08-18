import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function MemoPaper() {
    const navigate = useNavigate();
    const { year, month, day } = useParams();
    const [meal, setMeal] = useState('');
    const [exercise, setExercise] = useState('');
    const [hospital, setHospital] = useState('');
    const [other, setOther] = useState('');
    const [weight, setWeight] = useState('');
    const token = localStorage.getItem('token');
    const isComposing = useRef(false);

    const fetchMemo = async() => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/healthcare/get?year=${year}&month=${month}&day=${day}`, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            if(!response.ok) throw new Error('データの取得に失敗しました。');
            const data = await response.json();
            setMeal(data.meal || '');
            setExercise(data.exercise || '');
            setHospital(data.hospital || '');
            setOther(data.other || '');
            setWeight(data.weight || '');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSave = async() => {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/healthcare/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    year: Number(year),
                    month: Number(month), 
                    day: Number(day),
                    meal, exercise, hospital, other, weight,
                }),
            });
            if (!response.ok) throw new Error('保存に失敗しました。');
        } catch (error) {
            alert(error.message);
        }

    }

    // 入力された全角数字を半角数字にする関数
    const toHalfWidthNumber = (value) => {
        /* /.../は正規表現
           今回は全角０～９までの数字のすべてを指定
         */
        let formatteValue = value.replace(/[０-９．]/g, (s) => {
                /* 0xFEE0は10進数にすると65248であり
                これはUnicdeでの全角文字と半角文字の差である
                つまりs.charCodeAtで文字をUnicodeの番号に変換し
                全角文字と半角文字の差を引き半角文字のUnicodeにして
                String.fromCharCodeでUnicodeの番号を文字に戻す */
                if (s === '．') return '.'; 
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
            });
        formatteValue = formatteValue.replace(/[^0-9.]/g, '');
        return formatteValue
    };
    const handleChangeWeightText = (e) => {
        if (isComposing.current) {
            setWeight(e.target.value);
        } else {
            const value = toHalfWidthNumber(e.target.value);
            setWeight(value);
        }
    };
    const handleConversionStart = () => {
        isComposing.current = true;
    };
    const handleConversionEnd = (e) => {
        isComposing.current = false;
        handleChangeWeightText(e);
    };

    useEffect(() => {
        fetchMemo();
    }, [year, month, day]);

    return (
        <>
            <p className='back-calender' onClick={() => navigate('/calender')}>カレンダーに戻る</p>
            <p className='current-date'>{year}年{month}月{day}日</p>
            <div className='memo-paper'>
                <div>
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
                <div className='weight'>
                    <p>＜体重＞（半角数字）</p>
                    <textarea 
                    value={weight} 
                    onChange={handleChangeWeightText}
                    onCompositionStart={handleConversionStart}
                    onCompositionEnd={handleConversionEnd}
                    ></textarea><span> kg</span>
                </div>
            </div>
            <div className='save-btn'>
                <button onClick={handleSave}>保存</button>
            </div>
        </>
    )
}

export default MemoPaper