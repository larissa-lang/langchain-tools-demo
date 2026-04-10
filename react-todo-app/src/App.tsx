import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  editing?: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
    };
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, editing: true } : todo
      )
    );
  };

  const saveEdit = (id: string, newText: string) => {
    if (newText.trim() === '') return;
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: newText.trim(), editing: false } : todo
      )
    );
  };

  const cancelEdit = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, editing: false } : todo
      )
    );
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <div className="app">
      <div className="header">
        <h1>✨ TodoList</h1>
        <p>Organize your tasks with style</p>
      </div>

      <div className="input-section">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button onClick={addTodo} className="add-btn">
          ➕ Add
        </button>
      </div>

      <div className="stats">
        <span className="count">
          {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left
        </span>
        <div className="filter-buttons">
          <button 
            onClick={() => setFilter('all')} 
            className={filter === 'all' ? 'active' : ''}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')} 
            className={filter === 'active' ? 'active' : ''}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('completed')} 
            className={filter === 'completed' ? 'active' : ''}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>No todos found. Add one above!</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.editing ? 'editing' : ''}`}
            >
              {todo.editing ? (
                <div className="edit-form">
                  <input
                    type="text"
                    defaultValue={todo.text}
                    autoFocus
                    onBlur={(e) => saveEdit(todo.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEdit(todo.id, e.currentTarget.value);
                      } else if (e.key === 'Escape') {
                        cancelEdit(todo.id);
                      }
                    }}
                    className="edit-input"
                  />
                  <div className="edit-actions">
                    <button 
                      onClick={() => saveEdit(todo.id, (e.target as HTMLInputElement).value)}
                      className="save-btn"
                    >
                      ✅ Save
                    </button>
                    <button 
                      onClick={() => cancelEdit(todo.id)}
                      className="cancel-btn"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    <span className="todo-text">{todo.text}</span>
                  </div>
                  <div className="todo-actions">
                    <button 
                      onClick={() => startEditing(todo.id)}
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {todos.length > 0 && (
        <div className="footer">
          <span className="summary">
            {activeCount} active, {completedCount} completed
          </span>
          <button onClick={clearCompleted} className="clear-btn">
            🧹 Clear Completed
          </button>
        </div>
      )}

      <style>{`
        .app {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Segoe UI', system-ui, sans-serif;
          background: linear-gradient(135deg, #4b6584, #6a5acd);
          min-height: 100vh;
          color: #fff;
        }

        .header h1 {
          margin: 0;
          font-size: 2.5rem;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .header p {
          text-align: center;
          opacity: 0.9;
          margin-top: 0.5rem;
        }

        .input-section {
          display: flex;
          gap: 0.5rem;
          margin: 1.5rem 0;
        }

        .todo-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }

        .todo-input:focus {
          outline: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .add-btn {
          padding: 0.75rem 1.25rem;
          background: #ff6b6b;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .add-btn:hover {
          background: #ff5252;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 1rem 0;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .count {
          font-weight: bold;
          font-size: 1.1rem;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .filter-buttons button {
          padding: 0.4rem 0.8rem;
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-buttons button.active {
          background: rgba(255,255,255,0.3);
          font-weight: bold;
        }

        .filter-buttons button:hover:not(.active) {
          background: rgba(255,255,255,0.25);
        }

        .todo-list {
          margin: 1.5rem 0;
        }

        .todo-item {
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          animation: fadeIn 0.4s ease-out;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .todo-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
          background: rgba(255,255,255,0.15);
        }

        .todo-item.completed {
          opacity: 0.7;
        }

        .todo-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .todo-checkbox {
          width: 1.4rem;
          height: 1.4rem;
          cursor: pointer;
        }

        .todo-text {
          font-size: 1.1rem;
        }

        .todo-item.completed .todo-text {
          text-decoration: line-through;
          opacity: 0.8;
        }

        .todo-actions {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn, .delete-btn {
          padding: 0.4rem 0.6rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .edit-btn {
          background: rgba(255,255,255,0.15);
        }

        .edit-btn:hover {
          background: rgba(255,255,255,0.25);
        }

        .delete-btn {
          background: rgba(255,107,107,0.2);
        }

        .delete-btn:hover {
          background: rgba(255,107,107,0.3);
        }

        .edit-form {
          width: 100%;
        }

        .edit-input {
          width: 100%;
          padding: 0.5rem;
          border-radius: 6px;
          border: none;
          font-size: 1rem;
        }

        .edit-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .save-btn, .cancel-btn {
          padding: 0.4rem 0.6rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .save-btn {
          background: #4caf50;
        }

        .cancel-btn {
          background: #f44336;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.2);
        }

        .summary {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .clear-btn {
          padding: 0.4rem 0.8rem;
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          background: rgba(255,255,255,0.25);
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          opacity: 0.7;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(10px);
          }
        }

        /* Animation for deletion */
        .todo-item.removing {
          animation: fadeOut 0.3s ease-in forwards;
        }

        /* Responsive design */
        @media (max-width: 600px) {
          .app {
            padding: 1rem;
          }
          .header h1 {
            font-size: 2rem;
          }
          .input-section {
            flex-direction: column;
          }
          .stats {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

export default App;