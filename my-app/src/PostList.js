import React, { useState } from "react";

const PostList = ({ posts, onLike, onReply }) => {
    const [replyInputs, setReplyInputs] = useState({});
    const [likedPosts, setLikedPosts] = useState({}); // いいね済みの投稿を管理

    const handleLike = (index) => {
        // すでにいいねしている場合は何もせずに終了
        if (likedPosts[index]) return;

        onLike(index); // いいね処理
        setLikedPosts((prev) => ({ ...prev, [index]: true })); // 状態を更新
    };

    const handleReply = (index, replyContent) => {
        if (replyContent.trim()) {
            // ここを変更して、onReplyにユーザー情報を渡す！！ 
            onReply(index, { content: replyContent, author: { name: "ログインユーザーの名前", uid: "ログインユーザーのUID" } });
            setReplyInputs((prev) => ({ ...prev, [index]: "" })); // 入力内容をクリア
        }
    };

    const handleInputChange = (index, value) => {
        setReplyInputs((prev) => ({ ...prev, [index]: value }));
    };

    return (
        <div>
            <h2>投稿一覧</h2>
            {posts.map((post, index) => (
                <div key={index}>
                    <p><strong>投稿者:</strong> {post.author?.name || "不明なユーザー"}</p>
                    <p>{post.content}</p>
                    <p>いいね: {post.likes}</p>
                    <button onClick={() => handleLike(index)}>いいね</button>
                    <div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleReply(index, replyInputs[index] || "");
                            }}
                        >
                            <input
                                type="text"
                                placeholder="返信を入力"
                                value={replyInputs[index] || ""}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                            />
                            <button type="submit">返信</button>
                        </form>
                        <ul>
                            {post.replies.map((reply, i) => (
                                <li key={i}>
                                    <p><strong>返信者:</strong> {reply.author?.name || "不明なユーザー"}</p> 
                                    <p>{reply.content}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList;
