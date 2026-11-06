
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myDB', {
    getData: () => ipcRenderer.invoke('db-get-data'),
    saveData: (data) => ipcRenderer.invoke('db-save-data', data)
});