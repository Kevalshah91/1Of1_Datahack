import React, { useState } from "react";

const SWOT = () => {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (letter) => {
    setExpanded(expanded === letter ? null : letter);
  };

  return (
    <div className="relative h-full w-full">
      <div
        className={`grid grid-cols-2 grid-rows-2 gap-4 transition-transform duration-300 ease-in-out
                   ${expanded ? "scale-50" : ""}`} // Scale down the grid
      >
        {["s", "w", "o", "t"].map((letter) => (
          <div
            key={letter}
            className={`relative rounded-lg p-6 cursor-pointer transition-all duration-300 overflow-hidden w-full h-full
                       ${expanded && expanded !== letter
              ? "opacity-0 pointer-events-none"
              : ""
            }
                       ${expanded === letter
              ? "absolute inset-0 z-20 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center"
              : ""
            }
                       ${letter === "s" ? "bg-sky-200" : ""}
                       ${letter === "w" ? "bg-amber-200" : ""}
                       ${letter === "o" ? "bg-green-200" : ""}
                       ${letter === "t" ? "bg-red-200" : ""}`}
            onClick={() => toggleExpand(letter)}
            style={{ minWidth: "45%" }}
          >
             <div className="text-2xl font-bold absolute bottom-4 right-4">
              {letter.toUpperCase()}
            </div>
            <div className="title">
              {letter === "s" && "Strengths"}
              {letter === "w" && "Weaknesses"}
              {letter === "o" && "Opportunities"}
              {letter === "t" && "Threats"}
            </div>

            {expanded === letter && (
              <div> {/* Removed fixed p-4 */}
                <ul>
                  <li>Item 1 for {letter.toUpperCase()}</li>
                  <li>Item 2 for {letter.toUpperCase()}</li>
                  <li>Item 3 for {letter.toUpperCase()}</li>
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SWOT;