import React, { useEffect, useState } from 'react';
import './styles.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

    // ログイン状態を監視
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
            setLoginUser(user); // ログイン状態を更新
        });
        return () => unsubscribe(); // コンポーネントがアンマウントされた際に監視を解除
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!name || !age) {
      setError('Name and age are required.');
      return;
    }

    if (age < 20 || age > 80) {
      setError('Age must be between 20 and 80.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age: parseInt(age) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }

      setName('');
      setAge('');
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Failed to add user');
    }
  };

  return (
      <div className="container">
        <h2>User List</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        <div className="user-list">
          {users.map((user) => (
              <div key={user.id} className="user-item">
                {user.name} - {user.age} years old
              </div>
          ))}
        </div>
      </div>
  );
};

export default App;
