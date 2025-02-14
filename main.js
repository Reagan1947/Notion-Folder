const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const express = require('express');

const server = express();
const port = 3000;

// Process Get Request
server.get('/open-file', (req, res) => {
    const filePath = req.query.path;
    if (filePath) {
        // Open File
        shell.openPath(filePath).then(() => {
            res.send(`Open file successfuly: ${filePath}`);
        }).catch(err => {
            res.status(500).send(`Open file failed: ${err.message}`);
        });
    } else {
        res.status(400).send('File path is needed');
    }
});

// Booming Express Service
server.listen(port, () => {
    console.log(`Express Server is Runing http://localhost:${port}`);
});

function createWindow () {
    const win = new BrowserWindow({
        width: 500,
        height: 550,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true
        },
        backgroundColor: "#f3f3f2"
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Listening Open File Event
ipcMain.on('open-file', (event, filePath) => {
    shell.openPath(filePath);
});