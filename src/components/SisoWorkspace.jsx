// import React, { useEffect, useState, useRef } from 'react';
// import * as BABYLON from '@babylonjs/core';
// import { SceneLoader } from '@babylonjs/core';
// import '@babylonjs/loaders/glTF';

// function SisoWorkspace({ isofilepath }) {
//     const [path, setPath] = useState('');
//     const canvasRef = useRef(null);
//     const engineRef = useRef(null);
//     const sceneRef = useRef(null);
//     // Add refs for cameras
//     const arcRotateCameraRef = useRef(null);
//     // const universalCameraRef = useRef(null);
//     const freeCameraRef = useRef(null);

//     // Add camera setup function
//     const setupCameras = (scene) => {
//         // Create arc rotate camera
//         arcRotateCameraRef.current = new BABYLON.ArcRotateCamera(
//             "arcRotateCamera",
//             Math.PI / 2,
//             Math.PI / 2,
//             10,
//             BABYLON.Vector3.Zero(),
//             scene
//         );
//         arcRotateCameraRef.current.attachControl(canvasRef.current, true);
//         arcRotateCameraRef.current.minZ = 0.1;
//         arcRotateCameraRef.current.maxZ = 1000;
//         arcRotateCameraRef.current.lowerRadiusLimit = 0.1;
//         arcRotateCameraRef.current.upperRadiusLimit = 1000;
//         arcRotateCameraRef.current.wheelPrecision = 50;

//         // // Create universal camera
//         // universalCameraRef.current = new BABYLON.UniversalCamera(
//         //     "universalCamera",
//         //     new BABYLON.Vector3(0, 5, -10),
//         //     scene
//         // );
//         // universalCameraRef.current.setTarget(BABYLON.Vector3.Zero());
//         // universalCameraRef.current.attachControl(canvasRef.current, true);
//         // universalCameraRef.current.minZ = 0.1;
//         // universalCameraRef.current.maxZ = 1000;
//         // universalCameraRef.current.speed = 0.5;
//         // universalCameraRef.current.keysUp.push(87);    // W
//         // universalCameraRef.current.keysDown.push(83);  // S
//         // universalCameraRef.current.keysLeft.push(65);  // A
//         // universalCameraRef.current.keysRight.push(68); // D

//         freeCameraRef.current = new BABYLON.FreeCamera(
//             "freeCamera",
//             new BABYLON.Vector3(0, 5, -10),
//             scene
//         );
//         freeCameraRef.current.setTarget(BABYLON.Vector3.Zero());
//         freeCameraRef.current.attachControl(canvasRef.current, true);
//         freeCameraRef.current.minZ = 0.1;
//         freeCameraRef.current.maxZ = 1000;
//         freeCameraRef.current.speed = 0.5;
//         freeCameraRef.current.angularSensibility = 1000; // Mouse look sensitivity
//         freeCameraRef.current.keysUp.push(87);    // W
//         freeCameraRef.current.keysDown.push(83);  // S
//         freeCameraRef.current.keysLeft.push(65);  // A
//         freeCameraRef.current.keysRight.push(68); // D

//         // Set initial active camera
//         scene.activeCamera = arcRotateCameraRef.current;
//     };

//     // Add camera switching handlers
//     // const setupCameraControls = () => {
//     //     const orbitButton = document.getElementById('sisoOrbitCamera');
//     //     const universalButton = document.getElementById('sisoUniversalCamera');

//     //     orbitButton.addEventListener('click', () => {
//     //         if (sceneRef.current && arcRotateCameraRef.current) {
//     //             // Store current camera position and target
//     //             const currentPosition = sceneRef.current.activeCamera.position.clone();
//     //             const currentTarget = sceneRef.current.activeCamera.target || BABYLON.Vector3.Zero();

//     //             // Switch to arc rotate camera
//     //             sceneRef.current.activeCamera = arcRotateCameraRef.current;
//     //             arcRotateCameraRef.current.setPosition(currentPosition);
//     //             arcRotateCameraRef.current.setTarget(currentTarget);

//     //             // Update UI
//     //             orbitButton.style.opacity = 1;
//     //             universalButton.style.opacity = 0.5;
//     //         }
//     //     });

//     //     universalButton.addEventListener('click', () => {
//     //         if (sceneRef.current && universalCameraRef.current) {
//     //             // Store current camera position and target
//     //             const currentPosition = sceneRef.current.activeCamera.position.clone();
//     //             const currentTarget = sceneRef.current.activeCamera.target || BABYLON.Vector3.Zero();

//     //             // Switch to universal camera
//     //             sceneRef.current.activeCamera = universalCameraRef.current;
//     //             universalCameraRef.current.position = currentPosition;
//     //             universalCameraRef.current.setTarget(currentTarget);

//     //             // Update UI
//     //             orbitButton.style.opacity = 0.5;
//     //             universalButton.style.opacity = 1;
//     //         }
//     //     });
//     // };

//     const setupCameraControls = () => {
//         const orbitButton = document.getElementById('sisoOrbitCamera');
//         const universalButton = document.getElementById('sisoUniversalCamera');

//         orbitButton.addEventListener('click', () => {
//             if (sceneRef.current && arcRotateCameraRef.current) {
//                 // Store current camera position and target
//                 const currentPosition = sceneRef.current.activeCamera.position.clone();
//                 const currentTarget = sceneRef.current.activeCamera.target || BABYLON.Vector3.Zero();

//                 // Switch to arc rotate camera
//                 sceneRef.current.activeCamera = arcRotateCameraRef.current;
//                 arcRotateCameraRef.current.setPosition(currentPosition);
//                 arcRotateCameraRef.current.setTarget(currentTarget);

//                 // Update UI
//                 orbitButton.style.opacity = 1;
//                 universalButton.style.opacity = 0.5;
//             }
//         });

//         universalButton.addEventListener('click', () => {
//             if (sceneRef.current && freeCameraRef.current) { // Changed from universalCameraRef
//                 // Store current camera position and target
//                 const currentPosition = sceneRef.current.activeCamera.position.clone();
//                 const currentTarget = sceneRef.current.activeCamera.target || BABYLON.Vector3.Zero();

//                 // Switch to free camera
//                 sceneRef.current.activeCamera = freeCameraRef.current;
//                 freeCameraRef.current.position = currentPosition;
//                 freeCameraRef.current.setTarget(currentTarget);

//                 // Update UI
//                 orbitButton.style.opacity = 0.5;
//                 universalButton.style.opacity = 1;
//             }
//         });
//     };


//     useEffect(() => {
//         if (!isofilepath?.filePath) return;

//         console.log('File path:', isofilepath.filePath);
//         setPath(isofilepath.filePath);

//         // Initialize engine and scene if not already done
//         if (!engineRef.current && canvasRef.current) {
//             engineRef.current = new BABYLON.Engine(canvasRef.current, true, {
//                 preserveDrawingBuffer: true,
//                 stencil: true
//             });
//             sceneRef.current = new BABYLON.Scene(engineRef.current);

//             // Set scene clear color
//             sceneRef.current.clearColor = new BABYLON.Color4(0.2, 0.2, 0.3, 1);


//             // Setup cameras
//             setupCameras(sceneRef.current);

//             // Setup camera controls
//             setupCameraControls();

//             // // Create camera
//             // const camera = new BABYLON.ArcRotateCamera(
//             //     "camera",
//             //     Math.PI / 2,
//             //     Math.PI / 2,
//             //     10,
//             //     BABYLON.Vector3.Zero(),
//             //     sceneRef.current
//             // );
//             // camera.attachControl(canvasRef.current, true);
//             // camera.minZ = 0.1;
//             // camera.maxZ = 1000;
//             // camera.lowerRadiusLimit = 0.1;
//             // camera.upperRadiusLimit = 1000;
//             // camera.wheelPrecision = 50;

//             // Add lights
//             const hemiLight = new BABYLON.HemisphericLight(
//                 "hemiLight",
//                 new BABYLON.Vector3(0, 1, 0),
//                 sceneRef.current
//             );
//             hemiLight.intensity = 0.7;
//             hemiLight.groundColor = new BABYLON.Color3(0.2, 0.2, 0.2);

//             const dirLight = new BABYLON.DirectionalLight(
//                 "dirLight",
//                 new BABYLON.Vector3(-1, -2, -1),
//                 sceneRef.current
//             );
//             dirLight.intensity = 0.5;
//             dirLight.position = new BABYLON.Vector3(20, 40, 20);

//             // Start render loop
//             engineRef.current.runRenderLoop(() => {
//                 if (sceneRef.current) {
//                     sceneRef.current.render();
//                 }
//             });

//             // Handle window resize
//             window.addEventListener('resize', () => {
//                 if (engineRef.current) {
//                     engineRef.current.resize();
//                 }
//             });
//         }

//         // Load the GLB file
//         const loadModel = async () => {
//             if (!sceneRef.current) return;

//             try {
//                 // Clear existing meshes
//                 while (sceneRef.current.meshes.length > 0) {
//                     sceneRef.current.meshes[0].dispose();
//                 }

//                 // Get file directory and name
//                 const lastSlashIndex = isofilepath.filePath.lastIndexOf('\\');
//                 const fileDir = isofilepath.filePath.substring(0, lastSlashIndex + 1);
//                 const fileName = isofilepath.filePath.substring(lastSlashIndex + 1);

//                 console.log('Loading from:', fileDir, fileName);

//                 // Load the model using SceneLoader
//                 const result = await SceneLoader.ImportMeshAsync(
//                     "",
//                     "file:///" + fileDir.replace(/\\/g, '/'),
//                     fileName,
//                     sceneRef.current
//                 );

//                 console.log('Model loaded:', result);

//                 // Process all meshes
//                 result.meshes.forEach((mesh, index) => {
//                     // Ensure mesh is visible and enabled
//                     mesh.isVisible = true;
//                     mesh.setEnabled(true);

//                     // Create default material if none exists
//                     if (!mesh.material) {
//                         const material = new BABYLON.StandardMaterial(`mat_${index}`, sceneRef.current);
//                         material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
//                         material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
//                         material.backFaceCulling = false;
//                         mesh.material = material;
//                     }
//                 });

//                 // Calculate scene bounds
//                 const meshesWithGeometry = result.meshes.filter(mesh => mesh.geometry);
//                 if (meshesWithGeometry.length > 0) {
//                     let minX = Number.POSITIVE_INFINITY;
//                     let minY = Number.POSITIVE_INFINITY;
//                     let minZ = Number.POSITIVE_INFINITY;
//                     let maxX = Number.NEGATIVE_INFINITY;
//                     let maxY = Number.NEGATIVE_INFINITY;
//                     let maxZ = Number.NEGATIVE_INFINITY;

//                     meshesWithGeometry.forEach(mesh => {
//                         const boundingInfo = mesh.getBoundingInfo();
//                         const min = boundingInfo.boundingBox.minimumWorld;
//                         const max = boundingInfo.boundingBox.maximumWorld;

//                         minX = Math.min(minX, min.x);
//                         minY = Math.min(minY, min.y);
//                         minZ = Math.min(minZ, min.z);
//                         maxX = Math.max(maxX, max.x);
//                         maxY = Math.max(maxY, max.y);
//                         maxZ = Math.max(maxZ, max.z);
//                     });

