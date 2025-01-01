import React, {useState} from 'react'
import * as XLSX from 'xlsx';

function BranchTable() {
    const [transformedData, setTransformedData] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [originalData, setOriginalData] = useState([]);

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
  
        // Assuming first sheet for simplicity, change as needed
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
  
        // Parse data
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        // Update state with parsed data
        setExcelData(parsedData);
      };
  
      reader.readAsArrayBuffer(file);
    };
    const transformed = [];
    const transformData = () => {
      const numRows = excelData.length;
      const numCols = excelData[0].length;
      console.log(numRows);
      console.log(numCols);

  
      for (let i = 1; i < numRows; i++) {
        for (let j = 1; j < numCols; j++) {
          const item = excelData[i][j];
          if (item) {
            const size1 = excelData[0][i];
            const size2 = excelData[j][0] 
            const itemDes = getItemDescription(item); // You'll need to define this function
            transformed.push({ size1, size2, item, itemDes });
          }
        }
      }
  setTransformedData(transformed)
      // Log or set the transformed data in state, depending on your use case
      console.log(transformed);
    };
  
    const getItemDescription = (item) => {
      
      if (item === 'WOL' ) return 'Weldot';
      if (item === 'WRT' ) return 'Reducing tee';
      if (item === 'WT' ) return 'Straight tee';
      if (item === 'TR' ) return 'Reducing tee';
      if (item === 'TOL' ) return 'Threadolet';
      if (item === 'WOF' ) return 'Reinforcednipoflange';

  
      // Default value if no match found
      return 'Unknown';
    };

    const convertOriginal=()=>{

      // Get unique size1 and size2 values to determine row and column headers
      const uniqueSize1 = [...new Set(transformedData.map((row) => row.size1))];
      const uniqueSize2 = [...new Set(transformedData.map((row) => row.size2))];

      // Initialize 2D array with size1 as row headers and size2 as column headers
      const matrix = Array(uniqueSize1.length + 1)
        .fill()
        .map(() => Array(uniqueSize2.length + 1).fill(null));

      // Set headers in the first row and column
      matrix[0][0] = ''; // Top-left cell
      uniqueSize1.forEach((size, index) => (matrix[index + 1][0] = size)); // size1 headers
      uniqueSize2.forEach((size, index) => (matrix[0][index + 1] = size)); // size2 headers

      // Populate matrix with items
      transformedData.forEach(({ size1, size2, item }) => {
        const rowIndex = uniqueSize1.indexOf(size1) + 1;
        const colIndex = uniqueSize2.indexOf(size2) + 1;
        matrix[rowIndex][colIndex] = item;
      });

      setOriginalData(matrix); // Update state with the reconstructed matrix
    }
   
  

  return (
    <div>
      <h2 className="text-primary text-center">BRANCH TABLE-Converted foramt</h2>
        <div className='m-5'>
        <input type="file" accept=".xlsx, .xls" className='btn btn-warning mt-3' onChange={handleFileUpload} />
      <button className='btn btn-success ms-3 mt-3' onClick={transformData}>Transform Data</button>
      {/* Display the transformed data in a table */}
      <table className='table'>
        <thead>
          <tr>
            <th>size1</th>
            <th>size2</th>
            <th>item</th>
            <th>itemdes</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over transformedData and render rows */}
          {/* Your code to map over transformed data and display rows */}
          {transformedData.map((row, index) => (
            <tr key={index}>
              <td  className='text-dark'>{row.size1}</td>
              <td  className='text-dark'>{row.size2}</td>
              <td  className='text-dark'>{row.item}</td>
              <td  className='text-dark'>{row.itemDes}</td>
            </tr>
          ))}
        </tbody>
      </table>

        </div>
        

        <h2 className="text-primary text-center">BRANCH TABLE - Original Format</h2>
        <button className='btn btn-danger ms-3 mt-3' onClick={convertOriginal}>Convert Original Data</button>

      <table className="table">
        <thead>
          <tr>
            {originalData[0]?.map((header, index) => (
              <th className='text-dark' key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {originalData.slice(1).map((row, rowIndex) => (
            <tr  className='text-dark' key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  )
}

export default BranchTable

