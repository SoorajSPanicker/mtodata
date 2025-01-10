import React, { useEffect, useState } from 'react'
import AreaSelect from './AreaSelect';


function CreateMaterialList({ mtolinelist, mtoarea, mtolinearea }) {
    const [selectarea, setselectarea] = useState(false)
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedTagNo, setSelectedTagNo] = useState('');
    const [expandedItems, setExpandedItems] = useState({});
    const handleaddarea = (tagId, tagNo) => {
        console.log(tagId);
        console.log(tagNo);
        setSelectedTag(tagId);
        setSelectedTagNo(tagNo)
        setselectarea(true)
    }
    // Add this function to handle closing the AreaSelect
    const handleAreaSelectClose = () => {
        setselectarea(false);
    };
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
        console.log(selectarea);
    }, [selectarea])
    useEffect(() => {
        console.log(selectedTag);
    }, [selectedTag])
    useEffect(() => {
        console.log(selectedTagNo);
    }, [selectedTagNo])
    // Function to check if tag exists in mtolinearea
    const hasExistingArea = (tag) => {
        return mtolinearea.some(area => area.tagnumber === tag);
    };
    // Function to toggle expanded state for an item
    const toggleExpand = (tag) => {
        setExpandedItems(prev => ({
            ...prev,
            [tag]: !prev[tag]
        }));
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
                    <div className='border border-black my-1 p-2' key={index} style={{
                        display: 'flex', gap: '10px',
                        width: 'fit-content', // This will make the div only as wide as its content
                        paddingRight: '10px', // Add some small padding on the right
                        alignItems: 'center'
                    }}>
                        {/* {hasExistingArea(item.tag) && (
                            <i className="fa-solid fa-angle-right"></i>
                        )} */}
                        {hasExistingArea(item.tag) && (
                            <i
                                className={`fa-solid ${expandedItems[item.tag] ? 'fa-angle-down' : 'fa-angle-right'}`}
                                onClick={() => toggleExpand(item.tag)}
                                style={{ cursor: 'pointer', zIndex: '1' }}
                            ></i>
                        )}
                        <p>Linetag: {item.tag} Spec: {item.pipingSpec}</p>
                        {/* <button style={{zIndex: '10'}} onClick={()=>handleaddarea()}>add</button> */}
                        <i
                            className="fa-solid fa-circle-plus"

                            onClick={() => {
                                console.log('Icon clicked');
                                handleaddarea(item.mtotagId, item.tag);
                            }}
                            style={{ cursor: 'pointer', zIndex: '1' }}  // Add this to show it's clickable
                        ></i>
                        {/* <button onClick={() => handleaddarea(item.mtotagId, item.tag)}>Add Area</button> */}
                        {/* <i className="fa-solid fa-circle-plus " onClick={() => handleaddarea(item.mtotagId, item.tag)}></i> */}
                    </div>
                ))}


            </div>
            {selectarea && <AreaSelect allAreasInTable={mtoarea} onClose={handleAreaSelectClose} showAreaDialog={selectarea} selectedTag={selectedTag} selectedTagNo={selectedTagNo} />}
        </div>
    )
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