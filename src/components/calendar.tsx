import dayjs from "dayjs";
import { dateContext } from "../context";

export const dateArray = Array.from({ length: 11 }, (_, index) =>
  dayjs().subtract(3 - index, "day")
);

function Calendar() {
  const context = dateContext();

  if (!context) {
    throw new Error("dateContext is undefined");
  }

  const { state, dispatch } = context;

  const currentDate = state.currentDate;

  const handleDateClick = (clickedDate: dayjs.Dayjs) => {
    dispatch({ type: "SET_DATE", payload: clickedDate });
  };

  return (
    <section>
      <div className="pb-4 text-[#101828] font-semibold">
        {currentDate.format("MMMM YYYY")}
      </div>
      <div className="date-boxes space-x-6 max-md:overflow-scroll max-2xl:overflow-hidden container-snap flex justify-between">
        {dateArray.map((date) => (
          <div
            key={date.format("YYYY-MM-DD")}
            className={`flex flex-col items-center px-5 py-3 rounded-lg cursor-pointer space-y-2 font-semibold 
            border border-solid border-gray-300
            ${
              date.isSame(currentDate, "day") ? "bg-[#3F5BF6] text-white" : ""
            }`}
            onClick={() => handleDateClick(date)}
          >
            <p>{date.format("ddd")}</p>
            <p>{date.format("D")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Calendar;
