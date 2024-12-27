import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/serializers";
// Add these imports at the top
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
class FreeCameraMouseInput {
  constructor() {
    this.buttons = [];
    this.angularSensibility = 2000.0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.direction = new BABYLON.Vector3(0, 0, 0);
  }

  attachControl(element, noPreventDefault) {
    if (!this._pointerInput) {
      this._pointerInput = (p, s) => {
        const evt = p.event;
        if (evt.pointerType !== "mouse") return;

        if (p.type === BABYLON.PointerEventTypes.POINTERDOWN) {
          try {
            evt.srcElement.setPointerCapture(evt.pointerId);
          } catch (e) {}
          if (this.buttons.length === 0) this.buttons.push(evt.button);
          this.previousPosition = {
            x: evt.clientX,
            y: evt.clientY,
          };
          if (!noPreventDefault) evt.preventDefault();
        } else if (p.type === BABYLON.PointerEventTypes.POINTERUP) {
          try {
            evt.srcElement.releasePointerCapture(evt.pointerId);
          } catch (e) {}
          if (this.buttons.length !== 0) this.buttons.pop();
          this.previousPosition = null;
          this.offsetX = 0;
          this.offsetY = 0;
          if (!noPreventDefault) evt.preventDefault();
        } else if (p.type === BABYLON.PointerEventTypes.POINTERMOVE) {
          if (!this.previousPosition) return;
          this.offsetX = evt.clientX - this.previousPosition.x;
          this.offsetY = evt.clientY - this.previousPosition.y;
          if (!noPreventDefault) evt.preventDefault();
        }
      };
    }
    this._observer = this.camera
      .getScene()
      .onPointerObservable.add(
        this._pointerInput,
        BABYLON.PointerEventTypes.POINTERDOWN |
          BABYLON.PointerEventTypes.POINTERUP |
          BABYLON.PointerEventTypes.POINTERMOVE
      );
  }

  detachControl() {
    if (this._observer && this.camera) {
      this.camera.getScene().onPointerObservable.remove(this._observer);
      this._observer = null;
      this.previousPosition = null;
    }
  }

  checkInputs() {
    const speed = this.camera.speed;
    if (!this.previousPosition) return;

    if (this.buttons.indexOf(0) !== -1) {
      if (this.camera.getScene().useRightHandedSystem) {
        this.camera.cameraRotation.y -=
          this.offsetX / (20 * this.angularSensibility);
      } else {
        this.camera.cameraRotation.y +=
          this.offsetX / (20 * this.angularSensibility);
      }
      this.direction.copyFromFloats(0, 0, (-this.offsetY * speed) / 300);
      if (this.camera.getScene().useRightHandedSystem) this.direction.z *= -1;
    }

    if (this.buttons.indexOf(1) !== -1) {
      this.direction.copyFromFloats(
        (this.offsetX * speed) / 500,
        (-this.offsetY * speed) / 500,
        0
      );
    }

    if (this.buttons.indexOf(0) !== -1 || this.buttons.indexOf(1) !== -1) {
      this.camera
        .getViewMatrix()
        .invertToRef(this.camera._cameraTransformMatrix);
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

function BabylonComponent({ viewHideThree,viewMode,viewHideThreeunassigned,setBackgroundColorTag,backgroundColorTag,mode, setMode, showComment, setShowComment, zoomfit, setzoomfit, selectedItem, setselectedItem, showSpinner, setActiveButton, settingbox, setsettingbox, objecttable, allComments, allEquipementList, allLineList,userTagInfotable,orthoviewmode ,allCommentStatus,savedViewDialog,setSavedViewDialog,allViews,showMeasure,setexpandGLobalModal,setActiveLink,leftNavVisible,setViewHideThree,setOpenSpidCanvas,setSpidOpen,setrightSideNavVisible}) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const meshesRef = useRef([]);
  const gizmoManagerRef = useRef(null);
  const [cameraMode, setCameraMode] = useState("orbit");
  const [gizmoMode, setGizmoMode] = useState("none");
  const [selectedMesh, setSelectedMesh] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    engineRef.current = new BABYLON.Engine(canvas, true);
    sceneRef.current = new BABYLON.Scene(engineRef.current);

    // Initial camera setup
    setupCamera("orbit");

    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      sceneRef.current
    );

    
    // Initialize GizmoManager
    gizmoManagerRef.current = new BABYLON.GizmoManager(sceneRef.current);
    gizmoManagerRef.current.positionGizmoEnabled = false;
    gizmoManagerRef.current.rotationGizmoEnabled = false;
    gizmoManagerRef.current.scaleGizmoEnabled = false;
    gizmoManagerRef.current.boundingBoxGizmoEnabled = false;

    // Configure gizmo settings
    gizmoManagerRef.current.usePointerToAttachGizmos = true;
    gizmoManagerRef.current.attachableMeshes = [];

   

    // Setup keyboard controls for gizmos
    const handleKeyDown = (e) => {
      switch(e.key.toLowerCase()) {
        case 'w':
          gizmoManagerRef.current.positionGizmoEnabled = !gizmoManagerRef.current.positionGizmoEnabled;
          setGizmoMode(gizmoManagerRef.current.positionGizmoEnabled ? 'position' : 'none');
          break;
        case 'e':
          gizmoManagerRef.current.rotationGizmoEnabled = !gizmoManagerRef.current.rotationGizmoEnabled;
          setGizmoMode(gizmoManagerRef.current.rotationGizmoEnabled ? 'rotation' : 'none');
          break;
        case 'r':
          gizmoManagerRef.current.scaleGizmoEnabled = !gizmoManagerRef.current.scaleGizmoEnabled;
          setGizmoMode(gizmoManagerRef.current.scaleGizmoEnabled ? 'scale' : 'none');
          break;
        case 'q':
          gizmoManagerRef.current.boundingBoxGizmoEnabled = !gizmoManagerRef.current.boundingBoxGizmoEnabled;
          setGizmoMode(gizmoManagerRef.current.boundingBoxGizmoEnabled ? 'boundingBox' : 'none');
          break;
        case 'd': // Add duplication shortcut
          if (e.ctrlKey || e.metaKey) { // Ctrl+D or Cmd+D
            e.preventDefault();
            duplicateSelectedMesh();
          }
          break;
        
      }
    };
    

    window.addEventListener("keydown", handleKeyDown);

    engineRef.current.runRenderLoop(() => {
      sceneRef.current.render();
    });

    window.addEventListener("resize", () => {
      engineRef.current.resize();
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      engineRef.current.dispose();
    };
  }, []);

