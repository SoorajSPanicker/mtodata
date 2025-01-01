import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const CombinedTable = () => {
  const [arr1Data, setArr1Data] = useState([]);
  const [arr2Data, setArr2Data] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  const handleFileUpload = (event, setData) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(sheet);
      setData(excelData);
    };

    reader.readAsArrayBuffer(file);
  };

  const combineData = () => {
    const combined = arr1Data.map(item1 => {
        console.log(item1);
      const matchingItem2 = arr2Data.find(
        item2 =>
            item2['Size1'] === item1['size1'] && item2['Size2'] === item1['size2']
        
      );

      return {
        Size1: item1['size1'],
        Size2: item1['size2'],
        ITEM: item1['item'],
        'ITEM TYPE': matchingItem2 ? matchingItem2['ITEM TYPE'] : '',
        PROPERTY1: matchingItem2 ? matchingItem2['PROPERTY1'] : '',
        PROPERTY2: matchingItem2 ? matchingItem2['PROPERTY2'] : ''
      };
    });

    setCombinedData(combined);
  };

  return (
    <div className="m-5">
      <h2 className="text-center text-primary">Combined Table</h2>
      <div className="mb-3">
        <label className="form-label">Upload ARR:3 File</label>
        <input 
          type="file" 
          className="form-control" 
          onChange={(e) => handleFileUpload(e, setArr1Data)} 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Upload ARR:2A File</label>
        <input 
          type="file" 
          className="form-control" 
          onChange={(e) => handleFileUpload(e, setArr2Data)} 
        />
      </div>
      <button className="btn btn-primary mb-3" onClick={combineData}>
        Combine Data
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Size1</th>
            <th>Size2</th>
            <th>ITEM</th>
            <th>ITEM TYPE</th>
            <th>PROPERTY1</th>
            <th>PROPERTY2</th>
          </tr>
        </thead>
        <tbody>
          {combinedData.map((item, index) => (
            <tr key={index}>
              <td>{item.Size1}</td>
              <td>{item.Size2}</td>
              <td>{item.ITEM}</td>
              <td>{item['ITEM TYPE']}</td>
              <td>{item.PROPERTY1}</td>
              <td>{item.PROPERTY2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CombinedTable;