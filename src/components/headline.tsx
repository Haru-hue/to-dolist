import { Icon } from "@iconify/react/dist/iconify.js";
import { dateContext } from "../context";

function Headline() {
  const context = dateContext();

  if (!context) {
    throw new Error("dateContext is undefined");
  }

  const { dispatch } = context;

  const handleClick = () => {
    dispatch({ type: "TRIGGER_TASK", payload: true })
  }

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting = '';

  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  return (
    <div className="flex items-center justify-between py-8">
      <div className="flex flex-col">
        <h1 className="text-[#101828] text-3xl font-bold">{greeting}!</h1>
        <p className="text-[#475467]">You got some task to do.</p>
      </div>
      <button className="hidden lg:flex items-center text-lg bg-[#3F5BF6] hover:bg-[#0E31F2] text-white space-x-4 p-3 rounded-lg"
        onClick={handleClick}
      >
        <Icon icon="ic:round-plus" fontSize={30} />
        Create a new task
      </button>
    </div>
  );
}

export default Headline;

  
  
  
  
  