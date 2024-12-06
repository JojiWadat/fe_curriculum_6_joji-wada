import React, { useState } from "react";

const Post = ({ onSubmit }) => {
    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();  // イベントのバブリングを防止
        if (content.trim()) {
            onSubmit(content);
            setContent("");
        }
    };

    return (
        <div>
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="投稿内容を入力してください"
            />
            <button onClick={handleSubmit}>投稿</button>
        </div>
    );
};

export default Post;