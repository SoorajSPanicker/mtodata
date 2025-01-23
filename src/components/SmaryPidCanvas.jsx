import { Color, Path, Point, Rectangle, Size } from 'paper/dist/paper-core';
import React, { useEffect, useRef, useState } from 'react'
import paper from 'paper'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './spidCanvas.css'
import Alert from './Alert';
import * as XLSX from 'xlsx';
import Comment from './Comment';
import { v4 as uuidv4 } from 'uuid';

function Canvas({ svgcontent, mascontent, alltags, allspids, projectNo, isSideNavOpen, allComments, allareas, sindocid, tagdocsel, setopenThreeCanvas, setiRoamercanvas, setOpenSpidCanvas, setSpidOpen, allCommentStatus, setrightSideNavVisible, markdet }) {
    const canvasRef = useRef(null);
    let canvas = canvasRef.current;
    const viewRef = useRef(null);
    const lastMousePosition = useRef(null);
    const isPanning = useRef(false);
    const drawingLayerRef = useRef(null);
    let svgGroup
    const temarrRef = useRef([]);
    let selectionRectangle;
    let startPoint;
    const originalPosition = new Point(761, 368);
    const svgGroupRef = useRef(null);
    const overlayGroupRef = useRef(null);
    const conndocElementsRef = useRef([]);
    const masdocElementsRef = useRef([]);
    const originalIds = useRef(new Set());
    const originalIdsMap = useRef(new Map());
    // const svgGroupRef = useRef(null);
    // const newLabelObjects = useRef({});
    const labelObjects = useRef({});
    const currentRectangleRef = useRef(null);
    const [isbottomextend, setbottomextend] = useState(false)
    const [enableselect, setenableselect] = useState(false)
    const [isassignid, setassignid] = useState([])
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    // const [editoption, seteditoption] = useState(false)
    const [tagid, setSelectedValue] = useState('');
    const [tagassishow, settagassishow] = useState(false);
    const [panonoff, setpanonoff] = useState(false)
    const [enablesinselect, setenablesinselect] = useState(false)
    const [enableflagtagselect, setenableflagtagselect] = useState(false)
    const [enablewinselect, setenablewinselect] = useState(false)
    const [rectangles, setRectangles] = useState({});
    const [areaassishow, setareaassishow] = useState(false)
    const [tagsselect, settagsselect] = useState([])
    const [tagsinfo, settagsinfo] = useState({})
    const [equlist, setequlist] = useState({})
    const [linelist, setlinelist] = useState({})
    const [taginfoshow, settaginfoshow] = useState(false);
    const [taginfomenu, settaginfomenu] = useState({ visible: false, x: 0, y: 0 });
    const [flagconmenu, setflagconmenu] = useState({ visible: false, x: 0, y: 0 });
    const [docdetails, setdocdetails] = useState([])
    const [flagassishow, setflagassishow] = useState(false)
    const [flagcdocnum, setflagcdocnum] = useState('')
    const [docdetnum, setdocdetnum] = useState('')
    const [issindoc, setsindoc] = useState('')
    const [condoc, setcondoc] = useState('')
    const [condocpath, setcondocpath] = useState('')
    const [conndoc, setconndoc] = useState('')
    const [sinflag, setsinflag] = useState('')
    const [flagtag, setflagtag] = useState('')
    const [tagflag, settagflag] = useState('')
    const [sindoubleflag, setsindoubleflag] = useState('')
    const [docflag, setdocflag] = useState('')
    const [condocallsel, setcondocallsel] = useState([])
    const [condelflag, setcondelflag] = useState('')
    const [conflagdel, setconflagdel] = useState('')
    const [customAlert, setCustomAlert] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [flagtry, setflagtry] = useState([])
    const [nextcondoc, setnextcondoc] = useState('')
    const [isaddcomment, setaddcomment] = useState(false)
    const [isx, setx] = useState('')
    const [isy, sety] = useState('')
    const [isrx, setrx] = useState('')
    const [isry, setry] = useState('')
    const [commcontent, setcommcontent] = useState({})
    const [showComment, setshowComment] = useState(false)
    const [commentinfo, setcommentinfo] = useState(null);
    const [commentinfotable, setcommentinfotable] = useState(false);
    const [editcomment, seteditcomment] = useState(false)
    const [commentdet, setcommentdet] = useState([])
    const [exportmenu, setexportmenu] = useState(false);
    const [selectedTexts, setSelectedTexts] = useState([]);
    const [pathIDs, setPathIDs] = useState([]);
    const [isEditing, setisEditing] = useState(false)
    const [statusedit, setstatusedit] = useState('')
    const [commentedit, setcommentedit] = useState('')
    const [priorityedit, setpriorityedit] = useState('')
    const [flagsconn, setflagsconn] = useState(false)
    const [masdoc, setmasdoc] = useState('')
    const [highlightConndoc, setHighlightConndoc] = useState(false);
    const [highlightMasdoc, setHighlightMasdoc] = useState(false);
    const [functionactive, setfunctionactive] = useState(false)
    const [mastertab, setmastertab] = useState(false)
    const [mastercopyactive, setmastercopyactive] = useState(false)
    const [enablescselect, setenablescselect] = useState(false)
    const [areashows, setareashows] = useState(false);
    const [selectvalue, setselectvalue] = useState('')
    const [areainfo, setareainfo] = useState([])
    const [enableareadraw, setenableareadraw] = useState(false)
    const [enablehigh, setenablehigh] = useState(false)
    const [savrectangles, setsavRectangles] = useState({});
    const [allowredrect, setallowredrect] = useState(false)
    const [istagtabdet, settagtabdet] = useState(false)
    const [istagtypedet, settagtypedet] = useState(false)
    const [pidTagId, setPidTagId] = useState('');

    useEffect(() => {
        console.log(flagsconn);
    }, [flagsconn])

    useEffect(() => {
        console.log(condocallsel);
    }, [condocallsel])

    useEffect(() => {
        console.log(isx);
        // setcommcontent({ isx, isy })
    }, [isx])
    useEffect(() => {
        console.log(allareas);
    }, [allareas])

    useEffect(() => {
        console.log(isy);
        if (isx != '' && isy != '') {
            // const cdata = { isx: isx, isy: isy }
            // setcommcontent(cdata)
            console.log('Updating commcontent with:', { isx, isy });
            setcommcontent({ isx, isy });
        }
    }, [isx, isy])

    useEffect(() => {
        console.log(commcontent);
    }, [commcontent])

    useEffect(() => {
        console.log(isrx);
    }, [isrx])

    useEffect(() => {
        console.log(isry);
    }, [isry])

    useEffect(() => {
        for (let i = 0; i < tagdocsel.length; i++) {
            paper.project.getItems({ class: paper.Path, }).forEach(item => {
                if (tagdocsel[i] == item._id) {
                    item.selected = true
                }
            });
        }
    })
    const importSVGWithOriginalIds = (svgString, isMasdoc) => {
        paper.project.importSVG(svgString, (importedSVG) => {
            importedSVG.getItems({ class: paper.Path }).forEach((item) => {
                const originalId = originalIdsMap.current.get(item.pathData);
                if (originalId && isMasdoc) {
                    item._id = originalId;
                } else if (!isMasdoc) {
                    originalIdsMap.current.set(item.pathData, item._id);
                }
            });

            importedSVG.getItems({ class: paper.PointText }).forEach((item) => {
                const originalId = originalIdsMap.current.get(item.content);
                if (originalId && isMasdoc) {
                    item._id = originalId;
                } else if (!isMasdoc) {
                    originalIdsMap.current.set(item.content, item._id);
                }
            });

            if (isMasdoc) {
                masdocElementsRef.current = importedSVG.getItems({ class: paper.Item });
                importedSVG.opacity = 0.5; // Set transparency for the overlay
                overlayGroupRef.current.addChild(importedSVG);
            } else {
                conndocElementsRef.current = importedSVG.getItems({ class: paper.Item });
                svgGroupRef.current.addChild(importedSVG);
            }

            importedSVG.fitBounds(new paper.Rectangle(new Point(0, 0), new Size(paper.view.size.width, paper.view.size.height)));
            paper.view.draw();
        });
    };



    const drawStoredRectangle = () => {
        if (Array.isArray(rectangles) && rectangles.length > 0 && drawingLayerRef.current) {
            drawingLayerRef.current.removeChildren(); // Clear existing rectangles

            rectangles.forEach(rect => {
                const rectangle = new paper.Path.Rectangle({
                    point: [rect.x, rect.y], // Top-left corner
                    size: [rect.width, rect.height], // Dimensions (width and height)
                    strokeColor: 'red', // Color of the rectangle's border
                    fillColor: new paper.Color(1, 0, 0, 0.5), // Fill color of the rectangle with some transparency
                    strokeWidth: 2 / paper.view.zoom // Adjust the stroke width based on the current zoom level
                });

                drawingLayerRef.current.addChild(rectangle); // Add the created rectangle to the drawing layer
            });
        }
    };

    const drawsavedarea = () => {
        if (Array.isArray(savrectangles) && savrectangles.length > 0 && drawingLayerRef.current) {
            drawingLayerRef.current.removeChildren(); // Clear existing rectangles

            savrectangles.forEach(rect => {
                const rectangle = new paper.Path.Rectangle({
                    point: [rect.x, rect.y], // Top-left corner
                    size: [rect.width, rect.height], // Dimensions (width and height)
                    strokeColor: 'red', // Color of the rectangle's border
                    fillColor: new paper.Color(1, 0, 0, 0.5), // Fill color of the rectangle with some transparency
                    strokeWidth: 2 / paper.view.zoom // Adjust the stroke width based on the current zoom level
                });

                drawingLayerRef.current.addChild(rectangle); // Add the created rectangle to the drawing layer
            });
        }
    };

    useEffect(() => {
        if (masdoc && drawingLayerRef.current) {
            paper.view.zoom = 1;
            paper.view.center = paper.view.size.divide(2);
            drawStoredRectangle();
            drawsavedarea();
        }
    }, [masdoc]);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        paper.setup(canvas);

        // Add zoom handler after setup
        paper.view.onZoom = function (event) {
            if (drawingLayerRef.current) {
                drawingLayerRef.current.children.forEach(child => {
                    if (child.data && child.data.type === 'rectangle') {
                        child.strokeWidth = (child.strokeWidth * child.data.originalZoom) / paper.view.zoom;
                    }
                });
            }
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        paper.setup(canvas);


        if (conndoc) {
            paper.project.clear();
            viewRef.current = paper.view;

            svgGroupRef.current = new paper.Group();
            if (highlightConndoc) {
                const highlightRect = new paper.Path.Rectangle({
                    point: [0, 0],
                    size: paper.view.size,
                    fillColor: new paper.Color(1, 1, 0, 0.5) // Yellow with 50% opacity
                });
                svgGroupRef.current.addChild(highlightRect);
            }

            paper.project.importSVG(conndoc, (importedSVG) => {
                importedSVG.getItems({ class: paper.Path }).forEach((item, index) => {
                    item._id = `path-${index}`;
                    item.data.fromconndoc = true;
                });

                importedSVG.getItems({ class: paper.PointText }).forEach((item, index) => {
                    item._id = `text-${index}`;
                    item.data.fromconndoc = true;
                });

                importedSVG.fitBounds(new paper.Rectangle(new Point(0, 0), new Size(paper.view.size.width, paper.view.size.height)));
                svgGroupRef.current.addChild(importedSVG);
                // svgGroupRef.current.position = paper.view.center;
                svgGroupRef.current.fitBounds(paper.view.bounds);
                paper.view.draw();

                conndocElementsRef.current = importedSVG.getItems({ class: paper.Item });
                // handleResize();
            });
        }

    }, [conndoc, highlightConndoc]);

    useEffect(() => {
        if (!viewRef.current || !masdoc) return;

        if (overlayGroupRef.current) {
            overlayGroupRef.current.remove();
        }

        overlayGroupRef.current = new paper.Group();
        if (highlightMasdoc) {
            const highlightRect = new paper.Path.Rectangle({
                point: [0, 0],
                size: paper.view.size,
                fillColor: new paper.Color(1, 1, 0, 0.5) // Yellow with 50% opacity
            });
            overlayGroupRef.current.addChild(highlightRect);
        }

        paper.project.importSVG(masdoc, (importedSVG) => {
            importedSVG.getItems({ class: paper.Path }).forEach((item, index) => {
                if (!originalIdsMap.current.has(item.pathData)) {
                    item._id = `overlay-path-${index}`;
                    originalIdsMap.current.set(item.pathData, item._id);
                } else {
                    item._id = originalIdsMap.current.get(item.pathData);
                }
                item.data.fromMasdoc = true;
            });

            importedSVG.getItems({ class: paper.PointText }).forEach((item, index) => {
                if (!originalIdsMap.current.has(item.content)) {
                    item._id = `overlay-text-${index}`;
                    originalIdsMap.current.set(item.content, item._id);
                } else {
                    item._id = originalIdsMap.current.get(item.content);
                }
                item.data.fromMasdoc = true;
            });

            importedSVG.opacity = 0.5; // Set transparency for the overlay

            importedSVG.fitBounds(new paper.Rectangle(new Point(0, 0), new Size(paper.view.size.width, paper.view.size.height)));
            overlayGroupRef.current.addChild(importedSVG);
            // overlayGroupRef.current.position = paper.view.center;
            overlayGroupRef.current.fitBounds(paper.view.bounds);
            paper.view.draw();

            masdocElementsRef.current = importedSVG.getItems({ class: paper.Item });
            // handleResize();
            startDrawingRectangles();

        });

    }, [masdoc, highlightMasdoc]);



    useEffect(() => {
        console.log(conndoc);
    }, [conndoc])

    useEffect(() => {
        console.log(masdoc);
        if (masdoc != '') {
            setfunctionactive(true)
            setmastertab(true)
        }
    }, [masdoc])
    const onDoubleClick = (event) => {
        // Ensure the event is a left double-click
        if (event.button === 0) {
            paper.project.getItems({ selected: true }).forEach(item => {
                console.log("enter unselect");
                item.selected = false;
            })
            console.log("enter handle")
            const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
            console.log("point:", point);
            const paperPoint = paper.view.viewToProject(point);
            console.log("paperpoint:", paperPoint)
            const hitResult = paper.project.hitTest(paperPoint, {
                // fill: true,
                stroke: true,
                segments: true,
                tolerance: 5,
            });
            console.log("hitresult::", hitResult)
            console.log(hitResult);

            if (hitResult && hitResult.item && hitResult.item.data.fromMasdoc) {
                console.log(hitResult.item._id);
                window.api.send('double-sin-flag', hitResult.item._id);
                window.api.send('ele-tag-type', hitResult.item._id)
            }
            else {
                console.log('else condition');
            }
        }
    }

    useEffect(() => {
        setconndoc(svgcontent)
    }, [svgcontent])

    useEffect(() => {
        window.api.receive('sin-ele-fetched', (data) => {
            console.log("Received data from main process:", data);
            window.api.send('fetch-tag-ele', data.tagNumber);
            window.api.send('fetch-info-tag', data.tagNumber);

        });
    }, []);
    useEffect(() => {
        window.api.receive('tag-ele-fetched', (data) => {
            console.log("Received data from main process:", data);
            settagsselect(data)
        });
    }, []);

    useEffect(() => {
        console.log(tagsinfo);
    }, [tagsinfo])

    useEffect(() => {
        window.api.receive('info-tag-fetched', (data) => {
            console.log("Received data from main process:", data);
            settagsinfo(data)

        });
    }, []);
    useEffect(() => {
        window.api.receive('sin-docdetails-fetched', (data) => {
            console.log("Received data from main process:", data);
            setdocdetails(data)
            setdocdetnum(data[0].number)
        });
    }, []);

    useEffect(() => {
        window.api.receive('all-layers-fetched', (data) => {
            console.log("Received data from main process:", data);
        });
    }, []);

    useEffect(() => {
        window.api.receive('all-flags-fetched', (data) => {
            console.log("Received data from main process:", data);
        });
    }, []);

    useEffect(() => {
        window.api.receive('con-doc-fetched', (data) => {
            console.log("Received data from main process:", data);
            setcondoc(data.connectDoc)
        });
    }, []);

    useEffect(() => {
        window.api.receive('condoc-path-fetched', (data) => {
            console.log("Received data from main process:", data);
            setcondocpath(data)
        });
    }, []);

    useEffect(() => {
        window.api.send('fetch-condoc-path', condoc)
    }, [condoc])

    useEffect(() => {
        console.log(setnextcondoc);
    }, [nextcondoc])

    useEffect(() => {
        console.log(condocpath);
        if (condocpath === '') {
            setflagsconn(false)
        }
        setconndoc(condocpath)
        setdocdetnum(nextcondoc)
    }, [condocpath])

    useEffect(() => {
        window.api.receive('sin-flag-fetched', (data) => {
            console.log("Received data from main process:", data);
            setsinflag(data[0].flagId)
            setflagtag(data[0].flagId)
        });
    }, []);

    useEffect(() => {
        window.api.receive('sin-flag-double', (data) => {
            console.log("Received data from main process:", data);
            setsindoubleflag(data[0].connectDoc)
            setnextcondoc(data[0].connectDoc)
        });
    }, []);

    useEffect(() => {
        console.log(sindoubleflag);
        window.api.send('fetch-condoc-path', sindoubleflag)
    }, [sindoubleflag])

    useEffect(() => {
        //selection of flag element on click
        window.api.receive('sel-flag-ele', (data) => {
            console.log("Received data from main process:", data);
            const cdf = data.map(element => element.elementId);
            for (let i = 0; i < cdf.length; i++) {
                paper.project.getItems({ class: paper.Path, }).forEach(item => {
                    if (cdf[i] == item._id) {
                        item.selected = true
                    }
                });
            }
        });
    }, []);

    useEffect(() => {
        window.api.receive('flag-conflag-sin', (data) => {
            console.log("Received data from main process:", data);
            // if(canvas){
            console.log(data[0].parentDoc);
            const cdf = data.map(element => element.elementId);
            setcondocallsel(cdf)
            for (let i = 0; i < cdf.length; i++) {
                paper.project.getItems({ class: paper.Path, }).forEach(item => {
                    if (cdf[i] == item._id) {
                        item.selected = true
                    }
                });
            }
            window.api.send('fetch-condoc-path', data[0].parentDoc)
            // } 
        })
    }, [])

    useEffect(() => {
        window.api.receive('doc-flag-fetched', (data) => {
            console.log("Received data from main process:", data);
            setdocflag(data.flagId);
        });
    }, []);

    useEffect(() => {
        window.api.receive('ele-flag-unflag', (data) => {
            console.log("Received data from main process:", data);
            setcondelflag(data[0].flagId)
            setconflagdel(data[0].connectFlag)
        });
    }, []);

    useEffect(() => {
        if (condelflag != '' && conflagdel != '') {
            console.log(condelflag);
            console.log(conflagdel);
            window.api.send('update-unflag-table', condelflag);
            window.api.send('update-unflag-table', conflagdel);
        }

    }, [condelflag, conflagdel])

    useEffect(() => {
        window.api.receive('flag-tag-fetched', (data) => {
            console.log("Received data from main process:", data);
            settagflag(data[0].tagNumber)
        });
    }, []);

    useEffect(() => {
        console.log(flagtag);
    }, [flagtag])

    useEffect(() => {
        console.log(rectangles);
    }, [rectangles])

    useEffect(() => {
        console.log(savrectangles);
    }, [savrectangles])

    useEffect(() => {
        if (tagflag != '' && flagtag != '') {
            const data = {
                adjTag: tagflag,
                flagId: flagtag
            }
            window.api.send('update-flag-tag', data);
            setCustomAlert(true);
            setModalMessage('Adjcent tag added');
            // alert("Adjcent tag added")
        }

    }, [tagflag])

    useEffect(() => {
        window.api.receive('flag-tag-updated', (data) => {
            console.log("Received data from main process:", data);

        });
    }, []);

    useEffect(() => {
        window.api.receive('element-tag-is', (data) => {
            console.log("Received data from main process:", data);
            console.log(data.tagNumber);
            setPidTagId(data.tagNumber)
            window.api.send('sel-tag-ele', data.tagNumber);
        });
    }, []);


    useEffect(() => {
        window.api.receive('type-tag-ele', (data) => {
            console.log("Received data from main process:", data);

        });
    }, []);

    // useEffect(() => {
    //     window.api.receive('all-flags-fetched', (data) => {
    //         console.log("Received data from main process:", data);
    //     });
    // }, []);

    useEffect(() => {
        window.api.receive('line-type-details', (data) => {
            console.log("Received data from main process:", data);
            setlinelist(data)
            settaginfoshow(true)
        });
    }, []);

    useEffect(() => {
        window.api.receive('equ-type-details', (data) => {
            console.log("Received data from main process:", data);
            setequlist(data)
            settaginfoshow(true)
        });
    }, []);

    useEffect(() => {
        window.api.receive('ele-flag-out', (data) => {
            console.log("Received data from main process:", data);
            setflagtry(data)
        });
    }, []);

    useEffect(() => {
        console.log(flagtry);
        if (flagtry.length > 0) {
            const flagds = flagtry[0].flagId
            handleflagsconnectclick(flagds)
            window.api.send('flag-dou-sel', flagds);
        }
    }, [flagtry])

    useEffect(() => {
        window.api.receive('all-comments-fetched', (data) => {
            console.log("Received data from main process:", data);
            setcommentdet(data)
        });
    }, []);

    useEffect(() => {
        window.api.receive('doc-area-fetched', (data) => {
            console.log("Received data from main process:", data);
            setareainfo(data)
        });
    }, [])

    useEffect(() => {
        loadAndDrawRectangle(areainfo)
    }, [areainfo])

    useEffect(() => {
        console.log(commentdet);
    }, [commentdet])

    // useEffect(() => {
    //     window.api.receive('ele-tag-sel', (data) => {
    //         console.log("Received data from main process:", data);
    //         const cdf = data.map(element => element.elementId);
    //         console.log(cdf);
    //         if (cdf.length > 0) {
    //             console.log(('Enter if'));
    //             for (let i = 0; i < cdf.length; i++) {
    //                 paper.project.getItems({ class: paper.Path, }).forEach(item => {
    //                     if (cdf[i] == item._id) {
    //                         item.selected = true
    //                     }
    //                 });
    //             }
    //         }
    //     });
    // }, []);

    useEffect(() => {
        window.api.receive('ele-tag-sel', (data) => {
            console.log("Received data from main process:", data);
            const cdf = data.map(element => element.elementId);
            console.log(cdf);

            if (cdf.length > 0) {
                console.log('Enter if');

                // Iterate over each element ID received
                for (let i = 0; i < cdf.length; i++) {
                    const elementId = cdf[i];

                    // Get items from masdoc and select the matching ones
                    const items = paper.project.getItems({
                        match: (item) => item._id === elementId && item.data.fromMasdoc
                    });

                    items.forEach(item => {
                        item.selected = true;
                    });
                }
            }
        });
    }, []);

    useEffect(() => {
        if (enablescselect && canvas) {
            dlayerremove()
            console.log("enter useEffect");
            // setContextMenu({})
            // setinfocontextmenu({})
            enablescselinteraction()
        }

        return () => {
            if (canvas) {
                disablescselinteraction()

            }
        }
    }, [enablescselect, canvas])


    useEffect(() => {
        if (enableselect && canvas) {
            dlayerremove()
            console.log("enter useEffect");
            // setContextMenu({})
            // setinfocontextmenu({})
            enableselinteraction()
        }

        return () => {
            if (canvas) {
                disableselinteraction()

            }
        }
    }, [enableselect, canvas])

    useEffect(() => {
        if (enableflagtagselect && canvas) {
            dlayerremove()
            console.log("enter useEffect");
            // setContextMenu({})
            // setinfocontextmenu({})
            enableflagtaginteraction()
        }

        return () => {
            if (canvas) {
                disableflagtaginteraction()

            }
        }
    }, [enableflagtagselect, canvas])



    useEffect(() => {
        console.log(tagsselect);
        if (tagsselect.length > 0) {
            handletaginfodis()
        }
    }, [tagsselect])

    useEffect(() => {
        console.log(isassignid);
    }, [isassignid])


    useEffect(() => {
        console.log(issindoc);
    }, [issindoc])

    useEffect(() => {
        console.log(docdetnum);
    }, [docdetnum])


    useEffect(() => {
        if (panonoff && canvas) {
            dlayerremove()
            console.log("enter useEffect");
            // setContextMenu({})
            // setinfocontextmenu({})
            enablePanning()
        }

        return () => {
            if (canvas) {
                disablePanning()
            }
        }
    }, [panonoff, canvas])

    useEffect(() => {
        if (enablesinselect && canvas) {
            dlayerremove()
            console.log("entered useeffect");
            enablesinselinteraction()
        }
        return () => {
            if (canvas) {
                disablesinselinteraction()
            }
        }
    }, [enablesinselect, canvas])
    useEffect(() => {
        if (enablewinselect && canvas) {
            dlayerremove()
            console.log("enter useEffect");
            // setContextMenu({})
            // setinfocontextmenu({})
            enablewinselinteraction()
        }

        return () => {
            if (canvas) {
                disablewinselinteraction()
            }
        }
    }, [enablewinselect, canvas])

    useEffect(() => {
        if (enableareadraw && canvas) {
            dlayerremove()
            setallowredrect(true)
            console.log("enter useEffect");
            enableareadrawinteraction()
        }

        return () => {
            if (canvas) {
                disableareadrawinteraction()
            }
        }
    }, [enableareadraw, canvas])

    useEffect(() => {
        console.log(linelist);
    }, [linelist])

    useEffect(() => {
        console.log(equlist);
    }, [equlist])

    useEffect(() => {
        console.log("allcomments", allComments)
        createLabels();
    }, [showComment, allComments]);

    const dlayerremove = () => {
        if (drawingLayerRef.current !== null) {
            drawingLayerRef.current.remove()
        }
    }

    const enableselinteraction = () => {
        canvas.addEventListener('click', onMouseClick);
    }

    const enablescselinteraction = () => {
        canvas.addEventListener('click', onscMouseClick);
    }

    const enableflagtaginteraction = () => {
        canvas.addEventListener('click', onFlagtagClick)
        // canvas.removeEventListener('contextmenu', onflagconMenu)
        canvas.removeEventListener('contextmenu', ontaginfoMenu)
        settaginfomenu({ visible: false, x: 0, y: 0 })
    }

    const disableflagtaginteraction = () => {
        canvas.removeEventListener('click', onFlagtagClick)
        setflagconmenu({ visible: false, x: 0, y: 0 })
    }
    const disablescselinteraction = () => {
        canvas.removeEventListener('click', onscMouseClick);
    }

    const disableselinteraction = () => {
        canvas.removeEventListener('click', onMouseClick);
        setflagconmenu({ visible: false, x: 0, y: 0 })
        settaginfomenu({ visible: false, x: 0, y: 0 })
        // canvas.removeEventListener('contextmenu', onContextMenu);
        canvas.removeEventListener('contextmenu', onflagconMenu);
        canvas.removeEventListener('contextmenu', ontaginfoMenu)
    }

    const enablesinselinteraction = () => {
        setflagconmenu({ visible: false, x: 0, y: 0 })
        console.log("entered interaction");
        canvas.removeEventListener('contextmenu', onflagconMenu);
        canvas.addEventListener('click', onsingleClick);
    }
    const disablesinselinteraction = () => {
        settaginfomenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('click', onsingleClick);
        canvas.removeEventListener('contextmenu', ontaginfoMenu)
    }

    const onMouseClick = (event) => {
        console.log(event);
        console.log(temarrRef.current);
        setflagconmenu({ visible: false, x: 0, y: 0 })
        const isCtrlPressed = event.ctrlKey || event.metaKey; // metaKey for macOS
        if (!isCtrlPressed) {
            paper.project.getItems({ selected: true }).forEach(item => {
                console.log("enter unselect");
                item.selected = false;
            });
            console.log("enter handle")
            const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
            console.log("point:", point);
            const paperPoint = paper.view.viewToProject(point);
            console.log("paperpoint:", paperPoint)
            let hitResult = paper.project.hitTest(paperPoint, {
                stroke: true,
                segments: true,
                tolerance: 5,
            });

            // Check for text items separately
            if (!hitResult) {
                hitResult = paper.project.hitTest(paperPoint, {
                    fill: true,
                    tolerance: 5,
                    class: paper.PointText
                });
            }

            console.log("hitresult::", hitResult)
            console.log(hitResult);

            if (hitResult && hitResult.item && hitResult.item.data.fromMasdoc) {
                if (hitResult.item.selected === false) {
                    console.log(hitResult.item._id);

                    window.api.send('is-element-tag', hitResult.item._id);
                    window.api.send('ele-flag-sel', hitResult.item._id);
                    hitResult.item.selected = true;
                    canvas.addEventListener('contextmenu', onflagconMenu);
                    canvas.addEventListener('dblclick', onDoubleClick);
                    var resid = hitResult.item._id;
                    console.log(resid);
                    temarrRef.current.push(resid);
                    console.log(temarrRef.current);
                    setsindoc(resid);
                    setx(event.x);
                    sety(event.y);

                    window.api.send('fetch-sin-flag', resid);
                }
            } else {
                setflagconmenu({ visible: false, x: 0, y: 0 });
                canvas.removeEventListener('contextmenu', onflagconMenu);
                paper.project.getItems({ selected: true }).forEach(item => {
                    console.log("enter unselect");
                    item.selected = false;
                });
                temarrRef.current = [];
                console.log(temarrRef.current);
                setassignid(temarrRef.current);
            }
        } else {
            console.log("enter handle")
            const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
            console.log("point:", point);
            const paperPoint = paper.view.viewToProject(point);
            console.log("paperpoint:", paperPoint)
            let hitResult = paper.project.hitTest(paperPoint, {
                stroke: true,
                segments: true,
                tolerance: 5,
            });

            // Check for text items separately
            if (!hitResult) {
                hitResult = paper.project.hitTest(paperPoint, {
                    fill: true,
                    tolerance: 5,
                    class: paper.PointText
                });
            }

            console.log("hitresult::", hitResult)
            console.log(hitResult);

            if (hitResult && hitResult.item && hitResult.item.data.fromMasdoc) {
                if (hitResult.item.selected === false) {
                    hitResult.item.selected = true;
                    console.log(hitResult.item._id);
                    canvas.addEventListener('contextmenu', onflagconMenu);
                    var resid = hitResult.item._id;
                    console.log(resid);
                    temarrRef.current.push(resid);
                    console.log(temarrRef.current);
                }
            } else {
                setflagconmenu({ visible: false, x: 0, y: 0 });
                canvas.removeEventListener('contextmenu', onflagconMenu);
            }
        }
    };

    const onscMouseClick = (event) => {
        console.log(event);
        console.log(temarrRef.current);
        // setflagconmenu({ visible: false, x: 0, y: 0 })
        const isCtrlPressed = event.ctrlKey || event.metaKey; // metaKey for macOS
        if (!isCtrlPressed) {
            paper.project.getItems({ selected: true }).forEach(item => {
                console.log("enter unselect");
                item.selected = false;
            });
            console.log("enter handle")
            const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
            console.log("point:", point);
            const paperPoint = paper.view.viewToProject(point);
            console.log("paperpoint:", paperPoint)
            let hitResult = paper.project.hitTest(paperPoint, {
                stroke: true,
                segments: true,
                tolerance: 5,
            });

            // Check for text items separately
            if (!hitResult) {
                hitResult = paper.project.hitTest(paperPoint, {
                    fill: true,
                    tolerance: 5,
                    class: paper.PointText
                });
            }

            console.log("hitresult::", hitResult)
            console.log(hitResult);

            if (hitResult && hitResult.item && hitResult.item.data.fromconndoc) {
                if (hitResult.item.selected === false) {
                    console.log(hitResult.item._id);
                    if (hitResult.item instanceof paper.Path) {
                        console.log("Path Data:", hitResult.item.pathData);
                        // item.pathData contains the SVG path data as an array of commands
                    } else if (hitResult.item instanceof paper.PointText) {
                        console.log("Text Content:", hitResult.item.content);
                    }
                    // window.api.send('is-element-tag', hitResult.item._id);
                    // window.api.send('ele-flag-sel', hitResult.item._id);
                    hitResult.item.selected = true;
                    // canvas.addEventListener('contextmenu', onflagconMenu);
                    // canvas.addEventListener('dblclick', onDoubleClick);
                    var resid = hitResult.item._id;
                    console.log(resid);
                    temarrRef.current.push(resid);
                    console.log(temarrRef.current);
                    // setsindoc(resid);
                    // setx(event.x);
                    // sety(event.y);

                    // window.api.send('fetch-sin-flag', resid);
                }
            } else {
                // setflagconmenu({ visible: false, x: 0, y: 0 });
                // canvas.removeEventListener('contextmenu', onflagconMenu);
                paper.project.getItems({ selected: true }).forEach(item => {
                    console.log("enter unselect");
                    item.selected = false;
                });
                temarrRef.current = [];
                console.log(temarrRef.current);
                // setassignid(temarrRef.current);
            }
        } else {
            console.log("enter handle")
            const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
            console.log("point:", point);
            const paperPoint = paper.view.viewToProject(point);
            console.log("paperpoint:", paperPoint)
            let hitResult = paper.project.hitTest(paperPoint, {
                stroke: true,
                segments: true,
                tolerance: 5,
            });

            // Check for text items separately
            if (!hitResult) {
                hitResult = paper.project.hitTest(paperPoint, {
                    fill: true,
                    tolerance: 5,
                    class: paper.PointText
                });
            }

            console.log("hitresult::", hitResult)
            console.log(hitResult);

            if (hitResult && hitResult.item && hitResult.item.data.fromconndoc) {
                if (hitResult.item.selected === false) {
                    hitResult.item.selected = true;
                    console.log(hitResult.item._id);
                    // canvas.addEventListener('contextmenu', onflagconMenu);
                    var resid = hitResult.item._id;
                    console.log(resid);
                    temarrRef.current.push(resid);
                    console.log(temarrRef.current);
                }
            } else {
                // setflagconmenu({ visible: false, x: 0, y: 0 });
                // canvas.removeEventListener('contextmenu', onflagconMenu);
            }
        }
    }



    // const onMouseClick = (event) => {
    //     console.log(event);
    //     console.log(temarrRef.current);
    //     setflagconmenu({ visible: false, x: 0, y: 0 })
    //     const isCtrlPressed = event.ctrlKey || event.metaKey;// metaKey for macOS
    //     if (!isCtrlPressed) {
    //         paper.project.getItems({ selected: true }).forEach(item => {
    //             console.log("enter unselect");
    //             item.selected = false;
    //         });
    //         console.log("enter handle")
    //         const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
    //         console.log("point:", point);
    //         const paperPoint = paper.view.viewToProject(point);
    //         console.log("paperpoint:", paperPoint)
    //         const hitResult = paper.project.hitTest(paperPoint, {
    //             // fill: true,
    //             stroke: true,
    //             segments: true,
    //             tolerance: 5,
    //             // class: paper.PointText // Include PointText in hit test
    //         });
    //         console.log("hitresult::", hitResult)
    //         console.log(hitResult);
    //         console.log(hitResult.item);
    //         if (hitResult && hitResult.item) {
    //             if (hitResult.item.selected == false) {
    //                 console.log(hitResult.item._id);

    //                 window.api.send('is-element-tag', hitResult.item._id);
    //                 window.api.send('ele-flag-sel', hitResult.item._id);
    //                 // handletagflagselection()
    //                 hitResult.item.selected = true
    //                 // // canvas.addEventListener('contextmenu', onContextMenu);
    //                 canvas.addEventListener('contextmenu', onflagconMenu);
    //                 canvas.addEventListener('dblclick', onDoubleClick);
    //                 var resid = hitResult.item._id
    //                 console.log(resid);
    //                 temarrRef.current.push(resid);
    //                 console.log(temarrRef.current);
    //                 setsindoc(resid)
    //                 setx(event.x);
    //                 sety(event.y);

    //                 window.api.send('fetch-sin-flag', resid);
    //             }
    //         }
    //         else {
    //             setflagconmenu({ visible: false, x: 0, y: 0 })
    //             // canvas.removeEventListener('contextmenu', onContextMenu);
    //             canvas.removeEventListener('contextmenu', onflagconMenu);
    //             // canvas.removeEventListener('dblclick', onDoubleClick);
    //             paper.project.getItems({ selected: true }).forEach(item => {
    //                 console.log("enter unselect");
    //                 item.selected = false;
    //             });
    //             temarrRef.current = []
    //             console.log(temarrRef.current);
    //             setassignid(temarrRef.current)
    //         }

    //     }
    //     else {
    //         console.log("enter handle")
    //         const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
    //         console.log("point:", point);
    //         const paperPoint = paper.view.viewToProject(point);
    //         console.log("paperpoint:", paperPoint)
    //         const hitResult = paper.project.hitTest(paperPoint, {
    //             // fill: true,
    //             stroke: true,
    //             segments: true,
    //             tolerance: 5,
    //         });
    //         console.log("hitresult::", hitResult)
    //         console.log(hitResult);
    //         if (hitResult && hitResult.item) {
    //             if (hitResult.item.selected == false) {
    //                 hitResult.item.selected = true
    //                 console.log(hitResult.item._id);
    //                 // canvas.addEventListener('contextmenu', onContextMenu);
    //                 canvas.addEventListener('contextmenu', onflagconMenu);
    //                 var resid = hitResult.item._id
    //                 console.log(resid);
    //                 temarrRef.current.push(resid);
    //                 console.log(temarrRef.current);
    //             }
    //         }
    //         else {
    //             // setContextMenu({ visible: false, x: 0, y: 0 })
    //             // canvas.removeEventListener('contextmenu', onContextMenu);
    //             setflagconmenu({ visible: false, x: 0, y: 0 })
    //             canvas.removeEventListener('contextmenu', onflagconMenu);
    //         }
    //     }
    // }

    const onContextMenu = (event) => {
        // event.preventDefault(); // Prevent the default context menu

        // setContextMenu({
        //     visible: true,
        //     x: event.pageX,
        //     y: event.pageY,
        // });
    }

    const ontaginfoMenu = (event) => {
        event.preventDefault()
        settaginfomenu({
            visible: true,
            x: event.pageX,
            y: event.pageY
        })
    }

    const onflagconMenu = (event) => {
        console.log(event);
        setrx(event.x)
        setry(event.y)
        event.preventDefault()
        setflagconmenu({
            visible: true,
            x: event.pageX,
            y: event.pageY
        })
    }

    useEffect(() => {
        console.log(flagconmenu);
    }, [flagconmenu])

    useEffect(() => {
        setmasdoc(mascontent)
    }, [mascontent])
    const onsingleClick = async (event) => {
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        })
        console.log("enter handle")
        const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
        console.log("point:", point);
        const paperPoint = paper.view.viewToProject(point);
        console.log("paperpoint:", paperPoint)
        const hitResult = paper.project.hitTest(paperPoint, {
            // fill: true,
            stroke: true,
            segments: true,
            tolerance: 5,
        });

        // Check for text items separately
        if (!hitResult) {
            hitResult = paper.project.hitTest(paperPoint, {
                fill: true,
                tolerance: 5,
                class: paper.PointText
            });
        }

        console.log("hitresult::", hitResult)
        console.log(hitResult);

        if (hitResult && hitResult.item && hitResult.item.data.fromMasdoc) {
            if (hitResult.item.selected == false) {
                console.log(temarrRef.current);
                hitResult.item.selected = true
                console.log(hitResult.item.id);
                // canvas.addEventListener('contextmenu', onContextMenu);
                // canvas.addEventListener('contextmenu', ontaginfoMenu);
                var resid = hitResult.item.id
                console.log(resid);
                temarrRef.current.push(resid);
                console.log(temarrRef.current);

                for (let i = 0; i < temarrRef.current.length; i++) {
                    var elementId = temarrRef.current[i]
                    console.log(elementId);
                    window.api.send('fetch-sin-ele', elementId);
                }

            }
            temarrRef.current = []
            // hitResult = ''
        }
        else {

            settaginfomenu({ visible: false, x: 0, y: 0 })
            canvas.removeEventListener('contextmenu', ontaginfoMenu);
            paper.project.getItems({ selected: true }).forEach(item => {
                console.log("enter unselect");
                item.selected = false;
            });
        }

    }

    const onFlagtagClick = async (event) => {
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        })
        console.log("enter handle")
        const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
        console.log("point:", point);
        const paperPoint = paper.view.viewToProject(point);
        console.log("paperpoint:", paperPoint)
        const hitResult = paper.project.hitTest(paperPoint, {
            // fill: true,
            stroke: true,
            segments: true,
            tolerance: 5,
        });

        // Check for text items separately
        if (!hitResult) {
            hitResult = paper.project.hitTest(paperPoint, {
                fill: true,
                tolerance: 5,
                class: paper.PointText
            });
        }


        console.log("hitresult::", hitResult)
        console.log(hitResult);

        if (hitResult && hitResult.item && hitResult.item.data.fromMasdoc) {
            if (hitResult.item.selected == false) {
                console.log(temarrRef.current);
                hitResult.item.selected = true
                console.log(hitResult.item.id);
                // canvas.addEventListener('contextmenu', onContextMenu);
                // canvas.addEventListener('contextmenu', ontaginfoMenu);
                var resid = hitResult.item.id
                console.log(resid);
                window.api.send('fetch-flag-tag', resid)
            }
            // hitResult = ''
        }
        else {
            paper.project.getItems({ selected: true }).forEach(item => {
                console.log("enter unselect");
                item.selected = false;
            });
        }
    }

    const handleselect = () => {
        setenablescselect(false)
        setenableselect(true)
        setenablesinselect(false)
        setenablewinselect(false)
        setpanonoff(false)
        setenableareadraw(false)
        setenablehigh(false)
        // paper.project.getItems({ selected: true }).forEach(item => {
        //     console.log("enter unselect");
        //     item.selected = false;
        // })
    }

    const handlescselect = () => {
        setenablescselect(true)
        setenableselect(false)
        setenablesinselect(false)
        setenablewinselect(false)
        setpanonoff(false)
        setenableareadraw(false)
        setenablehigh(false)
    }

    const handleeditpan = () => {
        setbottomextend(!isbottomextend)
    }
    const handleassigntag = () => {
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', onflagconMenu);
        // console.log(isassignid);
        console.log(temarrRef.current);
        if (temarrRef.current.length == 0) {
            console.log('enter if');
            setCustomAlert(true);
            setModalMessage('Select elements first');
            // alert('Select elements first')
        }
        else {
            console.log('Enter else');
            setassignid(temarrRef.current)
            settagassishow(true)
        }

    }
    const handletagassiClose = () => {
        settagassishow(false);
    }

    const handleChange = (event) => {
        console.log(event.target.value);
        setSelectedValue(event.target.value);
    };
    const handleeletagassign = async (e) => {
        e.preventDefault()
        console.log("enter function");
        console.log(isassignid);
        console.log(allspids);
        console.log(allspids[0].filename);
        var currentfn = allspids[0].filename
        for (let i = 0; i < isassignid.length; i++) {
            // console.log("enter for loop");
            var elementid = isassignid[i]
            console.log(elementid);

            const data = {
                elementId: elementid,
                tagNumber: tagid,
                filename: currentfn
            };
            window.api.send('save-ele-tag', data);
        }
        console.log("reached end");
        setassignid([])
        settagassishow(false);
        setCustomAlert(true);
        setModalMessage('Tag assigned');
        // alert("Tag assigned")
        setSelectedValue('')
        temarrRef.current = []
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        });
        // // setShow(false)
    }

    const handleZoomIn = (e) => {
        const center = paper.view.center;
        paper.view.zoom *= 1.1;
        paper.view.center = center;
        drawStoredRectangle();
        drawsavedarea();
    };

    const handleZoomOut = (e) => {
        if (paper.view.zoom > 1) {
            const center = paper.view.center;
            paper.view.zoom *= 0.9;
            paper.view.center = center;
            drawStoredRectangle();
            drawsavedarea();
        }
    };


    const handlepan = (e) => {
        setenableselect(false)
        setenablewinselect(false)
        setenablesinselect(false)
        setenablescselect(false)
        setenableareadraw(false)
        setenablehigh(false)
        // document.querySelectorAll('.button').forEach(button => {
        //     button.classList.remove('active');
        // });

        // // Add 'active' class to the clicked button
        // e.target.classList.add('active');
        setpanonoff(true)
    }

    const handlefitview = (e) => {
        dlayerremove()
        // // svgGroup.position = paper.view.center;
        // document.querySelectorAll('.button').forEach(button => {
        //     button.classList.remove('active');
        // });

        // // Add 'active' class to the clicked button
        // e.target.classList.add('active');
        setpanonoff(false)
        console.log(viewRef);
        viewRef.current.zoom = 0.9900000000000001
        viewRef.current.center = originalPosition;

    }

    const enablePanning = () => {
        canvas.addEventListener('mousedown', phandleMouseDown);
        canvas.addEventListener('mousemove', phandleMouseMove);
        canvas.addEventListener('mouseup', phandleMouseUp);
        canvas.addEventListener('mouseleave', phandleMouseLeave);
    };

    const disablePanning = () => {

        canvas.removeEventListener('mousedown', phandleMouseDown);
        canvas.removeEventListener('mousemove', phandleMouseMove);
        canvas.removeEventListener('mouseup', phandleMouseUp);
        canvas.removeEventListener('mouseleave', phandleMouseLeave);
    }

    const phandleMouseUp = () => {
        isPanning.current = false;
    };

    const phandleMouseLeave = () => {
        isPanning.current = false;
    };

    const phandleMouseMove = (event) => {

        if (isPanning.current) {

            console.log(isPanning.current);
            const delta = new Point(event.offsetX, event.offsetY).subtract(lastMousePosition.current);
            console.log(delta);
            viewRef.current.center = viewRef.current.center.subtract(delta);
            console.log(viewRef.current.center);
            lastMousePosition.current = new Point(event.offsetX, event.offsetY);
            console.log(lastMousePosition.current);
        }
    };

    const phandleMouseDown = (event) => {
        isPanning.current = true;
        lastMousePosition.current = new Point(event.offsetX, event.offsetY);
        console.log(lastMousePosition.current);
        console.log(isPanning.current);
    };

    const handletaginfo = (e) => {
        // document.querySelectorAll('.button').forEach(button => {
        //     button.classList.remove('active');
        // });

        // // Add 'active' class to the clicked button
        // e.target.classList.add('active');
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('click', onMouseClick);
        canvas.removeEventListener('contextmenu', onflagconMenu);

        console.log(flagconmenu);
        dlayerremove()
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        });
        setenableselect(false)
        setenablewinselect(false)
        setenablescselect(false)
        e.preventDefault()
        setenablesinselect(true)
        setenableareadraw(false)
        setenablehigh(false)
        console.log("taginfoend");
    }

    const handlewindowselect = (e) => {
        // paper.project.getItems({ selected: true }).forEach(item => {
        //     console.log("enter unselect");
        //     item.selected = false;
        // })
        setenableselect(false)
        setpanonoff(false)
        setenablescselect(false)
        // // Remove 'active' class from all buttons
        // document.querySelectorAll('.button').forEach(button => {
        //     button.classList.remove('active');
        // });

        // paper.project.getItems({ class: paper.Path, }).forEach(item => {
        //     item.selected = false
        // });

        // // Add 'active' class to the clicked button
        // e.target.classList.add('active');
        setenablewinselect(true)
        setenableareadraw(false)
        setenablehigh(false)
    }

    const handleareadraw = (e) => {
        setenableselect(false)
        setpanonoff(false)
        setenablescselect(false)
        setenablewinselect(false)
        setenableareadraw(true)
        setenablehigh(false)
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        })
    }

    const enablewinselinteraction = () => {
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseDrag);
        canvas.addEventListener('mouseup', onMouseUp);
    }

    const disablewinselinteraction = () => {
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mousemove', onMouseDrag);
        canvas.removeEventListener('mouseup', onMouseUp);
    }

    const enableareadrawinteraction = () => {
        setallowredrect(true)
    }

    const disableareadrawinteraction = () => {
        // setenableareadraw(false)
        setallowredrect(false)
    }

    const addContextMenuListener = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.addEventListener('contextmenu', onflagconMenu);
    };

    const onMouseDown = (event) => {
        if (event.button !== 0) return;
        // Only proceed if the left mouse button is clicked

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const point = new paper.Point(event.clientX - rect.left, event.clientY - rect.top);
        const projectPoint = paper.view.viewToProject(point);
        startPoint = new paper.Point(projectPoint.x, projectPoint.y);
        selectionRectangle = new paper.Path.Rectangle(startPoint, startPoint);
        selectionRectangle.strokeColor = 'blue';
        selectionRectangle.strokeWidth = 1;
    };

    const onMouseDrag = (event) => {
        if (event.button !== 0) return;
        // Only proceed if the left mouse button is clicked
        if (selectionRectangle) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const point = new paper.Point(event.clientX - rect.left, event.clientY - rect.top);
            const projectPoint = paper.view.viewToProject(point);
            const endPoint = new paper.Point(projectPoint.x, projectPoint.y);
            selectionRectangle.remove(); // Remove the previous rectangle
            selectionRectangle = new paper.Path.Rectangle(startPoint, endPoint);
            selectionRectangle.strokeColor = 'blue';
            selectionRectangle.strokeWidth = 1;
        }
    };

    const onMouseUp = (event) => {
        if (event.button !== 0) return;
        // Only proceed if the left mouse button is clicked
        if (selectionRectangle) {
            let selectedItems = false;
            paper.project.getItems({ class: paper.Path }).forEach(item => {
                if (item.isInside(selectionRectangle.bounds) && item.data.fromMasdoc) {
                    item.selected = true;
                    // const canvas = canvasRef.current;
                    selectedItems = true;
                    temarrRef.current.push(item._id);
                    setsindoc(temarrRef.current);
                }
            });
            if (selectedItems) {
                addContextMenuListener(); // Ensure the context menu listener is added if items are selected
            } else {
                setflagconmenu({ visible: false, x: 0, y: 0 });
                const canvas = canvasRef.current;
                canvas.removeEventListener("contextmenu", onflagconMenu);
            }
            selectionRectangle.remove();
            selectionRectangle = null;
        }
    };



    const handlesavearea = () => {
        console.log(rectangles);

        if (Object.entries(rectangles).length > 0) {
            setareashows(true)
        }
        else {
            setModalMessage('No area drawn');
            setCustomAlert(true);
        }

    }

    const handleareaassiclose = () => {
        setareashows(false)
    }

    const handletaginfodis = () => {


        console.log("handle tag display");
        console.log(tagsselect);
        const ids = tagsselect.map(element => element.elementId);
        console.log(ids);
        for (let i = 0; i < ids.length; i++) {
            paper.project.getItems({ class: paper.Path, }).forEach(item => {
                if (ids[i] == item.id) {
                    item.selected = true
                }
            });
        }
        canvas.addEventListener('contextmenu', ontaginfoMenu);
        // settaginfoshow(true)
    }

    const handletaginfoClose = () => {
        settaginfoshow(false)
        setequlist({})
        setlinelist({})
        settagsinfo({})
    }
    const handletinfomodel = () => {
        settaginfomenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', ontaginfoMenu);
        settaginfoshow(true)
    }

    const handleflagassign = () => {
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', onflagconMenu);
        setflagassishow(true)
    }

    const handleflagassiClose = () => {
        setflagassishow(false)
    }

    const handleflagassidetails = () => {

        // Collect all element IDs in an array
        const elementIds = [];
        for (let i = 0; i < temarrRef.current.length; i++) {
            console.log("enter for loop");
            elementIds.push(temarrRef.current[i]);
            console.log(temarrRef.current[i]);
        }

        // Create the data object with all element IDs
        const data = {
            elementIds: elementIds,
            parentDoc: docdetnum,
            connectDoc: flagcdocnum
        };
        console.log(data);
        // Send the data object
        window.api.send('save-flag-ele', data);
        setflagcdocnum('')
        // Reset flags and unselect items
        setflagassishow(false);
        // setassignid([]);
        temarrRef.current = []
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        });

    }

    const handleflagcdocChange = (event) => {
        console.log(event.target.value);
        setflagcdocnum(event.target.value)
    }

    const handleflagconnection = () => {
        setflagconmenu({ visible: false, x: 0, y: 0 })
        // canvas.removeEventListener('contextmenu', onContextMenu);
        handlegetcdoc()
    }

    const handlegetcdoc = () => {
        console.log(issindoc);
        window.api.send('fetch-con-doc', issindoc);
    }

    const handleflagsubmit = () => {
        console.log('Enter handle flag submit');
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', onContextMenu);
        setflagsconn(true)
        handlegetcdoc()
        // console.log(sinflag);
        // console.log(docdetnum);
        // window.api.send('fetch-doc-flag', docdetnum);
    }

    const handleflagcondelete = () => {
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', onflagconMenu);
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        });
        // canvas.removeEventListener('contextmenu', onflagconMenu);
        console.log(issindoc);
        window.api.send('unflag-ele-flag', issindoc);
    }

    const handleflagtag = () => {
        dlayerremove()
        setflagconmenu({ visible: false, x: 0, y: 0 })
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        });
        setenableselect(false)
        setenablewinselect(false)
        setenablescselect(false)
        // e.preventDefault()
        setenablesinselect(false)
        console.log("flag tag connect");
        setenableflagtagselect(true)
        setenableareadraw(false)
        setenablehigh(false)
        // setflagconmenu({ visible: false, x: 0, y: 0 })

    }

    const handledeletetag = () => {
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', onflagconMenu);
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        });
        console.log(temarrRef.current);
        if (temarrRef.current.length == 0) {
            setCustomAlert(true);
            setModalMessage('Select elements first');
            // alert('Select elements first')
            temarrRef.current = []
        }
        else {
            window.api.send('del-ele-tag', issindoc);
            setflagconmenu({ visible: false, x: 0, y: 0 })
            canvas.removeEventListener('contextmenu', onflagconMenu);
            temarrRef.current = []
        }
    }

    // const handletagflagselection = () => {

    // }

    const handleaddcomment = () => {
        console.log("enter comment")
        setaddcomment(true)
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', onflagconMenu);
    }

    const handleclosecomment = () => {
        setaddcomment(false)
    }

    const handlecommentlabel = () => {
        setshowComment(!showComment)
    }

    const createLabels = () => {
        // Clear existing labels
        Object.values(labelObjects.current).forEach(labelObject => {
            labelObject.remove();
        });
        labelObjects.current = {};

        if (showComment) {
            allComments.forEach(item => {
                if (item.docNumber == docdetnum) {
                    const backgroundColor = getBackgroundColor(item.statusname);
                    const padding = 3;

                    // Create background rectangle
                    const text = new paper.PointText({
                        point: new paper.Point(item.coOrdinateX, item.coOrdinateY),
                        content: item.number,
                        fillColor: '#ffffff', // Text color
                        fontSize: 12
                    });

                    const textBounds = text.bounds;
                    const rect = new paper.Path.Rectangle({
                        point: new paper.Point(textBounds.x - padding, textBounds.y - padding),
                        size: new paper.Size(textBounds.width + padding * 2, textBounds.height + padding * 2),
                        fillColor: backgroundColor
                    });

                    // Group text and background rectangle
                    const labelGroup = new paper.Group([rect, text]);
                    labelGroup.onClick = () => handleCommentInfo(item);

                    labelObjects.current[item.number] = labelGroup;


                    // const label = new paper.PointText({
                    //     point: new paper.Point(item.coOrdinateX, item.coOrdinateY),
                    //     content: item.number,
                    //     fillColor: generateColor(item.number),
                    //     fontSize: 12
                    // });

                    // label.onClick = () => handleCommentInfo(item);

                    // labelObjects.current[item.number] = label;
                }
            });
        }

        paper.view.draw();
    };

    // // Function to generate a unique color based on index
    // const generateColor = (index) => {
    //     const hue = (index * 137.508) % 360; // Use a prime number multiplier for better distribution
    //     return `hsl(${hue}, 100%, 50%)`; // Generate HSL color
    // };

    // // Function to get background color based on status
    // const getBackgroundColor = (status) => {
    //     switch (status) {
    //         case 'open':
    //             return 'red';
    //         case 'closed':
    //             return 'green';
    //         case 'ongoing':
    //             return 'orange';
    //         case 'onhold':
    //             return 'yellow';
    //         default:
    //             return 'gray';
    //     }
    // };

    const getBackgroundColor = (status) => {
        const detail = commentdet.find(detail => detail.statusname === status);
        return detail ? detail.color : 'gray';
    };

    const handleCommentInfo = (item) => {
        console.log(item);
        setcommentinfo(item);
        setcommentinfotable(true);
    };

    const handleclosecommentinfo = () => {
        setcommentinfotable(false);
        setcommentinfo(null);
    };

    const deletecomment = (commentNumber) => {
        console.log(commentNumber);
        window.api.send("delete-comment", commentNumber);
        setcommentinfotable(false);
        setcommentinfo(null);
    };

    const handlecommentedit = () => {
        seteditcomment(true)
    }

    const handleclosecommentstatus = () => {
        seteditcomment(false)
    }

    const handleexportMenu = () => {
        setexportmenu(true)
        setenableselect(false)
        setenablewinselect(false)
        setenablesinselect(false)
        setenablescselect(false)
        setenableareadraw(false)
        setenablehigh(false)
        dlayerremove()
        paper.project.activeLayer.children.forEach(sitem => {

            const texts = paper.project.getItems({
                class: paper.PointText,
            }).map(item => item.content);

            setSelectedTexts(texts);

            const IDs = paper.project.getItems({
                class: paper.Path,
            }).map(item => item._id);

            setPathIDs(IDs);

        });
    }

    const handlecloseexport = () => {
        setexportmenu(false)
        // setexportmenutwo(false)
    };

    const handleexId = () => {
        console.log(pathIDs);
        const data = [['Path IDs'], ...pathIDs.map(id => [id])];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Path IDs');
        XLSX.writeFile(wb, 'path_ids.xlsx');
    }

    const handleextext = () => {
        if (selectedTexts.length === 0) {
            console.warn("No text data to export.");
            return;
        }
        // Create a worksheet
        const ws = XLSX.utils.json_to_sheet(selectedTexts.map((text, index) => ({ Text: text, Index: index + 1 })));
        // Create a workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'TextData');
        // Save the workbook as an Excel file
        XLSX.writeFile(wb, 'TextData.xlsx');
        console.log(wb);
    }

    const handleEditButtonClick = () => {
        setisEditing(true);
    }

    const handleSaveButtonClick = (commentNumber) => {
        setisEditing(false);
        const data = {
            number: commentNumber,
            statusname: statusedit,
            comment: commentedit,
            priority: priorityedit
        }
        window.api.send('editCommentStatus', data);
        setstatusedit('')
        setcommentedit('')
        setpriorityedit('')
        setCustomAlert(true);
        setModalMessage("Status updated")
        handleclosecommentinfo()
    }

    const handleflagsconnectclick = (flagds) => {
        if (flagsconn == true) {
            console.log(sinflag);
            console.log(flagds);
            if (flagds != '' && sinflag != '') {
                console.log('HELLO WORLD');
                const data = {
                    flagId: flagds,
                    connectFlag: sinflag
                }

                window.api.send('update-flag-table', data);
                console.log(sinflag);
                console.log(flagds);
                const sdata = {
                    flagId: sinflag,
                    connectFlag: flagds
                }

                window.api.send('update-flag-table', sdata);
                paper.project.getItems({ selected: true }).forEach(item => {
                    console.log("enter unselect");
                    item.selected = false;
                });
                setCustomAlert(true);
                setModalMessage('Flags are connected');
                setflagsconn(false)
            }

        }
    }

    const toggleHighlightConndoc = () => {
        setHighlightConndoc(prev => !prev);
        setmasdoc(prevValue => (prevValue === '' ? mascontent : ''))
        setfunctionactive(prev => !prev)
        setmastercopyactive(prev => !prev)
    };

    const toggleHighlightMasdoc = () => {
        setHighlightMasdoc(prev => !prev);
        setconndoc(prevValue => (prevValue === '' ? svgcontent : ''));
    };

    // const saveSVG = () => {
    //     const svgString = paper.project.exportSVG({ asString: true });
    //     const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    //     saveAs(blob, 'modified.svg');
    //   };

    const extractFilename = (filePath) => {
        // Split the file path by backslash
        const parts = filePath.split('\\');
        // Return the last part, which is the filename
        return parts[parts.length - 1];
    };

    const copyExtraElements = () => {
        if (!conndocElementsRef.current || !masdocElementsRef.current) return;

        const selectedItems = conndocElementsRef.current.filter(item => item.selected);

        if (selectedItems.length === 0) {
            console.error('No items selected.');
            return;
        }

        let overlayPathIndex = 0;
        let overlayTextIndex = 0;

        // Copy selected elements from conndoc to mascontent
        selectedItems.forEach(item => {
            let clonedItem;
            if (item instanceof paper.Path) {
                clonedItem = item.clone();
                clonedItem._id = `overlay-path-${overlayPathIndex++}`;
            } else if (item instanceof paper.PointText) {
                clonedItem = item.clone();
                clonedItem._id = `overlay-text-${overlayTextIndex++}`;
            }

            if (clonedItem) {
                masdocElementsRef.current.addChild(clonedItem);
            }
        });

        paper.view.draw();

        // Export the modified SVG as a string
        const svgString = paper.project.exportSVG({ asString: true });
        console.log(svgString);

        window.api.send('copy-to-master', { svgString, originalMasdocPath: mascontent });
    };

    const copySelectedItems = async () => {
        // Function to read the content of masdoc
        const readMasdocContent = () => {
            return new Promise((resolve, reject) => {
                window.api.send('read-svg-file', mascontent);
                window.api.receive('read-svg-file-response', (response) => {
                    if (response.error) {
                        reject(response.error);
                    } else {
                        resolve(response.data);
                    }
                });
            });
        };

        // Function to copy selected items from conndoc to masdoc
        const copySelectedItems = async () => {
            const selectedItems = conndocElementsRef.current.filter(item => item.selected);

            if (selectedItems.length === 0) {
                console.error('No items selected.');
                return;
            }

            try {
                // Read current masdoc content
                const svgCon = await readMasdocContent();

                // Parse the SVG content of masdoc
                const parser = new DOMParser();
                const doc = parser.parseFromString(svgCon, 'image/svg+xml');
                const svgRoot = doc.documentElement;

                // Clone and transform selected items
                selectedItems.forEach(item => {
                    const exportedSVG = item.exportSVG({ asString: true });
                    const itemDoc = parser.parseFromString(exportedSVG, 'image/svg+xml');
                    const itemElement = itemDoc.documentElement;

                    // Apply transformation
                    itemElement.setAttribute('transform', `translate(${item.position.x},${item.position.y})`);

                    // Add item to masdoc's root SVG
                    svgRoot.appendChild(doc.importNode(itemElement, true));
                });

                // Serialize the modified SVG content
                const serializer = new XMLSerializer();
                const modifiedSvgContent = serializer.serializeToString(svgRoot);

                // Log and send the modified SVG content
                console.log('modifiedSvgContent:', modifiedSvgContent);
                window.api.send('copy-to-master', { svgString: modifiedSvgContent, originalMasdocPath: mascontent });

            } catch (error) {
                console.error('Error copying selected items:', error);
            }
        };

        // Call the function to copy selected items
        copySelectedItems();
    };

    useEffect(() => {
        console.log(allowredrect);
        if (allowredrect == true) {
            startDrawingRectangles()
        }
    }, [allowredrect])


    // const startDrawingRectangles = () => {
    //     console.log(allowredrect);
    //     if (allowredrect == true) {
    //         console.log(tagdocsel);
    //         for (let i = 0; i < tagdocsel.length; i++) {
    //             paper.project.getItems({ class: paper.Path, }).forEach(item => {
    //                 if (tagdocsel[i] == item._id) {
    //                     item.selected = true
    //                 }
    //             });
    //         }

    //         drawingLayerRef.current = new paper.Layer({ name: 'drawingLayer' });
    //         drawingLayerRef.current.activate();
    //         const tool = new paper.Tool();
    //         let startPoint;
    //         let hasDragged = false;

    //         tool.onMouseDown = function (event) {
    //             startPoint = event.point;
    //             if (currentRectangleRef.current) {
    //                 currentRectangleRef.current.remove();
    //             }
    //             setRectangles({});
    //             hasDragged = false;
    //         };

    //         tool.onMouseDrag = function (event) {
    //             if (currentRectangleRef.current) {
    //                 currentRectangleRef.current.remove();
    //             }

    //             const rectangle = new paper.Path.Rectangle(startPoint, event.point);
    //             rectangle.strokeColor = 'red';
    //             rectangle.fillColor = new paper.Color(1, 0, 0, 0.3);
    //             rectangle.strokeWidth = 2 / paper.view.zoom;

    //             drawingLayerRef.current.addChild(rectangle);
    //             currentRectangleRef.current = rectangle;
    //             hasDragged = true;
    //         };

    //         tool.onMouseUp = function (event) {
    //             if (currentRectangleRef.current) {
    //                 if (hasDragged) {
    //                     const bounds = currentRectangleRef.current.bounds;
    //                     setRectangles({
    //                         topLeft: bounds.topLeft,
    //                         bottomRight: bounds.bottomRight,
    //                         x: bounds.topLeft.x,
    //                         y: bounds.topLeft.y,
    //                         width: bounds.width,
    //                         height: bounds.height
    //                     });
    //                 } else {
    //                     // Mouse was clicked without dragging, clear the rectangles
    //                     setRectangles({});
    //                 }
    //             }
    //         };
    //     }
    // };

    const startDrawingRectangles = () => {
        if (!drawingLayerRef.current) {
            drawingLayerRef.current = new paper.Layer({ name: 'drawingLayer' });
        }

        const tool = new paper.Tool();
        let startPoint = null;
        let currentRectangle = null;

        tool.onMouseDown = (event) => {
            startPoint = event.point;
            currentRectangle = null;
        };

        tool.onMouseDrag = (event) => {
            if (currentRectangle) {
                currentRectangle.remove();
            }

            currentRectangle = new paper.Path.Rectangle({
                from: startPoint,
                to: event.point,
                strokeColor: 'red',
                fillColor: new paper.Color(1, 0, 0, 0.3),
                strokeWidth: 2 / paper.view.zoom // Scale stroke width with zoom
            });

            drawingLayerRef.current.addChild(currentRectangle);
        };

        tool.onMouseUp = () => {
            if (currentRectangle) {
                currentRectangle.data.type = 'rectangle';
                currentRectangle.data.originalZoom = paper.view.zoom;
                currentRectangle = null;
            }
        };
    };

    const handlesavelayer = async (e) => {
        e.preventDefault();

        // if (!rectangles || !selectvalue || !sindocid) {
        //   console.error('Missing required data for saving layer');
        //   return;
        // }

        const ldata = {
            areaNumber: selectvalue,
            x: rectangles.x,
            y: rectangles.y,
            width: rectangles.width,
            height: rectangles.height,
            docId: sindocid
        };

        // Send data to Electron main process
        window.api.send('save-layer', ldata);

        // Clear the rectangle and reset state
        if (currentRectangleRef.current) {
            currentRectangleRef.current.remove();
            currentRectangleRef.current = null;
        }
        setRectangles(null);
        setselectvalue('');
        setareashows(false)
    };

    const handleareachange = (event) => {
        console.log(event.target.value);
        setselectvalue(event.target.value)
    }

    const handleshowarea = async () => {
        window.api.send('show-doc-area', sindocid)

    }

    // const recreateGroupMarkings = (savedData) => {
    //     if (!drawingLayerRef.current) {
    //         drawingLayerRef.current = new paper.Layer({ name: 'highlightLayer' });
    //     }
    //     drawingLayerRef.current.activate();

    //     // Now iterate directly over savedData since it's an array of rectangles
    //     savedData.forEach(rectData => {
    //         // Calculate current dimensions based on canvas size using X and Y instead of x and y
    //         const currentX = parseFloat(rectData.X) * paper.view.size.width;
    //         const currentY = parseFloat(rectData.Y) * paper.view.size.height;
    //         const currentWidth = parseFloat(rectData.width) * paper.view.size.width;
    //         const currentHeight = parseFloat(rectData.height) * paper.view.size.height;

    //         // Create new rectangle with calculated dimensions
    //         const rectangle = new paper.Path.Rectangle({
    //             point: [currentX, currentY],
    //             size: [currentWidth, currentHeight],
    //             strokeColor: rectData.strokeColor,
    //             fillColor: new paper.Color(rectData.fillColor),
    //             strokeWidth: parseFloat(rectData.strokeWidth) / paper.view.zoom,
    //             data: {
    //                 type: 'rectangle',
    //                 markId: rectData.markId,
    //                 rectId: rectData.rectId
    //             }
    //         });

    //         drawingLayerRef.current.addChild(rectangle);
    //     });

    //     paper.view.draw();
    // };


    // const recreateGroupMarkings = (savedData) => {
    //     if (!drawingLayerRef.current) {
    //         drawingLayerRef.current = new paper.Layer({ name: 'highlightLayer' });
    //     }
    //     drawingLayerRef.current.activate();

    //     savedData.forEach(rectData => {
    //         // Parse serialized data
    //         const projectCoords = JSON.parse(rectData.projectCoords);
    //         const viewState = JSON.parse(rectData.viewState);

    //         // Create rectangle using project coordinates
    //         const topLeft = new paper.Point(
    //             projectCoords.x,
    //             projectCoords.y
    //         );

    //         const rectangle = new paper.Path.Rectangle({
    //             point: topLeft,
    //             size: new paper.Size(
    //                 projectCoords.width,
    //                 projectCoords.height
    //             ),
    //             strokeColor: rectData.strokeColor,
    //             fillColor: new paper.Color(rectData.fillColor),
    //             // Scale stroke width based on current zoom relative to original zoom
    //             strokeWidth: (rectData.strokeWidth * paper.view.zoom),
    //             data: { 
    //                 type: 'rectangle',
    //                 markId: rectData.markId,
    //                 rectId: rectData.rectId,
    //                 originalZoom: viewState.zoom  // Use original zoom from parsed data
    //             }
    //         });

    //         drawingLayerRef.current.addChild(rectangle);
    //     });

    //     paper.view.draw();
    // };


    // const recreateGroupMarkings = (savedData) => {
    //     if (!drawingLayerRef.current) {
    //         drawingLayerRef.current = new paper.Layer({ name: 'highlightLayer' });
    //     }
    //     drawingLayerRef.current.activate();

    //     savedData.forEach(rectData => {
    //         // Parse serialized data
    //         const projectCoords = JSON.parse(rectData.projectCoords);
    //         const viewState = JSON.parse(rectData.viewState);

    //         // Create rectangle using project coordinates
    //         const topLeft = new paper.Point(
    //             projectCoords.x,
    //             projectCoords.y
    //         );

    //         // Determine fill color with transparency for reddish shades
    //         const fillColor = new paper.Color(rectData.fillColor);
    //         if (fillColor.red > 0.8 && fillColor.green < 0.2 && fillColor.blue < 0.2) {
    //             fillColor.alpha = 0.5; // Set transparency for reddish colors
    //         }

    //         const rectangle = new paper.Path.Rectangle({
    //             point: topLeft,
    //             size: new paper.Size(
    //                 projectCoords.width,
    //                 projectCoords.height
    //             ),
    //             strokeColor: rectData.strokeColor,
    //             fillColor: fillColor, // Use the adjusted fill color
    //             strokeWidth: rectData.strokeWidth * paper.view.zoom, // Scale stroke width
    //             data: {
    //                 type: 'rectangle',
    //                 markId: rectData.markId,
    //                 rectId: rectData.rectId,
    //                 originalZoom: viewState.zoom // Use original zoom from parsed data
    //             }
    //         });

    //         // Ensure no blue highlight appears on selection
    //         rectangle.selected = false;

    //         drawingLayerRef.current.addChild(rectangle);
    //     });

    //     paper.view.draw();
    // };

    const recreateGroupMarkings = (savedData) => {
        if (!drawingLayerRef.current) {
            drawingLayerRef.current = new paper.Layer({ name: 'highlightLayer' });
        }
        drawingLayerRef.current.removeChildren();
        drawingLayerRef.current.activate();

        savedData.forEach(rectData => {
            try {
                const projectCoords = JSON.parse(rectData.projectCoords);
                const viewState = JSON.parse(rectData.viewState);

                // Parse Point arrays correctly
                const topLeft = new paper.Point(projectCoords.topLeft[1], projectCoords.topLeft[2]);
                const bottomRight = new paper.Point(projectCoords.bottomRight[1], projectCoords.bottomRight[2]);

                const rectangle = new paper.Path.Rectangle({
                    from: topLeft,
                    to: bottomRight,
                    strokeColor: rectData.strokeColor,
                    fillColor: new paper.Color(rectData.fillColor).multiply(0.5),
                    strokeWidth: rectData.strokeWidth / paper.view.zoom,
                    data: {
                        type: 'rectangle',
                        markId: rectData.markId,
                        rectId: rectData.rectId,
                        originalZoom: viewState.zoom
                    }
                });

                rectangle.strokeWidth = (rectData.strokeWidth / viewState.zoom) * paper.view.zoom;
                drawingLayerRef.current.addChild(rectangle);
            } catch (error) {
                console.error('Error recreating rectangle:', error);
            }
        });

        paper.view.draw();
    };
    useEffect(() => {
        console.log(markdet);

    }, [markdet])

    const handleshowmarkup = () => {
        recreateGroupMarkings(markdet);
    }

    const loadAndDrawRectangle = (savedDataArray) => {
        // drawingLayerRef.current = new paper.Layer({ name: 'drawingLayer' });
        if (!Array.isArray(savedDataArray) || savedDataArray.length === 0 || !drawingLayerRef.current) return;

        drawingLayerRef.current.removeChildren();

        const drawnRectangles = savedDataArray.map(savedData => {
            const rectangle = new paper.Path.Rectangle({
                point: [parseFloat(savedData.x), parseFloat(savedData.y)],
                size: [parseFloat(savedData.width), parseFloat(savedData.height)],
                strokeColor: 'red',
                fillColor: new paper.Color(1, 0, 0, 0.5),
                strokeWidth: 2 / paper.view.zoom
            });

            drawingLayerRef.current.addChild(rectangle);

            return {
                rectangle,
                data: {
                    areaNumber: savedData.areaNumber,
                    x: parseFloat(savedData.x),
                    y: parseFloat(savedData.y),
                    width: parseFloat(savedData.width),
                    height: parseFloat(savedData.height),
                    docId: savedData.docId
                }
            };
        });

        console.log(drawnRectangles);
        // const valu=drawnRectangles.map(item => item.data)
        // console.log(valu);

        setsavRectangles(drawnRectangles.map(item => item.data));


        // setSindocid(savedDataArray[0].docId); 
        // Assuming all rectangles belong to the same document
    };



    useEffect(() => {
        console.log(istagtabdet);
    }, [istagtabdet])

    useEffect(() => {
        console.log(istagtypedet);
    }, [istagtypedet])

    const handletagtabdet = () => {
        settagtabdet(true)
        settagtabdet(false)
    }

    const handletagtypedet = () => {
        settagtypedet(true)
        settagtabdet(false)
    }

    const handleGotothree = () => {
        window.api.send('open-three-from-pid', pidTagId)
        setopenThreeCanvas(true);
        setiRoamercanvas(true);
        setOpenSpidCanvas(false);
        setSpidOpen(false);
        setrightSideNavVisible(true);

    }
    const handledrawhigh = (e) => {
        setenableselect(false)
        setpanonoff(false)
        setenablescselect(false)
        setenablewinselect(false)
        setenableareadraw(false)
        setenablehigh(true)
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        })
    }

    useEffect(() => {
        if (enablehigh && canvas) {
            dlayerremove()
            console.log("enter useEffect");
            enablehighinteraction()
        }

        return () => {
            if (canvas) {
                disablehighinteraction()
            }
        }
    }, [enablehigh, canvas])

    const enablehighinteraction = () => {
        startDrawingHigh()
    }

    // const startDrawingHigh = () => {
    //     // Create a new layer for highlights if it doesn't exist
    //     if (!drawingLayerRef.current) {
    //         drawingLayerRef.current = new paper.Layer({ name: 'highlightLayer' });
    //     }
    //     drawingLayerRef.current.activate();

    //     const tool = new paper.Tool();
    //     let startPoint;
    //     let currentRectangle = null;
    //     let isDrawing = false;
    //     let isResizing = false;
    //     let selectedHandle = null;
    //     let handles = [];

    //     // Function to create resize handles
    //     const createHandles = (rectangle) => {
    //         // Remove existing handles
    //         handles.forEach(handle => handle.remove());
    //         handles = [];

    //         const segments = rectangle.segments;
    //         const handleSize = 8 / paper.view.zoom;

    //         // Create handles at each corner and midpoint
    //         segments.forEach((segment, index) => {
    //             const handle = new paper.Path.Circle({
    //                 center: segment.point,
    //                 radius: handleSize,
    //                 fillColor: 'white',
    //                 strokeColor: 'blue',
    //                 strokeWidth: 1 / paper.view.zoom,
    //                 data: { index: index }
    //             });
    //             handles.push(handle);
    //         });

    //         // Create midpoint handles
    //         for (let i = 0; i < segments.length; i++) {
    //             const nextIndex = (i + 1) % segments.length;
    //             const midpoint = segments[i].point.add(segments[nextIndex].point).divide(2);
    //             const handle = new paper.Path.Circle({
    //                 center: midpoint,
    //                 radius: handleSize,
    //                 fillColor: 'white',
    //                 strokeColor: 'blue',
    //                 strokeWidth: 1 / paper.view.zoom,
    //                 data: { index: i + segments.length }
    //             });
    //             handles.push(handle);
    //         }
    //     };

    //     const updateHandlePositions = () => {
    //         if (!currentRectangle) return;

    //         const segments = currentRectangle.segments;
    //         const cornerHandles = handles.slice(0, 4);
    //         const midpointHandles = handles.slice(4);

    //         // Update corner handles
    //         cornerHandles.forEach((handle, index) => {
    //             handle.position = segments[index].point;
    //         });

    //         // Update midpoint handles
    //         midpointHandles.forEach((handle, index) => {
    //             const startIndex = index;
    //             const endIndex = (index + 1) % 4;
    //             const midpoint = segments[startIndex].point.add(segments[endIndex].point).divide(2);
    //             handle.position = midpoint;
    //         });
    //     };

    //     tool.onMouseDown = (event) => {
    //         const hitResult = paper.project.hitTest(event.point, {
    //             tolerance: 8,
    //             fill: true,
    //             stroke: true
    //         });

    //         if (hitResult && hitResult.item && handles.includes(hitResult.item)) {
    //             // Start resizing if a handle is clicked
    //             isResizing = true;
    //             selectedHandle = hitResult.item;
    //         } else if (!currentRectangle || !currentRectangle.bounds.contains(event.point)) {
    //             // Start drawing new rectangle
    //             isDrawing = true;
    //             startPoint = event.point;

    //             if (currentRectangle) {
    //                 handles.forEach(handle => handle.remove());
    //                 handles = [];
    //             }

    //             currentRectangle = new paper.Path.Rectangle({
    //                 from: startPoint,
    //                 to: event.point,
    //                 strokeColor: 'red',
    //                 strokeWidth: 2 / paper.view.zoom,
    //                 fillColor: new paper.Color(1, 0, 0, 0.3)
    //             });
    //         }
    //     };

    //     tool.onMouseDrag = (event) => {
    //         if (isDrawing && currentRectangle) {
    //             // Update rectangle size while drawing
    //             currentRectangle.remove();
    //             currentRectangle = new paper.Path.Rectangle({
    //                 from: startPoint,
    //                 to: event.point,
    //                 strokeColor: 'red',
    //                 strokeWidth: 2 / paper.view.zoom,
    //                 fillColor: new paper.Color(1, 0, 0, 0.3)
    //             });
    //         } else if (isResizing && selectedHandle && currentRectangle) {
    //             // Handle resizing logic
    //             const handleIndex = selectedHandle.data.index;
    //             const bounds = currentRectangle.bounds;
    //             let newBounds = bounds.clone();

    //             if (handleIndex < 4) {
    //                 // Corner handles
    //                 switch (handleIndex) {
    //                     case 0: // Top-left
    //                         newBounds.topLeft = event.point;
    //                         break;
    //                     case 1: // Top-right
    //                         newBounds.topRight = event.point;
    //                         break;
    //                     case 2: // Bottom-right
    //                         newBounds.bottomRight = event.point;
    //                         break;
    //                     case 3: // Bottom-left
    //                         newBounds.bottomLeft = event.point;
    //                         break;
    //                 }
    //             } else {
    //                 // Midpoint handles
    //                 const edgeIndex = handleIndex - 4;
    //                 switch (edgeIndex) {
    //                     case 0: // Top edge
    //                         newBounds.top = event.point.y;
    //                         break;
    //                     case 1: // Right edge
    //                         newBounds.right = event.point.x;
    //                         break;
    //                     case 2: // Bottom edge
    //                         newBounds.bottom = event.point.y;
    //                         break;
    //                     case 3: // Left edge
    //                         newBounds.left = event.point.x;
    //                         break;
    //                 }
    //             }

    //             currentRectangle.bounds = newBounds;
    //             updateHandlePositions();
    //         }
    //     };

    //     tool.onMouseUp = (event) => {
    //         if (isDrawing) {
    //             isDrawing = false;
    //             if (currentRectangle) {
    //                 createHandles(currentRectangle);
    //             }
    //         }
    //         isResizing = false;
    //         selectedHandle = null;
    //     };

    //     // Update handles when view is zoomed or panned
    //     paper.view.onScale = () => {
    //         if (currentRectangle) {
    //             handles.forEach(handle => {
    //                 handle.radius = 8 / paper.view.zoom;
    //                 handle.strokeWidth = 1 / paper.view.zoom;
    //             });
    //             currentRectangle.strokeWidth = 2 / paper.view.zoom;
    //         }
    //     };
    // };

    // const disablehighinteraction = () => {
    //     if (paper.tool) {
    //         paper.tool.remove();
    //     }
    //     if (drawingLayerRef.current) {
    //         drawingLayerRef.current.remove();
    //         drawingLayerRef.current = null;
    //     }
    // };

    // const startDrawingHigh = () => {
    //     // Create a new layer for highlights if it doesn't exist
    //     if (!drawingLayerRef.current) {
    //         drawingLayerRef.current = new paper.Layer({ name: 'highlightLayer' });
    //     }
    //     drawingLayerRef.current.activate();

    //     const tool = new paper.Tool();
    //     let startPoint;
    //     let currentRectangle = null;
    //     let isDrawing = false;
    //     let isResizing = false;
    //     let selectedHandle = null;
    //     let handles = [];
    //     let selectedRectangles = new Set();

    //     const highlightSelected = (rectangle) => {
    //         if (selectedRectangles.has(rectangle)) {
    //             rectangle.strokeColor = 'blue';
    //             rectangle.strokeWidth = 3 / paper.view.zoom;
    //         } else {
    //             rectangle.strokeColor = 'red';
    //             rectangle.strokeWidth = 2 / paper.view.zoom;
    //         }
    //     };

    //     // Function to create resize handles
    //     const createHandles = (rectangle) => {
    //         // Remove existing handles
    //         handles.forEach(handle => handle.remove());
    //         handles = [];

    //         const segments = rectangle.segments;
    //         const handleSize = 8 / paper.view.zoom;

    //         // Create handles at each corner and midpoint
    //         segments.forEach((segment, index) => {
    //             const handle = new paper.Path.Circle({
    //                 center: segment.point,
    //                 radius: handleSize,
    //                 fillColor: 'white',
    //                 strokeColor: 'blue',
    //                 strokeWidth: 1 / paper.view.zoom,
    //                 data: { index: index, type: 'handle' }
    //             });
    //             handles.push(handle);
    //         });

    //         // Create midpoint handles
    //         for (let i = 0; i < segments.length; i++) {
    //             const nextIndex = (i + 1) % segments.length;
    //             const midpoint = segments[i].point.add(segments[nextIndex].point).divide(2);
    //             const handle = new paper.Path.Circle({
    //                 center: midpoint,
    //                 radius: handleSize,
    //                 fillColor: 'white',
    //                 strokeColor: 'blue',
    //                 strokeWidth: 1 / paper.view.zoom,
    //                 data: { index: i + segments.length, type: 'handle' }
    //             });
    //             handles.push(handle);
    //         }
    //     };

    //     const updateHandlePositions = () => {
    //         if (!currentRectangle) return;

    //         const segments = currentRectangle.segments;
    //         const cornerHandles = handles.slice(0, 4);
    //         const midpointHandles = handles.slice(4);

    //         // Update corner handles
    //         cornerHandles.forEach((handle, index) => {
    //             handle.position = segments[index].point;
    //         });

    //         // Update midpoint handles
    //         midpointHandles.forEach((handle, index) => {
    //             const startIndex = index;
    //             const endIndex = (index + 1) % 4;
    //             const midpoint = segments[startIndex].point.add(segments[endIndex].point).divide(2);
    //             handle.position = midpoint;
    //         });
    //     };

    //     const clearSelection = () => {
    //         selectedRectangles.forEach(rect => {
    //             highlightSelected(rect);
    //         });
    //         selectedRectangles.clear();
    //         handles.forEach(handle => handle.remove());
    //         handles = [];
    //         currentRectangle = null;
    //     };

    //     tool.onMouseDown = (event) => {
    //         const isCtrlPressed = event.modifiers.control || event.modifiers.meta; // meta for macOS
    //         const hitResult = paper.project.hitTest(event.point, {
    //             tolerance: 8,
    //             fill: true,
    //             stroke: true
    //         });

    //         if (hitResult) {
    //             if (hitResult.item.data.type === 'handle') {
    //                 // Start resizing if a handle is clicked
    //                 isResizing = true;
    //                 selectedHandle = hitResult.item;
    //             } else if (hitResult.item instanceof paper.Path.Rectangle) {
    //                 // Handle rectangle selection
    //                 if (!isCtrlPressed) {
    //                     clearSelection();
    //                 }
    //                 currentRectangle = hitResult.item;
    //                 if (selectedRectangles.has(currentRectangle)) {
    //                     selectedRectangles.delete(currentRectangle);
    //                 } else {
    //                     selectedRectangles.add(currentRectangle);
    //                 }
    //                 selectedRectangles.forEach(rect => {
    //                     highlightSelected(rect);
    //                 });
    //                 if (selectedRectangles.size === 1) {
    //                     createHandles(currentRectangle);
    //                 }
    //             } else {
    //                 if (!isCtrlPressed) {
    //                     clearSelection();
    //                 }
    //             }
    //         } else {
    //             // Start drawing new rectangle
    //             if (!isCtrlPressed) {
    //                 clearSelection();
    //             }
    //             isDrawing = true;
    //             startPoint = event.point;
    //             currentRectangle = new paper.Path.Rectangle({
    //                 from: startPoint,
    //                 to: event.point,
    //                 strokeColor: 'red',
    //                 strokeWidth: 2 / paper.view.zoom,
    //                 fillColor: new paper.Color(1, 0, 0, 0.3),
    //                 data: { type: 'rectangle' }
    //             });
    //         }
    //     };

    //     tool.onMouseDrag = (event) => {
    //         if (isDrawing && currentRectangle) {
    //             // Update rectangle size while drawing
    //             currentRectangle.remove();
    //             currentRectangle = new paper.Path.Rectangle({
    //                 from: startPoint,
    //                 to: event.point,
    //                 strokeColor: 'red',
    //                 strokeWidth: 2 / paper.view.zoom,
    //                 fillColor: new paper.Color(1, 0, 0, 0.3),
    //                 data: { type: 'rectangle' }
    //             });
    //         } else if (isResizing && selectedHandle && currentRectangle) {
    //             // Handle resizing logic
    //             const handleIndex = selectedHandle.data.index;
    //             const bounds = currentRectangle.bounds;
    //             let newBounds = bounds.clone();

    //             if (handleIndex < 4) {
    //                 // Corner handles
    //                 switch (handleIndex) {
    //                     case 0: // Top-left
    //                         newBounds.topLeft = event.point;
    //                         break;
    //                     case 1: // Top-right
    //                         newBounds.topRight = event.point;
    //                         break;
    //                     case 2: // Bottom-right
    //                         newBounds.bottomRight = event.point;
    //                         break;
    //                     case 3: // Bottom-left
    //                         newBounds.bottomLeft = event.point;
    //                         break;
    //                 }
    //             } else {
    //                 // Midpoint handles
    //                 const edgeIndex = handleIndex - 4;
    //                 switch (edgeIndex) {
    //                     case 0: // Top edge
    //                         newBounds.top = event.point.y;
    //                         break;
    //                     case 1: // Right edge
    //                         newBounds.right = event.point.x;
    //                         break;
    //                     case 2: // Bottom edge
    //                         newBounds.bottom = event.point.y;
    //                         break;
    //                     case 3: // Left edge
    //                         newBounds.left = event.point.x;
    //                         break;
    //                 }
    //             }

    //             currentRectangle.bounds = newBounds;
    //             updateHandlePositions();
    //         }
    //     };

    //     tool.onMouseUp = (event) => {
    //         if (isDrawing) {
    //             isDrawing = false;
    //             if (currentRectangle) {
    //                 selectedRectangles.add(currentRectangle);
    //                 highlightSelected(currentRectangle);
    //                 createHandles(currentRectangle);
    //             }
    //         }
    //         isResizing = false;
    //         selectedHandle = null;
    //     };

    //     // Update handles when view is zoomed or panned
    //     paper.view.onScale = () => {
    //         handles.forEach(handle => {
    //             handle.radius = 8 / paper.view.zoom;
    //             handle.strokeWidth = 1 / paper.view.zoom;
    //         });
    //         selectedRectangles.forEach(rect => {
    //             rect.strokeWidth = rect === currentRectangle ? 3 / paper.view.zoom : 2 / paper.view.zoom;
    //         });
    //     };
    // };

    // const disablehighinteraction = () => {
    //     if (paper.tool) {
    //         paper.tool.remove();
    //     }
    //     if (drawingLayerRef.current) {
    //         drawingLayerRef.current.remove();
    //         drawingLayerRef.current = null;
    //     }
    // };


    // const startDrawingHigh = () => {
    //     if (!drawingLayerRef.current) {
    //         drawingLayerRef.current = new paper.Layer({ name: 'highlightLayer' });
    //     }
    //     drawingLayerRef.current.activate();

    //     const tool = new paper.Tool();
    //     let startPoint;
    //     let currentRectangle = null;
    //     let isDrawing = false;
    //     let isResizing = false;
    //     let selectedHandle = null;
    //     let handles = [];
    //     let selectedRectangles = new Set();

    //     const highlightSelected = (rectangle, isSelected) => {
    //         if (isSelected) {
    //             rectangle.strokeColor = 'blue';
    //             rectangle.strokeWidth = 3 / paper.view.zoom;
    //         } else {
    //             rectangle.strokeColor = 'red';
    //             rectangle.strokeWidth = 2 / paper.view.zoom;
    //         }
    //     };

    //     const createHandles = (rectangle) => {
    //         handles.forEach(handle => handle.remove());
    //         handles = [];

    //         const segments = rectangle.segments;
    //         const handleSize = 8 / paper.view.zoom;

    //         segments.forEach((segment, index) => {
    //             const handle = new paper.Path.Circle({
    //                 center: segment.point,
    //                 radius: handleSize,
    //                 fillColor: 'white',
    //                 strokeColor: 'blue',
    //                 strokeWidth: 1 / paper.view.zoom,
    //                 data: { index: index, type: 'handle' }
    //             });
    //             handles.push(handle);
    //         });

    //         for (let i = 0; i < segments.length; i++) {
    //             const nextIndex = (i + 1) % segments.length;
    //             const midpoint = segments[i].point.add(segments[nextIndex].point).divide(2);
    //             const handle = new paper.Path.Circle({
    //                 center: midpoint,
    //                 radius: handleSize,
    //                 fillColor: 'white',
    //                 strokeColor: 'blue',
    //                 strokeWidth: 1 / paper.view.zoom,
    //                 data: { index: i + segments.length, type: 'handle' }
    //             });
    //             handles.push(handle);
    //         }
    //     };

    //     const updateHandlePositions = () => {
    //         if (!currentRectangle) return;

    //         const segments = currentRectangle.segments;
    //         const cornerHandles = handles.slice(0, 4);
    //         const midpointHandles = handles.slice(4);

    //         cornerHandles.forEach((handle, index) => {
    //             handle.position = segments[index].point;
    //         });

    //         midpointHandles.forEach((handle, index) => {
    //             const startIndex = index;
    //             const endIndex = (index + 1) % 4;
    //             const midpoint = segments[startIndex].point.add(segments[endIndex].point).divide(2);
    //             handle.position = midpoint;
    //         });
    //     };

    //     const clearSelection = () => {
    //         selectedRectangles.forEach(rect => {
    //             highlightSelected(rect, false);
    //         });
    //         selectedRectangles.clear();
    //         handles.forEach(handle => handle.remove());
    //         handles = [];
    //         currentRectangle = null;
    //     };

    //     tool.onMouseDown = function (event) {
    //         if (isDrawing || isResizing) return;

    //         const isCtrlPressed = event.modifiers.control || event.modifiers.meta;
    //         const hitResult = paper.project.hitTest(event.point, {
    //             tolerance: 8,
    //             fill: true,
    //             stroke: true
    //         });

    //         if (hitResult) {
    //             if (hitResult.item.data.type === 'handle') {
    //                 isResizing = true;
    //                 selectedHandle = hitResult.item;
    //                 return;
    //             }

    //             if (hitResult.item.data.type === 'rectangle') {
    //                 // If Ctrl is not pressed, clear previous selection
    //                 if (!isCtrlPressed) {
    //                     clearSelection();
    //                 }

    //                 currentRectangle = hitResult.item;

    //                 if (selectedRectangles.has(currentRectangle)) {
    //                     // Deselect if already selected
    //                     selectedRectangles.delete(currentRectangle);
    //                     highlightSelected(currentRectangle, false);
    //                     if (selectedRectangles.size === 0) {
    //                         currentRectangle = null;
    //                     }
    //                 } else {
    //                     // Select the rectangle
    //                     selectedRectangles.add(currentRectangle);
    //                     highlightSelected(currentRectangle, true);
    //                     createHandles(currentRectangle);
    //                 }
    //                 return;
    //             }
    //         }

    //         // Clicking on empty space
    //         if (!isCtrlPressed) {
    //             clearSelection();
    //         }

    //         // Start drawing new rectangle
    //         isDrawing = true;
    //         startPoint = event.point;
    //         currentRectangle = new paper.Path.Rectangle({
    //             from: startPoint,
    //             to: event.point,
    //             strokeColor: 'red',
    //             strokeWidth: 2 / paper.view.zoom,
    //             fillColor: new paper.Color(1, 0, 0, 0.3),
    //             data: { type: 'rectangle' }
    //         });
    //     };

    //     tool.onMouseDrag = function (event) {
    //         if (isDrawing && currentRectangle) {
    //             currentRectangle.remove();
    //             currentRectangle = new paper.Path.Rectangle({
    //                 from: startPoint,
    //                 to: event.point,
    //                 strokeColor: 'red',
    //                 strokeWidth: 2 / paper.view.zoom,
    //                 fillColor: new paper.Color(1, 0, 0, 0.3),
    //                 data: { type: 'rectangle' }
    //             });
    //         } else if (isResizing && selectedHandle && currentRectangle) {
    //             const handleIndex = selectedHandle.data.index;
    //             const bounds = currentRectangle.bounds;
    //             let newBounds = bounds.clone();

    //             if (handleIndex < 4) {
    //                 switch (handleIndex) {
    //                     case 0: newBounds.topLeft = event.point; break;
    //                     case 1: newBounds.topRight = event.point; break;
    //                     case 2: newBounds.bottomRight = event.point; break;
    //                     case 3: newBounds.bottomLeft = event.point; break;
    //                 }
    //             } else {
    //                 const edgeIndex = handleIndex - 4;
    //                 switch (edgeIndex) {
    //                     case 0: newBounds.top = event.point.y; break;
    //                     case 1: newBounds.right = event.point.x; break;
    //                     case 2: newBounds.bottom = event.point.y; break;
    //                     case 3: newBounds.left = event.point.x; break;
    //                 }
    //             }

    //             currentRectangle.bounds = newBounds;
    //             updateHandlePositions();
    //         }
    //     };

    //     tool.onMouseUp = function (event) {
    //         if (isDrawing) {
    //             isDrawing = false;
    //             if (currentRectangle) {
    //                 // Keep the new rectangle red
    //                 currentRectangle.strokeColor = 'red';
    //                 currentRectangle.strokeWidth = 2 / paper.view.zoom;
    //                 currentRectangle = null;
    //             }
    //         }
    //         isResizing = false;
    //         selectedHandle = null;
    //     };

    //     paper.view.onScale = () => {
    //         handles.forEach(handle => {
    //             handle.radius = 8 / paper.view.zoom;
    //             handle.strokeWidth = 1 / paper.view.zoom;
    //         });
    //         paper.project.getItems({ class: paper.Path.Rectangle }).forEach(rect => {
    //             rect.strokeWidth = selectedRectangles.has(rect) ? 3 / paper.view.zoom : 2 / paper.view.zoom;
    //         });
    //     };
    // };

    // const disablehighinteraction = () => {
    //     if (paper.tool) {
    //         paper.tool.remove();
    //     }
    //     if (drawingLayerRef.current) {
    //         drawingLayerRef.current.remove();
    //         drawingLayerRef.current = null;
    //     }
    // };

    const generateCustomID = (prefix) => {
        const uuid = uuidv4();
        const uniqueID = prefix + uuid.replace(/-/g, '').slice(0, 6);
        return uniqueID;
    };

    const startDrawingHigh = () => {
        // Create a new layer for highlights if it doesn't exist
        if (!drawingLayerRef.current) {
            drawingLayerRef.current = new paper.Layer({ name: 'highlightLayer' });
        }
        drawingLayerRef.current.activate();

        const tool = new paper.Tool();
        let startPoint = null;
        let currentRectangle = null;
        let isDrawing = false;
        let isResizing = false;
        let selectedHandle = null;
        let handles = [];
        let selectedRectangles = new Set();

        // Prevent default right-click menu
        const canvas = document.getElementById('canvas');
        canvas.addEventListener('contextmenu', (e) => {
            if (selectedRectangles.size > 1) {
                e.preventDefault();
                showContextMenu(e.clientX, e.clientY);
            }
        });

        const highlightSelected = (rectangle, isSelected) => {
            if (isSelected) {
                rectangle.strokeColor = 'blue';
                rectangle.strokeWidth = 3 / paper.view.zoom;
            } else {
                rectangle.strokeColor = 'red';
                rectangle.strokeWidth = 2 / paper.view.zoom;
            }
        };

        const createHandles = (rectangle) => {
            // Remove existing handles
            handles.forEach(handle => handle.remove());
            handles = [];

            const segments = rectangle.segments;
            const handleSize = 8 / paper.view.zoom;

            // Create corner handles
            segments.forEach((segment, index) => {
                const handle = new paper.Path.Circle({
                    center: segment.point,
                    radius: handleSize,
                    fillColor: 'white',
                    strokeColor: 'blue',
                    strokeWidth: 1 / paper.view.zoom,
                    data: { index: index, type: 'handle' }
                });
                handles.push(handle);
            });

            // Create midpoint handles
            for (let i = 0; i < segments.length; i++) {
                const nextIndex = (i + 1) % segments.length;
                const midpoint = segments[i].point.add(segments[nextIndex].point).divide(2);
                const handle = new paper.Path.Circle({
                    center: midpoint,
                    radius: handleSize,
                    fillColor: 'white',
                    strokeColor: 'blue',
                    strokeWidth: 1 / paper.view.zoom,
                    data: { index: i + segments.length, type: 'handle' }
                });
                handles.push(handle);
            }
        };

        tool.onMouseDown = (event) => {
            const isCtrlPressed = event.modifiers.control || event.modifiers.meta;

            if (event.event.button === 2) return; // Ignore right clicks

            const hitResult = paper.project.hitTest(event.point, {
                fill: true,
                stroke: true,
                handles: true,
                tolerance: 8
            });

            if (hitResult && hitResult.item) {
                if (hitResult.item.data && hitResult.item.data.type === 'handle') {
                    isResizing = true;
                    selectedHandle = hitResult.item;
                } else if (hitResult.item.data && hitResult.item.data.type === 'rectangle') {
                    if (!isCtrlPressed) {
                        clearSelection();
                    }
                    currentRectangle = hitResult.item;
                    selectedRectangles.add(currentRectangle);
                    highlightSelected(currentRectangle, true);
                    if (selectedRectangles.size === 1) {
                        createHandles(currentRectangle);
                    }
                }
            } else {
                if (!isCtrlPressed) {
                    clearSelection();
                }
                isDrawing = true;
                startPoint = event.point;
                currentRectangle = new paper.Path.Rectangle({
                    from: startPoint,
                    to: event.point,
                    strokeColor: 'red',
                    strokeWidth: 2 / paper.view.zoom,
                    fillColor: new paper.Color(1, 0, 0, 0.3),
                    data: { type: 'rectangle' }
                });
            }
        };

        tool.onMouseDrag = (event) => {
            if (isDrawing && startPoint) {
                if (currentRectangle) {
                    currentRectangle.remove();
                }
                currentRectangle = new paper.Path.Rectangle({
                    from: startPoint,
                    to: event.point,
                    strokeColor: 'red',
                    strokeWidth: 2 / paper.view.zoom,
                    fillColor: new paper.Color(1, 0, 0, 0.3),
                    data: { type: 'rectangle' }
                });
            } else if (isResizing && selectedHandle && currentRectangle) {
                const handleIndex = selectedHandle.data.index;
                const bounds = currentRectangle.bounds;
                let newBounds = bounds.clone();

                if (handleIndex < 4) {
                    // Corner handles
                    switch (handleIndex) {
                        case 0: newBounds.topLeft = event.point; break;
                        case 1: newBounds.topRight = event.point; break;
                        case 2: newBounds.bottomRight = event.point; break;
                        case 3: newBounds.bottomLeft = event.point; break;
                    }
                } else {
                    // Edge handles
                    const edgeIndex = handleIndex - 4;
                    switch (edgeIndex) {
                        case 0: newBounds.top = event.point.y; break;
                        case 1: newBounds.right = event.point.x; break;
                        case 2: newBounds.bottom = event.point.y; break;
                        case 3: newBounds.left = event.point.x; break;
                    }
                }
                currentRectangle.bounds = newBounds;
                updateHandlePositions();
            }
        };

        tool.onMouseUp = (event) => {
            if (isDrawing) {
                isDrawing = false;
                startPoint = null;
                if (currentRectangle) {
                    currentRectangle.data.type = 'rectangle';
                    currentRectangle = null;
                }
            }
            isResizing = false;
            selectedHandle = null;
        };

        const updateHandlePositions = () => {
            if (!currentRectangle) return;

            const segments = currentRectangle.segments;
            const cornerHandles = handles.slice(0, 4);
            const midpointHandles = handles.slice(4);

            cornerHandles.forEach((handle, index) => {
                handle.position = segments[index].point;
            });

            midpointHandles.forEach((handle, index) => {
                const startIndex = index;
                const endIndex = (index + 1) % 4;
                const midpoint = segments[startIndex].point.add(segments[endIndex].point).divide(2);
                handle.position = midpoint;
            });
        };

        const clearSelection = () => {
            selectedRectangles.forEach(rect => {
                highlightSelected(rect, false);
            });
            selectedRectangles.clear();
            handles.forEach(handle => handle.remove());
            handles = [];
            currentRectangle = null;
        };

        const showContextMenu = (x, y) => {
            const menu = document.createElement('div');
            menu.className = 'context-menu';
            menu.style.position = 'absolute';
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            menu.style.backgroundColor = 'white';
            menu.style.color = 'black'
            menu.style.border = '1px solid #ccc';
            menu.style.padding = '8px';
            menu.style.borderRadius = '4px';
            menu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            menu.style.zIndex = '1000';

            // Option 1: Group Markings
            const groupOption = document.createElement('div');
            groupOption.textContent = 'Group markings';
            groupOption.style.cursor = 'pointer';
            groupOption.style.padding = '4px 8px';
            groupOption.onclick = handleGroupMarkings;

            // Option 2: Add MTO
            const addMTOOption = document.createElement('div');
            addMTOOption.textContent = 'Add MTO';
            addMTOOption.style.cursor = 'pointer';
            addMTOOption.style.padding = '4px 8px';
            addMTOOption.onclick = () => {
                console.log('Add MTO option clicked');
                // Add your specific functionality for "Add MTO" here
            };

            menu.appendChild(groupOption);
            menu.appendChild(addMTOOption);
            document.body.appendChild(menu);

            const closeMenu = (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('mousedown', closeMenu);
                }
            };
            document.addEventListener('mousedown', closeMenu);
        };

        // const handleGroupMarkings = () => {
        //     // const selectedArray = Array.from(selectedRectangles);
        //     // console.log('Grouping rectangles:', selectedArray);
        //     // // Add your grouping logic here
        //     const selectedArray = Array.from(selectedRectangles);

        //     // Create an array to store rectangle data
        //     const rectangleData = selectedArray.map(rect => {
        //         const bounds = rect.bounds;
        //         // Generate a unique rectId for each rectangle
        //         const rectId = generateCustomID('Rect');
        //         // Store the rectangle data relative to canvas size
        //         const data = {
        //             rectId,
        //             // Store normalized coordinates (0-1 range)
        //             x: bounds.x / paper.view.size.width,
        //             y: bounds.y / paper.view.size.height,
        //             width: bounds.width / paper.view.size.width,
        //             height: bounds.height / paper.view.size.height,
        //             // Store absolute coordinates
        //             absoluteX: bounds.x,
        //             absoluteY: bounds.y,
        //             absoluteWidth: bounds.width,
        //             absoluteHeight: bounds.height,
        //             // Store current zoom level for reference
        //             zoomLevel: paper.view.zoom,
        //             // Store any additional data needed
        //             fillColor: rect.fillColor.toCSS(true),
        //             strokeColor: rect.strokeColor.toCSS(true),
        //             strokeWidth: rect.strokeWidth
        //         };

        //         return data;
        //     });
        //     console.log(rectangleData);


        //     // Send data to backend
        //     window.api.send('save-group-markings', rectangleData);
        //     // groupId: Date.now(), // or any unique identifier
        //     // docId: sindocid // or any other relevant document identifier

        //     if (drawingLayerRef.current !== null) {
        //         drawingLayerRef.current.remove()
        //     }
        //     // Close the context menu
        //     const menu = document.querySelector('.context-menu');
        //     if (menu) menu.remove();
        // };


        // const handleGroupMarkings = () => {
        //     const selectedArray = Array.from(selectedRectangles);

        //     const rectangleData = selectedArray.map(rect => {
        //         const bounds = rect.bounds;
        //         const rectId = generateCustomID('Rect');

        //         // Convert bounds to project coordinates
        //         const topLeft = paper.view.viewToProject(bounds.topLeft);
        //         const bottomRight = paper.view.viewToProject(bounds.bottomRight);

        //         const data = {
        //             rectId,
        //             projectCoords: JSON.stringify({
        //                 x: topLeft.x,
        //                 y: topLeft.y,
        //                 width: bottomRight.x - topLeft.x,
        //                 height: bottomRight.y - topLeft.y
        //             }),
        //             viewState: JSON.stringify({
        //                 zoom: paper.view.zoom,
        //                 center: {
        //                     x: paper.view.center.x,
        //                     y: paper.view.center.y
        //                 }
        //             }),
        //             fillColor: rect.fillColor.toCSS(true),
        //             strokeColor: rect.strokeColor.toCSS(true),
        //             strokeWidth: rect.strokeWidth / paper.view.zoom
        //         };

        //         return data;
        //     });

        //     console.log(rectangleData);
        //     window.api.send('save-group-markings', rectangleData);

        //     // if (drawingLayerRef.current !== null) {
        //     //     drawingLayerRef.current.remove();
        //     // }

        //     const menu = document.querySelector('.context-menu');
        //     if (menu) menu.remove();
        //     setenablehigh(false)
        // };

        const handleGroupMarkings = () => {
            const selectedArray = Array.from(selectedRectangles);

            const rectangleData = selectedArray.map(rect => {
                const rectId = generateCustomID('Rect');

                // Get the rectangle bounds in project coordinates
                const bounds = rect.bounds;
                const projectTopLeft = paper.view.projectToView(bounds.topLeft);
                const projectBottomRight = paper.view.projectToView(bounds.bottomRight);

                // Store both project and view coordinates
                const data = {
                    rectId,
                    // Store original project coordinates
                    projectCoords: JSON.stringify({
                        topLeft: bounds.topLeft,
                        bottomRight: bounds.bottomRight,
                        width: bounds.width,
                        height: bounds.height
                    }),
                    // Store current view state
                    viewState: JSON.stringify({
                        zoom: paper.view.zoom,
                        center: paper.view.center,
                        matrix: paper.view.matrix.values // Store complete transformation matrix
                    }),
                    fillColor: rect.fillColor.toCSS(true),
                    strokeColor: rect.strokeColor.toCSS(true),
                    strokeWidth: rect.strokeWidth
                };

                return data;
            });

            window.api.send('save-group-markings', rectangleData);
            const menu = document.querySelector('.context-menu');
            if (menu) menu.remove();
            // setenablehigh(false)
        };


        paper.view.onFrame = () => {
            // Update handle sizes on zoom
            handles.forEach(handle => {
                handle.radius = 8 / paper.view.zoom;
                handle.strokeWidth = 1 / paper.view.zoom;
            });
        };
    };




    const disablehighinteraction = () => {
        if (paper.tool) {
            paper.tool.remove();
        }
        if (drawingLayerRef.current) {
            drawingLayerRef.current.remove();
            drawingLayerRef.current = null;
        }
    };

    return (
        <>
            <div style={{ width: '100%', height: '90vh', position: 'absolute', backgroundColor: 'white', zIndex: '1' }}>
                <canvas id="canvas" ref={canvasRef} style={{ width: isSideNavOpen ? '83.5%' : '100%', marginLeft: isSideNavOpen ? '260px' : '0%', position: 'absolute', height: '100%', overflow: 'hidden', backgroundColor: 'white', zIndex: '0' }} ></canvas>
                {mastertab && <div className='tmt rounded w-100 justify-content-around' style={{ left: isSideNavOpen ? '29%' : '24%' }}>
                    <i class="spidControl fa-regular fa-file button " title='Master Copy' onClick={toggleHighlightConndoc}></i>
                    <i class="spidControl fa-solid fa-file button " title='Smart Master' onClick={toggleHighlightMasdoc}></i>
                    <i class="spidControl fa-solid fa-copy button " title='Smart Master' onClick={copyExtraElements}></i>
                    <i class="spidControl fa-solid fa-copyright button" title='Smart Master' onClick={copySelectedItems}></i>

                </div>}
                {functionactive && <div id='rightopt' style={{ right: taginfoshow ? '200px' : '0' }} >
                    <i class="spidControl fa-solid fa-circle-info  button " title='Tag Info' onClick={handletaginfo}></i>
                    <i class="spidControl fa fa-search-plus button" title='Zoomin' onClick={handleZoomIn} ></i>
                    <i class="spidControl fa fa-search-minus button" title='Zoomout' onClick={handleZoomOut}></i>
                    <i class="fa-solid fa-up-down-left-right button" title='Pan' onClick={handlepan}></i>
                    <i class="fa-solid fa-down-left-and-up-right-to-center button" title='Fit View' onClick={handlefitview}></i>
                    <i class="spidControl fa fa-upload button" title="Export" onClick={handleexportMenu}></i>
                    <i class="spidControl fa-solid fa-square  button " title='window select' onClick={handlewindowselect}></i>
                    <i class="spidControl fa-solid fa-arrow-pointer button" title='Selection' onClick={handleselect}></i>
                    <i class="spidControl fa fa-pencil button" title='Edit' onClick={handleeditpan}></i>
                    <li class="spidControl fa-regular fa-comment button" title='Show comment' onClick={handlecommentlabel}></li>
                    <li class="spidControl fa-solid fa-file-pen button" title='Edit comment' onClick={handlecommentedit}></li>
                </div>}

                {mastercopyactive && <div id='rightopt' style={{ right: '0' }} >

                    <i class="spidControl fa-solid fa-arrow-pointer button" title='Selection' onClick={handlescselect}></i>

                </div>}



                {taginfoshow && <div className='right pb-5' id='spidEditPane' style={{ height: '100%', width: '200px', backgroundColor: 'black' }}>
                    <button className='btn btn-light' onClick={handletaginfoClose}><i className="fa-solid fa-xmark mx-2"></i></button>

                    {equlist && Object.keys(equlist).length > 0 && (
                        <div style={{ color: 'white' }}>
                            <p>Equipment Info</p>
                            {Object.entries(equlist).map(([key, value]) => (
                                <li key={key} style={{ textAlign: 'left', paddingLeft: 0, marginLeft: 0, listStylePosition: 'inside' }}>
                                    <strong>{key}:</strong> {value}
                                </li>
                            ))}
                        </div>
                    )}
                    {linelist && Object.keys(linelist).length > 0 && (
                        <div style={{ color: 'white' }}>
                            <p>Line Info</p>
                            {Object.entries(linelist).map(([key, value]) => (
                                <li key={key} style={{ textAlign: 'left', paddingLeft: 0, marginLeft: 0, listStylePosition: 'inside' }}>
                                    <strong>{key}:</strong> {value}
                                </li>
                            ))}
                        </div>
                    )}


                </div>}

                {commentinfotable && <div className='right' id='spidEditPane' style={{ height: '100%', width: '200px', backgroundColor: 'black' }}>
                    <div className='w-100' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button className='btn btn-light' onClick={handleclosecommentinfo}><i className="fa-solid fa-xmark"></i></button>
                        <div className="btn btn-light" onClick={() => deletecomment(commentinfo.number)}><i className="fa-solid fa-trash"></i></div>
                        {(commentinfo.status != 'closed') && (
                            isEditing ? (
                                <div className="btn btn-dark" onClick={() => handleSaveButtonClick(commentinfo.number)}>
                                    <i className="fa-solid fa-save"></i>
                                </div>
                            ) : (
                                <div className="btn btn-dark" onClick={() => handleEditButtonClick(commentinfo.number)}>
                                    <i className="fa-solid fa-pencil"></i>
                                </div>
                            )
                        )}
                    </div>

                    <div style={{ color: 'white' }}>
                        <h6>Comment Info</h6>
                        <p>Comment No: {commentinfo.number}</p>
                        {/* <p>Comment: {commentinfo.comment}</p> */}

                        <p>Comment: {isEditing ? (<input onChange={e => setcommentedit(e.target.value)} type="text" value={commentedit} />) : (commentinfo.comment)}</p>

                        <p>Date: {commentinfo.createddate}</p>
                        <p>Created: {commentinfo.createdby}</p>
                        {/* <p>Status: {commentinfo.statusname}</p> */}

                        <p>Status:
                            {isEditing ? (
                                <select value={commentinfo.statusname || ''} onChange={e => setstatusedit(e.target.value)} style={{ width: '100%' }}>
                                    <option value="" disabled>
                                        Choose type
                                    </option>
                                    {commentdet.map(option => (
                                        <option key={option.commentId} value={option.statusname}>{option.statusname}</option>
                                    ))}
                                </select>
                            ) : (
                                commentinfo.statusname
                            )}
                        </p>


                        {/* <p>Priority: {commentinfo.priority}</p> */}

                        <p>Priority:
                            {isEditing ? (
                                <div class="priority" value={priorityedit} onChange={(e) => setpriorityedit(e.target.value)}>

                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <input type="radio" id="priority1" name="priority" value="1" />
                                        <label for="priority1" style={{ marginRight: '5px' }}>1</label>
                                        <input type="radio" id="priority2" name="priority" value="2" />
                                        <label for="priority2" style={{ margin: '0 5px' }}>2</label>
                                        <input type="radio" id="priority3" name="priority" value="3" />
                                        <label for="priority3" style={{ marginLeft: '5px' }}>3</label>
                                    </div>

                                </div>
                            ) : (commentinfo.priority)}
                        </p>
                    </div>
                </div>
                }
                {isbottomextend && <div className='bet w-50 rounded' style={{ left: isSideNavOpen ? '29%' : '24%' }}>
                    <i className="fa-solid fa-tag svgElem button " title='Assign Tag' onClick={handleassigntag} ></i>
                    <i className="fa-solid fa-arrows-turn-to-dots svgElem button" title='Flag assign' onClick={handleflagassign}></i>
                    <i className="fa-solid fa-delete-left svgElem button" title='Flag Connection Delete' onClick={handleflagcondelete}></i>
                    <i className="fa-solid fa-pen-to-square svgElem button" title='Draw area' onClick={handleareadraw}></i>
                    <i className="fa-regular fa-window-restore svgElem button" title='Save area' onClick={handlesavearea}></i>
                    <i className="fa-solid fa-layer-group svgElem button" title='Show area' onClick={handleshowarea}></i>
                    <i className="fa-solid fa-highlighter svgElem button" title='Draw highlight' onClick={handledrawhigh}></i>
                    <i className="fa-solid fa-layer-group svgElem button" title='Show markup' onClick={handleshowmarkup}></i>
                </div>
                }

                {taginfomenu.visible && (
                    <ul className="context-menu" style={{ width: '180px', top: taginfomenu.y, left: taginfomenu.x }}>
                        <li onClick={handletinfomodel}>Tag info</li>
                    </ul>
                )}

                {flagconmenu.visible && (
                    <ul className="context-menu" style={{
                        width: '180px',
                        top: flagconmenu.y + 'px', // Position menu from the top
                        left: flagconmenu.x + 'px'  // Position menu from the left
                    }}>
                        <li onClick={handleassigntag}>Tag assign</li>
                        <li onClick={handledeletetag}>Tag delete</li>
                        <li onClick={handleflagassign}>Flag assign</li>
                        <li onClick={handleflagcondelete}>Delete flag Connection</li>
                        <li onClick={handleflagconnection}>Connect flag doc</li>
                        <li onClick={handleflagsubmit}>Connect flags</li>
                        <li onClick={handleflagtag}>Connect adjcent tag</li>
                        <li onClick={handleaddcomment}>Add comment</li>
                        <li onClick={handleGotothree}>Go to 3D</li>

                    </ul>
                )}




                <Modal show={tagassishow} onHide={handletagassiClose}>
                    <Modal.Header className="title-dialog" closeButton>
                        <Modal.Title style={{ color: 'white' }}>Assign Tag</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='d-flex justify-content-center mb-5'>
                            <p>Select Tag</p>
                            <select value={tagid} onChange={handleChange}>
                                <option value="">Select:-</option>
                                {alltags.map((i) => (
                                    <option key={i.number} value={i.number}>
                                        {i.number}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className='footing'>
                        <Button variant="secondary" onClick={handletagassiClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={(e) => handleeletagassign(e)}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={areashows} onHide={handleareaassiclose}>
                    <Modal.Header className="title-dialog" closeButton>
                        <Modal.Title style={{ color: 'white' }}>Assign Area</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='d-flex justify-content-center mb-5'>
                            <p>Select Area Number</p>
                            <select value={selectvalue} onChange={handleareachange}>
                                <option value="">Select:-</option>
                                {allareas.map((i) => (
                                    <option key={i.areaNumber} value={i.areaNumber}>
                                        {i.areaNumber}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className='footing'>
                        <Button variant="secondary" onClick={handleareaassiclose}>
                            Close
                        </Button>
                        <Button variant="primary" type='button' onClick={(e) => handlesavelayer(e)}  >
                            {/* onClick={(e) => handlesavelayer(e)} */}
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={flagassishow} onHide={handleflagassiClose}>
                    <Modal.Header className="title-dialog" closeButton>
                        <Modal.Title style={{ color: 'white' }}>Assign Flag Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='d-flex justify-content-center mb-5'>
                            <p>Select Connecting file:- </p>
                            <select value={flagcdocnum} onChange={handleflagcdocChange}>
                                <option value="">Select:-</option>
                                {allspids.map((project, index) => {
                                    if (project.number !== docdetnum) {
                                        return (
                                            <option key={project.number} value={project.number}>
                                                {project.number}
                                            </option>
                                        );
                                    } else {
                                        return null; // Exclude the option
                                    }
                                })}
                            </select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className='footing'>
                        <Button variant="secondary" onClick={handleflagassiClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleflagassidetails}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>


                {customAlert && (
                    <Alert
                        message={modalMessage}
                        onAlertClose={() => setCustomAlert(false)}
                    />
                )}

                {exportmenu && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '400px',
                            right: '2%',
                            backgroundColor: 'lightgray',
                            padding: '20px',
                            zIndex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            borderBlockColor: 'black',
                            color: 'black'
                        }}
                    >
                        {/* Close button */}
                        <button onClick={handlecloseexport}><i class="fa-solid fa-xmark"></i></button>

                        {/* Tag info */}
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
                            <li className='btn' onClick={handleexId}>Export Id</li>
                            <li className='btn' onClick={handleextext}>Export Text</li>
                        </ul>
                    </div>
                )}

            </div>

            {isaddcomment && <Comment onClose={handleclosecomment} isOpen={handleaddcomment} content={commcontent} x={isrx} y={isry} allCommentStatus={allCommentStatus}
                commentdet={commentdet} docdetnum={docdetnum} ></Comment>}
            {/* {editcomment && <CommentStatus onstop={handleclosecommentstatus} commentdet={commentdet}></CommentStatus>} */}
        </>

    )
}

export default Canvas