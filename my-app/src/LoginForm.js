import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { fireAuth } from "./firebase.ts"; // Firebaseのauthインスタンスをインポート

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isNewUser, setIsNewUser] = useState(false); // 新規ユーザー作成かどうかを判定

    // メールとパスワードを使ってログイン
    const signIn = ()=> {
        signInWithEmailAndPassword(fireAuth, email, password)
            .then((res) => {
                const user = res.user;
                alert("ログイン成功: " + user.email);
            })
            .catch((err) => {
                alert("ログイン失敗: " + err.message);
            });
    };

    // 新規ユーザー作成
    const createAccount = ()=> {
        createUserWithEmailAndPassword(fireAuth, email, password)
            .then((res) => {
                const user = res.user;
                alert("新規アカウント作成: " + user.email);
            })
            .catch((err) => {
                alert("アカウント作成失敗: " + err.message);
            });
    };

    // ログアウト
    const signOutWithEmail = ()=> {
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
            <h2>{isNewUser ? "新規アカウント作成" : "ログイン"}</h2>

            <div>
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {isNewUser ? (
                <div>
                    <button onClick={createAccount}>新規アカウント作成</button>
                    <p>
                        すでにアカウントをお持ちですか？{" "}
                        <button onClick={() => setIsNewUser(false)}>ログイン</button>
                    </p>
                </div>
            ) : (
                <div>
                    <button onClick={signIn}>ログイン</button>
                    <p>
                        アカウントをお持ちでないですか？{" "}
                        <button onClick={() => setIsNewUser(true)}>新規登録</button>
                    </p>
                </div>
            )}

            <button onClick={signOutWithEmail}>ログアウト</button>
        </div>
    );
};
