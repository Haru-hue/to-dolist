import { Dispatch, SetStateAction } from "react";

export interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
    date: string;
}

export interface TaskProps {
    date: string;
    todos: Todo[];
    setTodos: Dispatch<SetStateAction<Todo[]>>
}
  