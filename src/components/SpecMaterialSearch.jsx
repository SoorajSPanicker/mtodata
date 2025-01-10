// import React from 'react'
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// function SpecMaterialSearch(specmatDetails, onClose, selectedTag) {
//     const handleclose = () => {
//         // setCode('');
//         // setName('');
//         onClose();
//     };
//     return (
//         <div>
//             <div id="mtoItemAddDiv" class="popup-screen">
//                 <div class="popup-bg"></div>
//                 <div class="popup-window">
//                     <div class="subHeadBg popup" >
//                         <i class="fa fa-times close" onClick={handleclose} ></i>
//                         <div style="margin: 10px;">
//                             <label>SPEC : </label>
//                         </div>
//                         <div class="input-section">
//                             <select style="width: 189px;" required=""></select>
//                             <input list="items" type="tel" id="item" placeholder="Search Item.." />
//                             <span class="fg-space"></span>
//                             <datalist id="items">
//                                 <option value=""></option>
//                             </datalist>
//                             <input id="size1" type="" placeholder="Size1" style=" width: 50px;text-align: center;" />
//                             <span class="fg-space"></span>
//                             <input id="size2" type="" placeholder="Size2" style="width: 50px;" />
//                             <span class="fg-space"></span>
//                             <button type="button" id="addMtoItem"  >
//                                 <i class="fa fa-search" aria-hidden="true"></i>
//                             </button>
//                         </div>
//                         <div id="specSearchResultDiv">
//                             <div class="mtoItemSearchListDiv" >
//                                 <label style="flex: 2; padding-right: 5px;"></label>
//                                 <label style="flex: 1; padding-right: 5px;"></label>
//                                 <label style="flex: 1; padding-right: 5px;"></label>
//                                 <label style="flex: 1; padding-right: 5px;"></label>
//                                 <label style="flex: 3; padding-right: 5px;"></label>
//                                 <div style="width: 100px; display: flex;">
//                                     <input placeholder="Qty" type="text" />
//                                     <i class="fa fa-plus-square"></i>
//                                 </div>
//                             </div>
//                         </div>
//                         <div style="margin-left: 10px;margin-right: 10px;" >
//                             <textarea placeholder="Set description" type="text"

//                                 ng-model="outOfSpecDesc" style="width: -webkit-fill-available;">
//                             </textarea>
//                             <button type="button" >Save to spec</button>
//                             {/* class="ng-pristine ng-untouched ng-valid-required ng-empty ng-invalid ng-invalid-required"  */}
//                         </div>
//                         <div style="margin-left: 10px;margin-right: 10px;"  >
//                             <button type="button" >Clear Result</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default SpecMaterialSearch

import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function SpecMaterialSearch({ specmatDetails, onClose, selectedTag }) {  // Fixed props destructuring
    const handleclose = () => {
        onClose();
    };
    useEffect(() => {
        console.log(specmatDetails);

    }, [specmatDetails])
    useEffect(() => {
        console.log(selectedTag);

    }, [selectedTag])

    return (
        <div style={{ zIndex: '10', backgroundColor:'red' }}>
            <div id="mtoItemAddDiv" className="popup-screen">
                <div className="popup-bg"></div>
                <div className="popup-window">
                    <div className="subHeadBg popup">
                        <i className="fa fa-times close" onClick={handleclose}></i>
                        <div style={{ margin: '10px' }}>
                            <label>SPEC : </label>
                        </div>
                        <div className="input-section">
                            <select style={{ width: '189px' }} required></select>
                            <input
                                list="items"
                                type="tel"
                                id="item"
                                placeholder="Search Item.."
                            />
                            <span className="fg-space"></span>
                            <datalist id="items">
                                <option value=""></option>
                            </datalist>
                            <input
                                id="size1"
                                type="text"
                                placeholder="Size1"
                                style={{ width: '50px', textAlign: 'center' }}
                            />
                            <span className="fg-space"></span>
                            <input
                                id="size2"
                                type="text"
                                placeholder="Size2"
                                style={{ width: '50px' }}
                            />
                            <span className="fg-space"></span>
                            <button type="button" id="addMtoItem">
                                <i className="fa fa-search" aria-hidden="true"></i>
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
                        <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                            <textarea
                                placeholder="Set description"
                                style={{ width: '100%' }}
                            />
                            <button type="button">Save to spec</button>
                        </div>
                        <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                            <button type="button">Clear Result</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpecMaterialSearch;