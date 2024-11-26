import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { fireAuth } from "./firebase.ts"; // Firebaseインスタンスをインポート

const App = () => {
    const [loginUser, setLoginUser] = useState(null); // ログイン状態を管理
    const googleProvider = new GoogleAuthProvider(); // Google認証プロバイダー

    // ログイン状態を監視
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
            setLoginUser(user); // ログイン状態を更新
        });
        return () => unsubscribe(); // コンポーネントがアンマウントされた際に監視を解除
    }, []);

    /**
     * Googleでログイン
     */
    const signInWithGoogle = () => {
        signInWithPopup(fireAuth, googleProvider)
            .then((result) => {
                alert("Googleログイン成功: " + result.user.displayName);
            })
            .catch((err) => {
                alert("Googleログイン失敗: " + err.message);
            });
    };

    /**
     * ログアウト
     */
    const handleSignOut = () => {
        signOut(fireAuth)
            .then(() => {
                alert("ログアウトしました");
            })
            .catch((err) => {
                alert("ログアウト失敗: " + err.message);
            });
    };

    /**
     * メール・パスワード認証用のフォーム
     */
    const LoginForm = () => {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        const handleLogin = () => {
            fireAuth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert("ログイン成功: " + userCredential.user.email);
                })
                .catch((err) => {
                    alert("ログイン失敗: " + err.message);
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
            </div>
        );
    };

    return (
        <div>
            <h1>Firebase 認証 (Google & メール)</h1>

            {/* ログイン状態に応じてコンテンツを切り替え */}
            {loginUser ? (
                <div>
                    <p>ようこそ、{loginUser.email || loginUser.displayName}さん！</p>
                    <button onClick={handleSignOut}>ログアウト</button>
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

export default App;
