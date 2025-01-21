// import React, { useEffect } from 'react'


// function ReviewSpecMaterialTable({ specsizeDetails, specmatDetails, spectempDetails, specDetails, specmat }) {
//   useEffect(() => {
//     console.log(specmatDetails);

//   }, [specmatDetails])

//   useEffect(() => {
//     console.log(specsizeDetails);

//   }, [specsizeDetails])

//   useEffect(() => {
//     console.log(spectempDetails);

//   }, [spectempDetails])

//   useEffect(() => {
//     console.log(specDetails);

//   }, [specDetails])

//   useEffect(() => {
//     console.log(specmat);

//   }, [specmat])
//   return (
//     <div style={{ zIndex: '1', position: 'absolute', width: '100%', backgroundColor: '#33334c', height: '100vh', display: 'flex', flexDirection: 'column' }}>

//       <h4 style={{ fontWeight: 'bold', color: '#515CBC', textAlign: 'left', paddingLeft: '20px', paddingTop: '15px' }}>Review Spec Material Table</h4>
//       <hr style={{ color: 'white' }} />

//       {/* <div style={{ color: 'white', margin: '0', padding: '0' }}> */}

//       <div style={{
//         color: 'white',
//         flex: 1,
//         display: 'flex',
//         flexDirection: 'column',
//         overflow: 'hidden'
//       }}>
//         <div style={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           overflow: 'hidden'
//         }}>
//           {/* <div> */}
//           <h4>Spec Details Table</h4>
//           {/* <div className="table-container"> */}
//           <div style={{
//             flex: 1,
//             overflow: 'auto',
//             overflowX: 'auto',
//             whiteSpace: 'nowrap'
//           }}>
//             <table className='tagTable' style={{
//               // Add minimum width to ensure table doesn't shrink too much
//               minWidth: '100%',
//               // Optional: if you want the table to stretch based on content
//               width: 'max-content'
//             }}>
//               <thead>
//                 <tr>
//                   <th>Item Type</th>
//                   <th>Fitting Type</th>
//                   <th>Size1</th>
//                   <th>Size2</th>
//                   <th>Geometric Standard</th>
//                   <th>EDS/VDS</th>
//                   <th>End Conn #1 #2</th>
//                   <th>Material Descr.</th>
//                   <th>Material Long Descr</th>
//                   <th>MDS</th>
//                   <th>Rating</th>
//                   <th>SCHD.</th>
//                   <th>Notes</th>
//                   <th>Remarks</th>
//                   <th className="tableActionCell">
//                     <i className="fa fa-download" title="Import" ></i>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {specmatDetails.map((row, index) => (
//                   <tr style={{ backgroundColor: 'black' }}>
//                     <td>{row.itemType}</td>
//                     <td>{row.fittingType}</td>
//                     <td>{row.size1}</td>
//                     <td>{row.size2}</td>
//                     <td>{row.GeometricStd}</td>
//                     <td>{row.EDS_VDS}</td>
//                     <td>{row.endConn}</td>
//                     <td>{row.materialDescrip}</td>
//                     <td>{row.materialLgDescrip}</td>
//                     <td>{row.MDS}</td>
//                     <td>{row.rating}</td>
//                     <td>{row.SCHD}</td>
//                     <td>{row.Notes}</td>
//                     <td>{row.remarks}</td>
//                     <td>
//                       <i className="fa-solid fa-pencil"></i>
//                       <i className="fa-solid fa-trash-can ms-3" ></i>
//                     </td>

//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {/* </div>           */}
//         </div>

//       </div>



//     </div>
//   )
// }

// export default ReviewSpecMaterialTable


import React, { useEffect } from 'react'


function ReviewSpecMaterialTable({ specsizeDetails, specmatDetails, spectempDetails, specDetails, specmat }) {
  useEffect(() => {
    console.log(specmatDetails);

  }, [specmatDetails])

  useEffect(() => {
    console.log(specsizeDetails);

  }, [specsizeDetails])

  useEffect(() => {
    console.log(spectempDetails);

  }, [spectempDetails])

  useEffect(() => {
    console.log(specDetails);

  }, [specDetails])

  useEffect(() => {
    console.log(specmat);

  }, [specmat])
    return (
        <div style={{ width: '100%', height: '100vh', backgroundColor: 'white', zIndex: '1', position: 'absolute' }}>
            <form>

                <div className="table-container">
                    <table className="linetable">
                    <thead>
                <tr>
                  <th>Item Type</th>
                  <th>Fitting Type</th>
                  <th>Size1</th>
                  <th>Size2</th>
                  <th>Geometric Standard</th>
                  <th>EDS/VDS</th>
                  <th>End Conn #1 #2</th>
                  <th>Material Descr.</th>
                  <th>Material Long Descr</th>
                  <th>MDS</th>
                  <th>Rating</th>
                  <th>Wall Thickness S1</th>
                  <th>Wall Thickness S2</th>
                  <th>Schedule S1</th>
                  <th>Schedule S2</th>
                  <th>Notes</th>
                  <th>Remarks</th>
                  <th className="tableActionCell">
                    <i className="fa fa-download" title="Import" ></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {specmatDetails.map((row, index) => (
                  <tr style={{ backgroundColor: 'black' }}>
                    <td>{row.itemType}</td>
                    <td>{row.fittingType}</td>
                    <td>{row.size1}</td>
                    <td>{row.size2}</td>
                    <td>{row.GeometricStd}</td>
                    <td>{row.EDS_VDS}</td>
                    <td>{row.endConn}</td>
                    <td>{row.materialDescrip}</td>
                    <td>{row.materialLgDescrip}</td>
                    <td>{row.MDS}</td>
                    <td>{row.rating}</td>
                    <td>{row.thkSizeOne}</td>
                    <td>{row.thkSizeTwo}</td>
                    <td>{row.schdSizeOne}</td>
                    <td>{row.schdSizeTwo}</td>
                    <td>{row.Notes}</td>
                    <td>{row.remarks}</td>
                    <td>
                      <i className="fa-solid fa-pencil"></i>
                      <i className="fa-solid fa-trash-can ms-3" ></i>
                    </td>

                  </tr>
                ))}
              </tbody>
                    </table>
                </div>
            </form>
            {/* {customAlert && (
                <Alert
                    message={modalMessage}
                    onAlertClose={() => setCustomAlert(false)}
                />
            )}

            {showConfirm && (
                <DeleteConfirm
                    message="Are you sure you want to delete?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )} */}
        </div>
    )
}

export default ReviewSpecMaterialTable

