// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';

// const ExcelImport = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');
//   const [sheetData, setSheetData] = useState({});

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setMessage('Please select a file');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });

//       const sheets = workbook.SheetNames;
//       const result = {};

//       sheets.forEach(sheet => {
//         result[sheet] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
//       });

//       setSheetData(result);

//       try {
//         // Send data to Electron backend
//         const response = await window.api.send('import-excel', result);
//         setMessage(response);
//       } catch (error) {
//         setMessage('Error importing data: ' + error.message);
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const renderTable = (sheetName, data) => {
//     if (data.length === 0) return null;

//     const headers = Object.keys(data[0]);

//     return (
//       <div key={sheetName}>
//         <h3>{sheetName}</h3>
//         <table className="table table-striped table-bordered">
//           <thead>
//             <tr>
//               {headers.map((header, index) => (
//                 <th key={index}>{header}</th>
//               ))}
//             </tr>
//           </thead>
//           <body>
//             {data.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {headers.map((header, cellIndex) => (
//                   <td key={cellIndex}>{row[header]}</td>
//                 ))}
//               </tr>
//             ))}
//           </body>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <h2>Import Excel File</h2>
//       <form>
//         <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
//         <button onClick={handleSubmit} type="submit">Import</button>
//       </form>
//       {message && <p>{message}</p>}
//       {Object.entries(sheetData).map(([sheetName, data]) => 
//         renderTable(sheetName, data)
//       )}
//     </div>
//   );
// };

// export default ExcelImport;

// ------------------------------------------------------------------------------//

// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';

// const ExcelImport = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');
//   const [sheetData, setSheetData] = useState({});

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setMessage('Please select a file');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });

//       const sheets = workbook.SheetNames;
//       const result = {};

//       sheets.forEach(sheet => {
//         const worksheet = workbook.Sheets[sheet];
//         const range = XLSX.utils.decode_range(worksheet['!ref']);
//         const sheetData = [];

//         for (let R = range.s.r; R <= range.e.r; ++R) {
//           const row = [];
//           for (let C = range.s.c; C <= range.e.c; ++C) {
//             const cellAddress = {c: C, r: R};
//             const cellRef = XLSX.utils.encode_cell(cellAddress);
//             const cell = worksheet[cellRef];
//             row.push(cell ? cell.v : undefined);
//           }
//           sheetData.push(row);
//         }
//         result[sheet] = sheetData;
//       });

//       setSheetData(result);

//       try {
//         // Send data to Electron backend
//         const response = await window.api.send('import-excel', result);
//         setMessage(response);
//       } catch (error) {
//         setMessage('Error importing data: ' + error.message);
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const renderTable = (sheetName, data) => {
//     if (!data || data.length === 0) return null;

//     return (
//       <div key={sheetName}>
//         <h3>{sheetName}</h3>
//         <table className="table table-bordered">
//           <tbody>
//             {data.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {row.map((cell, cellIndex) => (
//                   <td key={cellIndex}>{cell}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <h2>Import Excel File</h2>
//       <form>
//         <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
//         <button onClick={handleSubmit} type="submit">Import</button>
//       </form>
//       {message && <p>{message}</p>}
//       {Object.entries(sheetData).map(([sheetName, data]) => 
//         renderTable(sheetName, data)
//       )}
//     </div>
//   );
// };

// export default ExcelImport;

// ------------------------------------------------------------------------------//
// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';

// const ExcelImport = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');
//   const [sheetData, setSheetData] = useState({});
//   const [combinedData, setCombinedData] = useState([]);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setMessage('Please select a file');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });

//       const sheets = workbook.SheetNames;
//       const result = {};

//       sheets.forEach(sheet => {
//         const worksheet = workbook.Sheets[sheet];
//         const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//         result[sheet] = sheetData;
//       });

//       setSheetData(result);

//       // Create combined table
//       const materialsSheet = result['materials'] || [];
//       const sizeSheet = result['size'] || [];

//       const combined = [];

//       // Process size sheet
//       const ndInchRow = sizeSheet.find(row => row[0] === 'ND (inch)');
//       const sizes = ndInchRow ? ndInchRow.slice(1).map(Number).sort((a, b) => a - b) : [];

//       materialsSheet.slice(2).forEach(row => {
//         const itemType = row[0].toLowerCase();
//         const rangeFrom = parseFloat(row[1]);
//         const rangeTo = parseFloat(row[2]);

//         if (itemType.includes('reducer') || itemType.includes('reducing tee') || itemType === 'weldolet') {
//           const halfRangeFrom = rangeTo / 2;
//           console.log("halfRangeFrom",halfRangeFrom)
//           const size2Start = sizes.filter(size => size < halfRangeFrom).pop() || sizes[0];
//           console.log("size2Start",size2Start)
//           const size2Range = sizes.filter(size => size >= size2Start && size <= rangeTo);
//           console.log("size2Range",size2Range)

//           sizes.filter(size => size >= rangeFrom && size <= rangeTo).forEach(size1 => {
//             size2Range.forEach(size2 => {
//               // if (size2 < size1) {
//                 combined.push({
//                   itemType: row[0],
//                   size1: size1,
//                   size2: size2,
//                   geometricStandard: row[3],
//                   edsVds: row[4],
//                   endConn: row[5],
//                   materialDescr: row[6],
//                   mds: row[7],
//                   rating: row[8],
//                   schd: row[9],
//                   notes: row[10]
//                 });
//               // }
//             });
//           });
//         } else {
//           // For other items, Size1 and Size2 are the same
//           sizes.filter(size => size >= rangeFrom && size <= rangeTo).forEach(size => {
//             combined.push({
//               itemType: row[0],
//               size1: size,
//               size2: size,
//               geometricStandard: row[3],
//               edsVds: row[4],
//               endConn: row[5],
//               materialDescr: row[6],
//               mds: row[7],
//               rating: row[8],
//               schd: row[9],
//               notes: row[10]
//             });
//           });
//         }
//       });

//       setCombinedData(combined);

//       try {
//         const response = await window.api.send('import-excel', result);
//         setMessage(response);
//       } catch (error) {
//         setMessage('Error importing data: ' + error.message);
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const renderMaterialsTable = (data) => {
//     if (!data || data.length === 0) return null;

//     return (
//       <div>
//         <h3>Materials</h3>
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               {data[0].map((header, index) => (
//                 <th key={index}>{header}</th>
//               ))}
//             </tr>
//             <tr>
//               <th></th>
//               <th colSpan="2">FROM TO</th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.slice(2).map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {row.map((cell, cellIndex) => (
//                   <td key={cellIndex}>{cell !== undefined ? cell : ''}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const renderSizeTable = (data) => {
//     if (!data || data.length === 0) return null;

//     return (
//       <div>
//         <h3>Size</h3>
//         <table className="table table-bordered">
//           <tbody>
//             {data.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {row.map((cell, cellIndex) => (
//                   <td key={cellIndex}>{cell !== undefined ? cell : ''}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const renderCombinedTable = () => {
//     if (combinedData.length === 0) return null;

//     return (
//       <div>
//         <h3>Combined Materials and Sizes</h3>
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th>Item Type</th>
//               <th>Size1</th>
//               <th>Size2</th>
//               <th>Geometric Standard</th>
//               <th>EDS/VDS</th>
//               <th>End Conn #1 #2</th>
//               <th>Material Descr.</th>
//               <th>MDS</th>
//               <th>Rating</th>
//               <th>SCHD.</th>
//               <th>Notes</th>
//             </tr>
//           </thead>
//           <tbody>
//             {combinedData.map((row, index) => (
//               <tr key={index}>
//                 <td>{row.itemType}</td>
//                 <td>{row.size1}</td>
//                 <td>{row.size2}</td>
//                 <td>{row.geometricStandard}</td>
//                 <td>{row.edsVds}</td>
//                 <td>{row.endConn}</td>
//                 <td>{row.materialDescr}</td>
//                 <td>{row.mds}</td>
//                 <td>{row.rating}</td>
//                 <td>{row.schd}</td>
//                 <td>{row.notes}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <h2>Import Excel File</h2>
//       <form>
//         <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
//         <button onClick={handleSubmit} type="submit">Import</button>
//       </form>
//       {message && <p>{message}</p>}
//       {sheetData['materials'] && renderMaterialsTable(sheetData['materials'])}
//       {sheetData['size'] && renderSizeTable(sheetData['size'])}
//       {renderCombinedTable()}
//     </div>
//   );
// };

// export default ExcelImport;

// -----------------------------------------------------------------------------------//
// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';

// const ExcelImport = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');
//   const [sheetData, setSheetData] = useState({});
//   const [combinedData, setCombinedData] = useState([]);
//   const [transformedData, setTransformedData] = useState([]);
//   const [excelData, setExcelData] = useState([]);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setMessage('Please select a file');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });

    
//       const sheets = workbook.SheetNames;
//       const result = {};

//       sheets.forEach(sheet => {
//         const worksheet = workbook.Sheets[sheet];
//         const range = XLSX.utils.decode_range(worksheet['!ref']);
//         const sheetData = [];

//         for (let R = range.s.r; R <= range.e.r; ++R) {
//           const row = [];
//           for (let C = range.s.c; C <= range.e.c; ++C) {
//             const cellAddress = {c: C, r: R};
//             const cellRef = XLSX.utils.encode_cell(cellAddress);
//             const cell = worksheet[cellRef];
//             row.push(cell ? cell.v : undefined);
//           }
//           sheetData.push(row);
//         }
//         result[sheet] = sheetData;
//       });

//       setSheetData(result);

//       // Create combined table
//       const materialsSheet = result['materials'] || [];
//       const sizeSheet = result['size'] || [];

//       const combined = [];

//       // Process size sheet
//       const ndInchRow = sizeSheet.find(row => row[0] === 'ND (inch)');
//       const sizes = ndInchRow ? ndInchRow.slice(1).map(Number).sort((a, b) => a - b) : [];

//       materialsSheet.slice(2).forEach(row => {
//         const itemType = row[0];
//         const fittingType = row[1];
//         const rangeFrom = parseFloat(row[2]);
//         const rangeTo = parseFloat(row[3]);

//         if (fittingType && (fittingType.toLowerCase().includes('reduce') )) {
//           const halfRangeTo = rangeTo / 2;
//           console.log("halfRangeTo",halfRangeTo)
//           const size2Start = sizes.filter(size => size < halfRangeTo).pop() || sizes[0];
//           console.log("size2Start",size2Start)

//           const size2Range = sizes.filter(size => size >= size2Start && size <= rangeTo);
//           console.log("halfRangeTo",size2Range)
//          // sizes.filter(size => size >= rangeFrom && size <= rangeTo).forEach(size1 => {
//             //             size2Range.forEach(size2 => {

//           sizes.filter(size => size >= rangeFrom && size <= rangeTo).forEach(size1 => {
//             size2Range.forEach(size2 => {
//               // if (size2 < size1) {
//                 combined.push({
//                   itemType,
//                   fittingType,
//                   size1,
//                   size2,
//                   geometricStandard: row[4],
//                   edsVds: row[5],
//                   endConn: row[6],
//                   materialDescr: row[7],
//                   mds: row[8],
//                   rating: row[9],
//                   schd: row[10],
//                   notes: row[11]
//                 });
//               // }
//             });
//           });
//         } else {
//           // For other items, Size1 and Size2 are the same
//           sizes.filter(size => size >= rangeFrom && size <= rangeTo).forEach(size => {
//             combined.push({
//               itemType,
//               fittingType,
//               size1: size,
//               size2: size,
//               geometricStandard: row[4],
//               edsVds: row[5],
//               endConn: row[6],
//               materialDescr: row[7],
//               mds: row[8],
//               rating: row[9],
//               schd: row[10],
//               notes: row[11]
//             });
//           });
//         }
//       });

//       setCombinedData(combined);

//       try {
//         const response = await window.api.send('import-excel', result);
//         setMessage(response);
//       } catch (error) {
//         setMessage('Error importing data: ' + error.message);
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const renderMaterialsTable = (data) => {
//     if (!data || data.length === 0) return null;

//     return (
//       <div>
//         <h3>Materials</h3>
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               {data[0].map((header, index) => (
//                 <th key={index}>{header}</th>
//               ))}
//             </tr>
//             <tr>
//               <th></th>
//               <th></th>
//               <th colSpan="2">RANGE</th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//             </tr>
//             <tr>
//               <th></th>
//               <th></th>
//               <th>FROM</th>
//               <th>TO</th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.slice(3).map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {row.map((cell, cellIndex) => (
//                   <td key={cellIndex}>{cell !== undefined ? cell : ''}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const renderSizeTable = (data) => {
//     if (!data || data.length === 0) return null;

//     return (
//       <div>
//         <h3>Size</h3>
//         <table className="table table-bordered">
//           <tbody>
//             {data.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {row.map((cell, cellIndex) => (
//                   <td key={cellIndex}>{cell !== undefined ? cell : ''}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const renderCombinedTable = () => {
//     if (combinedData.length === 0) return null;

//     return (
//       <div>
//         <h3>Combined Materials and Sizes</h3>
//         <table className="table table-bordered">
//           <thead>
//             <tr>
//               <th>Item Type</th>
//               <th>Fitting Type</th>
//               <th>Size1</th>
//               <th>Size2</th>
//               <th>Geometric Standard</th>
//               <th>EDS/VDS</th>
//               <th>End Conn #1 #2</th>
//               <th>Material Descr.</th>
//               <th>MDS</th>
//               <th>Rating</th>
//               <th>SCHD.</th>
//               <th>Notes</th>
//             </tr>
//           </thead>
//           <tbody>
//             {combinedData.map((row, index) => (
//               <tr key={index}>
//                 <td>{row.itemType}</td>
//                 <td>{row.fittingType}</td>
//                 <td>{row.size1}</td>
//                 <td>{row.size2}</td>
//                 <td>{row.geometricStandard}</td>
//                 <td>{row.edsVds}</td>
//                 <td>{row.endConn}</td>
//                 <td>{row.materialDescr}</td>
//                 <td>{row.mds}</td>
//                 <td>{row.rating}</td>
//                 <td>{row.schd}</td>
//                 <td>{row.notes}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (event) => {
//       const data = new Uint8Array(event.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });

//       // Assuming first sheet for simplicity, change as needed
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];

//       // Parse data
//       const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//       // Update state with parsed data
//       setExcelData(parsedData);
//     };

//     reader.readAsArrayBuffer(file);
//   };
//   const transformed = [];
//   const transformData = () => {
//     const numRows = excelData.length;
//     const numCols = excelData[0].length;
//     console.log(numRows);
//     console.log(numCols);


//     for (let i = 1; i < numRows; i++) {
//       for (let j = 1; j < numCols; j++) {
//         const item = excelData[i][j];
//         if (item) {
//           const size1 = excelData[0][i];
//           const size2 = excelData[j][0] 
//           const itemDes = getItemDescription(item); // You'll need to define this function
//           transformed.push({ size1, size2, item, itemDes });
//         }
//       }
//     }
// setTransformedData(transformed)
//     // Log or set the transformed data in state, depending on your use case
//     console.log(transformed);
//   };

//   const getItemDescription = (item) => {
    
//     if (item === 'WOL' ) return 'Weldot';
//     if (item === 'WRT' ) return 'Reducing tee';
//     if (item === 'WT' ) return 'Straight tee';
//     if (item === 'TR' ) return 'Reducing tee';
//     if (item === 'TOL' ) return 'Threadolet';
//     if (item === 'WOF' ) return 'Reinforcednipoflange';


//     // Default value if no match found
//     return 'Unknown';
//   };
 

//   return (
//     <div>
//      <div>
//      <h2>Import Spec File</h2>
//       <form>
//         <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
//         <button onClick={handleSubmit} type="submit">Import</button>
//       </form>
//      </div>
//      <div>
//         <h3>Import branch table</h3>
//         <input type="file" accept=".xlsx, .xls" className='btn btn-warning mt-3' onChange={handleFileUpload} />
//         <button className='btn btn-success ms-3 mt-3' onClick={transformData}>Transform Data</button>
//       </div>
//       {message && <p>{message}</p>}
//       {sheetData['materials'] && renderMaterialsTable(sheetData['materials'])}
//       {sheetData['size'] && renderSizeTable(sheetData['size'])}
//       {renderCombinedTable()}
//  {transformedData.length > 0 && (
//         <div>
//           <h3>Transformed Branch Table Data</h3>
//           <table className='table'>
//             <thead>
//               <tr>
//                 <th>Size1</th>
//                 <th>Size2</th>
//                 <th>Item</th>
//                 <th>Item Description</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transformedData.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row.size1}</td>
//                   <td>{row.size2}</td>
//                   <td>{row.item}</td>
//                   <td>{row.itemDes}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExcelImport;
// --------------------------------------------------------------------//
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelImport = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [sheetData, setSheetData] = useState({});
  const [combinedData, setCombinedData] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [excelData, setExcelData] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

 
  const findSize2FromBranchTable = (size1, itemType) => {
    const matchingItems = transformedData.filter(item => 
      parseFloat(item.size1) == size1 &&
      (
        (itemType.toLowerCase().includes('reducing tee') && item.item === 'TR') ||
        (itemType.toLowerCase().includes('reducing tee') && item.item === 'WRT') ||
        (itemType.toLowerCase() === 'weldolet' && item.item === 'WOL')||
        (itemType.toLowerCase() === 'threadolet' && item.item === 'TOL')||
        (itemType.toLowerCase() === 'reinforced nipoflange' && item.item === 'WOL')

      )
    );
  
    if (matchingItems.length === 0) return null;
  
    // Sort by size2 in descending order and return the largest size2 that's smaller than or equal to size1
    return matchingItems
      .sort((a, b) => parseFloat(b.size2) - parseFloat(a.size2))
      .find(item => parseFloat(item.size2) <= size1)?.size2 || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheets = workbook.SheetNames;
      const result = {};

      sheets.forEach(sheet => {
        const worksheet = workbook.Sheets[sheet];
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const sheetData = [];

        for (let R = range.s.r; R <= range.e.r; ++R) {
          const row = [];
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = {c: C, r: R};
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            const cell = worksheet[cellRef];
            row.push(cell ? cell.v : undefined);
          }
          sheetData.push(row);
        }
        result[sheet] = sheetData;
      });

      setSheetData(result);

      // Create combined table
      const materialsSheet = result['materials'] || [];
      const sizeSheet = result['size'] || [];

      const combined = [];

      // Process size sheet
      const ndInchRow = sizeSheet.find(row => row[0] === 'ND (inch)');
      const sizes = ndInchRow ? ndInchRow.slice(1).map(Number).sort((a, b) => a - b) : [];

      materialsSheet.slice(3).forEach(row => {
        const itemType = row[0];
        const fittingType = row[1];
        const rangeFrom = parseFloat(row[2]);
        const rangeTo = parseFloat(row[3]);

        if (fittingType && (fittingType.toLowerCase().includes('branch') )) {
          console.log(fittingType);
          sizes.filter(size => size >= rangeFrom && size <= rangeTo).forEach(size1 => {
            const branchSize2 = findSize2FromBranchTable(size1, itemType);
            console.log(branchSize2)
            if (branchSize2) {
              combined.push({
                itemType,
                fittingType,
                size1,
                size2: parseFloat(branchSize2),
                geometricStandard: row[4],
                edsVds: row[5],
                endConn: row[6],
                materialDescr: row[7],
                mds: row[8],
                rating: row[9],
                schd: row[10],
                notes: row[11]
              });
            }
          });
        }
       else if (fittingType && (fittingType.toLowerCase().includes('reduce'))) {
        console.log(fittingType);

          const halfRangeFrom = rangeTo / 2;
          console.log("halfRangeFrom",halfRangeFrom)
          const size2Start = sizes.filter(size => size < halfRangeFrom).pop() || sizes[0];
          console.log("size2Start",size2Start)
          const size2Range = sizes.filter(size => size >= size2Start && size <= rangeTo);
          console.log("size2Range",size2Range)

          sizes.filter(size => size >= rangeFrom && size <= rangeTo).forEach(size1 => {
            size2Range.forEach(size2 => {
                combined.push({
                  itemType: row[0],
                  fittingType,
                  size1: size1,
                  size2: size2,
                  geometricStandard: row[4],
                  edsVds: row[5],
                  endConn: row[6],
                  materialDescr: row[7],
                  mds: row[8],
                  rating: row[9],
                  schd: row[10],
                  notes: row[11]
                });
            });
          });
        } 
        else {
          // For other items, Size1 and Size2 are the same
          sizes.filter(size => size >= rangeFrom && size <= rangeTo).forEach(size => {
            combined.push({
              itemType,
              fittingType,
              size1: size,
              size2: size,
              geometricStandard: row[4],
              edsVds: row[5],
              endConn: row[6],
              materialDescr: row[7],
              mds: row[8],
              rating: row[9],
              schd: row[10],
              notes: row[11]
            });
          });
        }
      });

      setCombinedData(combined);

      try {
        const response = await window.api.send('import-excel', result);
        setMessage(response);
      } catch (error) {
        setMessage('Error importing data: ' + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const renderMaterialsTable = (data) => {
    if (!data || data.length === 0) return null;

    return (
      <div>
        <h3>Materials</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              {data[0].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th colSpan="2">RANGE</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th>FROM</th>
              <th>TO</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.slice(3).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell !== undefined ? cell : ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSizeTable = (data) => {
    if (!data || data.length === 0) return null;

    return (
      <div>
        <h3>Size</h3>
        <table className="table table-bordered">
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell !== undefined ? cell : ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCombinedTable = () => {
    if (combinedData.length === 0) return null;

    return (
      <div>
        <h3>Combined Materials and Sizes</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Item Type</th>
              <th>Fitting Type</th>
              <th>Size1</th>
              <th>Size2</th>
              <th>Geometric Standard</th>
              <th>EDS/VDS</th>
              <th>End Conn #1 #2</th>
              <th>Material Descr.</th>
              <th>MDS</th>
              <th>Rating</th>
              <th>SCHD.</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.map((row, index) => (
              <tr key={index}>
                <td>{row.itemType}</td>
                <td>{row.fittingType}</td>
                <td>{row.size1}</td>
                <td>{row.size2}</td>
                <td>{row.geometricStandard}</td>
                <td>{row.edsVds}</td>
                <td>{row.endConn}</td>
                <td>{row.materialDescr}</td>
                <td>{row.mds}</td>
                <td>{row.rating}</td>
                <td>{row.schd}</td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setExcelData(parsedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const transformData = () => {
    const numRows = excelData.length;
    const numCols = excelData[0].length;
    const transformed = [];

    for (let i = 1; i < numRows; i++) {
      for (let j = 1; j < numCols; j++) {
        const item = excelData[i][j];
        if (item) {
          const size1 = excelData[0][j];
          const size2 = excelData[i][0];
          const itemDes = getItemDescription(item);
          transformed.push({ size1, size2, item, itemDes });
        }
      }
    }
    setTransformedData(transformed);
    console.log(transformed);
  };

  const getItemDescription = (item) => {
    const descriptions = {
      'WOL': 'Weldolet',
      'WRT': 'Reducing tee',
      'WT': 'Straight tee',
      'TR': 'Reducing tee',
      'TOL': 'Threadolet',
      'WOF': 'Reinforced nipoflange'
    };
    return descriptions[item] || 'Unknown';
  };

  return (
    <div>
      <div>
        <h3>Import branch table</h3>
        <input type="file" accept=".xlsx, .xls" className='btn btn-warning mt-3' onChange={handleFileUpload} />
        <button className='btn btn-success ms-3 mt-3' onClick={transformData}>Transform Data</button>
      </div>
      <div>
        <h2>Import Spec File</h2>
        <form>
          <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
          <button onClick={handleSubmit} type="submit">Import</button>
        </form>
      </div>
      {message && <p>{message}</p>}
      {sheetData['materials'] && renderMaterialsTable(sheetData['materials'])}
      {sheetData['size'] && renderSizeTable(sheetData['size'])}
      {renderCombinedTable()}
      {transformedData.length > 0 && (
        <div>
          <h3>Transformed Branch Table Data</h3>
          <table className='table'>
            <thead>
              <tr>
                <th>Size1</th>
                <th>Size2</th>
                <th>Item</th>
                <th>Item Description</th>
              </tr>
            </thead>
            <tbody>
              {transformedData.map((row, index) => (
                <tr key={index}>
                  <td>{row.size1}</td>
                  <td>{row.size2}</td>
                  <td>{row.item}</td>
                  <td>{row.itemDes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExcelImport;

