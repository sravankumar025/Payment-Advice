const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  savePdf: () => ipcRenderer.invoke("generate-pdf"),
  saveAdvice: (formData) => ipcRenderer.invoke("save-advice", formData),
  getAdvice: (id) => ipcRenderer.invoke("get-advice", id),
  onDownloadStatus: (callback) => {
    const subscription = (event, value) => callback(value);
    ipcRenderer.on('download-status', subscription);
    
    // Return cleanup function to remove listener when unmounted
    return () => ipcRenderer.removeListener('download-status', subscription);
  },
});
