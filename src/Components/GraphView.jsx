import { useState, useEffect } from "react";
import { Graph } from '@antv/g6';

export default function GraphView() {
  const [data2, setData] = useState([]);
  const [test, setTest] = useState({});
  

  const [tooltip, setTooltip] = useState({ visible: false, content: "", x: 0, y: 0 });

  const handleMouseEnter = (e, content) => {
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      content: "tf: ",
      x: rect.left + rect.width / 2, // Horizontale Position
      y: rect.top - 30, // Vertikale Position oberhalb des Elements
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, content: "", x: 0, y: 0 });
  };

  useEffect(() => {
    fetch("http://localhost:8080/search/all")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error("Fehler beim Abrufen der Daten:", error));
  }, []);


  useEffect(() => {
    if(data2.length === 0) return;
    // Erstelle den Graph erst, nachdem das DOM gerendert wurde
    const container = document.getElementById("container");
    if (!container) return;
   

    const nodes = data2.map((entry) =>({id: entry.url, label: entry.url}));
    const edge = data2.flatMap((entry) => (entry.outgoingLinks.map((link) => 
                                      ({source: entry.url, target: link, type:"line"}))));
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
        type: "force",
        preventOverlap: true, // Verhindert Überlappungen
        nodeSpacing: 100, // Abstand zwischen den Knoten
        linkDistance: 150, // Länge der Kanten
        edgeStrength: 0.8, // Verbindungsstärke
      },
      
      defaultNode: {
        size: 50,
        style: {
          fill: "#6A6970",
          stroke: "#2b2a33",
          fillOpacity: 0.8, 
        },
        labelCfg: {
          position: "bottom", // Position des Labels unter dem Knoten
          offset: 10,         // Abstand des Labels vom Knoten
          style: {
            fill: "#ffffff",  // Weiß für den Text
            fontSize: 14,     // Schriftgröße
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
    graph.zoom(0.4);
    graph.moveTo(window.innerWidth / 4, window.innerHeight / 4); // Setzt die Startposition des Graphen
    
    graph.on("node:mouseenter", (e) => {
      const node = e.item;
      const model = node.getModel();
      const nodeId = model.id;
      node.update({
        style: {
          stroke: "#5f95ff"
        }
      })
      // Alle Kanten hervorheben, die mit diesem Knoten verbunden sind
      const edges = graph.getEdges();
      edges.forEach((edge) => {
        const edgeModel = edge.getModel();
        if (edgeModel.source === nodeId || edgeModel.target === nodeId) {
          edge.setState("highlight", true); // Kante hervorheben
        } 
      });
    });

    graph.on("node:mouseleave", (e) => {
      const edges = graph.getEdges();
      e.item.update({
        style:{ stroke:"#2b2a33" }
      })
      edges.forEach((edge) => {
        edge.setState("highlight", false);
      })
    })

    // CSS-Klasse für hervorgehobene Kanten
    graph.on("edge:statechange", (e) => {
      const { item, state } = e;
      if (state === "highlight") {
        item.getContainer().attr("class", state ? "highlighted " : "");
      }
    });

    graph.on("node:click", (e) => {
      const nodeId = e.item.getModel().id;
      setTest(...data2.filter((object) => object.url == nodeId)); // Setze die Informationen des angeklickten Knotens

    });


    // Cleanup bei Komponentendemontage
    return () => {
      graph.destroy();
    };
  }, [data2]); // Effekt nur einmal ausführen

  
  return (
    <div className="flex flex-row">

    <div
      id="container"
      className="w-2/3 flex-shrink h-full  mt-24 rounded-2xl ml-5 shadow-2xl"
      ></div>
        {test &&  <div className="w-1/3 shadow-2xl mt-24 mx-5 rounded-2xl p-5 text-sm font-mono flex flex-col gap-5">
        <p>
          {test.url && "Url: " + test.url}
          </p>
          <p>
          {test.pageRank && "Pagerank: " + test.pageRank}
          </p>
          <div >
            {test.tokenList && test.tokenList.map((e, index) => 
            <span className="cursor-pointer hover:underline"
            onMouseEnter={(e) => handleMouseEnter(e, `${index + 1}: ${e}`)}
            onMouseLeave={handleMouseLeave}
            >{`${index+1}:${e} `}</span>)}
          </div>
          
        
      </div>}
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
  );
}
