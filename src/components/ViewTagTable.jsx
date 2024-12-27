import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import Alert from './Alert';
import DeleteConfirm from './DeleteConfirm';
import { generateUUID } from 'three/src/math/MathUtils.js';
import { Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import FileUploadProgress from './FileUploadProgress';


function ViewTagTable({ alltags }) {
  const [currentDeleteTag, setCurrentDeleteTag] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [editedRowIndex, setEditedRowIndex] = useState(-1);
  const [editedLineData, setEditedLineData] = useState({});
  const [fileName, setFilename] = useState('');
  const [filePath, setFilePath] = useState('');
  const fileInputRef = useRef(null);
  let offsets = [];
  let offsetsobject = [];
  const [offsetTable, setOffsetTable] = useState([]);
  const [objectoffsetTable, setobjectoffsetTable] = useState([]);
  const [customAlert, setCustomAlert] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [importTag, setImportTag] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Add search state
  const [convertedFilename,setConvertedFileName] = useState('');
  const [convertedfilePath,setConvertedFilePath] = useState('');
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    window.api.receive('tag-exists', (data) => {
      console.log(data.message);
      setCustomAlert(true);
      setModalMessage(data.message);
    })
  })

  const handleFileChange = (e) => {
    console.log(e);
    setFilename(e.target.files[0]);

    const file = e.target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'fbx') {
      loadFBXFiles(file);
    } else if (fileExtension === 'gltf' || fileExtension === 'glb') {
      loadGLTFFiles(file);
    }
      else if (fileExtension === 'rvm') {
      const data = {
        name: file.name,
        path: file.path
      };
      window.api.send("rvm-gltf-converter", data);
      window.api.receive('rvm-conversion-success', (data) => {
        console.log(data);
        setConvertedFileName(data.convertedFileName);
        setConvertedFilePath(data.convertedFilePath);
        loadGLTFFiles({ name: data.convertedFilePath.split('/').pop(), path: data.convertedFilePath });
      });
    }
    else if (fileExtension === 'iges') {
      const data = {
        name: file.name,
        path: file.path
      };
      window.api.send("igbs-gltf-converter", data);
      window.api.receive('igbs-conversion-success', (data) => {
        console.log(data);
        setConvertedFileName(data.convertedFileName);
        setConvertedFilePath(data.convertedFilePath);
        loadGLTFFiles({ name: data.convertedFilePath.split('/').pop(), path: data.convertedFilePath });
      });
    }
    
    else if (fileExtension === 'ifc') {
      const data = {
        name: file.name,
        path: file.path
      };
      window.api.send("ifc-gltf-converter", data);
      window.api.receive('ifc-conversion-success', (data) => {
        console.log(data);
        setConvertedFileName(data.convertedFileName);
        setConvertedFilePath(data.convertedFilePath);
        loadGLTFFiles({ name: data.convertedFilePath.split('/').pop(), path: data.convertedFilePath });
      });
    }
    else if (fileExtension === 'dae') {
      const data = {
        name: file.name,
        path: file.path
      };
      window.api.send("dae-gltf-converter", data);
      window.api.receive('dae-conversion-success', (data) => {
        console.log(data);
        setConvertedFileName(data.convertedFileName);
        setConvertedFilePath(data.convertedFilePath);
        loadGLTFFiles({ name: data.convertedFilePath.split('/').pop(), path: data.convertedFilePath });
      });
    }
    else {
      setCustomAlert(true);
      setModalMessage('Unsupported file type. Please select an FBX, GLTF, or GLB file.');
    }
  };

  const handleExcelFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  }

  function generateCustomID(prefix) {
    const uuid = generateUUID();
    const uniqueID = prefix + uuid.replace(/-/g, '').slice(0, 6);
    return uniqueID;
  }

  const loadFBXFiles = (selectedFile) => {
    console.log(selectedFile);
    if (!selectedFile) return;
    const fbxLoader = new FBXLoader();

    const loadedObjects = [];
    const loadedOffsets = [];
    const loadedOffsetsobject = [];
    const offsetBoundingBoxCenters = [];

    const file = selectedFile;
    const id = generateCustomID('F');

    fbxLoader.load(
      URL.createObjectURL(file),
      (object) => {
        const totalMeshes = object.children.length;
        let meshesProcessed = 0;
        console.log('Loaded FBX object:', object);
        loadedObjects.push({ object, filename: file.name });

        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const boundingBox = calculateBoundingBox(child);
            const maxbb = boundingBox.max;
            const minbb = boundingBox.min;

            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            console.log(`File - Mesh Bounding Box Center:`, center.toArray());
            const offset = boundingBox.getCenter(new THREE.Vector3());
            loadedOffsets.push(offset);
            offsets.push(offset);
            offsetBoundingBoxCenters.push({
              fileid: id,
              fileName: file.name.substring(0, file.name.lastIndexOf('.fbx')),
              meshName: child.name,
              tagNo: child.name.replace(/[^a-zA-Z0-9]/g, ''),
              maxbb: maxbb,
              minbb: minbb,
              offset: offset,
            });
            console.log(offsetBoundingBoxCenters);
            meshesProcessed++;
            const progressPercentage = Math.min((meshesProcessed / totalMeshes) * 100, 100);
            setProgress(progressPercentage);
          }
        });

        const boundingBoxobject = calculateBoundingBox(object);
        const maxbbobject = boundingBoxobject.max;
        const minbbobject = boundingBoxobject.min;

        const center = new THREE.Vector3();
        boundingBoxobject.getCenter(center);
        console.log(`File - Bounding Box Center:`, center.toArray());
        const offsetObject = center;
        loadedOffsetsobject.push({
          fileid: id,
          fileName: file.name.substring(0, file.name.lastIndexOf('.fbx')),
          maxbbobject: maxbbobject,
          minbbobject: minbbobject,
          offset: offsetObject,
        });
        offsetsobject.push(offsetObject);
      },
      undefined,
      (error) => {
        console.error('Error loading FBX:', error);
      }
    );

    setOffsetTable(offsetBoundingBoxCenters);
    setobjectoffsetTable(loadedOffsetsobject);
  };

  const loadGLTFFiles = (selectedFile) => {
    console.log(selectedFile);
    if (!selectedFile) return;
    const gltfLoader = new GLTFLoader();

    const loadedObjects = [];
    const loadedOffsets = [];
    const loadedOffsetsobject = [];
    const offsetBoundingBoxCenters = [];

    const file = selectedFile;
    const id = generateCustomID('F');

    gltfLoader.load(
      selectedFile.path ? selectedFile.path : URL.createObjectURL(file),
      (gltf) => {
        const object = gltf.scene;
        const totalMeshes = object.children.length;
        let meshesProcessed = 0;
        console.log('Loaded GLTF object:', object);
        const filenameToUse = convertedFilename || file.name;

        loadedObjects.push({ object, filename: filenameToUse });

        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const boundingBox = calculateBoundingBox(child);
            const maxbb = boundingBox.max;
            const minbb = boundingBox.min;

            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            console.log(`File - Mesh Bounding Box Center:`, center.toArray());
            const offset = boundingBox.getCenter(new THREE.Vector3());
            loadedOffsets.push(offset);
            offsets.push(offset);
            offsetBoundingBoxCenters.push({
              fileid: id,
              fileName: filenameToUse.substring(0, filenameToUse.lastIndexOf('.')),
              meshName: child.name,
              tagNo: child.name.replace(/[^a-zA-Z0-9]/g, ''),
              maxbb: maxbb,
              minbb: minbb,
              offset: offset,
            });
            console.log(offsetBoundingBoxCenters);
            meshesProcessed++;
            const progressPercentage = Math.min((meshesProcessed / totalMeshes) * 100, 100);
            setProgress(progressPercentage);
          }
        });

        const boundingBoxobject = calculateBoundingBox(object);
        const maxbbobject = boundingBoxobject.max;
        const minbbobject = boundingBoxobject.min;
        const center = new THREE.Vector3();
        boundingBoxobject.getCenter(center);
        console.log(`File - Bounding Box Center:`, center.toArray());
        const offsetObject = center;
        loadedOffsetsobject.push({
          fileid: id,
          objectName: filenameToUse.substring(0, filenameToUse.lastIndexOf('.')),
          maxbbobject: maxbbobject,
          minbbobject: minbbobject,
          offset: offsetObject,
        });
        offsetsobject.push(offsetObject);
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF:', error);
      }
    );

    setOffsetTable(offsetBoundingBoxCenters);
    setobjectoffsetTable(loadedOffsetsobject);
  };

  const calculateBoundingBox = (object) => {
    const boundingBox = new THREE.Box3().setFromObject(object);
    return boundingBox;
  };

  const handleDeleteTagFromTable = (number) => {
    console.log(number);
    setCurrentDeleteTag(number);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    window.api.send('remove-Tag-table', currentDeleteTag);
    setShowConfirm(false);
    setCurrentDeleteTag(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setCurrentDeleteTag(null);
  };

  const handleEditOpen = (index) => {
    setEditedRowIndex(index);
    setEditedLineData(alltags[index]);
  }

  const handleCloseEdit = () => {
    setEditedRowIndex(-1);
    setEditedLineData({});
    setProgress(0);
  }

  const handleChange = (field, value) => {
    setEditedLineData({
      ...editedLineData,
      [field]: value
    });
  }

  const handleSave = (number) => {
    const { name: tagname, parenttag:parenttag, type: tagtype, filename: existingFilename, filePath: existingFilePath } = editedLineData;
    const filenameToUse = convertedFilename || fileName.name;
    const filepathToUse = convertedfilePath || fileName.path;
    const data = {
      tagId: number,
      tagname,
      parenttag,
      tagtype,
      fileName: filenameToUse,
      filePath:  filepathToUse ,
      meshtable: offsetTable,
      fileTable: objectoffsetTable,
    };

    // Send data to your backend or API
    window.api.send('update-tag-data', data);
    // Clear state or perform any necessary cleanup
    setEditedRowIndex(-1);
    setEditedLineData({});
    setFilename('');
    setFilePath('');
    setConvertedFileName('');
    setConvertedFilePath('')
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleDeleteAllTags = () => {
    window.api.send('delete-all-tags')
  }

  const handleImportTag = () => {
    setImportTag(true);
  }

  const handleClose = () => {
    setImportTag(false);
  }

  const handleImportClick = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const formattedData = jsonData.map(item => ({
          tagNumber: item['Tag Number*'],
          name: item['Name'],
          type: item['Type*']
        }));

        window.api.send('import-tag', formattedData);
      };
      reader.readAsArrayBuffer(selectedFile);
      setImportTag(false);
      setSelectedFile('');
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ['TagNumber*', 'Name', 'Type*', 'Possible Values for Type'];
  
    const data = [
      { "Tag Number*": "", "Name": "", "Type*": "" }
    ];
  
    // Creating the worksheet with headers and data
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
  
    // Adding possible values for "Type" under the respective header
    XLSX.utils.sheet_add_aoa(ws, [
      ["", "", "", "Line"],
      ["", "", "", "Equipment"],
      ["", "", "", "Valve"],
      ["", "", "", "Structural"],
      ["", "", "", "Others"]
    ], { origin: -1 });
  
    // Set the width of the fourth column
    ws['!cols'] = [
      { wch: 15 }, // Width for TagNumber*
      { wch: 20 }, // Width for Name
      { wch: 10 }, // Width for Type*
      { wch: 30 }  // Width for Possible Values for Type (3 cell widths)
    ];
  
    // Set a background color for the cells in the "Possible Values for Type" column
    const range = XLSX.utils.decode_range(ws['!ref']);
    const bgColor = { fill: { fgColor: { rgb: "FFFF00" } } }; // Yellow background color
  
    for (let R = 1; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ c: 3, r: R });
      if (!ws[cellAddress]) {
        ws[cellAddress] = {}; // Initialize the cell if it doesn't exist
      }
      ws[cellAddress].s = {
        fill: bgColor.fill,
        locked: true,
      };
    }
  
    // Creating a new workbook and appending the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tag-Import-Template');
  
    // Writing the workbook to a file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  
    // Saving the file
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Tag-Import-Template.xlsx');
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTags = alltags.filter(tag =>
    tag.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportTag = () => {
    const headers = [
      'TagNumber*', 'Name', 'Type*'
    ];

    const dataToExport = filteredTags.length > 0 ? filteredTags : [];

    const ws = XLSX.utils.json_to_sheet(dataToExport, { header: headers });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tag List');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Taglist.xlsx');
  };

  return (
    <div style={{ width: '100%', height: '90vh', backgroundColor: 'white', zIndex: '1', position: 'absolute' }}>
      
      <form>
        <div className="table-container">
          <table className='tagTable'>
            <thead>
              <tr>
                <th className="wideHead">Tag number</th>
                <th className="wideHead">Name</th>
                <th className="wideHead">Type</th>
                <th className="wideHead">Parent tag</th>
                <th>Model</th>
                <th className="tableActionCell">
                  <i className="fa fa-download" title="Import" onClick={handleImportTag}></i>                
                  <i className="fa fa-upload ms-3" title="Export" onClick={handleExportTag}></i>
                  <i className="fa-solid fa-trash-can ms-3" title='Delete all' onClick={handleDeleteAllTags}></i>
                </th>
              </tr>
              <tr>
              <th colSpan="6">
        <input
          type="text"
          placeholder="Search by Tag Number or Type"
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: '100%', padding: '5px' }}
        />
      </th>
              </tr>
            </thead>
            <tbody>
              {filteredTags.map((tag, index) => (
                <tr key={index} style={{ color: 'black' }}>
                  <td style={{ backgroundColor: '#f0f0f0' }}>{tag.number}</td>
                  <td>{editedRowIndex === index ? <input onChange={e => handleChange('name', e.target.value)} type="text" value={editedLineData.name || ''} /> : tag.name}</td>
                  <td>{editedRowIndex === index ? <select value={editedLineData.type || ''} onChange={e => handleChange('type', e.target.value)} style={{ width: '100%' }}>
                    <option value="" disabled>
                      Choose type
                    </option>
                    <option value="Line">Line</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Valve">Valve</option>
                    <option value="Structural">Structural</option>
                    <option value="Other">Other</option>
                  </select>
                    : tag.type}</td>
                    <td> {editedRowIndex === index ? (
          <select value={editedLineData.parenttag || ''} onChange={e => handleChange('parenttag', e.target.value)} style={{ width: '100%' }}>
            <option value="" disabled>
              Choose parent tag
            </option>
            {alltags.map((tag, idx) => (
              <option key={idx} value={tag.number}>
                {tag.number}
              </option>
            ))}
          </select>
        ) : (
          tag.parenttag
        )}</td>
                  <td>{editedRowIndex === index ? <>Currentfile:{tag.filename}
                    <input
                      type="file" ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: 'block' }}
                    />
                    <div className="row z-up" style={{ paddingTop: '20px' }}>
                            <div className="col">
                                {fileName && <FileUploadProgress progress={progress} />}
                            </div>
                        </div>
                  </> : tag.filename}</td>
                  <td style={{ backgroundColor: '#f0f0f0' }}>
                    {editedRowIndex === index ?
                      <>
                        <i className="fa-solid fa-floppy-disk text-success" onClick={() => handleSave(tag.tagId)}></i>
                        <i className="fa-solid fa-xmark ms-3 text-danger" onClick={handleCloseEdit}></i>
                      </>
                      :
                      <>
                        <i className="fa-solid fa-pencil" onClick={() => handleEditOpen(index)}></i>
                        <i className="fa-solid fa-trash-can ms-3" onClick={() => handleDeleteTagFromTable(tag.tagId)}></i>
                      </>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>

      {importTag &&
        <Modal
          onHide={handleClose}
          show={importTag}
          backdrop="static"
          keyboard={false}
          dialogClassName="custom-modal"
        >
          <div className="tag-dialog">
            <div className="title-dialog">
              <p className='text-light'>Import Tag</p>
              <p className='text-light cross' onClick={handleClose}>&times;</p>
            </div>
            <div className="dialog-input">
              <label>File</label>
              <input
                type="file" onChange={handleExcelFileChange} />
              <a onClick={handleDownloadTemplate} style={{ cursor: 'pointer', color: ' #00BFFF' }}>Download template</a>
            </div>
            <div className='dialog-button' style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', bottom: 0 }}>
              <button className='btn btn-secondary' onClick={handleClose}>Cancel</button>
              <button className='btn btn-dark' onClick={handleImportClick}>Upload</button>
            </div>
          </div>
        </Modal>
      }

      {customAlert && (
        <Alert
          message={modalMessage}
          onAlertClose={() => setCustomAlert(false)}
        />
      )}
      {showConfirm && (
        <DeleteConfirm
          message="Are you sure you want to delete?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

    </div>
  )
}

export default ViewTagTable;
