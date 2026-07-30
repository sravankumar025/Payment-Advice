const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    savePdf: () => ipcRenderer.invoke('generate-pdf'),
});
