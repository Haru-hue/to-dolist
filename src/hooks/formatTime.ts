import dayjs, { Dayjs } from "dayjs";

export const formatTime = (time: string): Dayjs => {
    const parts = time.match(/(\d+):(\d+)([ap]m)/i);
    if (parts && parts.length === 4) {
      let hour = parseInt(parts[1]);
      const minute = parts[2];
      const meridiem = parts[3].toLowerCase();
  
      if (meridiem === 'pm' && hour < 12) {
        hour += 12;
      }
  
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minute} ${meridiem.toUpperCase()}`;
      return dayjs(formattedTime, "HH:mm A");
    }
  
    return dayjs(time, "h:mm a");
};
