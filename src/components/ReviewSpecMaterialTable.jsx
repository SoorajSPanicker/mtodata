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
    <div style={{ zIndex: '1', position: 'absolute', width: '100%', backgroundColor: '#33334c', height: '100vh' , display: 'flex', flexDirection: 'column'}}>

      <h4 style={{ fontWeight: 'bold', color: '#515CBC', textAlign: 'left', paddingLeft: '20px', paddingTop: '15px' }}>Review Spec Material Table</h4>
      <hr style={{ color: 'white' }} />

      {/* <div style={{ color: 'white', margin: '0', padding: '0' }}> */}

      <div style={{ 
        color: 'white', 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
        {/* <div> */}
          <h4>Spec Details Table</h4>
          {/* <div className="table-container"> */}
          <div style={{
            flex: 1,
            overflow: 'auto'
          }}>
          <table className='tagTable'>
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
                <th>MDS</th>
                <th>Rating</th>
                <th>SCHD.</th>
                <th>Notes</th>
                <th>Remarks</th>
                <th className="tableActionCell">
                  <i className="fa fa-download" title="Import" ></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {specmat.map((row, index) => (
                <tr style={{backgroundColor:'black'}}>
                  <td>{row.itemType}</td>
                  <td>{row.fittingType}</td>
                  <td>{row.size1}</td>
                  <td>{row.size2}</td>
                  <td>{row.GeometricStd}</td>
                  <td>{row.EDS_VDS}</td>
                  <td>{row.endConn}</td>
                  <td>{row.materialDescrip}</td>
                  <td>{row.MDS}</td>
                  <td>{row.rating}</td>
                  <td>{row.SCHD}</td>
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
          {/* </div>           */}
        </div>

      </div>



    </div>
  )
}

export default ReviewSpecMaterialTable
