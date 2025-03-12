import React, { useEffect } from 'react'
import { useState } from 'react';
import SisoWorkspace from './SisoWorkspace';


function SisoReview({ isosheets, isofilepath, isolinelist, specmatDetails }) {
    const [editedRowIndex, setEditedRowIndex] = useState(-1);
    const [editedLineData, setEditedLineData] = useState({});
    const [currentDeleteNumber, setCurrentDeleteNumber] = useState(null);
    const [tableshow, settableshow] = useState(true)
    useEffect(() => {
        console.log(isosheets);

    }, [isosheets])
    useEffect(() => {
        console.log(isolinelist);

    }, [isolinelist])
    useEffect(() => {
        console.log(isofilepath);

    }, [isofilepath])
    const handleDeleteLineFromTable = (SisoId) => {
        setCurrentDeleteNumber(SisoId);
        // setShowConfirm(true);
    };

    const handleEditOpen = (index) => {
        setEditedRowIndex(index);
        // setEditedLineData(allLineList[index]);
    };

    const handleCloseEdit = () => {
        setEditedRowIndex(-1);
        setEditedLineData({});
    };

    const handleSave = (SisoId) => {
        // const updatedLineList = [...allLineList];
        updatedLineList[editedRowIndex] = { ...editedLineData, SisoId: SisoId };

        setEditedRowIndex(-1);
        setEditedLineData({});

        // window.api.send("update-linelist-table", editedLineData);
    };

    const handleChange = (field, value) => {
        setEditedLineData({
            ...editedLineData,
            [field]: value
        });
    };

    const handleWorkspace = (number, tag) => {
        window.api.send("file-path-wspace", tag)
        settableshow(false)
    }

    return (
        <div className='p-5' style={{ zIndex: '1', position: 'absolute', height: '100%', width: '100%' }}>
            {Object.keys(isofilepath).length > 0 && <SisoWorkspace isofilepath={isofilepath} isolinelist={isolinelist} specmatDetails={specmatDetails}/>}
            {tableshow && <table>
                <tbody>
                    {isosheets.map((line, index) => (
                        <tr key={index} style={{ color: 'white' }}>
                            <td> {editedRowIndex === index ? (
                                <input
                                    onChange={e => handleChange('sNumber', e.target.value)}
                                    type="text"
                                    value={editedLineData.sNumber || ''}
                                />
                            ) : (
                                <div
                                    onClick={() => handleWorkspace(line.sNumber, line.tag)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {line.sNumber}
                                </div>
                            )}</td>
                            {/* <td>{editedRowIndex === index ? <input onChange={e => handleChange('sNumber', e.target.value)} type="text" value={editedLineData.sNumber || ''} /> : line.sNumber}</td> */}
                            <td>{editedRowIndex === index ? <input onChange={e => handleChange('sName', e.target.value)} type="text" value={editedLineData.sName || ''} /> : line.sName}</td>
                            <td>{editedRowIndex === index ? <input onChange={e => handleChange('sheetNumber', e.target.value)} type="text" value={editedLineData.sheetNumber || ''} /> : line.sheetNumber}</td>
                            <td>{editedRowIndex === index ? <input onChange={e => handleChange('tag', e.target.value)} type="text" value={editedLineData.tag || ''} /> : line.tag}</td>
                            <td style={{ backgroundColor: '#f0f0f0' }}>
                                {editedRowIndex === index ?
                                    <>
                                        <i className="fa-solid fa-floppy-disk text-success" onClick={() => handleSave(line.SisoId)}></i>
                                        <i className="fa-solid fa-xmark ms-3 text-danger" onClick={handleCloseEdit}></i>
                                    </>
                                    :
                                    <>
                                        <i className="fa-solid fa-pencil" onClick={() => handleEditOpen(index)}></i>
                                        <i className="fa-solid fa-trash-can ms-3" onClick={() => handleDeleteLineFromTable(line.SisoId)}></i>
                                    </>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>}

        </div>
    )
}

export default SisoReview