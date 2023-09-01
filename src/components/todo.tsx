import { useEffect, useState } from 'react';
import { Todo } from '../types';
import { Task } from './task';
import getTasks from '../hooks/getTasks';

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const dataWithDates = await getTasks();
        setTodos(dataWithDates);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    fetchData();
  }, []);

  const uniqueDates = [...new Set(todos.map((todo) => todo.date))];

  return (
    <div className="App">
      <h1>Weekly To-Do List</h1>
      {uniqueDates.map((date, index) => (
        <Task
          key={index}
          date={date}
          todos={todos.filter((todo) => todo.date === date)}
          setTodos={setTodos}
        />
      ))}
    </div>
  );
}

export default TodoList

