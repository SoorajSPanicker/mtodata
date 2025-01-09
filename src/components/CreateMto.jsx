import React, { useEffect, useState } from 'react'
import Alert from './Alert';
import AreaSelect from './AreaSelect';

function CreateMto({ allLineList }) {
    const [buttonState, setButtonState] = useState(false);
    const [customAlert, setCustomAlert] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [selectarea, setselectarea] = useState(false)
    const [formData, setFormData] = useState({
        ProjID: '',
        M_DocNo: '',
        M_DocName: '',
        RevNo: '',
        RevDate: '',
        RevDes: '',
        RevPreBy: '',
        RevChecBy: '',
        RevAppBy: '',
        RevPrepDate: '',
        RevCheckDate: '',
        RevAppDate: '',
        ChecklistNo: '',
        MtoSta: '',
        Preocur: ''
    });
    useEffect(() => {
        console.log(allLineList);

    }, [allLineList])
    // Handle form data change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleareaselect = () => {
        setselectarea(true);
    }

    // const handleSubmit = () => {
    //     const { ProjID, M_DocNo, M_DocName, RevNo, RevDate, RevDes, RevPreBy, RevChecBy, RevAppBy, RevPrepDate, RevCheckDate, RevAppDate, ChecklistNo, MtoSta, Preocur } = formData;

    //     if (!ProjID || !M_DocNo || !M_DocName || !RevNo || !RevDate || !RevDes || !RevPreBy || !RevChecBy || !RevAppBy || !RevPrepDate || !RevCheckDate || !RevAppDate || !ChecklistNo || !MtoSta || !Preocur) {
    //         setModalMessage('Please fill in all fields and upload an Excel file.');
    //         setCustomAlert(true);
    //         return;
    //     }

    //     const tableData = { ProjID, M_DocNo, M_DocName, RevNo, RevDate, RevDes, RevPreBy, RevChecBy, RevAppBy, RevPrepDate, RevCheckDate, RevAppDate, ChecklistNo, MtoSta, Preocur };

    //     window.api.send("Mto-doc-save", tableData);

    //     // Clear form and file input fields after submission
    //     setFormData({
    //         ProjID: '',
    //         M_DocNo: '',
    //         M_DocName: '',
    //         RevNo: '',
    //         RevDate: '',
    //         RevDes: '',
    //         RevPreBy: '',
    //         RevChecBy: '',
    //         RevAppBy: '',
    //         RevPrepDate: '',
    //         RevCheckDate: '',
    //         RevAppDate: '',
    //         ChecklistNo: '',
    //         MtoSta: '',
    //         Preocur: ''
    //     });
    //     // setExcelData([]);
    //     // if (fileInputRef.current) {
    //     //     fileInputRef.current.value = null; // Clear file input
    //     // }
    //     setModalMessage('Successfully added MTO Document table.');
    //     setCustomAlert(true);
    // };

    const handleuserdata = (e) => {
        e.preventDefault();
        window.api.send('Mto-area-save');
        window.api.send('Mto-tag-save');
    }

    const handleSubmit = (e) => {
        // Prevent the default form submission
        e.preventDefault();

        const { ProjID, M_DocNo, M_DocName, RevNo, RevDate, RevDes, RevPreBy, RevChecBy, RevAppBy, RevPrepDate, RevCheckDate, RevAppDate, ChecklistNo, MtoSta, Preocur } = formData;

        if (!ProjID || !M_DocNo || !M_DocName || !RevNo || !RevDate || !RevDes || !RevPreBy || !RevChecBy || !RevAppBy || !RevPrepDate || !RevCheckDate || !RevAppDate || !ChecklistNo || !MtoSta || !Preocur) {
            setModalMessage('Please fill in all fields and upload an Excel file.');
            setCustomAlert(true);
            return;
        }

        const tableData = { ProjID, M_DocNo, M_DocName, RevNo, RevDate, RevDes, RevPreBy, RevChecBy, RevAppBy, RevPrepDate, RevCheckDate, RevAppDate, ChecklistNo, MtoSta, Preocur };

        window.api.send("Mto-doc-save", tableData);

        // Clear form and file input fields after submission
        setFormData({
            ProjID: '',
            M_DocNo: '',
            M_DocName: '',
            RevNo: '',
            RevDate: '',
            RevDes: '',
            RevPreBy: '',
            RevChecBy: '',
            RevAppBy: '',
            RevPrepDate: '',
            RevCheckDate: '',
            RevAppDate: '',
            ChecklistNo: '',
            MtoSta: '',
            Preocur: ''
        });

        setModalMessage('Successfully added MTO Document table.');
        setCustomAlert(true);
    };

    return (
        <div style={{ zIndex: '1', position: 'absolute', width: '100%', backgroundColor: '#33334c', color: 'white' }}>
            <div id="mtoDiv" class="sideLnkDiv">
                <div id="mtoRegDiv" class="tabContentR mtoTab" >
                    <form onSubmit={handleSubmit}>
                        <div class="tabContentHead" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                            <h1 style={{ color: 'white', paddingLeft: '20px' }} >Create MTO</h1>
                            <div style={{ padding: '10px', flex: '1', textAlign: 'right' }} >
                                {/* {
                                    buttonState ? <button className='btn btn-secondary'>Save</button> : <button className='btn btn-secondary'>Back to list</button>
                                } */}
                                <button type="submit" className='btn btn-secondary' >Save</button>
                            </div>
                        </div>
                        <hr style={{ marginTop: '-10px' }} />
                        <div class="pageFit" style={{ padding: '20px', height: '80vh', overflowY: 'auto' }}>
                            <section class="page-section" style={{ borderBottom: '0px', display: 'flex' }} >
                                <div className="form-group">
                                    <label for="mtoPId">Project ID *</label>
                                    <br />
                                    <input type="text" id="mtoPId" name='ProjID' required="" value={formData.ProjID} onChange={handleChange} />
                                </div>
                                <div className="form-group ms-3">
                                    <label for="mtoDocNo">Document NO*</label>
                                    <br />
                                    <input type="text" id="mtoDocNo" name='M_DocNo' required="" value={formData.M_DocNo} onChange={handleChange} />
                                </div>
                                <div className="form-group ms-3 me-3">
                                    <label for="mtoDocNo">Document Name*</label>
                                    <br />
                                    <input type="text" id="mtoDocName" name='M_DocName' required="" value={formData.M_DocName} onChange={handleChange} />
                                </div>
                            </section>
                            <section class="page-section" style={{ borderBottom: '0px', display: 'flex' }} >
                                <div className="form-group">
                                    <label for="checklistno">Check List No *</label>
                                    <br />
                                    <input type="text" id="checklistno" name='ChecklistNo' required="" value={formData.ChecklistNo} onChange={handleChange} />
                                </div>
                                <div className="form-group ms-3">
                                    <label for="MtoStatus">MTO Status*</label>
                                    <br />
                                    <input type="text" id="MtoStatus" name='MtoSta' required="" value={formData.MtoSta} onChange={handleChange} />
                                </div>
                                <div className="form-group ms-3 me-3">
                                    <label for="ProStatus">Procurement Status*</label>
                                    <br />
                                    <input type="text" id="ProStatus" name='Preocur' required="" value={formData.Preocur} onChange={handleChange} />
                                </div>
                            </section>

                            <div class="subHeadBg" style={{ backgroundColor: '#424444', padding: '10px' }}>
                                <label style={{ fontSize: '20px' }} >Revision</label>
                            </div>
                            <section style={{ paddingTop: '20px', paddingLeft: '40px', paddingRight: '10px', boxShadow: ' 0 0 2px #e8dede' }} >
                                <div style={{ display: 'flex', marginBottom: '10px' }}>
                                    <div className="form-group">
                                        <label for="mtoRevNo">Rev. No*</label>
                                        <br />
                                        <input type="text" id="mtoRevNo" name='RevNo' required="" value={formData.RevNo} onChange={handleChange} />
                                    </div>
                                    <div className="form-group ms-3">
                                        <label for="mtoRevDate">Rev. Date</label>
                                        <br />
                                        <input type="text" id="mtoRevDate" name='RevDate' required="" value={formData.RevDate} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="w-100" style={{ marginBottom: '10px' }}  >
                                    <label for="mtoRevDesc">Rev.Description</label>
                                    <br />
                                    <textarea type="text" id="mtoRevDesc" name='RevDes' style={{ minWidth: '244px', width: '--webkit-fill-available' }} value={formData.RevDes} onChange={handleChange}></textarea>
                                </div>
                                <div style={{ display: 'flex', paddingBottom: '20px' }}>
                                    <div className="form-group">
                                        <label for="mtoPreparedBy">Rev. Prepared_By*</label>
                                        <br />
                                        <input type="text" id="mtoPreparedBy" name='RevPreBy' value={formData.RevPreBy} onChange={handleChange} />
                                    </div>
                                    <div className="form-group ms-3">
                                        <label for="mtoRevCheckedBy">Rev. Checked_By*</label>
                                        <br />
                                        <input type="text" id="mtoRevCheckedBy" name='RevChecBy' value={formData.RevChecBy} onChange={handleChange} />
                                    </div>
                                    <div className="form-group ms-3">
                                        <label for="mtoRevApprovedBy">Rev. Approved_By*</label>
                                        <br />
                                        <input type="text" id="mtoRevApprovedBy" name='RevAppBy' value={formData.RevAppBy} onChange={handleChange} />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', paddingBottom: '20px' }}>
                                    <div className="form-group">
                                        <label for="mtoPreparedDate">Rev. Prepared_Date*</label>
                                        <br />
                                        <input type="date" id="mtoPreparedDate" name='RevPrepDate' value={formData.RevPrepDate} onChange={handleChange} />
                                    </div>
                                    <div className="form-group ms-3">
                                        <label for="mtoRevCheckedDate">Rev. Checked_Date*</label>
                                        <br />
                                        <input type="date" id="mtoRevCheckedDate" name='RevCheckDate' value={formData.RevCheckDate} onChange={handleChange} />
                                    </div>
                                    <div className="form-group ms-3">
                                        <label for="mtoRevApprovedDate">Rev. Approved_Date*</label>
                                        <br />
                                        <input type="date" id="mtoRevApprovedDate" name='RevAppDate' value={formData.RevAppDate} onChange={handleChange} />
                                    </div>
                                </div>


                            </section>

                            <div style={{ padding: '20px' }}>
                                <button className='btn btn-secondary' onClick={handleuserdata}>Add User Data</button>
                            </div>
{/* 
                            <div class="row" style={{ padding: '10px' }} >
                                <i class="fa fa-list-alt" style={{ fontSize: '20px' }}  ></i>
                                <h2 style={{ display: 'inline-block' }}>Add Items</h2>
                            </div> */}

                            {/* <ul>
                                {allLineList.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <li style={{ listStyle: 'none' }}>{item.tag}</li>
                                        <i className="fa-solid fa-circle-plus" onClick={handleareaselect}></i>
                                    </div>
                                ))}
                            </ul>
                            {selectarea && <AreaSelect allAreasInTable = {allAreasInTable}></AreaSelect>} */}

                            {/* <ul>
                                {allLineList.map((item, index) => (
                                    <div>
                                        <li key={index}>{item.tag}</li>
                                        <i class="fa-solid fa-circle-plus"></i>
                                    </div>

                                ))}
                            </ul> */}


                            {/* <div class="row" style={{padding:'10px'}} >
                                <i class="fa fa-list-alt" style={{fontSize:'20px'}}  ></i>
                                <h2 style={{display:'inline-block'}}>Add Items</h2>
                            </div>
                            <div class="row" style={{padding:'10px'}} >
                                <i class="fa fa-list-alt" style={{fontSize:'20px'}}  ></i>
                                <h2 style={{display:'inline-block'}}>Add Items</h2>
                            </div>
                            <div class="row" style={{padding:'10px'}} >
                                <i class="fa fa-list-alt" style={{fontSize:'20px'}}  ></i>
                                <h2 style={{display:'inline-block'}}>Add Items</h2>
                            </div>
                            <div class="row" style={{padding:'10px'}} >
                                <i class="fa fa-list-alt" style={{fontSize:'20px'}}  ></i>
                                <h2 style={{display:'inline-block'}}>Add Items</h2>
                            </div>
                            <div class="row" style={{padding:'10px'}} >
                                <i class="fa fa-list-alt" style={{fontSize:'20px'}}  ></i>
                                <h2 style={{display:'inline-block'}}>Add Items</h2>
                            </div> */}
                        </div>
                    </form>

                </div>
            </div>
            {/* {customAlert && (
                <Alert
                    message={modalMessage}
                    onAlertClose={() => setCustomAlert(false)}
                />
            )} */}
        </div>
    )
}

export default CreateMto
