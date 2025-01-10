// import React from 'react'

// function AreaSelect({allAreasInTable}) {
//     const handleClose = () => {
//         setCode('');
//         setName('');
//         onClose();
//       };
//     return (
//         <div>
//             <Modal
//                 onHide={handleClose}
//                 show={showAreaDialog}
//                 backdrop="static"
//                 keyboard={false}
//                 dialogClassName="custom-modal"
//             >
//                 <div className="area-dialog">
//                     <div className="title-dialog">
//                         <p className='text-light'>Select Area</p>
//                         <p className='text-light cross' onClick={handleClose}>&times;</p>
//                     </div>
//                     <div className="dialog-input">
//                         <label>Code *</label>
//                         <select
//                             ref={codeInputRef}
//                             value={code}
//                             onChange={handleCodeChange}
//                         >
//                             <option value="">Select Code</option>
//                             {allAreasInTable.map((area) => (
//                                 <option key={area.areaId} value={area.area}>
//                                     {area.area}- {area.name}
//                                 </option>
//                             ))}
//                         </select>
//                         <label>Name</label>
//                         <select
//                             value={name}
//                             onChange={handleNameChange}
//                         >
//                             <option value="">Select Name</option>
//                             {allAreasInTable.map((area) => (
//                                 <option key={area.areaId} value={area.name}>
//                                     {area.name}-{area.area}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <div className='dialog-button' style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
//                         <button className='btn btn-secondary' onClick={handleClose}>Cancel</button>
//                         <button className='btn btn-dark' onClick={handleOk}>Ok</button>
//                     </div>
//                 </div>
//             </Modal>
//         </div>
//     )
// }

// export default AreaSelect

import React, { useEffect, useRef, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
function AreaSelect({ allAreasInTable, onClose, showAreaDialog, selectedTag, selectedTagNo }) {
    // , showAreaDialog
    // , selectedTag, selectedTagNo
    const areaInputRef = useRef(null);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const handleClose = () => {
        setCode('');
        setName('');
        onClose();
    };
    useEffect(() => {
        console.log(code);
    }, [code])
    const handleCodeChange = (e) => {
        console.log(e.target.value);
        const selectedCode = e.target.value;
        
        setCode(selectedCode);
        const selectedArea = allAreasInTable.find((area) => area.mtoareaId === selectedCode);
        if (selectedArea) {
            console.log(selectedArea.name);
            setName(selectedArea.name);
            
        } else {
            console.log(selectedArea.name);
            setName('');
        }
    };

    const handleOk = async () => {
    
        if (!code) {
        //   setCustomAlert(true);
        //   setModalMessage("Area is not select");
          return;
        } else {
          const data = {
            mtoareaId: code,
            areaname: name,
            mtotagId: selectedTag,
            tagnumber: selectedTagNo
    
          };
          console.log(data);
          
          window.api.send('save-mtoline-area', data);
          handleClose();
          
        }
    };

    return (
        <div>
            <Modal
                onHide={handleClose}
                show={showAreaDialog}
                backdrop="static"
                keyboard={false}
                dialogClassName="custom-modal"
            >
                <div className="area-dialog">
                    <div className="title-dialog">
                        <p className='text-light'>Select Area</p>
                        <p className='text-light cross' onClick={handleClose}>&times;</p>
                    </div>
                    <div className="dialog-input pt-5">
                        {/* <label>Code *</label> */}
                        <select
                            ref={areaInputRef}
                            value={code}
                            onChange={handleCodeChange}
                        >
                            <option value="">Select Area</option>
                            {allAreasInTable.map((area) => (
                                <option key={area.mtoareaId} value={area.mtoareaId}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                        {/* <label>Name</label>
                        <select
                            // value={name}
                            // onChange={handleNameChange}
                        >
                            <option value="">Select Name</option>
                            {allAreasInTable.map((area) => (
                                <option key={area.areaId} value={area.name}>
                                    {area.name}-{area.area}
                                </option>
                            ))}
                        </select> */}
                    </div>
                    <div className='dialog-button' style={{ display: 'flex', justifyContent: 'flex-end', gap: '2px' }}>
                        {/* <button className='btn btn-secondary' onClick={handleClose}>Cancel</button> */}
                        <button className='btn btn-dark' onClick={handleOk}>Ok</button>
                        {/* onClick={handleOk} */}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AreaSelect