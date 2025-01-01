const { app, BrowserWindow, dialog, ipcMain, shell, net, protocol } = require('electron');
const fs = require('fs').promises;
const url = require('url');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

let mainWindow;
let db;
let selectedFolderPath;
let projectdb;
let projectdBPath;
let databasePath;
let applicationId;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Electron App',
        width: 1700,
        height: 800,
        minWidth: 840,
        minHeight: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    const startUrl = url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file',
    });
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.toggleDevTools();
}

function createProjectDatabase() {
    const dbPath = path.join(app.getPath('userData'), 'project.db');
    projectdBPath = dbPath;
    projectdb = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the project database.', dbPath);
            projectdb.run(`CREATE TABLE IF NOT EXISTS projectdetails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                projectId TEXT,
                projectNumber TEXT,
                projectName TEXT,
                projectDescription TEXT,
                projectPath TEXT,
                TokenNumber TEXT,
                asset TEXT
            )`);
            projectdb.run(`CREATE TABLE IF NOT EXISTS userdetails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                password TEXT,
                email TEXT,
                registrationDate TEXT,
                expiryDate TEXT,
                token TEXT
            )`);
        }
    });
}

function createDatabase() {
    if (!selectedFolderPath) {
        console.error('No folder selected.');
        return;
    }
    const dbPath = path.join(selectedFolderPath, 'database.db');
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the database.', dbPath);
            db.run(`CREATE TABLE IF NOT EXISTS SpecDetails (
                "Title" TEXT,
                "Doc_No" TEXT,
                "Class" TEXT,
                "Rev_Date" TEXT,
                "Rev" TEXT,
                "Branch" TEXT,
                "Table" TEXT,
                "Service_Code" TEXT,
                "Rating" TEXT,
                "Project" TEXT
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS Temppres (
                "Pressure_Barg" REAL,
                "Temperature_Deg_C" INTEGER
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS materials (
                "ITEM" TEXT,
                "TYPE" TEXT,
                "RANGE_FROM" REAL,
                "RANGE_TO" REAL,
                "GEOMETRIC_STANDARD" TEXT,
                "EDS_VDS" TEXT,
                "END_CONN_1" TEXT,
                "END_CONN_2" TEXT,
                "MATERIAL_DESCR" TEXT,
                "MDS" TEXT,
                "RATING" TEXT,
                "SCHD" TEXT,
                "NOTES" TEXT
            )`);
            
            db.run(`CREATE TABLE IF NOT EXISTS size (
                "ND_inch" REAL,
                "OD_mm" REAL,
                "THK_mm" REAL,
                "SCH" TEXT,
                "WEIGHT" TEXT
            )`);
        }
    });
    databasePath = path.join(selectedFolderPath, 'database.db');
}

function selectFolderAndCreateDatabase(event) {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    }).then(result => {
        const folderPath = result.filePaths[0];
        if (folderPath) {
            console.log(folderPath);
            selectedFolderPath = folderPath;
            createDatabase();
            event.reply('folder-selected', folderPath);
        }
    }).catch(err => {
        console.error("Error selecting folder:", err);
    });
}

function generateCustomID(prefix) {
    const uuid = uuidv4();
    const uniqueID = prefix + uuid.replace(/-/g, '').slice(0, 6);
    return uniqueID;
}

function insertData(table, data) {
    if (table === 'size') {
        insertSizeData(data);
    } else if (table === 'Temppres') {
        insertTemppresData(data);
    } else if (table === 'SpecDetails') {
        insertSpecDetailsData(data);
    } else if (table === 'materials') {
        insertMaterialsData(data);
    } else {
        const keys = Object.keys(data[0]);
        const placeholders = keys.map(() => '?').join(',');
        const quotedKeys = keys.map(key => `"${key}"`).join(',');
        const sql = `INSERT INTO "${table}" (${quotedKeys}) VALUES (${placeholders})`;

        const stmt = db.prepare(sql);
        data.forEach(row => {
            const values = keys.map(key => row[key]);
            stmt.run(values, (err) => {
                if (err) {
                    console.error('Error inserting row:', err);
                }
            });
        });
        stmt.finalize();
    }
}

