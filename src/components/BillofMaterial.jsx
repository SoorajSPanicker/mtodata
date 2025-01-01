import React from 'react'
import { useState } from "react";
import * as XLSX from "xlsx";

function BillofMaterial() {
  const [convertedData, setConvertedData] = useState([]);
  // const [toggle,setToggle] = useState(true)

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(sheet);

      const converted = convertData(excelData);
      setConvertedData(converted);
    };

    reader.readAsArrayBuffer(file);
  };

  const convertData = (data) => {
    
    const converted = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      console.log(item);
     var toggle =true;
      for(let j=0;j<2;j++){
        const size1 = toggle ? item['FROM'] : item['TO'];
        const newItem = {
          item_type: item['ITEM TYPE'],
          size1,
          p1: item['GEOMETRIC STANDARD'],
          p2: item['EDS/VDS'],
          p3: item['END CONN1'],
          p4: item['END CONN2'],
          p5: item['MATERIAL DESCR.'],
          p6:item['MDS'],
          p7:item['RATING'],
          p8:item['SCHD.'],
          p9:item['NOTES']

        };
        converted.push(newItem);
        toggle =false;

      }     
      
      
    }
    return converted;
  };

 
  
  return (
    <div>
      <h2 className="text-center text-primary">SPEC MATERIALS</h2>
       <div className='m-5'>
      <input className='btn btn-danger' type="file" onChange={handleFileUpload} />
      <table className='table'>
        <thead>
          <tr>
            <th>No:</th>
            <th>Item Type</th>
            <th>Size 1</th>
            <th>Geometric Standard</th>
            <th>EDS/VDS</th>
            <th>End Conn1</th>
            <th>End Conn2</th>
            <th>Material Descr.</th>
            <th>MDS</th>
            <th>Rating</th>
            <th>SCHD.</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {convertedData.map((item, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{item['item_type']}</td>
              <td>{item['size1']}</td>
              <td>{item['p1']}</td>
              <td>{item['p2']}</td>
              <td>{item['p3']}</td>
              <td>{item['p4']}</td>
              <td>{item['p5']}</td>
              <td>{item['p6']}</td>
              <td>{item['p7']}</td>
              <td>{item['p8']}</td>
              <td>{item['p9']}</td>


            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
</div>
  )
}

export default BillofMaterial

