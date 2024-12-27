import React,{useState,useRef,useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Alert from './Alert';

function AreaPopUp({ onClose, areaPopUpBox}) {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [customAlert,setCustomAlert] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const codeInputRef = useRef(null);

      useEffect(() => {
    if (areaPopUpBox) {
      setCode('');
      setName('');
      if (codeInputRef.current) {
        setTimeout(() => {
          codeInputRef.current.focus();
        }, 100); 
      }
    }
  }, [areaPopUpBox]);

  const handleClose = () => {
    setCode('');
    setName('');
    onClose();
  };
  const handleOk = async () => {
    
    if (!code) {
      setCustomAlert(true);
      setModalMessage("Code is mandatory");
      return;
    } else {
        const data = {
            code: code,
            name: name,
          };
          window.api.send('save-area-code-data', data);
      handleClose();
      
    }
  };
  return (
    <>
    <Modal
    onHide={handleClose}
    show={areaPopUpBox}
    backdrop="static"
    keyboard={false}
    dialogClassName="custom-modal"
  >
    <div className="area-dialog">
      <div className="title-dialog">
        <p className='text-light'>Add Area</p>
        <p className='text-light cross' onClick={handleClose}>&times;</p>
      </div>
      <div className="dialog-input">
        <label>Code *</label>
        <input
          type="text"
          ref={codeInputRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className='dialog-button' style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
      <button className='btn btn-secondary' onClick={handleClose}>Cancel</button>
      <button className='btn btn-dark' onClick={handleOk}>Ok</button>
    </div>
    </div>
  </Modal>

{customAlert && (
    <Alert
      message={modalMessage}
      onAlertClose={() => setCustomAlert(false)}
    />
  )}
  </>
  )
}

export default AreaPopUp
