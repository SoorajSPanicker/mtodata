import React, { useState, useEffect } from 'react';
import { parse } from 'node-html-parser';
import * as XLSX from 'xlsx';

function LoadHtml() {
  const [tables, setTables] = useState([]);
  const [rawHtml, setRawHtml] = useState('');
  const [filePath, setFilePath] = useState('');
  const [showRawHtml, setShowRawHtml] = useState(false);

  useEffect(() => {
    window.api.receive('html-file-content', (content) => {
      if (content) {
        console.log(content);
        setRawHtml(content);
        const parsedTables = parseHtmlContent(content);
        console.log(parsedTables);
        setTables(parsedTables);
      }
    });

    window.api.receive('selected-file', (path) => {
      setFilePath(path);
    });

    return () => {
      // Clean up if necessary
    };
  }, []);

  const handleFileSelect = () => {
    window.api.send('open-file-dialog');
  };

  const parseHtmlContent = (content) => {
    const root = parse(content);
    const tableTags = root.querySelectorAll('table');

    return Array.from(tableTags).map((table, index) => {
      const rows = table.querySelectorAll('tr');
      const data = Array.from(rows).map(row =>
        Array.from(row.querySelectorAll('td, th')).map(cell => cell.textContent.trim())
      );
      return { id: index, data };
    });
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    tables.forEach((table, index) => {
      const worksheet = XLSX.utils.aoa_to_sheet(table.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, `Table ${index + 1}`);
    });

    XLSX.writeFile(workbook, 'exported_tables.xlsx');
  };

  const handleSelectDirectory=()=>{
    window.api.send('openfolder')
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Load HTML Table</h2>
      <button onClick={handleSelectDirectory}>Choose folder to create database</button>
      <button
        onClick={handleFileSelect}
        className="mb-4 mr-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Select HTML File
      </button>
      <button
        onClick={() => setShowRawHtml(!showRawHtml)}
        className="mb-4 mr-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {showRawHtml ? 'Show Parsed Tables' : 'Show Raw HTML'}
      </button>
      {tables.length > 0 && (
        <button
          onClick={exportToExcel}
          className="mb-4 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Export to Excel
        </button>
      )}
      {filePath && <p className="mb-4">Selected file: {filePath}</p>}
      {showRawHtml ? (
        rawHtml ? (
          <div className="border p-4 bg-gray-100 overflow-auto max-h-[70vh]">
            <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
          </div>
        ) : (
          <p>No HTML content loaded. Please select an HTML file.</p>
        )
      ) : tables.length > 0 ? (
        <div className="overflow-auto max-h-[70vh]">
          {tables.map((table, tableIndex) => (
            <div key={table.id} className="mb-8">
              <h3 className="text-xl font-bold mb-2">Table {tableIndex + 1}</h3>
              <table className="w-full border-collapse border border-gray-400">
                <tbody>
                  {table.data.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-200' : ''}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-400 px-4 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <p>No table data loaded. Please select an HTML file.</p>
      )}
    </div>
  );
}

export default LoadHtml;