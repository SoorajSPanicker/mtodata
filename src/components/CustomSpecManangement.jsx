import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
function CustomSpecManagement({ speccus }) {
  // State to store table rows
  const [rows, setRows] = useState([]);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [editedRowIndex, setEditedRowIndex] = useState(-1);
  const [editedLineData, setEditedLineData] = useState({});
  // Function to add a new row
  const addRow = () => {
    setRows([...rows, {}]); // Adds an empty object for each new row
  };

  // Handle form data change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChanges = (field, value) => {
    setEditedLineData({
      ...editedLineData,
      [field]: value
    });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    window.api.send('save-custom-spec', formData);
    setRows([])
  }

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleEditOpen = (index) => {
    setEditedRowIndex(index);
    setEditedLineData(speccus[index]);
  };

  const handleCloseEdit = () => {
    setEditedRowIndex(-1);
    setEditedLineData({});
  };

  const handleSave = (specMaterialId) => {
    const updatedLineList = [...speccus];
    updatedLineList[editedRowIndex] = { ...editedLineData, specMaterialId: specMaterialId };

    setEditedRowIndex(-1);
    setEditedLineData({});

    window.api.send("update-customspec-table", editedLineData);
  };



  useEffect(() => {
    console.log(excelData);

  }, [excelData])

  const handleFileChange = (e) => {
    // let parsedData
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      // const data = new Uint8Array(e.target.result);
      // const workbook = XLSX.read(data, { type: 'array' });

      // const sheets = workbook.SheetNames;
      // const result = {};

      // sheets.forEach(sheet => {
      //   const worksheet = workbook.Sheets[sheet];
      //   const range = XLSX.utils.decode_range(worksheet['!ref']);
      //   const sheetData = [];

      //   for (let R = range.s.r; R <= range.e.r; ++R) {
      //     const row = [];
      //     for (let C = range.s.c; C <= range.e.c; ++C) {
      //       const cellAddress = { c: C, r: R };
      //       const cellRef = XLSX.utils.encode_cell(cellAddress);
      //       const cell = worksheet[cellRef];
      //       row.push(cell ? cell.v : undefined);
      //     }
      //     sheetData.push(row);
      //   }
      //   result[sheet] = sheetData;
      // });
      // console.log(result);

      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log(parsedData);
      window.api.send("spec-excel-data", parsedData);
      setExcelData(parsedData);
    };
    reader.readAsArrayBuffer(file);
    // console.log(reader);


    // if (file && onFileSelect) {
    //   onFileSelect(file);
    // }
  };

  const [formData, setFormData] = useState({
    itemType: '',
    fittingType: '',
    size1: '',
    size2: '',
    GeometricStd: '',
    EDS_VDS: '',
    endConn: '',
    materialDescrip: '',
    MDS: '',
    rating: '',
    SCHD: '',
    Notes: '',
    remarks: '',
    preparedBy: '',
    checkedBy: '',
    approvedBy: ''
  });

  useEffect(() => {
    console.log(formData);

  }, [formData])

  useEffect(() => {
    console.log(speccus);

  }, [speccus])


  return (
    <div style={{ width: '100%', height: '90vh', backgroundColor: 'white', zIndex: '1', position: 'absolute', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
        <h4 className='ms-4 mt-2'>Create Custom Material Spec</h4>
        <i className="fa-solid fa-circle-plus me-3" onClick={addRow} style={{ cursor: 'pointer' }}></i>
      </div>

      {/* <form> */}
      {/* <div>
          <div className="table-container">
            <table className='tagTable'> */}
      <div className="table-container" style={{
        flex: 1,
        overflow: 'auto',
        padding: '10px'
      }}>
        <table className='tagTable' style={{
          width: 'max-content',
          minWidth: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr>
              <th className="wideHead">Item type</th>
              <th className="wideHead">Fitting type</th>
              <th className="mediumHead">Size1</th>
              <th className="wideHead">Size2</th>
              <th className="wideHead">Geometric std</th>
              <th className="wideHead">EDS/VDS</th>
              <th className="wideHead">End Conn</th>
              <th className="wideHead">Material Descri</th>
              <th className="wideHead">MDS</th>
              <th className="wideHead">Rating</th>
              <th className="wideHead">SCHD</th>
              <th className="wideHead">Notes</th>
              <th className="wideHead">Remarks</th>
              <th className="wideHead">Prepared by</th>
              <th className="wideHead">Checked by</th>
              <th className="wideHead">Approved by</th>
              <th className="tableActionCell">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Import file"
                  style={{ display: 'none' }}
                />

                {/* Clickable icon */}
                <button
                  onClick={handleIconClick}
                  className="bg-transparent border-0 p-2 cursor-pointer hover:opacity-80"
                  title="Import"
                >
                  <i className="fa fa-download" title="Import"></i>
                </button>

              </th>
            </tr>
          </thead>
          <tbody>
            {speccus.map((row, index) => (
              <tr key={index} style={{ backgroundColor: 'black' }}>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('itemType', e.target.value)} type="text" value={editedLineData.itemType || ''} /> : row.itemType}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('fittingType', e.target.value)} type="text" value={editedLineData.fittingType || ''} /> : row.fittingType}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('size1', e.target.value)} type="number" value={editedLineData.size1 || ''} /> : row.size1}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('size2', e.target.value)} type="number" value={editedLineData.size2 || ''} /> : row.size2}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('GeometricStd', e.target.value)} type="text" value={editedLineData.GeometricStd || ''} /> : row.GeometricStd}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('EDS_VDS', e.target.value)} type="text" value={editedLineData.EDS_VDS || ''} /> : row.EDS_VDS}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('endConn', e.target.value)} type="text" value={editedLineData.endConn || ''} /> : row.endConn}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('materialDescrip', e.target.value)} type="text" value={editedLineData.materialDescrip || ''} /> : row.materialDescrip}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('MDS', e.target.value)} type="text" value={editedLineData.MDS || ''} /> : row.MDS}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('rating', e.target.value)} type="text" value={editedLineData.rating || ''} /> : row.rating}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('SCHD', e.target.value)} type="text" value={editedLineData.SCHD || ''} /> : row.SCHD}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('Notes', e.target.value)} type="text" value={editedLineData.Notes || ''} /> : row.Notes}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('remarks', e.target.value)} type="text" value={editedLineData.remarks || ''} /> : row.remarks}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('preparedBy', e.target.value)} type="text" value={editedLineData.preparedBy || ''} /> : row.preparedBy}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('checkedBy', e.target.value)} type="text" value={editedLineData.checkedBy || ''} /> : row.checkedBy}</td>
                <td>{editedRowIndex === index ? <input onChange={e => handleChanges('checkedBy', e.target.value)} type="text" value={editedLineData.approvedBy || ''} /> : row.approvedBy}</td>
                <td >
                  {editedRowIndex === index ?
                    <>
                      <i className="fa-solid fa-floppy-disk text-success" onClick={() => handleSave(row.specMaterialId)}></i>
                      <i className="fa-solid fa-xmark ms-3 text-danger" onClick={handleCloseEdit}></i>
                    </>
                    :
                    <>
                      <i className="fa-solid fa-pencil" onClick={() => handleEditOpen(index)}></i>
                      <i className="fa-solid fa-trash-can ms-3" ></i>
                    </>
                  }
                </td>
              </tr>
            ))}
            {rows.map((row, index) => (
              <tr key={index}>
                <td><input type="text" name='itemType' value={formData.itemType} onChange={handleChange} /></td>
                <td><input type="text" name='fittingType' value={formData.fittingType} onChange={handleChange} /></td>
                <td><input type="number" name='size1' value={formData.size1} onChange={handleChange} /></td>
                <td><input type="number" name='size2' value={formData.size2} onChange={handleChange} /></td>
                <td><input type="text" name='GeometricStd' value={formData.GeometricStd} onChange={handleChange} /></td>
                <td><input type="text" name='EDS_VDS' value={formData.EDS_VDS} onChange={handleChange} /></td>
                <td><input type="text" name='endConn' value={formData.endConn} onChange={handleChange} /></td>
                <td><input type="text" name='materialDescrip' value={formData.materialDescrip} onChange={handleChange} /></td>
                <td><input type="text" name='MDS' value={formData.MDS} onChange={handleChange} /></td>
                <td><input type="text" name='rating' value={formData.rating} onChange={handleChange} /></td>
                <td><input type="text" name='SCHD' value={formData.SCHD} onChange={handleChange} /></td>
                <td><input type="text" name='Notes' value={formData.Notes} onChange={handleChange} /></td>
                <td><input type="text" name='remarks' value={formData.remarks} onChange={handleChange} /></td>
                <td><input type="text" name='preparedBy' value={formData.preparedBy} onChange={handleChange} /></td>
                <td><input type="text" name='checkedBy' value={formData.checkedBy} onChange={handleChange} /></td>
                <td><input type="text" name='approvedBy' value={formData.approvedBy} onChange={handleChange} /></td>
                <td>
                  <i class="fa-solid fa-floppy-disk" onClick={handlesubmit} style={{ cursor: 'pointer' }}></i>
                  <i class="fa-solid fa-pen"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* </div> */}
      {/* </form> */}
    </div>
  );
}

export default CustomSpecManagement;
