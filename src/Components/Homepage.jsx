import { useEffect, useState } from "react";

export default function Homepage(props) {
  const [isMoved, setIsMoved] = useState(false);

  useEffect(() => {
    if (!props.home) {
      handleButtonClick();
    }
  }, [props.algo]);

  const handleButtonClick = () => {
    setIsMoved(true);
    props.setHome(false);
    props.executeQuery();
  };

  const handleRadioChange = (algo) => {
    props.setAlgo(algo);
  };

  return (
    <div
      className={`flex flex-col justify-center items-center w-full gap-5 ${
        isMoved ? "h-min" : "h-full"
      }`}
    >
      <div
        className={`h-5/6 w-2/3 max-w-[46rem] flex justify-center flex-col items-center gap-5 transition-transform duration-1000 relative `}
      >
        <input
          onChange={props.queryChange}
          className="h-14 w-full rounded-md pl-5"
          type="text"
          placeholder="Search the Intranet"
          onKeyDown={(e) => e.key === "Enter" && handleButtonClick()}
        />
        <form className="flex flex-row gap-5 whitespace-nowrap">
          <p>Search algorithm:</p>
          <input
            id="tf-idf"
            checked={props.algo === "tfidf"}
            type="radio"
            name="searchType"
            onChange={() => handleRadioChange("tfidf")}
          ></input>
          <label htmlFor="tf-idf">tf-idf</label>
          <input
            id="pagerank + cosine similarity"
            type="radio"
            checked={props.algo === "cosine"}
            name="searchType"
            onChange={() => handleRadioChange("cosine")}
          ></input>
          <label htmlFor="pagerank + cosine similarity">
            cosine similarity
          </label>
          <input
            id="pagerank"
            checked={props.algo === "pagerank"}
            type="radio"
            name="searchType"
            onChange={() => handleRadioChange("pagerank")}
          ></input>
          <label htmlFor="pagerank">pagerank</label>
        </form>
        {props.home && (
          <button
            onClick={handleButtonClick}
            className="border border-slate-600 rounded-md p-2"
          >
            Search
          </button>
        )}
      </div>
    </div>
  );
}
