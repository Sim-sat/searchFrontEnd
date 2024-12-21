import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function PageControl(props) {
  return (
    <div className="flex justify-center gap-3 mb-5 text-blue-400 min-h-16 ">
      <button
        onClick={() => props.page !== 1 && props.setPage(props.page - 1)}
        className={`hover:underline  `}
      >
        <MdKeyboardArrowLeft />
      </button>
      <button
        onClick={() => props.setPage(1)}
        className={`hover:underline ${props.page === 1 && "text-white"} `}
      >
        1
      </button>
      <button
        onClick={() => props.setPage(2)}
        className={`hover:underline ${props.page === 2 && "text-white"} `}
      >
        2
      </button>
      <button
        onClick={() => props.setPage(3)}
        className={`hover:underline ${props.page === 3 && "text-white"} `}
      >
        3
      </button>
      <button
        onClick={() => props.page !== 3 && props.setPage(props.page + 1)}
        className={`hover:underline  `}
      >
        <MdKeyboardArrowRight />
      </button>
    </div>
  );
}
