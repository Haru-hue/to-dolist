import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useRef, useEffect, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import Calendar from "react-calendar";
import Select, { components, ValueContainerProps } from "react-select";
import { dateContext } from "../context";
import { Task, Todo } from "../types";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { nanoid } from "nanoid";
import { formatTime } from "../hooks/formatTime";

function useOutsideClick(ref: any, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

type Options = {
  value: string;
  label: string;
};

const options: Options[] = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "Pick a date", label: "Pick a date" },
];

const ValueContainer = (props: ValueContainerProps<Options, false>) => {
  return (
    <components.ValueContainer {...props}>
      <div className="flex items-center space-x-2">
        <Icon icon="iconoir:calendar" fontSize={25} />
        {props.children}
      </div>
    </components.ValueContainer>
  );
};

export const AddTask = ({ text }: { text?: string }) => {
  const context = dateContext();

  if (!context) {
    throw new Error("dateContext is undefined");
  }

  const { state, dispatch } = context;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("today");
  const [task, setTask] = useState<Task>({
    id: nanoid(),
    title: "",
    completed: false,
    date: state.currentDate.format("YYYY-MM-DD"),
    startTime: null,
    endTime: null,
  });
  const [reminder, setReminder] = useState(true)

  const calendarRef = useRef(null);

  const currentDate = state.currentDate;

  useOutsideClick(calendarRef, () => setShowDatePicker(false));

  const handleDateChange = (event: any) => {
    const value = event.target.value;
    setSelectedDate(value);
    if (value === "Pick a date") {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }

    if (value === "today") {
      const currentDate = state.currentDate.format("YYYY-MM-DD");
      setTask((prevTask) => ({ ...prevTask, date: currentDate }));
    } else if (value === "tomorrow") {
      const currentDate = state.currentDate.add(1, "day").format("YYYY-MM-DD");
      setTask((prevTask) => ({ ...prevTask, date: currentDate }));
    }
  };

  const handleCalendarChange = (value: any) => {
    const date = dayjs(value).format("YYYY-MM-DD");
    setTask((prevTask) => ({ ...prevTask, date: date }));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTask((prevTask) => ({ ...prevTask, title: value }));
  };

  const handleTimeChange = (
    property: "startTime" | "endTime",
    value: Dayjs | null
  ) => {
    setTask((prevTask) => ({
      ...prevTask,
      [property]: value?.format("hh:mmA"),
    }));
  };

  const isTaskComplete = useMemo(() => {
    return task.title !== "" && task.startTime !== null;
  }, [task]);

  const handleAddTask = () => {
    task.time =
      task.endTime === null
        ? task.startTime
        : `${task.startTime} - ${task.endTime}`;
    dispatch({ type: "ADD_TASK", task: task });
    dispatch({ type: "TRIGGER_TASK", payload: false });
  };

  const handleCancel = () => {
    dispatch({ type: "TRIGGER_TASK", payload: false });
  };

  return (
    <div className="max-md:overlay">
      <div className="borderbox taskup">
        <div className="flex justify-between items-center">
          <p className="text-[#101828] text-lg font-bold">Add Task</p>
          <Icon
            icon="fa6-solid:xmark"
            color="#667085"
            className="cursor-pointer"
            onClick={handleCancel}
            fontSize={25}
          />
        </div>
        <textarea
          className="borderbox textbox"
          onChange={handleTitleChange}
          value={task.title || text}
        />
        <div className="flex justify-between">
          <Select
            value={options.find((option) => option.value === selectedDate)}
            onChange={handleDateChange}
            options={options}
            components={{ ValueContainer }}
            styles={{
              indicatorSeparator: () => ({}),
              dropdownIndicator: () => ({}),
              indicatorsContainer: (base) => ({
                ...base,
                display: "none",
              }),
              singleValue: (base) => ({
                ...base,
                fontWeight: 600,
                color: "#667085",
                fontSize: 14,
              }),
              control: (base) => ({
                ...base,
                boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                borderRadius: "8px",
                border: "1px solid #D0D5DD",
                cursor: "pointer",
                minHeight: "100%",
              }),
            }}
          />
          <div className="flex space-x-2 justify-end">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                defaultValue={dayjs().set("hour", 10).set("minute", 30)}
                onChange={(value) => handleTimeChange("startTime", value)}
                sx={{
                  width: "40%",
                  cursor: "pointer",
                  "& input": {
                    color: "#667085",
                    fontWeight: 500,
                    fontFamily: "'Work Sans', sans-serif",
                    padding: "12.5px 7px",
                  },
                  "& .MuiInputBase-root": {
                    flexDirection: "row-reverse",
                    paddingRight: "0",
                    boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                    borderRadius: "8px",
                    border: "1px solid #D0D5DD",
                  },
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                defaultValue={dayjs().set("hour", 11).set("minute", 30)}
                onChange={(value) => handleTimeChange("endTime", value)}
                minTime={dayjs(task.startTime, "h:mm a")}
                sx={{
                  width: "40%",
                  cursor: "pointer",
                  "& input": {
                    color: "#667085",
                    fontWeight: 500,
                    fontFamily: "'Work Sans', sans-serif",
                    padding: "12.5px 7px",
                  },
                  "& .MuiInputBase-root": {
                    flexDirection: "row-reverse",
                    paddingRight: "0",
                    boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                    borderRadius: "8px",
                    border: "1px solid #D0D5DD",
                  },
                }}
                slotProps={{
                  textField: {
                    error: false,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        {reminder && (<div className="flex justify-between">
          <div className="flex space-x-2 items-center">
            <Icon icon="mdi:bell" color="#667085" fontSize={20} />
            <p className="text-[#667085]">10 Minutes before</p>
          </div>
          <Icon
            icon="fa6-solid:xmark"
            color="#667085"
            fontSize={20}
            onClick={() => setReminder(false)}
            className="cursor-pointer"
          />
        </div>)}
        {showDatePicker && (
          <div ref={calendarRef}>
            <Calendar
              onChange={handleCalendarChange}
              defaultValue={currentDate.toDate()}
              className="react-calendar"
              prevLabel={<Icon icon="majesticons:chevron-left" fontSize={25} />}
              prev2Label={null}
              nextLabel={
                <Icon icon="majesticons:chevron-right" fontSize={25} />
              }
              next2Label={null}
            />
          </div>
        )}
        <div className="flex justify-center space-x-4 md:px-4">
          <button
            className="borderbox rounded-lg py-2 px-16 2xl:px-20 font-bold text-[#344054] hover:border-[#344054]"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-[#3F5BF6] hover:bg-[#0E31F2] font-bold rounded-lg py-2 px-16 2xl:px-20 text-white disabled:cursor-not-allowed"
            disabled={!isTaskComplete}
            onClick={handleAddTask}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export const ShowTask = (props: Todo) => {
  dayjs.extend(advancedFormat);
  const date = dayjs(props.date).format("Do MMMM, YYYY");

  const context = dateContext();

  if (!context) {
    throw new Error("dateContext is undefined");
  }

  const { dispatch } = context;

  const handleDelete = () => {
    dispatch({ type: "DELETE_TASK", task: props });
    dispatch({ type: "DESELECT_TASK" });
  };

  const handleEdit = () => {
    dispatch({ type: "TRIGGER_EDIT_TASK", payload: true, task: props });
    dispatch({ type: "DESELECT_TASK" });
  };

  const handleCancel = () => {
    dispatch({ type: "DESELECT_TASK" });
  };

  return (
    <div className="max-md:overlay">
      <div className="popup">
        <div className="flex flex-col">
          <Icon
            icon="fa6-solid:xmark"
            className="self-end mb-4 cursor-pointer"
            fontSize={25}
            onClick={handleCancel}
          />
          <div className="flex flex-col space-y-4">
            <h1 className="text-lg font-bold w-3/4">{props.title}</h1>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 font-medium">
                <Icon icon="iconoir:calendar" color="#3F5BF6" />
                <p>{date}</p>
              </div>
              <div className="flex space-x-2 items-center font-medium">
                <Icon icon="iconoir:calendar" color="#3F5BF6" />
                <p>{props.time}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-4 space-x-4">
            <button
              className="borderbox rounded-lg py-2 px-16 font-bold text-[#344054] hover:border-[#344054]"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="bg-[#3F5BF6] hover:bg-[#0E31F2] font-bold rounded-lg py-2 px-16 text-white"
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditTask = (props: Todo) => {
  const context = dateContext();

  if (!context) {
    throw new Error("dateContext is undefined");
  }

  const { dispatch } = context;

  const [startTime, endTime] = props.time?.split(" - ") || ["", ""];
  const [reminder, setReminder] = useState(true)

  const [task, setTask] = useState<Task>({
    id: props.id,
    title: props.title,
    completed: props.completed,
    date: props.date,
    startTime: startTime,
    endTime: endTime || null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>("today");
  const calendarRef = useRef(null);

  useOutsideClick(calendarRef, () => setShowDatePicker(false));

  const handleDateChange = (event: any) => {
    const value = event.value;
    setSelectedDate(value);
    if (value === "Pick a date") {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleCalendarChange = (value: any) => {
    const date = dayjs(value).format("YYYY-MM-DD");
    setTask((prevTask) => ({ ...prevTask, date: date }));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTask((prevTask) => ({ ...prevTask, title: value }));
  };

  const handleTimeChange = (
    property: "startTime" | "endTime",
    value: Dayjs | null
  ) => {
    setTask((prevTask) => ({
      ...prevTask,
      [property]: value?.format("hh:mmA"),
    }));
  };

  const handleCancel = () => {
    dispatch({ type: "CANCEL_TASK" });
  };

  const handleEditTask = () => {
    task.time =
      task.endTime === null
        ? task.startTime
        : `${task.startTime} - ${task.endTime}`;
    dispatch({ type: "EDIT_TASK", task: task });
    dispatch({ type: "CANCEL_TASK" });
  };


  const start = formatTime(task.startTime)
  const end = task.endTime === null ? start.add(1, 'hour') : formatTime(task.endTime)

  return (
    <div className="max-md:overlay">
      <div className="borderbox taskup">
        <div className="flex justify-between items-center">
          <p className="text-[#101828] text-xl font-bold">Edit Task</p>
          <Icon
            icon="fa6-solid:xmark"
            color="#667085"
            fontSize={25}
            onClick={handleCancel}
            className="cursor-pointer"
          />
        </div>
        <textarea
          className="borderbox textbox"
          onChange={handleTitleChange}
          value={task.title}
        />
        <div className="flex justify-between">
          <Select
            value={options.find((option) => option.value === selectedDate)}
            onChange={handleDateChange}
            options={options}
            components={{ ValueContainer }}
            styles={{
              indicatorSeparator: () => ({}),
              dropdownIndicator: () => ({}),
              indicatorsContainer: (base) => ({
                ...base,
                display: "none",
              }),
              singleValue: (base) => ({
                ...base,
                fontWeight: 600,
                color: "#667085",
                fontSize: 14,
              }),
              control: (base) => ({
                ...base,
                boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                borderRadius: "8px",
                border: "1px solid #D0D5DD",
                cursor: "pointer",
                minHeight: "100%",
              }),
            }}
          />
          <div className="flex space-x-2 justify-end">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={start}
                onChange={(value) => handleTimeChange("startTime", value)}
                sx={{
                  width: "40%",
                  cursor: "pointer",
                  "& input": {
                    color: "#667085",
                    fontWeight: 500,
                    fontFamily: "'Work Sans', sans-serif",
                    padding: "12.5px 7px",
                  },
                  "& .MuiInputBase-root": {
                    flexDirection: "row-reverse",
                    paddingRight: "0",
                    boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                    borderRadius: "8px",
                    border: "1px solid #D0D5DD",
                  },
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={end}
                onChange={(value) => handleTimeChange("endTime", value)}
                minTime={dayjs(task.startTime, "h:mm a")}
                sx={{
                  width: "40%",
                  cursor: "pointer",
                  "& input": {
                    color: "#667085",
                    fontWeight: 500,
                    fontFamily: "'Work Sans', sans-serif",
                    padding: "12.5px 7px",
                  },
                  "& .MuiInputBase-root": {
                    flexDirection: "row-reverse",
                    paddingRight: "0",
                    boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                    borderRadius: "8px",
                    border: "1px solid #D0D5DD",
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        {reminder && (<div className="flex justify-between">
          <div className="flex space-x-2 items-center">
            <Icon icon="mdi:bell" color="#667085" fontSize={20} />
            <p className="text-[#667085]">10 Minutes before</p>
          </div>
          <Icon
            icon="fa6-solid:xmark"
            color="#667085"
            fontSize={20}
            onClick={() => setReminder(false)}
            className="cursor-pointer"
          />
        </div>)}
        {showDatePicker && (
          <div ref={calendarRef}>
            <Calendar
              onChange={handleCalendarChange}
              defaultValue={new Date(task.date)}
              className="react-calendar"
              prevLabel={<Icon icon="majesticons:chevron-left" fontSize={25} />}
              prev2Label={null}
              nextLabel={
                <Icon icon="majesticons:chevron-right" fontSize={25} />
              }
              next2Label={null}
            />
          </div>
        )}
        <div className="flex justify-center pt-4 space-x-4">
          <button
            className="borderbox rounded-lg py-2 px-16 font-bold text-[#344054] hover:border-[#344054]"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-[#3F5BF6] hover:bg-[#0E31F2] font-bold rounded-lg py-2 px-16 text-white"
            onClick={handleEditTask}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export const DateCalendar = () => {
  const context = dateContext();

  if (!context) {
    throw new Error("dateContext is undefined");
  }

  const { state } = context;

  function hasTasks(date: Date): boolean {
    const tasks = state.tasks.filter((task) => {
      const taskDate = dayjs(task.date);
      return taskDate.isSame(date, "day");
    });
    return tasks.length > 0 && !state.currentDate.isSame(dayjs(date), "day");
  }

  function renderTileContent({ date }: { date: Date }): JSX.Element | null {
    if (hasTasks(date)) {
      return (
        <div className="flex self-center top-0 right-0 w-2 h-2 rounded-full bg-blue-500"></div>
      );
    }
    return null;
  }

  function getTileClassName({ date }: { date: Date }): string | null {
    if (!dayjs(date).isSame(state.currentDate, "month")) {
      return "text-gray-400";
    }
    return null;
  }

  return (
    <div className="max-md:hidden">
      <div className="calendar-container">
        <Calendar
          value={state.currentDate.toDate()}
          defaultValue={state.currentDate.toDate()}
          className="react-calendar borderbox p-6 rounded-lg shadow-md"
          prevLabel={<Icon icon="majesticons:chevron-left" fontSize={25} />}
          prev2Label={null}
          nextLabel={<Icon icon="majesticons:chevron-right" fontSize={25} />}
          next2Label={null}
          tileContent={renderTileContent}
          tileClassName={getTileClassName}
        />
      </div>
    </div>
  );
};

export const Taskbar = () => {
  const [text, setText] = useState("");
  const context = dateContext();

  if (!context) {
    throw new Error("dateContext is undefined");
  }

  const { state, dispatch } = context;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setText(value);
  };

  const handleClick = () => {
    if (state.selectedTask) {
      dispatch({ type: "SELECT_TASK", task: state.selectedTask });
    }
    dispatch({ type: "TRIGGER_TASK", payload: true });
  };

  return (
    <section className="w-full">
      <div className="relative lg:hidden max-md:pt-4">
        <input
          type="text"
          placeholder="Input task"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-12"
          onChange={handleChange}
          value={state.selectedTask !== null ? state.selectedTask.title : text}
        />
        <span className="absolute top-[60%] transform -translate-y-1/2 right-4">
          <Icon
            icon={
              text !== "" || state.selectedTask !== null
                ? "ic:round-send"
                : "typcn:microphone"
            }
            color="#3F5BF6"
            fontSize={25}
            onClick={handleClick}
            className="cursor-pointer"
          />
        </span>
      </div>
      <div className="max-md:modal">
        {!state.showAddTask &&
          state.selectedTask === null &&
          !state.showEditTask && <DateCalendar />}
        {state.showAddTask && <AddTask text={text} />}
        {state.selectedTask !== null && !state.showAddTask && (
          <ShowTask {...state.selectedTask} />
        )}
        {state.showEditTask && state.editedTask?.id && (
          <EditTask {...state.editedTask} />
        )}
      </div>
    </section>
  );
};