//                     // Calculate center and radius
//                     const center = new BABYLON.Vector3(
//                         (minX + maxX) / 2,
//                         (minY + maxY) / 2,
//                         (minZ + maxZ) / 2
//                     );
//                     const radius = Math.max(
//                         maxX - minX,
//                         maxY - minY,
//                         maxZ - minZ
//                     );

//                     // Position camera
//                     const camera = sceneRef.current.activeCamera;
//                     camera.setTarget(center);
//                     camera.radius = radius * 1.5;
//                     camera.alpha = Math.PI / 4;  // 45 degrees
//                     camera.beta = Math.PI / 3;   // 60 degrees
//                 }

//             } catch (error) {
//                 console.error("Error loading model:", error);
//             }
//         };

//         loadModel();

//         // Cleanup
//         return () => {
//             if (sceneRef.current) {
//                 sceneRef.current.dispose();
//             }
//             if (engineRef.current) {
//                 engineRef.current.dispose();
//             }
//         };
//     }, [isofilepath]);
//     return (
//         <div id="sisoWorkspace" style={{ zIndex: '3' }} >
//             <div id="sisoCanvasDiv" className="pad">
//                 <div id="siso3D">
//                     <canvas id="sisoCanvas" ref={canvasRef} style={{ width: '100%', height: '100%', touchAction: 'none' }} />
//                     {/* <input type="checkbox" id="sisoFsFlag" /> */}

//                     <div id="sisoCanvasCtrls">

//                         {/* <img
//                             id="sisoOrbitCamera"
//                             className="button"
//                             src="images/orbit.png"
//                             title="Orbit camera"
//                             onClick={switchToOrbitCamera}  // Add onClick handler
//                             style={{ cursor: 'pointer' }}  // Add pointer cursor
//                         />
//                         <img
//                             id="sisoUniversalCamera"
//                             className="button"
//                             src="images/universal.png"
//                             title="Universal camera"
//                             onClick={switchToUniversalCamera}  // Add onClick handler
//                             style={{ cursor: 'pointer' }}  // Add pointer cursor
//                         /> */}



//                         <img id="sisoOrbitCamera" class="button" src="images/orbit.png" title="Orbit camera" />
//                         <img id="sisoUniversalCamera" class="button" src="images/universal.png" title="Universal camera" />
//                         <img id="sisoWebVRFreeCamera" class="button" src="images/web-vr-free.png" title="Virtual reality" />
//                         <img id="sisoCameraPerspective" class="button" src="images/perspective.png" title="Perspective view" />
//                         <img id="sisoCameraOrthographic" class="button" src="images/orthographic.png" title="Orthographic view" />
//                         <img id="sisoZoomAll" class="button" src="images/zoomfit.png" title="Zoom fit" />
//                         <img id="commentSisoAll" class="button" src="images/comment.png" title="Comments" />
//                         <img id="sisoFrontView" class="button" src="images/front.png" title="Front view" />
//                         <img id="sisoLeftView" class="button" src="images/left.png" title="Left view" />
//                         <img id="sisoBackView" class="button" src="images/back.png" title="Back view" />
//                         <img id="sisoRightView" class="button" src="images/right.png" title="Right view" />
//                         <img id="sisoTopView" class="button" src="images/top.png" title="Top view" />
//                         <img id="sisoBottomView" class="button" src="images/bottom.png" title="Bottom view" />
//                         <img id="sisoMeasure" class="button" src="images/measure.png" title="Measure" />
//                         <img id="sisoWireframe" class="button" src="images/wireframe.png" title="Wireframe" />
//                         <img id="sisoFocus" class="button" src="images/focus.png" title="Focus" />
//                     </div>

//                     {/* <input type="checkbox" id="sisoMeasureFlag" className="measureFlag hidden" /> */}

//                     {/* <div id="sisoMeasureDiv" className="measureDiv">
//                         <div className="measureInfo">
//                             <table className="measureInfoTable">
//                                 <tbody>
//                                     <tr className="bottomBordered">
//                                         <th className="measureCornerCell left"></th>
//                                         <th>X</th>
//                                         <th>Y</th>
//                                         <th>Z</th>
//                                     </tr>

//                                     <tr>
//                                         <th className="left">P<sub>1</sub></th>
//                                         <td>{{sisoP1.x}}</td>
//                                                 <td>{{sisoP1.z}}</td>
//                                                 <td>{{sisoP1.y}}</td>
//                                     </tr>

//                                     <tr>
//                                         <th className="left">P<sub>2</sub></th>
//                                         <td>{{sisoP2.x}}</td>
//                                                 <td>{{sisoP2.z}}</td>
//                                                 <td>{{sisoP2.y}}</td>
//                                     </tr>

//                                     <tr>
//                                         <th className="left">Difference</th>
//                                         <td>{{sisoDifference.x}}</td>
//                                                 <td>{{sisoDifference.z}}</td>
//                                                 <td>{{sisoDifference.y}}</td>
//                                     </tr>

//                                     <tr className="topBordered">
//                                         <th className="left">Distance</th>
//                                         <td colspan="3">{{sisoDistance}}</td>
//                                     </tr>

//                                     <tr className="topBordered">
//                                         <th className="left">Angle</th>
//                                         <td colspan="3">{{sisoTheta}} &emsp; {{sisoPhi}}</td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>

//                         <div className="hsMeasureInfo" >Measurements</div>
//                     </div> */}
//                 </div>

//                 <div id="sisoSwitchDiv">
//                     <i id="sisoFullscreen" className="fa fa-expand fa-2x sisoSwitch" title="Enter fullscreen"></i>
//                     <i id="sisoDimSwitch" className="fa fa-stop fa-2x sisoSwitch" title="2D"></i>
//                     <i id="sisoDocSwitch" className="fa fa-link fa-2x sisoSwitch" title="Reference documents"></i>
//                     <i id="sisoUploadMPFile" className="fa fa-plus-circle fa-2x sisoSwitch" ></i>
//                 </div>
//             </div>

//             {/* <div id="sisoSideDiv">
//                 <div id="sisoMTODiv" className="pad">
//                     <h2>Bill of material</h2>
//                     <i className='fa fa-expand expandButton' ></i>
//                     <i className='fa fa-plus-circle cornerButton' ></i>

//                     <div className="sisoContentDiv">
//                         <h3>Shop materials</h3>

//                         <div className="sisoMatTableDiv">
//                             <table>
//                                 <tbody id="sisoShopMats">
//                                     <tr>
//                                         <th className="min">Sl. no.</th>
//                                         <th className="min">Size</th>
//                                         <th>Description</th>
//                                         <th className="min">Quantity</th>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>

//                         <h3>Field materials</h3>

//                         <div className="sisoMatTableDiv">
//                             <table>
//                                 <tbody id="sisoFieldMats">
//                                     <tr>
//                                         <th className="min">Sl. no.</th>
//                                         <th className="min">Size</th>
//                                         <th>Description</th>
//                                         <th className="min">Quantity</th>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>

//                 <div id="sisoRevisionDiv" className="pad">
//                     <h2>Revisions</h2>
//                     <i className='fa fa-expand expandButton' ></i>
//                     <i className='fa fa-plus-circle cornerButton' ></i>

//                     <div className="sisoContentDiv">
//                         <table>
//                             <tbody id="sisoRevisions">
//                                 <tr>
//                                     <th className="min">Rev. no.</th>
//                                     <th className="min">Date</th>
//                                     <th>Description</th>
//                                     <th className="min">Prepared</th>
//                                     <th className="min">Checked</th>
//                                     <th className="min">Approved</th>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 <div id="sisoDocDataDiv" className="pad">
//                     <div className="sisoDdBlock">
//                         <label className="sisoLabel">Number</label>
//                         <input type="text" disabled />
//                     </div>

//                     <div className="sisoDdBlock">
//                         <label className="sisoLabel">Name</label>
//                         <input type="text" disabled />
//                     </div>

//                     <div className="sisoDdBlock">
//                         <label className="sisoLabel">Sheet number</label>
//                         <input type="text" disabled />
//                     </div>

//                     <div className="sisoDdBlock">
//                         <label className="sisoLabel">Line</label>
//                         <input type="text" disabled />
//                     </div>
//                 </div>
//             </div>

//             <div id="sisoBottomDiv">
//                 <div id="sisoNotesDiv" className="pad">
//                     <h2>Notes</h2>
//                     <i className='fa fa-expand expandButton' ></i>
//                     <i className='fa fa-plus-circle cornerButton' ></i>

//                     <div className="sisoContentDiv">
//                         <ol id="sisoNotes"></ol>
//                     </div>
//                 </div>

//                 <div id="sisoLineDataDiv" className="pad">
//                     <h2>Line data</h2>
//                     <i className='fa fa-expand expandButton' ></i>

//                     <div id="sisoLdContentDiv" className="sisoContentDiv">
//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Fluid code</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Line ID</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Medium</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Line size (inch)</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Line size (NB)</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Piping spec.</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Insulation type</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Insulation thickness</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div class="sisoLdBlock">
//                             <label class="sisoLabel">Heat trace</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Line from</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Line to</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div class="sisoLdBlock">
//                             <label class="sisoLabel">Maximum operating pressure (bar)</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Maximum operating temperature (ºC)</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Design pressure (bar)</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Minimum design temperature (ºC)</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Maximum design temperature (ºC)</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Test pressure (bar)</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Test medium</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Test medium phase</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Mass flow (kg/hr)</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Volume flow (m<sup>3</sup>/hr)</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Density (kg/m<sup>3</sup>)</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Velocity (m/s)</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Paint system</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">NDT group</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">Chemical cleaning</label>
//                             <input type="text" disabled />
//                         </div>

//                         <div className="sisoLdBlock">
//                             <label className="sisoLabel">PWHT</label>
//                             <input type="text" disabled />
//                         </div>
//                     </div>
//                 </div>
//             </div> */}
//         </div>
//     )
// }

// export default SisoWorkspace


// import React, { useEffect, useState, useRef } from 'react';
// import * as BABYLON from 'babylonjs';

// function SisoWorkspace({ isofilepath }) {
//     const [path, setPath] = useState('');
//     const canvasRef = useRef(null);
//     const engineRef = useRef(null);
//     const sceneRef = useRef(null);

//     useEffect(() => {
//         console.log(isofilepath);
//         console.log(isofilepath.filePath);
//         setPath(isofilepath.filePath);

//         // Initialize Babylon.js scene
//         if (canvasRef.current) {
//             // Create engine
//             engineRef.current = new BABYLON.Engine(canvasRef.current, true);

//             // Create scene
//             const createScene = () => {
//                 const scene = new BABYLON.Scene(engineRef.current);
//                 sceneRef.current = scene;

//                 // Add camera
//                 const camera = new BABYLON.ArcRotateCamera(
//                     "camera",
//                     0,
//                     Math.PI / 3,
//                     10,
//                     BABYLON.Vector3.Zero(),
//                     scene
//                 );
//                 camera.attachControl(canvasRef.current, true);

//                 // Add light
//                 const light = new BABYLON.HemisphericLight(
//                     "light",
//                     new BABYLON.Vector3(0, 1, 0),
//                     scene
//                 );

