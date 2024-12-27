import React, { useState } from 'react';
import Alert from './Alert';
import DeleteConfirm from './DeleteConfirm';

function TreeTable({ allAreasInTable, allDiscsInTable, allSysInTable }) {
  const [currentDeleteTag, setCurrentDeleteTag] = useState('');
  const [currentDeleteType, setCurrentDeleteType] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [editedAreaRowIndex, setEditedAreaRowIndex] = useState(-1);
  const [editedDiscRowIndex, setEditedDiscRowIndex] = useState(-1);
  const [editedSysRowIndex, setEditedSysRowIndex] = useState(-1);
  const [editedLineData, setEditedLineData] = useState({});
  const [customAlert, setCustomAlert] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleDeleteTagFromTable = (number, type) => {
    setCurrentDeleteTag(number);
    setCurrentDeleteType(type);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (currentDeleteType === 'area') {
      window.api.send('remove-tree-table-area', currentDeleteTag);
    } else if (currentDeleteType === 'disc') {
      window.api.send('remove-tree-table-disc', currentDeleteTag);
    } else if (currentDeleteType === 'sys') {
      window.api.send('remove-tree-table-sys', currentDeleteTag);
    }
    setShowConfirm(false);
    setCurrentDeleteTag('');
    setCurrentDeleteType('');
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setCurrentDeleteTag('');
    setCurrentDeleteType('');
  };

  const handleEditOpen = (index, type) => {
    setEditedLineData({});
    if (type === 'area') {
      setEditedAreaRowIndex(index);
      setEditedDiscRowIndex(-1);
      setEditedSysRowIndex(-1);
      setEditedLineData({ ...allAreasInTable[index], oldArea: allAreasInTable[index].area });
    } else if (type === 'disc') {
      setEditedDiscRowIndex(index);
      setEditedAreaRowIndex(-1);
      setEditedSysRowIndex(-1);
      setEditedLineData({ ...allDiscsInTable[index], oldDisc: allDiscsInTable[index].disc });
    } else if (type === 'sys') {
      setEditedSysRowIndex(index);
      setEditedAreaRowIndex(-1);
      setEditedDiscRowIndex(-1);
      setEditedLineData({ ...allSysInTable[index], oldSys: allSysInTable[index].sys });
    }
  };

  const handleCloseEdit = () => {
    setEditedAreaRowIndex(-1);
    setEditedDiscRowIndex(-1);
    setEditedSysRowIndex(-1);
    setEditedLineData({});
  };

  const handleChange = (field, value) => {
    setEditedLineData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSave = (type, id) => {
    if (type === 'area') {
      const updatedData = {
        id,
        oldArea: editedLineData.oldArea,
        newArea: editedLineData.area,
        newName: editedLineData.name,
      };
      window.api.send(`save-edit-${type}`, updatedData);
    } else if (type === 'disc') {
      const updatedData = {
        id,
        oldDisc: editedLineData.oldDisc,
        newDisc: editedLineData.disc,
        newName: editedLineData.name,
      };
      window.api.send(`save-edit-${type}`, updatedData);
    } else if (type === 'sys') {
      const updatedData = {
        id,
        oldSys: editedLineData.oldSys,
        newSys: editedLineData.sys,
        newName: editedLineData.name,
      };
      window.api.send(`save-edit-${type}`, updatedData);
    }
    handleCloseEdit();
  };

  const handleDeleteAllArea = () => {
    window.api.send('delete-all-areas');
  };
  const handleDeleteAllDisc = () => {
    window.api.send('delete-all-disc');
  };
  const handleDeleteAllSys = () => {
    window.api.send('delete-all-sys');
  };

  return (
    <div style={{ width: '100%', height: '90vh', backgroundColor: 'white', zIndex: '1', position: 'absolute' }}>
      <form>
        <div className="table-container">
          <h4 className='text-center'>Area table</h4>
          <table className='tagTable'>
            <thead>
              <tr>
                <th className="wideHead">Code</th>
                <th className="wideHead">Name</th>
                <th className="tableActionCell">
                  <i className="fa-solid fa-trash-can ms-3" title='Delete all' onClick={handleDeleteAllArea}></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {allAreasInTable.map((tag, index) => (
                <tr key={tag.areaId} style={{ color: 'black' }}>
                  <td style={{ backgroundColor: '#f0f0f0' }}>
                    {editedAreaRowIndex === index ? (
                      <input
                        onChange={e => handleChange('area', e.target.value)}
                        type="text"
                        value={editedLineData.area || ''}
                      />
                    ) : (
                      tag.area
                    )}
                  </td>
                  <td>
                    {editedAreaRowIndex === index ? (
                      <input
                        onChange={e => handleChange('name', e.target.value)}
                        type="text"
                        value={editedLineData.name || ''}
                      />
                    ) : (
                      tag.name
                    )}
                  </td>
                  <td style={{ backgroundColor: '#f0f0f0' }}>
                    {editedAreaRowIndex === index ? (
                      <>
                        <i className="fa-solid fa-floppy-disk text-success" onClick={() => handleSave('area', tag.areaId)}></i>
                        <i className="fa-solid fa-xmark ms-3 text-danger" onClick={handleCloseEdit}></i>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-pencil" onClick={() => handleEditOpen(index, 'area')}></i>
                        <i className="fa-solid fa-trash-can ms-3" onClick={() => handleDeleteTagFromTable(tag.areaId, 'area')}></i>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className='text-center'>Discipline table</h4>
          <table className='tagTable'>
            <thead>
              <tr>
                <th className="wideHead">Code</th>
                <th className="wideHead">Name</th>
                <th className="tableActionCell">
                  <i className="fa-solid fa-trash-can ms-3" title='Delete all' onClick={handleDeleteAllDisc}></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {allDiscsInTable.map((tag, index) => (
                <tr key={tag.discId} style={{ color: 'black' }}>
                  <td style={{ backgroundColor: '#f0f0f0' }}>
                    {editedDiscRowIndex === index ? (
                      <input
                        onChange={e => handleChange('disc', e.target.value)}
                        type="text"
                        value={editedLineData.disc || ''}
                      />
                    ) : (
                      tag.disc
                    )}
                  </td>
                  <td>
                    {editedDiscRowIndex === index ? (
                      <input
                        onChange={e => handleChange('name', e.target.value)}
                        type="text"
                        value={editedLineData.name || ''}
                      />
                    ) : (
                      tag.name
                    )}
                  </td>
                  <td style={{ backgroundColor: '#f0f0f0' }}>
                    {editedDiscRowIndex === index ? (
                      <>
                        <i className="fa-solid fa-floppy-disk text-success" onClick={() => handleSave('disc', tag.discId)}></i>
                        <i className="fa-solid fa-xmark ms-3 text-danger" onClick={handleCloseEdit}></i>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-pencil" onClick={() => handleEditOpen(index, 'disc')}></i>
                        <i className="fa-solid fa-trash-can ms-3" onClick={() => handleDeleteTagFromTable(tag.discId, 'disc')}></i>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4 className='text-center'>System table</h4>
          <table className='tagTable'>
            <thead>
              <tr>
                <th className="wideHead">Code</th>
                <th className="wideHead">Name</th>
                <th className="tableActionCell">
                  <i className="fa-solid fa-trash-can ms-3" title='Delete all' onClick={handleDeleteAllSys}></i>
                </th>
              </tr>
            </thead>
            <tbody>
              {allSysInTable.map((tag, index) => (
                <tr key={tag.sysId} style={{ color: 'black' }}>
                  <td style={{ backgroundColor: '#f0f0f0' }}>
                    {editedSysRowIndex === index ? (
                      <input
                        onChange={e => handleChange('sys', e.target.value)}
                        type="text"
                        value={editedLineData.sys || ''}
                      />
                    ) : (
                      tag.sys
                    )}
                  </td>
                  <td>
                    {editedSysRowIndex === index ? (
                      <input
                        onChange={e => handleChange('name', e.target.value)}
                        type="text"
                        value={editedLineData.name || ''}
                      />
                    ) : (
                      tag.name
                    )}
                  </td>
                  <td style={{ backgroundColor: '#f0f0f0' }}>
                    {editedSysRowIndex === index ? (
                      <>
                        <i className="fa-solid fa-floppy-disk text-success" onClick={() => handleSave('sys', tag.sysId)}></i>
                        <i className="fa-solid fa-xmark ms-3 text-danger" onClick={handleCloseEdit}></i>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-pencil" onClick={() => handleEditOpen(index, 'sys')}></i>
                        <i className="fa-solid fa-trash-can ms-3" onClick={() => handleDeleteTagFromTable(tag.sysId, 'sys')}></i>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
      {showConfirm && (
        <DeleteConfirm
          message="Are you sure you want to delete this tag?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {customAlert && (
        <Alert
          message={modalMessage}
          onClose={() => setCustomAlert(false)}
        />
      )}
    </div>
  );
}

export default TreeTable;
