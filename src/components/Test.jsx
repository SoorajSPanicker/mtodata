import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import 'cesium/Build/Cesium/Widgets/widgets.css';

class EarthViewerClass {
    constructor(options = {}) {
        this.cesiumContainer = options.cesiumContainer;
        this.threeContainer = options.threeContainer;
        this.cesiumViewer = null;
        this.threeRenderer = null;
        this.threeScene = null;
        this.threeCamera = null;
        this.orbitControls = null;
        this.animationFrameId = null;
        this.ionToken = options.ionToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZWU3MTJjNi00Njk1LTQxZDktYmE4OS1mY2I3NTIyYzVhZTgiLCJpZCI6MTg3NjI0LCJpYXQiOjE3MDQ1NjAzMzF9.5FAkHltPwh5gROFmAfIEalS68ob5Xnsjt7EMkNcyIjE';
        this.currentTileset = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedObject = null;
        this.isThreeActive = false;
        this.pickHandler = null;

        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseClick = this.handleMouseClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.toggleCesiumInteraction = this.toggleCesiumInteraction.bind(this);
    }

    async initialize() {
        try {
            await this.initCesium();
            this.initThree();
            this.initOrbitControls();
            this.setupEventListeners();
            this.startAnimation();
            return true;
        } catch (error) {
            console.error('Initialization error:', error);
            return false;
        }
    }

    async initCesium() {
        const Cesium = window.Cesium;
        Cesium.Ion.defaultAccessToken = this.ionToken;
        
        this.cesiumViewer = new Cesium.Viewer(this.cesiumContainer, {
            terrainProvider: await Cesium.createWorldTerrainAsync(),
            baseLayerPicker: false,
            skyBox: false,
            skyAtmosphere: false,
            sceneMode: Cesium.SceneMode.SCENE3D,
            animation: false,
            timeline: false,
            navigationHelpButton: false,
            infoBox: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            scene3DOnly: true,
            selectionIndicator: true
        });
    
        // Always enable Cesium's event handlers by default
        this.cesiumViewer.scene.screenSpaceCameraController.enableRotate = true;
        this.cesiumViewer.scene.screenSpaceCameraController.enableTranslate = true;
        this.cesiumViewer.scene.screenSpaceCameraController.enableZoom = true;
        this.cesiumViewer.scene.screenSpaceCameraController.enableTilt = true;
        this.cesiumViewer.scene.screenSpaceCameraController.enableLook = true;
    
        // Set up Cesium click handling
    this.pickHandler = new Cesium.ScreenSpaceEventHandler(this.cesiumViewer.scene.canvas);
    this.pickHandler.setInputAction((movement) => {
        if (!this.isThreeActive) {
            const pickedObject = this.cesiumViewer.scene.pick(movement.position);
            if (Cesium.defined(pickedObject)) {
                console.log('Clicked Cesium Object:', pickedObject);
                
                // Check if it's a 3D Tileset feature
                if (pickedObject.content && pickedObject.content.tile) {
                    const tile = pickedObject.content.tile;
                    console.log('Clicked Tile:', tile);
                    
                    // Access model details if available
                    if (pickedObject.detail && pickedObject.detail.model) {
                        console.log('Model Details:', pickedObject.detail);
                    }

                    // Highlight the tile or model
                    if (this.currentTileset) {
                        this.highlightTile(pickedObject);
                    }
                }

                // Add click marker regardless of object type
                this.addClickMarker(movement.position);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    
        this.cesiumViewer.cesiumWidget.creditContainer.style.display = "none";
        this.cesiumViewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000)
        });
    }

    addClickMarker(position) {
        const Cesium = window.Cesium;
        const ellipsoid = this.cesiumViewer.scene.globe.ellipsoid;
        const cartesian = this.cesiumViewer.camera.pickEllipsoid(position, ellipsoid);
        
        if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            
            // Add a point entity at the clicked location
            this.cesiumViewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.YELLOW,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
        }
    }

