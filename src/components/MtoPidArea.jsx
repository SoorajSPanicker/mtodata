import React, { useEffect, useState } from 'react'
import PidMatAdd from './PidMatAdd';


function MtoPidArea({ allAreasInTable, specmatDetails, selectedRectTagData, sindocid, masterid }) {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [name, setName] = useState('');
    const [areaid, setareaid] = useState('');
    const [matadd, setmatadd] = useState(false);

    useEffect(() => {
        console.log(specmatDetails);

    }, [specmatDetails])

    useEffect(() => {
        console.log(selectedRectTagData);

    }, [selectedRectTagData])

    useEffect(() => {
        console.log(allAreasInTable);

    }, [allAreasInTable])

    useEffect(() => {
        console.log(sindocid);

    }, [sindocid])

    useEffect(() => {
        console.log(masterid);

    }, [masterid])

    const handleMouseDown = (e) => {
        if (isMinimized || isMaximized) return;
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || isMinimized || isMaximized) return;

        const newX = e.clientX - offset.x;
        const newY = e.clientY - offset.y;

        setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMinimize = () => {
        setIsMinimized(true);
        setIsMaximized(false);
    };

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
        setIsMinimized(false);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleNameChange = (e) => {
        const selectedName = e.target.value;
        console.log(selectedName);

        setName(selectedName);
        const selectedArea = allAreasInTable.find((area) => area.name === selectedName);
        if (selectedArea) {
            setareaid(selectedArea.areaId);
        } else {
            setareaid('');
        }
    };

    if (!isVisible) return null;

    const handlematpage = () => {
        setmatadd(true)
        // handleClose();
    }
    return (
        <div
            className="popup"
            style={{
                top: isMaximized ? 0 : position.y,
                left: isMaximized ? 0 : position.x,
                width: isMaximized ? "100vw" : isMinimized ? "200px" : "300px",
                height: isMaximized ? "100vh" : isMinimized ? "50px" : "200px",
                position: "absolute",
                cursor: isDragging ? "grabbing" : "default",
                zIndex: 3,
                color:'black'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="popup-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                {/* <p>Draggable Popup</p> */}
                <p>Area Select</p>
                <div className="popup-controls">
                    <button onClick={handleMinimize}>_</button>
                    <button onClick={handleMaximize}>{isMaximized ? "❐" : "□"}</button>
                    <button onClick={handleClose}>×</button>
                </div>
            </div>
            {!isMinimized && (
                <div className="popup-content">
                    {/* <p>This is a draggable popup window with minimize, maximize, and close buttons.</p> */}
                    <label>Select Area:- </label>
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
            )}
            <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
                <button type='submit' onClick={handlematpage}>Next</button>

            </div>
            {matadd && <PidMatAdd name={name} areaid={areaid} specmatDetails={specmatDetails} sindocid={sindocid} masterid={masterid} selectedRectTagData={selectedRectTagData}/>}
            {/* onClose={handleclose} */}
        </div>

    );
};

export default MtoPidArea