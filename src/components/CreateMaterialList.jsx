import React, { useEffect, useState } from 'react'
import AreaSelect from './AreaSelect';
import SpecMaterialSearch from './SpecMaterialSearch';


function CreateMaterialList({ mtolinelist, mtoarea, mtolinearea, specmatDetails, matdataarea }) {
    const [selectarea, setselectarea] = useState(false)
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedTagNo, setSelectedTagNo] = useState('');
    const [expandedItems, setExpandedItems] = useState({});
    const [expandedmatItems, setExpandedmatItems] = useState({});
    const [selectspec, setselectspec] = useState(false);
    const [selectedSpec, setSelectedSpec] = useState('');
    const [mttagid, setmttagid] = useState('');
    const [mtareaid, setmtareaid] = useState('');
    const [mttagno, setmttagno] = useState('');
    const [mtareaname, setmtareaname] = useState('');
    const handleaddarea = (tagId, tagNo) => {
        console.log(tagId);
        console.log(tagNo);
        setSelectedTag(tagId);
        setSelectedTagNo(tagNo)
        setselectarea(true)
    }
    const handleaddspec = (specname, tagId, areaId, areaname, tagno) => {
        setSelectedSpec(specname)
        setmttagid(tagId)
        setmtareaid(areaId)
        setmtareaname(areaname)
        setmttagno(tagno)
        setselectspec(true)
    }
    // Add this function to handle closing the AreaSelect
    const handleAreaSelectClose = () => {
        setselectarea(false);
    };
    const handleSpecSelectClose = () => {
        setselectspec(false)
    }
    useEffect(() => {
        console.log(mtolinelist);
    }, [])

    useEffect(() => {
        console.log(mtolinearea);
    }, [])

    useEffect(() => {
        console.log(mtoarea);
    }, [])

    useEffect(() => {
        console.log(specmatDetails);
    }, [])

    useEffect(() => {
        console.log(selectarea);
    }, [selectarea])
    useEffect(() => {
        console.log(selectedTag);
    }, [selectedTag])
    useEffect(() => {
        console.log(selectedTagNo);
    }, [selectedTagNo])

    useEffect(() => {
        console.log(selectedSpec);
    }, [selectedSpec])
    // Function to check if tag exists in mtolinearea
    const hasExistingArea = (tag) => {
        return mtolinearea.some(area => area.tagnumber === tag);
    };

    const hasExistingMat = (areaid) => {
        return matdataarea.some(area => area.areaId === areaid);
    };
    // Function to toggle expanded state for an item
    const toggleExpand = (tag) => {
        setExpandedItems(prev => ({
            ...prev,
            [tag]: !prev[tag]
        }));
    };

    const togglematExpand = (areaId) => {
        setExpandedmatItems(prev => ({
            ...prev,
            [areaId]: !prev[areaId]
        }));
    };

    const handlematdelete = (matId) => {
        console.log('Deleting material with ID:', matId);
        window.api.send('delete-material-data', matId);
    };



    return (
        <div style={{ zIndex: '1', position: 'absolute', width: '100%', backgroundColor: '#33334c', color: 'white' }}>
            <div id="mtoDiv" class="sideLnkDiv">
                <div id="mtoRegDiv" class="tabContentR mtoTab" >
                    {/* <form onSubmit={handleSubmit}> */}
                    <div class="tabContentHead" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                        <h1 style={{ color: 'white', paddingLeft: '20px' }} >Create Material List</h1>
                        {/* <button onClick={()=>handleaddarea()}>add</button> */}
                    </div>
                    <hr style={{ marginTop: '-10px' }} />

                    {/* </form> */}

                </div>
            </div>
            {/* {customAlert && (
                <Alert
                    message={modalMessage}
                    onAlertClose={() => setCustomAlert(false)}
                />
            )} */}
            <div style={{ padding: '100px 60px 80px 60px' }}>
                {mtolinelist.map((item, index) => (
                    <div key={index} className="mb-2">
                        <div
                            className="border border-black p-2"
                            style={{
                                display: 'flex',
                                gap: '10px',
                                width: 'fit-content',
                                paddingRight: '10px',
                                alignItems: 'center',
                            }}
                        >
                            {hasExistingArea(item.tag) && (
                                <i
                                    className={`fa-solid ${expandedItems[item.tag] ? 'fa-angle-down' : 'fa-angle-right'}`}
                                    onClick={() => toggleExpand(item.tag)}
                                    style={{ cursor: 'pointer', zIndex: '1' }}
                                ></i>
                            )}
                            <p>
                                Linetag: {item.tag} Spec: {item.pipingSpec}
                            </p>
                            <i
                                className="fa-solid fa-circle-plus"
                                onClick={() => {
                                    console.log('Icon clicked');
                                    handleaddarea(item.mtotagId, item.tag);
                                }}
                                style={{ cursor: 'pointer', zIndex: '1' }}
                            ></i>
                        </div>

                        {/* Expanded content in a separate div below */}
                        {expandedItems[item.tag] && (
                            <div style={{
                                marginLeft: '20px',
                                marginTop: '10px',
                                marginBottom: '10px'
                            }}>
                                {mtolinearea
                                    .filter(areaItem => areaItem.tagnumber === item.tag)
                                    .map((areaItem, areaIndex) => (
                                        <div key={areaIndex}>
                                            <div
                                                className="border border-black p-2 mb-2"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    width: 'fit-content'
                                                }}
                                            >
                                                {hasExistingMat(areaItem.mtoareaId) && (
                                                    <i
                                                        className={`fa-solid ${expandedmatItems[areaItem.mtoareaId] ? 'fa-angle-down' : 'fa-angle-right'}`}
                                                        onClick={() => togglematExpand(areaItem.mtoareaId)}
                                                        style={{ cursor: 'pointer', zIndex: '1' }}
                                                    ></i>
                                                )}
                                                <p>Area: {areaItem.areaname}</p>
                                                <i
                                                    className="fa-solid fa-circle-plus"
                                                    onClick={() => {
                                                        console.log('Icon clicked');
                                                        handleaddspec(item.pipingSpec, areaItem.mtotagId, areaItem.mtoareaId, areaItem.areaname, areaItem.tagnumber);
                                                    }}
                                                    style={{ cursor: 'pointer', zIndex: '1' }}
                                                ></i>
                                                <i
                                                    className="fa-solid fa-trash"
                                                    style={{ cursor: 'pointer', zIndex: '1' }}
                                                ></i>
                                            </div>
                                            {expandedmatItems[areaItem.mtoareaId] && (
                                                <div>

                                                    <div style={{ marginLeft: '30px', display: 'flex', minWidth: '800px' }}>
                                                        <label style={{ flex: '2' }}>Item</label>
                                                        <label style={{ flex: '1' }}>Size1</label>
                                                        <label style={{ flex: '1' }}>Size2</label>
                                                        {/* <label style={{ flex: '1' }}>Rating</label>
                                                        <label style={{ flex: '1' }}>Schedule</label>
                                                        <label style={{ flex: '3' }}>Description</label>
                                                        <label style={{ flex: '1' }}>Unit Weight</label>
                                                        <label style={{ flex: '1' }}>Total Weight</label> */}
                                                        {/* <label style={{ width: '50px' }}>Qty</label> */}
                                                        <label style={{ flex: '1' }}>Qty</label>
                                                        <span style={{ width: '55px' }}></span>
                                                    </div>

                                                    <ol>
                                                        {matdataarea.filter(matItem => matItem.tagId === item.mtotagId)
                                                            .map((matItem, matIndex) => (
                                                                <li key={matIndex}>
                                                                    <div style={{ width: 'auto', minWidth: '800px' }} className="tree-node tree-node-content angular-ui-tree-handle">
                                                                        <div style={{ display: 'flex' }}>
                                                                            <label style={{ flex: '2', margin: 'auto' }}>{matItem.Item}</label>
                                                                            <label style={{ flex: '1', margin: 'auto' }}>{matItem.Sizeone}</label>
                                                                            <label style={{ flex: '1', margin: 'auto' }}>{matItem.Sizetwo}</label>
                                                                            <label style={{ flex: '1', margin: 'auto' }}>{matItem.Qty}</label>
                                                                            <span className="fg-space"></span>
                                                                            {/* <a className="btn pull-right"> */}
                                                                                <i
                                                                                    className="fa fa-trash delete-icon"
                                                                                    style={{
                                                                                      
                                                                                        zIndex: '1',
                                                                                        fontSize: '20px'  // Added explicit size
                                                                                    }}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();  // Stop event bubbling
                                                                                        handlematdelete(matItem.MatID);
                                                                                    }}
                                                                                ></i>
                                                                            {/* </a> */}
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                    </ol>
                                                    {/* onClick={handlematdelete(matItem.MatID)} */}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>

                        )}
                    </div>
                ))}
            </div>

            {selectarea && <AreaSelect allAreasInTable={mtoarea} onClose={handleAreaSelectClose} showAreaDialog={selectarea} selectedTag={selectedTag} selectedTagNo={selectedTagNo} />}
            {selectspec && <SpecMaterialSearch specmatDetails={specmatDetails} onClose={handleSpecSelectClose} selectedSpec={selectedSpec} mttagid={mttagid} mtareaid={mtareaid} mttagno={mttagno} mtareaname={mtareaname} />}
        </div >
    );
}

export default CreateMaterialList

// import React, { useEffect, useState } from 'react';
// import AreaSelect from './AreaSelect';

// function CreateMaterialList({ mtolinelist, mtoarea, mtolinearea }) {
//     const [selectarea, setselectarea] = useState(false);
//     const [selectedTag, setSelectedTag] = useState('');
//     const [selectedTagNo, setSelectedTagNo] = useState('');
//     const [expandedItems, setExpandedItems] = useState({}); // Track expanded state for each item

//     const handleaddarea = (tagId, tagNo) => {
//         console.log(tagId);
//         console.log(tagNo);
//         setSelectedTag(tagId);
//         setSelectedTagNo(tagNo);
//         setselectarea(true);
//     };

//     const handleAreaSelectClose = () => {
//         setselectarea(false);
//     };

//     // Function to check if tag exists in mtolinearea
//     const hasExistingArea = (tag) => {
//         return mtolinearea.some(area => area.tagnumber === tag);
//     };

//     // Function to toggle expanded state for an item
//     const toggleExpand = (tag) => {
//         setExpandedItems(prev => ({
//             ...prev,
//             [tag]: !prev[tag]
//         }));
//     };

//     return (
//         <div style={{ zIndex: '1', position: 'absolute', width: '100%', backgroundColor: '#33334c', color: 'white' }}>
//             <div id="mtoDiv" className="sideLnkDiv">
//                 <div id="mtoRegDiv" className="tabContentR mtoTab">
//                     <div className="tabContentHead" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
//                         <h1 style={{ color: 'white', paddingLeft: '20px' }}>Create Material List</h1>
//                     </div>
//                     <hr style={{ marginTop: '-10px' }} />
//                 </div>
//             </div>

//             <div style={{ padding: '100px 60px 80px 60px' }}>
//                 {mtolinelist.map((item, index) => (
//                     <div
//                         className='border border-black my-1 p-2'
//                         key={index}
//                         style={{
//                             display: 'flex',
//                             gap: '10px',
//                             width: 'fit-content',
//                             paddingRight: '10px',
//                             alignItems: 'center'
//                         }}
//                     >
//                         {hasExistingArea(item.tag) && (
//                             <i
//                                 className={`fa-solid ${expandedItems[item.tag] ? 'fa-angle-down' : 'fa-angle-right'}`}
//                                 onClick={() => toggleExpand(item.tag)}
//                                 style={{ cursor: 'pointer', zIndex: '1' }}
//                             ></i>
//                         )}
//                         <p>Linetag: {item.tag} Spec: {item.pipingSpec}</p>
//                         <i
//                             className="fa-solid fa-circle-plus"
//                             onClick={() => {
//                                 console.log('Icon clicked');
//                                 handleaddarea(item.mtotagId, item.tag);
//                             }}
//                             style={{ cursor: 'pointer', zIndex: '1' }}
//                         ></i>

//                         {/* Show expanded content if item is expanded */}
//                         {expandedItems[item.tag] && hasExistingArea(item.tag) && (
//                             <div style={{ marginLeft: '20px' }}>
//                                 {/* You can add the content you want to show when expanded here */}
//                                 {mtolinearea
//                                     .filter(area => area.tagnumber === item.tag)
//                                     .map((area, areaIndex) => (
//                                         <div key={areaIndex}>
//                                             Area ID: {area.mtoareaId}
//                                         </div>
//                                     ))}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             {selectarea && (
//                 <AreaSelect
//                     allAreasInTable={mtoarea}
//                     onClose={handleAreaSelectClose}
//                     showAreaDialog={selectarea}
//                     selectedTag={selectedTag}
//                     selectedTagNo={selectedTagNo}
//                 />
//             )}
//         </div>
//     );
// }

// export default CreateMaterialList;