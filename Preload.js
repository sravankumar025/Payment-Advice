const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  savePdf: () => ipcRenderer.invoke("generate-pdf"),
  saveAdvice: (formData) => ipcRenderer.invoke("save-advice", formData),
  getAdvice: () => ipcRenderer.invoke("get-advice"),
  deleteAdvices: () => ipcRenderer.invoke("delete-advices"),
  onDownloadStatus: (callback) => {
    const subscription = (event, value) => callback(value);
    ipcRenderer.on("download-status", subscription);
    return () => ipcRenderer.removeListener("download-status", subscription);
  },
  /**Master Form Data Handlers */
  getMasterEntry: () => ipcRenderer.invoke("get-master-entry"),
  saveMasterEntry: (data) => ipcRenderer.invoke("save-master-entry", data),
  onMasterData: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on("master-data", handler);
    return () => ipcRenderer.removeListener("master-data", handler);
  }
});
