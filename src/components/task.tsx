import { Todo } from "../types";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { dateContext } from "../context";

export const Task = (props: Todo) => {
  const context = dateContext();

  if (!context) {
    throw new Error("dateContext is undefined");
  }

  const { state, dispatch } = context;

  const [checked, setChecked] = useState(props.completed);
  const [isHovered, setIsHovered] = useState(false);

  const taskDate = dayjs(props.date);
  const currentDate = dayjs();

  let dateDisplay: string;

  if (taskDate.isSame(currentDate, "day")) {
    dateDisplay = "Today";
  } else if (taskDate.isSame(currentDate.subtract(1, "day"), "day")) {
    dateDisplay = "Yesterday";
  } else if (taskDate.isSame(currentDate.add(1, "day"), "day")) {
    dateDisplay = "Tomorrow";
  } else {
    dateDisplay = taskDate.format("MMM D, YYYY");
  }

  const handleCheckboxClick = () => {
    setChecked(!checked);
  };

  const handleClick = () => {
    dispatch({ type: "SELECT_TASK", task: props });
  };

  useEffect(() => {
    setIsHovered(props.id === state.selectedTask?.id)
  }, [state.selectedTask?.id])

  return (
    <div
      className={`taskbox hover:bg-[#EAEDFE] ${
        isHovered ? "bg-[#EAEDFE]" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex justify-between" key={props.id}>
        <div className="flex items-center space-x-4">
          <div
            className={`checkbox ${
              checked ? "border-2 border-[#3F5BF6] border-solid" : ""
            }`}
            onClick={handleCheckboxClick}
          >
            {checked && (
              <Icon icon="carbon:checkmark" color="#3F5BF6" fontWeight={600} />
            )}
          </div>
          <div className="flex flex-col">
            <p
              className={`${
                checked
                  ? "text-gray-500 line-through"
                  : "text-[#101828] font-medium"
              }`}
            >
              {props.title}
            </p>
            <p
              className={`${
                checked ? "text-gray-500 line-through" : "text-[#101828]"
              }`}
            >
              {props.time}
            </p>
          </div>
        </div>
        <div>
          <p>{dateDisplay}</p>
        </div>
      </div>
    </div>
  );
};
