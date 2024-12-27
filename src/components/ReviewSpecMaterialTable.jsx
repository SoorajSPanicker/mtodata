import React, { useEffect } from 'react'

function ReviewSpecMaterialTable({ specsizeDetails, specmatDetails, spectempDetails }) {
  useEffect(() => {
    console.log(specmatDetails);

  }, [specmatDetails])

  useEffect(() => {
    console.log(specsizeDetails);

  }, [specsizeDetails])

  useEffect(() => {
    console.log(spectempDetails);

  }, [spectempDetails])
  return (
    <div style={{ zIndex: '1', position: 'absolute', width: '100%', backgroundColor: '#33334c', height: '100vh' }}>

      <h4 style={{ fontWeight: 'bold', color: '#515CBC', textAlign: 'left', paddingLeft: '20px', paddingTop: '15px' }}>Review Spec Material Table</h4>
      <hr style={{ color: 'white' }} />

      <div style={{ color: 'white', margin: '0', padding: '0' }}>


        <div>
          <h4>Materials table</h4>
          {/* <div className="table-container"> */}
          <table className='tagTable'>
            <thead>
              <tr>
                <th className="wideHead">Item</th>
                <th className="wideHead">Type</th>
                <th className="mediumHead">From</th>
                <th className="wideHead">To</th>
                <th className="wideHead">Geometric Standard</th>
                <th className="wideHead">EDS/VDS</th>
                <th className="wideHead">End Conn#1</th>
                <th className="wideHead">End Conn#2</th>
                <th className="wideHead">Material Descr</th>
                <th className="wideHead">MDS</th>
                <th className="wideHead">Rating</th>
                <th className="wideHead">SCHD</th>
                <th className="wideHead">Notes</th>
                <th className="tableActionCell">
                  <i className="fa fa-download" title="Import" ></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {specmatDetails.map((row, index) => (
                <tr>
                  <td>{row.ITEM}</td>
                  <td>{row.TYPE}</td>
                  <td>{row.RANGE_FROM}</td>
                  <td>{row.RANGE_TO}</td>
                  <td>{row.GEOMETRIC_STANDARD}</td>
                  <td>{row.EDS_VDS}</td>
                  <td>{row.END_CONN_1}</td>
                  <td>{row.END_CONN_2}</td>
                  <td>{row.MATERIAL_DESCR}</td>
                  <td>{row.MDS}</td>
                  <td>{row.RATING}</td>
                  <td>{row.SCHD}</td>
                  <td>{row.NOTES}</td>
                  <td>
                    <i className="fa-solid fa-pencil"></i>
                    <i className="fa-solid fa-trash-can ms-3" ></i>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          {/* </div>           */}
        </div>
        <div>
          <h4>Spec Details Table</h4>
          {/* <div className="table-container"> */}
          <table className='tagTable'>
            <thead>
              <tr>
                <th className="wideHead">Size1</th>
                <th className="wideHead">Size2</th>
                <th className="mediumHead">Item</th>
                <th className="wideHead">Item Description</th>
                <th className="tableActionCell">
                  <i className="fa fa-download" title="Import" ></i>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>aaaa</td>
                <td>bbbb</td>
                <td>cccc</td>
                <td>aaaa</td>
                <i className="fa-solid fa-pencil"></i>
                <i className="fa-solid fa-trash-can ms-3" ></i>
              </tr>

            </tbody>
          </table>
          {/* </div>           */}
        </div>

      </div>



    </div>
  )
}

export default ReviewSpecMaterialTable