//                 // Load and display the 3D model from path
//                 if (path) {
//                     BABYLON.SceneLoader.ImportMesh(
//                         "",
//                         path,
//                         "",
//                         scene,
//                         function (meshes) {
//                             // Handle successful load
//                             console.log("Model loaded successfully:", meshes);

//                             // Adjust camera to focus on the loaded model
//                             if (meshes.length > 0) {
//                                 const boundingBox = meshes[0].getBoundingInfo().boundingBox;
//                                 camera.setTarget(boundingBox.centerWorld);
//                                 camera.radius = boundingBox.maximumWorld.subtract(boundingBox.minimumWorld).length() * 1.5;
//                             }
//                         },
//                         null,
//                         function (scene, message) {
//                             // Handle error
//                             console.error("Error loading model:", message);
//                         }
//                     );
//                 }

//                 return scene;
//             };

//             // Create the scene
//             const scene = createScene();

//             // Run the render loop
//             engineRef.current.runRenderLoop(() => {
//                 scene.render();
//             });

//             // Handle window resize
//             window.addEventListener('resize', () => {
//                 engineRef.current.resize();
//             });
//         }

//         // Cleanup
//         return () => {
//             if (engineRef.current) {
//                 engineRef.current.dispose();
//             }
//         };
//     }, [isofilepath, path]);

//     return (
//         <div id="sisoWorkspace" style={{ zIndex: '3' }}>
//             <div id="sisoCanvasDiv" className="pad">
//                 <div id="siso3D">
//                     <canvas
//                         ref={canvasRef}
//                         id="sisoCanvas"
//                         style={{ width: '100%', height: '100%' }}
//                     />
//                     {/* Rest of your existing canvas-related elements */}
//                 </div>
//                 {/* Rest of your existing component JSX */}
//             </div>
//             {/* Rest of your existing component structure */}
//         </div>
//     );
// }

// export default SisoWorkspace;

// import React, { useEffect, useState, useRef } from 'react';
// import * as BABYLON from 'babylonjs';
// import "babylonjs-loaders";
// import { SceneLoader } from 'babylonjs';
// import '@babylonjs/loaders/glTF';

// function SisoWorkspace({ isofilepath }) {
//     const [path, setPath] = useState('');
//     const canvasRef = useRef(null);
//     const engineRef = useRef(null);
//     const sceneRef = useRef(null);

//     useEffect(() => {
//         if (!isofilepath?.filePath) return;

//         console.log('File path:', isofilepath.filePath);
//         setPath(isofilepath.filePath);

//         if (!canvasRef.current) return;

//         // Create engine
//         engineRef.current = new BABYLON.Engine(canvasRef.current, true);

//         // Create scene
//         const createScene = async () => {
//             const scene = new BABYLON.Scene(engineRef.current);
//             sceneRef.current = scene;

//             // Add camera
//             const camera = new BABYLON.ArcRotateCamera(
//                 "camera",
//                 0,
//                 Math.PI / 3,
//                 10,
//                 BABYLON.Vector3.Zero(),
//                 scene
//             );
//             camera.attachControl(canvasRef.current, true);

//             // Add light
//             const light = new BABYLON.HemisphericLight(
//                 "light",
//                 new BABYLON.Vector3(0, 1, 0),
//                 scene
//             );

//             try {
//                 // Read the file using the File System API
//                 const fileData = await window.fs.readFile(isofilepath.filePath);

//                 // Convert the array buffer to a Blob
//                 const blob = new Blob([fileData], { type: 'model/gltf-binary' });
//                 const blobUrl = URL.createObjectURL(blob);

//                 // Load the model using the blob URL
//                 await SceneLoader.AppendAsync("", blobUrl, scene,
//                     (evt) => {
//                         // Loading progress
//                         const progressPercentage = (evt.loaded * 100 / evt.total).toFixed(2);
//                         console.log(`Loading: ${progressPercentage}%`);
//                     }
//                 );

//                 // Center and scale the model
//                 const meshes = scene.meshes;
//                 if (meshes.length > 0) {
//                     const boundingInfo = BABYLON.Mesh.MinMax(meshes);
//                     const center = BABYLON.Vector3.Center(boundingInfo.min, boundingInfo.max);
//                     const scaling = new BABYLON.Vector3(1, 1, 1);

//                     meshes.forEach(mesh => {
//                         mesh.position.subtractInPlace(center);
//                         mesh.scaling = scaling;
//                     });

//                     // Adjust camera
//                     const radius = BABYLON.Vector3.Distance(boundingInfo.min, boundingInfo.max) * 1.5;
//                     camera.setPosition(new BABYLON.Vector3(radius, radius, radius));
//                     camera.setTarget(BABYLON.Vector3.Zero());
//                 }

//                 // Clean up the blob URL
//                 URL.revokeObjectURL(blobUrl);

//             } catch (error) {
//                 console.error("Error loading model:", error);
//             }

//             return scene;
//         };

//         createScene().then(scene => {
//             // Run render loop
//             engineRef.current.runRenderLoop(() => {
//                 if (scene && scene.activeCamera) {
//                     scene.render();
//                 }
//             });
//         });

//         // Handle window resize
//         const handleResize = () => {
//             if (engineRef.current) {
//                 engineRef.current.resize();
//             }
//         };
//         window.addEventListener('resize', handleResize);

//         // Cleanup
//         return () => {
//             window.removeEventListener('resize', handleResize);
//             if (engineRef.current) {
//                 engineRef.current.dispose();
//                 engineRef.current = null;
//             }
//             if (sceneRef.current) {
//                 sceneRef.current.dispose();
//                 sceneRef.current = null;
//             }
//         };
//     }, [isofilepath]);

//     return (
//         <div id="sisoWorkspace" style={{ zIndex: '3' }}>
//             <div id="sisoCanvasDiv" className="pad">
//                 <div id="siso3D" style={{ width: '100%', height: '500px' }}>
//                     <canvas
//                         ref={canvasRef}
//                         id="sisoCanvas"
//                         style={{
//                             width: '100%',
//                             height: '100%',
//                             touchAction: 'none'
//                         }}
//                     />
//                     {/* Rest of your existing canvas-related elements */}
//                 </div>
//                 {/* Rest of your existing component JSX */}
//             </div>
//             {/* Rest of your existing component structure */}
//         </div>
//     );
// }

// export default SisoWorkspace;




// import React, { useEffect, useState, useRef } from 'react';
// import * as BABYLON from 'babylonjs';
// import "babylonjs-loaders";
// import { SceneLoader } from 'babylonjs';
// import '@babylonjs/loaders/glTF';

// function SisoWorkspace({ isofilepath }) {
//     const [path, setPath] = useState('');
//     const canvasRef = useRef(null);
//     const engineRef = useRef(null);
//     const sceneRef = useRef(null);

//     useEffect(() => {
//         if (!isofilepath?.filePath) return;

//         console.log('File path:', isofilepath.filePath);
//         setPath(isofilepath.filePath);

//         if (!canvasRef.current) return;

//         // Create engine
//         engineRef.current = new BABYLON.Engine(canvasRef.current, true);

//         // Create scene
//         const createScene = async () => {
//             const scene = new BABYLON.Scene(engineRef.current);
//             sceneRef.current = scene;

//             // Add camera
//             const camera = new BABYLON.ArcRotateCamera(
//                 "camera",
//                 0,
//                 Math.PI / 3,
//                 10,
//                 BABYLON.Vector3.Zero(),
//                 scene
//             );
//             camera.attachControl(canvasRef.current, true);

//             // Add light
//             const light = new BABYLON.HemisphericLight(
//                 "light",
//                 new BABYLON.Vector3(0, 1, 0),
//                 scene
//             );

//             try {
//                 // Use IPC to request file loading
//                 window.api.send('read-glb-file', isofilepath.filePath);

//                 // Listen for the file data response
//                 window.api.receive('glb-file-data', async (fileData) => {
//                     try {
//                         // Convert the file data to a Blob
//                         const blob = new Blob([fileData], { type: 'model/gltf-binary' });
//                         const blobUrl = URL.createObjectURL(blob);

//                         // Load the model using the blob URL
//                         await SceneLoader.AppendAsync("", blobUrl, scene,
//                             (evt) => {
//                                 const progressPercentage = (evt.loaded * 100 / evt.total).toFixed(2);
//                                 console.log(`Loading: ${progressPercentage}%`);
//                             }
//                         );

//                         // Center and scale the model
//                         const meshes = scene.meshes;
//                         if (meshes.length > 0) {
//                             const boundingInfo = BABYLON.Mesh.MinMax(meshes);
//                             const center = BABYLON.Vector3.Center(boundingInfo.min, boundingInfo.max);
//                             const scaling = new BABYLON.Vector3(1, 1, 1);

//                             meshes.forEach(mesh => {
//                                 mesh.position.subtractInPlace(center);
//                                 mesh.scaling = scaling;
//                             });

//                             // Adjust camera
//                             const radius = BABYLON.Vector3.Distance(boundingInfo.min, boundingInfo.max) * 1.5;
//                             camera.setPosition(new BABYLON.Vector3(radius, radius, radius));
//                             camera.setTarget(BABYLON.Vector3.Zero());
//                         }

//                         // Clean up the blob URL
//                         URL.revokeObjectURL(blobUrl);

//                     } catch (error) {
//                         console.error("Error processing GLB data:", error);
//                     }
//                 });

//             } catch (error) {
//                 console.error("Error loading model:", error);
//             }

//             return scene;
//         };

//         createScene().then(scene => {
//             // Run render loop
//             engineRef.current.runRenderLoop(() => {
//                 if (scene && scene.activeCamera) {
//                     scene.render();
//                 }
//             });
//         });

//         // Handle window resize
//         const handleResize = () => {
//             if (engineRef.current) {
//                 engineRef.current.resize();
//             }
//         };
//         window.addEventListener('resize', handleResize);

//         // Cleanup
//         return () => {
//             window.removeEventListener('resize', handleResize);
//             if (engineRef.current) {
//                 engineRef.current.dispose();
//                 engineRef.current = null;
//             }
//             if (sceneRef.current) {
//                 sceneRef.current.dispose();
//                 sceneRef.current = null;
//             }
//         };
//     }, [isofilepath]);

//     return (
//         <div id="sisoWorkspace" style={{ zIndex: '3' }}>
//             <div id="sisoCanvasDiv" className="pad">
//                 <div id="siso3D" style={{ width: '100%', height: '500px' }}>
//                     <canvas
//                         ref={canvasRef}
//                         id="sisoCanvas"
//                         style={{
//                             width: '100%',
//                             height: '100%',
//                             touchAction: 'none'
//                         }}
//                     />
//                     {/* Rest of your existing canvas-related elements */}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SisoWorkspace;



// import React, { useEffect, useState, useRef } from 'react';
// import * as BABYLON from '@babylonjs/core';
// import { SceneLoader } from '@babylonjs/core';
// import '@babylonjs/loaders/glTF';

// function SisoWorkspace({ isofilepath }) {
//     const [path, setPath] = useState('');
//     const canvasRef = useRef(null);
//     const engineRef = useRef(null);
//     const sceneRef = useRef(null);

