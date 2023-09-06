import { useEffect, useState, useCallback } from "react";
import { Todo } from "../types";
import { Task } from "./task";
import { dateContext } from "../context";
import dayjs from "dayjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import ReactPaginate from "react-paginate";
import getTasks from "../hooks/getTasks";

function TodoList() {
  const context = dateContext();

  if (!context) {
    throw new Error("dateContext is undefined");
  }

  const { state, dispatch } = context;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortedTasks, setSortedTasks] = useState<Todo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    async function fetchTasks() {
      const tasks = await getTasks();
      dispatch({ type: "SET_TASKS", tasks });
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    fetchTasks();
  }, [dispatch]);

  const filteredTasks = useCallback(() => {
    const dayTasks = state.tasks
      .filter((task: Todo) => {
        const taskDate = dayjs(task.date);
        return taskDate.isSame(state.currentDate, "day");
      })
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    setSortedTasks(dayTasks);
  }, [state.tasks, state.currentDate])

  useEffect(() => {
    filteredTasks()
  }, [filteredTasks])

  useEffect(() => {
    setTodos(sortedTasks)
  }, [sortedTasks])

  // Get the current page of tasks
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = todos.slice(indexOfFirstTask, indexOfLastTask);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const pageCount = Math.ceil(todos.length / tasksPerPage)

  return (
    <div>
      <h1 className="font-bold text-lg py-5">My Tasks</h1>
      {currentTasks.map((todo) => (
        <Task
          id={todo.id}
          key={todo.id}
          title={todo.title}
          date={todo.date}
          time={todo.time}
          completed={todo.completed}
        />
      ))}
      {currentTasks.length === 0 && (
        <p className="flex justify-center">No Tasks planned for this day!</p>
      )}
      <div className="mt-6 border-t border-solid border-gray-300"></div>
      <ReactPaginate
          className="flex items-center pt-2 justify-between"
          pageCount={pageCount}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => paginate(selected + 1)}
          renderOnZeroPageCount={null}
          containerClassName="page-container"
          activeClassName="text-[#1D2939] bg-[#F9FAFB] px-6 py-4 rounded-full"
          pageClassName="text-[#475467] font-medium"
          previousLabel={
            <div className="flex space-x-2 items-center text-[#475467]">
              <Icon
              icon="mdi:arrow-left"
              className="text-3xl"
              color="#475467"
              fontSize={30}
            />
              <p className="font-bold">Previous</p>
            </div>
          }
          nextLabel={
            <div className="flex space-x-2 items-center text-[#475467]">
              <p className="font-bold">Next</p>

              <Icon
              icon="mdi:arrow-right"
              className="text-3xl"
              color="#475467"
              fontSize={30}
            />
            </div>
          }
        />
    </div>
  );
}

export default TodoList;
