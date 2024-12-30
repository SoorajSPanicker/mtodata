import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

function SpecTableManagement({ branchTableDetails, branchTableDataDetails }) {
  const [file, setFile] = useState(null);
  const [combinedData, setCombinedData] = useState([]);
  const [sheetData, setSheetData] = useState([]);
  const [message, setMessage] = useState('');
  const [branchName, setBranchName] = useState('');
  const [formData, setFormData] = useState({
    Documentnumber: '',
    specName: '',
    Revision: '',
    RevisionDate: '',
    branchTable: '',
    type: ''
  });
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    console.log(sheetData);

  }, [sheetData])

  useEffect(() => {
    console.log(combinedData);

  }, [combinedData])

  // Handle form data change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!file) {
  //     setMessage('Please select a file');
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheets = workbook.SheetNames;
  //     const result = {};

  //     sheets.forEach((sheet) => {
  //       const worksheet = workbook.Sheets[sheet];
  //       const sheetDataArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  //       result[sheet] = sheetDataArray;
  //     });

  //     setSheetData(result);

  //     // const materialsSheet = result['materials'] || [];
  //     // const sizeSheet = result['size'] || [];
  //     // const tempPresSheet = result['Temppres'] || [];
  //     // const combined = [];

  //     // const ndInchRow = sizeSheet.find(row => row[0] === 'ND (inch)');
  //     // const sizes = ndInchRow ? ndInchRow.slice(1).map(Number).sort((a, b) => a - b) : [];

  //     // materialsSheet.slice(3).forEach(row => {
  //     //   const itemType = row[0];
  //     //   const fittingType = row[1];
  //     //   const rangeFrom = parseFloat(row[2]);
  //     //   const rangeTo = parseFloat(row[3]);

  //     //   if (fittingType && fittingType.toLowerCase().includes('branch')) {
  //     //     sizes.filter(size => size >= rangeFrom && size <= rangeTo).forEach(size1 => {
  //     //       const branchSize2 = findSize2FromBranchTable(size1, itemType);
  //     //       if (branchSize2) {
  //     //         combined.push({
  //     //           itemType,
  //     //           fittingType,
  //     //           size1,
  //     //           size2: parseFloat(branchSize2),
  //     //           geometricStandard: row[4],
  //     //           edsVds: row[5],
  //     //           endConn: row[6],
  //     //           materialDescr: row[7],
  //     //           mds: row[8],
  //     //           rating: row[9],
  //     //           schd: row[10],
  //     //           notes: row[11]
  //     //         });
  //     //       }
  //     //     });
  //     //   } else if (fittingType && fittingType.toLowerCase().includes('reduce')) {
  //     //     const halfRangeFrom = rangeTo / 2;
  //     //     const size2Start = sizes.filter(size => size < halfRangeFrom).pop() || sizes[0];
  //     //     const size2Range = sizes.filter(size => size >= size2Start && size <= rangeTo);

  //     //     sizes.filter(size => size >= rangeFrom && size <= rangeTo).forEach(size1 => {
  //     //       size2Range.forEach(size2 => {
  //     //         combined.push({
  //     //           itemType,
  //     //           fittingType,
  //     //           size1,
  //     //           size2,
  //     //           geometricStandard: row[4],
  //     //           edsVds: row[5],
  //     //           endConn: row[6],
  //     //           materialDescr: row[7],
  //     //           mds: row[8],
  //     //           rating: row[9],
  //     //           schd: row[10],
  //     //           notes: row[11]
  //     //         });
  //     //       });
  //     //     });
  //     //   } else {
  //     //     sizes.filter(size => size >= rangeFrom && size <= rangeTo).forEach(size => {
  //     //       combined.push({
  //     //         itemType,
  //     //         fittingType,
  //     //         size1: size,
  //     //         size2: size,
  //     //         geometricStandard: row[4],
  //     //         edsVds: row[5],
  //     //         endConn: row[6],
  //     //         materialDescr: row[7],
  //     //         mds: row[8],
  //     //         rating: row[9],
  //     //         schd: row[10],
  //     //         notes: row[11]
  //     //       });
  //     //     });
  //     //   }
  //     // });

  //     // setCombinedData(combined);

  //     // try {
  //     //   const response = await window.api.send('import-excel', result);
  //     //   setMessage(response);
  //     // } catch (error) {
  //     //   setMessage('Error importing data: ' + error.message);
  //     // }
  //   };
  //   reader.readAsArrayBuffer(file);
  // };
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
            const cellAddress = { c: C, r: R };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            const cell = worksheet[cellRef];
            row.push(cell ? cell.v : undefined);
          }
          sheetData.push(row);
        }
        result[sheet] = sheetData;
      });
      console.log(result);
      setSheetData(result);

      // Create combined table
      const materialsSheet = result['materials'] || [];
      const sizeSheet = result['size'] || [];
      console.log(materialsSheet);
      console.log(sizeSheet);


      const combined = [];

      // Process size sheet
      const ndInchRow = sizeSheet.find(row => row[0] === 'ND (inch)');
      const sizes = ndInchRow ? ndInchRow.slice(1).map(Number).sort((a, b) => a - b) : [];
      console.log(ndInchRow);
      console.log(sizes);


      materialsSheet.slice(3).forEach(row => {
        const itemType = row[0];
        const fittingType = row[1];
        const rangeFrom = parseFloat(row[2]);
        const rangeTo = parseFloat(row[3]);

        if (fittingType && (fittingType.toLowerCase().includes('branch'))) {
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
          console.log("halfRangeFrom", halfRangeFrom)
          const size2Start = sizes.filter(size => size < halfRangeFrom).pop() || sizes[0];
          console.log("size2Start", size2Start)
          const size2Range = sizes.filter(size => size >= size2Start && size <= rangeTo);
          console.log("size2Range", size2Range)

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

      // setCombinedData(combined);
      // result['materials'] = combined;  // Replace materials data with combined data
      result['specfinal'] = combined;
      result['SpecDetails'] = formData
      console.log("Modified result:", result);
      try {
        const response = await window.api.send('import-excel', result);
        setMessage(response);
      } catch (error) {
        setMessage('Error importing data: ' + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };
  const findSize2FromBranchTable = (size1, itemType) => {
    return branchTableDataDetails[itemType]?.[size1] || null;
  };

  const handleBranchNameChange = (e) => {
    setBranchName(e.target.value);
  };

  return (
    <div style={{ zIndex: '1', position: 'absolute', width: '100%', backgroundColor: '#33334c' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div id="bulkImportDiv">
          <div className="page">
            <section className="page-section">
              <div className="row">
                <h4>Create Material Spec</h4>
              </div>
            </section>
            <hr />
            <section className="page-section">
              <div className="row">
                <div className="col-md-6">
                  <div className="dialog-input" style={{ fontSize: '13px', lineHeight: '30px' }}>
                    <label>Document number</label>
                    <input type="text" name='Documentnumber' value={formData.Documentnumber} onChange={handleChange} />
                    <label>Spec name</label>
                    <input type="text" name='specName' value={formData.specName} onChange={handleChange} />
                    <label>Revision</label>
                    <input type="text" name='Revision' value={formData.Revision} onChange={handleChange} />
                    <label>Revision date</label>
                    <input type="text" name='RevisionDate' value={formData.RevisionDate} onChange={handleChange} />
                    <label>Choose Branch table</label>
                    <input
                      list="branchTableOptions"
                      name='branchTable'
                      value={formData.branchTable}
                      onChange={handleChange}
                      placeholder="Select or type branch name"
                    />
                    <datalist id="branchTableOptions">
                      {branchTableDetails.map((branch, index) => (
                        <option key={index} value={branch.branchtableName} />
                      ))}
                    </datalist>
                    <label>Type</label>
                    <input type="text" name='type' value={formData.type} onChange={handleChange} />
                    <label>Choose spec excel file</label>
                    <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
                    <a href="#">Download sample excel template</a>
                  </div>
                </div>
              </div>
              <hr />
              <div className="d-flex">
                <button className="btn btn-light" style={{ fontSize: '12px' }} onClick={handleSubmit}>
                  Submit
                </button>
                <button className="btn btn-light ms-5" style={{ fontSize: '12px' }}>
                  Cancel
                </button>
              </div>
              {message && <p>{message}</p>}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecTableManagement;