  const setupCamera = (mode) => {
    if (!sceneRef.current) return;

    // Store current camera position and target if exists
    const currentPosition = sceneRef.current.activeCamera?.position.clone();
    const currentTarget =
      sceneRef.current.activeCamera?.target?.clone() ||
      sceneRef.current.activeCamera?.getTarget().clone();

    // Dispose current camera if exists
    if (sceneRef.current.activeCamera) {
      sceneRef.current.activeCamera.dispose();
    }

    if (mode === "orbit") {
      const camera = new BABYLON.ArcRotateCamera(
        "orbitCamera",
        Math.PI / 2,
        Math.PI / 3,
        10,
        currentTarget || new BABYLON.Vector3(0, 0, 0),
        sceneRef.current
      );

      // Configure orbit camera
      camera.minZ = 0.001;
      camera.wheelDeltaPercentage = 0.01;
      camera.panningSensibility = 100;
      camera.angularSensibilityX = 500;
      camera.angularSensibilityY = 500;
      camera.attachControl(canvasRef.current, true);

      if (currentPosition) {
        camera.setPosition(currentPosition);
      }
    } else if (mode === "fly") {
      const camera = new BABYLON.FreeCamera(
        "flyCamera",
        currentPosition || new BABYLON.Vector3(0, 5, -10),
        sceneRef.current
      );

      // Configure fly camera
      camera.minZ = 0.001;
      camera.speed = 0.5;
      camera.inputs.clear();

      const mouseInput = new FreeCameraMouseInput();
      mouseInput.camera = camera;
      camera.inputs.add(mouseInput);

      if (currentTarget) {
        camera.setTarget(currentTarget);
      }

      camera.attachControl(canvasRef.current, true);
    }

    setCameraMode(mode);
  };

