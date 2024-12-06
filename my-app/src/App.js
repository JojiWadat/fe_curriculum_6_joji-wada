import React, { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm"; // LoginFormコンポーネントをインポート
import { onAuthStateChanged, signOut } from "firebase/auth"; // signOutをインポート
import { fireAuth } from "./firebase.ts"; // Firebaseのauthインスタンスをインポート

const App = () => {
    const [loginUser, setLoginUser] = useState(null); // ログイン状態を管理

    // ログイン状態を監視
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
            setLoginUser(user); // ログイン状態を更新
        });

        return () => unsubscribe(); // コンポーネントがアンマウントされた際に監視を解除
    }, []);

    // ログアウト処理（signOutWithEmail関数は削除し、signOutをそのまま使用）
    const handleSignOut = () => {
        signOut(fireAuth)
            .then(() => {
                alert("ログアウトしました");
            })
            .catch((err) => {
                alert("ログアウト失敗: " + err.message);
            });
    };

    return (
        <div>
            <h1>Firebase メール・パスワード認証</h1>

            {/* ログイン状態に応じてコンテンツを切り替え */}
            {loginUser ? (
                <div>
                    <p>ようこそ、{loginUser.email}さん！</p>
                    {/* ログイン後に表示したいコンテンツ */}
                    <button onClick={handleSignOut}>ログアウト</button>
                </div>
            ) : (
                <LoginForm />
            )}
        </div>
    );
};

export default App;
