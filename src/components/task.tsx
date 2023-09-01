import { TaskProps } from "../types";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";

export const Task = ({ date, todos, setTodos }: TaskProps) => {
  const toggleCompletionStatus = (todoId: number) => {
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    console.log(todoIndex)
  };

  return (
    <div className="taskbox">
      {todos.map((todo) => (
        <div className="flex justify-between" key={todo.id}>
          <div className="flex items-center space-x-4">
            <div
              className="checkbox"
              onClick={() => toggleCompletionStatus(todo.id)}
            >
              {todo.completed && <Icon icon="carbon:checkmark" />}
            </div>
            <div className="flex flex-col">
              <p>{todo.title}</p>
            </div>
          </div>
          <div>
            <h2>{dayjs(date).format("dddd")}</h2>
            <p>{dayjs(date).format("MMMM D, YYYY")}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
