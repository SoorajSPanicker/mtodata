import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import Alert from './Alert';
import { generateUUID } from 'three/src/math/MathUtils.js';
import FileUploadProgress from './FileUploadProgress';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';


function TagRegistration({setLoading,alltags}) {
  const [progress, setProgress] = useState(0);
  const [tagNo, setTagNo] = useState('');
  const [tagname, setTagName] = useState('');
  const [parentTag,setParentTag] =useState('')
  const [tagtype, setTagType] = useState('');
  const [fileName, setFilename] = useState('');
  const [filePath, setFilePath] = useState('');
  const fileInputRef = useRef(null);
  let offsets = [];
  let offsetsobject = [];
  const [offsetTable, setOffsetTable] = useState([]);
  const [objectoffsetTable, setobjectoffsetTable] = useState([]);
  const [customAlert, setCustomAlert] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [convertedFilename,setConvertedFileName] = useState('');
  const [convertedfilePath,setConvertedFilePath] = useState('');

  useEffect(() => {
    window.api.receive('tag-exists', (data) => {
      console.log(data.message);
      setCustomAlert(true);
      setModalMessage(data.message);
    });
  }, []);

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
    else if (fileExtension === 'iges' || fileExtension === 'igs') {
      const data = {
        name: file.name,
        path: file.path
      };
      window.api.send("iges-gltf-converter", data);
      window.api.receive('iges-conversion-success', (data) => {
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

  function generateCustomID(prefix) {
    const uuid = generateUUID();
    const uniqueID = prefix + uuid.replace(/-/g, '').slice(0, 6);
    return uniqueID;
  }

  // const loadFBXFiles = (selectedFile) => {
  //   console.log(selectedFile);
  //   if (!selectedFile) return;
  //       const fbxLoader = new FBXLoader();

  //   const loadedObjects = [];
  //   const loadedOffsets = [];
  //   const loadedOffsetsobject = [];
  //   const offsetBoundingBoxCenters = [];

  //   const file = selectedFile;
  //   const id = generateCustomID('F');

  //   fbxLoader.load(
  //     URL.createObjectURL(file),
  //     (object) => {
  //       console.log('Loaded FBX object:', object);
  //       loadedObjects.push({ object, filename: file.name });
  //       const totalMeshes = object.children.length;
  //       let meshesProcessed = 0;

  //       object.traverse((child) => {
  //         if (child instanceof THREE.Mesh) {
  //           const boundingBox = calculateBoundingBox(child);
  //           const maxbb = boundingBox.max;
  //           const minbb = boundingBox.min;

  //           const center = new THREE.Vector3();
  //           boundingBox.getCenter(center);
  //           console.log(`File - Mesh Bounding Box Center:`, center.toArray());
  //           const offset = boundingBox.getCenter(new THREE.Vector3());
  //           loadedOffsets.push(offset);
  //           offsets.push(offset);
  //           offsetBoundingBoxCenters.push({
  //             fileid: id,
  //             fileName: file.name.substring(0, file.name.lastIndexOf('.fbx')),
  //             meshName: child.name,
  //             tagNo: child.name.replace(/[^a-zA-Z0-9]/g, ''),
  //             maxbb: maxbb,
  //             minbb: minbb,
  //             offset: offset,
  //           });
  //           console.log(offsetBoundingBoxCenters);
  //           meshesProcessed++;
  //           const progressPercentage = Math.min((meshesProcessed / totalMeshes) * 100, 100);
  //           setProgress(progressPercentage);
  //         }
  //       });

  //       const boundingBoxobject = calculateBoundingBox(object);
  //       const maxbbobject = boundingBoxobject.max;
  //       const minbbobject = boundingBoxobject.min;

  //       const center = new THREE.Vector3();
  //       boundingBoxobject.getCenter(center);
  //       console.log(`File - Bounding Box Center:`, center.toArray());
  //       const offsetObject = center;
  //       loadedOffsetsobject.push({
  //         fileid: id,
  //         objectName: file.name.substring(0, file.name.lastIndexOf('.fbx')),
  //         maxbbobject: maxbbobject,
  //         minbbobject: minbbobject,
  //         offset: offsetObject,
  //       });
  //       offsetsobject.push(offsetObject);
  //     },

  //     undefined,
  //     (error) => {
  //       console.error('Error loading FBX:', error);
  //     }

  //   );

  //   setOffsetTable(offsetBoundingBoxCenters);
  //   setobjectoffsetTable(loadedOffsetsobject);
  // };

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
        console.log('Loaded FBX object:', object);
        
        // Convert FBX to GLB
        const exporter = new GLTFExporter();
        exporter.parse(object, async (gltf) => {
          const glbBuffer = Buffer.from(gltf);
          console.log(glbBuffer);
          const glbFilename = file.name.replace('.fbx', '.glb');
          
          // Send the GLB data to the main process to save it
          try {
            const result = await window.api.send('save-glb-file', {
              path: file.path,
              filename: glbFilename,
              data: glbBuffer
            });
  
            if (result.success) {
              // Update state with the new GLB file info
              setConvertedFileName(glbFilename);
              setConvertedFilePath(result.filePath);
  
              // Process the converted GLB
              processConvertedGLB(object, glbFilename, id);
            } else {
              console.error('Failed to save GLB file:', result.error);
              setCustomAlert(true);
              setModalMessage('Failed to save converted GLB file. Please try again.');
            }
          } catch (error) {
            console.error('Error saving GLB file:', error);
            setCustomAlert(true);
            setModalMessage('An error occurred while saving the converted file. Please try again.');
          }
        }, { binary: true }); // Set to true for GLB format
      },
      undefined,
      (error) => {
        console.error('Error loading FBX:', error);
        setCustomAlert(true);
        setModalMessage('Error loading FBX file. Please try again.');
      }
    );
  
    const processConvertedGLB = (object, filename, id) => {
      loadedObjects.push({ object, filename });
      const totalMeshes = object.children.length;
      let meshesProcessed = 0;
  
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
            fileName: filename,
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
        objectName: filename,
        maxbbobject: maxbbobject,
        minbbobject: minbbobject,
        offset: offsetObject,
      });
      offsetsobject.push(offsetObject);
  
      setOffsetTable(offsetBoundingBoxCenters);
      setobjectoffsetTable(loadedOffsetsobject);
    };
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
        console.log('Loaded GLTF object:', object);
        const filenameToUse = convertedFilename || file.name;
        console.log("filenameToUse",filenameToUse);

        loadedObjects.push({ object, filename: filenameToUse });
        const totalMeshes = object.children.length;
        let meshesProcessed = 0;
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
              fileName: filenameToUse,
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
          objectName: filenameToUse,
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

  const handleOk = async () => {
    console.log(tagNo);
    console.log(tagname);
    console.log(tagtype);
    console.log(fileName.name);
    console.log(fileName.path);
    const filenameToUse = convertedFilename || fileName.name;
    const filepathToUse = convertedfilePath || fileName.path;

    if (!tagNo || !tagtype) {
      setCustomAlert(true);
      setModalMessage('TagNo & tagtype is mandatory');
      return;
    } else {
      setFilePath(fileName.path);
      const data = {
        tagNo: tagNo,
        tagname: tagname,
        parentTag:parentTag,
        tagtype: tagtype,
        fileName: filenameToUse,
        filePath: filepathToUse,
        meshtable: offsetTable,
        fileTable: objectoffsetTable,
      };
      console.log(objectoffsetTable);
      window.api.send('save-tag-data', data);
      setLoading(true);
      console.log('send request to store data');
      setTagNo('');
      setTagName('');
      setParentTag('');
      setTagType('');
      setFilename('');
      setFilePath('');
      setProgress(0);
      setConvertedFileName('');
      setConvertedFilePath('')
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div style={{ zIndex: '1', position: 'absolute', width: '100%', backgroundColor: '#33334c' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div id="bulkImportDiv">
          <div className="page">
            <section className="page-section">
              <div className="row">
                <h4>Tag Registration</h4>
              </div>
            </section>
            <hr />
            <section className="page-section">
              <div className="row">
                <div className="col-md-6">
                  <div className="dialog-input" style={{ fontSize: '13px', lineHeight: '30px' }}>
                    <label>
                      Tag number<span style={{ fontSize: '11px' }}>*</span>
                    </label>
                    <input type="text" value={tagNo} onChange={(e) => setTagNo(e.target.value)} />
                    <label>Parent Tag:</label>
          <select value={parentTag} onChange={(e) => setParentTag(e.target.value)} style={{ width: '100%' }}>
            <option value="">Select Parent Tag</option>
            {alltags.map((tag,index) => (
              <option key={index} value={tag.name}>{tag.number}</option>
            ))}
          </select>
                    <label>Name</label>
                    <input type="text" value={tagname} onChange={(e) => setTagName(e.target.value)} />
                    <label>
                      Type<span style={{ fontSize: '11px' }}>*</span>
                    </label>
                    <select value={tagtype} onChange={(e) => setTagType(e.target.value)} style={{ width: '100%' }}>
                      <option value="" disabled>
                        Choose type
                      </option>
                      <option value="Line">Line</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Valve">Valve</option>
                      <option value="Structural">Structural</option>
                      <option value="Other">Other</option>
                    </select>
                    <label>Model</label>
                    <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e)} />
                    <div className="row z-up" style={{ paddingTop: '20px' }}>
                            <div className="col">
                                {fileName && <FileUploadProgress progress={progress} />}
                            </div>
                        </div>
                  </div>
                </div>
              </div>
              <hr />
              <button onClick={handleOk} className="btn btn-light" style={{ fontSize: '12px' }}>
                Register
              </button>
            </section>
          </div>
        </div>
      </div>
      {customAlert && <Alert message={modalMessage} onAlertClose={() => setCustomAlert(false)} />}
    </div>
  );
}

export default TagRegistration;