    initThree() {
        this.threeRenderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            canvas: this.threeContainer
        });
        this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
        this.threeRenderer.setClearColor(0x000000, 0);
        
        this.threeScene = new THREE.Scene();
        this.threeCamera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.threeCamera.position.z = 5;
    }

    initOrbitControls() {
        if (this.threeCamera && this.threeContainer) {
            this.orbitControls = new OrbitControls(
                this.threeCamera,
                this.threeContainer
            );
            
            this.orbitControls.enableDamping = true;
            this.orbitControls.dampingFactor = 0.05;
            this.orbitControls.screenSpacePanning = true;
            this.orbitControls.minDistance = 1;
            this.orbitControls.maxDistance = 50;
            this.orbitControls.maxPolarAngle = Math.PI;
            
            this.orbitControls.rotateSpeed = 0.5;
            this.orbitControls.zoomSpeed = 1.0;
            this.orbitControls.panSpeed = 0.8;
        }
    }

   


    toggleCesiumInteraction(enable) {
        if (this.cesiumViewer) {
            this.cesiumViewer.scene.screenSpaceCameraController.enableRotate = enable;
            this.cesiumViewer.scene.screenSpaceCameraController.enableTranslate = enable;
            this.cesiumViewer.scene.screenSpaceCameraController.enableZoom = enable;
            this.cesiumViewer.scene.screenSpaceCameraController.enableTilt = enable;
            this.cesiumViewer.scene.screenSpaceCameraController.enableLook = enable;
        }
    }

    handleMouseMove(event) {
        const rect = this.threeContainer.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / this.threeContainer.clientWidth) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / this.threeContainer.clientHeight) * 2 + 1;
    }

    handleMouseClick(event) {
        // Handle Three.js objects
        this.raycaster.setFromCamera(this.mouse, this.threeCamera);
        const intersects = this.raycaster.intersectObjects(this.threeScene.children, true);
        
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            console.log('Clicked Three.js Object:', clickedObject);
            
            // Only handle emissive properties for Mesh objects with PhongMaterial
            if (clickedObject instanceof THREE.Mesh && clickedObject.material instanceof THREE.MeshPhongMaterial) {
                if (this.selectedObject && this.selectedObject.material instanceof THREE.MeshPhongMaterial) {
                    this.selectedObject.material.emissive.setHex(0x000000);
                }
                
                this.selectedObject = clickedObject;
                clickedObject.material.emissive.setHex(0x555555);
            }
        }
    }
    
    // Update setupEventListeners to properly handle both Three.js and Cesium interactions:
    setupEventListeners() {
        window.addEventListener('resize', this.handleResize);
        
        // Three.js event handlers
        this.threeContainer.addEventListener('mousemove', (event) => {
            if (this.isThreeActive) {
                this.handleMouseMove(event);
            }
        });
        
        this.threeContainer.addEventListener('click', (event) => {
            if (this.isThreeActive) {
                this.handleMouseClick(event);
            }
        });
        
        // Update mouse enter/leave handlers
        this.threeContainer.addEventListener('mouseenter', () => {
            this.isThreeActive = true;
            this.toggleCesiumInteraction(false);
            this.threeContainer.style.pointerEvents = 'auto';
        });
        
        this.threeContainer.addEventListener('mouseleave', () => {
            this.isThreeActive = false;
            this.toggleCesiumInteraction(true);
            this.threeContainer.style.pointerEvents = 'none';
        });
    
        // Add mouse wheel event listener for smooth zooming
        this.threeContainer.addEventListener('wheel', (event) => {
            if (this.isThreeActive) {
                event.preventDefault();
                const delta = event.deltaY;
                const zoomSpeed = 0.1;
                this.threeCamera.position.z += delta * zoomSpeed;
                this.threeCamera.position.z = Math.max(2, Math.min(10, this.threeCamera.position.z));
            }
        });
    }
    

    async loadTileset(assetId) {
        const Cesium = window.Cesium;
        try {
            if (this.currentTileset) {
                this.cesiumViewer.scene.primitives.remove(this.currentTileset);
            }
    
            const tilesetResource = await Cesium.IonResource.fromAssetId(assetId);
            const tileset = await Cesium.Cesium3DTileset.fromUrl(tilesetResource, {
                enablePickFeatures: true,  // Enable feature picking
                debugShowBoundingVolume: false,
                debugShowContentBoundingVolume: false,
                debugShowPickVolume: false,
                debugShowColorVolume: false,
                debugWireframe: false
            });
            
            // Initialize with default style
            tileset.style = new Cesium.Cesium3DTileStyle({
                color: 'color("white")'
            });
            
            this.cesiumViewer.scene.primitives.add(tileset);
            this.currentTileset = tileset;
            await this.cesiumViewer.zoomTo(tileset);
            return tileset;
        } catch (error) {
            console.error('Error loading tileset:', error);
            throw error;
        }
    }

    // Add new method for highlighting tiles
    highlightTile(pickedObject) {
    const Cesium = window.Cesium;
    
    // Reset previous highlight if any
    if (this.currentTileset) {
        this.currentTileset.style = new Cesium.Cesium3DTileStyle({
            color: 'color("white")'
        });
    }

    // Apply highlight style
    this.currentTileset.style = new Cesium.Cesium3DTileStyle({
        color: {
            conditions: [
                ['${id} === "' + pickedObject.primitive.id + '"', 'color("yellow", 0.5)'],
                [true, 'color("white")']
            ]
        }
    });
    }

    startAnimation() {
        const animate = () => {
            this.animationFrameId = requestAnimationFrame(animate);
            
            if (this.orbitControls) {
                this.orbitControls.update();
            }
            
            if (this.threeRenderer && this.threeScene && this.threeCamera) {
                this.threeRenderer.render(this.threeScene, this.threeCamera);
            }
        };
        animate();
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (this.threeCamera) {
            this.threeCamera.aspect = width / height;
            this.threeCamera.updateProjectionMatrix();
        }

        if (this.threeRenderer) {
            this.threeRenderer.setSize(width, height);
        }

        if (this.cesiumViewer) {
            this.cesiumViewer.canvas.width = width;
            this.cesiumViewer.canvas.height = height;
            this.cesiumViewer.resize();
        }
    }

    destroy() {
        window.removeEventListener('resize', this.handleResize);
        this.threeContainer.removeEventListener('mousemove', this.handleMouseMove);
        this.threeContainer.removeEventListener('click', this.handleMouseClick);
        this.threeContainer.removeEventListener('mouseenter', () => this.toggleCesiumInteraction(false));
        this.threeContainer.removeEventListener('mouseleave', () => this.toggleCesiumInteraction(true));
        this.threeContainer.removeEventListener('wheel', this.handleWheel);

        if (this.pickHandler) {
            this.pickHandler.destroy();
        }

        if (this.orbitControls) {
            this.orbitControls.dispose();
        }

        if (this.cesiumViewer) {
            this.cesiumViewer.destroy();
        }

        if (this.threeRenderer) {
            this.threeRenderer.dispose();
        }

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

}

