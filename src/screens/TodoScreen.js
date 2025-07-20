import React, { useEffect, useState } from 'react';

export default function TodoScreen() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    window.electronAPI?.getTodos().then(setTodos);
  }, []);

  const add = async () => {
    if (!text.trim()) return;
    const id = await window?.electronAPI?.addTodo(text.trim());
    setTodos(prev => [{ id, text, done: 0 }, ...prev]);
    setText('');
  };

  const toggle = async id => {
    await window.electronAPI.toggleTodo(id);
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, done: t.done ? 0 : 1 } : t))
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>SQLite-backed Todos</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="New todo…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button onClick={add} style={{ marginLeft: 8 }}>Add</button>
      </div>

      <ul>
        {todos.map(t => (
          <li
            key={t.id}
            onClick={() => toggle(t.id)}
            style={{
              cursor: 'pointer',
              textDecoration: t.done ? 'line-through' : 'none',
            }}
          >
            {t.text}
          </li>
        ))}
      </ul>
    </div>
  );
}