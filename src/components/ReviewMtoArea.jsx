import React from 'react'

function ReviewMtoArea({mtoarea}) {
  return (
    <div style={{ width: '100%', height: '90vh', backgroundColor: 'white', zIndex: '1', position: 'absolute' }}>
    <form>
        <div className="table-container">
            <div >
                <table className='tagTable'>
                    <thead>

                        <tr>
                            <th className="wideHead">Area Code</th>
                            <th className="wideHead">Area Name</th>
                            {/* <th className="mediumHead">Document Name</th>
                            <th className="wideHead">Revision Number</th>
                            <th className="wideHead">Revision Date</th>
                            <th className="wideHead">Revision Description</th>
                            <th className="wideHead">Revision prepared By</th>
                            <th className="wideHead">Revision Checked By</th>
                            <th className="wideHead">Revision Approved By</th>
                            <th className="mediumHead">Revision Prepared Date</th>
                            <th className="wideHead">Revision Check Date</th>
                            <th className="wideHead">Revision Approved Date</th>
                            <th className="wideHead">Checklist Number</th>
                            <th className="wideHead">MTO Status</th>
                            <th className="wideHead">Preocurment Status</th> */}
                            <th className="tableActionCell" >
                                <i className="fa fa-download" title="Import"></i>
                            </th>
                        </tr>
                        <tr>
                            <th colSpan="8">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    style={{ width: '100%', padding: '5px' }}
                                />
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {mtoarea.map((row, index) => (
                            <tr key={index}>
                                <td className='text-dark'>{row.area}</td>
                                <td className='text-dark'>{row.name}</td>
                                {/* <td className='text-dark'>{row.M_DocName}</td>
                                <td className='text-dark'>{row.RevNo}</td>
                                <td className='text-dark'>{row.RevDate}</td>
                                <td className='text-dark'>{row.RevDes}</td>
                                <td className='text-dark'>{row.RevPreBy}</td>
                                <td className='text-dark'>{row.RevChecBy}</td>
                                <td className='text-dark'>{row.RevAppBy}</td>
                                <td className='text-dark'>{row.RevPrepDate}</td>
                                <td className='text-dark'>{row.RevCheckDate}</td>
                                <td className='text-dark'>{row.RevAppDate}</td>
                                <td className='text-dark'>{row.ChecklistNo}</td>
                                <td className='text-dark'>{row.MtoSta}</td>
                                <td className='text-dark'>{row.Preocur}</td> */}
                                <td style={{ backgroundColor: '#f0f0f0', color: 'black' }}>
                                    <i className="fa-solid fa-pencil"></i>
                                    <i className="fa-solid fa-trash-can ms-3"></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              

            </div>


        </div>
    </form>
</div>
  )
}

export default ReviewMtoArea