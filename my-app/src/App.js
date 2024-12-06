import React, { useState, useEffect } from "react";
import { 
    onAuthStateChanged, 
    signOut, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "firebase/auth";
import { fireAuth } from "./firebase.ts"; // Firebaseインスタンスをインポート
import Post from "./Post.js";
import PostList from "./PostList.js";

const App = () => {
    const [loginUser, setLoginUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const googleProvider = new GoogleAuthProvider();

    const addPost = (content) => {
        setPosts((prevPosts) => [...prevPosts, { 
            content, 
            likes: 0, 
            replies: [], 
            likedBy: [],
            author: {
                uid: loginUser.uid,
                name: loginUser.email || loginUser.displayName}}]);
    };

    const addLike = (index) => {
        if (!loginUser) return;

        const userId = loginUser.uid;
        setPosts((prevPosts) => {
            const updatedPosts = [...prevPosts];
            const post = updatedPosts[index];
            if (!post.likedBy) post.likedBy = [];
            if (post.likedBy.includes(userId)) return prevPosts;

            post.likes += 1;
            post.likedBy.push(userId);
            return updatedPosts;
        });
    };

    const addReply = (index, replyContent) => {
        setPosts((prevPosts) => {
            const updatedPosts = [...prevPosts];
            updatedPosts[index].replies.push(replyContent);
            return updatedPosts;
            
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
            setLoginUser(user);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = () => {
        signInWithPopup(fireAuth, googleProvider)
            .then((result) => {
                alert("Googleログイン成功: " + result.user.displayName);
            })
            .catch((err) => {
                alert("Googleログイン失敗: " + err.message);
            });
    };

    const handleSignOut = () => {
        signOut(fireAuth)
            .then(() => {
                alert("ログアウトしました");
            })
            .catch((err) => {
                alert("ログアウト失敗: " + err.message);
            });
    };

    const LoginForm = () => {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        const handleLogin = () => {
            signInWithEmailAndPassword(fireAuth, email, password)
                .then((userCredential) => {
                    alert("ログイン成功: " + userCredential.user.email);
                })
                .catch((err) => {
                    alert("ログイン失敗: " + err.message);
                });
        };

        const handleSignUp = () => {
            createUserWithEmailAndPassword(fireAuth, email, password)
                .then((userCredential) => {
                    alert("サインアップ成功: " + userCredential.user.email);
                })
                .catch((err) => {
                    alert("サインアップ失敗: " + err.message);
                });
        };

        return (
            <div>
                <h2>メール・パスワード認証</h2>
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>ログイン</button>
                <button onClick={handleSignUp}>サインアップ</button>
            </div>
        );
    };

    return (
        <div>
            <h1>Firebase 認証 (Google & メール)</h1>
            {loginUser ? (
                <div>
                    <p>ようこそ、{loginUser.email || loginUser.displayName}さん！</p>
                    <button onClick={handleSignOut}>ログアウト</button>
                    <Post onSubmit={addPost} />
                    <PostList 
                        posts={posts} 
                        onLike={addLike} 
                        onReply={(index, reply) => {
                            addReply(index, {
                                ...reply,
                                author: {
                                    name: loginUser.displayName || loginUser.email,
                                    uid: loginUser.uid,
                                },
                            });
                        }} 
                        loginUser={loginUser} // ログインユーザーを渡す
                    />
                    
                </div>
            ) : (
                <div>
                    <LoginForm />
                    <div>
                        <h2>または</h2>
                        <button onClick={signInWithGoogle}>Googleでログイン</button>
                    </div>
                </div>
            )}
        </div>
    );
};
//投稿者情報の追加
export default App;
