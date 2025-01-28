import React, { useEffect, useMemo, useState } from 'react'
import _ from 'lodash';

function PidMatAdd({ specmatDetails, name, areaid, sindocid, masterid, selectedRectTagData }) {
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
        console.log(masterid);

    }, [masterid])
    useEffect(() => {
        console.log(mtlqty);

    }, [mtlqty])

    const handlematsubmit = () => {
        console.log(searchResults);
        console.log(searchResults[0].thkSizeOne);
    
        // Iterate through selectedRectTagData
        selectedRectTagData.forEach(rectTag => {
            // Create the data object for each rectTag
            const data = {
                tagNo: rectTag.tagNo,
                areaId: areaid,           // Use existing areaId variable
                areaName: name,           // Use existing area name variable
                Qty: mtlqty,              // Use existing quantity value
                Item: materialval,        // Use existing material value
                Sizeone: sizeoneval,      // Use existing size one value
                Sizetwo: sizetwoval,      // Use existing size two value
                thkSizeOne: searchResults[0].thkSizeOne,
                thkSizeTwo: searchResults[0].thkSizeTwo,
                schdSizeOne: searchResults[0].schdSizeOne,
                schdSizeTwo: searchResults[0].schdSizeTwo,
                markId: rectTag.markId,   // Assign markId from rectTag
                rectId: rectTag.rectId,   // Assign rectId from rectTag
                DocNo: masterid           // Use existing master document ID
            };
    
            // Log the data object (optional, for debugging purposes)
            console.log(data);
    
            // Send data to the backend or perform the desired operation
            window.api.send('save-mat-submit', data);
        });
    };
    

    return (
        <div style={{ backgroundColor: 'red' }}>
            <div id="mtoItemAddDiv" className="popup-screen">
                <div className="popup-bg"></div>
                <div className="popup-window">
                    <div className="subHeadBg popup">
                        <i className="fa fa-times close" onClick={handleclose}></i>
                        <div style={{ margin: '10px', color: 'black' }}>
                            <label>SPEC : </label>
                            {/* {selectedSpec} */}
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
                                onChange={handlesizeone}
                                style={{ width: '50px', textAlign: 'center' }}

                            />
                            <span className="fg-space"></span>
                            <input
                                id="size2"
                                type="text"
                                placeholder="Size2"
                                onChange={handlesizetwo}
                                style={{ width: '50px' }}

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
                                   

                                </div>
                            ))}
                        </div>
                        <div style={{ marginLeft: '10px', marginRight: '10px' }} >
                            <button type="button" >Clear Result</button>
                            {/* onClick={handleclear} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PidMatAdd