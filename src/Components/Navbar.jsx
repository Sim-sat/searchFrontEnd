export default function Navbar(props) {
  return (
    <nav className="fixed bg-[#2b2a33] w-full h-14 top-0 z-50 shadow-2xl">
      <div className="flex justify-center items-center gap-8 h-full">
        <button onClick={() => props.setSearchOrGraph("search")} className="">
          Search
        </button>
        <button onClick={() => props.setSearchOrGraph("graph")} className="">
          Graph
        </button>
      </div>
    </nav>
  );
}
