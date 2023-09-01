import { dateArray } from "../components/calendar";
import axios from "axios"
import { Todo } from "../types";

async function getTasks() {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
      
      const dataWithDates = response.data.map((todo: Todo, index: number) => ({
        ...todo,
        date: dateArray[index],
      }));
  
      return dataWithDates;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }
  
export default getTasks;