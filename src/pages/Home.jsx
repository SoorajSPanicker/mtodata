import React, { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CesiumComponent from '../components/CesiumComponent';
import PublishIcon from '@mui/icons-material/AddCircle';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import Spinner from '../components/Spinner';
import EquipmentList from '../components/EquipmentList';
import BulkModelImport from '../components/BulkModelImport';
import NewProject from '../components/NewProject';
import AreaDialog from '../components/AreaDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DisciplineDialog from '../components/DisciplineDialog';
import SystemDialog from '../components/SystemDialog';
import TagAdd from '../components/TagAdd';
import LineList from '../components/LineList';
import TokenModal from '../components/TokenModal';
import DeleteAsset from '../components/DeleteAsset';
import ViewTagTable from '../components/ViewTagTable';
import TagRegistration from '../components/TagRegistration';
import Spid from '../components/Spid';
import Documenttable from '../components/Documenttable';
import DocumentReg from '../components/DocumentReg';
import AssignUnassignedTag from '../components/AssignUnassignedTag';
import ThreeCanvas from '../components/ThreeCanvas';
import CreateAsset from '../components/CreateAsset';
import BulkSpinner from '../components/BulkSpinner';
import Alert from '../components/Alert';
import DeleteConfirm from '../components/DeleteConfirm';
import GlobalModal from '../components/GlobalModal';
import GeneralTagInfoTable from '../components/GeneralTagInfoTable';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from 'react-bootstrap';
import { generateUUID } from 'three/src/math/MathUtils.js';
import CommentReview from '../components/CommentReview';
import CommentStatusTable from '../components/CommentStatusTable';
import AreaPopUp from '../components/AreaPopUp';
import DisciplinePopUp from '../components/DisciplinePopUp';
import SystemPopUp from '../components/SystemPopUp';
import TreeTable from '../components/TreeTable';
import GeneralTagInfoFields from '../components/GeneralTagInfoFields';
import CreateMto from '../components/CreateMto';
import BranchTableManangement from '../components/BranchTableManangement';
import ReviewBranchTable from '../components/ReviewBranchTable';
import SpecTableManagement from '../components/SpecTableManagement';
import ReviewSpecMaterialTable from '../components/ReviewSpecMaterialTable';
import CustomSpecManangement from '../components/CustomSpecManangement';
import ThreeComponent from '../components/ThreeComponent';
import ReviewMtoDoc from '../components/ReviewMtoDoc';
import ReviewMtoArea from '../components/ReviewMtoArea';
import ReviewMtoTag from '../components/ReviewMtoTag';
import ReviewMtoLine from '../components/ReviewMtoLine';
import CreateMaterialList from '../components/CreateMaterialList';
import MtoMaterialList from '../components/MtoMaterialList';
import CreateIso from '../components/CreateIso';
import SisoWorkspace from '../components/SisoWorkspace';
import SisoReview from '../components/SisoReview';




// import { div } from 'three/src/nodes/TSL.js';


function Home() {
  const [leftNavVisible, setLeftNavVisible] = useState(true);
  const [viewMode, setViewMode] = useState('top');
  const [assetList, setAssetList] = useState([]);
  const [ionAssetId, setIonAssetId] = useState('');
  const [mode, setMode] = useState('fly');
  const [orthoviewmode, setOrthoviewmode] = useState('perspective');
  const [showComment, setShowComment] = useState(false);
  const [zoomfit, setzoomfit] = useState(false);
  const [selectedItem, setselectedItem] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [projectFolder, setProjectFolder] = useState('');
  const [projectNo, setprojectNo] = useState('')
  const [showAreaDialog, setShowAreaDialog] = useState(false);
  const [settingbox, setsettingbox] = useState(false);
  const [equipement, setEquipment] = useState(false);
  const [iRoamercanvas, setiRoamercanvas] = useState(true);
  const [allArea, setAllArea] = useState([]);
  const [discDialog, setdiscDialog] = useState(false);
  const [allDisc, setallDisc] = useState([]);
  const [sysDialog, setsysDialog] = useState(false);
  const [allSys, setallSys] = useState([]);
  const [showTagDialog, setshowTagDialog] = useState(false);
  const [rightSideNavVisible, setrightSideNavVisible] = useState(true);
  const [bulkimport, setbulkimport] = useState(false);
  const [loadProject, setloadProject] = useState(false);
  const [areaname, setAreaname] = useState('');
  const [discname, setdiscname] = useState('');
  const [sysname, setsysname] = useState('');
  const [showDisc, setshowDisc] = useState({});
  const [showSys, setshowSys] = useState({});
  const [lineList, setLineList] = useState(false);
  const [expandTags, setExpandTags] = useState(false);
  const [expandIso, setExpandIso] = useState(false);
  const [expandGLobalModal, setexpandGLobalModal] = useState(false);
  const [assigntokenmodal, setAssignTokenModal] = useState(false);
  const [selectedprojectPath, setselectedprojectPath] = useState('')
  const [gettokenNumber, setgettokenNumber] = useState('')
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [alltags, setAlltags] = useState([]);
  const [tagsystem, setTagSystem] = useState([]);
  const [showTag, setShowTag] = useState({});
  const [expandTag, setExpandtag] = useState({});
  const [unassignedmodel, setunassignedmodel] = useState([]);
  const [selectunassigned, setselectunassigned] = useState(false);
  const [showContents, setShowCOntents] = useState(false);
  const [expandUnassigned, setExpandUnassigned] = useState(false);
  const [registerTag, setRegisterTag] = useState(false);
  const [reviewTag, setReviewtag] = useState(false);
  const [spidopen, setSpidOpen] = useState(false);
  const [expanddocument, setExpandDocument] = useState(false);
  const [registerDocument, setRegisterDocument] = useState(false);
  const [allDocuments, setAllDocuments] = useState([])
  const [objecttable, setobjecttable] = useState([]);
  const [allfilestable, setallfilestable] = useState([]);
  const [unassignedCheckboxStates, setUnassignedCheckboxStates] = useState({});
  const [allLineList, setAllLineList] = useState([]);
  const [allEquipementList, setAllEquipementList] = useState([]);
  const [selectAllUnassignedModels, setselectAllUnassignedModels] = useState([])
  const [assignTagUnassigned, setAssignTagUnassigned] = useState(false);
  const [openSpidCanvas, setOpenSpidCanvas] = useState(false);
  const [openThreeCanvas, setopenThreeCanvas] = useState(false);
  const [createAssetDialog, setCreateAssetDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState(false);
  const [allComments, SetAllComments] = useState([])
  const [loading, setLoading] = useState(false);
  const [viewHideThree, setViewHideThree] = useState({});
  const [viewHideThreeunassigned, setViewHideThreeunassigned] = useState({});
  const [customAlert, setCustomAlert] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [currentDeleteNumber, setCurrentDeleteNumber] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [openGlobalModal, setOpenGlobalModal] = useState(false);
  const [openTagInfoTable, setTagInfoTable] = useState(false);
  const [userTagInfotable, setUserTagInfoTable] = useState([]);
  const [assetIdProject, setAssetIdProject] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [allprojectDetails, setAllprojectDetails] = useState([]);
  const [showMeasure, setShowMeasure] = useState(false);
  const [extendvalidityModal, setExtendvalidityModal] = useState(false);
  let offsets = [];
  let offsetsobject = [];
  const [offsetTable, setOffsetTable] = useState([]);
  const [objectoffsetTable, setobjectoffsetTable] = useState([]);
  const [fileNamePath, setFileNamePath] = useState('');
  const [openWorldBox, setOpenWorldBox] = useState(false);
  const [commentExpand, setCommentExpand] = useState(false);
  const [editCommentStatus, setEditCommentStatus] = useState(false);
  const [allCommentStatus, setAllCommentStatus] = useState([]);
  const [CommentReviewOpen, setCommentReviewOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('three');
  const [activeTab, setActiveTab] = useState('abcd');
  const [savedViewDialog, setSavedViewDialog] = useState(false);
  const [allViews, setAllViews] = useState([]);
  const [generalTagInfoFields, setGeneralTagInfoFields] = useState([]);
  const [expandTreeManangement, setExpandTreeManangement] = useState(false);
  const [areaPopUpBox, setAreaPopUpBox] = useState(false);
  const [discPopUpBox, setDiscPopUpBox] = useState(false);
  const [sysPopUpBox, setSysPopUpBox] = useState(false);
  const [allAreasInTable, setAllAreasInTable] = useState([]);
  const [allDiscsInTable, setAllDiscsInTable] = useState([]);
  const [allSysInTable, setAllSysInTable] = useState([]);
  const [openTreeTable, setOpenTreeTable] = useState(false);
  const [reviewGenTagInfo, setReviewGenTagInfo] = useState(false);
  const [genTagFields, setGenTagFields] = useState(false);
  const startTimeRef = useRef(new Date());
  const [activate, setActivate] = useState(false);
  const [appId, setAppId] = useState('')
  const [openSpec, setOpenSpec] = useState(false);
  const [openBranchtable, setOpenBranchTable] = useState(false)
  const [createBranchtable, setCreateBranchtable] = useState(false);
  const [reviewBranchtable, setReviewBranchtable] = useState(false);
  const [openSpecTable, setOpenSpectable] = useState(false);
  const [createSpectable, setCreateSpectable] = useState(false);
  const [reviewSpectable, setReviewSpectable] = useState(false);
  const [openCustomSpec, setOpenCustomSpec] = useState(false);
  const [openMto, setOpenMto] = useState(false);
  const [createOpenMto, setcreateOpenMto] = useState(false)
  const [createMtoMat, setcreateMtoMat] = useState(false)
  const [reviewdocmto, setreviewdocmto] = useState(false)
  const [reviewtagmto, setreviewtagmto] = useState(false)
  const [reviewareamto, setreviewareamto] = useState(false)
  const [reviewlinemto, setreviewlinemto] = useState(false)
  const [reviewmtomat, setreviewmtomat] = useState(false)
  const [reviewmtotable, setreviewmtotable] = useState(false)

  // ------------------------------------PID--------------------------//
  const [svgcontent, setsvgcontent] = useState('')
  const [allspids, setAllspids] = useState([]);
  const [allareas, setallareas] = useState([]);
  const [backgroundColorTag, setBackgroundColorTag] = useState({})
  const [tagdocsel, settagdocsel] = useState([])

  // ---------------------------------MTO----------------------------//

  const [branchTableDetails, setBranchTableDetails] = useState([])
  const [branchTableDataDetails, setBranchTableDataDetails] = useState([])
  const [specsizeDetails, setspecsizeDetails] = useState([])
  const [specmatDetails, setspecmatDetails] = useState([])
  const [spectempDetails, setspectempDetails] = useState([])
  const [specDetails, setspecDetails] = useState([])
  const [specmat, setspecmat] = useState([])
  const [speccus, setspeccus] = useState([])
  const [mtodoc, setmtodoc] = useState([])
  const [mtoarea, setmtoarea] = useState([])
  const [mtotag, setmtotag] = useState([])
  const [mtolinelist, setmtolinelist] = useState([])
  const [mtolinearea, setmtolinearea] = useState([])
  const [matdataarea, setmatdataarea] = useState([])
  const [markdet, setmarkdet] = useState([])
  const [recteletag, setrecteletag] = useState([])

  // -------------------------------------SISO-------------------------------------------

  const [createiso, setcreateiso] = useState(false)
  const [reviewiso, setreviewiso] = useState(false)
  const [isosheets, setisosheets] = useState([])
  const [isofilepath, setisofilepath] = useState({})
  const [isolinelist, setisolinelist] = useState([])

  useEffect(() => {
    window.api.receive('line-tag-iso', (data) => {
      console.log(data);
      setisolinelist(data)
    })
  })

  useEffect(() => {
    window.api.receive('iso-sheet-details', (data) => {
      console.log(data);
      setisosheets(data)
    })
  })

  useEffect(() => {
    window.api.receive('wspace-file-path', (data) => {
      console.log(data);
      setisofilepath(data)
    })
  }, [])

  useEffect(() => {
    console.log(isosheets);

  }, [isosheets])
  // useEffect(() => {
  //   // Initialize the start time when the component mounts
  //   const initializeSession = () => {
  //     const storedStartTime = localStorage.getItem('sessionStartTime');
  //     if (storedStartTime) {
  //       startTimeRef.current = new Date(storedStartTime);
  //     } else {
  //       startTimeRef.current = new Date();
  //       localStorage.setItem('sessionStartTime', startTimeRef.current.toISOString());
  //     }
  //   };

  //   // Update the start time when the component mounts
  //   initializeSession();
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   // Handle storing time spent and sending data to the server when the component unmounts
  //     const endTime = new Date();
  //     const timeSpentMs = endTime - startTimeRef.current; // Time spent in milliseconds
  //     console.log(timeSpentMs)
  //    let apptimespent=  parseInt(localStorage.getItem('accumulatedTime')) || 0;
  //    apptimespent+=timeSpentMs
  //    console.log(apptimespent);
  //    localStorage.setItem('accumulatedTime',apptimespent)
  //     let appopencount = parseInt(localStorage.getItem('appOpenCount')) || 0;
  //     appopencount += 1;
  //     localStorage.setItem('appOpenCount', appopencount);

  //     if (user) {
  //       const userAppId = user.id;
  //       fetch(`${base_url}/installation/${userAppId}`)
  //         .then(response => response.json())
  //         .then(userData => {
  //           const updatedData = {
  //             ...userData,
  //             usageCount: appopencount, // Increment usage count
  //             totalTimeSpent: apptimespent, // Update total time spent
  //             lastUsageDate: endTime.toISOString(),
  //           };

  //           return fetch(`${base_url}/installation/${userAppId}`, {
  //             method: 'PUT',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify(updatedData),
  //           });
  //         })
  //         .then(() => {
  //           // Update local storage for the next session
  //           localStorage.setItem('sessionStartTime', endTime.toISOString());
  //         })
  //         .catch(error => console.error('Error updating usage:', error));
  //     }
  // }, []);

  useEffect(() => {
    window.api.receive('element-tag-fetched', (data) => {
      console.log("Tagged element found in rectangle:", data);
      setrecteletag(data)
      // if (data && data.tagNumber) {
      //   const taggedElement = recttagRef.current.find(info => info.elementId === data.elementId);
      //   if (taggedElement) {
      //     console.log(taggedElement);
      //     taggedElement.tagNumber = data.tagNumber;
      //     // setrecttagcol([...recttagcol, taggedElement]);
      //   }
      // }
    });
  }, []);
  useEffect(() => {
    console.log(recteletag);

  }, [recteletag])

  useEffect(() => {
    window.api.receive('group-markings-saved', (data) => {
      console.log("Group markings saved:", data);
      setmarkdet(data);
      // setCustomAlert(true);
      // setModalMessage('Group markings saved successfully');
    });
  }, []);

  useEffect(() => {
    console.log(markdet);

  }, [markdet])


  useEffect(() => {
    window.api.receive('appValidity', (data) => {
      console.log(data)
      if (data.valid === true) {
        console.log("activate")
        setActivate(false);
      }
      else {
        console.log("deactivate")
        setActivate(true);
      }
    })
  }, [])

  useEffect(() => {
    window.api.receive('area-save-mto', (data) => {
      console.log(data);
      setmtoarea(data)
    })
  }, [])



  useEffect(() => {
    window.api.receive('tag-save-mto', (data) => {
      console.log(data);
      setmtotag(data)
    })
  }, [])

  useEffect(() => {
    console.log(mtoarea);
  }, [mtoarea])

  useEffect(() => {
    window.api.receive('linelist-save-mto', (data) => {
      console.log(data);
      setmtolinelist(data)
    })
  }, [])

  useEffect(() => {
    window.api.receive('mtoline-area-save', (data) => {
      console.log(data);
      setmtolinearea(data)
    })
  }, [])

  useEffect(() => {
    window.api.receive('material-data-save', (data) => {
      console.log(data);
      setmatdataarea(data)
    })
  }, [])

  useEffect(() => {
    window.api.receive('testing', (data) => {
      console.log(data);
    })
  })

  useEffect(() => {
    window.api.receive('app-id', (data) => {
      setAppId(data);
    })
  }, [])
  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const toggleLeftNav = () => {
    setLeftNavVisible(!leftNavVisible);
    setShowComment(false);
  }
  const handleiRoamercanvas = (activesidelink) => {
    setActiveLink(activesidelink)
    setiRoamercanvas(true);
    setrightSideNavVisible(true);
    setEquipment(false)
    setbulkimport(false);
    setLineList(false);
    setExpandTags(false);
    setexpandGLobalModal(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setSpidOpen(false);
    setOpenSpidCanvas(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);
  }

  const handleequipementList = (activesidelink) => {
    setActiveLink(activesidelink)
    setEquipment(true);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandTags(false);
    setexpandGLobalModal(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setActiveButton(null);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setSpidOpen(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);



  }

  const handlelineList = (activesidelink) => {
    setActiveLink(activesidelink)
    setLineList(true);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setExpandTags(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setActiveButton(null);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setSpidOpen(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false);
    setOpenSpec(false);
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);
  }

  const handlebulkmodelimport = (activesidelink) => {
    setActiveLink(activesidelink)
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(true);
    setLineList(false);
    setExpandTags(false);
    setexpandGLobalModal(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setActiveButton(null);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setSpidOpen(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);
  }

  const handleExpandTag = (activesidelink) => {
    setActiveLink(activesidelink)
    setExpandTags(true);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setexpandGLobalModal(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    // setSpidOpen(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);

  }

  const handleIsoOpt = (activesidelink) => {
    setActiveLink(activesidelink)
    setExpandTags(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setexpandGLobalModal(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    // setSpidOpen(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setExpandIso(true)
    setcreateiso(false)
    setreviewiso(true)
    setiRoamercanvas(false);

  }

  const handleGlobalmodelExpand = (activesidelink) => {
    setActiveLink(activesidelink)
    setexpandGLobalModal(true);
    setOpenGlobalModal(true)
    setExpandTags(false);
    setEquipment(false);
    setrightSideNavVisible(true);
    setiRoamercanvas(false);
    setbulkimport(false);
    setLineList(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setOpenTreeTable(false);
    setExpandTreeManangement(false);
    setSpidOpen(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);

  }

  const handleRegisterTag = (activetablink) => {
    setRegisterTag(true);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setSpidOpen(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);

  }

  const handleReviewTag = (activetablink) => {
    setReviewtag(true);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setSpidOpen(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);
  }

  const handlecreateiso = (activetablink) => {
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setSpidOpen(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(true);
    setiRoamercanvas(false);
    setreviewiso(true)
  }

  const handlereviewiso = (activetablink) => {
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setSpidOpen(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);
    setiRoamercanvas(false);
    setreviewiso(true)
  }

  const handleExpandTreeManagement = (activesidelink) => {
    setActiveLink(activesidelink)
    setEquipment(false);
    setrightSideNavVisible(false);
    setSpidOpen(false);
    setbulkimport(false);
    setLineList(false);
    setExpandTags(false);
    setexpandGLobalModal(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setActiveButton(null);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(true);
    setOpenTreeTable(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);

  }

  const handleOpenSpid = (activesidelink) => {
    setActiveLink(activesidelink)
    setSpidOpen(true);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);


  }

  const handleExpandDocument = (activesidelink) => {
    setActiveLink(activesidelink)
    setExpandDocument(true)
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setRegisterDocument(false);
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);



  }

  const handleRegisterDocument = () => {
    setRegisterDocument(true);
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(true)
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);

  }

  const handleOpenGlobalModel = () => {
    setOpenGlobalModal(true)
    setViewHideThree(false);
    setRegisterDocument(false);
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(true);
    setEquipment(false);
    setrightSideNavVisible(true);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setOpenSpidCanvas(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);

  }

  const handleOpenTagInfoTable = (activesidelink) => {
    setActiveLink(activesidelink);
    setTagInfoTable(true);
    setEquipment(false);
    setSpidOpen(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandTags(false);
    setexpandGLobalModal(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);

  }

  const handleOpenCommentManagement = (activesidelink) => {
    setActiveLink(activesidelink);
    setCommentExpand(true);
    setSpidOpen(false);
    setTagInfoTable(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandTags(false);
    setexpandGLobalModal(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);

  }

  const handleOpenCommentRiview = () => {
    setCommentReviewOpen(true)
    setEditCommentStatus(false);
    setSpidOpen(false);
    setTagInfoTable(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandTags(false);
    setexpandGLobalModal(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false)
    setreviewareamto(false)
    setreviewtagmto(false)
    setreviewlinemto(false)
    setcreateMtoMat(false)
    setreviewmtomat(false)
    setreviewmtotable(false)
    setcreateOpenMto(false);
    setcreateiso(false);


  }

  const handleOpenCommentStatusTable = () => {
    setEditCommentStatus(true);
    setCommentReviewOpen(false);
    setSpidOpen(false);
    setTagInfoTable(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandTags(false);
    setexpandGLobalModal(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false)
    setreviewareamto(false)
    setreviewtagmto(false)
    setreviewlinemto(false)
    setcreateMtoMat(false)
    setreviewmtomat(false)
    setreviewmtotable(false)
    setcreateOpenMto(false);
    setcreateiso(false);

  }

  const handleOpenReviewGenTagInfo = () => {
    setReviewGenTagInfo(true);
    setGenTagFields(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setSpidOpen(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandTags(false);
    setexpandGLobalModal(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false)
    setreviewareamto(false)
    setreviewtagmto(false)
    setreviewlinemto(false)
    setcreateMtoMat(false)
    setreviewmtomat(false)
    setreviewmtotable(false)
    setcreateOpenMto(false);
    setcreateiso(false);

  }

  const handleOpenGenTagFields = () => {
    setGenTagFields(true);
    setReviewGenTagInfo(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setSpidOpen(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandTags(false);
    setexpandGLobalModal(false);
    setRegisterTag(false);
    setReviewtag(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);

  }

  const handlehideThreeCanvas = (key, tag, isVisible) => {
    setViewHideThree(prevState => ({
      ...prevState,
      [key]: isVisible
    }));

  };

  const handlehideThreeCanvasUnassigned = (tag) => {
    setViewHideThreeunassigned(prevState => ({
      ...prevState,
      [tag]: false // Explicitly set visibility to false
    }));
  }

  const handleOpenThreeCanvas = (tagobject, tag, visible) => {
    const newViewHideThree = { ...viewHideThree };
    newViewHideThree[tagobject] = visible;
    setViewHideThree(newViewHideThree);

    // Send API request to fetch tag path
    if (visible) {
      window.api.send('fetch-tag-path', tag);

    }
    setopenThreeCanvas(true);
    setRegisterDocument(false);
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(true);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setExpandTags(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false)
    setreviewareamto(false)
    setreviewtagmto(false)
    setreviewlinemto(false)
    setcreateMtoMat(false)
    setreviewmtomat(false)
    setreviewmtotable(false)
    setcreateOpenMto(false);
    setcreateiso(false);

  }

  const handleOpenThreeCanvasUnassigned = (tag, visible) => {
    setViewHideThreeunassigned(prevState => ({
      ...prevState,
      [tag]: visible // Explicitly set visibility to the provided value
    }));

    // Send API request to fetch tag path
    if (visible) {
      window.api.send('fetch-unassigned-path', tag);

    }
    setopenThreeCanvas(true);
    setRegisterDocument(false);
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(true);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setExpandTags(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setOpenSpec(false);
    setReviewBranchtable(false);
    setOpenBranchTable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false)
    setreviewareamto(false)
    setreviewtagmto(false)
    setreviewlinemto(false)
    setcreateMtoMat(false)
    setreviewmtomat(false)
    setreviewmtotable(false)
    setcreateOpenMto(false);
    setcreateiso(false);
  }

  const handleOpenSpecmanagement = (activesidelink) => {
    setOpenSpec(true);
    setOpenBranchTable(true);
    setCreateBranchtable(true);
    setReviewBranchtable(false);
    setActiveTab(activesidelink)
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setOpenMto(false);
    setreviewdocmto(false)
    setreviewareamto(false)
    setreviewtagmto(false)
    setreviewlinemto(false)
    setcreateMtoMat(false)
    setreviewmtomat(false)
    setreviewmtotable(false)
    setcreateOpenMto(false);
    setcreateiso(false);
  }

  const handleopenMtomanagement = (activesidelink) => {
    setOpenMto(true);

    setOpenSpec(false);
    setOpenCustomSpec(false);
    setOpenBranchTable(false);
    setCreateBranchtable(false);
    setReviewBranchtable(false);
    setActiveTab(activesidelink)
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setiRoamercanvas(false);
    setreviewdocmto(false)
    setreviewareamto(false)
    setreviewtagmto(false)
    setreviewlinemto(false)
    setcreateMtoMat(false)
    setreviewmtomat(false)
    setreviewmtotable(false)
    setcreateOpenMto(true);
  }

  const handlematlistTable = () => {
    setOpenMto(true);
    setcreateOpenMto(false)
    setOpenSpec(false);
    setOpenCustomSpec(false);
    setOpenBranchTable(false);
    setCreateBranchtable(false);
    setReviewBranchtable(false);
    // setActiveTab(activesidelink)
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setiRoamercanvas(false);
    setreviewdocmto(false)
    setreviewareamto(false)
    setreviewtagmto(false)
    setreviewlinemto(false)
    setcreateMtoMat(true)
    setreviewmtomat(false)
  }

  const handleReviewmtodoctable = (activesidelink) => {
    setOpenMto(true);
    setcreateOpenMto(false)
    setOpenSpec(false);
    setOpenCustomSpec(false);
    setOpenBranchTable(false);
    setCreateBranchtable(false);
    setReviewBranchtable(false);
    setActiveTab(activesidelink)
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setiRoamercanvas(false);
    setreviewdocmto(true)
    setreviewareamto(false)
    setreviewtagmto(false)
    setreviewlinemto(false)
    setcreateMtoMat(false)
    setreviewmtomat(false)
    setreviewmtotable(true)
  }

  const handleReviewmtoareatable = (activesidelink) => {
    setOpenMto(true);
    setcreateOpenMto(false)
    setOpenSpec(false);
    setOpenCustomSpec(false);
    setOpenBranchTable(false);
    setCreateBranchtable(false);
    setReviewBranchtable(false);
    setActiveTab(activesidelink)
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setiRoamercanvas(false);
    setreviewdocmto(false)
    setreviewareamto(true)
    setreviewtagmto(false)
    setreviewlinemto(false)
    setcreateMtoMat(false)
    setreviewmtomat(false)
    setreviewmtotable(true)
  }

  const handleReviewmtolinetable = (activesidelink) => {
    setOpenMto(true);
    setcreateOpenMto(false)
    setOpenSpec(false);
    setOpenCustomSpec(false);
    setOpenBranchTable(false);
    setCreateBranchtable(false);
    setReviewBranchtable(false);
    setActiveTab(activesidelink)
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setiRoamercanvas(false);
    setreviewdocmto(false)
    setreviewareamto(false)
    setreviewtagmto(false)
    setreviewlinemto(true)
    setcreateMtoMat(false)
    setreviewmtomat(false)
    setreviewmtotable(true)
  }

  const handleReviewmtomattable = (activesidelink) => {
    setOpenMto(true);
    setcreateOpenMto(false)
    setOpenSpec(false);
    setOpenCustomSpec(false);
    setOpenBranchTable(false);
    setCreateBranchtable(false);
    setReviewBranchtable(false);
    setActiveTab(activesidelink)
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setiRoamercanvas(false);
    setreviewdocmto(false)
    setreviewareamto(false)
    setreviewtagmto(false)
    setreviewlinemto(false)
    setcreateMtoMat(false)
    setreviewmtomat(true)
    setreviewmtotable(true)
  }

  const handleReviewmtotagtable = (activesidelink) => {
    setOpenMto(true);
    setcreateOpenMto(false)
    setOpenSpec(false);
    setOpenCustomSpec(false);
    setOpenBranchTable(false);
    setCreateBranchtable(false);
    setReviewBranchtable(false);
    setActiveTab(activesidelink)
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setiRoamercanvas(false);
    setreviewdocmto(false)
    setreviewareamto(false)
    setreviewtagmto(true)
    setreviewlinemto(false)
    setcreateMtoMat(false)
    setreviewmtomat(false)
    setreviewmtotable(true)
  }
  const handleReviewmtocretable = (activesidelink) => {
    setOpenMto(true);

    setOpenSpec(false);
    setOpenCustomSpec(false);
    setOpenBranchTable(false);
    setCreateBranchtable(false);
    setReviewBranchtable(false);
    // setActiveTab(activesidelink)
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(false);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false)
    setRegisterDocument(false);
    setExpandTags(false);
    setTagInfoTable(false);
    setCommentExpand(false);
    setEditCommentStatus(false);
    setCommentReviewOpen(false);
    setExpandTreeManangement(false);
    setOpenTreeTable(false);
    setiRoamercanvas(false);
    setreviewdocmto(false)
    setreviewareamto(false)
    setreviewtagmto(false)
    setreviewlinemto(false)
    setcreateMtoMat(false)
    setreviewmtomat(false)
    setreviewmtotable(false)
    setcreateOpenMto(true)

  }

  const handleExpandBranchmanagement = (tab) => {
    setActiveTab(tab)
    setOpenBranchTable(true);
    setCreateBranchtable(true);
    setReviewBranchtable(false);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateSpectable(false);
    setReviewSpectable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);
  }

  const handleExpandSpecmanagement = (tab) => {
    setActiveTab(tab)
    setOpenSpectable(true);
    setCreateSpectable(true);
    setReviewSpectable(false);
    setOpenBranchTable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);
  }

  const handleExpandCustomSpecmanagement = (tab) => {
    setActiveTab(tab)
    setOpenCustomSpec(true);
    setOpenSpectable(false);
    setOpenBranchTable(false);
    setCreateBranchtable(false);
    setCreateSpectable(false);
    setReviewSpectable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);
  }

  const handleReviewBranchtable = () => {
    setReviewBranchtable(true);
    setOpenSpectable(false);
    setOpenCustomSpec(false)
    setCreateBranchtable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);
  }
  const handleReviewSpecTable = () => {
    setReviewSpectable(true);
    setOpenBranchTable(false)
    setOpenCustomSpec(false)
    setCreateSpectable(false);
    setOpenMto(false);
    setreviewdocmto(false);
    setreviewareamto(false);
    setreviewtagmto(false);
    setreviewlinemto(false);
    setcreateMtoMat(false);
    setreviewmtomat(false);
    setreviewmtotable(false);
    setcreateOpenMto(false);
    setcreateiso(false);
  }

  useEffect(() => {
    window.api.receive('send-back-token', (data) => {
      setgettokenNumber(data)
    })
  }, [])
  // All asset in cesium
  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        const response = await fetch(`https://api.cesium.com/v1/assets`, {
          headers: {
            Authorization: `Bearer ${gettokenNumber}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAssetList(data.items);

        } else {
          console.error('Error fetching asset details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching asset details:', error.message);
      }
    };
    fetchAssetDetails();
  }, [assetList, gettokenNumber])

  // handel orbit control
  const handleOrbitClick = (buttonName) => {
    setMode('orbit');
    setActiveButton(buttonName);

  };

  // handel fly control
  const handleFlyClick = (buttonName) => {
    setMode('fly');
    setActiveButton(buttonName);

  };

  // asset selection function
  const handleAssetSelection = (e) => {
    const selectedId = e.target.value;
    // Get all IDs in assetList
    const allIds = assetList.map(asset => asset.id);
    const selectedAsset = assetList.find(asset => asset.id === parseInt(selectedId));
    setIonAssetId(selectedAsset.id);

  };
  const handleAssetSelectionProject = (id) => {
    setIonAssetId(id);
  }

  useEffect(() => {
    let spinnerTimeout;

    // Show spinner for 5 seconds after ionAssetId becomes truthy
    if (ionAssetId) {
      setShowSpinner(true);
      spinnerTimeout = setTimeout(() => {
        setShowSpinner(false);
      }, 5000);
    }

    return () => {
      // Clear timeout to avoid memory leaks
      clearTimeout(spinnerTimeout);
    };
  }, [ionAssetId]);



  // handleorthoview
  const handleorthoview = (buttonName) => {
    setOrthoviewmode('orthographic')
    setActiveButton(buttonName);

  }
  // handleperspective

  const handleperspective = (buttonName) => {
    setOrthoviewmode('perspective')
    setActiveButton(buttonName);

  }

  // handle all orthographic view

  const handleortholeft = (buttonName) => {
    setViewMode('left')
    setActiveButton(buttonName);

  }
  const handleorthoright = (buttonName) => {
    setViewMode('right')
    setActiveButton(buttonName);

  }
  const handleorthotop = (buttonName) => {
    setViewMode('top')
    setActiveButton(buttonName);

  }
  const handleorthobottom = (buttonName) => {
    setViewMode('bottom')
    setActiveButton(buttonName);

  }
  const handleorthofront = (buttonName) => {
    setViewMode('front')
    setActiveButton(buttonName);

  }
  const handleorthoback = (buttonName) => {
    setViewMode('back')
    setActiveButton(buttonName);

  }

  // handle comment
  const handlecomment = (buttonName) => {
    setShowComment((prev) => !prev);
    setActiveButton(buttonName);
    setLeftNavVisible(false);
  }
  //  handle zoomfit
  const handlezoomfit = (buttonName) => {
    setzoomfit(true);
    setActiveButton(buttonName);

  }

  // handle object selected
  const handleObjectselected = (buttonName) => {
    setselectedItem(true);
    setActiveButton(buttonName);
  }

  // handle setting
  const handleSetting = (buttonName) => {
    setsettingbox(true);
    setActiveButton(buttonName);

  }


  const handleLoadProject = () => {
    setloadProject(true);

  }
  const handleAddArea = (areaName) => {
    setAreaname(areaName);
    setdiscDialog(true);
  };
  const handleShowDisc = (areaId) => {
    setAreaname(areaId);
    setshowDisc(prevState => ({
      ...prevState,
      [areaId]: !prevState[areaId]
    }));

  }

  const handleShowEyeDisc = (areaId) => {
    const newViewHideThree = { ...viewHideThree };

    // Get the toggle state for the area
    const toggleState = !viewHideThree[areaId];

    // Update visibility for the area
    newViewHideThree[areaId] = toggleState;

    // Iterate through all disciplines
    allDisc.forEach(disc => {
      if (disc.area === areaId) {
        const discKey = `${areaId}-${disc.disc}`;
        newViewHideThree[discKey] = toggleState;

        allSys.forEach(sys => {
          if (sys.disc === disc.disc && sys.area === areaId) {
            const sysKey = `${areaId}-${disc.disc}-${sys.sys}`;
            newViewHideThree[sysKey] = toggleState;

            // Iterate through tags associated with the system
            tagsystem.forEach(tag => {
              if (tag.sys === sys.sys && tag.disc === disc.disc && tag.area === areaId) {
                const tagKey = `${areaId}-${disc.disc}-${sys.sys}-${tag.tag}`;
                if (toggleState && !viewHideThree[tagKey]) {
                  window.api.send('fetch-tag-path', tag.tag);
                }
                newViewHideThree[tagKey] = toggleState;
              }
            });
          }
        });
      }
    });

    setViewHideThree(newViewHideThree);

    setopenThreeCanvas(true);
    setRegisterDocument(false);
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(true);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false);
    setExpandTags(false);
  };
  const handleShoweyeSys = (discId, areaId) => {
    const newViewHideThree = { ...viewHideThree };

    // Get the toggle state for the discipline
    const discKey = `${areaId}-${discId}`;
    const toggleState = !viewHideThree[discKey];

    // Update visibility for the discipline
    newViewHideThree[discKey] = toggleState;

    // Iterate through systems associated with the discipline and area
    allSys.forEach(sys => {
      if (sys.disc === discId && sys.area === areaId) {
        const sysKey = `${areaId}-${discId}-${sys.sys}`;
        newViewHideThree[sysKey] = toggleState;

        // Iterate through tags associated with the system
        tagsystem.forEach(tag => {
          if (tag.sys === sys.sys && tag.disc === discId && tag.area === areaId) {
            const tagKey = `${areaId}-${discId}-${sys.sys}-${tag.tag}`;
            if (toggleState && !viewHideThree[tagKey]) {
              window.api.send('fetch-tag-path', tag.tag);
            }
            newViewHideThree[tagKey] = toggleState;
          }
        });
      }
    });

    setViewHideThree(newViewHideThree);

    setopenThreeCanvas(true);
    setRegisterDocument(false);
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(true);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false);
    setExpandTags(false);
  };
  const handleShowEyeTag = (sysId, discId, areaId) => {
    const newViewHideThree = { ...viewHideThree };

    // Get the toggle state for the system
    const sysKey = `${areaId}-${discId}-${sysId}`;
    const toggleState = !viewHideThree[sysKey];

    // Update visibility for the system
    newViewHideThree[sysKey] = toggleState;

    // Iterate through tags associated with the system
    tagsystem.forEach(tag => {
      if (tag.sys === sysId && tag.disc === discId && tag.area === areaId) {
        const tagKey = `${areaId}-${discId}-${sysId}-${tag.tag}`;
        if (toggleState && !viewHideThree[tagKey]) {
          window.api.send('fetch-tag-path', tag.tag);
        }
        newViewHideThree[tagKey] = toggleState;
      }
    });

    setViewHideThree(newViewHideThree);

    setopenThreeCanvas(true);
    setRegisterDocument(false);
    setSpidOpen(false);
    setReviewtag(false);
    setRegisterTag(false);
    setexpandGLobalModal(false);
    setEquipment(false);
    setrightSideNavVisible(true);
    setbulkimport(false);
    setLineList(false);
    setExpandDocument(false);
    setExpandTags(false);
  };

  const handleAddSystem = (discName, areaName) => {
    setdiscname(discName)
    setAreaname(areaName);
    setsysDialog(true);
  }
  const handleShowSys = (discId, areaId) => {
    setdiscname(discId)

    const key = `${areaId}-${discId}`;
    setshowSys(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));

  }

  const handleAddNewTag = (sysName, discName, areaName) => {
    setsysname(sysName)
    setdiscname(discName)
    setAreaname(areaName);
    setshowTagDialog(true);

  }

  const handleShowTag = (areaId, discId, sysId) => {
    setsysname(sysId);
    setdiscname(discId);
    setAreaname(areaId);
    const key = `${areaId}-${discId}-${sysId}`;
    setShowTag(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };


  const handlePublishClick = () => {
    setShowAreaDialog(true);
  };

  const handleCloseAreaDialog = () => {
    setShowAreaDialog(false);
    setdiscDialog(false);
    setsysDialog(false);
    setshowTagDialog(false);
    setAssignTokenModal(false);
    setOpenDeleteModal(false);
    setAssignTagUnassigned(false);
    setCreateAssetDialog(false);
    setAreaPopUpBox(false);
    setDiscPopUpBox(false);
    setSysPopUpBox(false);
  };

  const handleAssignToken = () => {
    setAssignTokenModal(true);
  }
  const handleCreateAssetOpen = () => {
    setCreateAssetDialog(true);

  }


  const handleDeleteAssetOpen = () => {
    setOpenDeleteModal(true);
  }

  useEffect(() => {
    window.api.receive('all-area-fetched', (data) => {
      const filteredAreaData = data.filter(item => item.area !== null && item.disc === null);
      setAllArea(filteredAreaData);
    });
  }, []);
  useEffect(() => {
    window.api.receive('all-disc-fetched', (data) => {
      const filteredDiscData = data.filter(item => item.area !== null && item.disc !== null && item.sys === null);
      setallDisc(filteredDiscData);
    });
  }, []);
  useEffect(() => {
    window.api.receive('all-sys-fetched', (data) => {
      const filteredSysData = data.filter(item => item.area !== null && item.disc !== null && item.sys !== null && item.tag === null);
      setallSys(filteredSysData);
    });
  }, []);

  useEffect(() => {
    window.api.receive('all-tags-under-sys-fetched', (data) => {
      const filteredSysData = data.filter(item => item.area !== null && item.disc !== null && item.sys !== null && item.tag !== null);
      setTagSystem(filteredSysData);
    });
  }, []);

  useEffect(() => {
    window.api.receive('all-tags-fetched', (data) => {
      setAlltags(data);
    });
  }, []);

  useEffect(() => {
    window.api.receive('all-unassignedModels', (data) => {
      setunassignedmodel(data);
    });
  }, []);

  useEffect(() => {
    window.api.receive('all-document-fetched', (data) => {
      setAllDocuments(data);
    });
  }, []);

  useEffect(() => {
    window.api.receive('all-files-table', (data) => {
      setallfilestable(data);
    });

  }, [])
  useEffect(() => {
    window.api.receive('all-mesh-table', (data) => {
      setobjecttable(data);
    });

  }, [])

  useEffect(() => {
    window.api.receive('all-lines-fetched', (data) => {
      console.log(data)
      setAllLineList(data);
    });
  }, []);

  useEffect(() => {
    window.api.receive('all-equipement-fetched', (data) => {
      setAllEquipementList(data);
    });
  }, []);
  useEffect(() => {
    window.api.receive('unassigned-models-deleted', () => {
      setCustomAlert(true);
      setModalMessage('Selected unassigned models deleted successfully!');
    });
  }, []);
  useEffect(() => {
    window.api.receive('all-area-table-fetched', (data) => {
      setAllAreasInTable(data);
    });
  }, []);
  useEffect(() => {
    window.api.receive('all-disc-table-fetched', (data) => {
      setAllDiscsInTable(data);
    });
  }, []);
  useEffect(() => {
    window.api.receive('all-sys-table-fetched', (data) => {
      setAllSysInTable(data);
    });
  }, []);

  useEffect(() => {
    window.api.receive('processing-complete', () => {
      setCustomAlert(true);
      setModalMessage("Tags assigned successfully!!!!")
    });
  }, []);

  useEffect(() => {
    window.api.receive('create-asset-response', (data) => {
      setResponseMessage(false);
      setCustomAlert(true);
      setModalMessage("Asset created successfully!!!!")
    });
  }, []);

  useEffect(() => {
    window.api.receive('save-comment-response', () => {
      setCustomAlert(true);
      setModalMessage("Comment added successfully!!!!")
    });
  }, []);
  useEffect(() => {
    window.api.receive('tag-not-found', (data) => {
      setCustomAlert(true);
      setModalMessage(data.message);
    });
  }, []);

  useEffect(() => {
    window.api.receive('area-added-response', (data) => {
      setCustomAlert(true);
      setModalMessage(data.message);
    });
  }, []);
  useEffect(() => {
    window.api.receive('disc-added-response', (data) => {
      setCustomAlert(true);
      setModalMessage(data.message);
    });
  }, []);
  useEffect(() => {
    window.api.receive('sys-added-response', (data) => {
      setCustomAlert(true);
      setModalMessage(data.message);
    });
  }, []);

  useEffect(() => {
    window.api.receive('all-comments', (data) => {
      console.log("Received data from comment main process:", data);
      SetAllComments(data)
    });
  }, []);

  useEffect(() => {
    window.api.receive('delete-comment-response', () => {
      setCustomAlert(true);
      setModalMessage("Comment deleted successfully!!!!")
    });
  }, []);

  useEffect(() => {
    window.api.receive('all-models-saved', () => {
      setCustomAlert(true);
      setModalMessage('All models saved successfully!')
      setLoading(false);
    })
  }, []);

  useEffect(() => {
    window.api.receive('saveUserDefinedFieldsResult', () => {
      setCustomAlert(true);
      setModalMessage('All user defined fields are updated successfully!!!')
      setLoading(false);
    })
  }, []);

  const [assetArray, setAssetArray] = useState([]);
  useEffect(() => {
    window.api.receive('asset-id-project', (data) => {
      console.log(data);
      setAssetIdProject(data);
    })
  }, [])


  useEffect(() => {
    if (typeof assetIdProject === 'string') {
      console.log(assetIdProject)
      const updatedArray = assetIdProject.split(',').map(item => item.trim());
      console.log(updatedArray)
      // setAssetArray(assetIdProject.split(','));
      setAssetArray(updatedArray);
    } else {
      setAssetArray([]);
    }
  }, [assetIdProject]);

  useEffect(() => {
    console.log('Asset Array:', assetArray);
  }, [assetArray]);


  useEffect(() => {
    window.api.receive('all-status', (data) => {
      console.log(data);
      setAllCommentStatus(data);
    });
  }, []);
  useEffect(() => {
    window.api.receive('all-fields-user-defined', (data) => {
      console.log(data);
      setGeneralTagInfoFields(data);
    });
  }, []);

  useEffect(() => {
    window.api.receive('save-tag-complete', (data) => {
      setLoading(false);
      setCustomAlert(true);
      setModalMessage(data.message);
    });
  }, []);

  useEffect(() => {
    window.api.receive('all-project-details', (data) => {
      console.log(data);
      setAllprojectDetails(data);
    })
  }, [])

  useEffect(() => {
    window.api.receive('all-views', (data) => {
      setAllViews(data);
    })
  }, [])

  useEffect(() => {
    const handleDeleteResponse = () => {
      console.log("Enter delete response");
      setCustomAlert(true);
      setModalMessage("Global modal is deleted successfully");
    };

    console.log("Setting up delete asset response listener");
    window.api.receive('delete-asset-response', handleDeleteResponse);
  }, [assetArray]);


  useEffect(() => {
    window.api.receive('save-camera-view-response', (data) => {
      setCustomAlert(true);
      setModalMessage(data.message);
    })
  }, [])

  useEffect(() => {
    window.api.receive('delete-views-response', (data) => {
      setCustomAlert(true);
      setModalMessage(data.message);
    })
  }, [])

  useEffect(() => {
    window.api.receive('delete-all-project-response', () => {
      setCustomAlert(true);
      setModalMessage('All projects deleted successfully!!!!')
      setProjectFolder('');
      setAllLineList('');
      setAllEquipementList('');
      setAlltags('');
      setAllArea('');
      setallDisc('');
      setallSys('');
      setUserTagInfoTable('')
      setAllDocuments('');

    })
  }, []);


  useEffect(() => {
    window.api.receive('delete-project-response', (data) => {
      setCustomAlert(true);
      setModalMessage(`${data} deleted successfully!!!!`)
      setProjectFolder('');
      setAllLineList('');
      setAllEquipementList('');
      setAlltags('');
      setAllArea('');
      setallDisc('');
      setallSys('');
      setUserTagInfoTable('')
      setAllDocuments('');
      setAllCommentStatus('')
    })
  }, []);

  useEffect(() => {
    window.api.receive('all-taginfo-fetched', (data) => {
      console.log(data)
      setUserTagInfoTable(data);
    })
  }, []);
  useEffect(() => {
    window.api.receive('save-data-response', (response) => {
      if (response.success) {
        setProjectFolder(response.project.projectName);
        setprojectNo(response.project.projectNumber);
        setCustomAlert(true);
        setModalMessage(response.message);
        setgettokenNumber(response.project.TokenNumber);
      }
      else {
        setCustomAlert(true);
        setModalMessage(response.message);

      }

    })
  }, [])
  useEffect(() => {
    window.api.receive('edit-project-response', (response) => {
      if (response.success) {
        setCustomAlert(true);
        setModalMessage(response.message);
      }
      else {
        setCustomAlert(true);
        setModalMessage(response.message);
      }
    })
  }, [])

  useEffect(() => {
    window.api.receive('token-saved', (data) => {
      setCustomAlert(true);
      setModalMessage(data.message);
    })
  }, [])


  //------------------------ mto useEffect response-------------------------------//

  useEffect(() => {
    window.api.receive('branch-table-response', (data) => {
      setBranchTableDetails(data);
    })
  })

  useEffect(() => {
    console.log(branchTableDetails);

  }, [branchTableDetails])

  useEffect(() => {
    window.api.receive('branch-table-data-response', (data) => {
      setBranchTableDataDetails(data);
    })
  })
  useEffect(() => {
    console.log(branchTableDataDetails);

  }, [branchTableDataDetails])

  useEffect(() => {
    window.api.receive('specsize-table-response', (data) => {
      setspecsizeDetails(data);
    })
  })

  useEffect(() => {
    window.api.receive('specmat-table-response', (data) => {
      console.log(data);
      setspecmatDetails(data);
    })
  })

  useEffect(() => {
    window.api.receive('spectemp-table-response', (data) => {
      setspectempDetails(data);
    })
  })

  useEffect(() => {
    window.api.receive('specdet-table-response', (data) => {
      setspecDetails(data);
    })
  })

  useEffect(() => {
    window.api.receive('specdet-detail-response', (data) => {
      setspecmat(data);
    })
  })

  useEffect(() => {
    window.api.receive('custom-spec-res', (data) => {
      setspeccus(data);
    })
  })

  useEffect(() => {
    window.api.receive('save-doc-mto', (data) => {
      console.log(data);
      setmtodoc(data);
    })
  })


  const handleDeleteTag = (tag, sys, disc, area) => {
    console.log(tag, disc, sys, area)
    setItemToDelete({ type: 'tag', area: area, disc: disc, sys: sys, tag: tag });
    setCurrentDeleteNumber(tag);
    setConfirmMessage('Are you sure you want to delete?');
    setShowConfirm(true);
  };

  const handleDeleteSystem = (sys, disc, area) => {
    console.log(sys, disc, area);
    setItemToDelete({ type: 'system', area: area, disc: disc, sys: sys });
    setCurrentDeleteNumber(sys);
    setConfirmMessage('Are you sure you want to delete?');
    setShowConfirm(true);
  };

  const handleDeleteDiscipline = (disc, area) => {
    setItemToDelete({ type: 'discipline', area: area, disc: disc });
    setCurrentDeleteNumber(disc);
    setConfirmMessage('Are you sure you want to delete?');
    setShowConfirm(true);
  };

  const handleDeleteArea = (tag) => {
    setItemToDelete({ type: 'area', data: tag });
    setCurrentDeleteNumber(tag);
    setConfirmMessage('Are you sure you want to delete?');
    setShowConfirm(true);
  };

  const handleDeleteUnassigned = () => {
    setItemToDelete({ type: 'unassigned' });
    setConfirmMessage('Are you sure you want to delete?');
    setShowConfirm(true);
  };
  const handleDeleteView = (saveViewMenu) => {
    setItemToDelete({ type: 'view', data: saveViewMenu });
    setCurrentDeleteNumber(saveViewMenu);
    setConfirmMessage('Are you sure you want to delete?');
    setShowConfirm(true);
  }



  const handleConfirmDelete = () => {
    switch (itemToDelete.type) {
      case 'view':
        window.api.send('delete-view', currentDeleteNumber);
        break;
      case 'tag':
        window.api.send('remove-tag', { area: itemToDelete.area, disc: itemToDelete.disc, sys: itemToDelete.sys, tag: itemToDelete.tag });
        break;
      case 'system':
        window.api.send('remove-system', { area: itemToDelete.area, disc: itemToDelete.disc, sys: itemToDelete.sys });
        break;
      case 'discipline':
        window.api.send('remove-disc', { area: itemToDelete.area, disc: itemToDelete.disc });
        break;
      case 'area':
        window.api.send('remove-area', currentDeleteNumber);
        break;
      case 'unassigned':
        const updatedModels = unassignedmodel.filter((model, index) => !unassignedCheckboxStates[index]);

        setunassignedmodel(updatedModels);
        window.api.send('delete-unassigned-models', selectAllUnassignedModels);
        setUnassignedCheckboxStates({});
        setselectAllUnassignedModels([]);
        setselectunassigned(false);
        break;
      case 'add-wb':
        const data = {
          fileNamePath: fileNamePath,
          meshtable: offsetTable,
          fileTable: objectoffsetTable
        };
        window.api.send("save-world-box", data);
        setOffsetTable([]);
        setobjectoffsetTable([]);
        setFileNamePath([]);
        offsetsobject = null;
        handleClose();
      default:
        break;
    }
    setShowConfirm(false);
    setCurrentDeleteNumber(null);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setItemToDelete(null);
  };


  const handleSelectUnassigned = () => {
    const newSelectState = !selectunassigned;
    console.log("newSelectState", newSelectState);
    const newCheckboxStates = {};

    unassignedmodel.forEach((model, index) => {
      newCheckboxStates[index] = newSelectState;
    });

    setUnassignedCheckboxStates(newCheckboxStates);

    if (newSelectState) {
      setselectAllUnassignedModels(unassignedmodel.map(model => ({ filename: model.filename, number: model.number })));
    } else {
      setselectAllUnassignedModels([]);
    }

    setselectunassigned(newSelectState);
  };

  const handleCheckboxChange = (index) => {
    const newCheckboxStates = {
      ...unassignedCheckboxStates,
      [index]: !unassignedCheckboxStates[index]
    };

    setUnassignedCheckboxStates(newCheckboxStates);

    const newSelectedItems = [...selectAllUnassignedModels];
    const model = { filename: unassignedmodel[index].filename, number: unassignedmodel[index].number };

    if (newCheckboxStates[index]) {
      newSelectedItems.push(model);
    } else {
      const itemIndex = newSelectedItems.findIndex(item => item.filename === model.filename && item.number === model.number);
      if (itemIndex > -1) {
        newSelectedItems.splice(itemIndex, 1);
      }
    }

    setselectAllUnassignedModels(newSelectedItems);
    setselectunassigned(newSelectedItems.length > 0);
  };

  const handleShowContents = () => {
    setShowCOntents(!showContents);
  }
  const handleExpandUnassigned = () => {
    setExpandUnassigned(!expandUnassigned);
  }

  const handleTagsForUnassigned = () => {
    setAssignTagUnassigned(true);
  }

  const handleAddOurWorldBox = () => {
    const fbxFilePath = `${process.env.PUBLIC_URL}/Worldbox_1000m.fbx`;
    console.log(`${process.env.PUBLIC_URL}`)
    console.log(fbxFilePath);
    loadFBXFiles(fbxFilePath)
    setItemToDelete({ type: 'add-wb' });
    setConfirmMessage('Are you sure to add this worldBox?');
    setShowConfirm(true);

  }
  const loadFBXFiles = (fbxFilePath) => {
    console.log(fbxFilePath)
    const fbxLoader = new FBXLoader();
    fbxLoader.load(fbxFilePath, (object) => {
      console.log('Loaded FBX object:', object);

      const boundingBoxobject = calculateBoundingBox(object);
      const maxbbobject = boundingBoxobject.max;
      const minbbobject = boundingBoxobject.min;
      console.log(maxbbobject);
      console.log(minbbobject);

      const center = new THREE.Vector3();
      boundingBoxobject.getCenter(center);
      console.log('Bounding Box Center:', center.toArray());

      const offsetObject = {
        fileid: uuidv4(),
        objectName: 'worldbox.fbx', // or use file.name if available
        maxbbobject,
        minbbobject,
        offset: center
      };
      setFileNamePath(fbxFilePath);
      setOffsetTable([...offsetsobject, offsetObject]);
      setobjectoffsetTable([...objectoffsetTable, offsetObject]);


    },
      undefined,
      (error) => {
        console.error('Error loading FBX:', error);
      });
  }
  const handleFileChange = (e) => {

    loadUserFBXFiles(e.target.files[0]);
  };
  function generateCustomID(prefix) {
    const uuid = generateUUID();
    const uniqueID = prefix + uuid.replace(/-/g, '').slice(0, 6);
    return uniqueID;
  }
  const loadUserFBXFiles = (fbxFilePath) => {
    const loadedOffsetsobject = [];
    const loadedOffsets = [];

    const offsetBoundingBoxCenters = [];
    console.log(fbxFilePath)
    const id = generateCustomID('F');
    const fbxLoader = new FBXLoader();

    fbxLoader.load(URL.createObjectURL(fbxFilePath), (object) => {
      console.log('Loaded FBX object:', object);

      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const boundingBox = calculateBoundingBox(child);
          const maxbb = boundingBox.max;
          const minbb = boundingBox.min;

          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
          const offset = boundingBox.getCenter(new THREE.Vector3());
          loadedOffsets.push(offset);
          offsets.push(offset);
          offsetBoundingBoxCenters.push({
            fileid: id,
            fileName: fbxFilePath.name,
            meshName: child.name,
            tagNo: child.name.replace(/[^a-zA-Z0-9]/g, ''),
            maxbb: maxbb,
            minbb: minbb,
            offset: offset
          });
          console.log(offsetBoundingBoxCenters);
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
        objectName: fbxFilePath.name,
        maxbbobject: maxbbobject,
        minbbobject: minbbobject,
        offset: offsetObject
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
    setFileNamePath(fbxFilePath.path);

  }
  const handleUserWorldBox = () => {
    console.log(fileNamePath);
    console.log(offsetTable);
    console.log(objectoffsetTable);

    const data = {
      fileNamePath: fileNamePath,
      meshtable: offsetTable,
      fileTable: objectoffsetTable
    };
    window.api.send("save-user-world-box", data);
    setOffsetTable([]);
    setobjectoffsetTable([]);
    setFileNamePath([]);
    offsetsobject = null;
    handleClose()
  }
  const handleClose = () => {
    setOpenWorldBox(false);
  }
  const handleAddWorldBox = () => {
    setOpenWorldBox(true);
  }

  const calculateBoundingBox = (object) => {
    const boundingBox = new THREE.Box3().setFromObject(object);
    return boundingBox;
  };

  const handleShowMeasure = (buttonName) => {
    setShowMeasure(!showMeasure);
    setActiveButton(buttonName);
  }

  const handleSavedView = (buttonName) => {
    setActiveButton(buttonName);
    setSavedViewDialog(true);
  }

  const handelAreaPopUp = (tab) => {
    setActiveTab(tab)
    setAreaPopUpBox(true);
  }
  const handelDiscPopUp = () => {
    setDiscPopUpBox(true);
  }
  const handelSysPopUp = () => {
    setSysPopUpBox(true);
  }

  // ------------PID-----------------------//
  useEffect(() => {
    window.api.receive('fetched-document', (data) => {
      console.log("Received data from main process:", data);
      setsvgcontent(data);
    });
  }, []);
  useEffect(() => {
    window.api.receive('spid-docs-fetched', (data) => {
      console.log("Received data from main process:", data);
      setAllspids(data);
    });
  }, []);
  useEffect(() => {
    window.api.receive('all-areas-fetched', (data) => {
      console.log("Received data from main process:", data);
      setallareas(data)
    });
  }, []);

  useEffect(() => {
    window.api.receive('sin-doc-fetched', (data) => {
      console.log("Received data from main process:", data);
      setsvgcontent(data);
    });
  }, []);
  useEffect(() => {
    window.api.receive('all-areas-fetched', (data) => {
      console.log("Received data from main process:", data);
      // const areaNumbers = data.map(area => area.areaNumber);
      // console.log(areaNumbers);
      setallareas(data)
    });
  }, []);

  useEffect(() => {
    console.log(svgcontent);
  }, [svgcontent])

  useEffect(() => {
    window.api.receive('con-doc-tag', (data) => {
      const alleles = []
      console.log(data);
      window.api.send('tag-doc-det', data[0].filename)
      data.forEach(ele => {
        alleles.push(ele.elementId)
      })
      settagdocsel(alleles)
    });
  }, [])



  return (
    <div>
      <div className="row" style={{ overflow: 'hidden' }}>
        <div className="row" style={{ width: '100%', margin: '0', padding: '0' }}>
          <Header selectedprojectPath={selectedprojectPath} responseMessage={responseMessage} appId={appId} />
        </div>

        <div class="container" style={{ overflowY: 'hidden', overflowX: 'hidden' }}>
          {/* {
          activate &&<div style={{width:'100%',height:'90vh',backgroundColor:'rgba(255, 255, 255, 0)',position:'absolute',overflowY:'hidden',zIndex:'100'}}>
          </div>       
         } */}
          {
            leftNavVisible &&
            <div class="left-sidenav" style={{ flex: '0 0 auto' }}>
              <div className="leftSideNav">
                <ul>

                  <li>

                    <div id='openFileButton' class="dropdown" onClick={handleLoadProject}>
                      <i class="fa fa-folder-open"></i>Open Project
                      <div class="dropdown-content">
                      </div>
                    </div>
                    {
                      projectFolder && (

                        showContents ? (
                          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <i class="fa-solid fa-caret-down fs-3 text-secondary" onClick={handleShowContents}></i>
                          </div>
                        ) : (
                          <>
                            <div>
                              <div className="project-folder">
                                <div className="tree" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px' }} >
                                  <span>{projectFolder}</span>
                                  <PublishIcon onClick={handlePublishClick} style={{ fontSize: '15px' }} />
                                </div>
                                {/* -------Area----------- */}

                                <div className="area-list">
                                  {allArea && allArea.map(area => (
                                    <div key={area.id} className="area-item">
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, flexShrink: 1, minWidth: 0 }}>
                                          {showDisc[area.area] ? (
                                            <RemoveIcon style={{ fontSize: '15px' }} onClick={() => handleShowDisc(area.area)} />
                                          ) : (
                                            <AddIcon style={{ fontSize: '15px' }} onClick={() => handleShowDisc(area.area)} />
                                          )}
                                          <i className="fa fa-folder-open" style={{ color: '#0d6efd', marginLeft: '5px' }}></i>
                                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px' }}>
                                            {area.area} - {area.name}
                                          </span>
                                        </div>
                                        <div className="area-icons" style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                          {viewHideThree[area.area] ? (
                                            <i className='fa-solid fa-eye' onClick={() => handleShowEyeDisc(area.area)} style={{ fontSize: '12px', marginRight: '9px' }}></i>
                                          ) : (
                                            <i className='fa-solid fa-eye-slash' onClick={() => handleShowEyeDisc(area.area)} style={{ fontSize: '12px', marginRight: '9px' }}></i>
                                          )}
                                          <PublishIcon style={{ fontSize: '15px', marginRight: '9px' }} onClick={() => handleAddArea(area.area)} />
                                          <DeleteIcon style={{ fontSize: '15px', marginRight: '9px' }} onClick={() => handleDeleteArea(area.area)} />
                                        </div>
                                      </div>

                                      {/* -------discipline----------- */}
                                      {showDisc[area.area] && (
                                        <div>
                                          {allDisc.map(disc => (
                                            disc.area === area.area && (
                                              <div key={disc.areaname}>
                                                <div className="disc-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                  <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, flexShrink: 1, minWidth: 0, marginLeft: '15px' }}>
                                                    {showSys[`${area.area}-${disc.disc}`] ? (
                                                      <RemoveIcon style={{ fontSize: '15px' }} onClick={() => handleShowSys(disc.disc, area.area)} />
                                                    ) : (
                                                      <AddIcon style={{ fontSize: '15px' }} onClick={() => handleShowSys(disc.disc, area.area)} />
                                                    )}
                                                    <i className="fa fa-folder-open" style={{ color: '#0d6efd', marginLeft: '5px' }}></i>
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px' }}>
                                                      {disc.disc} - {disc.name}
                                                    </span>
                                                  </div>
                                                  <div className="disc-icons" style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                                    {viewHideThree[`${area.area}-${disc.disc}`] ? (
                                                      <i className='fa-solid fa-eye' onClick={() => handleShoweyeSys(disc.disc, area.area)} style={{ fontSize: '12px', marginRight: '9px' }}></i>
                                                    ) : (
                                                      <i className='fa-solid fa-eye-slash' onClick={() => handleShoweyeSys(disc.disc, area.area)} style={{ fontSize: '12px', marginRight: '9px' }}></i>
                                                    )}
                                                    <PublishIcon style={{ fontSize: '15px', marginRight: '9px' }} onClick={() => handleAddSystem(disc.disc, area.area)} />
                                                    <DeleteIcon style={{ fontSize: '15px', marginRight: '9px' }} onClick={() => handleDeleteDiscipline(disc.disc, area.area)} />
                                                  </div>
                                                </div>

                                                {/* --------system */}
                                                {showSys[`${area.area}-${disc.disc}`] && (
                                                  <div>
                                                    {allSys.map(sys => (
                                                      sys.area === area.area && sys.disc === disc.disc && (
                                                        <div key={sys.discname} className="disc-item">
                                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, flexShrink: 1, minWidth: 0, marginLeft: '30px' }}>
                                                              {showTag[`${area.area}-${disc.disc}-${sys.sys}`] ? (
                                                                <RemoveIcon style={{ fontSize: '15px' }} onClick={() => handleShowTag(area.area, disc.disc, sys.sys)} />
                                                              ) : (
                                                                <AddIcon style={{ fontSize: '15px' }} onClick={() => handleShowTag(area.area, disc.disc, sys.sys)} />
                                                              )}
                                                              <i className="fa fa-folder-open" style={{ color: '#0d6efd', marginLeft: '5px' }}></i>
                                                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '5px' }}>
                                                                {sys.sys} - {sys.name}
                                                              </span>
                                                            </div>
                                                            <div className="disc-icons" style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                                              {viewHideThree[`${area.area}-${disc.disc}-${sys.sys}`] ? (
                                                                <i className='fa-solid fa-eye' onClick={() => handleShowEyeTag(sys.sys, disc.disc, area.area)} style={{ fontSize: '12px', marginRight: '9px' }}></i>
                                                              ) : (
                                                                <i className='fa-solid fa-eye-slash' onClick={() => handleShowEyeTag(sys.sys, disc.disc, area.area)} style={{ fontSize: '12px', marginRight: '9px' }}></i>
                                                              )}
                                                              <PublishIcon style={{ fontSize: '15px', marginRight: '9px' }} onClick={() => handleAddNewTag(sys.sys, disc.disc, area.area)} />
                                                              <DeleteIcon style={{ fontSize: '15px', marginRight: '9px' }} onClick={() => handleDeleteSystem(sys.sys, disc.disc, area.area)} />
                                                            </div>
                                                          </div>
                                                          {/* ----------tag--------- */}
                                                          {showTag[`${area.area}-${disc.disc}-${sys.sys}`] && (
                                                            <>
                                                              {tagsystem.map(tag => (
                                                                tag.area === area.area && tag.disc === disc.disc && tag.sys === sys.sys && (
                                                                  <div key={tag.sysname} className="disc-item" style={{
                                                                    backgroundColor: backgroundColorTag[`${area.area}-${disc.disc}-${sys.sys}-${tag.tag}`] ? 'rgba(255, 255, 0, 0.5)' : 'transparent',
                                                                    transition: 'background-color 0.3s ease'
                                                                  }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                      <div style={{ marginLeft: '40px' }}>
                                                                        {expandTag[sys.sys] ? (
                                                                          <RemoveIcon style={{ fontSize: '15px' }} />
                                                                        ) : (
                                                                          <AddIcon style={{ fontSize: '15px' }} />
                                                                        )}
                                                                        <i className="fa fa-folder-open" style={{ color: '#0d6efd' }}></i>
                                                                        <span>{tag.tag.length > 10 ? tag.tag.slice(0, 12) : tag.tag}...</span>
                                                                      </div>
                                                                      <div className="disc-icons">
                                                                        {viewHideThree[`${area.area}-${disc.disc}-${sys.sys}-${tag.tag}`] ? (
                                                                          <i className='fa-solid fa-eye' onClick={() => handlehideThreeCanvas(`${area.area}-${disc.disc}-${sys.sys}-${tag.tag}`, tag.tag, false)} style={{ fontSize: '12px', marginRight: '9px' }}></i>
                                                                        ) : (
                                                                          <i className='fa-solid fa-eye-slash' onClick={() => handleOpenThreeCanvas(`${area.area}-${disc.disc}-${sys.sys}-${tag.tag}`, tag.tag, true)} style={{ fontSize: '12px', marginRight: '9px' }}></i>
                                                                        )}
                                                                        <DeleteIcon style={{ fontSize: '15px', marginRight: '9px' }} onClick={() => handleDeleteTag(tag.tag, sys.sys, disc.disc, area.area)} />
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                )
                                                              ))}
                                                            </>
                                                          )}
                                                        </div>
                                                      )
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            )
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                {
                                  unassignedmodel.length > 0 && (
                                    <div className="area-item mt-1" >
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                          {
                                            expandUnassigned ? (
                                              <>
                                                <RemoveIcon style={{ fontSize: '15px' }} onClick={handleExpandUnassigned} /> <i class="fa fa-folder-open" style={{ color: '#0d6efd' }}></i>  <span>Unassigned Model</span>
                                              </>
                                            ) : (
                                              <>
                                                <AddIcon onClick={handleExpandUnassigned} style={{ fontSize: '15px' }} /> <i class="fa fa-folder-open" style={{ color: '#0d6efd' }}></i> <span>Unassigned Model</span>
                                              </>
                                            )
                                          }



                                        </div>
                                        <div className="area-icons" style={{ verticalAlign: 'center' }}>
                                          {
                                            selectunassigned && (
                                              <>
                                                <PublishIcon title="Assign" style={{ fontSize: '15px', marginRight: '9px' }} onClick={handleTagsForUnassigned} />
                                                <DeleteIcon title="Delete" style={{ fontSize: '15px', marginRight: '9px' }} onClick={handleDeleteUnassigned} />
                                              </>
                                            )
                                          }
                                          {
                                            selectunassigned ? (
                                              <i title='deselect all' onClick={handleSelectUnassigned} class="fa-solid fa-circle-check" style={{ fontSize: '12px', marginRight: '9px' }}></i>
                                            ) : (
                                              <i title='select all' onClick={handleSelectUnassigned} class="fa-regular fa-circle-check" style={{ fontSize: '12px', marginRight: '9px' }}></i>
                                            )
                                          }

                                        </div>

                                      </div>
                                    </div>
                                  )
                                }
                              </div>
                              <ul>
                                {expandUnassigned && (
                                  <>
                                    {unassignedmodel.map((model, index) => (
                                      <li key={index} style={{ padding: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <input type="checkbox"
                                              checked={!!unassignedCheckboxStates[index]}
                                              onChange={() => handleCheckboxChange(index)} style={{ marginRight: '5px' }} />
                                            <i className="fa-solid fa-clipboard" style={{ fontSize: '12px', marginRight: '5px' }}></i>
                                            <div>{model.filename.substring(0, 15)}...</div>
                                          </div>
                                          <div>
                                            {
                                              viewHideThreeunassigned[model.number] ? (
                                                <i className='fa-solid fa-eye' onClick={() => handlehideThreeCanvasUnassigned(model.number, false)} style={{ fontSize: '12px', marginRight: '9px' }}></i>
                                              ) : (
                                                <i className='fa-solid fa-eye-slash' onClick={() => handleOpenThreeCanvasUnassigned(model.number, true)} style={{ fontSize: '12px', marginRight: '9px' }}></i>
                                              )
                                            }

                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </>
                                )}
                              </ul>
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <i class="fa-solid fa-caret-up fs-3 text-secondary" onClick={handleShowContents}></i>
                            </div>
                          </>
                        )
                      )
                    }
                  </li>

                  <li>
                    <div className={activeLink === 'three' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handleiRoamercanvas('three')}>
                      <i class="fa fa-fighter-jet sideLnkIcon"></i>
                      <a id="viewerLnk" class="sideLnk">iRoamer</a>
                    </div>
                  </li>

                  <li>
                    <div className={activeLink === 'bulk' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handlebulkmodelimport('bulk')} >
                      <i class="fa fa-archive sideLnkIcon"></i>
                      <a class="sideLnk">Bulk model import</a>  </div>
                  </li>
                  <li>
                    <li>
                      <div className={activeLink === 'treemanagement' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handleExpandTreeManagement('treemanagement')}>
                        <i class="fa-solid fa-sliders sideLnkIcon"></i>
                        <a class="sideLnk">Tree Management</a>  </div>
                    </li>
                    {
                      expandTreeManangement &&
                      <>
                        <li>
                          <div className={activeTab === 'treemanagement' ? 'tabActive' : 'tabInactive'} >
                            <a class="sideLnk">Review</a>
                            <i class=""></i>
                          </div>
                        </li>
                        <li>
                          <div className={activeTab === 'area' ? 'tabActive' : 'tabInactive'} onClick={() => handelAreaPopUp('area')}>
                            <a class="sideLnk">Area Register</a>
                            <i class=""></i>
                          </div>
                        </li>
                        <li>
                          <div className='tabInactive' onClick={handelDiscPopUp}>
                            <a class="sideLnk">Discipline Register</a>
                          </div>
                        </li>
                        <li>
                          <div className='tabInactive' onClick={handelSysPopUp}>
                            <a class="sideLnk">System Register</a>
                          </div>
                        </li>
                      </>
                    }
                    <div className={activeLink === 'globalexpand' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handleGlobalmodelExpand('globalexpand')} >
                      <i class="fa-solid fa-globe sideLnkIcon"></i>
                      <a class="sideLnk">Global Model</a>
                    </div>
                  </li>
                  {
                    expandGLobalModal &&
                    <>
                      <li>
                        <div className={activeLink === 'globalexpand' ? 'tabActive' : 'tabInactive'} onClick={() => handleOpenGlobalModel('globalexpand')}>
                          <i className="fa-solid fa-folder-open sideLnkIcon"></i>
                          <a className="sideLnk">Open Global Model</a>
                          <i className="fa-solid fa-chevron-down optionsArrow" style={{ fontSize: '13px' }} onClick={handleToggleOptions}></i>
                          {showOptions && (
                            <div className="dropdown">
                              <div className="dropdown-content">
                                {assetArray.map((assetId) => (
                                  <li
                                    key={assetId}
                                    style={{ fontSize: '13px' }}
                                    className="ms-3"
                                    onClick={() => handleAssetSelectionProject(assetId)}
                                  >
                                    {assetId}
                                  </li>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                      <li>
                        <div className={activeLink === 'assign' ? 'tabActive' : 'tabInactive'} onClick={() => handleAssignToken('assign')}>
                          <i class="fa-solid fa-pen sideLnkIcon"></i>
                          <a class="sideLnk">Assign Token</a>
                        </div>
                      </li>
                      <li>
                        <div class="tabInactive" onClick={handleAddWorldBox}>
                          <i class="fa-solid fa-square-plus sideLnkIcon"></i>
                          <a class="sideLnk">Add World Box</a>
                        </div>
                      </li>
                      <li>
                        <div class="tabInactive" onClick={handleCreateAssetOpen}>
                          <i class="fa-solid fa-circle-plus sideLnkIcon"></i>
                          <a class="sideLnk">Create Global Model</a>
                        </div>
                      </li>
                      <li>
                        <div class="tabInactive" onClick={handleDeleteAssetOpen}>
                          <i class="fa-solid fa-trash sideLnkIcon"></i>
                          <a class="sideLnk">Delete Global Model</a>
                        </div>
                      </li>
                    </>
                  }


                  <li>
                    <div id="tagsSideLnk" className={activeLink === 'expandtag' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handleExpandTag('expandtag')}>
                      <i class="fa fa-tags sideLnkIcon"></i>
                      <a class="sideLnk">Tags</a>
                    </div>
                  </li>

                  {
                    expandTags &&
                    <>
                      <li>
                        <div id="tagsSideLnk" className='tabActive' onClick={() => handleReviewTag('review')}>
                          <a class="sideLnk">Review</a>
                        </div>
                      </li>
                      <li>
                        <div id="tagsSideLnk" className='tabInactive' onClick={() => handleRegisterTag('regtag')}>
                          <a class="sideLnk">Register</a>
                        </div>
                      </li>

                    </>
                  }
                  <li>
                    <div className={activeLink === 'taginfo' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handleOpenTagInfoTable('taginfo')} >
                      <i class="fa fa-circle-info sideLnkIcon"></i>
                      <a class="sideLnk">Tag Info</a>  </div>
                  </li>

                  {
                    openTagInfoTable && <>
                      <li>
                        <div id="tagsSideLnk" className='tabActive' onClick={handleOpenReviewGenTagInfo}>
                          <a class="sideLnk">Review</a>
                        </div>
                      </li>
                      {/* <li>
               <div id="tagsSideLnk" className= 'tabInactive'  onClick={handleOpenGenTagFields} >
                               <a class="sideLnk">Tag Infofield Edit</a>
                           </div>
               </li> */}
                    </>
                  }





                  <li>
                    <div id="tagsSideLnk" className={activeLink === 'expanddocument' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handleExpandDocument('expanddocument')}>
                      <i class="fa fa-book sideLnkIcon"></i>
                      <a class="sideLnk">Documents</a>
                    </div>
                  </li>
                  {
                    expanddocument &&
                    <>
                      <li>
                        <div id="tagsSideLnk" class="tabActive" onClick={handleExpandDocument}>
                          <a class="sideLnk">Review</a>
                        </div>
                      </li>
                      <li>
                        <div id="tagsSideLnk" class="tabInactive" onClick={handleRegisterDocument}>
                          <a class="sideLnk">Register</a>
                        </div>
                      </li>

                    </>
                  }

                  <li>
                    <div id="lineListSideLnk" className={activeLink === 'linelist' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handlelineList('linelist')}>
                      <i class="fa fa-list-alt sideLnkIcon"></i>
                      <a class="sideLnk">Line List</a>
                    </div>
                  </li>
                  <li>
                    <div id="equipListSideLnk" className={activeLink === 'equipmentlist' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handleequipementList('equipmentlist')} >
                      <i class="fa fa-list-alt sideLnkIcon"></i>
                      <a class="sideLnk">Equipment List</a>
                    </div>
                  </li>
                  <li>
                    <div id="tagsSideLnk" className={activeLink === 'expandtag' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handleIsoOpt('expandiiso')}>
                      <i class="fa fa-tags sideLnkIcon"></i>
                      <a class="sideLnk">Smart ISO</a>
                    </div>
                  </li>

                  {
                    expandIso &&
                    <>
                      <li>
                        <div id="tagsSideLnk" className='tabActive' onClick={() => handlecreateiso('create')}>
                          <a class="sideLnk">Create</a>
                        </div>
                      </li>
                      <li>
                        <div id="tagsSideLnk" className='tabInactive' onClick={() => handlereviewiso('review')}>
                          {/* onClick={() => handleRegisterTag('regtag')} */}
                          <a class="sideLnk">Review</a>
                        </div>
                      </li>
                    </>
                  }
                  <li>
                    <div id="spidSideLnk" className={activeLink === 'spid' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handleOpenSpid('spid')} >
                      <i class="fa fa-pencil-square sideLnkIcon"></i>
                      <a class="sideLnk">Smart P&ID</a>
                    </div>
                  </li>
                  <li>
                    <div id="spidSideLnk" className={activeLink === 'spec' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handleOpenSpecmanagement('spec')} >
                      <i class="fa fa-list-alt sideLnkIcon"></i>
                      <a class="sideLnk">Spec Management</a>
                    </div>
                  </li>
                  {
                    openSpec && <>
                      <li>
                        <div id="tagsSideLnk" className={activeTab === 'spec' ? 'tabActive' : 'tabInactive'} onClick={() => handleExpandBranchmanagement('spec')}>
                          <a class="sideLnk">Branch management</a>
                        </div>
                      </li>

                      {
                        openBranchtable &&
                        <>
                          <li>
                            <div id="tagsSideLnk" className="tabtabActive" onClick={() => handleExpandBranchmanagement('spec')}>
                              <a class="sideLnk">Create</a>
                            </div>
                          </li>
                          <li>
                            <div id="tagsSideLnk" class="tabtabInactive" onClick={handleReviewBranchtable}>
                              <a class="sideLnk">Review</a>
                            </div>
                          </li>
                        </>
                      }
                      <li>
                        <div id="tagsSideLnk" className={activeTab === 'specmanagement' ? 'tabActive' : 'tabInactive'} onClick={() => handleExpandSpecmanagement('specmanagement')}>
                          <a class="sideLnk">Spec management</a>
                        </div>
                      </li>
                      {
                        openSpecTable &&
                        <>
                          <li>
                            <div id="tagsSideLnk" class="tabtabActive" onClick={() => handleExpandSpecmanagement('specmanagement')}>
                              <a class="sideLnk">Create</a>
                            </div>
                          </li>

                          <li>
                            <div id="tagsSideLnk" class="tabtabInactive" onClick={handleReviewSpecTable}>
                              <a class="sideLnk">Review</a>
                            </div>
                          </li>
                        </>
                      }

                      <li>
                        <div id="tagsSideLnk" className={activeTab === 'custom' ? 'tabActive' : 'tabInactive'} onClick={() => handleExpandCustomSpecmanagement('custom')}>
                          <a class="sideLnk">Custom Spec management</a>
                        </div>
                      </li>

                    </>
                  }

                  <li>
                    <div id="spidSideLnk" className={activeLink === 'mto' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handleopenMtomanagement('mto')} >
                      <i class="fa fa-list-alt sideLnkIcon"></i>
                      <a class="sideLnk">MTO</a>
                    </div>
                  </li>
                  {
                    openMto &&
                    <>
                      <li>
                        <div id="tagsSideLnk" class="tabActive" >
                          <a class="sideLnk" onClick={() => handleReviewmtocretable('mto')}>Create</a>
                        </div>
                        {/* onClick={handleReviewmtocretable} */}
                      </li>
                      <li>
                        <div id="tagsSideLnk" class="tabtabActive" onClick={handlematlistTable}>
                          <a class="sideLnk">Create Material List</a>
                        </div>
                      </li>
                      <li>
                        <div id="tagsSideLnk" class="tabInactive" >
                          <a class="sideLnk" onClick={() => handleReviewmtodoctable('mto')}>Review</a>
                        </div>

                      </li>
                      {
                        reviewmtotable && <>
                          <li>
                            <div id="tagsSideLnk" class="tabInactive" >
                              <a class="sideLnk" onClick={() => handleReviewmtodoctable('mto')}>MTO Document Review</a>
                            </div>

                          </li>
                          <li>
                            <div id="tagsSideLnk" class="tabInactive" >
                              <a class="sideLnk" onClick={() => handleReviewmtotagtable('mto')}>Area Review</a>
                            </div>

                          </li>
                          <li>
                            <div id="tagsSideLnk" class="tabInactive" >
                              <a class="sideLnk" onClick={() => handleReviewmtoareatable('mto')}>Tag Review</a>
                            </div>

                          </li>
                          <li>
                            <div id="tagsSideLnk" class="tabInactive" >
                              <a class="sideLnk" onClick={() => handleReviewmtolinetable('mto')}>Line List Review</a>
                            </div>

                          </li>
                          <li>
                            <div id="tagsSideLnk" class="tabInactive" >
                              <a class="sideLnk" onClick={() => handleReviewmtomattable('mto')}>MTO Material Review</a>
                            </div>
                          </li>
                        </>
                      }
                      <li>
                        <div id="tagsSideLnk" class="tabInactive">
                          <a class="sideLnk">Report</a>
                        </div>
                      </li>
                    </>
                  }
                  <li>
                    <div className={activeLink === 'comment' ? 'sideLnkActive' : 'sideLnkInactive'} onClick={() => handleOpenCommentManagement('comment')}>
                      <i class="fa-solid fa-sliders sideLnkIcon"></i>
                      <a class="sideLnk">Comment Management</a>  </div>
                  </li>
                  {commentExpand &&
                    <>
                      <li>
                        <div id="tagsSideLnk" class="tabActive" onClick={handleOpenCommentRiview}>
                          <a class="sideLnk">Comment Review</a>
                        </div>
                      </li>
                      <li>
                        <div id="tagsSideLnk" class="tabInactive" onClick={handleOpenCommentStatusTable}>
                          <a class="sideLnk">Comment status table</a>
                        </div>
                      </li>
                    </>
                  }

                  <li>

                    <div id="workPkgsSideLnk" class="sideLnkInactive">
                      <i class="fa fa-suitcase sideLnkIcon"></i>
                      <a class="sideLnk">Work Package</a>
                    </div>
                  </li>
                  <li>
                    <div id="fdPlansSideLnk" class="sideLnkInactive" >
                      <i class="fa fa-line-chart sideLnkIcon"></i>
                      <a class="sideLnk">4D Plan</a>
                    </div>
                  </li>
                  <div id="viewsDiv" className="panelBox">
                    {allViews.length > 0 ? (
                      <div>
                        <div className="lbHead">Views</div>
                        <div id="viewsList" className="lbList">
                          {allViews.map(view => (
                            <div key={view.id} className="lbLi">
                              <a>{view.name}</a>
                              <img className="lbLiDelBut" src="images/delete.png" alt="Delete" onClick={() => handleDeleteView(view.name)} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div id="viewsList" className="lbList">
                        <span>(Empty)</span>
                      </div>
                    )}
                  </div>
                </ul>

              </div>
            </div>
          }


          <div class="content">
            <div className="spacer">
              <img onClick={toggleLeftNav} id='tree' src="images/tree.png" alt="" />
            </div>
            <div style={{ width: '100%', height: '90vh', backgroundColor: '#33334c', zIndex: '1' }} className="cesium-container">

              {ionAssetId && openGlobalModal ? (
                <>
                  {showSpinner && <Spinner />}
                  <CesiumComponent
                    gettokenNumber={gettokenNumber}
                    viewMode={viewMode}
                    mode={mode}
                    setMode={setMode}
                    ionAssetId={ionAssetId}
                    orthoviewmode={orthoviewmode}
                    showComment={showComment}
                    zoomfit={zoomfit}
                    setzoomfit={setzoomfit}
                    setShowComment={setShowComment}
                    selectedItem={selectedItem}
                    setselectedItem={setselectedItem}
                    activeButton={activeButton}
                    setActiveButton={setActiveButton}
                    showSpinner={showSpinner}
                    settingbox={settingbox}
                    setsettingbox={setsettingbox}
                    objecttable={objecttable}
                    allfilestable={allfilestable}
                    allComments={allComments}
                    allEquipementList={allEquipementList}
                    allLineList={allLineList}
                    userTagInfotable={userTagInfotable}
                    showMeasure={showMeasure}
                    setShowMeasure={setShowMeasure}
                    alltags={alltags}
                    allCommentStatus={allCommentStatus}
                    savedViewDialog={savedViewDialog}
                    setSavedViewDialog={setSavedViewDialog}
                    allViews={allViews}
                    setopenThreeCanvas={setopenThreeCanvas}
                    setiRoamercanvas={setiRoamercanvas}
                    setActiveLink={setActiveLink}

                  />
                </>) :
                (<>
                  <GlobalModal expandGLobalModal={expandGLobalModal} />
                </>)
              }
              {iRoamercanvas && (
                <ThreeComponent
                  viewHideThree={viewHideThree}
                  setViewHideThree={setViewHideThree}
                  leftNavVisible={leftNavVisible}
                  viewHideThreeunassigned={viewHideThreeunassigned}
                  setBackgroundColorTag={setBackgroundColorTag}
                  backgroundColorTag={backgroundColorTag}
                  viewMode={viewMode}
                  mode={mode}
                  orthoviewmode={orthoviewmode}
                  setMode={setMode}
                  zoomfit={zoomfit}
                  setzoomfit={setzoomfit}
                  selectedItem={selectedItem}
                  setselectedItem={setselectedItem}
                  activeButton={activeButton}
                  setActiveButton={setActiveButton}
                  objecttable={objecttable}
                  allEquipementList={allEquipementList}
                  allLineList={allLineList}
                  userTagInfotable={userTagInfotable}
                  showMeasure={showMeasure}
                  setShowMeasure={setShowMeasure}
                  alltags={alltags}
                  showComment={showComment}
                  setShowComment={setShowComment}
                  allComments={allComments}
                  allCommentStatus={allCommentStatus}
                  savedViewDialog={savedViewDialog}
                  setSavedViewDialog={setSavedViewDialog}
                  allViews={allViews}
                  setexpandGLobalModal={setexpandGLobalModal}
                  setActiveLink={setActiveLink}
                  setOpenSpidCanvas={setOpenSpidCanvas}
                  setSpidOpen={setSpidOpen}
                  setrightSideNavVisible={setrightSideNavVisible}
                />
              )}

              {customAlert && (
                <Alert
                  message={modalMessage}
                  onAlertClose={() => setCustomAlert(false)}
                />
              )}
              {showConfirm && (
                <DeleteConfirm
                  message={confirmMessage}
                  onConfirm={handleConfirmDelete}
                  onCancel={handleCancelDelete}
                />
              )}
              {
                openWorldBox && <Modal
                  onHide={handleClose}
                  show={openWorldBox}
                  backdrop="static"
                  keyboard={false}
                  dialogClassName="custom-modal"
                >
                  <div className="tag-dialog">
                    <div className="title-dialog">
                      <p className='text-light'>Add word Box</p>
                      <p className='text-light cross' onClick={handleClose}>&times;</p>
                    </div>
                    <div className="dialog-input">
                      <label>File</label>
                      <input
                        type="file" onChange={(e) => handleFileChange(e)} />
                      <a style={{ cursor: 'pointer', color: ' #00BFFF' }} onClick={handleAddOurWorldBox}>Add our world box</a>
                    </div>
                    <div className='dialog-button' style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', bottom: 0 }}>
                      <button className='btn btn-secondary' onClick={handleClose}>Cancel</button>
                      <button className='btn btn-dark' onClick={handleUserWorldBox}>Upload</button>
                    </div>
                  </div>
                </Modal>
              }
              {
                equipement && <EquipmentList allEquipementList={allEquipementList} />
              }
              {
                lineList && <LineList allLineList={allLineList} />
              }
              {
                bulkimport && <BulkModelImport loading={loading} setLoading={setLoading} />
              }

              {
                expandTags && <ViewTagTable alltags={alltags} setLoading={setLoading} />
              }

              {
                expandTreeManangement && <TreeTable allAreasInTable={allAreasInTable} allDiscsInTable={allDiscsInTable} allSysInTable={allSysInTable} />
              }

              {
                registerTag && <TagRegistration setLoading={setLoading} alltags={alltags} />
              }
              {
                createBranchtable && <BranchTableManangement />
              }

              {
                reviewBranchtable && <ReviewBranchTable branchTableDetails={branchTableDetails} branchTableDataDetails={branchTableDataDetails} />
              }

              {
                createSpectable && <SpecTableManagement branchTableDetails={branchTableDetails} branchTableDataDetails={branchTableDataDetails} />
              }

              {
                reviewSpectable && <ReviewSpecMaterialTable specsizeDetails={specsizeDetails} specmatDetails={specmatDetails} spectempDetails={spectempDetails} specDetails={specDetails} specmat={specmat} />
              }

              {
                openCustomSpec && <CustomSpecManangement speccus={speccus} />
              }

              {
                createOpenMto && <CreateMto allLineList={allLineList} allAreasInTable={allAreasInTable} />
              }
              {reviewdocmto && <ReviewMtoDoc mtodoc={mtodoc} />}
              {reviewareamto && <ReviewMtoArea mtoarea={mtoarea} />}
              {reviewtagmto && <ReviewMtoTag mtotag={mtotag} />}
              {reviewlinemto && <ReviewMtoLine mtolinelist={mtolinelist} />}
              {/* mtoarea={mtoarea} */}
              {createMtoMat && <CreateMaterialList mtolinelist={mtolinelist} mtoarea={mtoarea} mtolinearea={mtolinearea} specmatDetails={specmatDetails} matdataarea={matdataarea} />}
              {reviewmtomat && <MtoMaterialList matdataarea={matdataarea} handleOpenSpid={handleOpenSpid}></MtoMaterialList>}
              {

                expanddocument && <Documenttable allDocuments={allDocuments} />
              }
              {
                registerDocument && <DocumentReg />
              }
              {
                commentExpand && <CommentReview allComments={allComments} />
              }

              {
                loading && <BulkSpinner loading={loading} setLoading={setLoading} />
              }
              {
                openTagInfoTable && <GeneralTagInfoTable userTagInfotable={userTagInfotable} generalTagInfoFields={generalTagInfoFields} />
              }
              {
                genTagFields && <GeneralTagInfoFields generalTagInfoFields={generalTagInfoFields} />
              }
              {
                editCommentStatus && <CommentStatusTable allCommentStatus={allCommentStatus} />
              }

              {
                areaPopUpBox && <AreaPopUp areaPopUpBox={areaPopUpBox} onClose={handleCloseAreaDialog} />
              }
              {
                discPopUpBox && <DisciplinePopUp discPopUpBox={discPopUpBox} onClose={handleCloseAreaDialog} />
              }
              {
                sysPopUpBox && <SystemPopUp sysPopUpBox={sysPopUpBox} onClose={handleCloseAreaDialog} />
              }
              {
                createiso && <CreateIso alltags={alltags} onclose={() => setcreateiso(false)} />
              }

              {/* {
                createiso && <SisoWorkspace />
              } */}

              {reviewiso && <SisoReview isosheets={isosheets} isofilepath={isofilepath} isolinelist={isolinelist} specmatDetails={specmatDetails}/>}


              {
                spidopen && <Spid allDocuments={allDocuments} openSpidCanvas={openSpidCanvas} alltags={alltags} svgcontent={svgcontent} allspids={allspids} allareas={allareas} setOpenSpidCanvas={setOpenSpidCanvas} setopenThreeCanvas={setopenThreeCanvas} setiRoamercanvas={setiRoamercanvas} setSpidOpen={setSpidOpen} allCommentStatus={allCommentStatus} allComments={allComments} tagdocsel={tagdocsel} setrightSideNavVisible={setrightSideNavVisible} setsvgcontent={setsvgcontent} markdet={markdet} specmatDetails={specmatDetails} recteletag={recteletag} allAreasInTable={allAreasInTable} />
              }
              {
                assignTagUnassigned && <AssignUnassignedTag assignTagUnassigned={assignTagUnassigned} onClose={handleCloseAreaDialog} setselectunassigned={setselectunassigned} selectAllUnassignedModels={selectAllUnassignedModels} setselectAllUnassignedModels={setselectAllUnassignedModels} unassignedmodel={unassignedmodel} setunassignedmodel={setunassignedmodel} unassignedCheckboxStates={unassignedCheckboxStates} setUnassignedCheckboxStates={setUnassignedCheckboxStates} />
              }

              {
                showAreaDialog && <AreaDialog showAreaDialog={showAreaDialog} onClose={handleCloseAreaDialog} allAreasInTable={allAreasInTable} />
              }

              {
                discDialog &&
                <DisciplineDialog onClose={handleCloseAreaDialog} discDialog={discDialog} areaname={areaname} allDiscsInTable={allDiscsInTable} />

              }
              {
                sysDialog &&
                <SystemDialog onClose={handleCloseAreaDialog} sysDialog={sysDialog} areaname={areaname} discname={discname} allSysInTable={allSysInTable} />

              }
              {
                showTagDialog && <TagAdd onClose={handleCloseAreaDialog} showTagDialog={showTagDialog} areaname={areaname} discname={discname} sysname={sysname} alltags={alltags} setLoading={setLoading} />

              }
              {
                createAssetDialog && <CreateAsset createAssetDialog={createAssetDialog} onClose={handleCloseAreaDialog} gettokenNumber={gettokenNumber} setResponseMessage={setResponseMessage} projectNo={projectNo} projectFolder={projectFolder} />
              }

              {
                assigntokenmodal && projectFolder && <TokenModal onClose={handleCloseAreaDialog} assigntokenmodal={assigntokenmodal} projectNo={projectNo} projectFolder={projectFolder} />
              }

              {
                openDeleteModal && <DeleteAsset onClose={handleCloseAreaDialog} openDeleteModal={openDeleteModal} projectNo={projectNo} assetIdProject={assetIdProject} gettokenNumber={gettokenNumber} assetList={assetList} />
              }
            </div>


          </div>

          {
            rightSideNavVisible &&
            <div class="right-sidenav" >
              <div className="rightSideNav">
                <ul>
                  <li >
                    <div className="tooltip-container">
                      <span className="icon-tooltip" title='Select asset'>
                        <select onChange={handleAssetSelection} style={{ width: '20px' }} >
                          <option value="" ></option>
                          {assetList.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.name}
                            </option>
                          ))}
                        </select>
                      </span>

                    </div>
                  </li>
                  <li className={activeButton === 'orbit' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" onClick={() => handleOrbitClick('orbit')} title='Orbit Camera' >
                        <img style={{ width: '30px', height: '30px' }} src="images/orbit.png" alt="" />   </span>
                    </div>
                  </li>

                  <li className={activeButton === 'fly' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span
                        className="icon-tooltip"
                        onClick={() => handleFlyClick('fly')}
                        title="Fly camera"
                      >
                        <i class="fa-solid fa-plane fs-4"></i>   </span>
                    </div>
                  </li>

                  <li className={activeButton === 'select' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" title='Selection' onClick={() => handleObjectselected('select')}>
                        <i class="fas fa-mouse-pointer fs-4"></i>
                      </span>
                    </div>
                  </li>
                  {/* <li>
     <div className="tooltip-container">
       <span className="icon-tooltip"title='Add new asset'><PublishIcon /></span>                   
     </div>
     </li> */}

                  <li className={activeButton === 'fitview' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" title='Fit View' onClick={() => handlezoomfit('fitview')} >
                        <ZoomOutMapIcon />
                      </span>
                    </div>
                  </li>
                  <li className={activeButton === 'setting' ? 'active' : ''}>
                    <div className="tooltip-container" onClick={() => handleSetting('setting')}>
                      <span className="icon-tooltip" title='Setting'  >
                        <i class="fa-solid fa-gear fs-4"></i>    </span>
                    </div>
                  </li>
                  <li className={activeButton === 'orthographic' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" onClick={() => handleorthoview('orthographic')} title='Orthographic View'>
                        <i class="fa-solid fa-cube fs-4"></i>
                      </span>
                    </div>
                  </li>
                  <li className={activeButton === 'perspective' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" onClick={() => handleperspective('perspective')} title='Perspective View'>
                        <i class="fa-solid fa-eye fs-4"></i>
                      </span>
                    </div>
                  </li>
                  <li className={activeButton === 'front' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" onClick={() => handleorthofront('front')} title='Front View'>
                        <img className="button" src="images/front.png" alt='' /></span>
                    </div>
                  </li>
                  <li className={activeButton === 'left' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" onClick={() => handleortholeft('left')} title='Left View'>
                        <img className="button" src="images/left.png" alt='' /></span>
                    </div>
                  </li>
                  <li className={activeButton === 'back' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" onClick={() => handleorthoback('back')} title='Back View'>
                        <img className="button" src="images/back.png" alt='' /></span>
                    </div>
                  </li>
                  <li className={activeButton === 'right' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" onClick={() => handleorthoright('right')} title='Right View'>
                        <img className="button" src="images/right.png" alt='' /></span>
                    </div>
                  </li>
                  <li className={activeButton === 'top' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" onClick={() => handleorthotop('top')} title='Top View'>
                        <img className="button" src="images/top.png" alt='' /></span>
                    </div>
                  </li>
                  <li className={activeButton === 'bottom' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" onClick={() => handleorthobottom('bottom')} title='Bottom View'>
                        <img className="button" src="images/bottom.png" alt='' /></span>
                    </div>
                  </li>
                  <li className={activeButton === 'measure' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" onClick={() => handleShowMeasure('measure')} title="Measure">
                        <img id="measure" class="button" src="images/measure.png" />
                      </span>
                    </div>
                  </li>
                  <li className={activeButton === 'savedview' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" onClick={() => handleSavedView('savedview')} title="Saved view">
                        <img id="measure" class="button" src="images/save-icon.png" />
                      </span>
                    </div>
                  </li>


                  <li className={activeButton === 'comment' ? 'active' : ''}>
                    <div className="tooltip-container">
                      <span className="icon-tooltip" onClick={() => handlecomment('comment')} title='Show comment'>
                        <i class="fa-solid fa-comment fs-4"></i>
                      </span>
                    </div>
                  </li>

                </ul>

              </div>
            </div>
          }

          {
            loadProject && <NewProject loadProject={loadProject}
              setloadProject={setloadProject} setProjectFolder={setProjectFolder} setprojectNo={setprojectNo} setselectedprojectPath={setselectedprojectPath} setAssetList={setAssetList} setgettokenNumber={setgettokenNumber} setunassignedmodel={setunassignedmodel} setAllLineList={setAllLineList} setAllEquipementList={setAllEquipementList}
              setAlltags={setAlltags} setAllDocuments={setAllDocuments} setAllArea={setAllArea} setallDisc={setallDisc} setallSys={setallSys} setUserTagInfoTable={setUserTagInfoTable} setAllCommentStatus={setAllCommentStatus} setGeneralTagInfoFields={setGeneralTagInfoFields} userTagInfotable />
          }

        </div>
        <div className="row">
          <Footer />
        </div>
      </div>
    </div>

  )
}
export default Home




