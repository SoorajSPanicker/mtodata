import React, { useEffect, useState } from 'react'
import DeleteConfirm from './DeleteConfirm';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Alert from './Alert';


function MtoMaterialList({ matdataarea }) {
    const [editedRowIndex, setEditedRowIndex] = useState(-1);
    const [editedLineData, setEditedLineData] = useState({});
    const [currentDeleteNumber, setCurrentDeleteNumber] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [customAlert, setCustomAlert] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        window.api.receive('tag-exists', (data) => {
            console.log(data.message);
            setCustomAlert(true);
            setModalMessage(data.message);
        });
    }, []);

    const handleDeleteLineFromTable = (tagNumber) => {
        setCurrentDeleteNumber(tagNumber);
        setShowConfirm(true);
    };

    const handleEditOpen = (index) => {
        setEditedRowIndex(index);
        setEditedLineData(matdataarea[index]);
    };

    const handleCloseEdit = () => {
        setEditedRowIndex(-1);
        setEditedLineData({});
    };

    const handleSave = (tag) => {
        const updatedLineList = [...matdataarea];
        updatedLineList[editedRowIndex] = { ...editedLineData, tag: tag };

        setEditedRowIndex(-1);
        setEditedLineData({});

        window.api.send("update-matdataarea-table", editedLineData);
    };

    const handleChange = (field, value) => {
        setEditedLineData({
            ...editedLineData,
            [field]: value
        });
    };

    const handleConfirm = () => {
        window.api.send('remove-linelist-table', currentDeleteNumber);
        setShowConfirm(false);
        setCurrentDeleteNumber(null);
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setCurrentDeleteNumber(null);
    };

    const handleImportClick = () => {
        console.log("enter import");
        
        window.api.send('import-mtodataline-list');
    };

    // const handleExport = () => {
    //     const headers = [
    //         'M_Document No', 'File No', 'Document No', 'Tag No', 'Area Name', 'Discipline Name', 'System Name', 'Item Category', 'Item', 'Item Short Description', 'Item Long Description', 'Material Category', 'Material', 'Size 1', 'Size 2', 'Quantity', 'Unit', 'Unit Weight', 'Total Weight', 'Item Position X', 'Item Postion Y', 'Item Position Z', 'MTO Source', 'Unit Weight Ref'
    //     ];

    //     const dataToExport = matdataarea.length > 0 ? matdataarea : [];

    //     const ws = XLSX.utils.json_to_sheet(dataToExport, { header: headers });

    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Material List');

    //     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    //     saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'MtoMaterialList.xlsx');
    // };

    const handleExport = () => {
        // Define headers exactly as your Excel columns should be named
        const headers = [
            'M_Document No', 'File No', 'Document No', 'Tag No', 'Area Name',
            'Discipline Name', 'System Name', 'Item Category', 'Item',
            'Item Short Description', 'Item Long Description', 'Material Category',
            'Material', 'Size 1', 'Size 2', 'Quantity', 'Unit', 'Unit Weight',
            'Total Weight', 'Item Position X', 'Item Position Y', 'Item Position Z',
            'MTO Source', 'Unit Weight Ref'
        ];

        // Map your data to match the header structure
        const dataToExport = matdataarea.map(item => ({
            'M_Document No': item.M_DocNo || '',
            'File No': item.fileNo || '',
            'Document No': item.DocNo || '',
            'Tag No': item.tagNo || '',
            'Area Name': item.areaName || '',
            'Discipline Name': item.DisName || '',
            'System Name': item.SysName || '',
            'Item Category': item.Item_Cat || '',
            'Item': item.Item || '',
            'Item Short Description': item.Item_Sh_Des || '',
            'Item Long Description': item.Item_Lo_Des || '',
            'Material Category': item.Mat_Cat || '',
            'Material': item.Material || '',
            'Size 1': item.Sizeone || '',
            'Size 2': item.Sizetwo || '',
            'Quantity': item.Qty || '',
            'Unit': item.Unit || '',
            'Unit Weight': item.Unit_Weight || '',
            'Total Weight': item.Total_Weight || '',
            'Item Position X': item.ItemPos_X || '',
            'Item Position Y': item.ItemPos_Y || '',
            'Item Position Z': item.ItemPos_Z || '',
            'MTO Source': item.MTO_Source || '',
            'Unit Weight Ref': item.Unit_Weight_Ref || ''
        }));

        // Create worksheet with the mapped data
        const ws = XLSX.utils.json_to_sheet(dataToExport);

        // Set column widths (optional but recommended for better readability)
        const colWidths = headers.map(() => ({ wch: 15 })); // default width of 15 for all columns
        ws['!cols'] = colWidths;

        // Create workbook and append worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Material List');

        // Generate and save file
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'MtoMaterialList.xlsx');
    };
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // const filteredLineList = matdataarea.filter(line =>
    //     line.tag.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    return (
        <div style={{ width: '100%', height: '100vh', backgroundColor: 'white', zIndex: '1', position: 'absolute' }}>
            <form>

                <div className="table-container">
                    <table className="linetable">
                        <thead>
                            <tr>
                                {/* <th className="wideHead">Tag</th>
                                <th className="wideHead">Fluid code</th>
                                <th className="wideHead">Line ID</th> */}
                                <th>Document No</th>
                                <th>File No</th>
                                <th>Doc No</th>
                                <th>Tag</th>
                                <th>Area</th>
                                <th>Disc</th>
                                <th>Sys</th>
                                <th>Item_Cat</th>
                                <th>Item</th>
                                <th>Item_Sh_Des</th>
                                <th>Item_Lo_Des</th>
                                <th>Mat_Cat</th>
                                <th>Material</th>
                                <th>Sizeone</th>
                                <th>Sizetwo</th>
                                <th>Wall Thickness S1</th>
                                <th>Wall Thickness S2</th>
                                <th>Schedule S1</th>
                                <th>Schedule S2</th>
                                <th>Spec Size</th>
                                <th>Length</th>
                                <th>Qty</th>
                                <th>Unit</th>
                                <th>Unit_Weight</th>
                                <th>Total_Weight</th>
                                <th>ItemPos_X</th>
                                <th>ItemPos_Y</th>
                                <th>ItemPos_Z</th>
                                <th>MTO_Source</th>
                                <th>Unit_Weight_Ref</th>

                                <th className="tableActionCell">
                                    <i className="fa fa-upload" title="Export" onClick={handleExport}></i>
                                    <i className="fa fa-download ms-2" title="Import" onClick={handleImportClick}></i>
                                </th>
                            </tr>
                            <tr>
                                <th colSpan="29">
                                    <input
                                        type="text"
                                        placeholder="Search by Tag"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        style={{ width: '100%', padding: '5px' }}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {matdataarea.map((mat, index) => (
                                <tr key={index} style={{ color: 'black' }}>

                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('M_DocNo', e.target.value)} type="text" value={editedLineData.M_DocNo || ''} /> : mat.M_DocNo}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('fileNo', e.target.value)} type="text" value={editedLineData.fileNo || ''} /> : mat.fileNo}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('DocNo', e.target.value)} type="text" value={editedLineData.DocNo || ''} /> : mat.DocNo}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('tagNo', e.target.value)} type="text" value={editedLineData.tagNo || ''} /> : mat.tagNo}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('areaName', e.target.value)} type="text" value={editedLineData.areaName || ''} /> : mat.areaName}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('DisName', e.target.value)} type="text" value={editedLineData.DisName || ''} /> : mat.DisName}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('SysName', e.target.value)} type="text" value={editedLineData.SysName || ''} /> : mat.SysName}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Item_Cat', e.target.value)} type="text" value={editedLineData.Item_Cat || ''} /> : mat.Item_Cat}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Item', e.target.value)} type="text" value={editedLineData.Item || ''} /> : mat.Item}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Item_Sh_Des', e.target.value)} type="text" value={editedLineData.Item_Sh_Des || ''} /> : mat.Item_Sh_Des}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Item_Lo_Des', e.target.value)} type="text" value={editedLineData.Item_Lo_Des || ''} /> : mat.Item_Lo_Des}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Mat_Cat', e.target.value)} type="text" value={editedLineData.Mat_Cat || ''} /> : mat.Mat_Cat}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Material', e.target.value)} type="text" value={editedLineData.Material || ''} /> : mat.Material}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Sizeone', e.target.value)} type="text" value={editedLineData.Sizeone || ''} /> : mat.Sizeone}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Sizetwo', e.target.value)} type="text" value={editedLineData.Sizetwo || ''} /> : mat.Sizetwo}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('thkSizeOne', e.target.value)} type="text" value={editedLineData.thkSizeOne || ''} /> : mat.thkSizeOne}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('thkSizeTwo', e.target.value)} type="text" value={editedLineData.thkSizeTwo || ''} /> : mat.thkSizeTwo}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('schdSizeOne', e.target.value)} type="text" value={editedLineData.schdSizeOne || ''} /> : mat.schdSizeOne}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('schdSizeTwo', e.target.value)} type="text" value={editedLineData.schdSizeTwo || ''} /> : mat.schdSizeTwo}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('SpecSize', e.target.value)} type="text" value={editedLineData.SpecSize || ''} /> : mat.SpecSize}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Length', e.target.value)} type="text" value={editedLineData.Length || ''} /> : mat.Length}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Qty', e.target.value)} type="text" value={editedLineData.Qty || ''} /> : mat.Qty}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Unit', e.target.value)} type="text" value={editedLineData.Unit || ''} /> : mat.Unit}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Unit_Weight', e.target.value)} type="text" value={editedLineData.Unit_Weight || ''} /> : mat.Unit_Weight}</td>

                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Total_Weight', e.target.value)} type="text" value={editedLineData.Total_Weight || ''} /> : mat.Total_Weight}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('ItemPos_X', e.target.value)} type="text" value={editedLineData.ItemPos_X || ''} /> : mat.ItemPos_X}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('ItemPos_Y', e.target.value)} type="text" value={editedLineData.ItemPos_Y || ''} /> : mat.ItemPos_Y}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('ItemPos_Z', e.target.value)} type="text" value={editedLineData.ItemPos_Z || ''} /> : mat.ItemPos_Z}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('MTO_Source', e.target.value)} type="text" value={editedLineData.MTO_Source || ''} /> : mat.MTO_Source}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => handleChange('Unit_Weight_Ref', e.target.value)} type="text" value={editedLineData.Unit_Weight_Ref || ''} /> : mat.Unit_Weight_Ref}</td>

                                    <td style={{ backgroundColor: '#f0f0f0' }}>
                                        {editedRowIndex === index ?
                                            <>
                                                <i className="fa-solid fa-floppy-disk text-success" onClick={() => handleSave(mat.tagId)}></i>
                                                <i className="fa-solid fa-xmark ms-3 text-danger" onClick={handleCloseEdit}></i>
                                            </>
                                            :
                                            <>
                                                <i className="fa-solid fa-pencil" onClick={() => handleEditOpen(index)}></i>
                                                <i className="fa-solid fa-trash-can ms-3" onClick={() => handleDeleteLineFromTable(mat.tagId)}></i>
                                            </>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>
            {customAlert && (
                <Alert
                    message={modalMessage}
                    onAlertClose={() => setCustomAlert(false)}
                />
            )}

            {showConfirm && (
                <DeleteConfirm
                    message="Are you sure you want to delete?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    )
}

export default MtoMaterialList