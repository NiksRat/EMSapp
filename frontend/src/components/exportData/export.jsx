import React, { useState, useRef, useEffect } from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const ExportCSV = ({ reportData, fileName }) => {
  const [limit, setLimit] = useState(5);
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Function to get the current timestamp in the desired format
  const getFormattedTimestamp = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  };

  const handleExport = () => {
    const dataToExport = Array.isArray(reportData)
      ? reportData.slice(0, limit === "Все" ? reportData.length : limit)
      : Object.values(reportData).flat().slice(0, limit === "Все" ? Object.values(reportData).flat().length : limit);

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    // Append the current timestamp to the filename
    const timestamp = getFormattedTimestamp();
    const fullFileName = `${fileName}_${timestamp}.xlsx`;

    FileSaver.saveAs(data, fullFileName);
  };

  const handleSelectLimit = (count) => {
    setLimit(count);
    setIsVisible(false); // close the dropdown menu
  };

  // Close the dropdown menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative" }} ref={dropdownRef}>
        <button
          onClick={() => setIsVisible(!isVisible)}
          style={{ padding: "8px 12px", background: "#6c757d", color: "#fff", border: "none", borderRadius: 4 }}
        >
          Export Limit: {limit === "Все" ? "All" : limit}
        </button>

        {isVisible && (
          <div
            style={{
              position: "absolute",
              top: "110%",
              right: 0,
              background: "white",
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: "5px 0",
              zIndex: 1000,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              minWidth: 120,
            }}
          >
            {[1, 5, 10, 20, "Все", reportData.length].map((count, i) => (
              <div
                key={`limit-${count}-${i}`}
                onClick={() => handleSelectLimit(count)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#f2f2f2")}
                onMouseLeave={(e) => (e.target.style.background = "white")}
              >
                {count === "Все" ? "All" : count}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleExport}
        style={{ padding: "8px 12px", background: "#007bff", color: "#fff", border: "none", borderRadius: 4 }}
      >
        Export to Excel
      </button>
    </div>
  );
};

export default ExportCSV;
