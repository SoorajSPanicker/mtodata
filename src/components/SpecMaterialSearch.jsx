import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';

function SpecMaterialSearch({ specmatDetails, onClose, selectedSpec }) {
    const [materialval, setmaterialval] = useState('')
    const [sizeoneval, setsizeoneval] = useState('')
    const [sizetwoval, setsizetwoval] = useState('')
    const handleclose = () => {
        onClose();
    };

    // Get unique items from specmatDetails using lodash
    const uniqueItems = useMemo(() => {
        return _.uniqBy(specmatDetails, 'itemType')
            .map(detail => detail.itemType)
            .filter(item => item); // Remove any null/undefined values
    }, [specmatDetails]);

    useEffect(() => {
        console.log('Unique items:', uniqueItems);
    }, [uniqueItems]);

    const handleChange = (e) => {
        console.log(e.target.value);

        // const selectedCode = e.target.value;

        // setCode(selectedCode);
        // const selectedArea = allAreasInTable.find((area) => area.mtoareaId === selectedCode);
        // if (selectedArea) {
        //     console.log(selectedArea.name);
        //     setName(selectedArea.name);

        // } else {
        //     console.log(selectedArea.name);
        //     setName('');
        // }
    };

    const handlesizeone = (e) => {
        console.log(e.target.value);
        setsizeoneval(e.target.value)
    }

    const handlesizetwo = (e) => {
        console.log(e.target.value);
        setsizetwoval(e.target.value)
    }

    const handlematerialselect = (e) => {
        console.log(e.target.value);
        setmaterialval(e.target.value)
    }
    useEffect(() => {
        console.log(materialval);

    }, [materialval])
    useEffect(() => {
        console.log(sizeoneval);

    }, [sizeoneval])
    useEffect(() => {
        console.log(sizetwoval);

    }, [sizetwoval])



    const handlesearch = (e) => {


    }

    return (
        <div style={{ backgroundColor: 'red' }}>
            <div id="mtoItemAddDiv" className="popup-screen">
                <div className="popup-bg"></div>
                <div className="popup-window">
                    <div className="subHeadBg popup">
                        <i className="fa fa-times close" onClick={handleclose}></i>
                        <div style={{ margin: '10px' }}>
                            <label>SPEC : {selectedSpec}</label>
                        </div>
                        <div className="input-section">
                            <select style={{ width: '189px' }} onChange={handleChange} required>
                                <option value="">Select Area</option>
                                <option>STANDARD</option>
                                <option>NORSOK</option>
                                <option>EQUINOR</option>
                            </select>

                            <input
                                list="items"
                                type="tel"
                                id="item"
                                placeholder="Search Item.."
                                onChange={handlematerialselect}
                            />
                            <span className="fg-space"></span>
                            <datalist id="items">
                                {uniqueItems.map((item, index) => (
                                    <option key={index} value={item} />
                                ))}
                            </datalist>

                            <input
                                id="size1"
                                type="text"
                                placeholder="Size1"
                                style={{ width: '50px', textAlign: 'center' }}
                                onChange={handlesizeone}
                            />
                            <span className="fg-space"></span>
                            <input
                                id="size2"
                                type="text"
                                placeholder="Size2"
                                style={{ width: '50px' }}
                                onChange={handlesizetwo}
                            />
                            <span className="fg-space"></span>
                            <button type="button" id="addMtoItem">
                                <i className="fa fa-search" aria-hidden="true" onClick={handlesearch}></i>
                            </button>
                        </div>
                         <div id="specSearchResultDiv">
                            <div className="mtoItemSearchListDiv">
                                <label style={{ flex: 2, paddingRight: '5px' }}></label>
                                <label style={{ flex: 1, paddingRight: '5px' }}></label>
                                <label style={{ flex: 1, paddingRight: '5px' }}></label>
                                <label style={{ flex: 1, paddingRight: '5px' }}></label>
                                <label style={{ flex: 3, paddingRight: '5px' }}></label>
                                <div style={{ width: '100px', display: 'flex' }}>
                                    <input placeholder="Qty" type="text" />
                                    <i className="fa fa-plus-square"></i>
                                </div>
                            </div>
                        </div>
                        {/* <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                            <textarea
                                placeholder="Set description"
                                style={{ width: '100%' }}
                            />
                            <button type="button">Save to spec</button>
                        </div>
                        <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                            <button type="button">Clear Result</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecMaterialSearch;

// import React, { useEffect } from 'react';
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';

// function SpecMaterialSearch({ specmatDetails, onClose, selectedSpec }) {  // Fixed props destructuring
//     const handleclose = () => {
//         onClose();
//     };
//     useEffect(() => {
//         console.log(specmatDetails);

//     }, [specmatDetails])
//     useEffect(() => {
//         console.log(selectedSpec);

//     }, [selectedSpec])

//     return (
//         <div style={{ backgroundColor: 'red' }}>
//             <div id="mtoItemAddDiv" className="popup-screen">
//                 <div className="popup-bg"></div>
//                 <div className="popup-window">
//                     <div className="subHeadBg popup">
//                         <i className="fa fa-times close" onClick={handleclose}></i>
//                         <div style={{ margin: '10px' }}>
//                             <label>SPEC : </label>
//                         </div>
//                         <div className="input-section">
//                             <select style={{ width: '189px' }} required>
//                                 <option value="">Select Area</option>
//                                 <option >STANDARD</option>
//                                 <option >NORSOK</option>
//                                 <option >EQUINOR</option>
//                             </select>


//                             <input
//                                 list="items"
//                                 type="tel"
//                                 id="item"
//                                 placeholder="Search Item.."
//                             />
//                             <span className="fg-space"></span>
//                             <datalist id="items">
//                                 <option value=""></option>
//                             </datalist>
//                             <input
//                                 id="size1"
//                                 type="text"
//                                 placeholder="Size1"
//                                 style={{ width: '50px', textAlign: 'center' }}
//                             />
//                             <span className="fg-space"></span>
//                             <input
//                                 id="size2"
//                                 type="text"
//                                 placeholder="Size2"
//                                 style={{ width: '50px' }}
//                             />
//                             <span className="fg-space"></span>
//                             <button type="button" id="addMtoItem">
//                                 <i className="fa fa-search" aria-hidden="true"></i>
//                             </button>
//                         </div>
//                         {/* <div id="specSearchResultDiv">
//                             <div className="mtoItemSearchListDiv">
//                                 <label style={{ flex: 2, paddingRight: '5px' }}></label>
//                                 <label style={{ flex: 1, paddingRight: '5px' }}></label>
//                                 <label style={{ flex: 1, paddingRight: '5px' }}></label>
//                                 <label style={{ flex: 1, paddingRight: '5px' }}></label>
//                                 <label style={{ flex: 3, paddingRight: '5px' }}></label>
//                                 <div style={{ width: '100px', display: 'flex' }}>
//                                     <input placeholder="Qty" type="text" />
//                                     <i className="fa fa-plus-square"></i>
//                                 </div>
//                             </div>
//                         </div>
//                         <div style={{ marginLeft: '10px', marginRight: '10px' }}>
//                             <textarea
//                                 placeholder="Set description"
//                                 style={{ width: '100%' }}
//                             />
//                             <button type="button">Save to spec</button>
//                         </div>
//                         <div style={{ marginLeft: '10px', marginRight: '10px' }}>
//                             <button type="button">Clear Result</button>
//                         </div> */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SpecMaterialSearch;

// import React, { useEffect } from 'react';
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';

// function SpecMaterialSearch({ specmatDetails, onClose, selectedSpec }) {
//     const handleclose = () => {
//         onClose();
//     };

//     useEffect(() => {
//         console.log('SpecMaterialSearch specmatDetails:', specmatDetails);
//     }, [specmatDetails]);

//     useEffect(() => {
//         console.log('SpecMaterialSearch selectedSpec:', selectedSpec);
//     }, [selectedSpec]);

//     return (
//         <div
//             style={{
//                 position: 'fixed',
//                 top: 0,
//                 left: 0,
//                 width: '100%',
//                 height: '100%',
//                 zIndex: 1000,
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center'
//             }}
//         >
//             <div
//                 className="popup-window"
//                 style={{
//                     backgroundColor: 'white',
//                     padding: '20px',
//                     borderRadius: '8px',
//                     minWidth: '500px',
//                     maxWidth: '80%',
//                     maxHeight: '80vh',
//                     overflowY: 'auto'
//                 }}
//             >
//                 <div className="subHeadBg popup">
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                         <h3>Material Search</h3>
//                         <i
//                             className="fa fa-times"
//                             onClick={handleclose}
//                             style={{ cursor: 'pointer' }}
//                         ></i>
//                     </div>

//                     <div style={{ margin: '10px' }}>
//                         <label>SPEC: {selectedSpec}</label>
//                     </div>

//                     <div className="input-section" style={{ marginBottom: '20px' }}>
//                         <select style={{ width: '189px', marginRight: '10px' }} required>
//                             {/* Add your select options here */}
//                         </select>
//                         <input
//                             list="items"
//                             type="tel"
//                             id="item"
//                             placeholder="Search Item.."
//                             style={{ marginRight: '10px' }}
//                         />
//                         <input
//                             id="size1"
//                             type="text"
//                             placeholder="Size1"
//                             style={{ width: '50px', textAlign: 'center', marginRight: '10px' }}
//                         />
//                         <input
//                             id="size2"
//                             type="text"
//                             placeholder="Size2"
//                             style={{ width: '50px', marginRight: '10px' }}
//                         />
//                         <button
//                             type="button"
//                             id="addMtoItem"
//                             style={{
//                                 padding: '5px 10px',
//                                 backgroundColor: '#4A5568',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '4px',
//                                 cursor: 'pointer'
//                             }}
//                         >
//                             <i className="fa fa-search" aria-hidden="true"></i>
//                         </button>
//                     </div>

//                     <div style={{ marginBottom: '20px' }}>
//                         <textarea
//                             placeholder="Set description"
//                             style={{
//                                 width: '100%',
//                                 minHeight: '100px',
//                                 padding: '8px',
//                                 marginBottom: '10px'
//                             }}
//                         />
//                         <div style={{ display: 'flex', gap: '10px' }}>
//                             <button
//                                 type="button"
//                                 style={{
//                                     padding: '8px 16px',
//                                     backgroundColor: '#4A5568',
//                                     color: 'white',
//                                     border: 'none',
//                                     borderRadius: '4px',
//                                     cursor: 'pointer'
//                                 }}
//                             >
//                                 Save to spec
//                             </button>
//                             <button
//                                 type="button"
//                                 style={{
//                                     padding: '8px 16px',
//                                     backgroundColor: '#4A5568',
//                                     color: 'white',
//                                     border: 'none',
//                                     borderRadius: '4px',
//                                     cursor: 'pointer'
//                                 }}
//                             >
//                                 Clear Result
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SpecMaterialSearch;