import { useEffect, useState } from "react";
import "./App.css";
import Homepage from "./Components/Homepage";
import parse from "html-react-parser";
import { IoMdClose } from "react-icons/io";
import PageControl from "./Components/PageControl";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Navbar from "./Components/Navbar";
import GraphView from "./Components/GraphView"


function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [home, setHome] = useState(true);
  const [website, setWebsite] = useState({});
  const [page, setPage] = useState(1);
  const [searchOrGraph, setSearchOrGraph] = useState("search");
  const [algo, setAlgo] = useState("pagerank");
  const [resultsFound, setResultsFound] = useState(false);

  function handleQueryChange(e) {
    setQuery(e.target.value);
  }
  function showWebsite(website) {
    setWebsite(website);
  }

  function executeQuery() {
    setHome(false);
    
    fetch(`https://172.211.54.172:8443/search/query/?word=${query}&algorithm=${algo}`)
      .then((response) => response.json())
      .then((json) => {
        
        json.length === 0 ?( 
        setResultsFound(false),
        setData([<div>No results found... Try 'fromage'</div>])):(
        setResultsFound(true),
        setData(
          json.map((item) => (
            <div className=" h-32  font-normal truncate text-wrap ">
              <p className="text-sm flex gap-4 items-center">
                {item.url}
                <span className="relativ group ml-2">
                  <IoMdInformationCircleOutline className="cursor-pointer h-5 w-5" />
                  <span className="absolute  transform translate-x-10 -translate-y-full mb-2 hidden group-hover:block border text-xs rounded px-2 py-1 shadow-lg">
                    Pagerank: {item.pageRank}
                  </span>
                </span>
              </p>
              <h3
                onClick={() =>
                  showWebsite({
                    body: item.body,
                    header: item.header,
                    links: item.outgoingLinks,
                  })
                }
                className="text-2xl text-blue-400 hover:underline cursor-pointer "
              >
                {item.title.length > 73
                  ? item.title.substring(0, 73)
                  : item.title}
              </h3>
              <div className="text-base  ">
                {item.completeContent.substring(item.title.length)}
              </div>
            </div>
          ))
        ));
      })
      .catch((error) => console.error(error));
  }

  return (
    <>
      <Navbar setSearchOrGraph={setSearchOrGraph}/>
      {searchOrGraph === "search" && (
        <div className="flex mt-20">
          <div
            className={`h-screen flex-col justify-start gap-10  content-center pr-2 flex ${
              home ? "w-full" : "w-1/2"
            }`}
          >
            <Homepage
              queryChange={handleQueryChange}
              executeQuery={executeQuery}
              home={home}
              setHome={setHome}
              setAlgo={(input) => setAlgo(input)}
              algo={algo}
            ></Homepage>

            <div className="ml-10 flex-col flex gap-5 ">
              {page === 1 && data.slice(0, 10)}
              {page === 2 && data.slice(10, 20)}
              {page === 3 && data.slice(20, 30)}
            </div>
            {!home && resultsFound && <PageControl page={page} setPage={setPage} />}
          </div>

          {Object.keys(website).length !== 0 && (
            <div className="w-5/12 shadow-2xl p-5 m-10 flex-col flex gap-5">
              <button
                onClick={() => showWebsite({})}
                className="self-end border rounded-md p-2"
              >
                <IoMdClose className="h-4 w-4" />
              </button>
              <h1 className="font-bold text-2xl">{website.header}</h1>
              <p>{website.body}</p>
              <div>
                {website.links.map((entry) => (
                  <p>{entry}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      ) }
        <div style={{
          visibility: searchOrGraph === "search" ? "hidden" : "visible",
  
        }} 
              className="h-full visible relative">
          <GraphView></GraphView>
        </div>
      
    </>
  );
}

export default App;
