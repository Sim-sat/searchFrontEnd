
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
export default function Homepage(props){


    const [isMoved, setIsMoved] = useState(false);

    const handleButtonClick = () => {
      setIsMoved(true);
      props.setHome(false);
      props.executeQuery();
    };
  
    return (
      <div className={`flex flex-col justify-center items-center w-full gap-5 ${isMoved ? "h-min" : "h-full"}`}>
        <div
        className={`h-5/6 w-2/3 max-w-[46rem] flex justify-center flex-col items-center gap-5 transition-transform duration-1000 relative `}
        >
          <input
            onChange={props.queryChange}
            className="h-14 w-full rounded-md pl-5"
            type="text"
            placeholder="Search the Intranet"
            onKeyDown={e => e.key === 'Enter' && handleButtonClick()}
          />
           {props.home && <button
            onClick={handleButtonClick}
            className="border border-slate-600 rounded-md p-2"
          >
            Search
          </button>}
        </div>
     
      </div>
    );
  };
