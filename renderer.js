document.getElementById('open-file').addEventListener('click', () => {
    const filePath = document.getElementById('file-path').value;
    ipcRenderer.send('open-file', filePath);
});