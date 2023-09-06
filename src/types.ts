export interface Todo {
    userId?: number;
    id: any;
    title: string;
    completed: boolean;
    date: string;
    time?: string | null;
}

export interface TaskProps {
    date: string;
    title: string;
    completed: boolean;
}
  
export type Task = {
    id: string;
    title: string;
    completed: boolean;
    date: string;
    startTime: any;
    endTime: any;
    time?: string | null;
  };