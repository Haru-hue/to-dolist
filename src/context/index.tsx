import dayjs from "dayjs";
import {
  Dispatch,
  ReactNode,
  createContext,
  useReducer,
  useContext,
} from "react";
import { Todo } from "../types";

type Context = {
  currentDate: dayjs.Dayjs;
  tasks: Todo[];
  selectedTask: Todo | null;
  showAddTask: boolean;
  showEditTask: boolean;
  editedTask: Todo | null;
};

type Props = {
  children: ReactNode;
};

type Action =
  | { type: "SET_DATE"; payload: dayjs.Dayjs }
  | { type: "SELECT_TASK"; task: Todo }
  | { type: "DESELECT_TASK" }
  | { type: "SET_TASKS"; tasks: Todo[] }
  | { type: "ADD_TASK"; task: Todo }
  | { type: "EDIT_TASK"; task: Todo }
  | { type: "DELETE_TASK"; task: Todo }
  | { type: "TRIGGER_TASK"; payload: boolean }
  | { type: "TRIGGER_EDIT_TASK"; payload: boolean, task: Todo }
  | { type: "CANCEL_TASK" }

interface DayProps {
  state: Context;
  dispatch: Dispatch<Action>;
}

const initialValues: Context = {
  currentDate: dayjs(),
  tasks: [],
  selectedTask: null,
  showAddTask: false,
  showEditTask: false,
  editedTask: null,
};

const DateContext = createContext<DayProps | undefined>(undefined);

export function dateContext() {
  return useContext(DateContext);
}

const reducer = (state: Context, action: Action) => {
  let newState;
  
  switch (action.type) {
    case "SET_DATE":
      newState = { ...state, currentDate: action.payload };
      break;
    case "SELECT_TASK":
      newState = { ...state, selectedTask: action.task };
      break;
    case "DESELECT_TASK":
      newState = { ...state, selectedTask: null };
      break;
    case "SET_TASKS":
      newState = { ...state, tasks: action.tasks };
      break;
    case "ADD_TASK":
      newState = { ...state, tasks: [...state.tasks, action.task] };
      break;
    case "EDIT_TASK":
      newState = {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.task.id ? action.task : task
        ),
      };
      break;
    case "TRIGGER_TASK":
      newState = {
        ...state,
        showAddTask: action.payload,
      };
      break;
    case "TRIGGER_EDIT_TASK":
      newState = {
        ...state,
        showEditTask: action.payload,
        editedTask: action.task
      };
      break;
    case "CANCEL_TASK":
      newState = {
        ...state,
        showEditTask:false
      };
      break;
    case "DELETE_TASK":
      newState = {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.task.id),
      };
      break;
    default:
      newState = state;
      break;
  }

  // Save the updated tasks to localStorage
  saveTasks(newState.tasks);

  return newState;
};

export function DateProvider({ children }: Props) {
  
   // Load the saved tasks from localStorage
   const savedTasks = loadTasks();
  
   const [state, dispatch] = useReducer(reducer, {...initialValues, tasks:savedTasks});

   return (
     <DateContext.Provider value={{ state, dispatch }}>
       {children}
     </DateContext.Provider>
   );
}

// Save the tasks to localStorage
const saveTasks = (tasks :Todo[]) => {
   localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load the saved tasks from localStorage
const loadTasks = () :Todo[] => {
   const tasksJson = localStorage.getItem('tasks');
   return tasksJson ? JSON.parse(tasksJson) : [];
}
