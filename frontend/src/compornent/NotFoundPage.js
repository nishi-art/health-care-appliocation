import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    return (
        <>
            <h2>404-NotFound</h2>
            <p>お探しのページは存在しないか、移動した可能性があります。</p>
            <Link to="/">トップページに戻る</Link>
        </>
    )
}

export default NotFoundPage