import React, { useState, useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add';
import RegisterDocument from './RegisterDocument';
import Canvas from './SmaryPidCanvas'
import Alert from './Alert';
import DeleteConfirm from './DeleteConfirm';


function Spid({ allDocuments, openSpidCanvas, setOpenSpidCanvas, alltags, allspids, svgcontent, allareas, setopenThreeCanvas, setiRoamercanvas, setSpidOpen, allCommentStatus, allComments, tagdocsel, setsvgcontent, markdet, specmatDetails, recteletag, allAreasInTable}) {
  const [openRegisterDocument, setOpenRegisterDocument] = useState(false)
  const [documentnumber, setDocumentNumber] = useState('')

  const [sindocid, setsindocid] = useState('')
  const [mascontent, setmascontent] = useState('')
  const [customAlert, setCustomAlert] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isDiv1Visible, setIsDiv1Visible] = useState(true);
  const [istagsubopt, settagsubopt] = useState(false)
  const [iscomsubopt, setcomsubopt] = useState(false)
  const [istaginfoopt, settaginfoopt] = useState(false)
  const [isdocsubopt, setdocsubopt] = useState(false)
  const [islinelist, setlinelist] = useState(false)
  const [istagreview, settagreview] = useState(false)
  const [istaginforeview, settaginforeview] = useState(false)
  const [istaginfoedit, settaginfoedit] = useState(false)
  const [istagreg, settagreg] = useState(false)
  const [isinfosubopt, setinfosubopt] = useState(false)
  const [showcanvas, setshowcanvas] = useState(false);
  const [iscomstareview, setcomstareview] = useState(false);
  const [iscomreg, setcomreg] = useState(false);
  const [isdocreg, setdocreg] = useState(false);
  const [isareareg, setareareg] = useState(false);
  const [areaNumber, setareaNumber] = useState('')
  const [areaName, setareaName] = useState('')
  const [alllines, setalllines] = useState([])
  const [alldocs, setAlldocs] = useState([]);
  const [ismaster, setmaster] = useState({});
  const [showmasConfirm, setShowmasConfirm] = useState(false);
  const [masterid, setmasterid] = useState('');

  const handledocdis = async (id, docId) => {
    console.log("Enter doc click");
    setmasterid(id)
    setsindocid(docId)
    window.api.send('check-master', id);
  }

  useEffect(() => {
    window.api.receive('det-doc-tag', (data) => {
      console.log(data);
      data.forEach(element => {
        handledocdis(element.number, element.docId)
      });

    });
  }, [])

  useEffect(() => {
    console.log(masterid);
  }, [masterid])

  useEffect(() => {
    console.log(markdet);

  }, [markdet])

  const onCloseRegister = () => {
    setOpenRegisterDocument(false);
  }
  const handleOpenDocumentReg = () => {
    setOpenRegisterDocument(true);
  }
  const handleOpenSpidCanvas = (documentNumber) => {
    setDocumentNumber(documentNumber);
    setOpenSpidCanvas(true);
    window.api.send('document-fetch', documentNumber);
  }
  // -----------PID-------------
  useEffect(() => {
    window.api.receive('all-docs-fetched', (data) => {
      console.log("Received data from main process:", data);
      setAlldocs(data);
    });
  }, []);



  useEffect(() => {
    window.api.receive('all-elements-fetched', (data) => {
      console.log("Received data from main process:", data);
    });
  }, []);


  useEffect(() => {
    window.api.receive('master-doc-fetched', (data) => {
      console.log("Received data from main process:", data);
      setmascontent(data)
      setCustomAlert(true);
      setModalMessage('Smart master added')
    });
  }, []);

  useEffect(() => {
    window.api.receive('store-master-fetched', (data) => {
      console.log("Received data from main process:", data);
      setmascontent(data)
    });
  }, [])

  useEffect(() => {
    window.api.receive('master-checked', (data) => {
      console.log("Received data from main process:", data);
      setmaster(data)
    });
  }, []);
  const handleConfirmmaster = () => {
    console.log("Enter okay");
    console.log(masterid);
    window.api.send('insert-master-table', masterid)
    setShowmasConfirm(false)
  }

  const handleCancelmaster = () => {
    setShowmasConfirm(false)
  }

  useEffect(() => {
    console.log(ismaster);
    if (Object.keys(ismaster).length === 0) {
      console.log('hello');
      if (masterid != '') {
        console.log(masterid);
        window.api.send('fetch-sin-doc', masterid);
        window.api.send('fetch-sin-docdetails', masterid)
        setOpenSpidCanvas(true)
        setShowmasConfirm(true)
      }
    }
    else {
      console.log('hi');
      if (masterid != '') {
        console.log(masterid);
        window.api.send('fetch-sin-doc', masterid);
        window.api.send('fetch-sin-docdetails', masterid)
        window.api.send('fetch-master-doc', masterid)
        setOpenSpidCanvas(true)
      }
    }
  }, [ismaster])

  useEffect(() => {
    console.log(specmatDetails);

  }, [specmatDetails])

  useEffect(() => {
    console.log(recteletag);

  }, [recteletag])

  useEffect(() => {
    console.log(allAreasInTable);

  }, [allAreasInTable])


  return (
    <div style={{ zIndex: '1', position: 'absolute', width: '100%', height: '90vh', backgroundColor: '#33334c', color: 'white' }}>
      {
        openSpidCanvas ? (<Canvas alltags={alltags} openSpidCanvas={openSpidCanvas} svgcontent={svgcontent} setsvgcontent={setsvgcontent} allspids={allspids} mascontent={mascontent} allareas={allareas} sindocid={sindocid} setopenThreeCanvas={setopenThreeCanvas} setiRoamercanvas={setiRoamercanvas} setOpenSpidCanvas={setOpenSpidCanvas} setSpidOpen={setSpidOpen} allCommentStatus={allCommentStatus} allComments={allComments} tagdocsel={tagdocsel} markdet={markdet} specmatDetails={specmatDetails} recteletag={recteletag} allAreasInTable={allAreasInTable} masterid={masterid} />
        ) : (<div>
          <div className="head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }}>
            <h3 style={{ fontWeight: 'bold' }}>Smart P&IDs</h3>
            <AddIcon style={{ fontWeight: 'bold' }} onClick={handleOpenDocumentReg} />
          </div>
          <hr style={{ marginTop: '-10px' }} />
          <div className="all-document-content">
            {
              allDocuments.map((document, index) => (
                <div className="rounded-box" onClick={() => handledocdis(document.number, document.documentId)}>{document.title}</div>
              ))
            }
          </div>
          {
            openRegisterDocument && <RegisterDocument openRegisterDocument={openRegisterDocument} onCloseRegister={onCloseRegister} />
          }
        </div>)
      }

      {customAlert && (
        <Alert
          message={modalMessage}
          onAlertClose={() => setCustomAlert(false)}
        />
      )}
      {showmasConfirm && (
        <DeleteConfirm
          message="Functons can be performed on the file if smart master is created. Allow smart master to be created"
          onConfirm={handleConfirmmaster}
          onCancel={handleCancelmaster}
        />
      )}
    </div>

  )
}

export default Spid
