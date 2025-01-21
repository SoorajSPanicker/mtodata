import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';

function SpecMaterialSearch({ specmatDetails, onClose, selectedSpec, mttagid, mtareaid, mttagno, mtareaname }) {
    const [materialval, setmaterialval] = useState('');
    const [sizeoneval, setsizeoneval] = useState('');
    const [sizetwoval, setsizetwoval] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [mtlqty, setmtlqty] = useState('')
    const handleclose = () => {
        onClose();
    };

    // Get unique items from specmatDetails using lodash
    const uniqueItems = useMemo(() => {
        return _.uniqBy(specmatDetails, 'itemType')
            .map(detail => detail.itemType)
            .filter(item => item);
    }, [specmatDetails]);

    const handleChange = (e) => {
        console.log(e.target.value);
    };

    const handlesizeone = (e) => {
        console.log(e.target.value);
        setsizeoneval(e.target.value);
    };

    const handlesizetwo = (e) => {
        console.log(e.target.value);
        setsizetwoval(e.target.value);
    };

    const handlematerialselect = (e) => {
        console.log(e.target.value);
        setmaterialval(e.target.value);
    };
    useEffect(() => {
        console.log(materialval);
        handlesearch();
    }, [materialval])
    useEffect(() => {
        console.log(sizeoneval);

    }, [sizeoneval])
    useEffect(() => {
        console.log(sizetwoval);

    }, [sizetwoval])
    useEffect(() => {
        console.log(mtlqty);

    }, [mtlqty])

    const handlesearch = () => {
        // Filter specmatDetails based on input values
        const filteredResults = specmatDetails.filter(item =>
            item.itemType === materialval &&
            item.size1.toString() === sizeoneval &&
            item.size2.toString() === sizetwoval
        );

        console.log('Filtered results:', filteredResults);
        setSearchResults(filteredResults);
    };

    const handleqtychange = (e) => {
        console.log(e.target.value);
        setmtlqty(e.target.value)
    }
    useEffect(() => {
        console.log(mtlqty);

    }, [mtlqty])

    const handlematsubmit = (item, sizeone, sizetwo) => {
       console.log(searchResults);
       console.log(searchResults[0].thkSizeOne);
       
        const data = {
            tagId: mttagid,
            tagNo: mttagno,
            areaId: mtareaid,
            areaName: mtareaname,
            Qty: mtlqty,
            Item: materialval,
            Sizeone: sizeoneval,
            Sizetwo: sizetwoval,
            thkSizeOne: searchResults[0].thkSizeOne,
            thkSizeTwo: searchResults[0].thkSizeTwo,
            schdSizeOne: searchResults[0].schdSizeOne,
            schdSizeTwo: searchResults[0].schdSizeTwo
        }
        window.api.send('save-material-data', data);
        handleclose()
    }

    const handleclear = () => {
        setSearchResults([])
    }

    return (
        <div style={{ backgroundColor: 'red' }}>
            <div id="mtoItemAddDiv" className="popup-screen">
                <div className="popup-bg"></div>
                <div className="popup-window">
                    <div className="subHeadBg popup">
                        <i className="fa fa-times close" onClick={handleclose}></i>
                        <div style={{ margin: '10px', color: 'black' }}>
                            <label>SPEC : {selectedSpec}</label>
                        </div>
                        <div className="input-section">
                            {/* <select style={{ width: '189px' }} onChange={handleChange} required>
                                <option value="">Select Area</option>
                                <option>STANDARD</option>
                                <option>NORSOK</option>
                                <option>EQUINOR</option>
                            </select> */}


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
                            <span className="fg-space"></span>
                            <input placeholder="Qty" type="text" style={{ width: '50px' }} onChange={handleqtychange} />

                            <i className="fa fa-plus-square mx-3" style={{ color: 'blue' }} onClick={handlematsubmit}></i>

                            {/* <button type="button" id="addMtoItem">
                                <i className="fa fa-search"  onClick={handlesearch}></i>
                            </button> */}
                        </div>
                        <div id="specSearchResultDiv">
                            {searchResults.map((result, index) => (
                                <div key={index} className="mtoItemSearchListDiv">
                                    <label style={{ flex: 2, paddingRight: '5px', color: 'black' }}>`{result.materialLgDescrip}, {result.thkSizeOne}, {result.thkSizeTwo}, {result.schdSizeOne}, {result.schdSizeTwo} `</label>
                                    {/* <label style={{ flex: 1, paddingRight: '5px', color: 'black' }}>{result.size1}</label>
                                    <label style={{ flex: 1, paddingRight: '5px', color: 'black' }}>{result.size2}</label> */}
                                    {/* <label style={{ flex: 1, paddingRight: '5px' }}>{result.UNIT || ''}</label>
                                    <label style={{ flex: 3, paddingRight: '5px' }}>{result.DESCRIPTION || ''}</label> */}

                                </div>
                            ))}
                        </div>
                        <div style={{ marginLeft: '10px', marginRight: '10px' }} >
                            <button type="button" onClick={handleclear}>Clear Result</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecMaterialSearch;

// import React, { useEffect, useMemo, useState } from 'react';
// import _ from 'lodash';

// function SpecMaterialSearch({ specmatDetails, onClose, selectedSpec }) {
//     const [materialval, setmaterialval] = useState('');
//     const [sizeoneval, setsizeoneval] = useState('');
//     const [sizetwoval, setsizetwoval] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [searchtab, setsearchtab] = useState(false)

//     const handleclose = () => {
//         onClose();
//     };

//     // Get unique items from specmatDetails using lodash
//     const uniqueItems = useMemo(() => {
//         return _.uniqBy(specmatDetails, 'ITEM')
//             .map(detail => detail.ITEM)
//             .filter(item => item);
//     }, [specmatDetails]);

//     const handleChange = (e) => {
//         console.log(e.target.value);
//     };

//     const handlesizeone = (e) => {
//         console.log(e.target.value);
//         setsizeoneval(e.target.value);
//     };

//     const handlesizetwo = (e) => {
//         console.log(e.target.value);
//         setsizetwoval(e.target.value);
//     };

//     const handlematerialselect = (e) => {
//         console.log(e.target.value);
//         setmaterialval(e.target.value);
//     };

//     const handlesearch = () => {
//         // Filter specmatDetails based on input values
//         const filteredResults = specmatDetails.filter(item =>
//             item.ITEM === materialval &&
//             item.SIZE1.toString() === sizeoneval &&
//             item.SIZE2.toString() === sizetwoval
//         );

//         console.log('Filtered results:', filteredResults);
//         setSearchResults(filteredResults);
//         setsearchtab(true)
//     };

//     return (
//         <div style={{ backgroundColor: 'red' }}>
//             <div id="mtoItemAddDiv" className="popup-screen">
//                 <div className="popup-bg"></div>
//                 <div className="popup-window">
//                     <div className="subHeadBg popup">
//                         <i className="fa fa-times close" onClick={handleclose}></i>
//                         <div style={{ margin: '10px' }}>
//                             <label>SPEC : {selectedSpec}</label>
//                         </div>
//                         <div className="input-section">
//                             <select style={{ width: '189px' }} onChange={handleChange} required>
//                                 <option value="">Select Area</option>
//                                 <option>STANDARD</option>
//                                 <option>NORSOK</option>
//                                 <option>EQUINOR</option>
//                             </select>

//                             <input
//                                 list="items"
//                                 type="tel"
//                                 id="item"
//                                 placeholder="Search Item.."
//                                 onChange={handlematerialselect}
//                             />
//                             <span className="fg-space"></span>
//                             <datalist id="items">
//                                 {uniqueItems.map((item, index) => (
//                                     <option key={index} value={item} />
//                                 ))}
//                             </datalist>

//                             <input
//                                 id="size1"
//                                 type="text"
//                                 placeholder="Size1"
//                                 style={{ width: '50px', textAlign: 'center' }}
//                                 onChange={handlesizeone}
//                             />
//                             <span className="fg-space"></span>
//                             <input
//                                 id="size2"
//                                 type="text"
//                                 placeholder="Size2"
//                                 style={{ width: '50px' }}
//                                 onChange={handlesizetwo}
//                             />
//                             <span className="fg-space"></span>
//                             <button type="button" id="addMtoItem">
//                                 <i className="fa fa-search" aria-hidden="true" onClick={handlesearch}></i>
//                             </button>
//                         </div>
//                         {searchtab && <div id="specSearchResultDiv">
//                             {searchResults.map((result, index) => (
//                                 <div key={index} className="mtoItemSearchListDiv">
//                                     <label style={{ flex: 2, paddingRight: '5px' }}>{result.ITEM}</label>
//                                     <label style={{ flex: 1, paddingRight: '5px' }}>{result.SIZE1}</label>
//                                     <label style={{ flex: 1, paddingRight: '5px' }}>{result.SIZE2}</label>
//                                     {/* <label style={{ flex: 1, paddingRight: '5px' }}>{result.UNIT || ''}</label>
//                                     <label style={{ flex: 3, paddingRight: '5px' }}>{result.DESCRIPTION || ''}</label> */}
//                                     <div style={{ width: '100px', display: 'flex' }}>
//                                         <input placeholder="Qty" type="text" />
//                                         <i className="fa fa-plus-square"></i>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>}
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