const EarthViewerComponent = () => {
    const cesiumContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const viewerInstanceRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [assetId, setAssetId] = useState('');
    const [isValidInput, setIsValidInput] = useState(false);

    useEffect(() => {
        const initViewer = async () => {
            if (!window.Cesium) {
                console.error('Cesium not loaded');
                return;
            }

            try {
                const viewer = new EarthViewerClass({
                    cesiumContainer: cesiumContainerRef.current,
                    threeContainer: canvasRef.current,
                    ionToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZWU3MTJjNi00Njk1LTQxZDktYmE4OS1mY2I3NTIyYzVhZTgiLCJpZCI6MTg3NjI0LCJpYXQiOjE3MDQ1NjAzMzF9.5FAkHltPwh5gROFmAfIEalS68ob5Xnsjt7EMkNcyIjE'
                });

                await viewer.initialize();
                viewerInstanceRef.current = viewer;
            } catch (error) {
                console.error('Failed to initialize Earth Viewer:', error);
                setError('Failed to initialize viewer');
            }
        };

        initViewer();

        return () => {
            if (viewerInstanceRef.current) {
                viewerInstanceRef.current.destroy();
            }
        };
    }, []);

    // Validate asset ID input
    const handleAssetIdChange = (event) => {
        const value = event.target.value.trim();
        setAssetId(value);
        
        // Check if the input is a valid number
        const isValid = /^\d+$/.test(value) && parseInt(value) > 0;
        setIsValidInput(isValid);
        
        if (error) setError(null);
    };

    const handleLoadAsset = async () => {
        if (!viewerInstanceRef.current || !isValidInput) return;

        setIsLoading(true);
        setError(null);

        try {
            await viewerInstanceRef.current.loadTileset(parseInt(assetId));
        } catch (error) {
            console.error('Failed to load asset:', error);
            setError('Failed to load asset');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = {
        padding: '8px 12px',
        marginRight: '10px',
        borderRadius: '4px',
        border: error ? '2px solid #ff0000' : '1px solid #ccc',
        width: '150px',
        fontSize: '14px'
    };

    const buttonStyle = {
        padding: '8px 16px',
        backgroundColor: isValidInput ? '#4CAF50' : '#cccccc',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: isValidInput && !isLoading ? 'pointer' : 'not-allowed',
        opacity: isLoading ? 0.7 : 1
    };

    const controlsContainerStyle = {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div 
                ref={cesiumContainerRef} 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0
                }}
            />
            <canvas 
    ref={canvasRef}
    style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'auto'
    }}
/>
            <div style={controlsContainerStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={assetId}
                        onChange={handleAssetIdChange}
                        placeholder="Enter Asset ID"
                        style={inputStyle}
                        disabled={isLoading}
                    />
                    <button 
                        onClick={handleLoadAsset}
                        disabled={!isValidInput || isLoading}
                        style={buttonStyle}
                    >
                        {isLoading ? 'Loading...' : 'Load Asset'}
                    </button>
                </div>
                {error && (
                    <div style={{ 
                        color: 'red',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        padding: '5px',
                        borderRadius: '4px'
                    }}>
                        {error}
                    </div>
                )}
                {!isValidInput && assetId && (
                    <div style={{
                        color: '#666',
                        fontSize: '12px',
                        marginTop: '5px'
                    }}>
                        Please enter a valid asset ID (positive number)
                    </div>
                )}
            </div>
        </div>
    );
};

export default EarthViewerComponent;