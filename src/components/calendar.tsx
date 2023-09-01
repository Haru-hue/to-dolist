import dayjs from 'dayjs';

export const dateArray = Array.from({ length: 7 }, (_, index) =>
    dayjs().subtract(3 - index, 'day')
);

function Calendar() {
  const currentDate = dayjs();

  return (
    <div className="date-boxes flex">
      {dateArray.map((date) => (
        <div
          key={date.format('YYYY-MM-DD')}
          className={`flex flex-col items-center p-2 ${
            date.isSame(currentDate, 'day') ? 'bg-blue-500 text-white' : ''
          }`}
        >
          <p>{date.format('dddd')}</p>
          <p>{date.format('D')}</p>
        </div>
      ))}
    </div>
  );
}

export default Calendar;