  // Add these functions after setupCamera
  const duplicateSelectedMesh = () => {
    if (!selectedMesh || !sceneRef.current) return;

    // Clone the mesh
    const clone = selectedMesh.clone("clone_" + selectedMesh.name);
    clone.position = selectedMesh.position.clone();
    clone.rotation = selectedMesh.rotation.clone();
    clone.scaling = selectedMesh.scaling.clone();

    // Make the clone pickable and add action manager
    clone.isPickable = true;
    clone.actionManager = new BABYLON.ActionManager(sceneRef.current);
    clone.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
        if (gizmoManagerRef.current) {
          setSelectedMesh(clone);
          gizmoManagerRef.current.attachToMesh(clone);
        }
      })
    );

    // Add to meshes ref
    meshesRef.current.push(clone);

    // Attach gizmo to the clone for immediate editing
    if (gizmoManagerRef.current) {
      setSelectedMesh(clone);
      gizmoManagerRef.current.attachToMesh(clone);
    }
  };


  // Modify the mesh click handler in handleFileInput:
  

  const handleFileInput = async (event) => {
    const files = Array.from(event.target.files);
    console.log(files);
    if (!files.length || !sceneRef.current) return;

    // Clear previous meshes
    meshesRef.current.forEach((mesh) => mesh.dispose());
    meshesRef.current = [];

    for (const file of files) {
      const url = URL.createObjectURL(file);

      try {
        const result = await BABYLON.SceneLoader.ImportMeshAsync(
          "",
          "",
          url,
          sceneRef.current,
          undefined,
          ".glb"
        );

        // Setup mesh interactions
        result.meshes.forEach(mesh => {
          if (mesh.geometry) {
            mesh.isPickable = true;
            
            mesh.actionManager = new BABYLON.ActionManager(sceneRef.current);
            mesh.actionManager.registerAction(
              new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                  if (gizmoManagerRef.current) {
                    setSelectedMesh(mesh);
                    gizmoManagerRef.current.attachToMesh(mesh);
                  }
                }
              )
            );
          }
        });
        

        meshesRef.current.push(...result.meshes);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error(`Error loading file ${file.name}:`, error);
        URL.revokeObjectURL(url);
      }
    }

    // Update gizmo manager to work with new meshes
    if (gizmoManagerRef.current) {
      gizmoManagerRef.current.attachableMeshes = meshesRef.current.filter(
        (mesh) => mesh.geometry
      );
    }
    // Calculate cumulative bounding box
    if (meshesRef.current.length > 0) {
      let min = new BABYLON.Vector3(Infinity, Infinity, Infinity);
      let max = new BABYLON.Vector3(-Infinity, -Infinity, -Infinity);

      meshesRef.current.forEach((mesh) => {
        // Skip if mesh doesn't have geometry
        if (!mesh.getBoundingInfo || !mesh.geometry) return;

        // Get mesh vertices in world space
        const positions = mesh.geometry.getVerticesData(
          BABYLON.VertexBuffer.PositionKind
        );
        if (!positions) return;

        // Process vertices in groups of 3 (x,y,z)
        for (let i = 0; i < positions.length; i += 3) {
          // Create vector from vertex position
          const vertex = new BABYLON.Vector3(
            positions[i],
            positions[i + 1],
            positions[i + 2]
          );

          // Transform vertex to world space
          const worldVertex = BABYLON.Vector3.TransformCoordinates(
            vertex,
            mesh.getWorldMatrix()
          );

          // Update min and max
          min = BABYLON.Vector3.Minimize(min, worldVertex);
          max = BABYLON.Vector3.Maximize(max, worldVertex);
        }
      });
      if (gizmoManagerRef.current) {
        // Make gizmo work with all loaded meshes that have geometry
        gizmoManagerRef.current.attachableMeshes = meshesRef.current.filter(
          (mesh) => mesh.geometry
        );
      }

      // Calculate dimensions and center
      const dimensions = max.subtract(min);
      const center = BABYLON.Vector3.Center(min, max);

      // Calculate diagonal for camera radius
      const diagonal = Math.sqrt(
        dimensions.x ** 2 + dimensions.y ** 2 + dimensions.z ** 2
      );

      // Update camera position and target
      const camera = sceneRef.current.activeCamera;
      camera.setTarget(center);

      // Set radius with some padding
      camera.radius = diagonal * 1.5;

      // Optional: Adjust camera beta (vertical angle) for better view
      camera.beta = Math.PI / 3; // 60 degrees
    }
  };

  const saveScene = async () => {
    if (!sceneRef.current || meshesRef.current.length === 0) return;
  
    try {
      // Create Three.js scene and objects
      const threeScene = new THREE.Scene();
  
      for (const babylonMesh of meshesRef.current) {
        if (!babylonMesh.geometry) continue;
  
        // Create Three.js geometry
        const threeGeometry = new THREE.BufferGeometry();
  
        // Get vertex positions
        const positions = babylonMesh.geometry.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        if (positions) {
          threeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        }
  
        // Get normals
        const normals = babylonMesh.geometry.getVerticesData(BABYLON.VertexBuffer.NormalKind);
        if (normals) {
          threeGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        }
  
        // Get UVs
        const uvs = babylonMesh.geometry.getVerticesData(BABYLON.VertexBuffer.UVKind);
        if (uvs) {
          threeGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        }
  
        // Get indices
        const indices = babylonMesh.geometry.getIndices();
        if (indices) {
          threeGeometry.setIndex(Array.from(indices));
        }
  
        // Create Three.js material with preserved color
        let material;
        if (babylonMesh.material) {
          const babylonMaterial = babylonMesh.material;
          
          // Handle different material types
          if (babylonMaterial instanceof BABYLON.StandardMaterial) {
            material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(
                babylonMaterial.diffuseColor.r,
                babylonMaterial.diffuseColor.g,
                babylonMaterial.diffuseColor.b
              ),
              metalness: babylonMaterial.metallic || 0,
              roughness: babylonMaterial.roughness || 1,
              emissive: new THREE.Color(
                babylonMaterial.emissiveColor.r,
                babylonMaterial.emissiveColor.g,
                babylonMaterial.emissiveColor.b
              ),
              transparent: babylonMaterial.alpha < 1,
              opacity: babylonMaterial.alpha
            });
          } else if (babylonMaterial instanceof BABYLON.PBRMaterial) {
            material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(
                babylonMaterial.albedoColor.r,
                babylonMaterial.albedoColor.g,
                babylonMaterial.albedoColor.b
              ),
              metalness: babylonMaterial.metallic || 0,
              roughness: babylonMaterial.roughness || 1,
              emissive: new THREE.Color(
                babylonMaterial.emissiveColor.r,
                babylonMaterial.emissiveColor.g,
                babylonMaterial.emissiveColor.b
              ),
              transparent: babylonMaterial.alpha < 1,
              opacity: babylonMaterial.alpha
            });
          } else {
            // Default material if type is unknown
            material = new THREE.MeshStandardMaterial({ 
              color: 0xcccccc,
              metalness: 0,
              roughness: 1
            });
          }
        } else {
          // Default material if no material is present
          material = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            metalness: 0,
            roughness: 1
          });
        }
  
        // Create Three.js mesh
        const threeMesh = new THREE.Mesh(threeGeometry, material);
  
        // Copy transformation
        threeMesh.position.set(
          babylonMesh.position.x,
          babylonMesh.position.y,
          babylonMesh.position.z
        );
        threeMesh.rotation.set(
          babylonMesh.rotation.x,
          babylonMesh.rotation.y,
          babylonMesh.rotation.z
        );
        threeMesh.scale.set(
          babylonMesh.scaling.x,
          babylonMesh.scaling.y,
          babylonMesh.scaling.z
        );
  
        // Preserve mesh name
        threeMesh.name = babylonMesh.name;
  
        threeScene.add(threeMesh);
      }
  
      // Create GLTFExporter
      const exporter = new GLTFExporter();
  
      // Export as GLB
      exporter.parse(
        threeScene,
        (buffer) => {
          const blob = new Blob([buffer], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = 'exported_scene.glb';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error exporting GLB:', error);
          alert('Error exporting scene. Check console for details.');
        },
        {
          binary: true // Export as GLB
        }
      );
      
    } catch (error) {
      console.error("Error saving scene:", error);
      alert("Error saving scene. Check console for details.");
    }
  };


  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ margin: "10px" }}>
        <input
          type="file"
          accept=".glb"
          multiple
          onChange={handleFileInput}
          style={{ marginRight: "10px" }}
        />
        <button
          onClick={() => setupCamera("orbit")}
          style={{
            marginRight: "10px",
            backgroundColor: cameraMode === "orbit" ? "#4CAF50" : "#ddd",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            color: "white",
          }}
        >
          Orbit Camera
        </button>
        <button
          onClick={() => setupCamera("fly")}
          style={{
            marginRight: "10px",
            backgroundColor: cameraMode === "fly" ? "#2196F3" : "#ddd",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            color: "white",
          }}
        >
          Fly Camera
        </button>
        <div style={{ marginTop: "10px" }}>
          <p>Gizmo Controls:</p>
          <ul>
            <li>
              Press Q: Toggle Bounding Box (
              {gizmoMode === "boundingBox" ? "ON" : "OFF"})
            </li>
            <li>
              Press W: Toggle Position Gizmo (
              {gizmoMode === "position" ? "ON" : "OFF"})
            </li>
            <li>
              Press E: Toggle Rotation Gizmo (
              {gizmoMode === "rotation" ? "ON" : "OFF"})
            </li>
            <li>
              Press R: Toggle Scale Gizmo (
              {gizmoMode === "scale" ? "ON" : "OFF"})
            </li>
          </ul>

          <button 
    onClick={duplicateSelectedMesh}
    style={{ 
      marginRight: '10px',
      backgroundColor: '#9C27B0',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      color: 'white'
    }}
  >
    Duplicate Selected (Ctrl+D)
  </button>
  <button 
            onClick={saveScene}
            style={{ 
              marginRight: '10px',
              backgroundColor: '#FF5722',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            Save Scene as GLB
          </button>
 
        </div>
      </div>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "calc(100vh - 160px)",
          touchAction: "none",
        }}
      />
    </div>
  );
}

export default BabylonComponent;
