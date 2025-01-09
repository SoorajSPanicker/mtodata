import React, { useEffect, useState } from 'react'
import AreaSelect from './AreaSelect';


function CreateMaterialList({ mtolinelist, mtoarea }) {
    const [selectarea, setselectarea] = useState(false)
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedTagNo, setSelectedTagNo] = useState('');
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
            <div class="row" style={{ padding: '100px 60px 80px 60px' }}>
                {mtolinelist.map((item, index) => (
                    <div className='border border-black my-1' key={index} style={{ display: 'flex', gap: '10px' }}>
                        <p>Line tag {item.tag} Spec{item.pipingSpec}</p>
                        {/* <button style={{zIndex: '10'}} onClick={()=>handleaddarea()}>add</button> */}
                        <i
                            className="fa-solid fa-circle-plus"
                           
                            onClick={() => {
                                console.log('Icon clicked');
                                handleaddarea(item.mtotagId, item.tag);
                            }}
                            style={{ cursor: 'pointer' ,zIndex: '1'}}  // Add this to show it's clickable
                        ></i>
                        {/* <button onClick={() => handleaddarea(item.mtotagId, item.tag)}>Add Area</button> */}
                        {/* <i className="fa-solid fa-circle-plus " onClick={() => handleaddarea(item.mtotagId, item.tag)}></i> */}
                    </div>
                ))}

                {/* <ul>
                    {mtolinelist.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <li style={{ listStyle: 'none' }}>{item.tag}</li>
                            <i className="fa-solid fa-circle-plus" onClick={() => handleaddarea(item.mtotagId, item.tag)}></i>
                        </div>
                    ))}
                </ul> */}
            </div>
            {selectarea && <AreaSelect allAreasInTable={mtoarea} onClose={handleAreaSelectClose} showAreaDialog={selectarea} selectedTag={selectedTag} selectedTagNo={selectedTagNo} />}
        </div>
        // showAreaDialog={selectarea}
        // <div style={{
        //     position: 'relative',
        //     width: '100%',
        //     backgroundColor: '#33334c',
        //     color: 'white'
        // }}>
        //     <div id="mtoDiv" className="sideLnkDiv">
        //         <div id="mtoRegDiv" className="tabContentR mtoTab">
        //             <div style={{
        //                 display: 'flex',
        //                 justifyContent: 'space-between',
        //                 alignItems: 'center',
        //                 padding: '20px'
        //             }}>
        //                 <h1 style={{ color: 'white', paddingLeft: '20px' }}>
        //                     Create Material List
        //                 </h1>
        //             </div>
        //             <hr style={{ marginTop: '-10px' }} />
        //         </div>
        //     </div>

        //     <div style={{
        //         marginTop: '24px',
        //         padding: '20px'
        //     }}>
        //         {mtolinelist.map((item, index) => (
        //             <div
        //                 key={index}
        //                 style={{
        //                     display: 'flex',
        //                     alignItems: 'center',
        //                     gap: '10px',
        //                     marginBottom: '12px'
        //                 }}
        //             >
        //                 <p>Line tag {item.tag} Spec {item.pipingSpec}</p>
        //                 <button style={{
        //                     padding: '8px 16px',
        //                     backgroundColor: '#4A5568',
        //                     borderRadius: '4px',
        //                     cursor: 'pointer'
        //                 }}>
        //                     Add Area
        //                 </button>
        //             </div>
        //         ))}
        //     </div>
        // </div>
    )
}

export default CreateMaterialList