function insertSizeData(data) {
    const sql = `INSERT INTO size (ND_inch, OD_mm, THK_mm, SCH, WEIGHT) VALUES (?, ?, ?, ?, ?)`;
    const stmt = db.prepare(sql);

    data.forEach(row => {
        stmt.run([
            row['ND (inch)'],
            row['OD (mm)'],
            row['THK (mm)'],
            row['SCH'],
            row['WEIGHT']
        ], (err) => {
            if (err) {
                console.error('Error inserting size row:', err);
            }
        });
    });
    stmt.finalize();
}

function insertTemppresData(data) {
    const sql = `INSERT INTO Temppres (Pressure_Barg, Temperature_Deg_C) VALUES (?, ?)`;
    const stmt = db.prepare(sql);

    data.forEach(row => {
        stmt.run([
            row['Pressure (Barg)'],
            row['Temperature (Deg. C)']
        ], (err) => {
            if (err) {
                console.error('Error inserting Temppres row:', err);
            }
        });
    });
    stmt.finalize();
}

function insertSpecDetailsData(data) {
    const sql = `INSERT INTO SpecDetails (Title, Doc_No, Class, Rev_Date, Rev, Branch, "Table", Service_Code, Rating, Project) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const stmt = db.prepare(sql);

    data.forEach(row => {
        stmt.run([
            row['Title'],
            row['Doc. No.'],
            row['Class'],
            row['Rev.Date'],
            row['Rev.'],
            row['Branch'],
            row['Table'],
            row['Service Code'],
            row['Rating'],
            row['Project']
        ], (err) => {
            if (err) {
                console.error('Error inserting SpecDetails row:', err);
            }
        });
    });
    stmt.finalize();
}

function insertMaterialsData(data) {
    const sql = `INSERT INTO materials (
        ITEM, TYPE, RANGE_FROM, RANGE_TO, GEOMETRIC_STANDARD, EDS_VDS,
        END_CONN_1, END_CONN_2, MATERIAL_DESCR, MDS, RATING, SCHD, NOTES
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const stmt = db.prepare(sql);

    data.forEach(row => {
        stmt.run([
            row['ITEM'],
            row['TYPE'],
            row['RANGE FROM'],
            row['RANGE TO'],
            row['GEOMETRIC STANDARD'],
            row['EDS/VDS'],
            row['END CONN #1'],
            row['END CONN #2'],
            row['MATERIAL DESCR.'],
            row['MDS'],
            row['RATING'],
            row['SCHD.'],
            row['NOTES']
        ], (err) => {
            if (err) {
                console.error('Error inserting materials row:', err);
            }
        });
    });
    stmt.finalize();
}

app.whenReady().then(() => {
    createMainWindow();
    createProjectDatabase();

    ipcMain.on('open-file-dialog', async (event) => {
        try {
            const result = await dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [{ name: 'Supported Files', extensions: ['html', 'htm', 'fbx'] }]
            });

            if (!result.canceled && result.filePaths.length > 0) {
                const filePath = result.filePaths[0];
                const content = await fs.readFile(filePath, 'utf-8');
                event.reply('html-file-content', content);
            } else {
                event.reply('html-file-content', null);
            }
        } catch (err) {
            console.error('Error in open-file-dialog:', err);
            event.reply('html-file-content', null);
        }
    });

    ipcMain.on('openfolder', (event) => {
        selectFolderAndCreateDatabase(event);
    });

    ipcMain.on('import-excel', async (event, data) => {
        console.log(data);
        try {
            Object.entries(data).forEach(([sheet, rows]) => {
                switch(sheet) {
                    case 'SpecDetails':
                        insertSpecDetailsData(rows);
                        break;
                    case 'materials':
                        insertMaterialsData(rows);
                        break;
                    case 'size':
                        insertSizeData(rows);
                        break;
                    case 'Temppres':
                        insertTemppresData(rows);
                        break;
                    default:
                        console.warn(`Unknown sheet: ${sheet}`);
                }
            });
            event.reply('import-response', 'Data imported successfully');
        } catch (error) {
            console.error('Error importing data:', error);
            event.reply('import-response', 'Error importing data: ' + error.message);
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});