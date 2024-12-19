import { useState, useEffect } from "react";
import G6 from "@antv/g6";

export default function GraphView() {
  const [data2, setData] = useState([]);

  useEffect(() => {
    // Erstelle den Graph erst, nachdem das DOM gerendert wurde
    const container = document.getElementById("container");
    if (!container) return;

    const data = {
      nodes: [
        { id: "node1", label: "Node 1" },
        { id: "node2", label: "Node 2" },
        { id: "node3", label: "Node 3" },
        { id: "node4", label: "Node 4" },
        { id: "node5", label: "Node 5" },
        { id: "node6", label: "Node 6" },
        { id: "node7", label: "Node 7" },
        { id: "node8", label: "Node 8" },
 
      ],
      edges: [
        { source: "node1", target: "node2" },
        { source: "node2", target: "node3" },
        { source: "node3", target: "node4" },
      ],
    };

    const graph = new G6.Graph({
      container: "container", // Referenz zum ID
      width: container.offsetWidth,
      height: container.offsetHeight || 500, // Setze eine Höhe, falls sie nicht vorhanden ist
      layout: {
        type: "force",
      },
      defaultNode: {
        size: 30,
        style: {
          fill: "#6ea0f0",
          stroke: "#5b8ff9",
        },
      },
      defaultEdge: {
        style: {
          stroke: "#e2e2e2",
        },
      },
      modes: {
        default: ["drag-node", "zoom-canvas", "drag-canvas"],
      },
    });

    graph.data(data); // Daten setzen
    graph.render(); // Graph rendern

    // Cleanup bei Komponentendemontage
    return () => {
      graph.destroy();
    };
  }, []); // Effekt nur einmal ausführen

  useEffect(() => {
    fetch("http://localhost:8080/search/all")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error("Fehler beim Abrufen der Daten:", error));
  }, []);

  return (
    <div
      id="container"
      style={{
        width: "100%",
        height: "500px",
        border: "1px solid #ccc",
        marginTop: "20px",
      }}
    ></div>
  );
}
