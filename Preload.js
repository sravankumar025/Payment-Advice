const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    savePdf: () => ipcRenderer.invoke('generate-pdf'),
    saveAdvice: (formData) => ipcRenderer.invoke('save-advice', formData),
    getAdvices: () => ipcRenderer.invoke('get-advices'),
    deleteNullAdvices: () => ipcRenderer.invoke('delete-null-advices')
});