//     useEffect(() => {
//         if (!isofilepath?.filePath) return;

//         console.log('File path:', isofilepath.filePath);
//         setPath(isofilepath.filePath);

//         // Initialize engine and scene if not already done
//         if (!engineRef.current && canvasRef.current) {
//             engineRef.current = new BABYLON.Engine(canvasRef.current, true, {
//                 preserveDrawingBuffer: true,
//                 stencil: true
//             });
//             sceneRef.current = new BABYLON.Scene(engineRef.current);

//             // Create camera
//             const camera = new BABYLON.ArcRotateCamera(
//                 "camera",
//                 0,
//                 Math.PI / 3,
//                 10,
//                 BABYLON.Vector3.Zero(),
//                 sceneRef.current
//             );
//             camera.attachControl(canvasRef.current, true);
//             camera.minZ = 0.1;
//             camera.maxZ = 1000;

//             // Add lights
//             const hemiLight = new BABYLON.HemisphericLight(
//                 "hemiLight",
//                 new BABYLON.Vector3(0, 1, 0),
//                 sceneRef.current
//             );
//             hemiLight.intensity = 0.7;

//             const dirLight = new BABYLON.DirectionalLight(
//                 "dirLight",
//                 new BABYLON.Vector3(0, -1, 0),
//                 sceneRef.current
//             );
//             dirLight.intensity = 0.5;

//             // Start render loop
//             engineRef.current.runRenderLoop(() => {
//                 if (sceneRef.current) {
//                     sceneRef.current.render();
//                 }
//             });

//             // Handle window resize
//             window.addEventListener('resize', () => {
//                 if (engineRef.current) {
//                     engineRef.current.resize();
//                 }
//             });
//         }

//         // Load the GLB file
//         const loadModel = async () => {
//             if (!sceneRef.current) return;

//             try {
//                 // Clear existing meshes
//                 while (sceneRef.current.meshes.length > 0) {
//                     sceneRef.current.meshes[0].dispose();
//                 }

//                 // Get file directory and name
//                 const lastSlashIndex = isofilepath.filePath.lastIndexOf('\\');
//                 const fileDir = isofilepath.filePath.substring(0, lastSlashIndex + 1);
//                 const fileName = isofilepath.filePath.substring(lastSlashIndex + 1);

//                 console.log('Loading from:', fileDir, fileName);

//                 // Load the model using SceneLoader
//                 const result = await SceneLoader.ImportMeshAsync(
//                     "",
//                     "file:///" + fileDir.replace(/\\/g, '/'),
//                     fileName,
//                     sceneRef.current,
//                     (evt) => {
//                         // Loading progress
//                         if (evt.lengthComputable) {
//                             const progressPercentage = (evt.loaded * 100 / evt.total).toFixed(2);
//                             console.log(`Loading: ${progressPercentage}%`);
//                         }
//                     }
//                 );

//                 console.log('Model loaded:', result);

//                 // Handle the loaded meshes
//                 if (result.meshes.length > 0) {
//                     // Calculate bounding info for all meshes
//                     let minX = Number.POSITIVE_INFINITY;
//                     let minY = Number.POSITIVE_INFINITY;
//                     let minZ = Number.POSITIVE_INFINITY;
//                     let maxX = Number.NEGATIVE_INFINITY;
//                     let maxY = Number.NEGATIVE_INFINITY;
//                     let maxZ = Number.NEGATIVE_INFINITY;

//                     result.meshes.forEach(mesh => {
//                         if (mesh.getBoundingInfo) {
//                             const boundingInfo = mesh.getBoundingInfo();
//                             const min = boundingInfo.boundingBox.minimumWorld;
//                             const max = boundingInfo.boundingBox.maximumWorld;

//                             minX = Math.min(minX, min.x);
//                             minY = Math.min(minY, min.y);
//                             minZ = Math.min(minZ, min.z);
//                             maxX = Math.max(maxX, max.x);
//                             maxY = Math.max(maxY, max.y);
//                             maxZ = Math.max(maxZ, max.z);
//                         }
//                     });

//                     // Calculate center and radius
//                     const center = new BABYLON.Vector3(
//                         (minX + maxX) / 2,
//                         (minY + maxY) / 2,
//                         (minZ + maxZ) / 2
//                     );
//                     const radius = Math.max(
//                         maxX - minX,
//                         maxY - minY,
//                         maxZ - minZ
//                     );

//                     // Position camera
//                     const camera = sceneRef.current.activeCamera;
//                     camera.setTarget(center);
//                     camera.radius = radius * 1.5;
//                 }

//             } catch (error) {
//                 console.error("Error loading model:", error);
//             }
//         };

//         loadModel();

//         // Cleanup
//         return () => {
//             if (sceneRef.current) {
//                 sceneRef.current.dispose();
//             }
//             if (engineRef.current) {
//                 engineRef.current.dispose();
//             }
//         };
//     }, [isofilepath]);

//     return (
//         <div id="sisoWorkspace" style={{ zIndex: '3' }}>
//             <div id="sisoCanvasDiv" className="pad">
//                 <div id="siso3D" style={{ width: '100%', height: '500px', position: 'relative' }}>
//                     <canvas
//                         ref={canvasRef}
//                         id="sisoCanvas"
//                         style={{
//                             width: '100%',
//                             height: '100%'
//                         }}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SisoWorkspace;


// import React, { useEffect, useState, useRef } from 'react';
// import * as BABYLON from '@babylonjs/core';
// import { SceneLoader } from '@babylonjs/core';
// import '@babylonjs/loaders/glTF';

// function SisoWorkspace({ isofilepath }) {
//     const [path, setPath] = useState('');
//     const canvasRef = useRef(null);
//     const engineRef = useRef(null);
//     const sceneRef = useRef(null);

//     useEffect(() => {
//         if (!isofilepath?.filePath) return;

//         console.log('File path:', isofilepath.filePath);
//         setPath(isofilepath.filePath);

//         // Initialize engine and scene if not already done
//         if (!engineRef.current && canvasRef.current) {
//             engineRef.current = new BABYLON.Engine(canvasRef.current, true, {
//                 preserveDrawingBuffer: true,
//                 stencil: true
//             });
//             sceneRef.current = new BABYLON.Scene(engineRef.current);

//             // Set scene clear color
//             sceneRef.current.clearColor = new BABYLON.Color4(0.2, 0.2, 0.3, 1);

//             // Create camera
//             const camera = new BABYLON.ArcRotateCamera(
//                 "camera",
//                 Math.PI / 2,
//                 Math.PI / 2,
//                 10,
//                 BABYLON.Vector3.Zero(),
//                 sceneRef.current
//             );
//             camera.attachControl(canvasRef.current, true);
//             camera.minZ = 0.1;
//             camera.maxZ = 1000;
//             camera.lowerRadiusLimit = 0.1;
//             camera.upperRadiusLimit = 1000;
//             camera.wheelPrecision = 50;

//             // Add lights
//             const hemiLight = new BABYLON.HemisphericLight(
//                 "hemiLight",
//                 new BABYLON.Vector3(0, 1, 0),
//                 sceneRef.current
//             );
//             hemiLight.intensity = 0.7;
//             hemiLight.groundColor = new BABYLON.Color3(0.2, 0.2, 0.2);

//             const dirLight = new BABYLON.DirectionalLight(
//                 "dirLight",
//                 new BABYLON.Vector3(-1, -2, -1),
//                 sceneRef.current
//             );
//             dirLight.intensity = 0.5;
//             dirLight.position = new BABYLON.Vector3(20, 40, 20);

//             // Start render loop
//             engineRef.current.runRenderLoop(() => {
//                 if (sceneRef.current) {
//                     sceneRef.current.render();
//                 }
//             });

//             // Handle window resize
//             window.addEventListener('resize', () => {
//                 if (engineRef.current) {
//                     engineRef.current.resize();
//                 }
//             });
//         }

//         // Load the GLB file
//         const loadModel = async () => {
//             if (!sceneRef.current) return;

//             try {
//                 // Clear existing meshes
//                 while (sceneRef.current.meshes.length > 0) {
//                     sceneRef.current.meshes[0].dispose();
//                 }

//                 // Get file directory and name
//                 const lastSlashIndex = isofilepath.filePath.lastIndexOf('\\');
//                 const fileDir = isofilepath.filePath.substring(0, lastSlashIndex + 1);
//                 const fileName = isofilepath.filePath.substring(lastSlashIndex + 1);

//                 console.log('Loading from:', fileDir, fileName);

//                 // Load the model using SceneLoader
//                 const result = await SceneLoader.ImportMeshAsync(
//                     "",
//                     "file:///" + fileDir.replace(/\\/g, '/'),
//                     fileName,
//                     sceneRef.current
//                 );

//                 console.log('Model loaded:', result);

//                 // Process all meshes
//                 result.meshes.forEach((mesh, index) => {
//                     // Ensure mesh is visible and enabled
//                     mesh.isVisible = true;
//                     mesh.setEnabled(true);

//                     // Create default material if none exists
//                     if (!mesh.material) {
//                         const material = new BABYLON.StandardMaterial(`mat_${index}`, sceneRef.current);
//                         material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
//                         material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
//                         material.backFaceCulling = false;
//                         mesh.material = material;
//                     }
//                 });

//                 // Calculate scene bounds
//                 const meshesWithGeometry = result.meshes.filter(mesh => mesh.geometry);
//                 if (meshesWithGeometry.length > 0) {
//                     let minX = Number.POSITIVE_INFINITY;
//                     let minY = Number.POSITIVE_INFINITY;
//                     let minZ = Number.POSITIVE_INFINITY;
//                     let maxX = Number.NEGATIVE_INFINITY;
//                     let maxY = Number.NEGATIVE_INFINITY;
//                     let maxZ = Number.NEGATIVE_INFINITY;

//                     meshesWithGeometry.forEach(mesh => {
//                         const boundingInfo = mesh.getBoundingInfo();
//                         const min = boundingInfo.boundingBox.minimumWorld;
//                         const max = boundingInfo.boundingBox.maximumWorld;

//                         minX = Math.min(minX, min.x);
//                         minY = Math.min(minY, min.y);
//                         minZ = Math.min(minZ, min.z);
//                         maxX = Math.max(maxX, max.x);
//                         maxY = Math.max(maxY, max.y);
//                         maxZ = Math.max(maxZ, max.z);
//                     });

//                     // Calculate center and radius
//                     const center = new BABYLON.Vector3(
//                         (minX + maxX) / 2,
//                         (minY + maxY) / 2,
//                         (minZ + maxZ) / 2
//                     );
//                     const radius = Math.max(
//                         maxX - minX,
//                         maxY - minY,
//                         maxZ - minZ
//                     );

//                     // Position camera
//                     const camera = sceneRef.current.activeCamera;
//                     camera.setTarget(center);
//                     camera.radius = radius * 1.5;
//                     camera.alpha = Math.PI / 4;  // 45 degrees
//                     camera.beta = Math.PI / 3;   // 60 degrees
//                 }

//             } catch (error) {
//                 console.error("Error loading model:", error);
//             }
//         };

//         loadModel();

