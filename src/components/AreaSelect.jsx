import React from 'react'

function AreaSelect({allAreasInTable}) {
    const handleClose = () => {
        setCode('');
        setName('');
        onClose();
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
                    <div className="dialog-input">
                        <label>Code *</label>
                        <select
                            ref={codeInputRef}
                            value={code}
                            onChange={handleCodeChange}
                        >
                            <option value="">Select Code</option>
                            {allAreasInTable.map((area) => (
                                <option key={area.areaId} value={area.area}>
                                    {area.area}- {area.name}
                                </option>
                            ))}
                        </select>
                        <label>Name</label>
                        <select
                            value={name}
                            onChange={handleNameChange}
                        >
                            <option value="">Select Name</option>
                            {allAreasInTable.map((area) => (
                                <option key={area.areaId} value={area.name}>
                                    {area.name}-{area.area}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='dialog-button' style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button className='btn btn-secondary' onClick={handleClose}>Cancel</button>
                        <button className='btn btn-dark' onClick={handleOk}>Ok</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default AreaSelect