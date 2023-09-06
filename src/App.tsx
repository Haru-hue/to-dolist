import "./App.css";
import Calendar from "./components/calendar";
import Header from "./components/header";
import Headline from "./components/headline";
import { Taskbar } from "./components/taskbar";
import TodoList from "./components/todo";
import { DateProvider } from "./context";

function App() {
  return (
    <DateProvider>
      <Header/>
      <div className="p-4 lg:p-12 flex flex-col md:overflow-hidden">
        <Headline />
        <div className="flex max-md:flex-col lg:space-x-4">
          <div className="flex flex-col lg:w-3/5 2xl:w-7/10">
            <Calendar />
            <TodoList />
          </div>
          <div className="h-screen max-xl:hidden">
            <div className="border-l h-full border-gray-200" />
          </div>
          <div className="flex w-full lg:w-2/5 xl:w-3/10">
            <Taskbar />
          </div>
        </div>
      </div>
    </DateProvider>
  );
}

export default App;
