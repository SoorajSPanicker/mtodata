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
        let validChannels = ['open-file-dialog','openfolder','import-excel' ]; // Add 'fetch-data' for reading data 'save-data', 'fetch-data', 
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    
    receive: (channel, func) => {
        // Whitelist channels for receiving messages from the main process
        let validChannels = ['html-file-content'
        ];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});
