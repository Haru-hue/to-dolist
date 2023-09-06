import axios from 'axios';
import dayjs from 'dayjs';
import { dateArray } from '../components/calendar';
import { Todo } from '../types';

async function getTasks() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos');

    const dataWithDates: Todo[] = [];
    for (let i = 0; i < dateArray.length; i++) {
      const date = dateArray[i];

      const tasksForDate = response.data
        .slice(i * 10, (i + 1) * 10)
        .map((task: Todo) => {
          const startTime = dayjs().hour(Math.floor(Math.random() * 24)).minute(Math.floor(Math.random() * 60));
          const formattedStartTime = startTime.format('h:mma');

          if (Math.random() < 0.5) {
            const endTime = startTime.add(Math.floor(Math.random() * 4) + 1, 'hour');
            const formattedEndTime = endTime.format('h:mma');
            return {
              ...task,
              date: date.format('YYYY-MM-DD'),
              time: `${formattedStartTime} - ${formattedEndTime}`,
            };
          } else {
            return {
              ...task,
              date: date.format('YYYY-MM-DD'),
              time: formattedStartTime,
            };
          }
        });

      dataWithDates.push(...tasksForDate);
    }

    return dataWithDates;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
}

export default getTasks;