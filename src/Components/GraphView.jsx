import { useState, useEffect } from "react";
import { Graph } from "@antv/g6";

export default function GraphView() {
  const [data2, setData] = useState([]);
  const [preview, setPreview] = useState({
    "outgoingLinks": [
      "http://nutty-cheddar24.cheesy6"
    ],
    "tokenList": [
      "artisanal",
      "cheese",
      "heaven",
      "brie",
      "cheddar",
      "swiss",
      "delight",
      "discover",
      "brie",
      "cheddar",
      "swiss",
      "cheese",
      "cheese",
      "lover",
      "paradise",
      "explore",
      "delicious",
      "brie",
      "cheddar",
      "swiss",
      "cheese",
      "tantalize",
      "taste",
      "bud",
      "elevate",
      "culinary",
      "creation",
      "creamy",
      "indulgence",
      "brie",
      "sharp",
      "tang",
      "cheddar",
      "nutty",
      "perfection",
      "swiss",
      "selection",
      "premium",
      "cheese",
      "delight",
      "discern",
      "palate",
      "craft",
      "gourmet",
      "cheese",
      "board",
      "melting",
      "savory",
      "grill",
      "cheese",
      "sandwich",
      "simply",
      "savor",
      "slice",
      "exceptional",
      "brie",
      "cheddar",
      "swiss",
      "cheese",
      "perfect",
      "choice",
      "occasion",
      "discover",
      "unparalleled",
      "quality",
      "flavor",
      "cheese",
      "elevate",
      "culinary",
      "experience"
    ],
    "title": "Artisanal Cheese Heaven: Brie, Cheddar, Swiss Delights",
    "completeContent": "Artisanal Cheese Heaven: Brie, Cheddar, Swiss Delights Discover the World of Brie, Cheddar, and Swiss Cheeses Welcome to our cheese lover's paradise! Explore a delicious world of brie, cheddar, and Swiss cheeses that will tantalize your taste buds and elevate your culinary creations. From the creamy indulgence of brie to the sharp tang of cheddar and the nutty perfection of Swiss, our selection of premium cheeses is sure to delight even the most discerning palate. Whether you're crafting a gourmet cheese board, melting a savory grilled cheese sandwich, or simply savoring a slice on its own, our exceptional brie, cheddar, and Swiss cheeses are the perfect choice for any occasion. Discover the unparalleled quality and flavor of our cheeses and elevate your culinary experience today.",
    "pageRank": 0.005107294392381597,
    "url": "http://brie24.cheesy6",
    "body": "Welcome to our cheese lover's paradise! Explore a delicious world of brie, cheddar, and Swiss cheeses that will tantalize your taste buds and elevate your culinary creations. From the creamy indulgence of brie to the sharp tang of cheddar and the nutty perfection of Swiss, our selection of premium cheeses is sure to delight even the most discerning palate. Whether you're crafting a gourmet cheese board, melting a savory grilled cheese sandwich, or simply savoring a slice on its own, our exceptional brie, cheddar, and Swiss cheeses are the perfect choice for any occasion. Discover the unparalleled quality and flavor of our cheeses and elevate your culinary experience today.",
    "header": "Discover the World of Brie, Cheddar, and Swiss Cheeses"
  });
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
  });
  const [type, setLayout] = useState("force");

  const handleMouseEnter = (e, content) => {
    const rect = e.target.getBoundingClientRect();
    let occurences = preview.tokenList.reduce(
      (a, v) => (v === content ? a + 1 : a),
      0
    );

    setTooltip({
      visible: true,
      content: `tf: ${(occurences / preview.tokenList.length).toFixed(5)}`,
      x: rect.left + rect.width / 2, // Horizontale Position
      y: rect.top - 30, // Vertikale Position oberhalb des Elements
    });
  };

  const handleMouseLeave = () => {
    console.log(preview);
    setTooltip({ visible: false, content: "", x: 0, y: 0 });
  };

  function tfScore(arr, token){
    let score = (arr.reduce(
      (a, v) => (v === token ? a + 1 : a),
      0
    ) / arr.length);
    if (score > 0.1) return "rgba(0, 255, 0, 0.3)";
    else if(score > 0.05) return "rgba(255, 255, 0, 0.3)";
    else return "rgba(255, 0, 0, 0.2)";
  }

  useEffect(() => {
    fetch("https://172.211.54.172:8443/search/all")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error("Fehler beim Abrufen der Daten:", error));
  }, []);

  useEffect(() => {
    if (data2.length === 0) return;
    // Erstelle den Graph erst, nachdem das DOM gerendert wurde
    const container = document.getElementById("container");
    if (!container) return;


    const nodes = data2.map((entry) => ({ id: entry.url, label: entry.url }));
    const edge = data2.flatMap((entry) =>
      entry.outgoingLinks.map((link) => ({
        source: entry.url,
        target: link,
        type: "line",
      }))
    );
    const data = {
      nodes: nodes,
      edges: edge,
    };

    const graph = new Graph({
      container: "container", // Referenz zum ID
      width: container.offsetWidth,
      height: container.offsetHeight || 1000, // Setze eine Höhe, falls sie nicht vorhanden ist
      data,
      layout: {
        type: type,
        preventOverlap: true, // Verhindert Überlappungen
        nodeSpacing: 100, // Abstand zwischen den Knoten
        linkDistance: 150, // Länge der Kanten
        edgeStrength: 0.8, // Verbindungsstärke
      },

      defaultNode: {
        size: type==="force" ? 50 : 200,
        style: {
          fill: "#6A6970",
          stroke: "#2b2a33",
          fillOpacity: 0.8,
        },
        labelCfg: {
          position: "bottom", // Position des Labels unter dem Knoten
          offset: 10, // Abstand des Labels vom Knoten
          style: {
            fill: "#ffffff", // Weiß für den Text
            fontSize: 14, // Schriftgröße
            fontFamily: "Arial, sans-serif", // Schriftart
          },
        },
      },
      defaultEdge: {
        style: {
          stroke: "#6A6970",
        },
      },

      modes: {
        default: ["drag-node", "zoom-canvas", "drag-canvas"],
      },
    });
    graph.data(data); // Daten setzen
    graph.render(); // Graph rendern
    type === "force" ? 
    (graph.zoom(0.2),  graph.moveTo(window.innerWidth / 5, window.innerHeight / 4) ): (graph.zoom(0.03),  graph.moveTo(window.innerWidth / 3, window.innerHeight / 3));

 

    graph.on("node:mouseenter", (e) => {
      const node = e.item;
      const model = node.getModel();
      const nodeId = model.id;
      node.update({
        style: {
          stroke: "#5f95ff",
          lineWidth: 5
        },
      });
      // Alle Kanten hervorheben, die mit diesem Knoten verbunden sind
      const edges = graph.getEdges();
      edges.forEach((edge) => {
        const edgeModel = edge.getModel();
        if (edgeModel.source === nodeId || edgeModel.target === nodeId) {
          edge.update({
            style:{
              lineWidth: 5,
              stroke: "#5f95ff",
            } 
          })
        }
      });
    });

    graph.on("node:mouseleave", (e) => {
      const edges = graph.getEdges();
      e.item.update({
        style: { stroke: "#2b2a33",
          lineWidth: 1,
         },
        
      });
      edges.forEach((edge) => {
        edge.update({
          style:{
            stroke: "#6A6970",
            lineWidth: 1,
          } 
        })
        
      });
    });


    graph.on("node:click", (e) => {
      const nodeId = e.item.getModel().id;
      setPreview(...data2.filter((object) => object.url == nodeId)); // Setze die Informationen des angeklickten Knotens
    });

    // Cleanup bei Komponentendemontage
    return () => {
      graph.destroy();
    };
  }, [data2, type]); 

  return (
    <div className="flex flex-col">
      <form className=" h-16 mt-16 w-full flex whitespace-nowrap justify-center items-center gap-2">
        <p>Layout:</p>
        <input id="force" type="radio" name="layout" className="" onChange={() => setLayout("force")} checked={type === "force"} ></input>
        <label htmlFor="force">Force</label>
        <input id="circular" type="radio" name="layout" className="" onChange={() => setLayout("circular")} checked={type === "circular"}></input>
        <label htmlFor="force">Circular</label>
      </form>

      <div className="flex flex-row">
        <div
          id="container"
          className="w-2/3 flex-shrink h-full  mt-2 rounded-2xl ml-5 shadow-2xl"
        ></div>
        {preview && (
          <div className="w-1/3 shadow-2xl mt-2 mx-5 rounded-2xl p-5 text-sm font-mono flex flex-col gap-5">
            <p>{preview.url && "Url: " + preview.url}</p>
            <p>{preview.pageRank && "Pagerank: " + preview.pageRank}</p>
            <div>
              Tokenlist: <br/><br/>
              {preview.tokenList &&
                preview.tokenList.map((e, index) => (
                 <>
                  <span
                    
                    >{` ${index + 1}:`}</span>
                  <span style={{backgroundColor: tfScore(preview.tokenList, e)}}
                    className="cursor-pointer hover:underline"
                    onMouseEnter={(event) => handleMouseEnter(event, e)}
                    onMouseLeave={handleMouseLeave}
                    >{`${e}`}</span>
                    </>
                ))}
            </div>
          </div>
        )}
        {tooltip.visible && (
          <div
            className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded-md z-50"
            style={{
              top: tooltip.y,
              left: tooltip.x,
              transform: "translateX(-50%)",
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    </div>
  );
}
