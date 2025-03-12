import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
function SisoMaterialAdd({specmatDetails,handleclose}) {
    const [materialval, setmaterialval] = useState('');
    const [sizeoneval, setsizeoneval] = useState('');
    const [sizetwoval, setsizetwoval] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [mtlqty, setmtlqty] = useState('')

    useEffect(()=>{
        console.log(specmatDetails);
        
    },[specmatDetails])
    // const handleclose = () => {
    //     onClose();
    // };

    // // Get unique items from specmatDetails using lodash
    const uniqueItems = useMemo(() => {
        return _.uniqBy(specmatDetails, 'itemType')
            .map(detail => detail.itemType)
            .filter(item => item);
    }, [specmatDetails]);

    // const handleChange = (e) => {
    //     console.log(e.target.value);
    // };

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
       
        // const data = {
        //     tagId: mttagid,
        //     tagNo: mttagno,
        //     areaId: mtareaid,
        //     areaName: mtareaname,
        //     Qty: mtlqty,
        //     Item: materialval,
        //     Sizeone: sizeoneval,
        //     Sizetwo: sizetwoval,
        //     thkSizeOne: searchResults[0].thkSizeOne,
        //     thkSizeTwo: searchResults[0].thkSizeTwo,
        //     schdSizeOne: searchResults[0].schdSizeOne,
        //     schdSizeTwo: searchResults[0].schdSizeTwo
        // }
        // // window.api.send('save-material-data', data);
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
                    {/* <label>SPEC : {selectedSpec}</label> */}
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
                    {/* <input placeholder="Qty" type="text" style={{ width: '50px' }} onChange={handleqtychange} /> */}
    
                    <i className="fa fa-plus-square mx-3" style={{ color: 'blue' }} onClick={handlematsubmit}></i>
    
                    {/* <button type="button" id="addMtoItem">
                        <i className="fa fa-search"  onClick={handlesearch}></i>
                    </button> */}
                </div>
                <div id="specSearchResultDiv">
                    {searchResults.map((result, index) => (
                        <div key={index} className="mtoItemSearchListDiv">
                            <label style={{ flex: 2, paddingRight: '5px', color: 'black' }}>`{result.itemType},{result.GeometricStd},{result.materialDescrip},End Conn:- {result.endConn}, WT:- {result.thkSizeOne}x{result.thkSizeTwo}, SCH:- {result.schdSizeOne}x{result.schdSizeTwo} `</label>
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
  )
}

export default SisoMaterialAdd



// import React, { useEffect, useMemo, useState } from 'react';
// import _ from 'lodash';

// function SpecMaterialSearch({ specmatDetails, onClose, selectedSpec, mttagid, mtareaid, mttagno, mtareaname }) {
//     const [materialval, setmaterialval] = useState('');
//     const [sizeoneval, setsizeoneval] = useState('');
//     const [sizetwoval, setsizetwoval] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const [mtlqty, setmtlqty] = useState('')
//     const handleclose = () => {
//         onClose();
//     };

//     // Get unique items from specmatDetails using lodash
//     const uniqueItems = useMemo(() => {
//         return _.uniqBy(specmatDetails, 'itemType')
//             .map(detail => detail.itemType)
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
//     useEffect(() => {
//         console.log(materialval);
//         handlesearch();
//     }, [materialval])
//     useEffect(() => {
//         console.log(sizeoneval);

//     }, [sizeoneval])
//     useEffect(() => {
//         console.log(sizetwoval);

//     }, [sizetwoval])
//     useEffect(() => {
//         console.log(mtlqty);

//     }, [mtlqty])

//     const handlesearch = () => {
//         // Filter specmatDetails based on input values
//         const filteredResults = specmatDetails.filter(item =>
//             item.itemType === materialval &&
//             item.size1.toString() === sizeoneval &&
//             item.size2.toString() === sizetwoval
//         );

//         console.log('Filtered results:', filteredResults);
//         setSearchResults(filteredResults);
//     };

//     const handleqtychange = (e) => {
//         console.log(e.target.value);
//         setmtlqty(e.target.value)
//     }
//     useEffect(() => {
//         console.log(mtlqty);

//     }, [mtlqty])

//     const handlematsubmit = (item, sizeone, sizetwo) => {
//        console.log(searchResults);
//        console.log(searchResults[0].thkSizeOne);
       
//         const data = {
//             tagId: mttagid,
//             tagNo: mttagno,
//             areaId: mtareaid,
//             areaName: mtareaname,
//             Qty: mtlqty,
//             Item: materialval,
//             Sizeone: sizeoneval,
//             Sizetwo: sizetwoval,
//             thkSizeOne: searchResults[0].thkSizeOne,
//             thkSizeTwo: searchResults[0].thkSizeTwo,
//             schdSizeOne: searchResults[0].schdSizeOne,
//             schdSizeTwo: searchResults[0].schdSizeTwo
//         }
//         window.api.send('save-material-data', data);
//         handleclose()
//     }

//     const handleclear = () => {
//         setSearchResults([])
//     }

//     return (
//         <div style={{ backgroundColor: 'red' }}>
//             <div id="mtoItemAddDiv" className="popup-screen">
//                 <div className="popup-bg"></div>
//                 <div className="popup-window">
//                     <div className="subHeadBg popup">
//                         <i className="fa fa-times close" onClick={handleclose}></i>
//                         <div style={{ margin: '10px', color: 'black' }}>
//                             <label>SPEC : {selectedSpec}</label>
//                         </div>
//                         <div className="input-section">
//                             {/* <select style={{ width: '189px' }} onChange={handleChange} required>
//                                 <option value="">Select Area</option>
//                                 <option>STANDARD</option>
//                                 <option>NORSOK</option>
//                                 <option>EQUINOR</option>
//                             </select> */}


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
//                             <span className="fg-space"></span>
//                             <input placeholder="Qty" type="text" style={{ width: '50px' }} onChange={handleqtychange} />

//                             <i className="fa fa-plus-square mx-3" style={{ color: 'blue' }} onClick={handlematsubmit}></i>

//                             {/* <button type="button" id="addMtoItem">
//                                 <i className="fa fa-search"  onClick={handlesearch}></i>
//                             </button> */}
//                         </div>
//                         <div id="specSearchResultDiv">
//                             {searchResults.map((result, index) => (
//                                 <div key={index} className="mtoItemSearchListDiv">
//                                     <label style={{ flex: 2, paddingRight: '5px', color: 'black' }}>`{result.materialLgDescrip}, {result.thkSizeOne}, {result.thkSizeTwo}, {result.schdSizeOne}, {result.schdSizeTwo} `</label>
//                                     {/* <label style={{ flex: 1, paddingRight: '5px', color: 'black' }}>{result.size1}</label>
//                                     <label style={{ flex: 1, paddingRight: '5px', color: 'black' }}>{result.size2}</label> */}
//                                     {/* <label style={{ flex: 1, paddingRight: '5px' }}>{result.UNIT || ''}</label>
//                                     <label style={{ flex: 3, paddingRight: '5px' }}>{result.DESCRIPTION || ''}</label> */}

//                                 </div>
//                             ))}
//                         </div>
//                         <div style={{ marginLeft: '10px', marginRight: '10px' }} >
//                             <button type="button" onClick={handleclear}>Clear Result</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SpecMaterialSearch;