//         // Cleanup
//         return () => {
//             if (sceneRef.current) {
//                 sceneRef.current.dispose();
//             }
//             if (engineRef.current) {
//                 engineRef.current.dispose();
//             }
//         };
//     }, [isofilepath]);

//     return (
//         <div id="sisoWorkspace" style={{ zIndex: '3' }}>
//             <div id="sisoCanvasDiv" className="pad">
//                 <div id="siso3D" style={{ width: '100%', height: '500px', position: 'relative' }}>
//                     <canvas
//                         ref={canvasRef}
//                         id="sisoCanvas"
//                         style={{
//                             width: '100%',
//                             height: '100%',
//                             touchAction: 'none',
//                             outline: 'none',
//                             backgroundColor: '#2a2a3a'
//                         }}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SisoWorkspace;


import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as BABYLON from '@babylonjs/core';
import { SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import SisoMaterialAdd from './SisoMaterialAdd';

const ContextMenu = ({ x, y, onClose, onAddMaterial, onFocusItem }) => {
    return (
        <div
            style={{
                position: 'fixed', // Changed to fixed positioning
                left: `${x}px`,
                top: `${y}px`,
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px 0',
                minWidth: '150px',
                zIndex: 9999, // Ensure it's above other elements
            }}
        >
            <button
                style={{
                    width: '100%',
                    padding: '8px 16px',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#333',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={onAddMaterial}
            >
                Assign Material
            </button>
            <button
                style={{
                    width: '100%',
                    padding: '8px 16px',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#333',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={onFocusItem}
            >
                Focus Item
            </button>
        </div>
    );
};
function SisoWorkspace({ isofilepath, isolinelist, specmatDetails }) {
    const [path, setPath] = useState('');
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const sceneRef = useRef(null);
    const [viewMode, setViewMode] = useState('top');
    const [orthoviewmode, setOrthoviewmode] = useState('perspective');
    const [selectedItem, setselectedItem] = useState(false);
    // Add refs for cameras
    const arcRotateCameraRef = useRef(null);
    // const universalCameraRef = useRef(null);
    const freeCameraRef = useRef(null);
    const [mode, setMode] = useState('orbit');
    const [focus, setFocus] = useState(null);
    const [selectedObjects, setselectedObjects] = useState([]);
    const [multipleSelectedfocus, setmultipleSelectedfocus] = useState([]);
    const [showMeasure, setShowMeasure] = useState(false);
    const [showMeasureDetailsAbove, setshowMeasureDetailsAbove] = useState(false);
    const [distance, setDistance] = useState(null);
    const [differences, setDifferences] = useState(null);
    const [angles, setAngles] = useState(null);
    const [point1, setPoint1] = useState(null);
    const [point2, setPoint2] = useState(null);

    // Add these refs
    const point3 = useRef(null);
    const point4 = useRef(null);
    const line = useRef(null);
    const markers = useRef([]);
    const raycaster = useRef(new BABYLON.Ray());
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0
    });
    const [sisomaterialadd, setsisomaterialadd] = useState(false);

    // Handle right click
    const handleContextMenu = useCallback((event) => {
        if (focus || selectedObjects.length > 0) {
            event.preventDefault();
            event.stopPropagation(); // Stop event bubbling
            setContextMenu({
                visible: true,
                x: event.clientX,
                y: event.clientY
            });
        }
    }, [focus, selectedObjects]);

    // Handle click outside
    const handleClickOutside = useCallback((event) => {
        if (contextMenu.visible) {
            setContextMenu(prev => ({ ...prev, visible: false }));
        }
    }, [contextMenu.visible]);

    // Handle add material
    const handleAddMaterial = useCallback(() => {
        console.log("Add material clicked");
        setContextMenu(prev => ({ ...prev, visible: false }));
        setsisomaterialadd(true)
        // Add your material handling logic here
    }, []);

    const handleFocusItem = useCallback(() => {
        console.log("Focus item clicked");

        // // Check if there's a focused item
        // if (focus) {
        //     // Get the bounding box of the focused mesh
        //     const boundingInfo = focus.getBoundingInfo();
        //     const center = boundingInfo.boundingBox.centerWorld;

        //     // Get the active camera
        //     const camera = sceneRef.current.activeCamera;

        //     // Calculate a good distance based on mesh size
        //     const size = boundingInfo.boundingBox.extendSize;
        //     const maxDimension = Math.max(size.x, size.y, size.z) * 2;

        //     if (camera instanceof BABYLON.ArcRotateCamera) {
        //         // Set camera target to mesh center
        //         camera.setTarget(center);

        //         // Update radius for a good view
        //         camera.radius = maxDimension * 2;

        //         // Optional: Set to a nice viewing angle
        //         camera.alpha = Math.PI / 4;
        //         camera.beta = Math.PI / 3;

        //         // Force update
        //         camera.rebuildAnglesAndRadius();
        //     } else if (camera instanceof BABYLON.FreeCamera) {
        //         // Set camera target to mesh center
        //         camera.setTarget(center);

        //         // Position camera at a distance from the mesh
        //         const direction = camera.getDirection(new BABYLON.Vector3(0, 0, 1));
        //         direction.normalize();

        //         camera.position = center.subtract(direction.scale(maxDimension * 2));
        //     }
        // }

        setContextMenu(prev => ({ ...prev, visible: false }));
    }, []);

    useEffect(() => {
        // Add event listeners to both canvas and document
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener('contextmenu', handleContextMenu);
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('contextmenu', handleContextMenu);
                document.removeEventListener('click', handleClickOutside);
            }
        };
    }, [handleContextMenu, handleClickOutside]);



    useEffect(() => {
        console.log("isolinelist:", isolinelist);
    }, [isolinelist]);
    useEffect(() => {
        console.log(specmatDetails);

    }, [specmatDetails])


    const createInteractions = (scene, camera) => {
        // Internal state tracking
        let highlightedObject = null;
        let highlightedMaterial = null;

        // Helper Functions
        const highlightMesh = (mesh) => {
            // Store original material if not already stored
            if (!mesh.originalMaterial) {
                mesh.originalMaterial = mesh.material;
            }

            // Create new highlight material
            const highlightMaterial = new BABYLON.StandardMaterial("highlightMaterial", scene);
            highlightMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color
            highlightMaterial.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            highlightMaterial.emissiveColor = new BABYLON.Color3(0.2, 0, 0); // Slight glow
            highlightMaterial.alpha = 1;

            // Apply highlight material
            mesh.material = highlightMaterial;
            highlightedObject = mesh;
            console.log(highlightedObject);
            highlightedMaterial = highlightMaterial;
        };

        const resetMeshColor = (mesh) => {
            if (mesh && mesh.originalMaterial) {
                mesh.material = mesh.originalMaterial;
                mesh.originalMaterial = null;
            }
        };

        const placeMarker = (position) => {
            const marker = BABYLON.MeshBuilder.CreateSphere("marker", {
                diameter: 0.1
            }, scene);
            marker.position = position;
            const markerMaterial = new BABYLON.StandardMaterial("markerMaterial", scene);
            markerMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
            marker.material = markerMaterial;
            markers.current.push(marker);
        };

        const drawLine = (start, end) => {
            if (line.current) {
                line.current.dispose();
            }
            const points = [start, end];
            line.current = BABYLON.MeshBuilder.CreateLines("measureLine", {
                points: points
            }, scene);
            line.current.color = new BABYLON.Color3(1, 0, 0);
        };

        const calculateMeasurements = () => {
            if (!point3.current || !point4.current) return;

            const distance = BABYLON.Vector3.Distance(point3.current, point4.current);
            const multipliedDistance = distance * 1000;
            const roundedDistance = Math.round(multipliedDistance);
            setDistance(roundedDistance);

            const diffX = (point3.current.x - point4.current.x) * 1000;
            const diffY = (point3.current.y - point4.current.y) * 1000;
            const diffZ = (point3.current.z - point4.current.z) * 1000;

            setDifferences({
                diffX: Math.round(diffX),
                diffY: Math.round(diffY),
                diffZ: Math.round(diffZ)
            });

            const horizontalAngle = Math.atan2(diffY, diffX) * (180 / Math.PI);
            const distanceXY = Math.sqrt(diffX * diffX + diffY * diffY);
            const verticalAngle = Math.atan2(diffZ, distanceXY) * (180 / Math.PI);

            setAngles({
                horizontalAngle: Math.round(horizontalAngle),
                verticalAngle: Math.round(verticalAngle)
            });
        };

        const clearMarkersAndLine = () => {
            markers.current.forEach(marker => {
                marker.dispose();
            });
            markers.current = [];
            if (line.current) {
                line.current.dispose();
                line.current = null;
            }
        };

        // Main Event Handlers
        const handleMultipleSelection = (mesh) => {
            const isSelected = selectedObjects.includes(mesh);
            let updatedSelectedObjects;

            if (isSelected) {
                updatedSelectedObjects = selectedObjects.filter(obj => obj !== mesh);
                resetMeshColor(mesh);
            } else {
                updatedSelectedObjects = [...selectedObjects, mesh];
                const material = new BABYLON.StandardMaterial("highlightMaterial", scene);
                material.diffuseColor = new BABYLON.Color3(
                    Math.random(),
                    Math.random(),
                    Math.random()
                );
                mesh.material = material;
            }

            setselectedObjects(updatedSelectedObjects);
            setmultipleSelectedfocus(updatedSelectedObjects);
        };

        const handleMeasurement = (point) => {
            if (!point3.current) {
                setshowMeasureDetailsAbove(false);
                point3.current = point;
                setPoint1(point);
                placeMarker(point);
            } else if (!point4.current) {
                point4.current = point;
                setPoint2(point);
                placeMarker(point);
                calculateMeasurements();
                drawLine(point3.current, point4.current);
                setshowMeasureDetailsAbove(true);
                point3.current = null;
                point4.current = null;
            } else {
                clearMarkersAndLine();
                point3.current = point;
                setPoint1(point);
                placeMarker(point);
            }
        };

        const handleSingleSelection = (mesh, intersectionPoint) => {
            // Clear previous selection
            if (highlightedObject) {
                resetMeshColor(highlightedObject);
            }

            setFocus(mesh);
            highlightMesh(mesh);

            // Calculate bounding box info
            const boundingInfo = mesh.getBoundingInfo();
            const min = boundingInfo.boundingBox.minimumWorld;
            const max = boundingInfo.boundingBox.maximumWorld;
            const center = boundingInfo.boundingBox.centerWorld;

            // Store the coordinates
            const intersectionPointX = intersectionPoint.x;
            const intersectionPointY = intersectionPoint.y;
            const intersectionPointZ = intersectionPoint.z;

            // Calculate dimensions
            const width = max.x - min.x;
            const height = max.y - min.y;
            const depth = max.z - min.z;

            // Store selection info if needed
            const selectionInfo = {
                mesh: mesh,
                center: center,
                dimensions: { width, height, depth },
                intersectionPoint: { x: intersectionPointX, y: intersectionPointY, z: intersectionPointZ }
            };

            // You can add additional UI updates here if needed
        };

        // Main Mouse Event Handlers
        const onMouseMove = (event) => {
            const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
            const hoverInfo = document.getElementById('hover-info');

            if (hoverInfo) {
                if (pickInfo.hit) {
                    const mesh = pickInfo.pickedMesh;
                    hoverInfo.style.display = 'block';
                    hoverInfo.innerHTML = `${mesh.name}`;
                    hoverInfo.style.left = `${event.clientX + 5}px`;
                    hoverInfo.style.top = `${event.clientY + 5}px`;
                } else {
                    hoverInfo.style.display = 'none';
                }
            }
        };

        const onMouseClick = (event) => {
            const isCtrlPressed = event.ctrlKey || event.metaKey;
            const pickInfo = scene.pick(scene.pointerX, scene.pointerY);

            if (!isCtrlPressed) {
                setFocus(null);
            }

            if (!pickInfo.hit) {
                clearSelection();
                return;
            }

            const clickedMesh = pickInfo.pickedMesh;
            const intersectionPoint = pickInfo.pickedPoint;

            if (isCtrlPressed && selectedItem && clickedMesh) {
                handleMultipleSelection(clickedMesh);
            } else if (showMeasure && selectedItem && clickedMesh) {
                handleMeasurement(intersectionPoint);
            } else if (selectedItem && clickedMesh) {
                handleSingleSelection(clickedMesh, intersectionPoint);
            }
        };

        // Selection Clearing
        const clearSelection = () => {
            if (highlightedObject) {
                resetMeshColor(highlightedObject);
                highlightedObject = null;
            }
            if (focus) {
                resetMeshColor(focus);
            }
            setFocus(null);
            setselectedObjects([]);
            clearMarkersAndLine();
            setshowMeasureDetailsAbove(false);
            setDifferences(null);
            setDistance(null);
            setAngles(null);
            setPoint1(null);
            setPoint2(null);
        };

        // Enable/Disable Interactions
        const enableInteractions = () => {
            const moveHandler = (event) => onMouseMove(event);
            const clickHandler = (event) => onMouseClick(event);

            scene.onPointerMove = moveHandler;
            scene.onPointerDown = clickHandler;

            return () => {
                scene.onPointerMove = null;
                scene.onPointerDown = null;
                const hoverInfo = document.getElementById('hover-info');
                if (hoverInfo) {
                    hoverInfo.style.display = 'none';
                }
            };
        };

        // Return public interface
        return {
            enableInteractions,
            clearSelection,
            highlightMesh,
            resetMeshColor
        };
    };


    useEffect(() => {
        if (sceneRef.current && canvasRef.current) {
            const interactions = createInteractions(sceneRef.current, sceneRef.current.activeCamera);

            let cleanup;
            if (selectedItem) {
                cleanup = interactions.enableInteractions();
            }

            return () => {
                if (cleanup) cleanup();
                interactions.clearSelection();
            };
        }
    }, [selectedItem, sceneRef.current]);


    // useEffect(() => {
    //     if (sceneRef.current && canvasRef.current) {
    //         const interactions = createInteractions(sceneRef.current, sceneRef.current.activeCamera);

    //         let cleanup;
    //         if (selectedItem) {
    //             cleanup = interactions.enableInteractions();
    //         }

    //         return () => {
    //             if (cleanup) cleanup();
    //             interactions.clearSelection();
    //         };
    //     }
    // }, [selectedItem]);

    // right click	
    const onRightClickMenu = (event) => {
        // Prevent the default right-click context menu
        event.preventDefault();
        const { clientX, clientY } = event;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        // Calculate if there is more space above or below the click point
        const isSpaceBelow = clientY + menuHeight <= windowHeight;
        const isSpaceRight = clientX + 180 <= windowWidth; // assuming menu width is 180px

        // Set the position to either use 'top' or 'bottom' based on the available space
        const top = isSpaceBelow ? clientY : clientY - menuHeight;
        const left = isSpaceRight ? clientX : clientX - 180;

        setMenuPosition({ top, left });
        const x = event.clientX;
        const y = event.clientY;
        console.log(x, y)
        setRightClickCoordinates({ x, y });
        setIsMenuOpen1(true);
    }

    // First, create the FreeCameraMouseInput class
    class FreeCameraMouseInput {
        constructor() {
            this.buttons = [];
            this.angularSensibility = 2000.0;
            this.offsetX = 0;
            this.offsetY = 0;
            this.direction = new BABYLON.Vector3(0, 0, 0);
        }

        attachControl(element, noPreventDefault) {
            const _this = this;
            if (!this._pointerInput) {
                this._pointerInput = function (p, s) {
                    const evt = p.event;
                    if (evt.pointerType !== 'mouse') return;

                    if (p.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                        try {
                            evt.srcElement.setPointerCapture(evt.pointerId);
                        } catch (e) { }

                        if (_this.buttons.length === 0) {
                            _this.buttons.push(evt.button);
                        }
                        _this.previousPosition = {
                            x: evt.clientX,
                            y: evt.clientY
                        };
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                    else if (p.type === BABYLON.PointerEventTypes.POINTERUP) {
                        try {
                            evt.srcElement.releasePointerCapture(evt.pointerId);
                        } catch (e) { }

                        if (_this.buttons.length !== 0) {
                            _this.buttons.pop();
                        }
                        _this.previousPosition = null;
                        _this.offsetX = 0;
                        _this.offsetY = 0;
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                    else if (p.type === BABYLON.PointerEventTypes.POINTERMOVE) {
                        if (!_this.previousPosition) return;

                        _this.offsetX = evt.clientX - _this.previousPosition.x;
                        _this.offsetY = evt.clientY - _this.previousPosition.y;
                        if (!noPreventDefault) {
                            evt.preventDefault();
                        }
                    }
                };
            }

            this._observer = this.camera.getScene().onPointerObservable.add(
                this._pointerInput,
                BABYLON.PointerEventTypes.POINTERDOWN |
                BABYLON.PointerEventTypes.POINTERUP |
                BABYLON.PointerEventTypes.POINTERMOVE
            );
        }

        detachControl(element) {
            if (this._observer && element) {
                this.camera.getScene().onPointerObservable.remove(this._observer);
                this._observer = null;
                this.previousPosition = null;
            }
        }

        checkInputs() {
            const speed = this.camera.speed;
            if (!this.previousPosition) return;

            if (this.buttons.indexOf(0) !== -1) {
                // Left button: rotation and forward/backward
                if (this.camera.getScene().useRightHandedSystem) {
                    this.camera.cameraRotation.y -= this.offsetX / (20 * this.angularSensibility);
                } else {
                    this.camera.cameraRotation.y += this.offsetX / (20 * this.angularSensibility);
                }

                this.direction.copyFromFloats(0, 0, -this.offsetY * speed / 300);
                if (this.camera.getScene().useRightHandedSystem) {
                    this.direction.z *= -1;
                }
            }

            if (this.buttons.indexOf(1) !== -1) {
                // Middle button: strafing
                this.direction.copyFromFloats(
                    this.offsetX * speed / 500,
                    -this.offsetY * speed / 500,
                    0
                );
            }

            if (this.buttons.indexOf(0) !== -1 || this.buttons.indexOf(1) !== -1) {
                this.camera.getViewMatrix().invertToRef(this.camera._cameraTransformMatrix);
                BABYLON.Vector3.TransformNormalToRef(
                    this.direction,
                    this.camera._cameraTransformMatrix,
                    this.camera._transformedDirection
                );
                this.camera.cameraDirection.addInPlace(this.camera._transformedDirection);
            }
        }

        getTypeName() {
            return "FreeCameraMouseInput";
        }

        getSimpleName() {
            return "mouse";
        }
    }


    const setupCameras = (scene) => {
        // Create arc rotate camera (no changes needed)
        arcRotateCameraRef.current = new BABYLON.ArcRotateCamera(
            "arcRotateCamera",
            Math.PI / 2,
            Math.PI / 2,
            10,
            BABYLON.Vector3.Zero(),
            scene
        );
        arcRotateCameraRef.current.attachControl(canvasRef.current, true);
        arcRotateCameraRef.current.minZ = 0.1;
        arcRotateCameraRef.current.maxZ = 1000;
        arcRotateCameraRef.current.lowerRadiusLimit = 0.1;
        arcRotateCameraRef.current.upperRadiusLimit = 1000;
        arcRotateCameraRef.current.wheelPrecision = 50;

        // Create free camera with custom mouse input
        freeCameraRef.current = new BABYLON.FreeCamera(
            "freeCamera",
            new BABYLON.Vector3(0, 5, -10),
            scene
        );
        freeCameraRef.current.setTarget(BABYLON.Vector3.Zero());

        // Clear default inputs
        freeCameraRef.current.inputs.clear();

        // Add custom mouse input
        const mouseInput = new FreeCameraMouseInput();
        mouseInput.camera = freeCameraRef.current;
        freeCameraRef.current.inputs.add(mouseInput);

        // Camera settings
        freeCameraRef.current.minZ = 0.1;
        freeCameraRef.current.maxZ = 1000;
        freeCameraRef.current.speed = 0.5;
        freeCameraRef.current.inertia = 0.9;
        freeCameraRef.current.angularSensibility = 1000;

        freeCameraRef.current.attachControl(canvasRef.current, true);

        // Set initial active camera
        scene.activeCamera = arcRotateCameraRef.current;
    };

    const setupCameraControls = () => {
        const orbitButton = document.getElementById('sisoOrbitCamera');
        const universalButton = document.getElementById('sisoUniversalCamera');

        orbitButton.addEventListener('click', () => {
            if (sceneRef.current && arcRotateCameraRef.current) {
                // Store current camera position and target
                const currentPosition = sceneRef.current.activeCamera.position.clone();
                const currentTarget = sceneRef.current.activeCamera.target || BABYLON.Vector3.Zero();

                // Switch to arc rotate camera
                sceneRef.current.activeCamera = arcRotateCameraRef.current;
                arcRotateCameraRef.current.setPosition(currentPosition);
                arcRotateCameraRef.current.setTarget(currentTarget);

                // Update mode state
                setMode('orbit');

                // Update UI
                orbitButton.style.opacity = 1;
                universalButton.style.opacity = 0.5;
            }
        });

        universalButton.addEventListener('click', () => {
            if (sceneRef.current && freeCameraRef.current) {
                // Store current camera position and target
                const currentPosition = sceneRef.current.activeCamera.position.clone();
                const currentTarget = sceneRef.current.activeCamera.target || BABYLON.Vector3.Zero();

                // Switch to free camera
                sceneRef.current.activeCamera = freeCameraRef.current;
                freeCameraRef.current.position = currentPosition;
                freeCameraRef.current.setTarget(currentTarget);

                // Update mode state
                setMode('fly');

                // Update UI
                orbitButton.style.opacity = 0.5;
                universalButton.style.opacity = 1;
            }
        });
    };

    const handleortholeft = (buttonName) => {
        console.log('clicked');

        setViewMode('left')
        switchViewMode('left')
    }
    const handleorthoright = (buttonName) => {
        console.log('clicked');
        setViewMode('right')
        switchViewMode('right')
    }
    const handleorthotop = (buttonName) => {
        console.log('clicked');
        setViewMode('top')
        switchViewMode('top')
    }
    const handleorthobottom = (buttonName) => {
        console.log('clicked');
        setViewMode('bottom')
        switchViewMode('bottom')
    }
    const handleorthofront = (buttonName) => {
        console.log('clicked');
        setViewMode('front')
        switchViewMode('front')
    }
    const handleorthoback = (buttonName) => {
        console.log('clicked');
        setViewMode('back')
        switchViewMode('back')
    }
    const handleObjectselected = (buttonName) => {
        console.log('clicked');
        setselectedItem(true);
        // setActiveButton(buttonName);
    }

    const computeBoundingBoxData = () => {
        if (!sceneRef.current) return null;

        // Get all visible meshes
        const visibleMeshes = sceneRef.current.meshes.filter(mesh =>
            mesh.isVisible && mesh.geometry
        );

        if (visibleMeshes.length === 0) return null;

        // Initialize min and max points
        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let minZ = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        let maxZ = Number.NEGATIVE_INFINITY;

        // Calculate cumulative bounding box
        visibleMeshes.forEach(mesh => {
            const boundingInfo = mesh.getBoundingInfo();
            const min = boundingInfo.boundingBox.minimumWorld;
            const max = boundingInfo.boundingBox.maximumWorld;

            minX = Math.min(minX, min.x);
            minY = Math.min(minY, min.y);
            minZ = Math.min(minZ, min.z);
            maxX = Math.max(maxX, max.x);
            maxY = Math.max(maxY, max.y);
            maxZ = Math.max(maxZ, max.z);
        });

        // Calculate center and size
        const center = new BABYLON.Vector3(
            (minX + maxX) / 2,
            (minY + maxY) / 2,
            (minZ + maxZ) / 2
        );

        const size = new BABYLON.Vector3(
            maxX - minX,
            maxY - minY,
            maxZ - minZ
        );

        return { center, size };
    };

    const switchViewMode = (mode) => {
        // Calculate bounding box data
        const boundingData = computeBoundingBoxData();
        if (!boundingData) return;

        const { center, size } = boundingData;
        const maxSize = Math.max(size.x, size.y, size.z);
        const margin = maxSize * 0.1;
        const distance = maxSize + margin;

        // Get current active camera
        const camera = sceneRef.current.activeCamera;
        if (!camera) return;

        // Set up position based on view mode
        switch (mode) {
            case 'left':
                camera.position = new BABYLON.Vector3(
                    center.x - distance,
                    center.y,
                    center.z
                );
                camera.setTarget(center);
                break;

            case 'right':
                camera.position = new BABYLON.Vector3(
                    center.x + distance,
                    center.y,
                    center.z
                );
                camera.setTarget(center);
                break;

            case 'top':
                camera.position = new BABYLON.Vector3(
                    center.x,
                    center.y + distance,
                    center.z
                );
                camera.setTarget(center);
                break;

            case 'bottom':
                camera.position = new BABYLON.Vector3(
                    center.x,
                    center.y - distance,
                    center.z
                );
                camera.setTarget(center);
                break;

            case 'front':
                camera.position = new BABYLON.Vector3(
                    center.x,
                    center.y,
                    center.z + distance
                );
                camera.setTarget(center);
                break;

            case 'back':
                camera.position = new BABYLON.Vector3(
                    center.x,
                    center.y,
                    center.z - distance
                );
                camera.setTarget(center);
                break;

            default:
                console.error("Unknown view mode:", mode);
                return;
        }

        // If it's an ArcRotateCamera, update its angles and radius
        if (camera instanceof BABYLON.ArcRotateCamera) {
            // Force camera to update its position and target
            camera.rebuildAnglesAndRadius();
        }
    };


    useEffect(() => {
        if (!isofilepath?.filePath) return;
        window.api.send("iso-line-tag", isofilepath.number)
        console.log(isofilepath);
        console.log('File path:', isofilepath.filePath);
        setPath(isofilepath.filePath);

        // Initialize engine and scene if not already done
        if (!engineRef.current && canvasRef.current) {
            engineRef.current = new BABYLON.Engine(canvasRef.current, true, {
                preserveDrawingBuffer: true,
                stencil: true
            });
            sceneRef.current = new BABYLON.Scene(engineRef.current);

            // Set scene clear color
            sceneRef.current.clearColor = new BABYLON.Color4(0.2, 0.2, 0.3, 1);


            // Setup cameras
            setupCameras(sceneRef.current);

            // Setup camera controls
            setupCameraControls();

            // Add lights
            const hemiLight = new BABYLON.HemisphericLight(
                "hemiLight",
                new BABYLON.Vector3(0, 1, 0),
                sceneRef.current
            );
            hemiLight.intensity = 0.7;
            hemiLight.groundColor = new BABYLON.Color3(0.2, 0.2, 0.2);

            const dirLight = new BABYLON.DirectionalLight(
                "dirLight",
                new BABYLON.Vector3(-1, -2, -1),
                sceneRef.current
            );
            dirLight.intensity = 0.5;
            dirLight.position = new BABYLON.Vector3(20, 40, 20);

            // Start render loop
            engineRef.current.runRenderLoop(() => {
                if (sceneRef.current) {
                    sceneRef.current.render();
                }
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                if (engineRef.current) {
                    engineRef.current.resize();
                }
            });
        }

        // Load the GLB file
        const loadModel = async () => {
            if (!sceneRef.current) return;

            try {
                // Clear existing meshes
                while (sceneRef.current.meshes.length > 0) {
                    sceneRef.current.meshes[0].dispose();
                }

                // Get file directory and name
                const lastSlashIndex = isofilepath.filePath.lastIndexOf('\\');
                const fileDir = isofilepath.filePath.substring(0, lastSlashIndex + 1);
                const fileName = isofilepath.filePath.substring(lastSlashIndex + 1);

                console.log('Loading from:', fileDir, fileName);

                // Load the model using SceneLoader
                const result = await SceneLoader.ImportMeshAsync(
                    "",
                    "file:///" + fileDir.replace(/\\/g, '/'),
                    fileName,
                    sceneRef.current
                );

                console.log('Model loaded:', result);

                // Process all meshes
                result.meshes.forEach((mesh, index) => {
                    // Ensure mesh is visible and enabled
                    mesh.isVisible = true;
                    mesh.setEnabled(true);

                    // Create default material if none exists
                    if (!mesh.material) {
                        const material = new BABYLON.StandardMaterial(`mat_${index}`, sceneRef.current);
                        material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
                        material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
                        material.backFaceCulling = false;
                        mesh.material = material;
                    }
                });

                // Calculate scene bounds
                const meshesWithGeometry = result.meshes.filter(mesh => mesh.geometry);
                if (meshesWithGeometry.length > 0) {
                    let minX = Number.POSITIVE_INFINITY;
                    let minY = Number.POSITIVE_INFINITY;
                    let minZ = Number.POSITIVE_INFINITY;
                    let maxX = Number.NEGATIVE_INFINITY;
                    let maxY = Number.NEGATIVE_INFINITY;
                    let maxZ = Number.NEGATIVE_INFINITY;

                    meshesWithGeometry.forEach(mesh => {
                        const boundingInfo = mesh.getBoundingInfo();
                        const min = boundingInfo.boundingBox.minimumWorld;
                        const max = boundingInfo.boundingBox.maximumWorld;

                        minX = Math.min(minX, min.x);
                        minY = Math.min(minY, min.y);
                        minZ = Math.min(minZ, min.z);
                        maxX = Math.max(maxX, max.x);
                        maxY = Math.max(maxY, max.y);
                        maxZ = Math.max(maxZ, max.z);
                    });

                    // Calculate center and radius
                    const center = new BABYLON.Vector3(
                        (minX + maxX) / 2,
                        (minY + maxY) / 2,
                        (minZ + maxZ) / 2
                    );
                    const radius = Math.max(
                        maxX - minX,
                        maxY - minY,
                        maxZ - minZ
                    );

                    // Position camera
                    const camera = sceneRef.current.activeCamera;
                    camera.setTarget(center);
                    camera.radius = radius * 1.5;
                    camera.alpha = Math.PI / 4;  // 45 degrees
                    camera.beta = Math.PI / 3;   // 60 degrees
                }

            } catch (error) {
                console.error("Error loading model:", error);
            }
        };

        loadModel();

        // Cleanup
        return () => {
            if (sceneRef.current) {
                sceneRef.current.dispose();
            }
            if (engineRef.current) {
                engineRef.current.dispose();
            }
        };
    }, [isofilepath]);

    const handleperspective = () => {
        if (!sceneRef.current) return;

        // Store current camera position and target
        const currentPosition = sceneRef.current.activeCamera.position.clone();
        const currentTarget = sceneRef.current.activeCamera.target ?
            sceneRef.current.activeCamera.target.clone() :
            new BABYLON.Vector3(0, 0, 0);

        // Remove current cameras if they exist
        if (arcRotateCameraRef.current) {
            arcRotateCameraRef.current.dispose();
        }
        if (freeCameraRef.current) {
            freeCameraRef.current.dispose();
        }

        if (mode === 'orbit') {
            // Create new perspective ArcRotateCamera
            arcRotateCameraRef.current = new BABYLON.ArcRotateCamera(
                "perspectiveArcRotateCamera",
                Math.PI / 2,
                Math.PI / 2,
                10,
                currentTarget,
                sceneRef.current
            );

            // Set up camera properties
            arcRotateCameraRef.current.minZ = 0.1;
            arcRotateCameraRef.current.maxZ = 1000;
            arcRotateCameraRef.current.position = currentPosition;
            arcRotateCameraRef.current.fov = 0.8;
            arcRotateCameraRef.current.attachControl(canvasRef.current, true);

            // Set as active camera
            sceneRef.current.activeCamera = arcRotateCameraRef.current;
        } else {
            // Create new perspective FreeCamera
            freeCameraRef.current = new BABYLON.FreeCamera(
                "perspectiveFreeCamera",
                currentPosition,
                sceneRef.current
            );

            // Set up camera properties
            freeCameraRef.current.minZ = 0.1;
            freeCameraRef.current.maxZ = 1000;
            freeCameraRef.current.position = currentPosition;
            freeCameraRef.current.setTarget(currentTarget);
            freeCameraRef.current.fov = 0.8;

            // Set up fly controls
            const mouseInput = new FreeCameraMouseInput();
            mouseInput.camera = freeCameraRef.current;
            freeCameraRef.current.inputs.clear();
            freeCameraRef.current.inputs.add(mouseInput);
            freeCameraRef.current.attachControl(canvasRef.current, true);

            // Set as active camera
            sceneRef.current.activeCamera = freeCameraRef.current;
        }
    };

    const handleorthoview = () => {
        if (!sceneRef.current) return;

        // Store current camera position and target
        const currentPosition = sceneRef.current.activeCamera.position.clone();
        const currentTarget = sceneRef.current.activeCamera.target ?
            sceneRef.current.activeCamera.target.clone() :
            new BABYLON.Vector3(0, 0, 0);

        // Calculate orthographic parameters based on scene size
        const boundingData = computeBoundingBoxData();
        if (!boundingData) return;

        const { size } = boundingData;
        const maxSize = Math.max(size.x, size.y, size.z);
        const aspect = window.innerWidth / window.innerHeight;
        const orthoSize = maxSize * 1.2; // Add some padding

        // Remove current cameras if they exist
        if (arcRotateCameraRef.current) {
            arcRotateCameraRef.current.dispose();
        }
        if (freeCameraRef.current) {
            freeCameraRef.current.dispose();
        }

        if (mode === 'orbit') {
            // Create new orthographic ArcRotateCamera
            arcRotateCameraRef.current = new BABYLON.ArcRotateCamera(
                "orthographicArcRotateCamera",
                Math.PI / 2,
                Math.PI / 2,
                10,
                currentTarget,
                sceneRef.current
            );

            // Set up orthographic mode
            arcRotateCameraRef.current.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
            arcRotateCameraRef.current.orthoTop = orthoSize / 2;
            arcRotateCameraRef.current.orthoBottom = -orthoSize / 2;
            arcRotateCameraRef.current.orthoLeft = -orthoSize * aspect / 2;
            arcRotateCameraRef.current.orthoRight = orthoSize * aspect / 2;

            // Set up camera properties
            arcRotateCameraRef.current.minZ = 0.1;
            arcRotateCameraRef.current.maxZ = 1000;
            arcRotateCameraRef.current.position = currentPosition;
            arcRotateCameraRef.current.attachControl(canvasRef.current, true);

            // Set as active camera
            sceneRef.current.activeCamera = arcRotateCameraRef.current;
        } else {
            // Create new orthographic FreeCamera
            freeCameraRef.current = new BABYLON.FreeCamera(
                "orthographicFreeCamera",
                currentPosition,
                sceneRef.current
            );

            // Set up orthographic mode
            freeCameraRef.current.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
            freeCameraRef.current.orthoTop = orthoSize / 2;
            freeCameraRef.current.orthoBottom = -orthoSize / 2;
            freeCameraRef.current.orthoLeft = -orthoSize * aspect / 2;
            freeCameraRef.current.orthoRight = orthoSize * aspect / 2;

            // Set up camera properties
            freeCameraRef.current.minZ = 0.1;
            freeCameraRef.current.maxZ = 1000;
            freeCameraRef.current.position = currentPosition;
            freeCameraRef.current.setTarget(currentTarget);

            // Set up fly controls
            const mouseInput = new FreeCameraMouseInput();
            mouseInput.camera = freeCameraRef.current;
            freeCameraRef.current.inputs.clear();
            freeCameraRef.current.inputs.add(mouseInput);
            freeCameraRef.current.attachControl(canvasRef.current, true);

            // Set as active camera
            sceneRef.current.activeCamera = freeCameraRef.current;
        }

        // Add window resize handler for orthographic camera
        const handleResize = () => {
            const newAspect = window.innerWidth / window.innerHeight;
            const activeCamera = sceneRef.current.activeCamera;
            if (activeCamera.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
                activeCamera.orthoLeft = -orthoSize * newAspect / 2;
                activeCamera.orthoRight = orthoSize * newAspect / 2;
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    };

    const handleZoomFit = () => {
        console.log('Zoom fit clicked');

        if (!sceneRef.current) {
            console.log('Scene not available');
            return;
        }

        // Get all visible meshes
        const visibleMeshes = sceneRef.current.meshes.filter(mesh =>
            mesh.isVisible && mesh.geometry
        );

        console.log(`Found ${visibleMeshes.length} visible meshes`);

        if (visibleMeshes.length === 0) {
            console.log('No visible meshes found');
            return;
        }

        // Calculate bounding box
        const boundingInfo = computeBoundingBoxData();
        console.log('Bounding info:', boundingInfo);

        if (!boundingInfo) {
            console.log('Failed to compute bounding box data');
            return;
        }

        const { center, size } = boundingInfo;
        console.log('Center:', center, 'Size:', size);

        const maxDimension = Math.max(size.x, size.y, size.z);
        const padding = 1.2; // Add 20% padding

        // Get active camera
        const camera = sceneRef.current.activeCamera;
        console.log('Active camera type:', camera.getClassName());

        if (camera instanceof BABYLON.ArcRotateCamera) {
            console.log('Using ArcRotateCamera zoom fit');
            // For ArcRotateCamera (orbit mode)
            camera.setTarget(center);

            // Calculate appropriate radius
            const radius = maxDimension * padding;
            console.log('Setting radius to:', radius);
            camera.radius = radius;

            // Optional: set to a nice default view angle
            camera.alpha = Math.PI / 4;  // 45 degrees
            camera.beta = Math.PI / 3;   // 60 degrees

            // Force update
            camera.rebuildAnglesAndRadius();
        }
        else if (camera instanceof BABYLON.FreeCamera) {
            console.log('Using FreeCamera zoom fit');
            // For FreeCamera (fly mode)
            // Calculate position that can see the whole scene
            const distance = maxDimension * padding;

            // Position at an angle from the center
            const offset = new BABYLON.Vector3(
                distance * 0.5,
                distance * 0.5,
                distance
            );

            console.log('Setting camera position to:', center.add(offset));
            // camera.position = center.add(offset);

            const newPosition = center.clone().add(offset);
            camera.position = newPosition;
            camera.setTarget(center);

            // If camera is in orthographic mode, adjust ortho params
            if (camera.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
                console.log('Adjusting orthographic parameters');
                const aspect = window.innerWidth / window.innerHeight;
                const orthoSize = maxDimension * padding;

                camera.orthoTop = orthoSize / 2;
                camera.orthoBottom = -orthoSize / 2;
                camera.orthoLeft = -orthoSize * aspect / 2;
                camera.orthoRight = orthoSize * aspect / 2;
            }
        }
        console.log('Zoom fit complete');
    };
    const menuOptions1 = [
        // { label: 'Unhide all', action: handleUnhideAll },
        // { label: 'Unselect', action: handleDeselect },
    ];


    return (
        <div id="sisoWorkspace" style={{ zIndex: '3' }} >
            <div id="sisoCanvasDiv" className="pad">
                <div id="siso3D">
                    <canvas id="sisoCanvas" ref={canvasRef} style={{ width: '100%', height: '100%', touchAction: 'none' }} />
                    {contextMenu.visible && (
                        <ContextMenu
                            x={contextMenu.x}
                            y={contextMenu.y}
                            onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
                            onAddMaterial={handleAddMaterial}
                            onFocusItem={handleFocusItem}
                        />
                    )}
                    <div id="hover-info" style={{
                        display: 'none',
                        position: 'absolute',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '5px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        pointerEvents: 'none',
                        zIndex: 1000
                    }}></div>

                    <div id="sisoCanvasCtrls">

                        <img id="sisoOrbitCamera" class="button" src="images/orbit.png" title="Orbit camera" />
                        <img id="sisoUniversalCamera" class="button" src="images/universal.png" title="Universal camera" />
                        <img id="sisoWebVRFreeCamera" class="button" src="images/web-vr-free.png" title="Virtual reality" />
                        <span className="icon-tooltip" title='Selection' onClick={() => handleObjectselected('select')}>
                            <i class="fas fa-mouse-pointer fs-4"></i>
                        </span>

                        <img
                            id="sisoCameraPerspective"
                            className="button"
                            src="images/perspective.png"
                            title="Perspective view"
                            onClick={handleperspective}
                        />
                        <img
                            id="sisoCameraOrthographic"
                            className="button"
                            src="images/orthographic.png"
                            title="Orthographic view"
                            onClick={handleorthoview}
                        />
                        {/* <img id="sisoZoomAll" class="button" src="images/zoomfit.png" title="Zoom fit" /> */}
                        <img
                            id="sisoZoomAll"
                            className="button"
                            src="images/zoomfit.png"
                            title="Zoom fit"
                            onClick={handleZoomFit}
                        />
                        <img id="commentSisoAll" class="button" src="images/comment.png" title="Comments" />
                        <img id="sisoFrontView" class="button" src="images/front.png" title="Front view" onClick={() => handleorthofront('front')} />
                        <img id="sisoLeftView" class="button" src="images/left.png" title="Left view" onClick={() => handleortholeft('left')} />
                        <img id="sisoBackView" class="button" src="images/back.png" title="Back view" onClick={() => handleorthoback('back')} />
                        <img id="sisoRightView" class="button" src="images/right.png" title="Right view" onClick={() => handleorthoright('right')} />
                        <img id="sisoTopView" class="button" src="images/top.png" title="Top view" onClick={() => handleorthotop('top')} />
                        <img id="sisoBottomView" class="button" src="images/bottom.png" title="Bottom view" onClick={() => handleorthobottom('bottom')} />
                        <img id="sisoMeasure" class="button" src="images/measure.png" title="Measure" />
                        <img id="sisoWireframe" class="button" src="images/wireframe.png" title="Wireframe" />
                        <img id="sisoFocus" class="button" src="images/focus.png" title="Focus" />
                    </div>

                </div>


                {/* <div id="sisoSwitchDiv">
                    <i id="sisoFullscreen" className="fa fa-expand fa-2x sisoSwitch" title="Enter fullscreen"></i>
                    <i id="sisoDimSwitch" className="fa fa-stop fa-2x sisoSwitch" title="2D"></i>
                    <i id="sisoDocSwitch" className="fa fa-link fa-2x sisoSwitch" title="Reference documents"></i>
                    <i id="sisoUploadMPFile" className="fa fa-plus-circle fa-2x sisoSwitch" ></i>
                </div> */}
            </div>

            {/* <div id="sisoBottomDiv">
                <div id="sisoNotesDiv" className="pad">
                    <h2>Notes</h2>
                    <i className='fa fa-expand expandButton' ></i>
                    <i className='fa fa-plus-circle cornerButton' ></i>

                    <div className="sisoContentDiv">
                        <ol id="sisoNotes"></ol>
                    </div>
                </div>

                <div id="sisoLineDataDiv" className="pad">
                    <h2>Line data</h2>
                    <i className='fa fa-expand expandButton' ></i>

                    <div id="sisoLdContentDiv" className="sisoContentDiv">

                        <div className="sisoLdBlockContainer">
                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Fluid code</label>
                                <input type="text" value={isolinelist.fluidCode} disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Line ID</label>
                                <input type="text" value={isolinelist.lineId} disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Medium</label>
                                <input type="text" value={isolinelist.medium} disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Line size (inch)</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Line size (NB)</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Piping spec.</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Insulation type</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Insulation thickness</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Heat trace</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Line from</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Line to</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Maximum operating pressure (bar)</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Maximum operating temperature (ºC)</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Design pressure (bar)</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Minimum design temperature (ºC)</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Maximum design temperature (ºC)</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Test pressure (bar)</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Test medium</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Test medium phase</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Mass flow (kg/hr)</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">
                                    Volume flow (m<sup>3</sup>/hr)
                                </label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">
                                    Density (kg/m<sup>3</sup>)
                                </label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Velocity (m/s)</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Paint system</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">NDT group</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">Chemical cleaning</label>
                                <input type="text" disabled />
                            </div>

                            <div className="sisoLdBlock">
                                <label className="sisoLabel">PWHT</label>
                                <input type="text" disabled />
                            </div>
                        </div>

                    </div>

                </div>
            </div> */}
            {sisomaterialadd && <SisoMaterialAdd specmatDetails={specmatDetails} handleclose={() => setsisomaterialadd(false)} />}
        </div >
    )
}

export default SisoWorkspace

