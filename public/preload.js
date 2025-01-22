const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');

// contextBridge.exposeInMainWorld('electron', {
//   homeDir: () => os.homedir(),
//   osVersion: () => os.arch(),
// });

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
});
contextBridge.exposeInMainWorld('electron', {
    homeDir: () => os.homedir(),
    osVersion: () => os.arch(),
  });
 
contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        // Whitelist channels for sending messages to the main process
        let validChannels = ['save-data', 'fetch-data','select-folder','open-project','open-database','save-code-data','all-area','save-disc-data','save-sys-data','save-token','save-tag-data','save-tag-sys-data','remove-tag','remove-system','remove-disc','remove-area','save-unassigned-data','save-document-data','delete-unassigned-models','assign-tags','document-fetch','remove-Tag-table','remove-linelist-table','remove-equipement-table','remove-document-table','fetch-tag-path','update-linelist-table','update-equipment-table','create-asset','add-comment','delete-comment','open-new-window','open-new-project','fetch-unassigned-path','update-taginfo-table','delete-all-project','delete-project',,'remove-taginfo-table','editCommentStatus','map-project','save-world-box','update-tag-data','edit-project','import-equipment-list','import-line-list','delete-all-tags','import-tag','import-taginfo-list','save-user-world-box','delete-all-comments','status-assigned','delete-status','import-comment-details','save-camera-view','delete-view','open-in-three','get-mesh-data','delete-asset','rvm-gltf-converter','iges-gltf-converter','ifc-gltf-converter','dae-gltf-converter','saveUserDefinedFields','save-area-code-data','save-disc-code-data','save-sys-code-data','remove-tree-table-area','remove-tree-table-sys','remove-tree-table-disc','delete-all-areas','delete-all-disc','delete-all-sys','save-edit-area','save-edit-disc','save-edit-sys','check-validity','open-webpage-pods','save-glb-file',
            // PID
        'save-doc-data', 'fetch-sin-doc', 'save-ele-tag','fetch-sin-ele','save-area-data','fetch-tag-ele', 'fetch-info-tag', 'fetch-sin-docdetails', 'save-flag-ele','fetch-con-doc', 'fetch-condoc-path', 'create-new-window', 'fetch-sin-flag','fetch-doc-flag', 'update-flag-table', 'double-sin-flag', 'sin-flag-conflag','unflag-ele-flag', 'update-unflag-table','fetch-flag-tag', 'update-flag-tag','is-element-tag', 'sel-tag-ele', 'del-ele-tag','ele-tag-type', 'ele-flag-sel','flag-dou-sel','update-doc-table','insert-master-table', 'check-master','fetch-master-doc', 'copy-to-master', 'backup-masdoc','update-masdoc', 'save-svg', 'check-file-exists', 'load-svg', 'read-svg-file','save-layer','show-doc-area','is-ele-tag','save-areatag-rel','tag-doc-con','tag-doc-det','update-check-sta','open-three-from-pid','open-pid-from-three','tag-doc-det','dwg-svg-converter','save-group-markings',
        // MTO
        'branchtabledata','import-excel','save-custom-spec','spec-excel-data','update-customspec-table','Mto-doc-save', 'Mto-area-save', 'Mto-tag-save', 'update-mtolinelist-table', 'save-mtoline-area', 'save-material-data', 'update-matdataarea-table', 'delete-material-data','import-mtodataline-list'

    
    ]; // Add 'fetch-data' for reading data 'save-data', 'fetch-data', 
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    
    receive: (channel, func) => {
        // Whitelist channels for receiving messages from the main process
        let validChannels = ['app-id','data-fetched','save-data-response','save-tag-complete','select-folder-fetched', 'all-area-fetched','all-disc-fetched','all-sys-fetched','all-tags-fetched','all-tags-under-sys-fetched','all-models-saved','all-unassignedModels','all-files-table','all-mesh-table','all-document-fetched','all-lines-fetched','all-equipement-fetched','unassigned-models-deleted','processing-complete','fetched-document','fetched-Tag-path','create-asset-response','save-comment-response','all-comments','delete-comment-response','load-project-data','open-project-details','fetched-unassigned-path','document-added','send-back-token','all-taginfo-fetched','delete-all-project-response','delete-project-response','asset-id-project','all-project-details','token-saved','edit-project-response','tag-exists','tag-not-found','all-status','save-camera-view-response','all-views','delete-views-response','three-path','mesh-data-found','delete-asset-response','all-fields-user-defined','rvm-conversion-success','iges-conversion-success','ifc-conversion-success','dae-conversion-success','saveUserDefinedFieldsResult','all-area-table-fetched','all-disc-table-fetched','all-sys-table-fetched','area-added-response','disc-added-response','sys-added-response','check-validity-response','installation-response','extend-validity-response', 'google-login-success','google-login-error','microsoft-login-success','microsoft-login-errors','response-message-success','appValidity','all-docs-fetched','fbx-conversion-success',
            // PID
        'sin-doc-fetched','all-elements-fetched', 'sin-ele-fetched', 'spid-docs-fetched',
        'sin-docdetails-fetched', 'all-flags-fetched', 'con-doc-fetched', 'condoc-path-fetched',
        'sin-flag-fetched', 'doc-flag-fetched', 'sin-flag-double', 'flag-conflag-sin',
        'ele-flag-unflag', 'flag-tag-fetched', 'flag-tag-updated','element-tag-is', 'flag-tag-is', 'ele-tag-sel', 'type-tag-ele','sel-flag-ele',  'ele-flag-out','master-doc-fetched', 'master-checked','store-master-fetched', 'read-svg-file-response','all-layers-fetched','doc-area-fetched','tag-ele-is','areatag-rel','con-doc-tag','det-doc-tag','fetched-Tag-path-pid','con-doc-tag','dxf-conversion-success' , 'group-markings-saved',
        // MTO
        'branch-table-response','branch-table-data-response','import-response','specsize-table-response','specmat-table-response','spectemp-table-response', 'specdet-table-response','specdet-detail-response','custom-spec-res','save-doc-mto', 'area-save-mto', 'tag-save-mto', 'linelist-save-mto','mtoline-area-save','material-data-save','testing'
        
        
        ];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});
