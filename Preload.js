const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  savePdf: () => ipcRenderer.invoke("generate-pdf"),
  saveAdvice: (formData) => ipcRenderer.invoke("save-advice", formData),
  getAdvice: (id) => ipcRenderer.invoke("get-advice", id),
  deleteAdvices: () => ipcRenderer.invoke("delete-advices"),
  onDownloadStatus: (callback) => {
    const subscription = (event, value) => callback(value);
    ipcRenderer.on("download-status", subscription);
    return () => ipcRenderer.removeListener("download-status", subscription);
  },
});
