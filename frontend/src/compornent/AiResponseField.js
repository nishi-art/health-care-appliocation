import React from 'react';
import { marked } from 'marked';

const AiResponseField = ({aiOutput}) => {
    // MarkdownテキストをHTMLに変換
    const htmlContent = marked.parse(aiOutput);

    return (
        <div 
        className='ai-response'
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

export default AiResponseField