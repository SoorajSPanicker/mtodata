const { app, BrowserWindow, dialog, ipcMain, shell, net, protocol } = require('electron');
const fs = require('fs');
const url = require('url');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const request = require('request-promise-native');
const xlsx = require('xlsx');
const { execFile } = require('child_process');
ipcMain.setMaxListeners(20);
const WebSocket = require('ws');
const startServer = require('./server');
const moment = require('moment');
const { TagFaces } = require('@mui/icons-material');
const dxf = require('dxf');

let mainWindow;
let db;
let selectedFolderPath;
let projectdb
let projectdBPath;
let databasePath
let applicationId

function getApplicationId() {
    const appIdPath = path.join(app.getPath('userData'), 'appId.json');

    if (fs.existsSync(appIdPath)) {
        // Read existing application ID
        const data = fs.readFileSync(appIdPath);
        const appIdData = JSON.parse(data);
        applicationId = appIdData.appId;
        return appIdData.appId;
    } else {
        // Generate a new application ID
        const newAppId = generateCustomID('APPID');
        fs.writeFileSync(appIdPath, JSON.stringify({ appId: newAppId }, null, 2));
        applicationId = newAppId;
        return newAppId;
    }
}

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
    const appId = getApplicationId();
    console.log('Application ID:', appId);

    // mainWindow.once('ready-to-show', () => {
    //     checkAppValidity();
    //     mainWindow.webContents.send('app-id', appId);
    // });

    // mainWindow.on('closed', () => {
    //     mainWindow = null;
    // });

}
// Your existing event listeners for window-all-closed and activate
function createProjectDatabase() {
    const dbPath = path.join(app.getPath('userData'), 'project.db');
    projectdBPath = dbPath
    projectdb = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the database.', dbPath);
            // Create tables if they don't exist
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
// Function to create or connect to the database in the specified folder
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
            db.run("CREATE TABLE IF NOT EXISTS DisciplineTable (discId TEXT,discNo TEXT,discName TEXT)");
            db.run("CREATE TABLE IF NOT EXISTS SystemTable (sysId TEXT,sysNo TEXT,sysName TEXT)");
            db.run("CREATE TABLE IF NOT EXISTS CommentTable (fileid TEXT,docNumber TEXT,number TEXT,comment TEXT,status TEXT,priority TEXT,createdby TEXT,createddate TEXT,coOrdinateX REAL,coOrdinateY REAL,coOrdinateZ REAL,closedBy TEXT,closedDate TEXT)");
            db.run("CREATE TABLE IF NOT EXISTS projectdetails (id INTEGER PRIMARY KEY AUTOINCREMENT,projectId TEXT, projectNumber TEXT, projectName TEXT, projectDescription TEXT,projectPath TEXT, TokenNumber TEXT, asset TEXT)");

            db.run("CREATE TABLE IF NOT EXISTS assignToken ( projectId TEXT, projectNo TEXT, projectname TEXT, token TEXT, userName TEXT, userId TEXT, assetId TEXT)");
            db.run('CREATE TABLE IF NOT EXISTS Tree (area TEXT, disc TEXT, sys TEXT, tag TEXT, name TEXT, PRIMARY KEY(area, disc, sys, tag))')
            db.run('CREATE TABLE IF NOT EXISTS Tags (tagId TEXT, number TEXT, name TEXT,parenttag TEXT, type TEXT, filename TEXT, PRIMARY KEY(number))')
            db.run('CREATE TABLE IF NOT EXISTS UnassignedModels (number TEXT, filename TEXT, PRIMARY KEY(number))')
            db.run("CREATE TABLE IF NOT EXISTS fileDetails (CoordinateTable TEXT,filesLoaded TEXT)");
            db.run("CREATE TABLE IF NOT EXISTS BoundingboxTable (fileid TEXT, meshid TEXT, tagId TEXT, fileName TEXT, meshName TEXT , tagNo TEXT, coOrdinateX REAL, coOrdinateY REAL, coOrdinateZ REAL,  maxbbX REAL, maxbbY REAL,maxbbZ REAL,minbbX REAL,minbbY REAL,minbbZ REAL)");
            db.run("CREATE TABLE IF NOT EXISTS FileBoundingTable (fileid TEXT,tagId TEXT, fileName TEXT, coOrdinateX REAL, coOrdinateY REAL, coOrdinateZ REAL, maxbbX REAL, maxbbY REAL,maxbbZ REAL,minbbX REAL,minbbY REAL,minbbZ REAL)");
            db.run(`CREATE TABLE IF NOT EXISTS TagInfo (
        tagId TEXT,
        tag TEXT,
        type TEXT,
        taginfo1 TEXT,
        taginfo2 TEXT,
        taginfo3 TEXT,
        taginfo4 TEXT,
        taginfo5 TEXT,
        taginfo6 TEXT,
        taginfo7 TEXT,
        taginfo8 TEXT,
        taginfo9 TEXT,
        taginfo10 TEXT,
        taginfo11 TEXT,
        taginfo12 TEXT,
        taginfo13 TEXT,
        taginfo14 TEXT,
        taginfo15 TEXT,
        taginfo16 TEXT,
        taginfo17 TEXT,
        taginfo18 TEXT,
        taginfo19 TEXT,
        taginfo20 TEXT,
        taginfo21 TEXT,
        taginfo22 TEXT,
        taginfo23 TEXT,
        taginfo24 TEXT,
        taginfo25 TEXT,
        taginfo26 TEXT,
        taginfo27 TEXT,
        taginfo28 TEXT,
        taginfo29 TEXT,
        taginfo30 TEXT,
        taginfo31 TEXT,
        taginfo32 TEXT,
        taginfo33 TEXT,
        taginfo34 TEXT,
        taginfo35 TEXT,
        taginfo36 TEXT,
        taginfo37 TEXT,
        taginfo38 TEXT,
        taginfo39 TEXT,
        taginfo40 TEXT,
        taginfo41 TEXT,
        taginfo42 TEXT,
        taginfo43 TEXT,
        taginfo44 TEXT,
        taginfo45 TEXT,
        taginfo46 TEXT,
        taginfo47 TEXT,
        taginfo48 TEXT,
        taginfo49 TEXT,
        taginfo50 TEXT,

        PRIMARY KEY(tagId)
    )`);
            db.run('CREATE TABLE IF NOT EXISTS Areatable (areaId TEXT PRIMARY KEY, area TEXT, name TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS Disctable (discId TEXT PRIMARY KEY, disc TEXT, name TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS Systable (sysId TEXT PRIMARY KEY, sys TEXT, name TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS CommentStatus (number TEXT,statusname TEXT,color TEXT)')

            db.run('CREATE TABLE IF NOT EXISTS UserTagInfoFieldUnits (id INTEGER PRIMARY KEY AUTOINCREMENT, field TEXT, unit TEXT statuscheck TEXT)');

            db.run('CREATE TABLE IF NOT EXISTS TexturedPlanes (number TEXT, name TEXT, x REAL, y REAL, z REAL, filename TEXT,'
                + 'PRIMARY KEY(number))')

            db.run('CREATE TABLE IF NOT EXISTS Views (name TEXT, posX REAL, posY REAL, posZ REAL, targX REAL, targY REAL, targZ REAL,'
                + 'PRIMARY KEY(name))')

            db.run('CREATE TABLE IF NOT EXISTS LineList (tagId TEXT,tag TEXT, fluidCode TEXT, lineId TEXT, medium TEXT, lineSizeIn REAL, lineSizeNb REAL,'
                + 'pipingSpec TEXT, insType TEXT, insThickness TEXT, heatTrace TEXT, lineFrom TEXT, lineTo TEXT, pnid TEXT, pipingIso TEXT,'
                + 'pipingStressIso TEXT, maxOpPress REAL, maxOpTemp REAL, dsgnPress REAL, minDsgnTemp REAL, maxDsgnTemp REAL, testPress REAL,'
                + 'testMedium TEXT, testMediumPhase TEXT, massFlow REAL, volFlow REAL, density REAL, velocity REAL, paintSystem TEXT, ndtGroup TEXT,'
                + 'chemCleaning TEXT, pwht TEXT, PRIMARY KEY(tag))')
            db.run('CREATE TABLE IF NOT EXISTS EquipmentList (tagId TEXT, tag TEXT, descr TEXT, qty TEXT, capacity REAL, type TEXT, materials TEXT,'
                + 'capacityDuty TEXT, dims TEXT, dsgnPress REAL, opPress REAL, dsgnTemp REAL, opTemp REAL, dryWeight REAL, opWeight REAL, pnid TEXT,'
                + 'supplier TEXT, remarks TEXT, initStatus TEXT, revision TEXT, revisionDate TEXT, PRIMARY KEY(tag))')
            db.run('CREATE TABLE IF NOT EXISTS Documents (documentId TEXT,number TEXT UNIQUE, title TEXT, descr TEXT, type TEXT, filename TEXT, PRIMARY KEY(documentId))')
            db.run('CREATE TABLE IF NOT EXISTS SpidMarkings (docNumber TEXT, type TEXT, attrA INT, attrB INT, attrC INT, attrD INT, attrE INT,'
                + 'link TEXT, linkType TEXT)')


            db.run("CREATE TABLE IF NOT EXISTS Flags ( flagId TEXT,elementId TEXT, parentDoc TEXT, connectDoc TEXT , connectFlag TEXT , adjTag TEXT)");

            db.run('CREATE TABLE IF NOT EXISTS Elements (elementId TEXT,tagNumber TEXT, filename TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS Area (areaId TEXT,areaNumber TEXT,areaName TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS Master (masterId TEXT,docId TEXT,number TEXT UNIQUE, title TEXT, descr TEXT, type TEXT, filename TEXT, PRIMARY KEY(masterId))')
            db.run('CREATE TABLE IF NOT EXISTS Layers (areaNumber TEXT,x REAL, y REAL, width TEXT, height TEXT,docId TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS PidAreaTag (tagNumber text,areaNumber TEXT)')
            // // --------------------------------MTO--------------------------------//
            //             //  ---------------branch table------------------//
            //             db.run('CREATE TABLE IF NOT EXISTS MtoBranchTable(branchId text,Documentnumber TEXT,branchtableName TEXT,Revision TEXT, RevisionDate TEXT, ExcelFileid TEXT,,preparedBy TEXT,checkedBy TEXT, approvedBy TEXT, PRIMARY KEY(branchId))') 
            //             db.run('CREATE TABLE IF NOT EXISTS MtoBranchTableData(BranchTableId TEXT,branchId text, MainSize TEXT, branchSize TEXT, Item TEXT, ItemDescription TEXT, PRIMARY KEY(BranchTableId))') 
            //             //  ---------------Spec table------------------//
            //             db.run('CREATE TABLE IF NOT EXISTS MtoSpecTable(specId text,Documentnumber TEXT,specName TEXT,Revision TEXT, RevisionDate TEXT,branchTable TEXT,type TEXT,  ExcelFileid TEXT,preparedBy TEXT,checkedBy TEXT, approvedBy TEXT, PRIMARY KEY(specId))') 
            //             db.run('CREATE TABLE IF NOT EXISTS MtoSpecMaterialTable(specMaterialId text,specId text, itemType TEXT, fittingType TEXT, size1 TEXT, size2 TEXT, GeometricStd TEXT, EDS/VDS TEXT, endConn TEXT, materialDescrip TEXT, MDS TEXT, rating TEXT, SCHD TEXT, Notes TEXT, remarks TEXT, PRIMARY KEY(specMaterialId))')  
            //             db.run('CREATE TABLE IF NOT EXISTS MtoSpecSizeTable(SizeId TEXT, specId TEXT , ND TEXT, OD TEXT, THICK TEXT, SCH TEXT ,WEIGHT TEXT, PRIMARY KEY(SizeId)))')  
            //             db.run('CREATE TABLE IF NOT EXISTS MtoSpecTempPresTable(tempPresId TEXT,specId TEXT ,Temperature TEXT, Pressure TEXT PRIMARY KEY(branchId))')  

            // --------------------------------MTO--------------------------------//
            //  ---------------branch table------------------//
            db.run('CREATE TABLE IF NOT EXISTS MtoBranchTable(branchId text,Documentnumber TEXT,branchtableName TEXT,Revision TEXT, RevisionDate TEXT, ExcelFileid TEXT,preparedBy TEXT,checkedBy TEXT, approvedBy TEXT, PRIMARY KEY(branchId))')
            db.run('CREATE TABLE IF NOT EXISTS MtoBranchTableData(BranchTableId TEXT,branchId text, MainSize TEXT, branchSize TEXT, Item TEXT, ItemDescription TEXT, PRIMARY KEY(BranchTableId))')
            //  ---------------Spec table------------------//
            db.run('CREATE TABLE IF NOT EXISTS MtoSpecTable(specId Text,Documentnumber TEXT,specName TEXT,Revision TEXT, RevisionDate TEXT,branchTable TEXT,type TEXT,  ExcelFileid TEXT,preparedBy TEXT,checkedBy TEXT, approvedBy TEXT, PRIMARY KEY(specId))')

            db.run('CREATE TABLE IF NOT EXISTS MtoSpecMaterialTable(specMaterialId TEXT,specId TEXT, itemType TEXT, fittingType TEXT, size1 NUMBER, size2 NUMBER, GeometricStd TEXT, EDS_VDS TEXT, endConn TEXT, materialDescrip TEXT, materialLgDescrip TEXT, MDS TEXT, rating TEXT, thkSizeOne TEXT, thkSizeTwo TEXT, schdSizeOne TEXT, schdSizeTwo TEXT, Notes TEXT, remarks TEXT, PRIMARY KEY(specMaterialId))')
            // db.run('CREATE TABLE IF NOT EXISTS MtoSpecMaterialTable(specMaterialId text,specId text, ITEM TEXT,TYPE TEXT, RANGE_FROM TEXT, RANGE_TO TEXT, GEOMETRIC_STANDARD TEXT, EDS_VDS TEXT,END_CONN_1 TEXT, END_CONN_2 TEXT, MATERIAL_DESCR TEXT, MDS TEXT, RATING TEXT, SCHD TEXT, NOTES TEXT, PRIMARY KEY(specMaterialId))')
            // db.run('CREATE TABLE IF NOT EXISTS MtoSpecSizeTable(SizeId TEXT, specId TEXT , ND TEXT, OD TEXT, THICK TEXT, SCH TEXT ,WEIGHT TEXT, PRIMARY KEY(SizeId))')
            db.run('CREATE TABLE IF NOT EXISTS MtoSpecSizeTable(SizeId TEXT, specId TEXT , ND_inch TEXT, OD_mm TEXT, THK_mm TEXT, SCH TEXT ,WEIGHT TEXT, PRIMARY KEY(SizeId))')
            // db.run('CREATE TABLE IF NOT EXISTS MtoSpecTempPresTable(tempPresId TEXT,specId TEXT ,Temperature TEXT, Pressure TEXT ,PRIMARY KEY(tempPresId))')
            db.run('CREATE TABLE IF NOT EXISTS MtoSpecTempPresTable(tempPresId TEXT,specId TEXT ,Pressure_Barg TEXT, Temperature_Deg_C TEXT ,PRIMARY KEY(tempPresId))')
            db.run('CREATE TABLE IF NOT EXISTS MtoSpecDetTable(specDetId Text,specId text, ITEM TEXT,TYPE TEXT, RANGE_FROM TEXT, RANGE_TO TEXT, GEOMETRIC_STANDARD TEXT, EDS_VDS TEXT,END_CONN_1 TEXT, END_CONN_2 TEXT, MATERIAL_DESCR TEXT, MATERIAL_LG_DESCR TEXT, MDS TEXT, RATING TEXT, SCHD TEXT, NOTES TEXT, PRIMARY KEY(specDetId))')
            //  ---------------Custom Spec table------------------//
            db.run('CREATE TABLE IF NOT EXISTS MtoCustomTable(specCustomId TEXT, itemType TEXT, fittingType TEXT, size1 NUMBER, size2 NUMBER, GeometricStd TEXT, EDS_VDS TEXT, endConn TEXT, materialDescrip TEXT, MDS TEXT, rating TEXT, SCHD TEXT, Notes TEXT, remarks TEXT, preparedBy TEXT,checkedBy TEXT, approvedBy TEXT, PRIMARY KEY(specCustomId))')

            //--------------------MTO table---------------------------//
            // db.run('CREATE TABLE IF NOT EXISTS MtoDocumentTable(Mto_DocID TEXT, ProjID TEXT, M_DocNo TEXT, M_DocName TEXT, RevNo TEXT, RevDate TEXT, RevDes TEXT, RevPreBy TEXT, RevChecBy TEXT, RevAppBy TEXT, RevPrepDate TEXT,RevCheckDate TEXT,RevAppDate TEXT, ChecklistNo TEXT, MtoSta TEXT, Preocur TEXT, PRIMARY KEY(Mto_DocID))')
            // // db.run('CREATE TABLE IF NOT EXISTS MtoMaterialListTable(MatID TEXT, M_DocNo TEXT, fileNo TEXT, DocNo TEXT, TagNo TEXT, AreaNO TEXT, DisNo TEXT, SysNo TEXT, Item_Cat TEXT, Item TEXT, Item_Sh_Des TEXT, Item_Lo_Des TEXT, Mat_Cat TEXT, Material TEXT, Qty TEXT, Unit TEXT, Unit_Weight TEXT, Total_Weight TEXT,ItemPos_X TEXT,ItemPos_Y TEXT,ItemPos_z TEXT , MTO_Source TEXT , Unit_Weight_Ref TEXT, PRIMARY KEY(MatID)  )')
            db.run('CREATE TABLE IF NOT EXISTS MtoDocumentTable(Mto_DocID TEXT, ProjID TEXT, M_DocNo TEXT, M_DocName TEXT, RevNo TEXT, RevDate TEXT, RevDes TEXT, RevPreBy TEXT, RevChecBy TEXT, RevAppBy TEXT, RevPrepDate TEXT,RevCheckDate TEXT,RevAppDate TEXT, ChecklistNo TEXT, MtoSta TEXT, Preocur TEXT, PRIMARY KEY(Mto_DocID))')
            db.run('CREATE TABLE IF NOT EXISTS MtoMaterialListTable(MatID TEXT, M_DocNo TEXT,fileId Text, fileNo TEXT,Drawings_PnPRelPathId TEXT, DocNo TEXT, tagId TEXT, tagNo Text, areaId TEXT , areaName TEXT,DiscId TEXT, DisName TEXT,SysID TEXT, SysName TEXT, Item_Cat TEXT, Item TEXT, Item_Sh_Des TEXT, Item_Lo_Des TEXT, Mat_Cat TEXT, Material TEXT,Sizeone TEXT,Sizetwo TEXT, thkSizeOne TEXT, thkSizeTwo TEXT, schdSizeOne TEXT, schdSizeTwo TEXT,SpecSize TEXT,Length TEXT, Qty TEXT, Unit TEXT, Unit_Weight TEXT, Total_Weight TEXT,ItemPos_X TEXT,ItemPos_Y TEXT,ItemPos_Z TEXT , MTO_Source TEXT , Unit_Weight_Ref TEXT, PRIMARY KEY(MatID)  )')
            db.run('CREATE TABLE IF NOT EXISTS MtoAreaTable(mtoareaId TEXT PRIMARY KEY, area TEXT, name TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS MtoTagTable(mtotagId TEXT, number TEXT, name TEXT, PRIMARY KEY(number))')

            db.run('CREATE TABLE IF NOT EXISTS MtoAreaTagRelTable(mtoareaId TEXT, mtotagId TEXT, areaname TEXT, tagnumber TEXT)')
            // db.run('CREATE TABLE IF NOT EXISTS MtoAreaTagRelTable(mtoareaId TEXT, mtosysId TEXT, areaname TEXT, sysname TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS MtoLineList (mtotagId TEXT,tag TEXT, fluidCode TEXT, lineId TEXT, medium TEXT, lineSizeIn REAL, lineSizeNb REAL,'
                + 'pipingSpec TEXT, insType TEXT, insThickness TEXT, heatTrace TEXT, lineFrom TEXT, lineTo TEXT, pnid TEXT, pipingIso TEXT,'
                + 'pipingStressIso TEXT, maxOpPress REAL, maxOpTemp REAL, dsgnPress REAL, minDsgnTemp REAL, maxDsgnTemp REAL, testPress REAL,'
                + 'testMedium TEXT, testMediumPhase TEXT, massFlow REAL, volFlow REAL, density REAL, velocity REAL, paintSystem TEXT, ndtGroup TEXT,'
                + 'chemCleaning TEXT, pwht TEXT, sysname TEXT, PRIMARY KEY(tag))')
            db.run('CREATE TABLE IF NOT EXISTS MtoSystemTable(mtosysId TEXT PRIMARY KEY, sys TEXT, name TEXT)')

            // ------------------------- P&ID MTO--------------------------------------
            // db.run('CREATE TABLE IF NOT EXISTS MarkingDetailsTable(markId TEXT, rectId TEXT, X TEXT, Y TEXT, width TEXT, height TEXT, absoluteX TEXT, absoluteY TEXT, absoluteWidth TEXT, absoluteHeight TEXT, zoomLevel TEXT, fillColor TEXT, strokeColor TEXT, strokeWidth TEXT, PRIMARY KEY(rectId))')
            db.run('CREATE TABLE IF NOT EXISTS MarkingDetailsTable(markId TEXT,  rectId TEXT ,projectCoords TEXT , viewState TEXT, fillColor TEXT , strokeColor TEXT, strokeWidth REAL, PRIMARY KEY(rectId))')
        }
    });
    databasePath = path.join(selectedFolderPath, 'database.db');

}

// Function to prompt the user to select a folder
function selectFolderAndCreateDatabase(event) {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    }).then(result => {
        const folderPath = result.filePaths[0];
        if (folderPath) {
            console.log(folderPath)
            selectedFolderPath = folderPath;
            console.log("Sent 'data-fetched' event to renderer process");
            mainWindow.webContents.send('select-folder-fetched', selectedFolderPath);

        }
    }).catch(err => {
        console.error("Error selecting folder:", err);
    });
}
function checkAppValidity() {
    // Fetch user data to check validity
    projectdb.all("SELECT * FROM userdetails", (err, rows) => {
        console.log("enter in to it");
        if (err) {
            console.error('Error fetching data from userdetails table:', err.message);
            return;
        }

        const today = moment();
        console.log("line240", rows);

        if (rows.length > 0) {
            rows.forEach(user => {
                const { expiryDate } = user;
                const expiry = moment(expiryDate);

                if (expiry.isBefore(today)) {
                    // Expiry date has passed
                    console.log("Expiry date has passed")
                    mainWindow.webContents.send('appValidity', {
                        valid: false,
                        message: 'Your access has expired. Please renew your subscription.'
                    });
                } else {
                    // Access is still valid
                    console.log("Access is still valid")

                    mainWindow.webContents.send('appValidity', {
                        valid: true,
                        message: 'Your access is valid.'
                    });
                }
            });
        }
        else {
            console.log("enter validity expired")
            mainWindow.webContents.send('appValidity', {
                valid: false,
                message: 'Your access has expired. Please renew your subscription.'
            });
        }

    });
}

function saveUserDataToDB(userData) {
    const { username, email, password, registrationDate, expiryDate } = userData;

    // Check if the email already exists
    projectdb.get(`SELECT email FROM userdetails WHERE email = ?`, [email], function (err, row) {
        if (err) {
            console.error('Error checking email existence:', err.message);
        } else if (row) {
            // Email already exists
            console.log('Email already exists. User data not saved.');
        } else {
            // Email does not exist, proceed with insertion
            projectdb.run(`INSERT INTO userdetails (username, email, password, registrationDate, expiryDate) VALUES (?, ?, ?, ?, ?)`,
                [username, email, password, registrationDate, expiryDate],
                function (err) {
                    if (err) {
                        console.error('Error inserting user data:', err.message);
                    } else {
                        console.log('User data saved to database.');
                        checkAppValidity();
                    }
                }
            );
        }
    });
}
// Function to save user data to the JSON file
function saveUserDataToJSON(userData) {
    const installDatePath = path.join(app.getPath('userData'), 'userdata.json');

    fs.readFile(installDatePath, (err, data) => {
        let userDataList = [];

        if (!err && data.length > 0) {
            try {
                userDataList = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing JSON data:', parseError.message);
                userDataList = [];
            }
        }

        // Check if the email ID already exists
        const emailExists = userDataList.some(item => item.email === userData.email);

        if (emailExists) {
            console.log('Email ID already exists. Data not saved.');
        } else {
            userDataList.push(userData);
            fs.writeFile(installDatePath, JSON.stringify(userDataList, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to JSON file:', err.message);
                } else {
                    console.log('User data saved to JSON file.');
                }
            });
        }
    });
}

function updateExpiryDateInDB(userData) {
    const { email, expiryDate } = userData;

    projectdb.run(
        `UPDATE userdetails SET expiryDate = ? WHERE email = ?`,
        [expiryDate, email],
        function (err) {
            if (err) {
                console.error('Error updating expiry date in database:', err.message);
            } else if (this.changes === 0) {
                console.log('No user found with the provided email. No update performed.');
            } else {
                console.log('Expiry date updated in database.');
                checkAppValidity();
            }
        }
    );
}

function updateExpiryDateInJSON(userData) {
    const installDatePath = path.join(app.getPath('userData'), 'userdata.json');

    fs.readFile(installDatePath, (err, data) => {
        let userDataList = [];

        if (!err && data.length > 0) {
            try {
                userDataList = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing JSON data:', parseError.message);
                userDataList = [];
            }
        }

        const userIndex = userDataList.findIndex(item => item.email === userData.email);

        if (userIndex !== -1) {
            userDataList[userIndex].expiryDate = userData.expiryDate;
            fs.writeFile(installDatePath, JSON.stringify(userDataList, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to JSON file:', err.message);
                } else {
                    console.log('Expiry date updated in JSON file.');
                }
            });
        } else {
            console.log('User email not found in JSON file.');
        }
    });
}

function deleteprojectdb() {
    const dbPath = path.join(app.getPath('userData'), 'project.db');

    // Check if the database file exists
    if (fs.existsSync(dbPath)) {
        // Delete the database file
        fs.unlink(dbPath, (err) => {
            if (err) {
                console.error('Error deleting database file:', err);
            } else {
                console.log('Database file deleted successfully.');
                mainWindow.webContents.send('delete-all-project-response')
            }
        });
    } else {
        console.error('Database file does not exist.');
    }

}
// Function to delete the JSON file
function deleteJsonFile() {
    const jsonPath = path.join(app.getPath('userData'), 'userdata.json');

    if (fs.existsSync(jsonPath)) {
        fs.unlink(jsonPath, (err) => {
            if (err) {
                console.error('Error deleting JSON file:', err);
            } else {
                console.log('JSON file deleted successfully.');
            }
        });
    } else {
        console.error('JSON file does not exist.');
    }
}

function deleteProjectDetails(projectNumber) {
    // Check if the projectdb is initialized
    if (!projectdb) {
        console.error('Database not initialized.');
        return;
    }

    // Prepare the SELECT statement to get the project name
    const selectSql = 'SELECT projectName FROM projectdetails WHERE projectId = ?';

    // Execute the SELECT statement
    projectdb.get(selectSql, [projectNumber], (err, row) => {
        if (err) {
            console.error('Error fetching project name:', err.message);
            return;
        }

        // If the project does not exist
        if (!row) {
            console.error('Project not found.');
            return;
        }

        const projectName = row.projectName;
        console.log(projectName);

        // Prepare the DELETE statement
        const deleteSql = 'DELETE FROM projectdetails WHERE projectId = ?';

        // Execute the DELETE statement
        projectdb.run(deleteSql, projectNumber, function (err) {
            if (err) {
                console.error('Error deleting project details:', err.message);
                return;
            }

            // Check how many rows were affected
            console.log(`Rows deleted: ${this.changes}`);

            // Send the response with the project name
            mainWindow.webContents.send('delete-project-response', projectName);
        });
    });
}

function deleteAllProjectDetails() {
    // Check if the projectdb is initialized
    if (!projectdb) {
        console.error('Database not initialized.');
        return;
    }

    // Prepare the DELETE statement to remove all rows from the table
    const deleteSql = 'DELETE FROM projectdetails';

    // Execute the DELETE statement
    projectdb.run(deleteSql, function (err) {
        if (err) {
            console.error('Error deleting all project details:', err.message);
            return;
        }

        // Check how many rows were affected
        console.log(`Rows deleted: ${this.changes}`);

        // Send the response after deletion
        mainWindow.webContents.send('delete-all-project-response');
    });
}

function allcolumns() {
    const dbPath = path.join(app.getPath('userData'), 'project.db');

    // Open the database
    const db = new sqlite3.Database(dbPath);

    // Query to get column names
    const query = "PRAGMA table_info(projectdetails)";

    // Execute the query
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error getting column names:', err.message);
            return;
        }

        // Extract column names
        const columnNames = rows.map(row => row.name);
        console.log('Column names:', columnNames);


    });
}

function generateCustomID(prefix) {
    const uuid = uuidv4();
    const uniqueID = prefix + uuid.replace(/-/g, '').slice(0, 6);
    return uniqueID;
}

// function insertSizeData(data) {
//     const SizeId = generateCustomID('Si');
//     const sql = `INSERT INTO MtoSpecSizeTable (SizeId ,specId ,ND_inch, OD_mm, THK_mm, SCH, WEIGHT) VALUES (?, ?, ?, ?, ?)`;
//     const stmt = db.prepare(sql);

//     data.forEach(row => {
//         stmt.run([
//             row['ND (inch)'],
//             row['OD (mm)'],
//             row['THK (mm)'],
//             row['SCH'],
//             row['WEIGHT']
//         ], (err) => {
//             if (err) {
//                 console.error('Error inserting size row:', err);
//             }
//         });
//     });
//     stmt.finalize();
// }

// function insertTemppresData(data) {
//     const tempPresId = generateCustomID('Te');
//     const sql = `INSERT INTO MtoSpecTempPresTable (tempPresId ,specId ,Pressure_Barg, Temperature_Deg_C) VALUES (?, ?)`;
//     const stmt = db.prepare(sql);

//     data.forEach(row => {
//         stmt.run([
//             row['Pressure (Barg)'],
//             row['Temperature (Deg. C)']
//         ], (err) => {
//             if (err) {
//                 console.error('Error inserting Temppres row:', err);
//             }
//         });
//     });
//     stmt.finalize();
// }

// function insertSizeData(data, specId) {
//     const sql = `INSERT INTO MtoSpecSizeTable (SizeId, specId, ND_inch, OD_mm, THK_mm, SCH, WEIGHT) 
//                  VALUES (?, ?, ?, ?, ?, ?, ?)`;
//     const stmt = db.prepare(sql);

//     data.forEach(row => {
//         const SizeId = generateCustomID('Si');
//         stmt.run([
//             SizeId,
//             specId,
//             row['ND (inch)'],
//             row['OD (mm)'],
//             row['THK (mm)'],
//             row['SCH'],
//             row['WEIGHT']
//         ], (err) => {
//             if (err) {
//                 console.error('Error inserting size row:', err);
//             }
//         });
//     });
//     stmt.finalize();

// }

function insertSizeData(data, specId) {
    const sql = `INSERT INTO MtoSpecSizeTable (SizeId, specId, ND_inch, OD_mm, THK_mm, SCH, WEIGHT) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const stmt = db.prepare(sql);

    // Find the index of each row type
    const ndInchRow = data.find(row => row[0] === 'ND (inch)');
    const odRow = data.find(row => row[0] === 'OD (mm)');
    const thkRow = data.find(row => row[0] === 'THK (mm)');
    const schRow = data.find(row => row[0] === 'SCH');
    const weightRow = data.find(row => row[0] === 'WEIGHT');

    // For each column (starting from 1 to skip headers)
    for (let i = 1; i < ndInchRow.length; i++) {
        const SizeId = generateCustomID('Si');
        stmt.run([
            SizeId,
            specId,
            ndInchRow[i],
            odRow[i],
            thkRow[i],
            schRow[i],
            weightRow[i]
        ], (err) => {
            if (err) {
                console.error('Error inserting size row:', err);
            }
        });
    }
    stmt.finalize();
}

// function insertTemppresData(data, specId) {
//     const sql = `INSERT INTO MtoSpecTempPresTable (tempPresId, specId, Pressure_Barg, Temperature_Deg_C) 
//                  VALUES (?, ?, ?, ?)`;
//     const stmt = db.prepare(sql);

//     data.forEach(row => {
//         const tempPresId = generateCustomID('Te');
//         stmt.run([
//             tempPresId,
//             specId,
//             row['Pressure (Barg)'],
//             row['Temperature (Deg. C)']
//         ], (err) => {
//             if (err) {
//                 console.error('Error inserting Temppres row:', err);
//             }
//         });
//     });
//     stmt.finalize();

// }

function insertTemppresData(data, specId) {
    const sql = `INSERT INTO MtoSpecTempPresTable (tempPresId, specId, Pressure_Barg, Temperature_Deg_C)
                 VALUES (?, ?, ?, ?)`;
    const stmt = db.prepare(sql);

    const pressureRow = data.find(row => row[0] === 'Pressure (Barg)');
    const temperatureRow = data.find(row => row[0] === 'Temperature (Deg. C)');

    // For each column (starting from 1 to skip headers)
    for (let i = 1; i < pressureRow.length; i++) {
        const tempPresId = generateCustomID('Te');
        stmt.run([
            tempPresId,
            specId,
            pressureRow[i],
            temperatureRow[i]
        ], (err) => {
            if (err) {
                console.error('Error inserting Temppres row:', err);
            }
        });
    }
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

// function insertMaterialsData(data) {

//     const specMaterialId = generateCustomID('Ma');
//     const sql = `INSERT INTO MtoSpecMaterialTable (
//         specMaterialId, specId, ITEM, TYPE, RANGE_FROM, RANGE_TO, GEOMETRIC_STANDARD, EDS_VDS,
//         END_CONN_1, END_CONN_2, MATERIAL_DESCR, MDS, RATING, SCHD, NOTES
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     const stmt = db.prepare(sql);

//     data.forEach(row => {
//         stmt.run([
//             row['ITEM'],
//             row['TYPE'],
//             row['RANGE FROM'],
//             row['RANGE TO'],
//             row['GEOMETRIC STANDARD'],
//             row['EDS/VDS'],
//             row['END CONN #1'],
//             row['END CONN #2'],
//             row['MATERIAL DESCR.'],
//             row['MDS'],
//             row['RATING'],
//             row['SCHD.'],
//             row['NOTES']
//         ], (err) => {
//             if (err) {
//                 console.error('Error inserting materials row:', err);
//             }
//         });
//     });
//     stmt.finalize();
// }

// function insertMaterialsData(data, specId) {
//     const sql = `INSERT INTO MtoSpecMaterialTable (
//         specMaterialId, specId, ITEM, TYPE, RANGE_FROM, RANGE_TO, GEOMETRIC_STANDARD, EDS_VDS,
//         END_CONN_1, END_CONN_2, MATERIAL_DESCR, MDS, RATING, SCHD, NOTES
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     const stmt = db.prepare(sql);

//     data.forEach(row => {
//         const specMaterialId = generateCustomID('Ma');
//         stmt.run([
//             specMaterialId,
//             specId,
//             row['ITEM'],
//             row['TYPE'],
//             row['RANGE FROM'],
//             row['RANGE TO'],
//             row['GEOMETRIC STANDARD'],
//             row['EDS/VDS'],
//             row['END CONN #1'],
//             row['END CONN #2'],
//             row['MATERIAL DESCR.'],
//             row['MDS'],
//             row['RATING'],
//             row['SCHD.'],
//             row['NOTES']
//         ], (err) => {
//             if (err) {
//                 console.error('Error inserting materials row:', err);
//             }
//         });
//     });
//     stmt.finalize();

// }

// function insertMaterialsData(data, specId) {
//     const sql = `INSERT INTO MtoSpecMaterialTable (
//         specMaterialId, specId, ITEM, TYPE, RANGE_FROM, RANGE_TO, GEOMETRIC_STANDARD, EDS_VDS,
//         END_CONN_1, END_CONN_2, MATERIAL_DESCR, MDS, RATING, SCHD, NOTES
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     const stmt = db.prepare(sql);

//     // Skip first 3 rows (headers)
//     data.slice(3).forEach(row => {
//         const specMaterialId = generateCustomID('Ma');
//         stmt.run([
//             specMaterialId,
//             specId,
//             row[0],  // ITEM
//             row[1],  // TYPE
//             row[2],  // RANGE FROM
//             row[3],  // RANGE TO
//             row[4],  // GEOMETRIC STANDARD
//             row[5],  // EDS/VDS
//             row[6],  // END CONN #1
//             row[7],  // END CONN #2
//             row[8],  // MATERIAL DESCR
//             row[9],  // MDS
//             row[10], // RATING
//             row[11], // SCHD
//             row[12]  // NOTES
//         ], (err) => {
//             if (err) {
//                 console.error('Error inserting materials row:', err);
//             }
//         });
//     });
//     stmt.finalize();
// }

// function insertMaterialsData(data, specId) {
//     const sql = `INSERT INTO MtoSpecMaterialTable (
//         specMaterialId, specId, itemType, fittingType, size1, size2, 
//         GeometricStd, EDS_VDS, endConn, materialDescrip, MDS, rating, 
//         SCHD, Notes, remarks
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//     const stmt = db.prepare(sql);

//     // No need to slice since data is now the combined array
//     data.forEach(row => {
//         const specMaterialId = generateCustomID('Ma');
//         stmt.run([
//             specMaterialId,
//             specId,
//             row.itemType,          
//             row.fittingType,        
//             row.size1,              
//             row.size2,             
//             row.geometricStandard,  
//             row.edsVds,           
//             row.endConn,           
//             row.materialDescr,     
//             row.mds,               
//             row.rating,           
//             row.schd,             
//             row.notes,             
//             null                   // remarks (if needed)
//         ], (err) => {
//             if (err) {
//                 console.error('Error inserting materials row:', err);
//             }
//         });
//     });
//     stmt.finalize();
// }

function insertMaterialsData(data, specId) {
    const sql = `INSERT INTO MtoSpecMaterialTable (
        specMaterialId, specId, itemType, fittingType, size1, size2,
        GeometricStd, EDS_VDS, endConn, materialDescrip, MDS, rating,
        SCHD, Notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const stmt = db.prepare(sql);

    data.forEach(row => {

        const specMaterialId = generateCustomID('Ma');
        stmt.run([
            specMaterialId,
            specId,
            row.itemType,
            row.fittingType,
            row.size1,
            row.size2,
            row.geometricStandard, // Matches GeometricStd in DB
            row.edsVds,          // Matches EDS_VDS in DB
            row.endConn,
            row.materialDescr,    // Matches materialDescrip in DB
            row.mds,             // Matches MDS in DB
            row.rating,
            row.schd,            // Matches SCHD in DB
            row.notes
        ], (err) => {
            if (err) {
                console.error('Error inserting materials row:', err);
                console.error('Failed row:', row);
                console.error('Error details:', err.message);
            }
        });
    });
    stmt.finalize();
}


app.whenReady().then(() => {
    // deleteprojectdb();
    // deleteJsonFile();
    // allcolumns();
    createMainWindow();
    createProjectDatabase();

    const wss = new WebSocket.Server({ port: 3000 });
    wss.on('connection', ws => {
        console.log('WebSocket connection established');
        // Send the application ID to the client
        ws.send(JSON.stringify({ type: 'appId', appId: applicationId }));

        ws.on('message', message => {
            console.log('Received message from webpage:', message);

            try {
                const data = JSON.parse(message);

                switch (data.type) {
                    case 'logindata':
                        console.log('User data:', data.user);
                        saveUserDataToDB(data.user);
                        saveUserDataToJSON(data.user);
                        break;
                    case 'update':
                        console.log('Update:', data.user);
                        updateExpiryDateInDB(data.user);
                        updateExpiryDateInJSON(data.user);

                        break;
                    default:
                        console.log('Unknown data type');
                        break;
                }
            } catch (e) {
                console.error('Failed to parse message:', e);
            }
        });
    });

    ipcMain.on('open-webpage-pods', (event, url) => {
        console.log(url)
        const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'; // Adjust this path as needed
        require('child_process').execFile(chromePath, [url]);
    })

    ipcMain.on('select-folder', () => {
        console.log("Received 'select-folder' request from renderer process");
        selectFolderAndCreateDatabase();
    });

    ipcMain.on('open-project', (event, projectNumber) => {
        console.log(projectNumber)
        console.log(`Received 'open-project' request for project with ID: ${projectNumber}`);

        // Check if the project database is initialized
        if (!projectdb) {
            console.error('Project database not initialized.');
            return;
        }

        // Query the project database to check if the project with the given ID exists
        projectdb.get('SELECT * FROM projectdetails WHERE projectNumber = ?', projectNumber, (err, row) => {
            if (err) {
                console.error('Error querying project database:', err.message);
                return;
            }

            if (row) {
                console.log(row);
                selectedFolderPath = row.projectPath;
                mainWindow.webContents.send('asset-id-project', row.asset)
                mainWindow.webContents.send('all-project-details', row);
                console.log(`Project path retrieved from database: ${selectedFolderPath}`);

                // Construct the path to the database file
                databasePath = path.join(selectedFolderPath, 'database.db');
                console.log(`Opening database file: ${databasePath}`);

                // Open the database file
                const db = new sqlite3.Database(databasePath, (err) => {
                    if (err) {
                        console.error('Error opening database:', err.message);
                        return;
                    }
                    db.all("SELECT * FROM projectdetails", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }
                        console.log("project Details", rows)

                        console.log('Data in the projectdetails table:', rows);
                        // mainWindow.webContents.send('all-area-fetched', rows);
                    });

                    // Retrieve all data from the Tree table
                    db.all("SELECT * FROM Tree", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the Tree table:', rows);
                        mainWindow.webContents.send('all-area-fetched', rows);
                    });

                    db.all("SELECT * FROM Tree", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-disc-fetched', rows);
                    });
                    db.all("SELECT * FROM Tree", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-sys-fetched', rows);
                    });
                    db.all("SELECT * FROM Tree", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-tree-tags-fetched', rows);
                    });

                    db.all("SELECT * FROM Tree", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-tags-under-sys-fetched', rows);
                    });

                    db.all("SELECT * FROM Tags", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-tags-fetched', rows);
                    });

                    db.all("SELECT * FROM UnassignedModels", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-unassignedModels', rows);
                    });
                    db.all("SELECT * FROM CommentStatus", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }
                        console.log("all-status", rows)
                        mainWindow.webContents.send('all-status', rows);
                    });
                    db.all("SELECT * FROM UserTagInfoFieldUnits", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from UserTagInfoFieldUnits table:', err.message);
                            return;
                        }
                        console.log("all-fields-user-defined", rows);
                        mainWindow.webContents.send('all-fields-user-defined', rows);
                    });

                    db.all("SELECT * FROM FileBoundingTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-files-table', rows);
                    });

                    db.all("SELECT * FROM BoundingboxTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-mesh-table', rows);
                    });

                    db.all("SELECT * FROM Documents", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-document-fetched', rows);
                    });

                    db.all("SELECT * FROM LineList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-lines-fetched', rows);
                    });
                    db.all("SELECT * FROM EquipmentList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-equipement-fetched', rows);
                    });

                    db.all("SELECT * FROM CommentTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }
                        console.log(rows)
                        mainWindow.webContents.send('all-comments', rows);
                    });
                    // Fetch updated data from the LineList table
                    db.all("SELECT * FROM TagInfo", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from tagInfo table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-taginfo-fetched', rows);
                    });
                    db.all("SELECT * FROM Views", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Views table:', err.message);
                            return;
                        }
                        console.log("all-Views", rows);
                        mainWindow.webContents.send('all-views', rows);
                    });
                    db.all("SELECT * FROM Areatable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Areatable:', err.message);
                            return;
                        }

                        console.log('Data in the Areatable:', rows);
                        event.sender.send('all-area-table-fetched', rows);
                    });
                    db.all("SELECT * FROM Disctable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Disctable:', err.message);
                            return;
                        }

                        console.log('Data in the Disctable:', rows);
                        event.sender.send('all-disc-table-fetched', rows);
                    });
                    db.all("SELECT * FROM Systable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Systable:', err.message);
                            return;
                        }

                        console.log('Data in the Systable:', rows);
                        event.sender.send('all-sys-table-fetched', rows);
                    });

                    db.all("SELECT * FROM Documents", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the Documents table:', rows);
                        mainWindow.webContents.send('all-docs-fetched', rows);
                    });

                    db.all("SELECT * FROM Documents WHERE type = ?", ["iXB"], (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Documents table:', err.message);
                            return;
                        }

                        console.log('Data in the Documents table:', rows);
                        mainWindow.webContents.send('spid-docs-fetched', rows);
                    });

                    // ---------PID--------------------//

                    db.all("SELECT * FROM Documents", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the Documents table:', rows);
                        mainWindow.webContents.send('all-docs-fetched', rows);
                    });

                    db.all("SELECT * FROM Documents WHERE type = ?", ["iXB"], (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Documents table:', err.message);
                            return;
                        }

                        console.log('Data in the Documents table:', rows);
                        mainWindow.webContents.send('spid-docs-fetched', rows);
                    });
                    db.all("SELECT * FROM Elements", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the Elements table:', rows);
                        mainWindow.webContents.send('all-elements-fetched', rows);
                    });
                    // db.all("SELECT * FROM Area", (err, rows) => {
                    //     if (err) {
                    //         console.error('Error fetching data from Tree table:', err.message);
                    //         return;
                    //     }

                    //     console.log('Data in the Area table:', rows);
                    //     mainWindow.webContents.send('all-area-fetched', rows);
                    // });
                    db.all("SELECT * FROM Flags", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the Flags table:', rows);
                        mainWindow.webContents.send('all-flags-fetched', rows);
                    });

                    db.all("SELECT * FROM MtoBranchTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from MtoBranchTable table:', err.message);
                            return;
                        }
                        mainWindow.webContents.send('branch-table-response', rows);
                    });
                    db.all("SELECT * FROM MtoBranchTableData", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from MtoBranchTableData table:', err.message);
                            return;
                        }
                        mainWindow.webContents.send('branch-table-data-response', rows);
                    });
                    db.all("SELECT * FROM MtoSpecSizeTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from MtoBranchTable table:', err.message);
                            return;
                        }
                        console.log('Data in the SpecSize table:', rows);
                        mainWindow.webContents.send('specsize-table-response', rows);

                    });
                    db.all("SELECT * FROM MtoSpecDetTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from MtoSpecDetTable table:', err.message);
                            return;
                        }
                        console.log('Data in the MtoSpecDetTable table:', rows);
                        mainWindow.webContents.send('specdet-detail-response', rows);

                    });
                    db.all("SELECT * FROM MtoSpecTempPresTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from MtoBranchTable table:', err.message);
                            return;
                        }
                        console.log('Data in the SpecTemp table:', rows);
                        mainWindow.webContents.send('spectemp-table-response', rows);
                    });
                    db.all("SELECT * FROM MtoSpecTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from MtoSpecTable table:', err.message);
                            return;
                        }
                        console.log('Data in the MtoSpecTable table:', rows);
                        mainWindow.webContents.send('specdet-table-response', rows);
                    });
                    db.all("SELECT * FROM MtoSpecMaterialTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from MtoSpecMaterialTable table:', err.message);
                            return;
                        }
                        console.log('Data in the MtoSpecMaterialTable table:', rows);
                        mainWindow.webContents.send('specmat-table-response', rows);
                    });
                    db.all("SELECT * FROM MtoCustomTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the MtoCustomTable table:', rows);
                        mainWindow.webContents.send('custom-spec-res', rows);
                    });
                    db.all("SELECT * FROM MtoDocumentTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the MtoDocumentTable table:', rows);
                        mainWindow.webContents.send('save-doc-mto', rows);
                    });
                    db.all("SELECT * FROM MtoAreaTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from MtoAreaTable:', err.message);
                            return;
                        }

                        console.log('Data in the MtoAreaTable table:', rows);
                        mainWindow.webContents.send('area-save-mto', rows);
                    });

                    db.all("SELECT * FROM MtoTagTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from MtoTagTable:', err.message);
                            return;
                        }

                        console.log('Data in the MtoTagTable table:', rows);
                        mainWindow.webContents.send('tag-save-mto', rows);
                    });

                    db.all("SELECT * FROM MtoLineList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from MtoLineList:', err.message);
                            return;
                        }

                        console.log('Data in the MtoLineList table:', rows);
                        mainWindow.webContents.send('linelist-save-mto', rows);
                    });
                    db.all("SELECT * FROM MtoAreaTagRelTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the MtoAreaTagRelTable table:', rows);
                        mainWindow.webContents.send('mtoline-area-save', rows);
                    });
                    db.all("SELECT * FROM MtoMaterialListTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the MtoMaterialListTable table:', rows);
                        mainWindow.webContents.send('material-data-save', rows);
                    });
                    db.all("SELECT * FROM MarkingDetailsTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the MarkingDetailsTable table:', rows);
                        mainWindow.webContents.send('group-markings-saved', rows);
                    });

                });
            } else {
                console.error(`Project with ID ${projectNumber} not found.`);
            }
        });


    });

    ipcMain.on('fetch-data', (event) => {
        console.log("Received 'fetch-data' request from renderer process");
        if (!projectdb) {
            console.error('Database not initialized.');
            return;
        }
        // Query database for user data
        projectdb.all('SELECT * FROM projectdetails', (err, rows) => {
            if (err) {
                console.error('Error fetching data:', err.message);
                return;
            }
            console.log("Fetched data:", rows);
            // Send fetched data to renderer process
            event.sender.send('data-fetched', rows);
            console.log("Sent 'data-fetched' event to renderer process");
        });
    });

    ipcMain.on('save-data', (event, data) => {
        if (!projectdb) {
            console.error('Database not initialized.');
            return;
        }

        const projectFolderName = data.projectNumber;
        const projectFolderPath = path.join(selectedFolderPath, projectFolderName);
        const projectId = generateCustomID('P');

        try {
            // Create a new folder for the project if it doesn't exist
            if (!fs.existsSync(projectFolderPath)) {
                fs.mkdirSync(projectFolderPath);
                console.log(`Created folder: ${projectFolderPath}`);
            }
            selectedFolderPath = projectFolderPath;

            // Set the database path to the newly created project folder
            const dbPath = path.join(projectFolderPath, 'database.db');
            createDatabase(dbPath);

            // Check if projectNumber already exists in the database
            projectdb.get('SELECT projectId FROM projectdetails WHERE projectNumber = ?', [data.projectNumber], (err, row) => {
                if (err) {
                    console.error('Error checking project number:', err.message);
                    event.reply('save-data-response', { success: false, message: 'Error saving project' });
                    return;
                }

                if (row) {
                    // Project number already exists
                    mainWindow.webContents.send('save-data-response', { success: false, message: 'Project number already exists' });
                    console.log('Project number already exists');
                    return;
                }

                // Insert project details into the database
                projectdb.run(
                    `INSERT INTO projectdetails (projectId, projectNumber, projectName, projectDescription, projectPath) VALUES (?, ?, ?, ?, ?)`,
                    [projectId, data.projectNumber, data.projectName, data.projectDescription, selectedFolderPath],
                    function (err) {
                        if (err) {
                            console.error('Error inserting data:', err.message);
                            event.reply('save-data-response', { success: false, message: 'Error inserting data into database' });
                        } else {
                            console.log(`Row inserted with ID: ${this.lastID}`);
                            mainWindow.webContents.send('save-data-response', {
                                success: true,
                                message: 'Project saved successfully',
                                project: {
                                    projectId: projectId,
                                    projectNumber: data.projectNumber,
                                    projectName: data.projectName,
                                    projectDescription: data.projectDescription,
                                    projectPath: selectedFolderPath
                                }
                            });

                            const projectDetails = {
                                projectId: projectId,
                                projectNumber: data.projectNumber,
                                projectName: data.projectName,
                                projectDescription: data.projectDescription,
                                projectPath: selectedFolderPath
                            };

                            const jsonFilePath = path.join(projectFolderPath, 'project_details.json');
                            fs.writeFileSync(jsonFilePath, JSON.stringify(projectDetails, null, 2));
                            console.log(`Project details written to: ${jsonFilePath}`);

                            initializeProjectDatabase(dbPath, mainWindow);
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Error in save-data handler:', error);
            event.reply('save-data-response', { success: false, message: 'Error saving project' });
        }
    });

    function initializeProjectDatabase(databasePath, mainWindow) {
        const projectDb = new sqlite3.Database(databasePath, async (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            console.log("databasePath", databasePath);

            const statuses = [
                { number: '1', statusname: 'open', color: '#ff0000' },
                { number: '2', statusname: 'closed', color: '#00ff00' }
            ];

            const userDefinedFields = Array.from({ length: 50 }, (_, i) => ({
                taginfo: `Taginfo${i + 1}`,
                taginfounit: `Taginfounit${i + 1}`,
                tagcheck: 'checked'
            }));

            const runQuery = (query, params = []) => {
                return new Promise((resolve, reject) => {
                    projectDb.run(query, params, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            };

            const selectQuery = (query) => {
                return new Promise((resolve, reject) => {
                    projectDb.all(query, (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows);
                    });
                });
            };

            try {
                for (let status of statuses) {
                    await runQuery(`INSERT OR IGNORE INTO CommentStatus (number, statusname, color) VALUES (?, ?, ?)`, [status.number, status.statusname, status.color]);
                }

                let allStatuses = await selectQuery("SELECT * FROM CommentStatus");
                mainWindow.webContents.send('all-status', allStatuses);

                for (let { taginfo, taginfounit, tagcheck } of userDefinedFields) {

                    // Insert into UserTagInfoFieldUnits table
                    await runQuery(
                        `INSERT OR IGNORE INTO UserTagInfoFieldUnits (field, unit,statuscheck) VALUES (?, ?,?)`,
                        [taginfo, taginfounit, tagcheck]
                    );
                }

                // Retrieve all inserted fields
                let allUserDefinedFields = await selectQuery("SELECT * FROM UserTagInfoFieldUnits");
                mainWindow.webContents.send('all-fields-user-defined', allUserDefinedFields);

            } catch (error) {
                console.error('Error:', error.message);
            }
        });
    }

    ipcMain.on('save-code-data', (event, data) => {
        console.log("Received request to save area");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Insert data into the Tree table of the project's database
            projectDb.run(`INSERT INTO Tree (area, name) VALUES (?, ?)`, [data.code, data.name], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with ID: ${this.lastID}`);
                mainWindow.webContents.send('area-added-success')
            });
            projectDb.all("SELECT * FROM Tree", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Tree table:', rows);
                mainWindow.webContents.send('all-area-fetched', rows);
            });
        });

    });

    ipcMain.on('save-disc-data', (event, data) => {
        console.log("Received request to save disc");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Insert data into the Tree table of the project's database
            projectDb.run(`INSERT INTO Tree (area, disc, name) VALUES (?,?, ?)`, [data.areaname, data.code, data.name], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with ID: ${this.lastID}`);
            });
            projectDb.all("SELECT * FROM Tree", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Tree table:', rows);
                mainWindow.webContents.send('all-disc-fetched', rows);
            });
        });
    });

    ipcMain.on('save-sys-data', (event, data) => {
        console.log("Received request to save sys");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Insert data into the Tree table of the project's database
            projectDb.run(`INSERT INTO Tree (area,disc, sys,name) VALUES (?,?,?,?)`, [data.areaname, data.discname, data.code, data.name], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with ID: ${this.lastID}`);
            });
            projectDb.all("SELECT * FROM Tree", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Tree table:', rows);
                mainWindow.webContents.send('all-sys-fetched', rows);
            });
            projectDb.all("SELECT * FROM Tree", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Tree table:', rows);
                mainWindow.webContents.send('all-tree-tags-fetched', rows);
            });
            projectDb.all("SELECT * FROM Tags", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Tag table:', rows);
                mainWindow.webContents.send('all-tags-fetched', rows);
            });
        });
    });

    ipcMain.on('save-tag-data', (event, data) => {
        console.log("Received request to save tag");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            projectDb.get(`SELECT * FROM Tags WHERE number = ?`, [data.tagNo], (err, existingTag) => {
                if (err) {
                    console.error('Error checking for existing tag:', err.message);
                    return;
                }

                if (existingTag) {
                    console.error(`Tag with number ${data.tagNo} already exists. Alert or handle accordingly.`);
                    event.reply("tag-exists", { success: true, message: `Tag number ${data.tagNo} already exist` })
                    return;
                }
                const TagId = generateCustomID('T')
                // Insert data into the Tag table of the project's database
                projectDb.run(`INSERT INTO Tags (tagId,number, name,parenttag, type, filename) VALUES (?,?,?,?,?,?)`, [TagId, data.tagNo, data.tagname, data.parentTag, data.tagtype, data.fileName], function (err) {
                    if (err) {
                        console.error('Error inserting data:', err.message);
                        return;
                    }
                    console.log(`Row inserted with tag number: ${data.tagNo},${data.tagname},${data.tagtype},${data.fileName}`);
                    projectDb.all("SELECT * FROM Tags", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the Tag table:', rows);
                        mainWindow.webContents.send('all-tags-fetched', rows);
                    });
                });

                projectDb.run(`INSERT INTO TagInfo (tagId,tag,type) VALUES (?,?,?)`, [TagId, data.tagNo, data.tagtype], function (err) {
                    if (err) {
                        console.error('Error inserting data:', err.message);
                        return;
                    }
                    console.log(`Row inserted with tag number: ${data.TagId},${data.tagtype}`);
                    projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from tagInfo table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-taginfo-fetched', rows);
                    });
                });

                // Based on tagtype, insert data into either LineList or EquipmentList table
                if (data.tagtype === 'Line') {
                    projectDb.run(`INSERT INTO LineList (tagId,tag) VALUES (?,?)`, [TagId, data.tagNo], function (err) {
                        if (err) {
                            console.error('Error inserting data into LineList table:', err.message);
                            return;
                        }
                        console.log(`Row inserted into LineList table with filename: ${data.tagNo}`);
                        projectDb.all("SELECT * FROM LineList", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                                return;
                            }

                            console.log('Data in the Line table:', rows);
                            mainWindow.webContents.send('all-lines-fetched', rows);
                        });
                    });
                }
                else if (data.tagtype === 'Equipment') {

                    projectDb.run(`INSERT INTO EquipmentList (tagId,tag) VALUES (?,?)`, [TagId, data.tagNo], function (err) {
                        if (err) {
                            console.error('Error inserting data into EquipmentList table:', err.message);
                            return;
                        }
                        console.log(`Row inserted into EquipmentList table with filename: ${data.tagNo}`);
                        projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                                return;
                            }

                            console.log('Data in the Equipment table:', rows);
                            mainWindow.webContents.send('all-equipement-fetched', rows);
                        });
                    });
                } else {
                    console.error('Invalid tag type:', data.tagtype);
                }
                // Insert data into the BoundingboxTable
                data.fileTable.forEach((fileData) => {
                    projectDb.run(`INSERT INTO FileBoundingTable (fileid,TagId,fileName,coOrdinateX , coOrdinateY, coOrdinateZ, maxbbX , maxbbY ,maxbbZ ,minbbX ,minbbY ,minbbZ ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, [
                        fileData.fileid,
                        TagId,
                        fileData.fileName,
                        fileData.offset.x,
                        fileData.offset.y,
                        fileData.offset.z,
                        fileData.maxbbobject.x,
                        fileData.maxbbobject.y,
                        fileData.maxbbobject.z,
                        fileData.minbbobject.x,
                        fileData.minbbobject.y,
                        fileData.minbbobject.z
                    ], function (err) {
                        if (err) {
                            console.error('Error inserting data into FileBoundingTable:', err.message);
                            return;
                        }
                        console.log(`Row inserted into FileBoundingTable for file ${fileData.fileid}`);
                    });
                });

                data.meshtable.forEach((meshData) => {
                    const meshid = generateCustomID('M');
                    projectDb.run(`INSERT INTO BoundingboxTable (fileid, meshid,TagId, fileName, meshName, tagNo, coOrdinateX, coOrdinateY, coOrdinateZ, maxbbX, maxbbY, maxbbZ, minbbX, minbbY, minbbZ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
                        meshData.fileid,
                        meshid,
                        TagId,
                        meshData.fileName,
                        meshData.meshName,
                        meshData.tagNo,
                        meshData.offset.x,
                        meshData.offset.y,
                        meshData.offset.z,
                        meshData.maxbb.x,
                        meshData.maxbb.y,
                        meshData.maxbb.z,
                        meshData.minbb.x,
                        meshData.minbb.y,
                        meshData.minbb.z
                    ], function (err) {
                        if (err) {
                            console.error('Error inserting data into BoundingboxTable:', err.message);
                            return;
                        }
                        console.log(`Row inserted into BoundingboxTable for mesh ${meshData.meshName}`);
                    });
                });
                console.log("selectedFolderPath", selectedFolderPath);



                const tagsFolderPath = path.join(selectedFolderPath, 'Tags');
                if (!fs.existsSync(tagsFolderPath)) {
                    fs.mkdirSync(tagsFolderPath);
                    console.log('Tags folder created.');
                }
                if (data.filePath) {
                    // Move the file into the 'Tags' folder

                    const fileToMove = data.filePath;
                    const filename = path.basename(fileToMove);
                    const destinationPath = path.join(tagsFolderPath, filename);
                    if (!fs.existsSync(destinationPath)) {
                        fs.copyFileSync(fileToMove, destinationPath);
                        console.log(`File '${filename}' moved to 'Tags' folder.`);
                    } else {
                        console.log(`File '${filename}' already exists in 'Tags' folder. Skipping move operation.`);
                    }

                }
                event.reply('save-tag-complete', { success: true, message: `Tag ${data.tagNo} saved successfully.` });
            })
        });
    });

    ipcMain.on('save-tag-sys-data', (event, data) => {
        console.log("Received request to save tag to each system");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.serialize(() => {
                // Begin a transaction for batch insert
                projectDb.run('BEGIN TRANSACTION', (err) => {
                    if (err) {
                        console.error('Error beginning transaction:', err.message);
                        return;
                    }

                    // Iterate over each tag data and insert into the database
                    data.forEach(tagData => {
                        projectDb.run(`INSERT INTO Tree (area, disc, sys, tag, name) VALUES (?, ?, ?, ?, ?)`,
                            [tagData.areaname, tagData.discname, tagData.sysname, tagData.tagNo, tagData.tagName],
                            function (err) {
                                if (err) {
                                    console.error('Error inserting data:', err.message);
                                    return;
                                }
                                console.log(`Row inserted with ID: ${tagData.tagNo}, ${tagData.areaname}, ${tagData.discname}, ${tagData.sysname}, ${tagData.tagName}`);
                            });
                    });

                    // Commit the transaction
                    projectDb.run('COMMIT', (err) => {
                        if (err) {
                            console.error('Error committing transaction:', err.message);
                            return;
                        }
                        console.log('Transaction committed successfully.');

                        // Fetch all data from the Tree table and send it back to the renderer process
                        projectDb.all("SELECT * FROM Tree", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                                return;
                            }

                            console.log('Data in the Tree table:', rows);
                            mainWindow.webContents.send('all-tags-under-sys-fetched', rows);
                        });
                    });
                });
            });
        });
    });

    ipcMain.on('save-token', (event, data) => {
        console.log("Received request to save token");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Insert data into the Tree table of the project's database
            projectDb.run(`INSERT INTO assignToken (projectNo, projectname, token, userName, userId) VALUES (?,?,?,?,?)`, [data.projectNo, data.projectName, data.token, data.username, data.userid], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with ID: ${data.token}`);
                event.reply('token-saved', { success: true, message: 'Token assigned successfully' })
            });
        });

        if (projectdBPath) {
            const projectdb = new sqlite3.Database(projectdBPath, (err) => {
                if (err) {
                    console.error('Error opening project database:', err.message);
                    return;
                }
                projectdb.run(`UPDATE projectdetails SET TokenNumber = ?WHERE projectNumber = ? AND projectName = ?`,
                    [data.token, data.projectNo, data.projectName],
                    function (err) {
                        if (err) {
                            console.error('Error updating data:', err.message);
                            return;
                        }
                        console.log(`Rows updated: ${this.changes}`);
                        mainWindow.send('send-back-token', data.token,)
                    });
            });
        }
        const jsonFilePath = path.join(selectedFolderPath, 'project_details.json');
        fs.readFile(jsonFilePath, 'utf8', (err, jsonString) => {
            if (err) {
                console.error('Error reading JSON file:', err.message);
                return;
            }

            try {
                const jsonData = JSON.parse(jsonString);

                // Check if the 'tokens' field exists, if not create it as an array
                jsonData.token = data.token;

                fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing to JSON file:', err.message);
                        return;
                    }
                    console.log('JSON file updated successfully');
                });
            } catch (err) {
                console.error('Error parsing JSON file:', err.message);
            }
        });
    });

    ipcMain.on('remove-tag', (event, { area, disc, sys, tag }) => {


        console.log("Received request to remove tag with ID:", tag);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Delete the row with the given tagId
            projectDb.run('DELETE FROM Tree WHERE area = ? AND disc = ? AND sys = ? AND tag = ?', [area, disc, sys, tag], function (err) {
                if (err) {
                    console.error('Error deleting data:', err.message);
                    return;
                }
                console.log(`Row with tagId ${tag} deleted successfully.`);
            });

            projectDb.all("SELECT * FROM Tree", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                mainWindow.webContents.send('all-tags-under-sys-fetched', rows);
            });

        });
    });

    ipcMain.on('remove-system', (event, { area, disc, sys }) => {
        console.log("Received request to remove tag with ID:", sys);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Delete the row with the given tagId
            projectDb.run('DELETE FROM Tree WHERE area = ? AND disc = ? AND sys = ?', [area, disc, sys], function (err) {
                if (err) {
                    console.error('Error deleting data:', err.message);
                    return;
                }
                console.log(`Row with tagId ${sys} deleted successfully.`);
            });

            projectDb.all("SELECT * FROM Tree", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Tree table:', rows);
                mainWindow.webContents.send('all-sys-fetched', rows);
            });

        });
    });

    ipcMain.on('remove-disc', (event, { area, disc }) => {
        console.log("Received request to remove discipline with area:", area, "and disc:", disc);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Delete the row with the given tagId
            projectDb.run('DELETE FROM Tree WHERE area = ? AND disc = ?', [area, disc], function (err) {
                if (err) {
                    console.error('Error deleting data:', err.message);
                    return;
                }
                console.log(`Row with tagId ${disc} deleted successfully.`);
            });

            projectDb.all("SELECT * FROM Tree", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Tree table:', rows);
                mainWindow.webContents.send('all-disc-fetched', rows);
            });

        });
    });

    ipcMain.on('remove-area', (event, areaId) => {
        console.log("Received request to remove tag with ID:", areaId);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.run('DELETE FROM Tree WHERE area = ?', [areaId], function (err) {
                if (err) {
                    console.error('Error deleting data:', err.message);
                    return;
                }
                console.log(`Row with tagId ${areaId} deleted successfully.`);
            });

            projectDb.all("SELECT * FROM Tree", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Tree table:', rows);
                mainWindow.webContents.send('all-area-fetched', rows);
            });

        });
    });

    ipcMain.on('save-unassigned-data', (event, data) => {
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        console.log("Received request to save unassigned_model");
        console.log(data);

        // Ensure the unassigned models folder exists
        const unassignedFolderPath = path.join(selectedFolderPath, 'unassigned_models');
        if (!fs.existsSync(unassignedFolderPath)) {
            fs.mkdirSync(unassignedFolderPath);
            console.log('unassigned_models folder created.');
        }

        const revisedFolderPath = path.join(selectedFolderPath, 'Revised');
        if (!fs.existsSync(revisedFolderPath)) {
            fs.mkdirSync(revisedFolderPath);
            console.log('revised_models folder created.');
        }

        const tagFolderPath = path.join(selectedFolderPath, 'Tags');
        if (!fs.existsSync(tagFolderPath)) {
            fs.mkdirSync(tagFolderPath);
            console.log('tag_models folder created.');
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Mapping of filename to unique number
            const filenameToUniqueNumberMap = {};

            // Process the files
            let fileSavePromises = data.fileNamePath.map((file) => {
                return new Promise((resolve, reject) => {
                    const fileToMove = file.path;
                    const filename = path.basename(fileToMove);

                    const filePath = path.join(unassignedFolderPath, filename);
                    if (!fs.existsSync(filePath)) {
                        fs.copyFileSync(fileToMove, filePath);
                        console.log(`File '${filename}' copied to 'unassigned_models' folder.`);
                    } else {
                        console.log(`File '${filename}' already exists in 'unassigned_models' folder. Skipping copy operation.`);
                        return resolve(); // Skip processing this file
                    }

                    // Generate a unique number
                    const uniqueNumber = generateCustomID('T');
                    filenameToUniqueNumberMap[filename] = uniqueNumber;

                    // Check if the filename already exists in the database
                    projectDb.get('SELECT * FROM UnassignedModels WHERE filename = ?', [filename], (err, row) => {
                        if (err) {
                            console.error('Error checking filename in database:', err.message);
                            return reject(err);
                        }

                        if (row) {
                            console.log(`Filename ${filename} already exists in the database. Skipping insertion.`);
                            return resolve();
                        } else {
                            // Insert file details into the database
                            projectDb.run(
                                'INSERT INTO UnassignedModels (number, filename) VALUES (?, ?)',
                                [uniqueNumber, filename],
                                (err) => {
                                    if (err) {
                                        console.error(`Error inserting file ${uniqueNumber} into database:`, err);
                                        return reject(err);
                                    } else {
                                        console.log(`File ${uniqueNumber} inserted into database`);
                                        return resolve();
                                    }
                                }
                            );
                        }
                    });
                });
            });

            // Process fileTable data
            let fileTablePromises = data.fileTable.map((fileData) => {
                return new Promise((resolve, reject) => {
                    const uniqueNumber = filenameToUniqueNumberMap[fileData.objectName] || generateCustomID('F');
                    filenameToUniqueNumberMap[fileData.objectName] = uniqueNumber;

                    // Check if the filename already exists in the FileBoundingTable
                    projectDb.get('SELECT * FROM FileBoundingTable WHERE fileName = ?', [fileData.objectName], (err, row) => {
                        if (err) {
                            console.error('Error checking filename in FileBoundingTable:', err.message);
                            return reject(err);
                        }

                        if (row) {
                            console.log(`Filename ${fileData.objectName} already exists in the FileBoundingTable. Skipping insertion.`);
                            return resolve();
                        } else {
                            // Insert the data into the FileBoundingTable if filename doesn't exist
                            projectDb.run(
                                `INSERT INTO FileBoundingTable (fileid, tagId, fileName, coOrdinateX, coOrdinateY, coOrdinateZ, maxbbX, maxbbY, maxbbZ, minbbX, minbbY, minbbZ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
                                [
                                    fileData.fileid,
                                    uniqueNumber,
                                    fileData.objectName,
                                    fileData.offset.x,
                                    fileData.offset.y,
                                    fileData.offset.z,
                                    fileData.maxbbobject.x,
                                    fileData.maxbbobject.y,
                                    fileData.maxbbobject.z,
                                    fileData.minbbobject.x,
                                    fileData.minbbobject.y,
                                    fileData.minbbobject.z
                                ],
                                (err) => {
                                    if (err) {
                                        console.error('Error inserting data into FileBoundingTable:', err.message);
                                        return reject(err);
                                    }
                                    console.log(`Row inserted into FileBoundingTable for file ${fileData.objectName}`);
                                    return resolve();
                                }
                            );
                        }
                    });
                });
            });

            // Process meshtable data
            let meshTablePromises = data.meshtable.map((meshData) => {
                return new Promise((resolve, reject) => {
                    const uniqueNumber = filenameToUniqueNumberMap[meshData.fileName] || generateCustomID('M');
                    filenameToUniqueNumberMap[meshData.fileName] = uniqueNumber;

                    // Check if the filename already exists in the BoundingboxTable
                    projectDb.get('SELECT * FROM BoundingboxTable WHERE fileName = ?', [meshData.fileName], (err, row) => {
                        if (err) {
                            console.error('Error checking filename in BoundingboxTable:', err.message);
                            return reject(err);
                        }

                        if (row) {
                            console.log(`Filename ${meshData.fileName} already exists in the BoundingboxTable. Skipping insertion.`);
                            return resolve();
                        } else {
                            // Insert the data into the BoundingboxTable if filename doesn't exist
                            const meshid = generateCustomID('M');
                            projectDb.run(
                                `INSERT INTO BoundingboxTable (fileid, meshid, tagId, fileName, meshName, tagNo, coOrdinateX, coOrdinateY, coOrdinateZ, maxbbX, maxbbY, maxbbZ, minbbX, minbbY, minbbZ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                                [
                                    meshData.fileid,
                                    meshid,
                                    uniqueNumber,
                                    meshData.fileName,
                                    meshData.meshName,
                                    meshData.tagNo,
                                    meshData.offset.x,
                                    meshData.offset.y,
                                    meshData.offset.z,
                                    meshData.maxbb.x,
                                    meshData.maxbb.y,
                                    meshData.maxbb.z,
                                    meshData.minbb.x,
                                    meshData.minbb.y,
                                    meshData.minbb.z
                                ],
                                (err) => {
                                    if (err) {
                                        console.error('Error inserting data into BoundingboxTable:', err.message);
                                        return reject(err);
                                    }
                                    console.log(`Row inserted into BoundingboxTable for file ${meshData.fileName}`);
                                    return resolve();
                                }
                            );
                        }
                    });
                });
            });

            // Wait for all promises to resolve
            Promise.all([...fileSavePromises, ...fileTablePromises, ...meshTablePromises])
                .then(() => {
                    // Fetch all data from the tables
                    Promise.all([
                        new Promise((resolve, reject) => {
                            projectDb.all("SELECT * FROM UnassignedModels", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from UnassignedModels table:', err.message);
                                    return reject(err);
                                }
                                console.log('Data in the unassignedModels table:', rows);
                                mainWindow.webContents.send('all-unassignedModels', rows);
                                resolve();
                            });
                        }),
                        new Promise((resolve, reject) => {
                            projectDb.all("SELECT * FROM FileBoundingTable", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from FileBoundingTable:', err.message);
                                    return reject(err);
                                }
                                console.log('Data in the FileBoundingTable:', rows);
                                mainWindow.webContents.send('all-files-table', rows);
                                resolve();
                            });
                        }),
                        new Promise((resolve, reject) => {
                            projectDb.all("SELECT * FROM BoundingboxTable", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from BoundingboxTable:', err.message);
                                    return reject(err);
                                }
                                console.log('Data in the BoundingboxTable:', rows);
                                mainWindow.webContents.send('all-mesh-table', rows);
                                resolve();
                            });
                        })
                    ])
                        .then(() => {
                            mainWindow.webContents.send('all-models-saved');
                        })
                        .catch((err) => {
                            console.error('Error fetching data from tables:', err.message);
                        });
                })
                .catch((err) => {
                    console.error('Error processing files:', err.message);
                })
                .finally(() => {
                    projectDb.close((err) => {
                        if (err) {
                            console.error('Error closing the database connection:', err.message);
                        } else {
                            console.log('Database connection closed.');
                        }
                    });
                });



        });

    });

    ipcMain.on('save-user-world-box', (event, data) => {
        console.log(data);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        console.log("Received request to save worldbox");

        // Ensure the unassigned models folder exists
        const unassignedFolderPath = path.join(selectedFolderPath, 'unassigned_models');
        if (!fs.existsSync(unassignedFolderPath)) {
            fs.mkdirSync(unassignedFolderPath);
            console.log('unassigned_models folder created.');
        }

        // Normalize data.fileNamePath to an array
        const fileNamePaths = Array.isArray(data.fileNamePath) ? data.fileNamePath : [data.fileNamePath];

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Mapping of filename to unique number
            const filenameToUniqueNumberMap = {};

            // Process the files
            const fileSavePromises = fileNamePaths.map((file) => {
                console.log(file);
                return new Promise((resolve, reject) => {
                    const fileToMove = file;
                    const filename = path.basename(fileToMove);
                    // const destinationPath = path.join(tagsFolderPath, filename);
                    // const fileToMove = path.join(__dirname, file);
                    // const filename = path.basename(fileToMove);

                    const filePath = path.join(unassignedFolderPath, filename);
                    if (!fs.existsSync(filePath)) {
                        fs.copyFileSync(fileToMove, filePath);
                        console.log(`File '${filename}' copied to 'unassigned_models' folder.`);
                    } else {
                        console.log(`File '${filename}' already exists in 'unassigned_models' folder. Skipping copy operation.`);
                        return resolve(); // Skip processing this file
                    }

                    // Generate a unique number
                    const uniqueNumber = generateCustomID('U');
                    filenameToUniqueNumberMap[filename] = uniqueNumber;

                    // Check if the filename already exists in the database
                    projectDb.get('SELECT * FROM UnassignedModels WHERE filename = ?', [filename], (err, row) => {
                        if (err) {
                            console.error('Error checking filename in database:', err.message);
                            return reject(err);
                        }

                        if (row) {
                            console.log(`Filename ${filename} already exists in the database. Skipping insertion.`);
                            return resolve();
                        } else {
                            // Insert file details into the database
                            projectDb.run(
                                'INSERT INTO UnassignedModels (number, filename) VALUES (?, ?)',
                                [uniqueNumber, filename],
                                (err) => {
                                    if (err) {
                                        console.error(`Error inserting file ${uniqueNumber} into database:`, err);
                                        return reject(err);
                                    } else {
                                        console.log(`File ${uniqueNumber} inserted into database`);
                                        return resolve();
                                    }
                                }
                            );
                        }
                    });
                });
            });

            // Wait for all promises to resolve
            Promise.all(fileSavePromises)
                .then(() => {
                    // Fetch all data from the tables
                    return new Promise((resolve, reject) => {
                        projectDb.all("SELECT * FROM UnassignedModels", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from UnassignedModels table:', err.message);
                                return reject(err);
                            }
                            console.log('Data in the unassignedModels table:', rows);
                            mainWindow.webContents.send('all-unassignedModels', rows);
                            resolve();
                        });
                    });
                })
                .then(() => {
                    mainWindow.webContents.send('all-models-saved');
                })
                .catch((err) => {
                    console.error('Error processing files:', err.message);
                })
                .finally(() => {
                    projectDb.close((err) => {
                        if (err) {
                            console.error('Error closing the database connection:', err.message);
                        } else {
                            console.log('Database connection closed.');
                        }
                    });
                });
        });
    });

    ipcMain.on('save-world-box', (event, data) => {
        console.log(data);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        console.log("Received request to save worldbox");

        // Ensure the unassigned models folder exists
        const unassignedFolderPath = path.join(selectedFolderPath, 'unassigned_models');
        if (!fs.existsSync(unassignedFolderPath)) {
            fs.mkdirSync(unassignedFolderPath);
            console.log('unassigned_models folder created.');
        }

        // Normalize data.fileNamePath to an array
        const fileNamePaths = Array.isArray(data.fileNamePath) ? data.fileNamePath : [data.fileNamePath];

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Mapping of filename to unique number
            const filenameToUniqueNumberMap = {};

            // Process the files
            const fileSavePromises = fileNamePaths.map((file) => {
                console.log(file);
                return new Promise((resolve, reject) => {

                    const fileToMove = path.join(__dirname, file);
                    const filename = path.basename(fileToMove);

                    const filePath = path.join(unassignedFolderPath, filename);
                    if (!fs.existsSync(filePath)) {
                        fs.copyFileSync(fileToMove, filePath);
                        console.log(`File '${filename}' copied to 'unassigned_models' folder.`);
                    } else {
                        console.log(`File '${filename}' already exists in 'unassigned_models' folder. Skipping copy operation.`);
                        return resolve(); // Skip processing this file
                    }

                    // Generate a unique number
                    const uniqueNumber = generateCustomID('U');
                    filenameToUniqueNumberMap[filename] = uniqueNumber;

                    // Check if the filename already exists in the database
                    projectDb.get('SELECT * FROM UnassignedModels WHERE filename = ?', [filename], (err, row) => {
                        if (err) {
                            console.error('Error checking filename in database:', err.message);
                            return reject(err);
                        }

                        if (row) {
                            console.log(`Filename ${filename} already exists in the database. Skipping insertion.`);
                            return resolve();
                        } else {
                            // Insert file details into the database
                            projectDb.run(
                                'INSERT INTO UnassignedModels (number, filename) VALUES (?, ?)',
                                [uniqueNumber, filename],
                                (err) => {
                                    if (err) {
                                        console.error(`Error inserting file ${uniqueNumber} into database:`, err);
                                        return reject(err);
                                    } else {
                                        console.log(`File ${uniqueNumber} inserted into database`);
                                        return resolve();
                                    }
                                }
                            );
                        }
                    });
                });
            });

            // Wait for all promises to resolve
            Promise.all(fileSavePromises)
                .then(() => {
                    // Fetch all data from the tables
                    return new Promise((resolve, reject) => {
                        projectDb.all("SELECT * FROM UnassignedModels", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from UnassignedModels table:', err.message);
                                return reject(err);
                            }
                            console.log('Data in the unassignedModels table:', rows);
                            mainWindow.webContents.send('all-unassignedModels', rows);
                            resolve();
                        });
                    });
                })
                .then(() => {
                    mainWindow.webContents.send('all-models-saved');
                })
                .catch((err) => {
                    console.error('Error processing files:', err.message);
                })
                .finally(() => {
                    projectDb.close((err) => {
                        if (err) {
                            console.error('Error closing the database connection:', err.message);
                        } else {
                            console.log('Database connection closed.');
                        }
                    });
                });
        });
    });

    ipcMain.on('save-document-data', (event, data) => {
        console.log("Received request to save document");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Create a folder named 'Documents' in the project folder
            const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
            if (!fs.existsSync(documentsFolderPath)) {
                fs.mkdirSync(documentsFolderPath);
                console.log('Documents folder created.');
            }

            // Move the file into the 'Documents' folder
            const fileToMove = data.filePath;
            if (!fs.existsSync(fileToMove)) {
                console.error(`File to move does not exist: ${fileToMove}`);
                return;
            }

            const fileName = path.basename(fileToMove);
            const destinationPath = path.join(documentsFolderPath, fileName);

            try {
                if (!fs.existsSync(destinationPath)) {
                    fs.copyFileSync(fileToMove, destinationPath);
                    console.log(`File '${fileName}' moved to 'Documents' folder.`);
                } else {
                    console.log(`File '${fileName}' already exists in 'Documents' folder. Skipping move operation.`);
                }
            } catch (error) {
                console.error('Error during file operation:', error.message);
                return;
            }

            const docId = generateCustomID('D');
            // Insert data into the Tree table of the project's database
            projectDb.run('INSERT INTO Documents (DocumentId,number, title, descr, type, filename) VALUES (?,?,?,?,?,?)', [docId, data.number, data.title, data.descr, data.type, data.filename], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with document number: ${data.number}`);

                // Fetch and send all document data
                projectDb.all("SELECT * FROM Documents", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from Documents table:', err.message);
                        return;
                    }

                    console.log('Data in the Documents table:', rows);
                    mainWindow.webContents.send('all-document-fetched', rows);
                });
            });
        });
    });

    ipcMain.on('delete-unassigned-models', (event, unassignedmodel) => {
        console.log("receive delete message", unassignedmodel)
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            unassignedmodel.forEach((model) => {

                const filePath = path.join(selectedFolderPath, 'unassigned_models', model.filename);
                const uploadFilePath = path.join(selectedFolderPath, 'uploads', model.filename);

                // Delete the file from the filesystem
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`File '${model.filename}' deleted from unassigned_models folder.`);
                } else {
                    console.log(`File '${model.filename}' not found in unassigned_models folder. Skipping deletion.`);
                }
                // Delete the file from the filesystem
                if (fs.existsSync(uploadFilePath)) {
                    fs.unlinkSync(uploadFilePath);
                    console.log(`File '${model.filename}' deleted from uploads folder.`);
                } else {
                    console.log(`File '${model.filename}' not found in uploads folder. Skipping deletion.`);
                }

                // Delete the record from the database
                projectDb.run('DELETE FROM UnassignedModels WHERE number = ?', [model.number], (err) => {
                    if (err) {
                        console.error('Error deleting from UnassignedModels table:', err.message);
                        return;
                    }
                    projectDb.all("SELECT * FROM UnassignedModels", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-unassignedModels', rows);
                    });

                });


            });

            event.reply('unassigned-models-deleted');
        });
    });

    ipcMain.on('assign-tags', async (event, modelsData) => {
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, async (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            const tagsFolderPath = path.join(selectedFolderPath, 'Tags');
            if (!fs.existsSync(tagsFolderPath)) {
                fs.mkdirSync(tagsFolderPath);
                console.log('Tags folder created.');
            }

            for (const data of modelsData) {
                try {
                    const TagId = data.tagId;
                    await runQuery(projectDb, `INSERT INTO Tags (tagId, number, type, filename) VALUES (?, ?, ?, ?)`, [TagId, data.tagNo, data.tagType, data.filename]);
                    console.log(`Row inserted with tag number: ${data.tagNo}`);

                    await runQuery(projectDb, `INSERT INTO TagInfo (tagId,tag,type) VALUES (?, ?, ?)`, [TagId, data.tagNo, data.tagType]);
                    console.log(`Row inserted with tag number: ${data.tagNo}`);

                    if (data.tagType === 'Line') {
                        await runQuery(projectDb, `INSERT INTO LineList (tagId,tag) VALUES (?,?)`, [TagId, data.tagNo]);
                        console.log(`Row inserted into LineList table with filename: ${TagId, data.tagNo}`);
                    } else if (data.tagType === 'Equipment') {
                        await runQuery(projectDb, `INSERT INTO EquipmentList (tagId,tag) VALUES (?,?)`, [TagId, data.tagNo]);
                        console.log(`Row inserted into EquipmentList table with filename: ${TagId, data.tagNo}`);
                    } else {
                        console.error('Invalid tag type:', data.tagType);
                        continue;
                    }

                    await runQuery(projectDb, 'DELETE FROM UnassignedModels WHERE filename = ?', [data.filename]);

                    const sourcePath = path.join(selectedFolderPath, 'unassigned_models', data.filename);
                    const destinationPath = path.join(tagsFolderPath, data.filename);

                    if (fs.existsSync(sourcePath)) {
                        if (!fs.existsSync(destinationPath)) {
                            fs.renameSync(sourcePath, destinationPath);
                            console.log(`File '${data.filename}' moved to 'Tags' folder.`);
                        } else {
                            console.log(`File '${data.filename}' already exists in 'Tags' folder. Skipping move operation.`);
                        }
                    } else {
                        console.error(`File '${sourcePath}' not found. Skipping move operation.`);
                    }
                } catch (err) {
                    console.error('Error during processing:', err.message);
                }
            }

            try {
                const tagsData = await fetchAllData(projectDb, "SELECT * FROM Tags");
                console.log('Data in the Tags table:', tagsData);
                mainWindow.webContents.send('all-tags-fetched', tagsData);

                const tagsInfoData = await fetchAllData(projectDb, "SELECT * FROM TagInfo");
                console.log('Data in the Tags table:', tagsInfoData);
                mainWindow.webContents.send('all-taginfo-fetched', tagsInfoData);

                const lineListData = await fetchAllData(projectDb, "SELECT * FROM LineList");
                // console.log('Data in the LineList table:', lineListData);
                mainWindow.webContents.send('all-lines-fetched', lineListData);

                const equipmentListData = await fetchAllData(projectDb, "SELECT * FROM EquipmentList");
                // console.log('Data in the EquipmentList table:', equipmentListData);
                mainWindow.webContents.send('all-equipement-fetched', equipmentListData);

                // Notify the front end that all processing is complete
                mainWindow.webContents.send('processing-complete');
            } catch (err) {
                console.error('Error fetching data:', err.message);
            } finally {
                projectDb.close();
            }
        });
    });

    // Utility function to run a database query and return a Promise
    function runQuery(db, query, params) {
        return new Promise((resolve, reject) => {
            db.run(query, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    // Utility function to fetch all data from a table and return a Promise
    function fetchAllData(db, query) {
        return new Promise((resolve, reject) => {
            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    ipcMain.on('document-fetch', (event, number) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT filename FROM Documents WHERE number = ?', [number], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    event.sender.send('tag-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
                    const filePath = path.join(documentsFolderPath, row.filename);

                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', { success: true, filePath: filePath });
                        mainWindow.webContents.send('fetched-document', filePath);
                    } else {
                        console.error('File not found in Documents folder');
                        event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                    }
                } else {
                    console.error('Document not found in database');
                    event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                }
            });
        });
    });

    ipcMain.on('remove-Tag-table', (event, sendData) => {
        console.log("receive delete message", sendData)
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Fetch the filename associated with the document number
            projectDb.get('SELECT filename, number FROM Tags WHERE tagId = ?', [sendData], (err, row) => {
                if (err) {
                    console.error('Error fetching filename from Tags table:', err.message);
                    projectDb.close();
                    return;
                }

                if (row) {
                    const { number } = row
                    console.log("number", number)
                    if (row.filename) {
                        const filePath = path.join(selectedFolderPath, 'Tags', row.filename);
                        fs.unlink(filePath, (err) => {
                            // Delete the file from the filesystem
                            if (err && err.code !== 'ENOENT') {
                                console.error(`Error deleting file '${row.filename}':`, err.message);
                                projectDb.close();
                                return;
                            } else if (!err) {
                                console.log(`File '${row.filename}' deleted from Tags folder.`);
                            } else {
                                console.log(`File '${row.filename}' not found in Tags folder. Skipping deletion.`);
                            }
                        })


                    }
                    // Delete the record from the tags database
                    projectDb.run('DELETE FROM Tags WHERE tagId = ?', [sendData], (err) => {
                        if (err) {
                            console.error('Error deleting from Tags table:', err.message);
                            projectDb.close();
                            return;
                        }

                        projectDb.all("SELECT * FROM Tags", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from tags table:', err.message);
                                projectDb.close();
                                return;
                            }
                            event.sender.send('all-tags-fetched', rows);
                            // projectDb.close();
                        });
                    });

                    // Delete the record from the line database
                    projectDb.run('DELETE FROM LineList WHERE tagId = ?', [sendData], (err) => {
                        if (err) {
                            console.error('Error deleting from LineList table:', err.message);
                            return;
                        }
                        projectDb.all("SELECT * FROM LineList", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from LineList table:', err.message);
                                return;
                            }

                            mainWindow.webContents.send('all-lines-fetched', rows);
                        });

                    });
                    // Delete the record from the  eqp database
                    projectDb.run('DELETE FROM EquipmentList WHERE tagId = ?', [sendData], (err) => {
                        if (err) {
                            console.error('Error deleting from EquipmentList table:', err.message);
                            return;
                        }
                        projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                                return;
                            }
                            mainWindow.webContents.send('all-equipement-fetched', rows);
                        });

                    });
                    // Delete the record from the  eqp database
                    projectDb.run('DELETE FROM TagInfo WHERE tagId = ?', [sendData], (err) => {
                        if (err) {
                            console.error('Error deleting from TagInfo table:', err.message);
                            return;
                        }
                        projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                                return;
                            }
                            mainWindow.webContents.send('all-taginfo-fetched', rows);
                        });

                    });

                    // Delete the record from the Tree table using tagNo
                    projectDb.run('DELETE FROM Tree WHERE tag = ?', [number], (err) => {
                        if (err) {
                            console.error('Error deleting from Tree table:', err.message);
                            return;
                        }
                        projectDb.all("SELECT * FROM Tree", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                                return;
                            }
                            console.log(number);

                            console.log('Data in the Tree table:', rows);
                            mainWindow.webContents.send('all-tags-under-sys-fetched', rows);
                        });
                    });

                    // Delete the record from the BoundingboxTable
                    projectDb.run('DELETE FROM BoundingboxTable WHERE tagId = ?', [sendData], (err) => {
                        if (err) {
                            console.error('Error deleting from BoundingboxTable:', err.message);
                            return;
                        }
                        projectDb.all("SELECT * FROM BoundingboxTable", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from BoundingboxTable:', err.message);
                                return;
                            }
                            mainWindow.webContents.send('all-mesh-table', rows);
                        });
                    });

                    // Delete the record from the FileBoundingTable
                    projectDb.run('DELETE FROM FileBoundingTable WHERE tagId = ?', [sendData], (err) => {
                        if (err) {
                            console.error('Error deleting from FileBoundingTable:', err.message);
                            return;
                        }
                        projectDb.all("SELECT * FROM FileBoundingTable", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from FileBoundingTable:', err.message);
                                return;
                            }
                            mainWindow.webContents.send('all-files-table', rows);
                        });
                    });
                } else {
                    console.error('row not found for the provided  id.');
                    projectDb.close();
                }
            });
        });
    });

    ipcMain.on('remove-linelist-table', (event, tagNumber) => {
        console.log("Received delete message", tagNumber);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch the table schema to get all column names except 'tag'
            projectDb.all("PRAGMA table_info(LineList)", (err, columns) => {
                if (err) {
                    console.error('Error fetching table info:', err.message);
                    return;
                }

                // Prepare the list of columns to set to NULL
                const updateColumns = columns
                    .map(col => col.name)
                    .filter(colName => colName !== 'tagId' && colName !== 'tag')
                    .map(colName => `${colName} = NULL`)
                    .join(', ');

                // Update the row to set all columns except 'tag' to NULL
                projectDb.run(`UPDATE LineList SET ${updateColumns} WHERE tag = ?`, [tagNumber], (err) => {
                    if (err) {
                        console.error('Error updating LineList table:', err.message);
                        return;
                    }

                    // Fetch and send updated data to the renderer process
                    projectDb.all("SELECT * FROM LineList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from LineList table:', err.message);
                            return;
                        }

                        console.log('Data in the LineList table:', rows);
                        mainWindow.webContents.send('all-lines-fetched', rows);
                    });
                });
            });
        });
    });

    ipcMain.on('remove-equipement-table', (event, tagNumber) => {
        console.log("receive delete message")
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Fetch the table schema to get all column names except 'tag'
            projectDb.all("PRAGMA table_info(EquipmentList)", (err, columns) => {
                if (err) {
                    console.error('Error fetching table info:', err.message);
                    return;
                }

                // Prepare the list of columns to set to NULL
                const updateColumns = columns
                    .map(col => col.name)
                    .filter(colName => colName !== 'tagId' && colName !== 'tag')
                    .map(colName => `${colName} = NULL`)
                    .join(', ');

                // Update the row to set all columns except 'tag' to NULL
                projectDb.run(`UPDATE EquipmentList SET ${updateColumns} WHERE tag = ?`, [tagNumber], (err) => {
                    if (err) {
                        console.error('Error updating LineList table:', err.message);
                        return;
                    }

                    // Fetch and send updated data to the renderer process
                    projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from LineList table:', err.message);
                            return;
                        }

                        console.log('Data in the EquipmentList table:', rows);
                        mainWindow.webContents.send('all-equipement-fetched', rows);
                    });
                });
            });



        });
    });

    ipcMain.on('remove-document-table', (event, sendData) => {
        console.log("Received delete message");

        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch the filename associated with the document number
            projectDb.get('SELECT filename FROM Documents WHERE number = ?', [sendData], (err, row) => {
                if (err) {
                    console.error('Error fetching filename from Documents table:', err.message);
                    projectDb.close();
                    return;
                }

                if (row && row.filename) {
                    const filePath = path.join(selectedFolderPath, 'Documents', row.filename);

                    // Delete the file from the filesystem
                    fs.unlink(filePath, (err) => {
                        if (err && err.code !== 'ENOENT') {
                            console.error(`Error deleting file '${row.filename}':`, err.message);
                            projectDb.close();
                            return;
                        } else if (!err) {
                            console.log(`File '${row.filename}' deleted from Documents folder.`);
                        } else {
                            console.log(`File '${row.filename}' not found in Documents folder. Skipping deletion.`);
                        }

                        // Delete the record from the database
                        projectDb.run('DELETE FROM Documents WHERE number = ?', [sendData], (err) => {
                            if (err) {
                                console.error('Error deleting from Documents table:', err.message);
                                projectDb.close();
                                return;
                            }

                            projectDb.all("SELECT * FROM Documents", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from Documents table:', err.message);
                                    projectDb.close();
                                    return;
                                }

                                console.log('Data in the Documents table:', rows);
                                event.sender.send('all-document-fetched', rows);
                                projectDb.close();
                            });
                        });
                    });
                } else {
                    console.error('Filename not found for the provided document number.');
                    projectDb.close();
                }
            });
        });
    });

    ipcMain.on('fetch-tag-path', (event, tag) => {
        console.log("Received request to search tag by tag");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Join query to get the filename and the required fields from Tree table
            projectDb.get(`
                SELECT 
                    Tree.area, Tree.disc, Tree.sys, Tags.filename 
                FROM 
                    Tree 
                JOIN 
                    Tags 
                ON 
                    Tree.tag = Tags.number 
                WHERE 
                    Tree.tag = ?`, [tag], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    event.sender.send('tag-not-found', { success: false, message: 'Files not found' });
                    return;
                }

                if (row && row.filename) {
                    const documentsFolderPath = path.join(selectedFolderPath, 'Tags');
                    const filePath = path.join(documentsFolderPath, row.filename);
                    const filename = path.basename(filePath);


                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', {
                            success: true,
                            filePath: filePath,
                            area: row.area,
                            disc: row.disc,
                            sys: row.sys
                        });
                        mainWindow.webContents.send('fetched-Tag-path', {
                            tag: tag,
                            filePath: filePath,
                            filename: filename,
                            area: row.area,
                            disc: row.disc,
                            sys: row.sys
                        });
                    } else {
                        console.error('File not found in Tags folder');
                        event.sender.send('doc-found', { success: false, message: 'File not found in Tags folder' });
                    }
                } else {
                    console.error('Tags not found in database');
                    event.sender.send('tag-not-found', { success: false, message: 'File is not assigned' });
                }
            });
        });
    });

    ipcMain.on('fetch-unassigned-path', (event, number) => {
        console.log("Received request to search unassigned by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT filename FROM UnassignedModels WHERE number = ?', [number], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    event.sender.send('unassigned-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    const documentsFolderPath = path.join(selectedFolderPath, 'unassigned_models');
                    const filePath = path.join(documentsFolderPath, row.filename);
                    console.log("unassigned_models", filePath);
                    const filename = path.basename(filePath);


                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', { success: true, filePath: filePath });
                        mainWindow.webContents.send('fetched-unassigned-path', { number: number, filePath: filePath, filename: filename });
                    } else {
                        console.error('File not found in Unassigned folder');
                        event.sender.send('doc-found', { success: false, message: 'File not found in Tags folder' });
                    }
                } else {
                    console.error('Unassigned not found in database');
                    event.sender.send('doc-found', { success: false, message: 'Tags not found in database' });
                }
            });
        });
    });

    ipcMain.on('update-linelist-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Extracting updated data
        const { tag, fluidCode, medium, lineSizeIn, lineSizeNb, pipingSpec, insType,
            insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup,
            chemCleaning, pwht } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run(`UPDATE LineList SET 
                fluidCode = ?, medium = ?, lineSizeIn = ?, lineSizeNb = ?, pipingSpec = ?, 
                insType = ?, insThickness = ?, heatTrace = ?, lineFrom = ?, lineTo = ?, maxOpPress = ?, maxOpTemp = ?, dsgnPress = ?, minDsgnTemp = ?, maxDsgnTemp = ?, testPress = ?, testMedium = ?, testMediumPhase = ?, 
                massFlow = ?, volFlow = ?, density = ?, velocity = ?, paintSystem = ?, ndtGroup = ?, chemCleaning = ?, pwht = ? WHERE tag = ?`,
                [
                    fluidCode, medium, lineSizeIn, lineSizeNb, pipingSpec, insType,
                    insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup,
                    chemCleaning, pwht, tag
                ],
                (err) => {
                    if (err) {
                        console.error('Error updating LineList table:', err.message);
                        return;
                    }

                    console.log('LineList table updated successfully.');
                    // Fetch updated data from the LineList table
                    projectDb.all("SELECT * FROM LineList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from LineList table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-lines-fetched', rows);
                    });

                }
            );
        });
    });

    ipcMain.on('update-mtolinelist-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Extracting updated data
        const { tag, fluidCode, medium, lineSizeIn, lineSizeNb, pipingSpec, insType,
            insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup,
            chemCleaning, pwht, sysname } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run(`UPDATE MtoLineList SET 
                fluidCode = ?, medium = ?, lineSizeIn = ?, lineSizeNb = ?, pipingSpec = ?, 
                insType = ?, insThickness = ?, heatTrace = ?, lineFrom = ?, lineTo = ?, maxOpPress = ?, maxOpTemp = ?, dsgnPress = ?, minDsgnTemp = ?, maxDsgnTemp = ?, testPress = ?, testMedium = ?, testMediumPhase = ?, 
                massFlow = ?, volFlow = ?, density = ?, velocity = ?, paintSystem = ?, ndtGroup = ?, chemCleaning = ?, pwht = ?, sysname = ?WHERE tag = ?`,
                [
                    fluidCode, medium, lineSizeIn, lineSizeNb, pipingSpec, insType,
                    insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup,
                    chemCleaning, pwht, sysname, tag
                ],
                (err) => {
                    if (err) {
                        console.error('Error updating  MtoLineList table:', err.message);
                        return;
                    }

                    console.log(' MtoLineList table updated successfully.');
                    // Fetch updated data from the LineList table
                    projectDb.all("SELECT * FROM  MtoLineList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from  MtoLineList table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('linelist-save-mto', rows);
                    });

                }
            );
        });
    });

    ipcMain.on('update-equipment-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Extracting updated data
        const {
            tag, descr, qty, capacity, type, materials, capacityDuty, dims, dsgnPress, opPress, dsgnTemp, opTemp, dryWeight, opWeight, supplier, remarks, initStatus, revision, revisionDate } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run(`UPDATE EquipmentList SET 
                descr = ?, qty = ?, capacity = ?, type = ?, materials = ?, 
                capacityDuty = ?, dims = ?, dsgnPress = ?, opPress = ?, 
                dsgnTemp = ?, opTemp = ?, dryWeight = ?, opWeight = ?, 
                supplier = ?, remarks = ?, initStatus = ?, revision = ?, 
                revisionDate = ? WHERE tag = ?`,
                [
                    descr, qty, capacity, type, materials,
                    capacityDuty, dims, dsgnPress, opPress,
                    dsgnTemp, opTemp, dryWeight, opWeight,
                    supplier, remarks, initStatus, revision,
                    revisionDate, tag
                ],
                (err) => {
                    if (err) {
                        console.error('Error updating EquipmentList table:', err.message);
                        return;
                    }

                    console.log('EquipmentList table updated successfully.');
                    projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-equipement-fetched', rows);
                    });

                }
            );

        });
    });

    ipcMain.on('create-asset', async (event, data) => {
        const { name, description, selectFolder, accessToken, projectNo, projectFolder } = data;
        console.log(accessToken);
        console.log(name);
        console.log(description);
        console.log(selectFolder);

        const headingInDegrees = 151.5;
        const headingInRadians = headingInDegrees * (Math.PI / 180);

        try {
            console.log('Add new asset');
            console.log('Creating new asset: MyModel');

            const response = await request({
                url: 'https://api.cesium.com/v1/assets',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: {
                    name,
                    description,
                    type: '3DTILES',
                    options: {
                        sourceType: '3D_MODEL',
                        position: [51.6316845336, 25.8917368156, -30.1683283184],
                        orientation: {
                            heading: headingInRadians,
                            pitch: 0,  // Pitch can be set if needed
                            roll: 0    // Roll can be set if needed
                        }
                    },
                },
                json: true,
            });

            const uploadLocation = response.uploadLocation;

            const s3 = new AWS.S3({
                apiVersion: '2006-03-01',
                region: 'us-east-1',
                signatureVersion: 'v4',
                endpoint: uploadLocation.endpoint,
                credentials: new AWS.Credentials(
                    uploadLocation.accessKey,
                    uploadLocation.secretAccessKey,
                    uploadLocation.sessionToken
                ),
            });

            const uploadFilesFromFolder = async (folder) => {
                const uploadFolder = path.join(selectedFolderPath, folder);
                const files = fs.readdirSync(uploadFolder);

                for (const fileName of files) {
                    const filePath = path.join(uploadFolder, fileName);
                    await s3.upload({
                        Body: fs.createReadStream(filePath),
                        Bucket: uploadLocation.bucket,
                        Key: `${uploadLocation.prefix}${fileName}`,
                    }).on('httpUploadProgress', function (progress) {
                        console.log(`Upload: ${((progress.loaded / progress.total) * 100).toFixed(2)}%`);
                    }).promise();
                }
            };

            if (selectFolder === 'Tags, unassigned_models') {
                await uploadFilesFromFolder('Tags');
                await uploadFilesFromFolder('unassigned_models');
            } else {
                await uploadFilesFromFolder(selectFolder);
            }

            const onComplete = response.onComplete;
            await request({
                url: onComplete.url,
                method: onComplete.method,
                headers: { Authorization: `Bearer ${accessToken}` },
                json: true,
                body: onComplete.fields,
            });

            const waitUntilReady = async (response) => {
                try {
                    const assetId = response.assetMetadata.id;
                    const assetMetadata = await request({
                        url: `https://api.cesium.com/v1/assets/${assetId}`,
                        headers: { Authorization: `Bearer ${accessToken}` },
                        json: true,
                    });

                    const status = assetMetadata.status;
                    if (status === 'COMPLETE') {
                        console.log('Asset tiled successfully');
                        console.log(`View in ion: https://cesium.com/ion/assets/${assetMetadata.id}`);

                        // Update database with the new asset ID
                        if (projectdBPath) {
                            const projectdb = new sqlite3.Database(projectdBPath, (err) => {
                                if (err) {
                                    console.error('Error opening project database:', err.message);
                                    return;
                                }

                                projectdb.get(`SELECT asset FROM projectdetails WHERE projectNumber = ? AND projectName = ?`,
                                    [projectNo, projectFolder],
                                    function (err, row) {
                                        if (err) {
                                            console.error('Error querying data:', err.message);
                                            return;
                                        }

                                        let updatedAssetList;
                                        if (row && row.asset) {
                                            // Append the new asset ID to the existing list
                                            updatedAssetList = `${row.asset},${assetId}`;
                                        } else {
                                            // Initialize with the new asset ID
                                            updatedAssetList = `${assetId}`;
                                        }

                                        projectdb.run(`UPDATE projectdetails SET asset = ? WHERE projectNumber = ? AND projectName = ?`,
                                            [updatedAssetList, projectNo, projectFolder],
                                            function (err) {
                                                if (err) {
                                                    console.error('Error updating data:', err.message);
                                                    return;
                                                }
                                                console.log(`Rows updated: ${this.changes}`);
                                                console.log("updatedAssetList", updatedAssetList)
                                                mainWindow.webContents.send('asset-id-project', updatedAssetList);

                                            }
                                        );

                                        projectdb.all("SELECT * FROM projectdetails", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            console.log('Data in the projectdetails table:', rows);
                                            mainWindow.webContents.send('all-project-details', rows);


                                        });
                                    }
                                );
                            });
                        }

                        // Update the JSON file with the new asset ID
                        const jsonFilePath = path.join(selectedFolderPath, 'project_details.json');
                        fs.readFile(jsonFilePath, 'utf8', (err, jsonString) => {
                            if (err) {
                                console.error('Error reading JSON file:', err.message);
                                return;
                            }

                            try {
                                const jsonData = JSON.parse(jsonString);

                                // Add the new asset ID to the JSON data
                                if (!jsonData.assets) {
                                    jsonData.assets = [];
                                }
                                jsonData.assets.push(assetId);

                                fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                                    if (err) {
                                        console.error('Error writing to JSON file:', err.message);
                                        return;
                                    }
                                    console.log('JSON file updated successfully');
                                });
                            } catch (err) {
                                console.error('Error parsing JSON file:', err.message);
                            }
                        });
                        event.sender.send('create-asset-response', assetId);
                        mainWindow.webContents.send('asset-id-project', updatedAssetList);

                    } else if (status === 'DATA_ERROR') {
                        console.log('ion detected a problem with the uploaded data.');

                    } else if (status === 'ERROR') {
                        console.log('An unknown tiling error occurred, please contact support@cesium.com.');

                    } else {
                        if (status === 'NOT_STARTED') {
                            console.log('Tiling pipeline initializing.');
                        } else {
                            console.log(`Asset is ${assetMetadata.percentComplete}% complete.`);
                        }

                        setTimeout(() => waitUntilReady(response), 10000);
                    }
                } catch (error) {
                    console.error('Error in waitUntilReady:', error.message);
                }
            }

            await waitUntilReady(response);

        } catch (error) {
            console.log(error.message);
            event.sender.send('create-asset-response', { status: 'error', message: error.message });
        }
    });

    ipcMain.on('add-comment', (event, commentData) => {
        const { docnumber, comment, status, priority, coordinateX, coordinateY, coordinateZ } = commentData
        console.log(coordinateX)
        console.log(coordinateY)

        const createdby = "jpo@poulconsul"
        const createddate = new Date().toISOString();
        try {
            const projectdb = new sqlite3.Database(databasePath, (err) => {
                if (err) {
                    console.error('Error opening project database:', err.message);
                    return;
                }
                projectdb.get("SELECT MAX(number) AS max_number FROM CommentTable", function (err, row) {
                    const number = parseInt(row.max_number) + 1 || 1;
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    projectdb.run(`INSERT INTO CommentTable (filename,number,comment,status,priority,createdby,createddate,coOrdinateX ,coOrdinateY,coOrdinateZ) VALUES (?, ?, ?,?,?,?,?,?,?,?)`,
                        [docnumber, number, comment, status, priority, createdby, createddate, coordinateX, coordinateY, coordinateZ],
                        function (err) {
                            if (err) {
                                return console.error('Error inserting data:', err.message);
                            }
                            event.sender.send('save-comment-response')
                            console.log(`Row inserted with ID: ${number}`);
                            projectdb.all("SELECT * FROM CommentTable", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from Tree table:', err.message);
                                    return;
                                }
                                console.log(rows)

                                mainWindow.webContents.send('all-comments', rows);
                            });
                        });

                })
            })
        }
        catch (error) {
            console.error('Error in save-data handler:', error);

        }

    })

    ipcMain.on('delete-comment', (event, commentNumber) => {
        console.log("receive delete message")
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Delete the record from the database
            projectDb.run('DELETE FROM CommentTable WHERE number = ?', [commentNumber], (err) => {
                if (err) {
                    console.error('Error deleting from comment table:', err.message);
                    return;
                }
                event.sender.send('delete-comment-response')
                console.log(`Row deleted with ID: ${commentNumber}`);
                projectDb.all("SELECT * FROM CommentTable", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from Tree table:', err.message);
                        return;
                    }
                    console.log(rows)

                    mainWindow.webContents.send('all-comments', rows);
                });
            });
        });
    });

    ipcMain.on('update-taginfo-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        console.log(updatedData);
        // Extracting updated data
        const { taginfo1, taginfo2, taginfo3, taginfo4, taginfo5, taginfo6, taginfo7, taginfo8, taginfo9, taginfo10, taginfo11, taginfo12, taginfo13, taginfo14, taginfo15, taginfo16, taginfo17, taginfo18, taginfo19, taginfo20, taginfo21, taginfo22, taginfo23, taginfo24, taginfo25, taginfo26, taginfo27, taginfo28, taginfo29, taginfo30, taginfo31, taginfo32, taginfo33, taginfo34, taginfo35, taginfo36, taginfo37, taginfo38, taginfo39, taginfo40, taginfo41, taginfo42, taginfo43, taginfo44, taginfo45, taginfo46, taginfo47, taginfo48, taginfo49, taginfo50, tagId } = updatedData;
        console.log(tagId);

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE tagInfo SET taginfo1 = ? ,taginfo2 = ? ,taginfo3 = ? ,taginfo4 = ? ,taginfo5 = ?, taginfo6 = ?,taginfo7 = ?,taginfo8 = ?,taginfo9 = ?,taginfo10 = ?,taginfo11 = ? ,taginfo12 = ? ,taginfo13 = ? ,taginfo14 = ? ,taginfo15 = ?, taginfo16 = ?,taginfo17 = ?,taginfo18 = ?,taginfo19 = ?,taginfo20 = ?,taginfo21 = ? ,taginfo22 = ? ,taginfo23 = ? ,taginfo24 = ? ,taginfo25 = ?, taginfo26 = ?,taginfo27 = ?,taginfo28 = ?,taginfo29 = ?,taginfo30 = ?,taginfo31 = ? ,taginfo32 = ? ,taginfo33 = ? ,taginfo34 = ? ,taginfo35 = ?, taginfo36 = ?,taginfo37 = ?,taginfo38 = ?,taginfo39 = ?,taginfo40 = ?,taginfo41 = ? ,taginfo42 = ? ,taginfo43 = ? ,taginfo44 = ? ,taginfo45 = ?, taginfo46 = ?,taginfo47 = ?,taginfo48 = ?,taginfo49 = ?,taginfo50 = ? WHERE tagId = ?',
                [taginfo1, taginfo2, taginfo3, taginfo4, taginfo5, taginfo6, taginfo7, taginfo8, taginfo9, taginfo10, taginfo11, taginfo12, taginfo13, taginfo14, taginfo15, taginfo16, taginfo17, taginfo18, taginfo19, taginfo20, taginfo21, taginfo22, taginfo23, taginfo24, taginfo25, taginfo26, taginfo27, taginfo28, taginfo29, taginfo30, taginfo31, taginfo32, taginfo33, taginfo34, taginfo35, taginfo36, taginfo37, taginfo38, taginfo39, taginfo40, taginfo41, taginfo42, taginfo43, taginfo44, taginfo45, taginfo46, taginfo47, taginfo48, taginfo49, taginfo50, tagId],
                (err) => {
                    if (err) {
                        console.error('Error updating tagInfo table:', err.message);
                        return;
                    }

                    console.log('tagInfo table updated successfully.');
                    projectDb.get(
                        'SELECT * FROM tagInfo WHERE tagId = ?',
                        [tagId],
                        (err, row) => {
                            if (err) {
                                console.error('Error retrieving updated row:', err.message);
                                return;
                            }

                            console.log('Updated row:', row);
                        }
                    );
                }
            );

            // Fetch updated data from the LineList table
            projectDb.all("SELECT * FROM tagInfo", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from tagInfo table:', err.message);
                    return;
                }

                mainWindow.webContents.send('all-taginfo-fetched', rows);
            });
        });
    });

    ipcMain.on('delete-all-project', (event,) => {
        console.log("receive delete message")
        if (!projectdb) {
            console.error('Project database not initialized.');
            return;
        }
        deleteAllProjectDetails();

    });

    ipcMain.on('delete-project', (event, projectNumber) => {
        console.log("receive delete message")

        // Check if the project database is initialized
        if (!projectdb) {
            console.error('Project database not initialized.');
            return;
        }
        deleteProjectDetails(projectNumber);

    });

    ipcMain.on('remove-taginfo-table', (event, tagNumber) => {
        console.log("Received delete message", tagNumber);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch the table schema to get all column names except 'tag'
            projectDb.all("PRAGMA table_info(TagInfo)", (err, columns) => {
                if (err) {
                    console.error('Error fetching table info:', err.message);
                    return;
                }

                // Prepare the list of columns to set to NULL
                const updateColumns = columns
                    .map(col => col.name)
                    .filter(colName => colName !== 'tagId' && colName !== 'tag' && colName !== 'type')
                    .map(colName => `${colName} = NULL`)
                    .join(', ');

                // Update the row to set all columns except 'tag' to NULL
                projectDb.run(`UPDATE TagInfo SET ${updateColumns} WHERE tagId = ?`, [tagNumber], (err) => {
                    if (err) {
                        console.error('Error updating TagInfo table:', err.message);
                        return;
                    }

                    // Fetch and send updated data to the renderer process
                    projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from TagInfo table:', err.message);
                            return;
                        }

                        console.log('Data in the TagInfo table:', rows);
                        mainWindow.webContents.send('all-taginfo-fetched', rows);
                    });
                });
            });
        });
    });

    ipcMain.on('editCommentStatus', (event, data) => {
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const { commentNumber, comment, status, priority } = data;
        let closedDate = null;
        let closedby = null;

        if (status === 'closed') {
            closedDate = new Date().toISOString();
            closedby = 'jpo@poulconsult';
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE CommentTable SET comment=?, status = ?,priority=?,  closedDate = ?, closedBy = ? WHERE number = ?',
                [comment, status, priority, closedDate, closedby, commentNumber],
                (err) => {
                    if (err) {
                        console.error('Error updating CommentTable:', err.message);
                        return;
                    }

                    projectDb.all("SELECT * FROM CommentTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from CommentTable:', err.message);
                            return;
                        }
                        console.log(rows);
                        mainWindow.webContents.send('all-comments', rows);
                    });
                }
            );
        });
    });

    // Function to update project_details.json
    function updateProjectDetailsJson(projectNumber, assetIdToRemove) {
        const jsonFilePath = path.join(selectedFolderPath, 'project_details.json');

        // Read the JSON file
        fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err.message);
                return;
            }

            let projectDetails;
            try {
                projectDetails = JSON.parse(data);
            } catch (error) {
                console.error('Error parsing JSON file:', error.message);
                return;
            }

            // Find the project by projectNumber
            if (projectDetails.projectNumber === projectNumber) {
                // Remove assetIdToRemove from the assets array
                const assets = projectDetails.assets;
                const updatedAssets = assets.filter(asset => asset !== assetIdToRemove);

                // Update the assets array in projectDetails
                projectDetails.assets = updatedAssets;

                // Write back to the JSON file
                fs.writeFile(jsonFilePath, JSON.stringify(projectDetails, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing JSON file:', err.message);
                        return;
                    }
                    console.log('Asset removed successfully from JSON file');
                });
            } else {
                console.error('Project not found in JSON file');
            }
        });
    }

    ipcMain.on('delete-asset', (event, data) => {
        console.log("Received request to delete asset");

        if (!projectdBPath) {
            console.error('Project database path not available.');
            return;
        }

        const projectdb = new sqlite3.Database(projectdBPath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectdb.get(`SELECT asset FROM projectdetails WHERE projectNumber = ?`, [data.projectNo], (err, row) => {
                if (err) {
                    console.error('Error querying data:', err.message);
                    return;
                }

                if (row) {
                    console.log(row);
                    const assets = row.asset.split(',');
                    const updatedAssets = assets.filter(asset => asset !== data.assetid).join(',');
                    console.log(updatedAssets);

                    projectdb.run(`UPDATE projectdetails SET asset = ? WHERE projectNumber = ?`, [updatedAssets, data.projectNo], (err) => {
                        if (err) {
                            console.error('Error updating data:', err.message);
                            return;
                        }
                        updateProjectDetailsJson(data.projectNo, parseInt(data.assetid));

                        console.log('Asset deleted successfully');
                        mainWindow.webContents.send('delete-asset-response');
                        mainWindow.webContents.send('asset-id-project', updatedAssets)
                    });
                } else {
                    console.error('Project not found.');
                    event.reply('delete-asset-response', { success: false, error: 'Project not found' });
                }
            });
        });
    });

    ipcMain.on('map-project', (event, data) => {
        if (!projectdb) {
            console.error('Database not initialized.');
            event.reply('save-data-response', { success: false, message: 'Database not initialized' });
            return;
        }

        const jsonFilePath = path.join(data, 'project_details.json');
        try {
            // Read and parse project_details.json
            const projectDetails = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
            console.log("json", projectDetails);


            // Check if projectNumber already exists in the database
            projectdb.get('SELECT projectId FROM projectdetails WHERE projectNumber = ?', [projectDetails.projectNumber], (err, row) => {
                if (err) {
                    console.error('Error checking project number:', err.message);
                    event.reply('save-data-response', { success: false, message: 'Error checking project number' });
                    return;
                }

                if (row) {
                    // Project number already exists
                    event.reply('save-data-response', { success: false, message: 'Project number already exists' });
                    console.log('Project number already exists');
                    return;
                }
                const assetString = projectDetails.assets ? projectDetails.assets.join(',') : '';
                const tokenNumber = projectDetails.token || '';
                // Insert projectDetails into projectdetails table
                projectdb.run(
                    `INSERT INTO projectdetails (projectId, projectNumber, projectName, projectDescription, projectPath,TokenNumber,asset) 
                    VALUES (?, ?, ?, ?, ?,?,?)`,
                    [projectDetails.projectId, projectDetails.projectNumber, projectDetails.projectName, projectDetails.projectDescription, data, tokenNumber, assetString],
                    function (err) {
                        if (err) {
                            console.error('Error inserting data:', err.message);
                            event.reply('save-data-response', { success: false, message: 'Error inserting data into database' });
                        } else {
                            console.log(`Row inserted with ID: ${this.lastID}`);


                            // Send success response with project details
                            mainWindow.webContents.send('save-data-response', {
                                success: true,
                                message: 'Project mapped successfully',
                                project: {
                                    projectId: projectDetails.projectId,
                                    projectNumber: projectDetails.projectNumber,
                                    projectName: projectDetails.projectName,
                                    projectDescription: projectDetails.projectDescription,
                                    projectPath: data,
                                    TokenNumber: projectDetails.token
                                }
                            });

                            // Fetch all data from projectdetails table
                            projectdb.all('SELECT * FROM projectdetails', (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data:', err.message);
                                    event.sender.send('data-fetched', { success: false, message: 'Error fetching data from database' });
                                    return;
                                }
                                // Send fetched data to renderer process
                                event.sender.send('data-fetched', { success: true, data: rows });
                                console.log("Sent 'data-fetched' event to renderer process");
                            });
                            // Query the project database to check if the project with the given ID exists
                            projectdb.get('SELECT * FROM projectdetails WHERE projectNumber = ?', projectDetails.projectNumber, (err, row) => {
                                if (err) {
                                    console.error('Error querying project database:', err.message);
                                    return;
                                }

                                if (row) {
                                    console.log(row);
                                    selectedFolderPath = row.projectPath;
                                    mainWindow.webContents.send('asset-id-project', row.asset)
                                    mainWindow.webContents.send('all-project-details', row);
                                    console.log(`Project path retrieved from database: ${selectedFolderPath}`);

                                    // Construct the path to the database file
                                    databasePath = path.join(selectedFolderPath, 'database.db');
                                    console.log(`Opening database file: ${databasePath}`);

                                    // Open the database file
                                    const db = new sqlite3.Database(databasePath, (err) => {
                                        if (err) {
                                            console.error('Error opening database:', err.message);
                                            return;
                                        }
                                        db.all("SELECT * FROM projectdetails", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }
                                            console.log("project Details", rows)

                                            console.log('Data in the projectdetails table:', rows);
                                        });

                                        // Retrieve all data from the Tree table
                                        db.all("SELECT * FROM Tree", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-area-fetched', rows);
                                        });

                                        db.all("SELECT * FROM Tree", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-disc-fetched', rows);
                                        });
                                        db.all("SELECT * FROM Tree", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-sys-fetched', rows);
                                        });
                                        db.all("SELECT * FROM Tree", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-tree-tags-fetched', rows);
                                        });

                                        db.all("SELECT * FROM Tree", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-tags-under-sys-fetched', rows);
                                        });

                                        db.all("SELECT * FROM Tags", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-tags-fetched', rows);
                                        });

                                        db.all("SELECT * FROM UnassignedModels", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-unassignedModels', rows);
                                        });

                                        db.all("SELECT * FROM FileBoundingTable", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-files-table', rows);
                                        });

                                        db.all("SELECT * FROM BoundingboxTable", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-mesh-table', rows);
                                        });

                                        db.all("SELECT * FROM Documents", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-document-fetched', rows);
                                        });
                                        db.all("SELECT * FROM CommentStatus", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }
                                            console.log("all-status", rows)
                                            mainWindow.webContents.send('all-status', rows);
                                        });
                                        db.all("SELECT * FROM UserTagInfoField", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from UserTagInfoField table:', err.message);
                                                return;
                                            }
                                            console.log("all-fields-user-defined", rows);
                                            mainWindow.webContents.send('all-fields-user-defined', rows);
                                        });


                                        db.all("SELECT * FROM LineList", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-lines-fetched', rows);
                                        });
                                        db.all("SELECT * FROM EquipmentList", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-equipement-fetched', rows);
                                        });

                                        db.all("SELECT * FROM CommentTable", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }
                                            mainWindow.webContents.send('all-comments', rows);
                                        });
                                        // Fetch updated data from the LineList table
                                        db.all("SELECT * FROM TagInfo", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from tagInfo table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-taginfo-fetched', rows);
                                        });
                                        //    ------------PID--------------------//

                                        // ---------PID--------------------//

                                        db.all("SELECT * FROM Documents", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            console.log('Data in the Documents table:', rows);
                                            mainWindow.webContents.send('all-docs-fetched', rows);
                                        });

                                        db.all("SELECT * FROM Documents WHERE type = ?", ["iXB"], (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Documents table:', err.message);
                                                return;
                                            }

                                            console.log('Data in the Documents table:', rows);
                                            mainWindow.webContents.send('spid-docs-fetched', rows);
                                        });
                                        db.all("SELECT * FROM Elements", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            console.log('Data in the Elements table:', rows);
                                            mainWindow.webContents.send('all-elements-fetched', rows);
                                        });
                                        db.all("SELECT * FROM Area", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            console.log('Data in the Area table:', rows);
                                            mainWindow.webContents.send('all-area-fetched', rows);
                                        });
                                        db.all("SELECT * FROM Flags", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            console.log('Data in the Flags table:', rows);
                                            mainWindow.webContents.send('all-flags-fetched', rows);
                                        });
                                        db.all("SELECT * FROM MtoBranchTable", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from MtoBranchTable table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('branch-table-response', rows);
                                        });
                                        db.all("SELECT * FROM MtoBranchTableData", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from MtoBranchTableData table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('branch-table-data-response', rows);
                                        });


                                    });
                                } else {
                                    console.error(`Project with ID ${projectNumber} not found.`);
                                }
                            });

                        }
                    }
                );
            });
        } catch (error) {
            console.error('Error reading or parsing JSON file:', error);
            event.reply('save-data-response', { success: false, message: 'Error reading or parsing JSON file' });
        }
    });

    ipcMain.on('update-tag-data', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            if (updatedData.fileName || updatedData.filePath) {
                const tagsFolderPath = path.join(selectedFolderPath, 'Tags');
                const revisedFolderPath = path.join(selectedFolderPath, 'Revised');
                if (!fs.existsSync(tagsFolderPath)) {
                    fs.mkdirSync(tagsFolderPath);
                    console.log('Tags folder created.');
                }

                if (!fs.existsSync(revisedFolderPath)) {
                    fs.mkdirSync(revisedFolderPath);
                    console.log('Revised folder created.');
                }

                const moveFileToRevised = (sourcePath, filename, revision) => {
                    const revisedFileName = filename.replace(/(\.[\w\d_-]+)$/i, `R${revision}$1`);
                    const revisedFilePath = path.join(revisedFolderPath, revisedFileName);
                    fs.renameSync(sourcePath, revisedFilePath);
                    console.log(`File '${filename}' moved to 'Revised' folder with new name '${revisedFileName}'.`);
                };

                const handleFileRevisions = (destinationPath, filename) => {
                    const revisions = [];
                    const revisionRegex = new RegExp(filename.replace(/(\.[\w\d_-]+)$/i, `R(\\d+)$1`));
                    fs.readdirSync(revisedFolderPath).forEach(file => {
                        const match = file.match(revisionRegex);
                        if (match) {
                            revisions.push({ path: path.join(revisedFolderPath, file), revision: parseInt(match[1], 10) });
                        }
                    });

                    revisions.sort((a, b) => a.revision - b.revision);

                    if (revisions.length >= 3) {
                        fs.unlinkSync(revisions[0].path);
                        console.log(`Oldest revision '${revisions[0].path}' deleted.`);
                        revisions.shift();
                    }

                    const nextRevision = revisions.length > 0 ? revisions[revisions.length - 1].revision + 1 : 1;
                    if (fs.existsSync(destinationPath)) {
                        moveFileToRevised(destinationPath, filename, nextRevision);
                    }
                };

                const fileToMove = updatedData.filePath || path.join(tagsFolderPath, updatedData.fileName);
                const filename = path.basename(fileToMove);
                const destinationPath = path.join(tagsFolderPath, filename);
                // Show confirmation dialog before copying the new file to the Tags folder
                dialog.showMessageBox({
                    type: 'question',
                    buttons: ['Yes', 'No'],
                    defaultId: 1,
                    title: 'Confirm File Replacement',
                    message: `Are you sure you want to replace the file '${filename}' in the Tags folder?`
                }).then(result => {
                    if (result.response === 0) { // User selected 'Yes'
                        handleFileRevisions(destinationPath, filename);
                        fs.copyFileSync(fileToMove, destinationPath);
                        console.log(`File '${filename}' moved to 'Tags' folder.`);
                        // Fetch current tag data
                        projectDb.get(`SELECT * FROM Tags WHERE tagId = ?`, [updatedData.tagId], (err, row) => {
                            if (err) {
                                console.error('Error fetching data:', err.message);
                                return;
                            }

                            const previousTagtype = row.type;
                            const updatedTagtype = updatedData.tagtype;
                            const tagnumber = row.number;

                            // Update data in Tags table
                            projectDb.run(`UPDATE Tags SET name = ?, type = ?, filename = ? WHERE tagId = ?`,
                                [updatedData.tagname, updatedData.tagtype, updatedData.fileName, updatedData.tagId],
                                function (err) {
                                    if (err) {
                                        console.error('Error updating data:', err.message);
                                        return;
                                    }
                                    console.log(`Row updated with tag number: ${updatedData.tagId},${updatedData.tagname},${updatedData.tagtype},${updatedData.fileName}`);
                                    // Fetch updated Tags table data
                                    projectDb.all("SELECT * FROM Tags", (err, rows) => {
                                        if (err) {
                                            console.error('Error fetching data from Tags table:', err.message);
                                            return;
                                        }
                                        console.log('Data in the Tags table:', rows);
                                        mainWindow.webContents.send('all-tags-fetched', rows);
                                    });
                                });

                            // If the type has changed from "line" to "equipment"
                            if (previousTagtype === 'Line' && updatedTagtype === 'Equipment') {
                                // Move data from Line table to Equipment table
                                projectDb.run(`INSERT INTO EquipmentList (tagId,tag) VALUES (?,?)`, [updatedData.tagId, tagnumber], function (err) {
                                    if (err) {
                                        console.error('Error moving data from Line to Equipment:', err.message);
                                        return;
                                    }
                                    console.log(`Data moved from Line to Equipment for tagId: ${updatedData.tagId}`);
                                    projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                        if (err) {
                                            console.error('Error fetching data from Tree table:', err.message);
                                            return;
                                        }

                                        console.log('Data in the Equipment table:', rows);
                                        mainWindow.webContents.send('all-equipement-fetched', rows);
                                    });

                                    // Delete moved data from Line table
                                    projectDb.run(`DELETE FROM LineList WHERE tagId = ?`, [updatedData.tagId], function (err) {
                                        if (err) {
                                            console.error('Error deleting data from Line table:', err.message);
                                            return;
                                        }
                                        console.log(`Data deleted from Line table for tagId: ${updatedData.tagId}`);
                                        projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from LineList table:', err.message);
                                                return;
                                            }

                                            mainWindow.webContents.send('all-lines-fetched', rows);
                                        });
                                    });
                                });
                            }

                            // If the type has changed from "line" to "equipment"
                            if (previousTagtype === 'Equipment' && updatedTagtype === 'Line') {
                                // Move data from Line table to Equipment table
                                projectDb.run(`INSERT INTO LineList (tagId,tag) VALUES (?,?)`, [updatedData.tagId, tagnumber], function (err) {
                                    if (err) {
                                        console.error('Error moving data from Line to Equipment:', err.message);
                                        return;
                                    }
                                    console.log(`Data moved from Line to Equipment for tagId: ${updatedData.tagId}`);

                                    projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                        if (err) {
                                            console.error('Error fetching data from LineList table:', err.message);
                                            return;
                                        }

                                        mainWindow.webContents.send('all-lines-fetched', rows);
                                    });

                                    // Delete moved data from Line table
                                    projectDb.run(`DELETE FROM EquipmentList WHERE tagId = ?`, [updatedData.tagId], function (err) {
                                        if (err) {
                                            console.error('Error deleting data from Line table:', err.message);
                                            return;
                                        }
                                        console.log(`Data deleted from Line table for tagId: ${updatedData.tagId}`);
                                        projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data from Tree table:', err.message);
                                                return;
                                            }

                                            console.log('Data in the Equipment table:', rows);
                                            mainWindow.webContents.send('all-equipement-fetched', rows);
                                        });

                                    });
                                });
                            }


                            // Update data in TagInfo table (assuming tagId and tagtype are related to tagId)
                            projectDb.run(`UPDATE TagInfo SET type = ? WHERE tagId = ?`,
                                [updatedData.tagtype, updatedData.tagId],
                                function (err) {
                                    if (err) {
                                        console.error('Error updating data:', err.message);
                                        return;
                                    }
                                    console.log(`Row updated with tag type: ${updatedData.tagtype}`);

                                    // Fetch updated TagInfo table data
                                    projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                                        if (err) {
                                            console.error('Error fetching data from TagInfo table:', err.message);
                                            return;
                                        }
                                        mainWindow.webContents.send('all-taginfo-fetched', rows);
                                    });
                                });

                            if (updatedData.fileTable) {
                                console.log(updatedData.fileTable)
                                // Delete existing records in FileBoundingTable for the provided tagId
                                projectDb.run(`DELETE FROM FileBoundingTable WHERE TagId = ?`, [updatedData.tagId], function (err) {
                                    if (err) {
                                        console.error('Error deleting data from FileBoundingTable:', err.message);
                                        return;
                                    }
                                    console.log(`Existing records deleted from FileBoundingTable for TagId: ${updatedData.tagId}`);

                                    // Insert data into FileBoundingTable
                                    updatedData.fileTable.forEach((fileData) => {
                                        projectDb.run(`INSERT INTO FileBoundingTable (fileid, TagId, fileName, coOrdinateX, coOrdinateY, coOrdinateZ, maxbbX, maxbbY, maxbbZ, minbbX, minbbY, minbbZ)
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                            [
                                                fileData.fileid,
                                                updatedData.tagId,
                                                fileData.fileName,
                                                fileData.offset.x,
                                                fileData.offset.y,
                                                fileData.offset.z,
                                                fileData.maxbbobject.x,
                                                fileData.maxbbobject.y,
                                                fileData.maxbbobject.z,
                                                fileData.minbbobject.x,
                                                fileData.minbbobject.y,
                                                fileData.minbbobject.z
                                            ],
                                            function (err) {
                                                if (err) {
                                                    console.error('Error inserting data into FileBoundingTable:', err.message);
                                                    return;
                                                }
                                                console.log(`Row inserted into FileBoundingTable for file ${fileData.fileName}`);
                                            });
                                    });
                                });

                            }


                            if (updatedData.meshtable) {
                                // Delete existing records in BoundingboxTable for the provided tagId
                                projectDb.run(`DELETE FROM BoundingboxTable WHERE TagId = ?`, [updatedData.tagId], function (err) {
                                    if (err) {
                                        console.error('Error deleting data from BoundingboxTable:', err.message);
                                        return;
                                    }
                                    console.log(`Existing records deleted from BoundingboxTable for TagId: ${updatedData.tagId}`);

                                    // Insert data into BoundingboxTable
                                    updatedData.meshtable.forEach((meshData) => {
                                        const meshid = generateCustomID('M');
                                        projectDb.run(`INSERT INTO BoundingboxTable (fileid, meshid, TagId, fileName, meshName, tagNo, coOrdinateX, coOrdinateY, coOrdinateZ, maxbbX, maxbbY, maxbbZ, minbbX, minbbY, minbbZ)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                            [
                                                meshData.fileid,
                                                meshid,
                                                updatedData.tagId,
                                                meshData.fileName,
                                                meshData.meshName,
                                                meshData.tagNo,
                                                meshData.offset.x,
                                                meshData.offset.y,
                                                meshData.offset.z,
                                                meshData.maxbb.x,
                                                meshData.maxbb.y,
                                                meshData.maxbb.z,
                                                meshData.minbb.x,
                                                meshData.minbb.y,
                                                meshData.minbb.z
                                            ],
                                            function (err) {
                                                if (err) {
                                                    console.error('Error inserting data into BoundingboxTable:', err.message);
                                                    return;
                                                }
                                                console.log(`Row inserted into BoundingboxTable for mesh ${meshData.meshName}`);
                                            });
                                    });
                                });
                            }

                        });
                    } else {
                        console.log('File replacement canceled by user.');
                        return;
                    }
                }).catch(err => {
                    console.error('Error showing confirmation dialog:', err);
                });
            }

            if (updatedData.tagtype || updatedData.tagname) {
                projectDb.get(`SELECT * FROM Tags WHERE tagId = ?`, [updatedData.tagId], (err, row) => {
                    if (err) {
                        console.error('Error fetching data:', err.message);
                        return;
                    }

                    const previousTagtype = row.type;
                    const updatedTagtype = updatedData.tagtype;
                    const tagnumber = row.number;

                    // Update data in Tags table
                    projectDb.run(`UPDATE Tags SET name = ?, type = ? WHERE tagId = ?`,
                        [updatedData.tagname, updatedData.tagtype, updatedData.tagId],
                        function (err) {
                            if (err) {
                                console.error('Error updating data:', err.message);
                                return;
                            }
                            console.log(`Row updated with tag number: ${updatedData.tagId},${updatedData.tagname},${updatedData.tagtype},${updatedData.fileName}`);
                            // Fetch updated Tags table data
                            projectDb.all("SELECT * FROM Tags", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from Tags table:', err.message);
                                    return;
                                }
                                console.log('Data in the Tags table:', rows);
                                mainWindow.webContents.send('all-tags-fetched', rows);
                            });
                        });

                    // If the type has changed from "line" to "equipment"
                    if (previousTagtype === 'Line' && updatedTagtype === 'Equipment') {
                        // Move data from Line table to Equipment table
                        projectDb.run(`INSERT INTO EquipmentList (tagId,tag) VALUES (?,?)`, [updatedData.tagId, tagnumber], function (err) {
                            if (err) {
                                console.error('Error moving data from Line to Equipment:', err.message);
                                return;
                            }
                            console.log(`Data moved from Line to Equipment for tagId: ${updatedData.tagId}`);
                            projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from Tree table:', err.message);
                                    return;
                                }

                                console.log('Data in the Equipment table:', rows);
                                mainWindow.webContents.send('all-equipement-fetched', rows);
                            });

                            // Delete moved data from Line table
                            projectDb.run(`DELETE FROM LineList WHERE tagId = ?`, [updatedData.tagId], function (err) {
                                if (err) {
                                    console.error('Error deleting data from Line table:', err.message);
                                    return;
                                }
                                console.log(`Data deleted from Line table for tagId: ${updatedData.tagId}`);
                                projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from LineList table:', err.message);
                                        return;
                                    }

                                    mainWindow.webContents.send('all-lines-fetched', rows);
                                });
                            });
                        });
                    }

                    // If the type has changed from "line" to "equipment"
                    if (previousTagtype === 'Equipment' && updatedTagtype === 'Line') {
                        // Move data from Line table to Equipment table
                        projectDb.run(`INSERT INTO LineList (tagId,tag) VALUES (?,?)`, [updatedData.tagId, tagnumber], function (err) {
                            if (err) {
                                console.error('Error moving data from Line to Equipment:', err.message);
                                return;
                            }
                            console.log(`Data moved from Line to Equipment for tagId: ${updatedData.tagId}`);

                            projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from LineList table:', err.message);
                                    return;
                                }

                                mainWindow.webContents.send('all-lines-fetched', rows);
                            });

                            // Delete moved data from Line table
                            projectDb.run(`DELETE FROM EquipmentList WHERE tagId = ?`, [updatedData.tagId], function (err) {
                                if (err) {
                                    console.error('Error deleting data from Line table:', err.message);
                                    return;
                                }
                                console.log(`Data deleted from Line table for tagId: ${updatedData.tagId}`);
                                projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from Tree table:', err.message);
                                        return;
                                    }

                                    console.log('Data in the Equipment table:', rows);
                                    mainWindow.webContents.send('all-equipement-fetched', rows);
                                });

                            });
                        });
                    }


                    // Update data in TagInfo table (assuming tagId and tagtype are related to tagId)
                    projectDb.run(`UPDATE TagInfo SET type = ? WHERE tagId = ?`,
                        [updatedData.tagtype, updatedData.tagId],
                        function (err) {
                            if (err) {
                                console.error('Error updating data:', err.message);
                                return;
                            }
                            console.log(`Row updated with tag type: ${updatedData.tagtype}`);

                            // Fetch updated TagInfo table data
                            projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from TagInfo table:', err.message);
                                    return;
                                }
                                mainWindow.webContents.send('all-taginfo-fetched', rows);
                            });
                        });


                });

            }
        });
    });

    ipcMain.on('edit-project', (event, data) => {
        console.log("Entering edit-project handler");

        if (!projectdb) {
            console.error('Database not initialized.');
            event.reply('edit-project-response', { success: false, message: 'Database not initialized' });
            return;
        }
        if (!selectedFolderPath) {
            const { projectId, projectNumber, projectName, projectDescription, projectPath } = data;

            try {
                // Check if the projectId exists in the database
                projectdb.get('SELECT projectPath FROM projectdetails WHERE projectId = ?', [projectId], (err, row) => {
                    if (err) {
                        console.error('Error checking project ID:', err.message);
                        event.reply('edit-project-response', { success: false, message: 'Error checking project ID' });
                        return;
                    }

                    if (row) {
                        const currentProjectPath = row.projectPath;

                        // Calculate new project folder path based on projectNumber
                        const newFolderName = `${projectNumber}`;
                        const newProjectPath = path.join(path.dirname(currentProjectPath), newFolderName);
                        console.log("New Project Path:", newProjectPath);
                        console.log("Current Project Path:", currentProjectPath);

                        // Rename project folder if projectNumber has changed
                        if (currentProjectPath !== newProjectPath) {
                            fs.rename(currentProjectPath, newProjectPath, (err) => {
                                if (err) {
                                    console.error('Error renaming project folder:', err.message);
                                    event.reply('edit-project-response', { success: false, message: 'Error renaming project folder' });
                                } else {
                                    console.log(`Project folder renamed from ${currentProjectPath} to ${newProjectPath}`);
                                    updateProjectDetails(newProjectPath);
                                }
                            });
                        } else {
                            updateProjectDetails(currentProjectPath);
                        }
                    } else {
                        // Project ID does not exist
                        event.reply('edit-project-response', { success: false, message: 'Project ID does not exist' });
                        console.log('Project ID does not exist');
                    }
                });
            } catch (error) {
                console.error('Error in edit-project handler:', error);
                event.reply('edit-project-response', { success: false, message: 'Error editing project' });
            }

            function updateProjectDetails(projectPathToUpdate) {
                const projectDetailsPath = path.join(projectPathToUpdate, 'project_details.json');
                console.log("Project Details Path:", projectDetailsPath);

                fs.readFile(projectDetailsPath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading project_details.json:', err.message);
                        event.reply('edit-project-response', { success: false, message: `Error reading project_details.json: ${err.message}` });
                        return;
                    }

                    try {
                        // Parse the existing JSON data
                        const existingProjectData = JSON.parse(data);

                        // Update relevant fields in the JSON object
                        existingProjectData.projectNumber = projectNumber;
                        existingProjectData.projectName = projectName;
                        existingProjectData.projectDescription = projectDescription;

                        // Convert back to JSON string
                        const updatedProjectDetails = JSON.stringify(existingProjectData, null, 2);

                        // Write updated JSON back to project_details.json
                        fs.writeFile(projectDetailsPath, updatedProjectDetails, 'utf8', (err) => {
                            if (err) {
                                console.error('Error writing project_details.json:', err.message);
                                event.reply('edit-project-response', { success: false, message: 'Error writing project_details.json' });
                                return;
                            }

                            // Update the projectPath and other fields in the database
                            projectdb.run(`UPDATE projectdetails SET projectNumber = ?, projectName = ?, projectDescription = ?, projectPath = ? WHERE projectId = ?`,
                                [projectNumber, projectName, projectDescription, projectPathToUpdate, projectId],
                                function (err) {
                                    if (err) {
                                        console.error('Error updating project details:', err.message);
                                        event.reply('edit-project-response', { success: false, message: 'Error updating project details' });
                                    } else {
                                        console.log(`Project updated with ID: ${projectId}`);

                                        // Send success response to renderer process
                                        mainWindow.webContents.send('edit-project-response', {
                                            success: true,
                                            message: 'Project updated successfully',
                                            project: {
                                                projectId: projectId,
                                                projectNumber: projectNumber,
                                                projectName: projectName,
                                                projectDescription: projectDescription,
                                                projectPath: projectPathToUpdate
                                            }
                                        });

                                        // Fetch all updated project details
                                        projectdb.all('SELECT * FROM projectdetails', (err, rows) => {
                                            if (err) {
                                                console.error('Error fetching data:', err.message);
                                                return;
                                            }

                                            console.log("Fetched updated data:", rows);

                                            // Send fetched data to renderer process
                                            event.sender.send('data-fetched', rows);
                                            console.log("Sent 'data-fetched' event to renderer process");
                                        });
                                    }
                                }
                            );
                        });
                    } catch (parseErr) {
                        console.error('Error parsing project_details.json:', parseErr.message);
                        event.reply('edit-project-response', { success: false, message: 'Error parsing project_details.json' });
                    }
                });
            }
        } else {
            event.reply('edit-project-response', { success: false, message: 'Project folder is currently in use, please close the app and try again...' });
        }
    });

    ipcMain.on('import-equipment-list', async (event) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
        });

        if (result.canceled) return;

        const confirmation = await dialog.showMessageBox({
            type: 'question',
            buttons: ['Cancel', 'Upload'],
            defaultId: 1,
            title: 'Confirm Upload',
            message: 'Do you want to upload this file?'
        });

        if (confirmation.response !== 1) return;

        const filePath = result.filePaths[0];
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const equipmentList = xlsx.utils.sheet_to_json(sheet);

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            equipmentList.forEach((equipment) => {
                const { tag, descr, qty, capacity, type, materials, capacityDuty, dims, dsgnPress, opPress, dsgnTemp, opTemp, dryWeight, opWeight, supplier, remarks, initStatus, revision, revisionDate } = equipment;
                if (!tag) {
                    console.warn('Skipping equipment with empty tag.');
                    return;
                }

                projectDb.get('SELECT * FROM EquipmentList WHERE tag = ?', [tag], (err, row) => {
                    if (err) {
                        console.error('Error checking existing tag in EquipmentList:', err.message);
                        return;
                    }

                    if (row) {
                        // Merge existing data with new data, retaining old data where new data is not provided
                        const updatedEquipment = {
                            tagId: row.tagId,
                            tag: tag,
                            descr: descr || row.descr,
                            qty: qty || row.qty,
                            capacity: capacity || row.capacity,
                            type: type || row.type,
                            materials: materials || row.materials,
                            capacityDuty: capacityDuty || row.capacityDuty,
                            dims: dims || row.dims,
                            dsgnPress: dsgnPress || row.dsgnPress,
                            opPress: opPress || row.opPress,
                            dsgnTemp: dsgnTemp || row.dsgnTemp,
                            opTemp: opTemp || row.opTemp,
                            dryWeight: dryWeight || row.dryWeight,
                            opWeight: opWeight || row.opWeight,
                            supplier: supplier || row.supplier,
                            remarks: remarks || row.remarks,
                            initStatus: initStatus || row.initStatus,
                            revision: revision || row.revision,
                            revisionDate: revisionDate || row.revisionDate
                        };

                        // Update the existing record
                        projectDb.run(
                            `UPDATE EquipmentList SET descr = ?, qty = ?, capacity = ?, type = ?, materials = ?, capacityDuty = ?, dims = ?, dsgnPress = ?, opPress = ?, dsgnTemp = ?, opTemp = ?, dryWeight = ?, opWeight = ?, supplier = ?, remarks = ?, initStatus = ?, revision = ?, revisionDate = ? WHERE tag = ?`,
                            [updatedEquipment.descr, updatedEquipment.qty, updatedEquipment.capacity, updatedEquipment.type, updatedEquipment.materials, updatedEquipment.capacityDuty, updatedEquipment.dims, updatedEquipment.dsgnPress, updatedEquipment.opPress, updatedEquipment.dsgnTemp, updatedEquipment.opTemp, updatedEquipment.dryWeight, updatedEquipment.opWeight, updatedEquipment.supplier, updatedEquipment.remarks, updatedEquipment.initStatus, updatedEquipment.revision, updatedEquipment.revisionDate, tag],
                            (err) => {
                                if (err) {
                                    console.error('Error updating data in EquipmentList:', err.message);
                                    return;
                                }
                                console.log(`Row updated in EquipmentList with tag: ${updatedEquipment.tagId}`);
                                event.reply("tag-exists", { success: true, message: `Tag number ${tag} already exist and data updated` })
                                projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from EquipmentList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-equipement-fetched', rows);
                                });
                            }
                        );

                        // Update TagInfo and Tags if necessary (assuming these tables don't need updates since they are for tag info)
                    } else {
                        const TagId = generateCustomID('T');

                        projectDb.run(
                            `INSERT OR IGNORE INTO EquipmentList (tagId, tag, descr, qty, capacity, type, materials, capacityDuty, dims, dsgnPress, opPress, dsgnTemp, opTemp, dryWeight, opWeight, supplier, remarks, initStatus, revision, revisionDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [TagId, tag, descr, qty, capacity, type, materials, capacityDuty, dims, dsgnPress, opPress, dsgnTemp, opTemp, dryWeight, opWeight, supplier, remarks, initStatus, revision, revisionDate],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into EquipmentList:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into EquipmentList with tag: ${TagId, descr}`);
                                projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from EquipmentList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-equipement-fetched', rows);
                                });
                            }
                        );

                        projectDb.run(
                            'INSERT OR IGNORE INTO TagInfo (tagId, tag, type) VALUES (?, ?, ?)',
                            [TagId, tag, 'Equipment'],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into TagInfo:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into TagInfo with tag number: ${TagId}`);
                                projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from TagInfo table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-taginfo-fetched', rows);
                                });
                            }
                        );

                        projectDb.run(
                            'INSERT OR IGNORE INTO Tags (tagId, number, type) VALUES (?, ?, ?)',
                            [TagId, tag, 'Equipment'],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into Tags:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into Tags with tag number: ${TagId}`);
                                projectDb.all("SELECT * FROM Tags", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from Tags table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-tags-fetched', rows);
                                });
                            }
                        );
                    }
                });
            });
        });
    });

    ipcMain.on('import-line-list', async (event) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
        });

        if (result.canceled) return;
        const confirmation = await dialog.showMessageBox({
            type: 'question',
            buttons: ['Cancel', 'Upload'],
            defaultId: 1,
            title: 'Confirm Upload',
            message: 'Do you want to upload this file?'
        });

        if (confirmation.response !== 1) return;

        const filePath = result.filePaths[0];
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const lineList = xlsx.utils.sheet_to_json(sheet);

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            lineList.forEach((line) => {
                const { tag, fluidCode, lineId, medium, lineSizeIn, lineSizeNb, pipingSpec, insType, insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup, chemCleaning, pwht } = line;

                projectDb.get('SELECT * FROM LineList WHERE tag = ?', [tag], (err, row) => {
                    if (err) {
                        console.error('Error checking existing tag in LineList:', err.message);
                        return;
                    }

                    if (row) {
                        // Merge existing data with new data, retaining old data where new data is not provided
                        const updatedLine = {
                            tagId: row.tagId,
                            tag: tag,
                            fluidCode: fluidCode || row.fluidCode,
                            lineId: lineId || row.lineId,
                            medium: medium || row.medium,
                            lineSizeIn: lineSizeIn || row.lineSizeIn,
                            lineSizeNb: lineSizeNb || row.lineSizeNb,
                            pipingSpec: pipingSpec || row.pipingSpec,
                            insType: insType || row.insType,
                            insThickness: insThickness || row.insThickness,
                            heatTrace: heatTrace || row.heatTrace,
                            lineFrom: lineFrom || row.lineFrom,
                            lineTo: lineTo || row.lineTo,
                            maxOpPress: maxOpPress || row.maxOpPress,
                            maxOpTemp: maxOpTemp || row.maxOpTemp,
                            dsgnPress: dsgnPress || row.dsgnPress,
                            minDsgnTemp: minDsgnTemp || row.minDsgnTemp,
                            maxDsgnTemp: maxDsgnTemp || row.maxDsgnTemp,
                            testPress: testPress || row.testPress,
                            testMedium: testMedium || row.testMedium,
                            testMediumPhase: testMediumPhase || row.testMediumPhase,
                            massFlow: massFlow || row.massFlow,
                            volFlow: volFlow || row.volFlow,
                            density: density || row.density,
                            velocity: velocity || row.velocity,
                            paintSystem: paintSystem || row.paintSystem,
                            ndtGroup: ndtGroup || row.ndtGroup,
                            chemCleaning: chemCleaning || row.chemCleaning,
                            pwht: pwht || row.pwht
                        };

                        // Update the existing record
                        projectDb.run(
                            `UPDATE LineList SET fluidCode = ?, lineId = ?, medium = ?, lineSizeIn = ?, lineSizeNb = ?, pipingSpec = ?, insType = ?, insThickness = ?, heatTrace = ?, lineFrom = ?, lineTo = ?, maxOpPress = ?, maxOpTemp = ?, dsgnPress = ?, minDsgnTemp = ?, maxDsgnTemp = ?, testPress = ?, testMedium = ?, testMediumPhase = ?, massFlow = ?, volFlow = ?, density = ?, velocity = ?, paintSystem = ?, ndtGroup = ?, chemCleaning = ?, pwht = ? WHERE tag = ?`,
                            [updatedLine.fluidCode, updatedLine.lineId, updatedLine.medium, updatedLine.lineSizeIn, updatedLine.lineSizeNb, updatedLine.pipingSpec, updatedLine.insType, updatedLine.insThickness, updatedLine.heatTrace, updatedLine.lineFrom, updatedLine.lineTo, updatedLine.maxOpPress, updatedLine.maxOpTemp, updatedLine.dsgnPress, updatedLine.minDsgnTemp, updatedLine.maxDsgnTemp, updatedLine.testPress, updatedLine.testMedium, updatedLine.testMediumPhase, updatedLine.massFlow, updatedLine.volFlow, updatedLine.density, updatedLine.velocity, updatedLine.paintSystem, updatedLine.ndtGroup, updatedLine.chemCleaning, updatedLine.pwht, tag],
                            (err) => {
                                if (err) {
                                    console.error('Error updating data in LineList:', err.message);
                                    return;
                                }
                                console.log(`Row updated in LineList with tag: ${updatedLine.tagId}`);
                                event.reply("tag-exists", { success: true, message: `Tag number ${tag} already exist and data updated` })
                                projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from LineList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-lines-fetched', rows);
                                });
                            }
                        );

                        // Update TagInfo and Tags if necessary (assuming these tables don't need updates since they are for tag info)
                    } else {
                        const TagId = generateCustomID('T');

                        projectDb.run(
                            `INSERT OR IGNORE INTO LineList (tagId,tag, fluidCode, lineId, medium, lineSizeIn, lineSizeNb, pipingSpec, insType, insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup, chemCleaning, pwht) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
                            [TagId, tag, fluidCode, lineId, medium, lineSizeIn, lineSizeNb, pipingSpec, insType, insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup, chemCleaning, pwht],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into LineList:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into LineList with tag: ${tag}`);
                                projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from LineList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-lines-fetched', rows);
                                });
                            }
                        );

                        projectDb.run(
                            'INSERT OR IGNORE INTO TagInfo (tagId,tag, type) VALUES (?, ?,?)',
                            [TagId, tag, 'Line'],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into TagInfo:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into TagInfo with tag number: ${tag}`);
                                projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from TagInfo table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-taginfo-fetched', rows);
                                });
                            }
                        );

                        projectDb.run(
                            'INSERT OR IGNORE INTO Tags (tagId, number, type) VALUES (?, ?, ?)',
                            [TagId, tag, 'Line'],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into Tags:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into Tags with tag number: ${tag}`);
                                projectDb.all("SELECT * FROM Tags", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from Tags table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-tags-fetched', rows);
                                });
                            }
                        );
                    }
                });
            });
        });
    });

    ipcMain.on('delete-all-tags', async (event) => {
        console.log("Received request to remove all tags");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        // Confirmation dialog
        const confirmation = await dialog.showMessageBox({
            type: 'warning',
            buttons: ['Cancel', 'Delete All'],
            defaultId: 1,
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete all tags? This action cannot be undone.'
        });

        if (confirmation.response !== 1) return;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch all tagNos from the Tags table
            projectDb.all('SELECT number FROM Tags', (err, rows) => {
                if (err) {
                    console.error('Error fetching tagNos from Tags table:', err.message);
                    projectDb.close();
                    return;
                }

                const tagNos = rows.map(row => row.number);

                if (tagNos.length > 0) {
                    // Delete corresponding rows in the Tree table
                    const placeholders = tagNos.map(() => '?').join(',');
                    projectDb.run(`DELETE FROM Tree WHERE tag IN (${placeholders})`, tagNos, (err) => {
                        if (err) {
                            console.error('Error deleting from Tree table:', err.message);
                        } else {
                            console.log('All corresponding rows in the Tree table deleted successfully.');
                        }

                        // Fetch updated data to send back to the renderer
                        projectDb.all("SELECT * FROM Tree", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                            } else {
                                console.log('Data in the Tree table after deletion:', rows);
                                mainWindow.webContents.send('all-tags-under-sys-fetched', rows);
                            }
                        });
                    });
                }

                // Delete all rows in the Tags table
                projectDb.run('DELETE FROM Tags', (err) => {
                    if (err) {
                        console.error('Error deleting all data from Tags table:', err.message);
                        return;
                    }
                    console.log('All rows in the Tags table deleted successfully.');

                    // Fetch updated data to send back to the renderer
                    projectDb.all("SELECT * FROM Tags", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tags table:', err.message);
                            return;
                        }

                        console.log('Data in the Tags table after deletion:', rows);
                        mainWindow.webContents.send('all-tags-fetched', rows);
                    });
                });

                // Delete all rows in the LineList table
                projectDb.run('DELETE FROM LineList', (err) => {
                    if (err) {
                        console.error('Error deleting all data from LineList table:', err.message);
                        return;
                    }
                    console.log('All rows in the LineList table deleted successfully.');

                    // Fetch updated data to send back to the renderer
                    projectDb.all("SELECT * FROM LineList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from LineList table:', err.message);
                            return;
                        }

                        console.log('Data in the LineList table after deletion:', rows);
                        mainWindow.webContents.send('all-lines-fetched', rows);
                    });
                });

                // Delete all rows in the EquipmentList table
                projectDb.run('DELETE FROM EquipmentList', (err) => {
                    if (err) {
                        console.error('Error deleting all data from EquipmentList table:', err.message);
                        return;
                    }
                    console.log('All rows in the EquipmentList table deleted successfully.');

                    // Fetch updated data to send back to the renderer
                    projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from EquipmentList table:', err.message);
                            return;
                        }

                        console.log('Data in the EquipmentList table after deletion:', rows);
                        mainWindow.webContents.send('all-equipement-fetched', rows);
                    });
                });

                // Delete all rows in the TagInfo table
                projectDb.run('DELETE FROM TagInfo', (err) => {
                    if (err) {
                        console.error('Error deleting all data from TagInfo table:', err.message);
                        return;
                    }
                    console.log('All rows in the TagInfo table deleted successfully.');

                    // Fetch updated data to send back to the renderer
                    projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from TagInfo table:', err.message);
                            return;
                        }

                        console.log('Data in the TagInfo table after deletion:', rows);
                        mainWindow.webContents.send('all-taginfo-fetched', rows);
                    });
                });

                projectDb.run('DELETE FROM FileBoundingTable', (err) => {
                    if (err) {
                        console.error('Error deleting all data from FileBoundingTable table:', err.message);
                        return;
                    }
                    console.log('All rows in the FileBoundingTable table deleted successfully.');
                    projectDb.all("SELECT * FROM FileBoundingTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from FileBoundingTable table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-files-table', rows);
                    });
                })
                projectDb.run('DELETE FROM BoundingboxTable', (err) => {
                    if (err) {
                        console.error('Error deleting all data from BoundingboxTable table:', err.message);
                        return;
                    }
                    console.log('All rows in the BoundingboxTable table deleted successfully.');
                    projectDb.all("SELECT * FROM BoundingboxTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from BoundingboxTable table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-mesh-table', rows);
                    });
                });

                // Optionally delete associated files
                // Assuming files are stored in 'Tags' folder under selectedFolderPath
                const tagsFolderPath = path.join(selectedFolderPath, 'Tags');
                fs.readdir(tagsFolderPath, (err, files) => {
                    if (err) {
                        console.error('Error reading Tags folder:', err.message);
                        return;
                    }
                    files.forEach(file => {
                        const filePath = path.join(tagsFolderPath, file);
                        fs.unlink(filePath, (err) => {
                            if (err && err.code !== 'ENOENT') {
                                console.error(`Error deleting file '${file}':`, err.message);
                            } else {
                                console.log(`File '${file}' deleted from Tags folder.`);
                            }
                        });
                    });
                });

                projectDb.close((err) => {
                    if (err) {
                        console.error('Error closing the project database:', err.message);
                    } else {
                        console.log('Project database closed successfully.');
                    }
                });
            });
        });
    });

    ipcMain.on('import-tag', async (event, data) => {
        console.log(data);
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            data.forEach((line) => {
                const { tagNumber, name, type } = line;

                projectDb.get('SELECT * FROM Tags WHERE number = ?', [tagNumber], (err, row) => {
                    if (err) {
                        console.error('Error checking existing tag in tag table:', err.message);
                        return;
                    }

                    if (row) {
                        event.reply("tag-exists", { success: true, message: `Tag number ${tagNumber} already exist and data updated` })
                    } else {
                        const TagId = generateCustomID('T');
                        if (type === 'Line') {
                            projectDb.run(
                                `INSERT OR IGNORE INTO LineList (tagId,tag) VALUES (?, ?)`,
                                [TagId, tagNumber],
                                (err) => {
                                    if (err) {
                                        console.error('Error inserting data into LineList:', err.message);
                                        return;
                                    }
                                    console.log(`Row inserted into LineList with tag: ${tagNumber}`);
                                    projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                        if (err) {
                                            console.error('Error fetching data from LineList table:', err.message);
                                            return;
                                        }
                                        mainWindow.webContents.send('all-lines-fetched', rows);
                                    });
                                }
                            );
                        }
                        else if (type === 'Equipment') {
                            projectDb.run(
                                `INSERT OR IGNORE INTO EquipmentList (tagId,tag) VALUES (?, ?)`,
                                [TagId, tagNumber],
                                (err) => {
                                    if (err) {
                                        console.error('Error inserting data into EquipmentList:', err.message);
                                        return;
                                    }
                                    console.log(`Row inserted into EquipmentList with tag: ${tagNumber}`);
                                    projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                        if (err) {
                                            console.error('Error fetching data from EquipmentList table:', err.message);
                                            return;
                                        }
                                        mainWindow.webContents.send('all-equipement-fetched', rows);
                                    });
                                }
                            );
                        }


                        projectDb.run(
                            'INSERT OR IGNORE INTO TagInfo (tagId,tag, type) VALUES (?, ?,?)',
                            [TagId, tagNumber, type],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into TagInfo:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into TagInfo with tag number: ${tagNumber}`);
                                projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from TagInfo table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-taginfo-fetched', rows);
                                });
                            }
                        );

                        projectDb.run(
                            'INSERT OR IGNORE INTO Tags (tagId, number,name, type) VALUES (?, ?, ?,?)',
                            [TagId, tagNumber, name, type],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into Tags:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into Tags with tag number: ${tagNumber}`);
                                projectDb.all("SELECT * FROM Tags", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from Tags table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-tags-fetched', rows);
                                });
                            }
                        );
                    }
                });
            });
        });

    });

    ipcMain.on('import-taginfo-list', async (event) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
        });

        if (result.canceled) return;
        const confirmation = await dialog.showMessageBox({
            type: 'question',
            buttons: ['Cancel', 'Upload'],
            defaultId: 1,
            title: 'Confirm Upload',
            message: 'Do you want to upload this file?'
        });

        if (confirmation.response !== 1) return;

        const filePath = result.filePaths[0];
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const taginfolist = xlsx.utils.sheet_to_json(sheet);

        const projectDb = new sqlite3.Database(databasePath, async (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all("SELECT * FROM UserTagInfoFieldUnits", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }
            });
            const userFieldUnits = await new Promise((resolve, reject) => {
                projectDb.all("SELECT * FROM UserTagInfoFieldUnits", (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });

            taginfolist.forEach((taginfo) => {
                const { tag } = taginfo;

                projectDb.get('SELECT * FROM TagInfo WHERE tag = ?', [tag], (err, row) => {
                    if (err) {
                        console.error('Error checking existing tag in LineList:', err.message);
                        return;
                    }

                    if (row) {
                        const updatedTagInfo = {
                            tagId: row.tagId,
                            tag: tag,
                            type: taginfo.type || row.type,
                        }
                        userFieldUnits.forEach((unitRow, index) => {
                            const rowName = `taginfo${index + 1}`;
                            const fieldName = unitRow.field;
                            updatedTagInfo[rowName] = taginfo[fieldName] || row[rowName];
                        });
                        console.log(updatedTagInfo);

                        // Construct the update query
                        let updateQuery = 'UPDATE TagInfo SET ';
                        const updateValues = [];

                        Object.keys(updatedTagInfo).forEach((key) => {
                            if (key !== 'tagId') {
                                updateQuery += `${key} = ?, `;
                                updateValues.push(updatedTagInfo[key]);
                            }
                        });

                        // Remove the trailing comma and space, and add the WHERE clause
                        updateQuery = updateQuery.slice(0, -2) + ' WHERE tagId = ?';
                        updateValues.push(updatedTagInfo.tagId);

                        projectDb.run(updateQuery, updateValues, (updateErr) => {
                            if (updateErr) {
                                console.error('Error updating tag in TagInfo:', updateErr.message);
                            } else {
                                console.log(`Tag ${tag} updated successfully.`);
                                // Fetch updated data from the LineList table
                                projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from tagInfo table:', err.message);
                                        return;
                                    }

                                    mainWindow.webContents.send('all-taginfo-fetched', rows);
                                });
                            }
                        });
                    }

                    else {
                        const TagId = generateCustomID('T');
                        const newTagInfo = {
                            tagId: TagId,
                            tag: tag,
                            type: taginfo.type,
                        };

                        userFieldUnits.forEach((unitRow, index) => {
                            const rowName = `taginfo${index + 1}`;
                            const fieldName = unitRow.field;
                            newTagInfo[rowName] = taginfo[fieldName] || '';
                        });
                        const fields = Object.keys(newTagInfo).join(', ');
                        const placeholders = Object.keys(newTagInfo).map(() => '?').join(', ');
                        const insertQuery = `INSERT INTO TagInfo (${fields}) VALUES (${placeholders})`;

                        projectDb.run(insertQuery, Object.values(newTagInfo), (insertErr) => {
                            if (insertErr) {
                                console.error('Error inserting new tag into TagInfo:', insertErr.message);
                            } else {
                                console.log(`Tag ${tag} inserted successfully.`);
                                // Insert into Tags table
                                projectDb.run('INSERT INTO Tags (tagId, number, type) VALUES (?, ?, ?)', [TagId, tag, newTagInfo.type], (tagsErr) => {
                                    if (tagsErr) {
                                        console.error('Error inserting tag into Tags:', tagsErr.message);
                                    }
                                });
                                // Insert into LineList or Equipment table based on type
                                if (newTagInfo.type === 'Line') {
                                    projectDb.run('INSERT INTO LineList (tagId, tag) VALUES (?, ?)', [TagId, tag], (lineErr) => {
                                        if (lineErr) {
                                            console.error('Error inserting tag into LineList:', lineErr.message);
                                        }
                                    });
                                } else if (newTagInfo.type === 'Equipment') {
                                    projectDb.run('INSERT INTO EquipmentList (tagId, tag) VALUES (?, ?)', [TagId, tag], (equipmentErr) => {
                                        if (equipmentErr) {
                                            console.error('Error inserting tag into Equipment:', equipmentErr.message);
                                        }
                                    });
                                }
                                // Fetch updated data from the TagInfo table
                                projectDb.all("SELECT * FROM TagInfo", (fetchErr, rows) => {
                                    if (fetchErr) {
                                        console.error('Error fetching data from TagInfo table:', fetchErr.message);
                                        return;
                                    }

                                    mainWindow.webContents.send('all-taginfo-fetched', rows);
                                });
                                projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from LineList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-lines-fetched', rows);
                                });
                                projectDb.all("SELECT * FROM Tags", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from Tags table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-tags-fetched', rows);
                                });
                                projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from EquipmentList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-equipement-fetched', rows);
                                });

                            }
                        })

                    }
                })
            })



        });
    });

    ipcMain.on('delete-all-comments', async (event) => {
        console.log("Received request to remove all comments");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        // Confirmation dialog
        const confirmation = await dialog.showMessageBox({
            type: 'warning',
            buttons: ['Cancel', 'Delete All'],
            defaultId: 1,
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete all comments? This action cannot be undone.'
        });

        if (confirmation.response !== 1) return;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Delete all rows in the Tags table
            projectDb.run('DELETE FROM CommentTable', (err) => {
                if (err) {
                    console.error('Error deleting all data from comments table:', err.message);
                    return;
                }
                console.log('All rows in the comments table deleted successfully.');

                // Fetch updated data to send back to the renderer
                projectDb.all("SELECT * FROM CommentTable", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from comments table:', err.message);
                        return;
                    }

                    console.log('Data in the comments table after deletion:', rows);
                    mainWindow.webContents.send('all-comments', rows);
                });
            });

        })
    });

    ipcMain.on('status-assigned', (event, data) => {
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            projectDb.get("SELECT MAX(number) AS max_number FROM CommentStatus", function (err, row) {
                const number = parseInt(row.max_number) + 1 || 1;

                projectDb.run(`INSERT OR IGNORE INTO CommentStatus (number, statusname, color) VALUES (?, ?, ?)`, [number, data.statusname, data.color], (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                    event.reply("tag-exists", { success: true, message: `Comment Status added` })
                    projectDb.all("SELECT * FROM CommentStatus", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }
                        console.log("all-status", rows)
                        mainWindow.webContents.send('all-status', rows);
                    });
                });
            });
        });

    })

    ipcMain.on('delete-status', (event, number) => {
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get("SELECT statusname FROM CommentStatus WHERE number = ?", [number], (err, row) => {
                if (err) {
                    console.error('Error fetching status name:', err.message);
                    return;
                }

                if (row && (row.statusname === 'open' || row.statusname === 'closed')) {
                    console.log(`Cannot delete status with number ${number} as it is ${row.statusname}`);
                    event.reply("tag-exists", { success: false, message: `Cannot delete status "${row.statusname}"` });
                } else {
                    projectDb.run("DELETE FROM CommentStatus WHERE number = ?", [number], (err) => {
                        if (err) {
                            console.error('Error deleting status:', err.message);
                            return;
                        }

                        projectDb.all("SELECT * FROM CommentStatus", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from CommentStatus table:', err.message);
                                return;
                            }
                            console.log("all-status", rows);
                            mainWindow.webContents.send('all-status', rows);
                        });
                    });
                }
            });
        });
    });

    ipcMain.on('import-comment-details', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
        });

        if (result.canceled) return;

        const confirmation = await dialog.showMessageBox({
            type: 'question',
            buttons: ['Cancel', 'Upload'],
            defaultId: 1,
            title: 'Confirm Upload',
            message: 'Do you want to upload this file?'
        });

        if (confirmation.response !== 1) return;

        const filePath = result.filePaths[0];
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const commentList = xlsx.utils.sheet_to_json(sheet);

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Start the numbering from 3
            let currentNumber = 3;

            const insertComment = (data, callback) => {
                const { statusname, color } = data;

                projectDb.run(
                    `INSERT OR IGNORE INTO CommentStatus (number, statusname, color) VALUES (?, ?, ?)`,
                    [currentNumber, statusname, color],
                    (err) => {
                        if (err) {
                            console.error('Error inserting data into CommentStatus:', err.message);
                            return;
                        }
                        console.log(`Row inserted into CommentStatus: ${currentNumber}`);
                        currentNumber += 1;
                        callback();
                    }
                );
            };

            // Sequentially insert comments to ensure unique numbers
            const insertCommentsSequentially = (comments) => {
                if (comments.length === 0) {
                    // Fetch and send updated data back to renderer
                    projectDb.all("SELECT * FROM CommentStatus", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from CommentStatus table:', err.message);
                            return;
                        }
                        mainWindow.webContents.send('all-status', rows);
                    });
                    return;
                }
                const comment = comments.shift();
                insertComment(comment, () => {
                    insertCommentsSequentially(comments);
                });
            };

            insertCommentsSequentially(commentList);
        });
    });

    ipcMain.on('save-camera-view', (event, data) => {
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            console.log(data);
            const { name, posX, posY, posZ, targX, targY, targZ } = data;

            projectDb.get('SELECT name FROM Views WHERE name = ?', [name], (err, row) => {
                if (err) {
                    console.error('Error querying Views table:', err.message);
                    event.reply('save-camera-view-response', { success: false, error: err.message });
                } else if (row) {
                    console.log(`View with name ${name} already exists.`);
                    event.reply('save-camera-view-response', { success: false, message: 'View name already exists.' });
                } else {
                    projectDb.run(
                        'INSERT INTO Views (name, posX, posY, posZ, targX, targY, targZ) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [name, posX, posY, posZ, targX, targY, targZ],
                        (err) => {
                            if (err) {
                                console.error('Error inserting data into Views:', err.message);
                                event.reply('save-camera-view-response', { success: false, error: err.message });
                            } else {
                                console.log(`View saved successfully: ${name}`);
                                event.reply('save-camera-view-response', { success: true, message: 'Camera view saved' });
                                projectDb.all("SELECT * FROM Views", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from Views table:', err.message);
                                        return;
                                    }
                                    console.log("all-Views", rows);
                                    mainWindow.webContents.send('all-views', rows);
                                });
                            }
                        }
                    );
                }
            });
        });
    });

    ipcMain.on('delete-view', (event, data) => {
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            console.log(data);
            projectDb.get('SELECT name FROM Views WHERE name = ?', [data], (err, row) => {
                if (err) {
                    console.error('Error querying Views table:', err.message);
                    event.reply('save-camera-view-response', { success: false, error: err.message });
                } else if (row) {
                    projectDb.run("DELETE FROM Views WHERE name = ?", [data], (err) => {
                        if (err) {
                            console.error('Error deleting all views:', err.message);
                            event.reply('delete-views-response', { success: false, error: err.message });
                        } else {
                            console.log('All views deleted successfully.');
                            event.reply('delete-views-response', { success: true, message: 'Views deleted successfully.' });
                            projectDb.all("SELECT * FROM Views", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from Views table:', err.message);
                                    return;
                                }
                                console.log("all-Views", rows);
                                mainWindow.webContents.send('all-views', rows);
                            });
                        }
                    });



                }

            });
        });
    });

    ipcMain.on('open-in-three', (event, data) => {
        console.log("Received request to search from global modal");
        console.log(data);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // First, check in the Tags table
            projectDb.get('SELECT filename FROM Tags WHERE tagId = ?', [data], (err, row) => {
                if (err) {
                    console.error('Error querying the Tags table:', err.message);
                    event.sender.send('tag-not-found', { success: false, message: 'Files not found' });
                    return;
                }

                if (row && row.filename) {
                    const documentsFolderPath = path.join(selectedFolderPath, 'Tags');
                    const filePath = path.join(documentsFolderPath, row.filename);
                    console.log("Tag Path", filePath);
                    const filename = path.basename(filePath);

                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', { success: true, filePath: filePath });
                        mainWindow.webContents.send('fetched-Tag-path', { tag: data, filePath: filePath, filename: filename });
                    } else {
                        console.error('File not found in Tags folder');
                        event.sender.send('doc-found', { success: false, message: 'File not found in Tags folder' });
                    }
                } else {
                    // If not found in Tags, check in Unassigned
                    projectDb.get('SELECT filename FROM UnassignedModels WHERE number = ?', [data], (err, row) => {
                        if (err) {
                            console.error('Error querying the Unassigned table:', err.message);
                            event.sender.send('tag-not-found', { success: false, message: 'Files not found' });
                            return;
                        }

                        if (row && row.filename) {
                            console.log(" row.filename", row.filename);
                            const documentsFolderPath = path.join(selectedFolderPath, 'unassigned_models');
                            const filePath = path.join(documentsFolderPath, row.filename);
                            console.log("Unassigned Path", filePath);
                            const filename = path.basename(filePath);

                            if (fs.existsSync(filePath)) {
                                console.log(`File found: ${filePath}`);
                                event.sender.send('doc-found', { success: true, filePath: filePath });
                                mainWindow.webContents.send('fetched-Tag-path', { tag: data, filePath: filePath, filename: filename });
                            } else {
                                console.error('File not found in unassigned_models folder');
                                event.sender.send('doc-found', { success: false, message: 'File not found in unassigned_models folder' });
                            }
                        } else {
                            // If not found in both Tags and Unassigned
                            event.sender.send('three-path', { success: false, message: 'Files not found' });
                        }
                    });
                }
            });
        });
    });

    ipcMain.on('get-mesh-data', (event, data) => {
        console.log("Received request to search from three");
        console.log(data);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // First, check in the Tags table
            projectDb.get('SELECT * FROM BoundingboxTable WHERE meshid = ?', [data], (err, row) => {
                if (err) {
                    console.error('Error querying the BoundingboxTable table:', err.message);
                    event.sender.send('mesh-data-not-found', { success: false, message: 'Files not found' });
                    return;
                }

                if (row) {
                    console.log(row)
                    // Send the retrieved data back to the renderer process
                    event.sender.send('mesh-data-found', { success: true, data: row });
                } else {
                    event.sender.send('mesh-data-not-found', { success: false, message: 'Files not found' });
                }
            });
        });
    })
    ipcMain.on('save-glb-file', async (event, { path, filename, data }) => {

        try {
            const dirPath = path.dirname(filePath);
            const fileStem = path.basename(filename, path.extname(filename));
            const convertedFileName = `${fileStem}.glb`;
            const outputFilePath = path.join(dirPath, convertedFileName);
            event.sender.send('fbx-conversion-success', { convertedFilePath: outputFilePath, convertedFileName: convertedFileName });
        } catch (error) {
            console.error('Error saving GLB file:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.on('rvm-gltf-converter', (event, file) => {
        console.log(file);
        const filePath = file.path;

        const dirPath = path.dirname(filePath)
        const fileStem = path.basename(filePath).split(path.extname(filePath))[0]
        const outputFilePath = path.resolve(dirPath, fileStem + '.glb')

        const execPath = path.resolve('converters', 'rvmparser', 'rvmparser.exe')
        const execParams = ['--output-gltf=' + outputFilePath, '--tolerance=0.01', filePath]
        console.log("execParams", execParams)

        execFile(execPath, execParams, function (err) {
            if (err) {
                console.error(err);
                event.reply('conversion-error', { message: 'Conversion failed' });
                return;
            }
            const convertedFileName = path.basename(outputFilePath);
            event.sender.send('rvm-conversion-success', { convertedFilePath: outputFilePath, convertedFileName: convertedFileName });
        })

    });

    ipcMain.on('iges-gltf-converter', (event, file) => {
        console.log(file);
        const filePath = file.path;

        const dirPath = path.dirname(filePath)
        const fileStem = path.basename(filePath).split(path.extname(filePath))[0]
        const outputFilePath = path.resolve(dirPath, fileStem + '.glb')

        const execPath = path.resolve('converters', 'mayo', 'mayo.exe')
        const execParams = ['--export', outputFilePath, filePath]
        console.log("execParams", execParams)

        execFile(execPath, execParams, function (err) {
            if (err) {
                console.error(err);
                event.reply('conversion-error', { message: 'Conversion failed' });
                return;
            }
            console.log("outputFilePath", outputFilePath);
            const convertedFileName = path.basename(outputFilePath);
            console.log("convertedFileName", convertedFileName)
            event.sender.send('iges-conversion-success', { convertedFilePath: outputFilePath, convertedFileName: convertedFileName });


        })
    });

    ipcMain.on('ifc-glb-converter', (event, file) => {
        try {
            console.log(file);
            const filePath = file.path;
            const dirPath = path.dirname(filePath);
            const fileStem = path.basename(filePath, path.extname(filePath));
            const outputFilePath = path.resolve(dirPath, fileStem + '.glb');

            const execPath = path.resolve('converters', 'IfcConvert', 'IfcConvert.exe');
            const execParams = [filePath, outputFilePath];
            console.log("execParams", execParams);

            execFile(execPath, execParams, function (err) {
                console.log("enter");

                if (err) {
                    console.error('Conversion error:', err);
                    event.reply('conversion-error', { message: 'Conversion failed', error: err.message });
                    return;
                }
                console.log("outputFilePath", outputFilePath);
                const convertedFileName = path.basename(outputFilePath);
                event.sender.send('ifc-conversion-success', { convertedFilePath: outputFilePath, convertedFileName: convertedFileName });
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            event.reply('conversion-error', { message: 'Unexpected error occurred', error: error.message });
        }
    });

    ipcMain.on('dae-gltf-converter', (event, file) => {
        console.log(file);
        const filePath = file.path;

        const dirPath = path.dirname(filePath)
        const fileStem = path.basename(filePath).split(path.extname(filePath))[0]
        const outputFilePath = path.resolve(dirPath, fileStem + '.glb')

        const execPath = path.resolve('converters', 'COLLADA2GLTF', 'COLLADA2GLTF-bin.exe');
        const execParams = ['--input', filePath, '--output', outputFilePath]
        console.log("execParams", execParams)

        execFile(execPath, execParams, function (err) {
            if (err) {
                console.error(err);
                event.reply('conversion-error', { message: 'Conversion failed' });
                return;
            }
            console.log("outputFilePath", outputFilePath);
            const convertedFileName = path.basename(outputFilePath);
            event.sender.send('dae-conversion-success', { convertedFilePath: outputFilePath, convertedFileName: convertedFileName });


        })
    });

    ipcMain.on('saveUserDefinedFields', (event, fields) => {
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                event.reply('saveUserDefinedFieldsResult', { success: false, error: err.message });
                return;
            }

            // Begin transaction for atomic operation
            projectDb.run('BEGIN TRANSACTION');

            fields.forEach(({ id, field, unit }) => {
                projectDb.run(
                    'INSERT OR REPLACE INTO UserTagInfoFieldUnits (id, field, unit) VALUES (?, ?, ?)',
                    [id, field, unit],
                    (err) => {
                        if (err) {
                            console.error('Error saving fields:', err);
                            event.reply('saveUserDefinedFieldsResult', { success: false, error: err.message });
                        } else {
                            console.log('Field saved successfully:', { id, field, unit });
                        }
                    }
                );
            });

            // Commit transaction
            projectDb.run('COMMIT', (err) => {
                if (err) {
                    console.error('Error committing transaction:', err);
                    event.reply('saveUserDefinedFieldsResult', { success: false, error: err.message });
                } else {
                    console.log('Transaction committed successfully.');
                    event.reply('saveUserDefinedFieldsResult', { success: true });

                    // Fetch all data after successful commit (optional)
                    projectDb.all("SELECT * FROM UserTagInfoFieldUnits", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from UserTagInfoFieldUnits table:', err.message);
                        } else {
                            console.log("All fields from UserTagInfoFieldUnits:", rows);
                            mainWindow.webContents.send('all-fields-user-defined', rows);
                        }
                    });
                }
            });
        });
    });

    ipcMain.on('save-area-code-data', (event, data) => {
        console.log("Received request to save area");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            const areaid = generateCustomID('A');
            // Insert data into the Areatable of the project's database
            projectDb.run(`INSERT INTO Areatable (areaId, area, name) VALUES (?, ?, ?)`, [areaid, data.code, data.name], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with ID: ${this.lastID}`);
                event.sender.send('area-added-response', { success: true, message: 'Area added successfully!!' });
            });
            projectDb.all("SELECT * FROM Areatable", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Areatable:', err.message);
                    return;
                }

                console.log('Data in the Areatable:', rows);
                event.sender.send('all-area-table-fetched', rows);
            });
        });
    });

    ipcMain.on('save-disc-code-data', (event, data) => {
        console.log("Received request to save disc");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            const areaid = generateCustomID('D');
            // Insert data into the Disctable of the project's database
            projectDb.run(`INSERT INTO Disctable (discId, disc, name) VALUES (?, ?, ?)`, [areaid, data.code, data.name], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);

                    return;
                }
                console.log(`Row inserted with ID: ${this.lastID}`);
                event.sender.send('disc-added-response', { success: true, message: 'Discipline added successfully!!' });
            });
            projectDb.all("SELECT * FROM Disctable", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Disctable:', err.message);
                    return;
                }

                console.log('Data in the Disctable:', rows);
                event.sender.send('all-disc-table-fetched', rows);
            });
        });
    });

    ipcMain.on('save-sys-code-data', (event, data) => {
        console.log("Received request to save sys");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            const areaid = generateCustomID('S');
            // Insert data into the Systable of the project's database
            projectDb.run(`INSERT INTO Systable (sysId, sys, name) VALUES (?, ?, ?)`, [areaid, data.code, data.name], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with ID: ${this.lastID}`);
                event.sender.send('sys-added-response', { success: true, message: 'System added successfully!!' });
            });
            projectDb.all("SELECT * FROM Systable", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Systable:', err.message);
                    return;
                }

                console.log('Data in the Systable:', rows);
                event.sender.send('all-sys-table-fetched', rows);
            });
        });
    });

    ipcMain.on('remove-tree-table-area', (event, sendData) => {
        console.log("receive delete message", sendData)
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Fetch the filename associated with the document number
            projectDb.get('SELECT area, name FROM Areatable WHERE areaId = ?', [sendData], (err, row) => {
                if (err) {
                    console.error('Error fetching filename from Tags table:', err.message);
                    projectDb.close();
                    return;
                }

                if (row) {
                    const { area, name } = row;
                    console.log("area", area)
                    // Delete the record from the tags database
                    projectDb.run('DELETE FROM Areatable WHERE areaId = ?', [sendData], (err) => {
                        if (err) {
                            console.error('Error deleting from Tags table:', err.message);
                            projectDb.close();
                            return;
                        }

                        projectDb.all("SELECT * FROM Areatable", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from tags table:', err.message);
                                projectDb.close();
                                return;
                            }
                            event.sender.send('all-area-table-fetched', rows);
                            // projectDb.close();
                        });
                    });



                    // Delete the record from the Tree table using tagNo
                    projectDb.run('DELETE FROM Tree WHERE area = ?', [area], (err) => {
                        if (err) {
                            console.error('Error deleting from Tree table:', err.message);
                            return;
                        }
                        projectDb.all("SELECT * FROM Tree", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                                return;
                            }

                            console.log('Data in the Tree table:', rows);
                            mainWindow.webContents.send('all-area-fetched', rows);
                        });
                    });

                } else {
                    console.error('row not found for the provided  id.');
                    projectDb.close();
                }
            });
        });
    });

    ipcMain.on('remove-tree-table-disc', (event, sendData) => {
        console.log("receive delete message", sendData)
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Fetch the filename associated with the document number
            projectDb.get('SELECT disc, name FROM Disctable WHERE discId = ?', [sendData], (err, row) => {
                if (err) {
                    console.error('Error fetching filename from Disctablee:', err.message);
                    projectDb.close();
                    return;
                }

                if (row) {
                    const { disc, name } = row;
                    console.log("disc", disc)
                    // Delete the record from the tags database
                    projectDb.run('DELETE FROM Disctable WHERE discId = ?', [sendData], (err) => {
                        if (err) {
                            console.error('Error deleting from Disctable :', err.message);
                            projectDb.close();
                            return;
                        }

                        projectDb.all("SELECT * FROM Disctable", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from tags table:', err.message);
                                projectDb.close();
                                return;
                            }
                            event.sender.send('all-disc-table-fetched', rows);
                        });
                    });



                    // Delete the record from the Tree table using tagNo
                    projectDb.run('DELETE FROM Tree WHERE disc = ?', [disc], (err) => {
                        if (err) {
                            console.error('Error deleting from Tree table:', err.message);
                            return;
                        }
                        projectDb.all("SELECT * FROM Tree", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                                return;
                            }

                            console.log('Data in the Tree table:', rows);
                            mainWindow.webContents.send('all-disc-fetched', rows);
                        });
                    });

                } else {
                    console.error('row not found for the provided  id.');
                    projectDb.close();
                }
            });
        });
    });

    ipcMain.on('remove-tree-table-sys', (event, sendData) => {
        console.log("receive delete message", sendData)
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Fetch the filename associated with the document number
            projectDb.get('SELECT sys, name FROM Systable WHERE sysId = ?', [sendData], (err, row) => {
                if (err) {
                    console.error('Error fetching filename from Systable:', err.message);
                    projectDb.close();
                    return;
                }

                if (row) {
                    const { sys, name } = row;
                    console.log("sys", sys)
                    // Delete the record from the tags database
                    projectDb.run('DELETE FROM Systable WHERE sysId = ?', [sendData], (err) => {
                        if (err) {
                            console.error('Error deleting from Systable :', err.message);
                            projectDb.close();
                            return;
                        }

                        projectDb.all("SELECT * FROM Systable", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from tags table:', err.message);
                                projectDb.close();
                                return;
                            }
                            event.sender.send('all-sys-table-fetched', rows);
                        });
                    });



                    // Delete the record from the Tree table using tagNo
                    projectDb.run('DELETE FROM Tree WHERE sys = ?', [sys], (err) => {
                        if (err) {
                            console.error('Error deleting from Tree table:', err.message);
                            return;
                        }
                        projectDb.all("SELECT * FROM Tree", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                                return;
                            }

                            console.log('Data in the Tree table:', rows);
                            mainWindow.webContents.send('all-sys-fetched', rows);
                        });
                    });

                } else {
                    console.error('row not found for the provided  id.');
                    projectDb.close();
                }
            });
        });
    });

    ipcMain.on('delete-all-areas', async (event) => {
        console.log("Received request to remove all areas");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        // Confirmation dialog
        const confirmation = await dialog.showMessageBox({
            type: 'warning',
            buttons: ['Cancel', 'Delete All'],
            defaultId: 1,
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete all areas? This action cannot be undone.'
        });

        if (confirmation.response !== 1) return;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch all tagNos from the Tags table
            projectDb.all('SELECT area FROM Areatable', (err, rows) => {
                if (err) {
                    console.error('Error fetching areas from areas table:', err.message);
                    projectDb.close();
                    return;
                }

                const deletedAreas = rows.map(row => row.area);
                if (deletedAreas.length > 0) {
                    // Delete corresponding rows in the Tree table
                    const placeholders = deletedAreas.map(() => '?').join(',');
                    projectDb.run(`DELETE FROM Tree WHERE area IN (${placeholders})`, deletedAreas, (err) => {
                        if (err) {
                            console.error('Error deleting from Tree table:', err.message);
                        } else {
                            console.log('All corresponding rows in the Tree table deleted successfully.');
                        }

                        // Fetch updated data to send back to the renderer
                        projectDb.all("SELECT * FROM Tree", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                            } else {
                                console.log('Data in the Tree table after deletion:', rows);
                                mainWindow.webContents.send('all-area-fetched', rows);
                            }
                        });
                    });
                }
                projectDb.run('DELETE FROM Areatable', (err) => {
                    if (err) {
                        console.error('Error deleting all data from Tags table:', err.message);
                        return;
                    }
                    console.log('All rows in the Tags table deleted successfully.');
                    projectDb.all("SELECT * FROM Areatable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from tags table:', err.message);
                            projectDb.close();
                            return;
                        }
                        event.sender.send('all-area-table-fetched', rows);
                    });
                })
            })
        })
    })

    ipcMain.on('delete-all-disc', async (event) => {
        console.log("Received request to remove all discs");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        // Confirmation dialog
        const confirmation = await dialog.showMessageBox({
            type: 'warning',
            buttons: ['Cancel', 'Delete All'],
            defaultId: 1,
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete all discipline? This action cannot be undone.'
        });

        if (confirmation.response !== 1) return;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch all tagNos from the Tags table
            projectDb.all('SELECT disc FROM Disctable', (err, rows) => {
                if (err) {
                    console.error('Error fetching disc from disc table:', err.message);
                    projectDb.close();
                    return;
                }

                const deletedDiscs = rows.map(row => row.disc);
                if (deletedDiscs.length > 0) {
                    // Delete corresponding rows in the Tree table
                    const placeholders = deletedDiscs.map(() => '?').join(',');
                    projectDb.run(`DELETE FROM Tree WHERE disc IN (${placeholders})`, deletedDiscs, (err) => {
                        if (err) {
                            console.error('Error deleting from Tree table:', err.message);
                        } else {
                            console.log('All corresponding rows in the Tree table deleted successfully.');
                        }

                        // Fetch updated data to send back to the renderer
                        projectDb.all("SELECT * FROM Tree", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                            } else {
                                console.log('Data in the Tree table after deletion:', rows);
                                mainWindow.webContents.send('all-disc-fetched', rows);
                            }
                        });
                    });
                }
                projectDb.run('DELETE FROM Disctable', (err) => {
                    if (err) {
                        console.error('Error deleting all data from Tags table:', err.message);
                        return;
                    }
                    console.log('All rows in the Tags table deleted successfully.');
                    projectDb.all("SELECT * FROM Disctable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from tags table:', err.message);
                            projectDb.close();
                            return;
                        }
                        event.sender.send('all-disc-table-fetched', rows);
                    });
                })
            })
        })
    })

    ipcMain.on('delete-all-sys', async (event) => {
        console.log("Received request to remove all sys");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        // Confirmation dialog
        const confirmation = await dialog.showMessageBox({
            type: 'warning',
            buttons: ['Cancel', 'Delete All'],
            defaultId: 1,
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete all systems? This action cannot be undone.'
        });

        if (confirmation.response !== 1) return;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch all tagNos from the Tags table
            projectDb.all('SELECT sys FROM Systable', (err, rows) => {
                if (err) {
                    console.error('Error fetching sys from sys table:', err.message);
                    projectDb.close();
                    return;
                }

                const deletedSys = rows.map(row => row.sys);
                if (deletedSys.length > 0) {
                    // Delete corresponding rows in the Tree table
                    const placeholders = deletedSys.map(() => '?').join(',');
                    projectDb.run(`DELETE FROM Tree WHERE sys IN (${placeholders})`, deletedSys, (err) => {
                        if (err) {
                            console.error('Error deleting from Tree table:', err.message);
                        } else {
                            console.log('All corresponding rows in the Tree table deleted successfully.');
                        }
                        // Fetch updated data to send back to the renderer
                        projectDb.all("SELECT * FROM Tree", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                            } else {
                                console.log('Data in the Tree table after deletion:', rows);
                                mainWindow.webContents.send('all-sys-fetched', rows);
                            }
                        });
                    });
                }
                projectDb.run('DELETE FROM Systable', (err) => {
                    if (err) {
                        console.error('Error deleting all data from Tags table:', err.message);
                        return;
                    }
                    console.log('All rows in the Tags table deleted successfully.');
                    projectDb.all("SELECT * FROM Systable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from tags table:', err.message);
                            projectDb.close();
                            return;
                        }
                        event.sender.send('all-sys-table-fetched', rows);
                    });
                })
            })
        })
    })

    ipcMain.on('save-edit-area', async (event, updatedData) => {
        console.log(updatedData)
        const { id } = updatedData;
        const { oldArea, newArea, newName } = updatedData;


        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update Areatable
            const queryArea = `UPDATE Areatable SET area = ?, name = ? WHERE areaId = ?`;
            projectDb.run(queryArea, [newArea, newName, id], function (err) {
                if (err) {
                    console.error('Error updating Areatable:', err.message);
                    event.sender.send('save-edit-error', 'area');
                    return;
                }
                projectDb.all("SELECT * FROM Areatable", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from tags table:', err.message);
                        projectDb.close();
                        return;
                    }
                    event.sender.send('all-area-table-fetched', rows);
                });
            });

            // Update Tree table
            const queryTreeArea = `UPDATE Tree SET area = ? WHERE area = ?`;
            projectDb.run(queryTreeArea, [newArea, oldArea], function (err) {
                if (err) {
                    console.error('Error updating area in Tree table:', err.message);
                    event.sender.send('save-edit-error', 'area');
                    return;
                }
            });

            // Update Tree table for name
            const queryTreeName = `UPDATE Tree SET name = ? WHERE area = ? AND disc IS NULL AND sys IS NULL AND tag IS NULL`;
            projectDb.run(queryTreeName, [newName, newArea], function (err) {
                if (err) {
                    console.error('Error updating name in Tree table:', err.message);
                    event.sender.send('save-edit-error', 'area');
                    return;
                }

            });
            projectDb.all("SELECT * FROM Tree", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Tree table:', rows);
                mainWindow.webContents.send('all-area-fetched', rows);
            });

            projectDb.close();
        });
    });

    ipcMain.on('save-edit-disc', async (event, updatedData) => {
        const { id } = updatedData;
        const { oldDisc, newDisc, newName } = updatedData;
        console.log(updatedData);

        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Update Disctable
            const queryArea = `UPDATE Disctable SET disc = ?, name = ? WHERE discId = ?`;
            projectDb.run(queryArea, [newDisc, newName, id], function (err) {
                if (err) {
                    console.error('Error updating Disctable:', err.message);
                    event.sender.send('save-edit-error', 'area');
                    return;
                }
                projectDb.all("SELECT * FROM Disctable", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from tags table:', err.message);
                        projectDb.close();
                        return;
                    }
                    event.sender.send('all-disc-table-fetched', rows);
                });
            });

            // Update Tree table
            const queryTreeArea = `UPDATE Tree SET disc = ? WHERE disc = ?`;
            projectDb.run(queryTreeArea, [newDisc, oldDisc], function (err) {
                if (err) {
                    console.error('Error updating area in Tree table:', err.message);
                    event.sender.send('save-edit-error', 'area');
                    return;
                }
            });

            // Update Tree table for name
            const queryTreeName = `UPDATE Tree SET name = ? WHERE disc = ? AND sys IS NULL AND tag IS NULL`;
            projectDb.run(queryTreeName, [newName, newDisc], function (err) {
                if (err) {
                    console.error('Error updating name in Tree table:', err.message);
                    event.sender.send('save-edit-error', 'area');
                    return;
                }

            });
            projectDb.all("SELECT * FROM Tree", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Tree table:', rows);
                mainWindow.webContents.send('all-disc-fetched', rows);
            });

            projectDb.close();
        });
    });

    ipcMain.on('save-edit-sys', async (event, updatedData) => {
        const { id } = updatedData;
        const { oldSys, newSys, newName } = updatedData;
        console.log(updatedData);

        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Update Systable
            const queryArea = `UPDATE Systable SET sys = ?, name = ? WHERE sysId = ?`;
            projectDb.run(queryArea, [newSys, newName, id], function (err) {
                if (err) {
                    console.error('Error updating Disctable:', err.message);
                    event.sender.send('save-edit-error', 'area');
                    return;
                }
                projectDb.all("SELECT * FROM Systable", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from tags table:', err.message);
                        projectDb.close();
                        return;
                    }
                    event.sender.send('all-sys-table-fetched', rows);
                });
            });

            // Update Tree table
            const queryTreeArea = `UPDATE Tree SET sys = ? WHERE sys = ?`;
            projectDb.run(queryTreeArea, [newSys, oldSys], function (err) {
                if (err) {
                    console.error('Error updating area in Tree table:', err.message);
                    event.sender.send('save-edit-error', 'sys');
                    return;
                }
            });

            // Update Tree table for name
            const queryTreeName = `UPDATE Tree SET name = ? WHERE sys = ?  AND tag IS NULL`;
            projectDb.run(queryTreeName, [newName, newSys], function (err) {
                if (err) {
                    console.error('Error updating name in Tree table:', err.message);
                    event.sender.send('save-edit-error', 'area');
                    return;
                }

            });
            projectDb.all("SELECT * FROM Tree", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Tree table:', rows);
                mainWindow.webContents.send('all-sys-fetched', rows);
            });

            projectDb.close();
        });
    });

    const calculateNewDate = (duration) => {
        const now = new Date();
        switch (duration) {
            case '1 month':
                now.setMonth(now.getMonth() + 1);
                break;
            case '6 months':
                now.setMonth(now.getMonth() + 6);
                break;
            case '1 year':
                now.setFullYear(now.getFullYear() + 1);
                break;
            default:
                throw new Error('Unknown duration');
        }
        return now.toISOString();
    };

    ipcMain.on('extend-validity', (event, duration) => {
        const filePath = path.join(app.getPath('userData'), 'installation-date.json');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Failed to read installation date:', err);
                event.reply('extend-validity-response', { success: false, message: 'Error reading installation date' });
                return;
            }

            let currentData = {};
            try {
                currentData = JSON.parse(data);
                console.log(currentData);
            } catch (parseError) {
                console.error('Error parsing installation date file:', parseError);
                event.reply('extend-validity-response', { success: false, message: 'Error parsing installation date file' });
                return;
            }

            const currentDate = new Date();
            const existingExpirationDate = new Date(currentData.expiryDate || 0); // Use expiryDate from data

            if (currentDate < existingExpirationDate) {
                // If current date is before the existing expiration date
                const remainingDays = Math.ceil((existingExpirationDate - currentDate) / (1000 * 60 * 60 * 24));
                event.reply('extend-validity-response', { success: false, message: `You have ${remainingDays} days remaining` });
            } else {
                // If expired or no valid expiration date exists
                const newExpirationDate = calculateNewDate(duration);
                const newData = { installDate: currentData.installDate, expiryDate: newExpirationDate };

                fs.writeFile(filePath, JSON.stringify(newData, null, 2), (writeError) => {
                    if (writeError) {
                        console.error('Failed to write installation date:', writeError);
                        event.reply('extend-validity-response', { success: false, message: 'Error updating installation date' });
                    } else {
                        console.log('Installation date updated to:', newExpirationDate);
                        event.reply('extend-validity-response', { success: true, message: 'Validity extended successfully' });
                    }
                });
            }
        });
    });


    // --------------SMART P & ID--------------------------//


    ipcMain.on('dwg-svg-converter', (event, file) => {
        const filePath = file.path;
        const dirPath = path.dirname(filePath);
        const fileStem = path.basename(filePath, '.dxf');
        const outputFilePath = path.join(dirPath, fileStem + '.svg');

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                event.reply('conversion-error', { message: 'Error reading file: ' + err.message });
                return;
            }

            try {
                const parsed = dxf.parseString(data.toString());
                console.log('Parsed DXF:', parsed);
                const svg = dxfToSvg(parsed);

                fs.writeFile(outputFilePath, svg, (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        event.reply('conversion-error', { message: 'Error writing file: ' + err.message });
                        return;
                    }
                    console.log("outputFilePath", outputFilePath);
                    const convertedFileName = path.basename(outputFilePath);
                    event.reply('dxf-conversion-success', { convertedFilePath: outputFilePath, convertedFileName: convertedFileName });
                });
            } catch (error) {
                console.error('Conversion error:', error);
                event.reply('conversion-error', { message: 'Conversion failed: ' + error.message });
            }
        });
    });

    function dxfToSvg(parsed) {
        let svg = '<svg xmlns="http://www.w3.org/2000/svg">';

        console.log('Parsed entities:', parsed.entities);

        parsed.entities.forEach((entity, index) => {
            console.log(`Processing entity ${index}:`, entity);

            if (entity.type === 'LINE') {
                if (entity.start && entity.end &&
                    typeof entity.start.x !== 'undefined' && typeof entity.start.y !== 'undefined' &&
                    typeof entity.end.x !== 'undefined' && typeof entity.end.y !== 'undefined') {
                    svg += `<line x1="${entity.start.x}" y1="${entity.start.y}" x2="${entity.end.x}" y2="${entity.end.y}" stroke="black" />`;
                } else {
                    console.log(`Skipping invalid LINE entity at index ${index}`);
                }
            } else if (entity.type === 'CIRCLE') {
                if (typeof entity.x !== 'undefined' && typeof entity.y !== 'undefined' && typeof entity.r !== 'undefined') {
                    svg += `<circle cx="${entity.x}" cy="${entity.y}" r="${entity.r}" stroke="black" fill="none" />`;
                } else {
                    console.log(`Skipping invalid CIRCLE entity at index ${index}`);
                }
            } else if (entity.type === 'LWPOLYLINE') {
                if (entity.vertices && entity.vertices.length > 1) {
                    let pathData = `M ${entity.vertices[0].x} ${entity.vertices[0].y}`;

                    for (let i = 1; i < entity.vertices.length; i++) {
                        pathData += ` L ${entity.vertices[i].x} ${entity.vertices[i].y}`;
                    }

                    if (entity.closed) {
                        pathData += ' Z'; // Close the path if the polyline is closed
                    }

                    svg += `<path d="${pathData}" stroke="black" fill="none" />`;
                } else {
                    console.log(`Skipping invalid LWPOLYLINE entity at index ${index}`);
                }
            } else if (entity.type === 'MTEXT') {
                if (entity.string && entity.x !== undefined && entity.y !== undefined) {
                    const escapedText = escapeXml(entity.string);
                    svg += `<text x="${entity.x}" y="${entity.y}" font-size="${entity.nominalTextHeight || 1}" fill="black">${escapedText}</text>`;
                } else {
                    console.log(`Skipping invalid MTEXT entity at index ${index}`);
                }
            } else if (entity.type === 'SPLINE') {
                if (entity.controlPoints && entity.controlPoints.length > 1) {
                    let pathData = `M ${entity.controlPoints[0].x} ${entity.controlPoints[0].y}`;

                    for (let i = 1; i < entity.controlPoints.length; i++) {
                        pathData += ` C ${entity.controlPoints[i].x} ${entity.controlPoints[i].y}`;
                    }

                    svg += `<path d="${pathData}" stroke="black" fill="none" />`;
                } else {
                    console.log(`Skipping invalid SPLINE entity at index ${index}`);
                }
            } else if (entity.type === 'ARC') {
                if (typeof entity.x !== 'undefined' && typeof entity.y !== 'undefined' &&
                    typeof entity.r !== 'undefined' && typeof entity.startAngle !== 'undefined' &&
                    typeof entity.endAngle !== 'undefined') {

                    const startX = entity.x + entity.r * Math.cos(entity.startAngle);
                    const startY = entity.y + entity.r * Math.sin(entity.startAngle);
                    const endX = entity.x + entity.r * Math.cos(entity.endAngle);
                    const endY = entity.y + entity.r * Math.sin(entity.endAngle);

                    const largeArcFlag = (entity.endAngle - entity.startAngle) <= Math.PI ? 0 : 1;

                    svg += `<path d="M ${startX} ${startY} A ${entity.r} ${entity.r} 0 ${largeArcFlag} 1 ${endX} ${endY}" stroke="black" fill="none" />`;
                } else {
                    console.log(`Skipping invalid ARC entity at index ${index}`);
                }
            } else {
                console.log(`Unsupported entity type: ${entity.type} at index ${index}`);
            }
        });

        svg += '</svg>';
        return svg;
    }

    function escapeXml(unsafe) {
        return unsafe.replace(/[<>&'"]/g, function (char) {
            switch (char) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '"': return '&quot;';
                case "'": return '&apos;';
            }
        });
    }

    ipcMain.on('save-ele-tag', (event, data) => {
        console.log("Received request to save tag");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Insert data into the Tree table of the project's database
            projectDb.run('INSERT INTO Elements (elementId,tagNumber,filename) VALUES (?,?,?)', [data.elementId, data.tagNumber, data.filename], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with element id: ${data.elementId}`);
            });

            projectDb.all("SELECT * FROM Elements", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Elements table:', rows);
                mainWindow.webContents.send('all-elements-fetched', rows);
            });
        });
    })

    ipcMain.on('save-layer', (event, data) => {
        console.log("Received request to save layer");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Insert data into the Tree table of the project's database
            projectDb.run('INSERT INTO Layers (areaNumber,  x, y, width, height,  docId) VALUES (?,?,?,?,?,?)', [data.areaNumber, data.x, data.y, data.width, data.height, data.docId], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with areaNNumber: ${data.areaNumber}`);
            });

            projectDb.all("SELECT * FROM Layers", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Layers table:', rows);
                mainWindow.webContents.send('all-layers-fetched', rows);
            });
        });
    })

    ipcMain.on('save-flag-ele', (event, data) => {
        console.log("Received request to save tag");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Insert data into the Flags table of the project's database
            // const flagId = uuid.v4();
            const flagId = generateCustomID('F');
            projectDb.serialize(() => {
                const stmt = projectDb.prepare('INSERT INTO Flags (flagId, elementId, parentDoc, connectDoc) VALUES (?, ?, ?, ?)');
                data.elementIds.forEach(elementId => {
                    stmt.run([flagId, elementId, data.parentDoc, data.connectDoc], (err) => {
                        if (err) {
                            console.error('Error inserting data:', err.message);
                        } else {
                            console.log(`Row inserted with element id: ${elementId}`);
                        }
                    });
                });
                stmt.finalize();

                // Fetch all data from the Flags table after insertion
                projectDb.all("SELECT * FROM Flags", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from Flags table:', err.message);
                        return;
                    }

                    console.log('Data in the Flags table:', rows);
                    mainWindow.webContents.send('all-flags-fetched', rows);
                });
            });
        });
    });

    ipcMain.on('save-doc-data', (event, data) => {
        console.log("Received request to save document");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }


            // const docId = uuid.v4();
            const docId = generateCustomID('D');
            // Insert data into the Tree table of the project's database
            projectDb.run('INSERT INTO Documents (docId,number,title,descr,type,filename) VALUES (?,?,?,?,?,?)', [docId, data.number, data.title, data.descr, data.type, data.filename], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with document number: ${data.number}`);
            });
            // Create a folder named 'Documents' in the project folder
            const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
            if (!fs.existsSync(documentsFolderPath)) {
                fs.mkdirSync(documentsFolderPath);
                console.log('Documents folder created.');
            }

            // Move the file into the 'Documents' folder
            const fileToMove = data.filePath;
            const fileName = path.basename(fileToMove);
            const destinationPath = path.join(documentsFolderPath, fileName);
            fs.copyFileSync(fileToMove, destinationPath);
            console.log(`File '${fileName}' moved to 'Documents' folder.`);


            projectDb.all("SELECT * FROM Documents", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Documents table:', rows);
                mainWindow.webContents.send('all-docs-fetched', rows);
            });
            projectDb.all("SELECT * FROM Documents WHERE type = ?", ["iXB"], (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Documents table:', err.message);
                    return;
                }

                console.log('Data in the Documents table:', rows);
                mainWindow.webContents.send('spid-docs-fetched', rows);
            });
        });
    });

    ipcMain.on('fetch-sin-doc', (event, number) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT filename FROM Documents WHERE number = ?', [number], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    event.sender.send('tag-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
                    const filePath = path.join(documentsFolderPath, row.filename);

                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', { success: true, filePath: filePath });
                        mainWindow.webContents.send('sin-doc-fetched', filePath);
                        projectDb.all("SELECT * FROM CommentStatus", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from CommentStatus table:', err.message);
                                return;
                            }
                            mainWindow.webContents.send('all-comments-fetched', rows);
                        });
                    } else {
                        console.error('File not found in Documents folder');
                        event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                    }
                } else {
                    console.error('Document not found in database');
                    event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                }
            });
        });
    });

    ipcMain.on('fetch-condoc-path', (event, number) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT filename FROM Documents WHERE number = ?', [number], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    event.sender.send('tag-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
                    const filePath = path.join(documentsFolderPath, row.filename);

                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', { success: true, filePath: filePath });
                        mainWindow.webContents.send('condoc-path-fetched', filePath);
                    } else {
                        console.error('File not found in Documents folder');
                        event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                    }

                } else {
                    console.error('Document not found in database');
                    event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                }
            });
        });
    });

    ipcMain.on('fetch-sin-ele', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Elements WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    // event.sender.send('doc-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    console.log(`Element details: ${row}`);
                    // event.sender.send('doc-found', { success: true, filePath: filePath });
                    mainWindow.webContents.send('sin-ele-fetched', row);
                } else {
                    console.error('Element not found in Elements table');
                    // event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                }
                // } 
                // else {
                //     console.error('Document not found in database');
                //     event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                // }
            });
        });
    });

    ipcMain.on('tag-doc-con', (event, tagNumber) => {
        console.log("Received request to search filename by tag");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Elements WHERE tagNumber = ?', [tagNumber], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    // event.sender.send('doc-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    console.log(`Element details: ${row}`);
                    // event.sender.send('doc-found', { success: true, filePath: filePath });
                    mainWindow.webContents.send('con-doc-tag', row);
                } else {
                    console.error('Element not found in Elements table');
                    // event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                }
                // } 
                // else {
                //     console.error('Document not found in database');
                //     event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                // }
            });
        });
    });

    ipcMain.on('tag-doc-det', (event, filename) => {
        console.log("Received request to search document by filename");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Documents WHERE filename = ?', [filename], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    // event.sender.send('doc-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    console.log(`Documents details: ${row}`);
                    // event.sender.send('doc-found', { success: true, filePath: filePath });
                    mainWindow.webContents.send('det-doc-tag', row);
                } else {
                    console.error('Documents not found in Documents table');
                    // event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                }
                // } 
                // else {
                //     console.error('Document not found in database');
                //     event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                // }
            });
        });
    });

    ipcMain.on('show-doc-area', (event, docId) => {
        console.log("Received request to search area by docId");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Layers WHERE docId = ?', [docId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    // event.sender.send('doc-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    console.log(`Area details: ${row}`);
                    // event.sender.send('doc-found', { success: true, filePath: filePath });
                    mainWindow.webContents.send('doc-area-fetched', row);
                } else {
                    console.error('Element not found in Elements table');
                    // event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                }
            });
        });
    });

    ipcMain.on('is-element-tag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            projectDb.get('SELECT * FROM Elements WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    mainWindow.webContents.send('element-tag-is', row);
                } else {
                    console.error('Element not found in Elements table');
                }

            });
        });
    });

    ipcMain.on('fetch-con-doc', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Flags WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }

                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('con-doc-fetched', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });

    ipcMain.on('fetch-tag-ele', (event, tagNumber) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Elements WHERE tagNumber = ?', [tagNumber], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    mainWindow.webContents.send('tag-ele-fetched', row);
                } else {
                    console.error('Element not found in Elements table');
                }
            });
        });
    });

    ipcMain.on('is-ele-tag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Elements WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    mainWindow.webContents.send('tag-ele-is', row);
                } else {
                    console.error('Element not found in Elements table');
                }
            });
        });
    });

    ipcMain.on('sel-tag-ele', (event, tagNumber) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Elements WHERE tagNumber = ?', [tagNumber], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    mainWindow.webContents.send('ele-tag-sel', row);
                } else {
                    console.error('Element not found in Elements table');
                }
            });
        });
    });

    ipcMain.on('fetch-sin-docdetails', (event, number) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Documents WHERE number = ?', [number], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Document details: ${row}`);
                    mainWindow.webContents.send('sin-docdetails-fetched', row);
                } else {
                    console.error('Document not found in Documents table');
                }
            });
        });
    });

    ipcMain.on('fetch-sin-flag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Flags WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('sin-flag-fetched', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });

    ipcMain.on('double-sin-flag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Flags WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('sin-flag-double', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });

    ipcMain.on('fetch-flag-tag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Elements WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('flag-tag-fetched', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });

    ipcMain.on('sin-flag-conflag', (event, connectFlag) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Flags WHERE connectFlag = ?', [connectFlag], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('flag-conflag-sin', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });

    ipcMain.on('ele-flag-sel', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Flags WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {


                    mainWindow.webContents.send('ele-flag-out', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });

    ipcMain.on('flag-dou-sel', (event, flagId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Flags WHERE flagId = ?', [flagId], (err, frow) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (frow) {
                    console.log(`Flag details: ${frow}`);
                    mainWindow.webContents.send('sel-flag-ele', frow);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });

    });

    ipcMain.on('save-area-data', (event, data) => {
        console.log("Received request to save tag");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // db.run("CREATE TABLE IF NOT EXISTS Tags ( tagId TEXT,tagNumber TEXT, tagName TEXT, tagType TEXT)");
            // const areaId = uuid.v4();
            const areaId = generateCustomID('A');
            // Insert data into the Tree table of the project's database
            projectDb.run('INSERT INTO Area (areaId,areaNumber,areaName) VALUES (?,?,?)', [areaId, data.areaNumber, data.areaName], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log('Row inserted with Area number: ${data.areaNumber}');
                projectDb.all("SELECT * FROM Area", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from Tree table:', err.message);
                        return;
                    }

                    console.log('Data in the Area table:', rows);
                    mainWindow.webContents.send('all-area-fetched', rows);
                });
            });
        });
    })

    ipcMain.on('update-flag-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Extracting updated data
        const { connectFlag, flagId } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE Flags SET connectFlag = ? WHERE flagId = ?',
                [connectFlag, flagId],
                (err) => {
                    if (err) {
                        console.error('Error updating Flags table:', err.message);
                        return;
                    }

                    console.log('Flags table updated successfully.');
                    projectDb.all(
                        'SELECT * FROM Flags WHERE flagId = ?',
                        [flagId],
                        (err, row) => {
                            if (err) {
                                console.error('Error retrieving updated row:', err.message);
                                return;
                            }

                            console.log('Updated row:', row);
                        }
                    );
                }
            );


            projectDb.all("SELECT * FROM Flags", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Flags table:', rows);
                mainWindow.webContents.send('all-flags-fetched', rows);
            });
        });
    });

    ipcMain.on('update-flag-tag', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Extracting updated data
        const { adjTag, flagId } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE Flags SET adjTag = ? WHERE flagId = ?',
                [adjTag, flagId],
                (err) => {
                    if (err) {
                        console.error('Error updating Flags table:', err.message);
                        return;
                    }

                    console.log('Flags table updated successfully.');
                    projectDb.all(
                        'SELECT * FROM Flags WHERE flagId = ?',
                        [flagId],
                        (err, row) => {
                            if (err) {
                                console.error('Error retrieving updated row:', err.message);
                                return;
                            }

                            console.log('Updated row:', row);
                        }
                    );
                }
            );

            projectDb.all("SELECT * FROM Flags", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Flags table:', rows);
                mainWindow.webContents.send('flag-tag-updated', rows);
            });
        });
    })

    ipcMain.on('update-unflag-table', (event, flagId) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        // const { flagId, connectFlag } = updatedData
        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE Flags SET connectFlag = ? WHERE flagId = ?',
                ['', flagId],
                (err) => {
                    if (err) {
                        console.error('Error updating Flags table:', err.message);
                        return;
                    }

                    console.log('Flags table updated successfully.');
                    projectDb.all(
                        'SELECT * FROM Flags WHERE flagId = ?',
                        [flagId],
                        (err, row) => {
                            if (err) {
                                console.error('Error retrieving updated row:', err.message);
                                return;
                            }

                            console.log('Updated row:', row);
                        }
                    );
                }
            );

            projectDb.all("SELECT * FROM Flags", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Flags table:', rows);
                mainWindow.webContents.send('all-flags-fetched', rows);
            });
        });
    });

    ipcMain.on('unflag-ele-flag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Flags WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('ele-flag-unflag', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });


    ipcMain.on('fetch-doc-flag', (event, parentDoc) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Flags WHERE parentDoc = ?', [parentDoc], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('doc-flag-fetched', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });

    ipcMain.on('save-areatag-rel', (event, data) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('INSERT INTO PidAreaTag (tagNumber,areaNumber) VALUES (?,?)', [data.tagNumber, data.areaNumber], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log('Row inserted with status: ${data.statusname}');
            });
            projectDb.all("SELECT * FROM PidAreaTag", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the PidAreaTag table:', rows);
                mainWindow.webContents.send('areatag-rel', rows);
            });
        });
    });

    ipcMain.on('del-ele-tag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Elements WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    const tagNumber = row.tagNumber
                    projectDb.get('DELETE FROM Elements WHERE tagNumber = ?', [tagNumber], (err) => {
                        if (err) {
                            console.error('Error deleting from Tags table:', err.message);
                            projectDb.close();
                            return;
                        }
                        else {
                            projectDb.all("SELECT * FROM Elements", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from Tree table:', err.message);
                                    return;
                                }

                                console.log('Data in the Elements table:', rows);
                                mainWindow.webContents.send('all-elements-fetched', rows);
                            });
                        }
                    });

                } else {
                    console.error('Flag not found in Flags table');
                }
            });

        });
    });

    ipcMain.on('ele-tag-type', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Elements WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    const tag = row.tagNumber
                    projectDb.get('SELECT * FROM TagInfo WHERE tag = ?', [tag], (err, rows) => {
                        if (err) {
                            console.error('Error querying the database:', err.message);
                            return;
                        }
                        if (rows) {
                            console.log(`TagInfo details: ${rows}`);
                            mainWindow.webContents.send('info-tag-fetched', rows);
                        } else {
                            console.error('tag not found in TagInfo table');
                        }

                    });

                    projectDb.get('SELECT * FROM EquipmentList WHERE tag = ?', [tag], (err, erows) => {
                        if (err) {
                            console.error('Error querying the database:', err.message);
                            return;
                        }
                        if (erows) {
                            console.log(`Equipment details: ${erows}`);
                            mainWindow.webContents.send('equ-type-details', erows);
                        } else {
                            console.error('tag not found in EquipmentList table');
                        }

                    });

                    projectDb.get('SELECT * FROM LineList WHERE tag = ?', [tag], (err, erows) => {
                        if (err) {
                            console.error('Error querying the database:', err.message);
                            return;
                        }
                        if (erows) {
                            console.log(`Line details: ${erows}`);
                            mainWindow.webContents.send('line-type-details', erows);
                        } else {
                            console.error('tag not found in LineList table');
                        }

                    });


                } else {
                    console.error('Flag not found in Flags table');
                }
            });

        });
    });

    ipcMain.on('update-doc-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch current tag data
            projectDb.get('SELECT * FROM Documents WHERE docId = ?', [updatedData.docId], (err, row) => {
                if (err) {
                    console.error('Error fetching data:', err.message);
                    return;
                }

                // const previousDoctype = row.type;
                // const updatedDoctype = updatedData.type;
                // const docnumber = row.number;

                // Update data in Tags table
                projectDb.run('UPDATE Documents SET title = ?, descr = ?, type=?, filename = ? WHERE docId = ?',
                    [updatedData.title, updatedData.descr, updatedData.type, updatedData.filename, updatedData.docId],
                    function (err) {
                        if (err) {
                            console.error('Error updating data:', err.message);
                            return;
                        }
                        console.log(`Row updated with tag number: ${updatedData.docId},${updatedData.title},${updatedData.descr},${updatedData.type}, ${updatedData.filename}`);
                        // Fetch updated Tags table data
                        projectDb.all("SELECT * FROM Documents", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Documents table:', err.message);
                                return;
                            }
                            console.log('Data in the Documents table:', rows);
                            mainWindow.webContents.send('all-docs-fetched', rows);
                        });
                        projectDb.all("SELECT * FROM Documents WHERE type = ?", ["iXB"], (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Documents table:', err.message);
                                return;
                            }

                            console.log('Data in the Documents table:', rows);
                            mainWindow.webContents.send('spid-docs-fetched', rows);
                        });
                    });
                // Move the file into the 'Documents' folder if filePath is provided
                const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
                const revisedFolderPath = path.join(selectedFolderPath, 'Revised');
                if (!fs.existsSync(documentsFolderPath)) {
                    fs.mkdirSync(documentsFolderPath);
                    console.log('Documents folder created.');
                }

                if (!fs.existsSync(revisedFolderPath)) {
                    fs.mkdirSync(revisedFolderPath);
                    console.log('Revised folder created.');
                }

                const moveFileToRevised = (sourcePath, filename, revision) => {
                    const revisedFileName = filename.replace(/(\.[\w\d_-]+)$/i, `R${revision}$1`);
                    const revisedFilePath = path.join(revisedFolderPath, revisedFileName);
                    fs.renameSync(sourcePath, revisedFilePath);
                    console.log(`File '${filename}' moved to 'Revised' folder with new name '${revisedFileName}'.`);
                };

                const handleFileRevisions = (destinationPath, filename) => {
                    const revisions = [];
                    for (let i = 1; i <= 3; i++) {
                        const revisedFileName = filename.replace(/(\.[\w\d_-]+)$/i, `R${i}$1`);
                        const revisedFilePath = path.join(revisedFolderPath, revisedFileName);
                        if (fs.existsSync(revisedFilePath)) {
                            revisions.push(revisedFilePath);
                        }
                    }

                    if (revisions.length === 3) {
                        fs.unlinkSync(revisions[0]);
                        console.log(`Oldest revision '${revisions[0]}' deleted.`);
                        revisions.shift();
                    }

                    if (fs.existsSync(destinationPath)) {
                        for (let i = 1; i <= 3; i++) {
                            const revisedFileName = filename.replace(/(\.[\w\d_-]+)$/i, `R${i}$1`);
                            const revisedFilePath = path.join(revisedFolderPath, revisedFileName);
                            if (!fs.existsSync(revisedFilePath)) {
                                moveFileToRevised(destinationPath, filename, i);
                                break;
                            }
                        }
                    }
                };

                if (updatedData.filePath) {
                    const fileToMove = updatedData.filePath;
                    const filename = path.basename(fileToMove);
                    const destinationPath = path.join(documentsFolderPath, filename);

                    handleFileRevisions(destinationPath, filename);

                    // Copy the new file to the Tags folder
                    fs.copyFileSync(fileToMove, destinationPath);
                    console.log(`File '${filename}' moved to 'Documents' folder.`);
                }
            })
        });
    })

    ipcMain.on('insert-master-table', (event, number) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Documents WHERE number = ?', [number], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    event.sender.send('Doc-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    // console.log('Data in the Documents table:', row);
                    // mainWindow.webContents.send('master-doc-fetched', row);
                    const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
                    const filePath = path.join(documentsFolderPath, row.filename);

                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', { success: true, filePath: filePath });
                        // const tagId = uuid.v4();
                        const masterId = generateCustomID('M');
                        // Insert data into the Tree table of the project's database
                        projectDb.run('INSERT INTO Master (masterId,docId,number,title,descr,type,filename) VALUES (?,?,?,?,?,?,?)', [masterId, row.docId, row.number, row.title, row.descr, row.type, row.filename], function (err) {
                            if (err) {
                                console.error('Error inserting data:', err.message);
                                return;
                            }
                            const MastersFolderPath = path.join(selectedFolderPath, 'Masters');
                            if (!fs.existsSync(MastersFolderPath)) {
                                fs.mkdirSync(MastersFolderPath);
                                console.log('Masters folder created.');
                            }

                            // Move the file into the 'Documents' folder
                            const fileToMove = filePath;
                            const fileName = path.basename(fileToMove);
                            const destinationPath = path.join(MastersFolderPath, fileName);
                            fs.copyFileSync(fileToMove, destinationPath);
                            console.log(`File '${fileName}' moved to 'Masters' folder.`);
                            // projectDb.all("SELECT * FROM Master", (err, rows) => {
                            //     if (err) {
                            //         console.error('Error fetching data from Tree table:', err.message);
                            //         return;
                            //     }

                            //     console.log('Data in the Master table:', rows);
                            //     mainWindow.webContents.send('all-docs-fetched', rows);
                            // });

                            projectDb.all("SELECT filename FROM Master WHERE number=?", [row.number], (err, rows) => {
                                if (err) {
                                    console.error('Error querying the database:', err.message);
                                    event.sender.send('master-doc-found', { success: false, message: 'Error querying the database' });
                                    return;
                                }

                                if (rows) {
                                    const MasterssFolderPath = path.join(selectedFolderPath, 'Masters');
                                    const fileePath = path.join(MasterssFolderPath, row.filename);

                                    if (fs.existsSync(fileePath)) {
                                        console.log(`File found: ${fileePath}`);
                                        event.sender.send('doc-found', { success: true, fileePath: filePath });
                                        mainWindow.webContents.send('master-doc-fetched', fileePath);
                                    } else {
                                        console.error('File not found in Documents folder');
                                        event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                                    }
                                } else {
                                    console.error('Document not found in database');
                                    event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                                }
                            });
                        });
                    }


                }

                else {
                    console.error('File not found in Documents folder');
                    event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                }
            });
        });
    });

    ipcMain.on('check-master', (event, number) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Master WHERE number = ?', [number], (err, row) => {
                const nrow = {}
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Master details: ${row}`);
                    mainWindow.webContents.send('master-checked', row);
                } else {
                    console.error('Master not found in Masters table');
                    mainWindow.webContents.send('master-checked', nrow);
                }
            });
        });
    });

    ipcMain.on('fetch-master-doc', (event, number) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT filename FROM Master WHERE number = ?', [number], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    event.sender.send('tag-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    const documentsFolderPath = path.join(selectedFolderPath, 'Masters');
                    const filePath = path.join(documentsFolderPath, row.filename);

                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', { success: true, filePath: filePath });
                        mainWindow.webContents.send('store-master-fetched', filePath);

                    } else {
                        console.error('File not found Master folder');
                        event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                    }
                } else {
                    console.error('Document not found in database');
                    event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                }
            });
        });
    });

    ipcMain.on('copy-to-master', (event, { svgString, originalMasdocPath }) => {
        console.log('Received svgData:', svgString);
        console.log('Original Masdoc Path:', originalMasdocPath);
        const masdocFolder = path.dirname(originalMasdocPath);
        const masdocFilename = path.basename(originalMasdocPath);
        const parentFolder = path.dirname(masdocFolder); // Get the parent directory of the Master folder
        const masterRevFolder = path.join(parentFolder, 'masterrev'); // Create masterrev in the parent directory

        if (!fs.existsSync(masterRevFolder)) {
            fs.mkdirSync(masterRevFolder);
        }

        // Copy original masdoc to masterrev folder
        const newMasterRevPath = path.join(masterRevFolder, masdocFilename);
        fs.copyFileSync(originalMasdocPath, newMasterRevPath);

        // Ensure svgData is a string before writing
        if (typeof svgString !== 'string') {
            console.error('svgData is not a string:', svgString);
            event.sender.send('save-modified-svg-complete', { success: false, error: 'svgData is not a string' });
            return;
        }

        // Replace original masdoc in Master folder with modified SVG
        fs.writeFileSync(originalMasdocPath, svgString, 'utf8');

        event.sender.send('save-modified-svg-complete', { success: true });
        mainWindow.webContents.send('store-master-fetched', originalMasdocPath);

    });

    ipcMain.on('backup-masdoc', (event, originalMasdocPath) => {
        const masdocFolder = path.dirname(originalMasdocPath);
        const masdocFilename = path.basename(originalMasdocPath);
        const parentFolder = path.dirname(masdocFolder); // Get the parent directory of the Master folder
        const masterRevFolder = path.join(parentFolder, 'masterrev'); // Create masterrev in the parent directory

        if (!fs.existsSync(masterRevFolder)) {
            fs.mkdirSync(masterRevFolder);
        }

        // Copy original masdoc to masterrev folder
        const newMasterRevPath = path.join(masterRevFolder, masdocFilename);
        fs.copyFileSync(originalMasdocPath, newMasterRevPath);

        // // Replace original masdoc in Master folder with modified SVG
        // fs.writeFileSync(originalMasdocPath, svgString);

        event.sender.send('save-modified-svg-complete', { success: true });
        // mainWindow.webContents.send('store-master-fetched', svgString);

    });

    ipcMain.on('update-masdoc', (event, { path: masdocPath, content }) => {
        try {
            fs.writeFileSync(masdocPath, content);
            console.log('Masdoc updated successfully');
        } catch (error) {
            console.error('Error updating masdoc:', error);
        }
    });

    ipcMain.on('save-svg', (event, { svgString, filePath }) => {
        fs.writeFile(filePath, svgString, (err) => {
            if (err) {
                console.error('Failed to save SVG file:', err);
                event.reply('save-svg-reply', { success: false, error: err.message });
            } else {
                console.log('SVG file saved successfully.');
                event.reply('save-svg-reply', { success: true });
            }
        });
    });

    ipcMain.on('read-svg-file', (event, filePath) => {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            event.reply('read-svg-file-response', { data });
        } catch (err) {
            console.error(err);
            event.reply('read-svg-file-response', { error: err.message });
        }
    });

    ipcMain.on('open-three-from-pid', (event, data) => {
        console.log("Received request to search from pid");
        console.log(data);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }


            projectDb.get(`
    SELECT 
        Tree.area, Tree.disc, Tree.sys, Tags.filename 
    FROM 
        Tree 
    JOIN 
        Tags 
    ON 
        Tree.tag = Tags.number 
    WHERE 
        Tags.number = ?`, [data], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    event.sender.send('tag-not-found', { success: false, message: 'Files not found' });
                    return;
                }
                if (row && row.filename) {
                    console.log(row)
                    const documentsFolderPath = path.join(selectedFolderPath, 'Tags');
                    const filePath = path.join(documentsFolderPath, row.filename);
                    const filename = path.basename(filePath);


                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', {
                            success: true,
                            filePath: filePath,
                            area: row.area,
                            disc: row.disc,
                            sys: row.sys
                        });
                        mainWindow.webContents.send('fetched-Tag-path-pid', {
                            tag: data,
                            filePath: filePath,
                            filename: filename,
                            area: row.area,
                            disc: row.disc,
                            sys: row.sys
                        });
                    } else {
                        console.error('File not found in Tags folder');
                        event.sender.send('doc-found', { success: false, message: 'File not found in Tags folder' });
                    }
                } else {
                    console.error('Tags not found in database');
                    event.sender.send('tag-not-found', { success: false, message: 'File is not assigned' });
                }
            })
        });
    });

    ipcMain.on('open-pid-from-three', (event, data) => {
        console.log("Received request to search from pid");
        console.log(data);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            projectDb.all('SELECT * FROM Elements WHERE tagNumber = ?', [data], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }

                if (row) {
                    console.log(`Element details: ${row}`);
                    // event.sender.send('doc-found', { success: true, filePath: filePath });
                    mainWindow.webContents.send('con-doc-tag', row);
                } else {
                    console.error('Element not found in Elements table');

                }

            });


        });
    });

    ipcMain.on('tag-doc-det', (event, filename) => {
        console.log("Received request to search document by filename");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Documents WHERE filename = ?', [filename], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);

                    return;
                }

                if (row) {
                    console.log(`Documents details: ${row}`);
                    mainWindow.webContents.send('det-doc-tag', row);
                } else {
                    console.error('Documents not found in Documents table');

                }

            });
        });
    });

    // ipcMain.on('import-excel', async (event, data) => {
    //     console.log(data);
    //     const specId = generateCustomID('Sp');
    //     try {
    //         Object.entries(data).forEach(([sheet, rows]) => {
    //             switch(sheet) {
    //                 case 'SpecDetails':
    //                     // insertSpecDetailsData(rows);
    //                     console.log(`sheet:${sheet}`);

    //                     console.log(rows); 
    //                     break;
    //                 case 'materials':
    //                     insertMaterialsData(rows);
    //                     console.log(`sheet:${sheet}`);
    //                     console.log(rows); 
    //                     break;
    //                 case 'size':
    //                     insertSizeData(rows);
    //                     console.log(`sheet:${sheet}`);
    //                     console.log(rows); 
    //                     break;
    //                 case 'Temppres':
    //                     insertTemppresData(rows);
    //                     console.log(`sheet:${sheet}`);
    //                     console.log(rows); 
    //                     break;
    //                 default:
    //                     console.warn(`Unknown sheet: ${sheet}`);
    //             }
    //         });
    //         event.reply('import-response', 'Data imported successfully');
    //     } catch (error) {
    //         console.error('Error importing data:', error);
    //         event.reply('import-response', 'Error importing data: ' + error.message);
    //     }
    // });

    // ------------------MTO------------------------------

    // ipcMain.on('import-excel', async (event, data) => {
    //     if (!databasePath) {
    //         console.error('Project database path not available.');
    //         return;
    //     }
    //     console.log(data);
    //     const specId = generateCustomID('Sp');


    //     const projectDb = new sqlite3.Database(databasePath, (err) => {
    //         if (err) {
    //             console.error('Error opening project database:', err.message);
    //             return;
    //         }
    //         Object.entries(data).forEach(([sheet, rows]) => {
    //             switch (sheet) {
    //                 // case 'SpecDetails':
    //                 //     console.log(`sheet:${sheet}`);
    //                 //     console.log(rows);
    //                 //     break;
    //                 case 'materials':
    //                     insertMaterialsData(rows, specId);
    //                     // console.log(`sheet:${sheet}`);
    //                     // console.log(rows);

    //                     break;
    //                 case 'size':
    //                     insertSizeData(rows, specId);
    //                     // console.log(`sheet:${sheet}`);
    //                     // console.log(rows);
    //                     break;
    //                 case 'Temppres':
    //                     insertTemppresData(rows, specId);
    //                     // console.log(`sheet:${sheet}`);
    //                     // console.log(rows);
    //                     break;
    //                 default:
    //                     console.warn(`Unknown sheet: ${sheet}`);
    //             }
    //         });
    //         projectDb.all("SELECT * FROM MtoSpecSizeTable", (err, rows) => {
    //             if (err) {
    //                 console.error('Error fetching data from MtoBranchTable table:', err.message);
    //                 return;
    //             }
    //             // console.log(rows);
    //             mainWindow.webContents.send('specsize-table-response', rows);

    //         });
    //         projectDb.all("SELECT * FROM MtoSpecMaterialTable", (err, rows) => {
    //             if (err) {
    //                 console.error('Error fetching data from MtoBranchTable table:', err.message);
    //                 return;
    //             }
    //             console.log(`mtospecmaterialtable value: ${rows}`);
    //             mainWindow.webContents.send('specmat-table-response', rows);

    //         });
    //         projectDb.all("SELECT * FROM MtoSpecTempPresTable", (err, rows) => {
    //             if (err) {
    //                 console.error('Error fetching data from MtoBranchTable table:', err.message);
    //                 return;
    //             }
    //             // console.log(rows);
    //             mainWindow.webContents.send('spectemp-table-response', rows);
    //         });
    //     })
    //     event.reply('import-response', 'Data imported successfully');

    // });

    // ipcMain.on('import-excel', async (event, data) => {
    //     if (!databasePath) {
    //         console.error('Project database path not available.');
    //         return;
    //     }

    //     const projectDb = new sqlite3.Database(databasePath, (err) => {
    //         if (err) {
    //             console.error('Error opening project database:', err.message);
    //             return;
    //         }

    //         const specId = generateCustomID('Sp');

    //         // First insert materials data
    //         const materialStmt = projectDb.prepare(`INSERT INTO MtoSpecMaterialTable (
    //             specMaterialId, specId, itemType, fittingType, size1, size2,
    //             GeometricStd, EDS_VDS, endConn, materialDescrip, MDS, rating,
    //             SCHD, Notes
    //         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    //         console.log(`materials value${data.materials}`);

    //         data.materials.forEach(row => {
    //             const specMaterialId = generateCustomID('Ma');
    //             materialStmt.run([
    //                 specMaterialId,
    //                 specId,
    //                 row.itemType,
    //                 row.fittingType,
    //                 row.size1,
    //                 row.size2,
    //                 row.geometricStandard,
    //                 row.edsVds,
    //                 row.endConn,
    //                 row.materialDescr,
    //                 row.mds,
    //                 row.rating,
    //                 row.schd,
    //                 row.notes
    //             ], (err) => {
    //                 if (err) {
    //                     console.error('Error inserting materials row:', err);
    //                 }
    //             });
    //         });
    //         materialStmt.finalize();

    //         // Then insert size data
    //         const sizeStmt = projectDb.prepare(`INSERT INTO MtoSpecSizeTable 
    //             (SizeId, specId, ND_inch, OD_mm, THK_mm, SCH, WEIGHT) 
    //             VALUES (?, ?, ?, ?, ?, ?, ?)`);
    //         console.log(`size values ${data.size}`);

    //         const ndInchRow = data.size.find(row => row[0] === 'ND (inch)');
    //         const odRow = data.size.find(row => row[0] === 'OD (mm)');
    //         const thkRow = data.size.find(row => row[0] === 'THK (mm)');
    //         const schRow = data.size.find(row => row[0] === 'SCH');
    //         const weightRow = data.size.find(row => row[0] === 'WEIGHT');

    //         for (let i = 1; i < ndInchRow.length; i++) {
    //             const SizeId = generateCustomID('Si');
    //             sizeStmt.run([
    //                 SizeId,
    //                 specId,
    //                 ndInchRow[i],
    //                 odRow[i],
    //                 thkRow[i],
    //                 schRow[i],
    //                 weightRow[i]
    //             ], (err) => {
    //                 if (err) {
    //                     console.error('Error inserting size row:', err);
    //                 }
    //             });
    //         }
    //         sizeStmt.finalize();

    //         // Finally insert temperature/pressure data
    //         const tempPresStmt = projectDb.prepare(`INSERT INTO MtoSpecTempPresTable 
    //             (tempPresId, specId, Pressure_Barg, Temperature_Deg_C)
    //             VALUES (?, ?, ?, ?)`);
    //         console.log(`temp values ${data.Temppres}`);

    //         const pressureRow = data.Temppres.find(row => row[0] === 'Pressure (Barg)');
    //         const temperatureRow = data.Temppres.find(row => row[0] === 'Temperature (Deg. C)');

    //         for (let i = 1; i < pressureRow.length; i++) {
    //             const tempPresId = generateCustomID('Te');
    //             tempPresStmt.run([
    //                 tempPresId,
    //                 specId,
    //                 pressureRow[i],
    //                 temperatureRow[i]
    //             ], (err) => {
    //                 if (err) {
    //                     console.error('Error inserting Temppres row:', err);
    //                 }
    //             });
    //         }
    //         tempPresStmt.finalize();

    //         // Fetch and send back all data
    // projectDb.all("SELECT * FROM MtoSpecSizeTable", (err, rows) => {
    //     if (err) {
    //         console.error('Error fetching data from MtoSpecSizeTable:', err.message);
    //         return;
    //     }
    //     console.log('Data in the MtoSpecSizeTable table:', rows);
    //     mainWindow.webContents.send('specsize-table-response', rows);
    // });

    // projectDb.all("SELECT * FROM MtoSpecMaterialTable", (err, rows) => {
    //     if (err) {
    //         console.error('Error fetching data from MtoSpecMaterialTable:', err.message);
    //         return;
    //     }
    //     console.log('Data in the MtoSpecMaterialTable table:', rows);
    //     mainWindow.webContents.send('specmat-table-response', rows);
    // });

    // projectDb.all("SELECT * FROM MtoSpecTempPresTable", (err, rows) => {
    //     if (err) {
    //         console.error('Error fetching data from MtoSpecTempPresTable:', err.message);
    //         return;
    //     }
    //     console.log('Data in the MtoSpecTempPresTable table:', rows);
    //     mainWindow.webContents.send('spectemp-table-response', rows);
    // });
    //     });

    //     event.reply('import-response', 'Data imported successfully');
    // });

    // ipcMain.on('import-excel', async (event, data) => {
    //     if (!databasePath) {
    //         event.reply('import-response', { success: false, error: 'Project database path not available.' });
    //         return;
    //     }

    //     const projectDb = new sqlite3.Database(databasePath);
    //     let statements = []; // Track all prepared statements

    //     try {
    //         const specId = generateCustomID('Sp');

    //         await new Promise((resolve, reject) => {
    //             projectDb.serialize(() => {
    //                 projectDb.run('BEGIN TRANSACTION');

    //                 // First insert into MtoSpecTable
    //                 projectDb.run(
    //                     `INSERT INTO MtoSpecTable (
    //                         specId, Documentnumber, specName, Revision, 
    //                         RevisionDate, branchTable, type
    //                     ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    //                     [
    //                         specId,
    //                         data.SpecDetails.Documentnumber,
    //                         data.SpecDetails.specName,
    //                         data.SpecDetails.Revision,
    //                         data.SpecDetails.RevisionDate,
    //                         data.SpecDetails.branchTable,
    //                         data.SpecDetails.type
    //                     ],
    //                     (err) => {
    //                         if (err) {
    //                             reject(err);
    //                             return;
    //                         }
    //                     }
    //                 );

    //                 // Materials Table Insertion
    //                 const materialStmt = projectDb.prepare(`
    //                     INSERT INTO MtoSpecMaterialTable (
    //                         specMaterialId, specId, itemType, fittingType, size1, size2,
    //                         GeometricStd, EDS_VDS, endConn, materialDescrip, MDS, rating,
    //                         SCHD, Notes
    //                     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    //                 `);
    //                 statements.push(materialStmt);

    //                 data.specfinal.forEach(row => {
    //                     const specMaterialId = generateCustomID('Ma');
    //                     materialStmt.run([
    //                         specMaterialId,
    //                         specId,
    //                         row.itemType,
    //                         row.fittingType,
    //                         row.size1,
    //                         row.size2,
    //                         row.geometricStandard,
    //                         row.edsVds,
    //                         row.endConn,
    //                         row.materialDescr,
    //                         row.mds,
    //                         row.rating,
    //                         row.schd,
    //                         row.notes
    //                     ], (err) => {
    //                         if (err) reject(err);
    //                     });
    //                 });

    //                 // Size Table Insertion
    //                 const sizeStmt = projectDb.prepare(`
    //                     INSERT INTO MtoSpecSizeTable 
    //                     (SizeId, specId, ND_inch, OD_mm, THK_mm, SCH, WEIGHT) 
    //                     VALUES (?, ?, ?, ?, ?, ?, ?)
    //                 `);
    //                 statements.push(sizeStmt);

    //                 const ndInchRow = data.size.find(row => row[0] === 'ND (inch)');
    //                 const odRow = data.size.find(row => row[0] === 'OD (mm)');
    //                 const thkRow = data.size.find(row => row[0] === 'THK (mm)');
    //                 const schRow = data.size.find(row => row[0] === 'SCH');
    //                 const weightRow = data.size.find(row => row[0] === 'WEIGHT');

    //                 for (let i = 1; i < ndInchRow.length; i++) {
    //                     const SizeId = generateCustomID('Si');
    //                     sizeStmt.run([
    //                         SizeId,
    //                         specId,
    //                         ndInchRow[i],
    //                         odRow[i],
    //                         thkRow[i],
    //                         schRow[i],
    //                         weightRow[i]
    //                     ], (err) => {
    //                         if (err) reject(err);
    //                     });
    //                 }

    //                 // Temperature/Pressure Table Insertion
    //                 const tempPresStmt = projectDb.prepare(`
    //                     INSERT INTO MtoSpecTempPresTable 
    //                     (tempPresId, specId, Pressure_Barg, Temperature_Deg_C)
    //                     VALUES (?, ?, ?, ?)
    //                 `);
    //                 statements.push(tempPresStmt);

    //                 const pressureRow = data.Temppres.find(row => row[0] === 'Pressure (Barg)');
    //                 const temperatureRow = data.Temppres.find(row => row[0] === 'Temperature (Deg. C)');

    //                 for (let i = 1; i < pressureRow.length; i++) {
    //                     const tempPresId = generateCustomID('Te');
    //                     tempPresStmt.run([
    //                         tempPresId,
    //                         specId,
    //                         pressureRow[i],
    //                         temperatureRow[i]
    //                     ], (err) => {
    //                         if (err) reject(err);
    //                     });
    //                 }

    // const specDetStmt = projectDb.prepare(`
    //     INSERT INTO MtoSpecDetTable (
    //         specDetId, specId, ITEM, TYPE, RANGE_FROM, RANGE_TO,
    //         GEOMETRIC_STANDARD, EDS_VDS, END_CONN_1, END_CONN_2,
    //         MATERIAL_DESCR, MDS, RATING, SCHD, NOTES
    //     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    // `);
    // statements.push(specDetStmt);

    // // Process materials data starting from index 3 to skip headers
    // data.materials.slice(2).forEach(row => {
    //     const specDetId = generateCustomID('Sd');
    //     specDetStmt.run([
    //         specDetId,
    //         specId,
    //         row[0],  // ITEM (itemType)
    //         row[1],  // TYPE (fittingType)
    //         row[2],  // RANGE_FROM
    //         row[3],  // RANGE_TO
    //         row[4],  // GEOMETRIC_STANDARD
    //         row[5],  // EDS_VDS
    //         row[6],  // END_CONN_1
    //         row[6],  // END_CONN_2 (same as END_CONN_1)
    //         row[7],  // MATERIAL_DESCR
    //         row[8],  // MDS
    //         row[9],  // RATING
    //         row[10], // SCHD
    //         row[11]  // NOTES
    //     ], (err) => {
    //         if (err) reject(err);
    //     });
    // });

    //                 // Finalize all statements before committing
    //                 statements.forEach(stmt => stmt.finalize());

    //                 // Commit transaction and fetch results
    //                 projectDb.run('COMMIT', (err) => {
    //                     if (err) {
    //                         reject(err);
    //                         return;
    //                     }

    //                     // Fetch and send data
    //                     const queries = [
    //                         { table: 'MtoSpecSizeTable', event: 'specsize-table-response' },
    //                         { table: 'MtoSpecMaterialTable', event: 'specmat-table-response' },
    //                         { table: 'MtoSpecTempPresTable', event: 'spectemp-table-response' },
    //                         { table: 'MtoSpecTable', event: 'specdet-table-response' },
    //                         {table: 'MtoSpecDetTable', event: 'specdet-detail-response'}
    //                     ];

    //                     let completed = 0;
    //                     queries.forEach(({ table, event }) => {
    //                         projectDb.all(`SELECT * FROM ${table}`, (err, rows) => {
    //                             if (err) {
    //                                 console.error(`Error fetching from ${table}:`, err);
    //                             } else {
    //                                 if (event) {
    //                                     mainWindow.webContents.send(event, rows);
    //                                 } else {
    //                                     console.log(`Data in the ${table} table:`, rows);
    //                                 }
    //                             }
    //                             completed++;
    //                             if (completed === queries.length) {
    //                                 resolve();
    //                             }
    //                         });
    //                     });
    //                 });
    //             });
    //         });

    //         event.reply('import-response', {
    //             success: true,
    //             message: 'Data imported successfully'
    //         });

    //     } catch (error) {
    //         // Rollback on error
    //         projectDb.run('ROLLBACK');
    //         console.error('Error during import:', error);
    //         event.reply('import-response', {
    //             success: false,
    //             error: 'Failed to import data: ' + error.message
    //         });
    //     } finally {
    //         // Ensure all statements are finalized before closing
    //         statements.forEach(stmt => {
    //             try {
    //                 stmt.finalize();
    //             } catch (e) {
    //                 console.error('Error finalizing statement:', e);
    //             }
    //         });

    //         // Close database connection
    //         projectDb.close((err) => {
    //             if (err) {
    //                 console.error('Error closing database:', err);
    //             }
    //         });
    //     }
    // });

    ipcMain.on('import-excel', async (event, data) => {
        if (!databasePath) {
            event.reply('import-response', { success: false, error: 'Project database path not available.' });
            return;
        }

        const projectDb = new sqlite3.Database(databasePath);
        let statements = []; // Track all prepared statements
        let statementsFinalized = false; // Track if statements have been finalized


        try {
            const specId = generateCustomID('Sp');

            await new Promise((resolve, reject) => {
                projectDb.serialize(() => {
                    projectDb.run('BEGIN TRANSACTION');

                    // First insert into MtoSpecTable
                    projectDb.run(
                        `INSERT INTO MtoSpecTable (
                            specId, Documentnumber, specName, Revision, 
                            RevisionDate, branchTable, type
                        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            specId,
                            data.SpecDetails.Documentnumber,
                            data.SpecDetails.specName,
                            data.SpecDetails.Revision,
                            data.SpecDetails.RevisionDate,
                            data.SpecDetails.branchTable,
                            data.SpecDetails.type
                        ],
                        (err) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                        }
                    );

                    // SpecDet Table Insertion
                    const specDetStmt = projectDb.prepare(`
                        INSERT INTO MtoSpecDetTable (
                            specDetId, specId, ITEM, TYPE, RANGE_FROM, RANGE_TO,
                            GEOMETRIC_STANDARD, EDS_VDS, END_CONN_1, END_CONN_2,
                            MATERIAL_DESCR , MATERIAL_LG_DESCR, MDS, RATING, SCHD, NOTES
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
                    `);
                    statements.push(specDetStmt);

                    // Process materials data starting from index 3 to skip headers
                    data.materials.slice(2).forEach(row => {
                        const specDetId = generateCustomID('Sd');
                        specDetStmt.run([
                            specDetId,
                            specId,
                            row[0],  // ITEM (itemType)
                            row[1],  // TYPE (fittingType)
                            row[2],  // RANGE_FROM
                            row[3],  // RANGE_TO
                            row[4],  // GEOMETRIC_STANDARD
                            row[5],  // EDS_VDS
                            row[6],  // END_CONN_1
                            row[7],  // END_CONN_2 (same as END_CONN_1)
                            row[8],  // MATERIAL_DESCR
                            row[9],  // MATERIAL_LG_DESCR
                            row[10],   // MDS
                            row[11],  // RATING
                            row[12],   // SCHD
                            row[13]    // NOTES
                        ], (err) => {
                            if (err) reject(err);
                        });
                    });


                    // Materials Table Insertion for specfinal data
                    const materialStmt = projectDb.prepare(`
                        INSERT INTO MtoSpecMaterialTable (
                            specMaterialId, specId, itemType, fittingType, size1, size2,
                            GeometricStd, EDS_VDS, endConn, materialDescrip, materialLgDescrip, MDS, rating,
                            thkSizeOne,thkSizeTwo,schdSizeOne,schdSizeTwo, Notes
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)
                    `);
                    statements.push(materialStmt);

                    data.specfinal.forEach(row => {
                        const specMaterialId = generateCustomID('Ma');
                        materialStmt.run([
                            specMaterialId,
                            specId,
                            row.itemType,
                            row.fittingType,
                            row.size1,
                            row.size2,
                            row.geometricStandard,
                            row.edsVds,
                            row.endConn,
                            row.materialDescr,
                            row.materialLongDescr,
                            row.mds,
                            row.rating,
                            row.THKsize1,
                            row.THKsize2,
                            row.schdsize1,
                            row.schdsize2,
                            row.notes
                        ], (err) => {
                            if (err) reject(err);
                        });
                    });

                    // Size Table Insertion
                    const sizeStmt = projectDb.prepare(`
                        INSERT INTO MtoSpecSizeTable 
                        (SizeId, specId, ND_inch, OD_mm, THK_mm, SCH, WEIGHT) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `);
                    statements.push(sizeStmt);

                    const ndInchRow = data.size.find(row => row[0] === 'ND (inch)');
                    const odRow = data.size.find(row => row[0] === 'OD (mm)');
                    const thkRow = data.size.find(row => row[0] === 'THK (mm)');
                    const schRow = data.size.find(row => row[0] === 'SCH');
                    const weightRow = data.size.find(row => row[0] === 'WEIGHT');

                    for (let i = 1; i < ndInchRow.length; i++) {
                        const SizeId = generateCustomID('Si');
                        sizeStmt.run([
                            SizeId,
                            specId,
                            ndInchRow[i],
                            odRow[i],
                            thkRow[i],
                            schRow[i],
                            weightRow[i]
                        ], (err) => {
                            if (err) reject(err);
                        });
                    }

                    // Temperature/Pressure Table Insertion
                    const tempPresStmt = projectDb.prepare(`
                        INSERT INTO MtoSpecTempPresTable 
                        (tempPresId, specId, Pressure_Barg, Temperature_Deg_C)
                        VALUES (?, ?, ?, ?)
                    `);
                    statements.push(tempPresStmt);

                    const pressureRow = data.Temppres.find(row => row[0] === 'Pressure (Barg)');
                    const temperatureRow = data.Temppres.find(row => row[0] === 'Temperature (Deg. C)');

                    for (let i = 1; i < pressureRow.length; i++) {
                        const tempPresId = generateCustomID('Te');
                        tempPresStmt.run([
                            tempPresId,
                            specId,
                            pressureRow[i],
                            temperatureRow[i]
                        ], (err) => {
                            if (err) reject(err);
                        });
                    }

                    // Finalize statements
                    if (!statementsFinalized) {
                        statements.forEach(stmt => {
                            try {
                                stmt.finalize();
                            } catch (e) {
                                console.warn('Statement already finalized:', e.message);
                            }
                        });
                        statementsFinalized = true;
                    }

                    // Commit transaction and fetch results
                    projectDb.run('COMMIT', (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const queries = [
                            { table: 'MtoSpecSizeTable', event: 'specsize-table-response' },
                            { table: 'MtoSpecMaterialTable', event: 'specmat-table-response' },
                            { table: 'MtoSpecTempPresTable', event: 'spectemp-table-response' },
                            { table: 'MtoSpecTable', event: 'specdet-table-response' },
                            { table: 'MtoSpecDetTable', event: 'specdet-detail-response' }
                        ];

                        let completed = 0;
                        queries.forEach(({ table, event }) => {
                            projectDb.all(`SELECT * FROM ${table}`, (err, rows) => {
                                if (err) {
                                    console.error(`Error fetching from ${table}:`, err);
                                } else {
                                    if (event) {
                                        mainWindow.webContents.send(event, rows);
                                    }
                                }
                                completed++;
                                if (completed === queries.length) {
                                    resolve();
                                }
                            });
                        });
                    });
                });
            });

            event.reply('import-response', {
                success: true,
                message: 'Data imported successfully'
            });

        } catch (error) {
            projectDb.run('ROLLBACK');
            console.error('Error during import:', error);
            event.reply('import-response', {
                success: false,
                error: 'Failed to import data: ' + error.message
            });
        } finally {
            // Only finalize statements if they haven't been finalized yet
            if (!statementsFinalized && statements.length > 0) {
                statements.forEach(stmt => {
                    try {
                        stmt.finalize();
                    } catch (e) {
                        // Ignore finalization errors in cleanup
                    }
                });
            }

            projectDb.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                }
            });
        }
    });



    ipcMain.on('branchtabledata', (event, data) => {

        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            const branchId = generateCustomID('B');

            projectDb.run(
                'INSERT INTO MtoBranchTable (branchId, Documentnumber, branchtableName, Revision, RevisionDate, ExcelFileid) VALUES (?, ?, ?, ?, ?, ?)',
                [branchId, data.documentNumber, data.branchTableName, data.revision, data.revisionDate, data.excelFileId],
                function (err) {
                    if (err) {
                        console.error('Error inserting into MtoBranchTable:', err.message);
                        return;
                    }

                    // Insert data into MtoBranchTableData table
                    const stmt = projectDb.prepare('INSERT INTO MtoBranchTableData (BranchTableId, branchId, MainSize, branchSize, Item, ItemDescription) VALUES (?, ?, ?, ?, ?, ?)');
                    data.transformedData.forEach((row) => {
                        const BranchTableId = generateCustomID('BT');
                        stmt.run(BranchTableId, branchId, row.size1, row.size2, row.item, row.itemDes);
                    });
                    stmt.finalize();
                }
            );

            projectDb.all("SELECT * FROM MtoBranchTable", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from MtoBranchTable table:', err.message);
                    return;
                }
                mainWindow.webContents.send('branch-table-response', rows);
            });
            projectDb.all("SELECT * FROM MtoBranchTableData", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from MtoBranchTableData table:', err.message);
                    return;
                }
                mainWindow.webContents.send('branch-table-data-response', rows);
            });
        })

    })

    ipcMain.on('save-custom-spec', (event, data) => {

        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            const specCustomId = generateCustomID('Sc');

            projectDb.run(
                'INSERT INTO MtoCustomTable (specCustomId , itemType , fittingType , size1 , size2 , GeometricStd , EDS_VDS , endConn , materialDescrip , MDS , rating , SCHD , Notes , remarks , preparedBy ,checkedBy , approvedBy ) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?)',
                [specCustomId, data.itemType, data.fittingType, data.size1, data.size2, data.GeometricStd, data.EDS_VDS, data.endConn, data.materialDescrip, data.MDS, data.rating, data.SCHD, data.Notes, data.remarks, data.preparedBy, data.checkedBy, data.approvedBy],
                function (err) {
                    if (err) {
                        console.error('Error inserting into MtoCustomTable:', err.message);
                        return;
                    }
                    console.log(`Row inserted with status: ${data.itemType}`);
                }

            );
            projectDb.all("SELECT * FROM MtoCustomTable", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the MtoCustomTable table:', rows);
                mainWindow.webContents.send('custom-spec-res', rows);
            });
        })

    })

    // ipcMain.on('spec-excel-data', (event, data) => {
    //     if (!databasePath) {
    //         console.error('Project database path not available.');
    //         return;
    //     }

    //     const projectDb = new sqlite3.Database(databasePath);

    //     try {
    //         projectDb.serialize(() => {
    //             projectDb.run('BEGIN TRANSACTION', (err) => {
    //                 if (err) {
    //                     console.error('Error starting transaction:', err);
    //                     return;
    //                 }

    //                 // Skip the header row (index 0) and process each data row
    //                 const insertPromises = data.slice(1).map((row, index) => {
    //                     return new Promise((resolve, reject) => {
    //                         const specCustomId = generateCustomID('Sc');

    //                         projectDb.run(
    //                             `INSERT INTO MtoCustomTable (
    //                                 specCustomId, itemType, fittingType, size1, size2, 
    //                                 GeometricStd, EDS_VDS, endConn, materialDescrip, 
    //                                 MDS, rating, SCHD, Notes, remarks, preparedBy, 
    //                                 checkedBy, approvedBy
    //                             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //                             [
    //                                 specCustomId,
    //                                 row[0],  // itemType
    //                                 row[1],  // fittingType
    //                                 row[2],  // size1
    //                                 row[3],  // size2
    //                                 row[4],  // GeometricStd
    //                                 row[5],  // EDS_VDS
    //                                 row[6],  // endConn
    //                                 row[7],  // materialDescrip
    //                                 row[8],  // MDS
    //                                 row[9],  // rating
    //                                 row[10], // SCHD
    //                                 row[11], // Notes
    //                                 row[12], // remarks
    //                                 row[13], // preparedBy
    //                                 row[14], // checkedBy
    //                                 row[15]  // approvedBy
    //                             ],
    //                             function (err) {
    //                                 if (err) {
    //                                     console.error('Error inserting row:', err);
    //                                     reject(err);
    //                                     return;
    //                                 }
    //                                 console.log(`Row ${index + 1} inserted successfully`);
    //                                 resolve();
    //                             }
    //                         );
    //                     });
    //                 });

    //                 // Wait for all inserts to complete
    //                 Promise.all(insertPromises)
    //                     .then(() => {
    //                         // Commit transaction
    //                         projectDb.run('COMMIT', (err) => {
    //                             if (err) {
    //                                 console.error('Error committing transaction:', err);
    //                                 projectDb.run('ROLLBACK');
    //                                 return;
    //                             }

    //                             // Fetch and send updated data
    //                             projectDb.all("SELECT * FROM MtoCustomTable", (err, rows) => {
    //                                 if (err) {
    //                                     console.error('Error fetching data:', err.message);
    //                                     return;
    //                                 }
    //                                 console.log('Data in the MtoCustomTable table:', rows);
    //                                 mainWindow.webContents.send('custom-spec-res', rows);

    //                                 // Close database only after all operations are complete
    //                                 projectDb.close((err) => {
    //                                     if (err) {
    //                                         console.error('Error closing database:', err);
    //                                     }
    //                                 });
    //                             });
    //                         });
    //                     })
    //                     .catch(error => {
    //                         console.error('Error during inserts:', error);
    //                         projectDb.run('ROLLBACK', () => {
    //                             projectDb.close((err) => {
    //                                 if (err) {
    //                                     console.error('Error closing database:', err);
    //                                 }
    //                             });
    //                         });
    //                     });
    //             });
    //         });
    //     } catch (error) {
    //         console.error('Error during transaction:', error);
    //         projectDb.run('ROLLBACK', () => {
    //             projectDb.close((err) => {
    //                 if (err) {
    //                     console.error('Error closing database:', err);
    //                 }
    //             });
    //         });
    //     }
    // });

    ipcMain.on('spec-excel-data', (event, data) => {
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Skip the header row (index 0) and process each data row
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                const specCustomId = generateCustomID('Sc');

                // Create an object mapping headers to values
                const rowData = {
                    itemType: row[0],
                    fittingType: row[1],
                    size1: row[2],
                    size2: row[3],
                    GeometricStd: row[4],
                    EDS_VDS: row[5],
                    endConn: row[6],
                    materialDescrip: row[7],
                    MDS: row[8],
                    rating: row[9],
                    SCHD: row[10],
                    Notes: row[11],
                    remarks: row[12],
                    preparedBy: row[13],
                    checkedBy: row[14],
                    approvedBy: row[15]
                };

                projectDb.run(
                    'INSERT INTO MtoCustomTable (specCustomId, itemType, fittingType, size1, size2, GeometricStd, EDS_VDS, endConn, materialDescrip, MDS, rating, SCHD, Notes, remarks, preparedBy, checkedBy, approvedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        specCustomId,
                        rowData.itemType,
                        rowData.fittingType,
                        rowData.size1,
                        rowData.size2,
                        rowData.GeometricStd,
                        rowData.EDS_VDS,
                        rowData.endConn,
                        rowData.materialDescrip,
                        rowData.MDS,
                        rowData.rating,
                        rowData.SCHD,
                        rowData.Notes,
                        rowData.remarks,
                        rowData.preparedBy,
                        rowData.checkedBy,
                        rowData.approvedBy
                    ],
                    function (err) {
                        if (err) {
                            console.error('Error inserting into MtoCustomTable:', err.message);
                            return;
                        }
                        console.log(`Row ${i} inserted successfully`);
                    }
                );
            }

            // Fetch all data after insertions are complete
            projectDb.all("SELECT * FROM MtoCustomTable", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }
                console.log('Data in the MtoCustomTable table:', rows);
                mainWindow.webContents.send('custom-spec-res', rows);
            });
        });
    });

    ipcMain.on('update-customspec-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Extracting updated data
        const { itemType, fittingType, size1, size2, GeometricStd, EDS_VDS, endConn, materialDescrip, MDS, rating, SCHD, Notes, remarks, preparedBy, checkedBy, approvedBy, specCustomId } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run(`UPDATE MtoCustomTable SET 
                itemType = ?, fittingType = ?, size1 = ?, size2 = ?, GeometricStd = ?, 
                EDS_VDS = ?, endConn = ?, materialDescrip = ?, MDS = ?, rating = ?, SCHD = ?, Notes = ?, remarks = ?, preparedBy = ?, checkedBy = ?, approvedBy = ? WHERE specCustomId = ?`,
                [
                    itemType, fittingType, size1, size2, GeometricStd, EDS_VDS, endConn, materialDescrip, MDS, rating, SCHD, Notes, remarks, preparedBy, checkedBy, approvedBy, specCustomId
                ],
                (err) => {
                    if (err) {
                        console.error('Error updating MtoCustomTable table:', err.message);
                        return;
                    }

                    console.log('MtoCustomTable table updated successfully.');
                    // Fetch updated data from the LineList table
                    projectDb.all("SELECT * FROM MtoCustomTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }
                        console.log('Data in the MtoCustomTable table:', rows);
                        mainWindow.webContents.send('custom-spec-res', rows);
                    });
                }
            );
        });
    });

    ipcMain.on('Mto-doc-save', (event, data) => {

        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            const Mto_DocID = generateCustomID('Md');

            projectDb.run(
                'INSERT INTO MtoDocumentTable (Mto_DocID , ProjID, M_DocNo, M_DocName, RevNo, RevDate, RevDes, RevPreBy, RevChecBy, RevAppBy, RevPrepDate, RevCheckDate, RevAppDate, ChecklistNo, MtoSta, Preocur ) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?, ?, ?, ?)',
                [Mto_DocID, data.ProjID, data.M_DocNo, data.M_DocName, data.RevNo, data.RevDate, data.RevDes, data.RevPreBy, data.RevChecBy, data.RevAppBy, data.RevPrepDate, data.RevCheckDate, data.ChecklistNo, data.MtoSta, data.Preocur],
                function (err) {
                    if (err) {
                        console.error('Error inserting into MtoDocumentTable:', err.message);
                        return;
                    }
                    console.log(`Row inserted with status: ${data.itemType}`);
                }

            );
            projectDb.all("SELECT * FROM MtoDocumentTable", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the MtoDocumentTable table:', rows);
                mainWindow.webContents.send('save-doc-mto', rows);
            });
        })

    })

    ipcMain.on('Mto-area-save', (event) => {
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const data = [
            { area: 1000, name: 'Area1' },
            { area: 1001, name: 'Area2' },
            { area: 1002, name: 'Area3' }
        ];

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Begin transaction for better performance with multiple inserts
            projectDb.run('BEGIN TRANSACTION', (err) => {
                if (err) {
                    console.error('Error starting transaction:', err.message);
                    return;
                }

                const insertPromises = data.map(item => {
                    return new Promise((resolve, reject) => {
                        const mtoareaId = generateCustomID('Am');

                        projectDb.run(
                            'INSERT INTO MtoAreaTable (mtoareaId, area, name) VALUES (?, ?, ?)',
                            [mtoareaId, item.area, item.name],
                            function (err) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            }
                        );
                    });
                });

                Promise.all(insertPromises)
                    .then(() => {
                        // Commit transaction after all inserts are successful
                        projectDb.run('COMMIT', (err) => {
                            if (err) {
                                console.error('Error committing transaction:', err.message);
                                return;
                            }

                            // Fetch all records after successful insert
                            projectDb.all("SELECT * FROM MtoAreaTable", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from MtoAreaTable:', err.message);
                                    return;
                                }

                                console.log('Data in the MtoAreaTable table:', rows);
                                mainWindow.webContents.send('area-save-mto', rows);
                            });
                        });
                    })
                    .catch(err => {
                        console.error('Error during insertion:', err.message);
                        // Rollback transaction if any insert fails
                        projectDb.run('ROLLBACK', (rollbackErr) => {
                            if (rollbackErr) {
                                console.error('Error rolling back transaction:', rollbackErr.message);
                            }
                        });
                    });
            });
        });
    });

    // ipcMain.on('Mto-tag-save', (event) => {
    //     if (!databasePath) {
    //         console.error('Project database path not available.');
    //         return;
    //     }
    //     const data = [
    //         {number: L001, name: 'Line1'},
    //         {number: L002, name: 'Line2'},
    //         {number: L003, name: 'Line3'}
    //     ];

    //     const projectDb = new sqlite3.Database(databasePath, (err) => {
    //         if (err) {
    //             console.error('Error opening project database:', err.message);
    //             return;
    //         }

    //         // Begin transaction for better performance with multiple inserts
    //         projectDb.run('BEGIN TRANSACTION', (err) => {
    //             if (err) {
    //                 console.error('Error starting transaction:', err.message);
    //                 return;
    //             }

    //             const insertPromises = data.map(item => {
    //                 return new Promise((resolve, reject) => {
    //                     const mtotagId = generateCustomID('At');

    //                     projectDb.run(
    //                         'INSERT INTO MtoTagTable (mtotagId, number, name) VALUES (?, ?, ?)',
    //                         [mtoareaId, item.number, item.name],
    //                         function (err) {
    //                             if (err) {
    //                                 reject(err);
    //                             } else {
    //                                 resolve();
    //                             }
    //                         }
    //                     );
    //                 });
    //             });

    //             Promise.all(insertPromises)
    //                 .then(() => {
    //                     // Commit transaction after all inserts are successful
    //                     projectDb.run('COMMIT', (err) => {
    //                         if (err) {
    //                             console.error('Error committing transaction:', err.message);
    //                             return;
    //                         }

    //                         // Fetch all records after successful insert
    //                         projectDb.all("SELECT * FROM MtoTagTable", (err, rows) => {
    //                             if (err) {
    //                                 console.error('Error fetching data from MtoTagTable:', err.message);
    //                                 return;
    //                             }

    //                             console.log('Data in the MtoTagTable table:', rows);
    //                             mainWindow.webContents.send('tag-save-mto', rows);
    //                         });
    //                     });
    //                 })
    //                 .catch(err => {
    //                     console.error('Error during insertion:', err.message);
    //                     // Rollback transaction if any insert fails
    //                     projectDb.run('ROLLBACK', (rollbackErr) => {
    //                         if (rollbackErr) {
    //                             console.error('Error rolling back transaction:', rollbackErr.message);
    //                         }
    //                     });
    //                 });
    //         });
    //     });
    // });


    ipcMain.on('Mto-tag-save', (event) => {
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const data = [
            { number: 'L001', name: 'Line1' },
            { number: 'L002', name: 'Line2' },
            { number: 'L003', name: 'Line3' }
        ];

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Begin transaction for better performance with multiple inserts
            projectDb.run('BEGIN TRANSACTION', (err) => {
                if (err) {
                    console.error('Error starting transaction:', err.message);
                    return;
                }

                const insertPromises = data.map(item => {
                    return new Promise((resolve, reject) => {
                        const mtotagId = generateCustomID('At');

                        // First insert into MtoTagTable
                        projectDb.run(
                            'INSERT INTO MtoTagTable (mtotagId, number, name) VALUES (?, ?, ?)',
                            [mtotagId, item.number, item.name],
                            function (err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                // Then insert into LineList table
                                projectDb.run(
                                    'INSERT INTO MtoLineList (mtotagId, tag) VALUES (?, ?)',
                                    [mtotagId, item.number],
                                    function (err) {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve();
                                        }
                                    }
                                );
                            }
                        );
                    });
                });

                Promise.all(insertPromises)
                    .then(() => {
                        // Commit transaction after all inserts are successful
                        projectDb.run('COMMIT', (err) => {
                            if (err) {
                                console.error('Error committing transaction:', err.message);
                                return;
                            }

                            // Create promises for fetching data from both tables
                            const fetchPromises = [
                                new Promise((resolve, reject) => {
                                    projectDb.all("SELECT * FROM MtoTagTable", (err, rows) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(rows);
                                        }
                                    });
                                }),
                                new Promise((resolve, reject) => {
                                    projectDb.all("SELECT * FROM MtoLineList", (err, rows) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(rows);
                                        }
                                    });
                                })
                            ];

                            // Fetch and send data from both tables
                            Promise.all(fetchPromises)
                                .then(([mtoTagRows, lineListRows]) => {
                                    console.log('Data in the MtoTagTable table:', mtoTagRows);
                                    console.log('Data in the MtoLineList table:', lineListRows);

                                    mainWindow.webContents.send('tag-save-mto', mtoTagRows);
                                    mainWindow.webContents.send('linelist-save-mto', lineListRows);
                                })
                                .catch(err => {
                                    console.error('Error fetching data:', err.message);
                                });
                        });
                    })
                    .catch(err => {
                        console.error('Error during insertion:', err.message);
                        // Rollback transaction if any insert fails
                        projectDb.run('ROLLBACK', (rollbackErr) => {
                            if (rollbackErr) {
                                console.error('Error rolling back transaction:', rollbackErr.message);
                            }
                        });
                    });
            });
        });
    });

    ipcMain.on('save-mtoline-area', (event, data) => {

        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // const Mto_DocID = generateCustomID('Md');

            projectDb.run(
                'INSERT INTO MtoAreaTagRelTable (mtoareaId ,  mtotagId,areaname, tagnumber ) VALUES (?, ?, ?, ?)',
                [data.mtoareaId, data.mtotagId, data.areaname, data.tagnumber],
                function (err) {
                    if (err) {
                        console.error('Error inserting into MtoAreaTagRelTable:', err.message);
                        return;
                    }
                    console.log(`Row inserted with area name: ${data.areaname}`);
                }

            );
            projectDb.all("SELECT * FROM MtoAreaTagRelTable", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the MtoAreaTagRelTable table:', rows);
                mainWindow.webContents.send('mtoline-area-save', rows);
            });
        })

    })

    ipcMain.on('save-material-data', (event, data) => {

        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // const data = {
        //     tagId: mttagid,
        //     tagNo: mttagno,
        //     areaId: mtareaid,
        //     areaName: mtareaname,
        //     Qty: mtlqty,
        //     Item: item
        // }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            const MatID = generateCustomID('Ml');

            projectDb.run(
                'INSERT INTO MtoMaterialListTable (MatID , tagId, tagNo, areaId, areaName, Item, Sizeone, Sizetwo, thkSizeOne, thkSizeTwo, schdSizeOne, schdSizeTwo, Qty ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [MatID, data.tagId, data.tagNo, data.areaId, data.areaName, data.Item, data.Sizeone, data.Sizetwo, data.thkSizeOne, data.thkSizeTwo, data.schdSizeOne, data.schdSizeTwo, data.Qty],
                function (err) {
                    if (err) {
                        console.error('Error inserting into MtoMaterialListTable:', err.message);
                        return;
                    }
                    console.log(`Row inserted with area name: ${data.areaname}`);
                }

            );
            projectDb.all("SELECT * FROM MtoMaterialListTable", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the MtoMaterialListTable table:', rows);
                mainWindow.webContents.send('material-data-save', rows);
            });
        })

    })

    ipcMain.on('update-matdataarea-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Extracting updated data
        const { M_DocNo, fileNo, DocNo, tagNo, areaName, DisName, SysName, Item_Cat, Item, Item_Sh_Des, Item_Lo_Des, Mat_Cat, Material, Sizeone, Sizetwo, Qty, Unit, Unit_Weight, Total_Weight, ItemPos_X, ItemPos_Y, ItemPos_Z, MTO_Source, Unit_Weight_Ref, MatID } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run(`UPDATE MtoMaterialListTable SET 
                M_DocNo = ?, fileNo = ?, DocNo = ?, tagNo = ?, areaName = ?, 
                DisName = ?, SysName = ?, Item_Cat = ?, Item = ?, Item_Sh_Des = ?, Item_Lo_Des = ?, Mat_Cat = ?, Material = ?, Sizeone = ?, Sizetwo = ?, Qty = ?, Unit = ?, Unit_Weight = ?, 
                Total_Weight = ?, ItemPos_X = ?, ItemPos_Y = ?, ItemPos_Z = ?, MTO_Source = ?, Unit_Weight_Ref = ? WHERE MatID = ?`,
                [
                    M_DocNo, fileNo, DocNo, tagNo, areaName, DisName, SysName, Item_Cat, Item, Item_Sh_Des, Item_Lo_Des, Mat_Cat, Material, Sizeone, Sizetwo, Qty, Unit, Unit_Weight, Total_Weight, ItemPos_X, ItemPos_Y, ItemPos_Z, MTO_Source, Unit_Weight_Ref, MatID
                ],
                (err) => {
                    if (err) {
                        console.error('Error updating  MtoMaterialListTable table:', err.message);
                        return;
                    }

                    console.log(' MtoMaterialListTable table updated successfully.');
                    // Fetch updated data from the LineList table
                    projectDb.all("SELECT * FROM  MtoMaterialListTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from  MtoMaterialListTable table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('material-data-save', rows);
                    });

                }
            );
        });
    });

    ipcMain.on('delete-material-data', (event, MatID) => {
        // console.log("Received request to remove discipline with area:", area, "and disc:", disc);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Delete the row with the given tagId
            projectDb.run('DELETE FROM MtoMaterialListTable WHERE MatID = ? ', [MatID], function (err) {
                if (err) {
                    console.error('Error deleting data:', err.message);
                    return;
                }
                console.log(`Row with ${MatID}  deleted successfully.`);
            });

            projectDb.all("SELECT * FROM MtoMaterialListTable", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the MtoMaterialListTable table:', rows);
                mainWindow.webContents.send('material-data-save', rows);
            });

        });
    });

    ipcMain.on('import-mtodataline-list', async (event) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
        });

        if (result.canceled) return;
        const confirmation = await dialog.showMessageBox({
            type: 'question',
            buttons: ['Cancel', 'Upload'],
            defaultId: 1,
            title: 'Confirm Upload',
            message: 'Do you want to upload this file?'
        });
        console.log('testing');


        if (confirmation.response !== 1) return;

        const filePath = result.filePaths[0];
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const lineList = xlsx.utils.sheet_to_json(sheet);
        console.log(`mto list ${lineList}`);
        event.reply('testing', lineList);

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            lineList.forEach((line) => {
                const tagNo = line['Tag No'];
                const areaName = line['Area Name'];
                const M_DocNo = line['M_Document No'];
                const fileNo = line['File No'];
                const DocNo = line['Document No'];
                const DisName = line['Discipline Name'];
                const SysName = line['System Name'];
                const Item_Cat = line['Item Category'];
                const Item = line['Item'];
                const Item_Sh_Des = line['Item Short Description'];
                const Item_Lo_Des = line['Item Long Description'];
                const Mat_Cat = line['Material Category'];
                const Material = line['Material'];
                const Sizeone = line['Size 1'];
                const Sizetwo = line['Size 2'];
                const qty = line['Quantity'];
                const Unit = line['Unit'];
                const Unit_Weight = line['Unit Weight'];
                const Total_Weight = line['Total Weight'];
                const ItemPos_X = line['Item Position X'];
                const ItemPos_Y = line['Item Position Y'];
                const ItemPos_Z = line['Item Position Z'];
                const Unit_Weight_Ref = line['Unit Weight Ref'];
                const mtoSource = line['MTO Source'];
                // console.log(tagNo);
                // console.log(Sizeone);
                const mtotagId = generateCustomID('At');
                const mtoareaId = generateCustomID('Am');


                projectDb.get('SELECT * FROM MtoTagTable WHERE name = ?', [tagNo], (err, row) => {
                    if (err) {
                        console.error('Error checking existing tag in MtoTagTable:', err.message);
                        return;
                    }

                    if (row) {
                        // // Merge existing data with new data, retaining old data where new data is not provided
                        // const updatedLine = {
                        //     mtotagId: row.mtotagId,
                        //     number: tagNo                           
                        // };

                        // // Update the existing record
                        // projectDb.run(
                        //     `UPDATE MtoTagTable SET name = ? WHERE number = ?`,
                        //     [updatedLine.name, updatedLine.number],
                        //     (err) => {
                        //         if (err) {
                        //             console.error('Error updating data in MtoTagTable:', err.message);
                        //             return;
                        //         }
                        //         console.log(`Row updated in MtoTagTable with tag: ${updatedLine.number}`);
                        //         event.reply("tag-exists", { success: true, message: `Tag number ${updatedLine.number} already exist and data updated` })
                        //         projectDb.all("SELECT * FROM MtoTagTable", (err, rows) => {
                        //             if (err) {
                        //                 console.error('Error fetching data from MtoTagTable table:', err.message);
                        //                 return;
                        //             }
                        //             mainWindow.webContents.send('all-lines-fetched', rows);
                        //         });
                        //     }
                        // );

                        // Update TagInfo and Tags if necessary (assuming these tables don't need updates since they are for tag info)
                    }
                    else {
                        // const mtotagId = generateCustomID('At');
                        // // const mtoareaId = generateCustomID('Am');
                        projectDb.run(
                            `INSERT OR IGNORE INTO MtoTagTable (mtotagId,number) VALUES (?, ?)`,
                            [mtotagId, tagNo],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into MtoTagTable:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into MtoTagTable with tag: ${tagNo}`);
                                projectDb.all("SELECT * FROM MtoTagTable", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from LineList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('tag-save-mto', rows);
                                });
                            }
                        );

                        // projectDb.run(
                        //     'INSERT OR IGNORE INTO TagInfo (tagId,tag, type) VALUES (?, ?,?)',
                        //     [TagId, tag, 'Line'],
                        //     (err) => {
                        //         if (err) {
                        //             console.error('Error inserting data into TagInfo:', err.message);
                        //             return;
                        //         }
                        //         console.log(`Row inserted into TagInfo with tag number: ${tag}`);
                        //         projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                        //             if (err) {
                        //                 console.error('Error fetching data from TagInfo table:', err.message);
                        //                 return;
                        //             }
                        //             mainWindow.webContents.send('all-taginfo-fetched', rows);
                        //         });
                        //     }
                        // );

                        // projectDb.run(
                        //     'INSERT OR IGNORE INTO Tags (tagId, number, type) VALUES (?, ?, ?)',
                        //     [TagId, tag, 'Line'],
                        //     (err) => {
                        //         if (err) {
                        //             console.error('Error inserting data into Tags:', err.message);
                        //             return;
                        //         }
                        //         console.log(`Row inserted into Tags with tag number: ${tag}`);
                        //         projectDb.all("SELECT * FROM Tags", (err, rows) => {
                        //             if (err) {
                        //                 console.error('Error fetching data from Tags table:', err.message);
                        //                 return;
                        //             }
                        //             mainWindow.webContents.send('all-tags-fetched', rows);
                        //         });
                        //     }
                        // );
                    }
                });
                projectDb.get('SELECT * FROM MtoAreaTable WHERE name = ?', [tagNo], (err, row) => {
                    if (err) {
                        console.error('Error checking existing tag in MtoTagTable:', err.message);
                        return;
                    }

                    if (row) {

                    }
                    else {

                        // const mtoareaId = generateCustomID('Am');
                        projectDb.run(
                            `INSERT OR IGNORE INTO MtoAreaTable (mtoareaId,name) VALUES (?, ?)`,
                            [mtoareaId, areaName],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into MtoAreaTable:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into MtoAreaTable with area name: ${areaName}`);
                                projectDb.all("SELECT * FROM MtoAreaTable", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from MtoAreaTable table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('area-save-mto', rows);
                                });
                            }
                        );

                    }
                });
                projectDb.get('SELECT * FROM MtoAreaTagRelTable WHERE tagnumber = ?, areaname=?', [tagNo, areaName], (err, row) => {
                    if (err) {
                        console.error('Error checking existing tag in MtoAreaTagRelTable:', err.message);
                        return;
                    }

                    if (row) {

                    }
                    else {


                        projectDb.run(
                            `INSERT OR IGNORE INTO MtoAreaTagRelTable (mtoareaId,mtotagId,areaname,tagnumber) VALUES (?, ?)`,
                            [mtoareaId, mtotagId, areaName, tagNo],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into MtoAreaTagRelTable:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into MtoAreaTagRelTable with area name: ${areaName}`);
                                projectDb.all("SELECT * FROM MtoAreaTagRelTable", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from MtoAreaTagRelTable table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('mtoline-area-save', rows);
                                });
                            }
                        );


                    }
                });

                projectDb.get('SELECT * FROM MtoMaterialListTable WHERE tagNo = ?, areaName=?', [tagNo, areaName], (err, row) => {
                    if (err) {
                        console.error('Error checking existing tag in  MtoMaterialListTable:', err.message);
                        return;
                    }

                    if (row) {

                        // Merge existing data with new data, retaining old data where new data is not provided
                        const updatedLine = {
                            MatID: row.MatID,
                            M_DocNo: M_DocNo || row.M_DocNo,
                            fileNo: fileNo || row.fileNo,
                            DocNo: DocNo || row.DocNo,
                            DisName: DisName || row.DisName,
                            SysName: SysName || row.SysName,
                            Item_Cat: Item_Cat || row.Item_Cat,
                            Item: Item || row.Item,
                            Item_Sh_Des: Item_Sh_Des || row.Item_Sh_Des,
                            Item_Lo_Des: Item_Lo_Des || row.Item_Lo_Des,
                            Mat_Cat: Mat_Cat || row.Mat_Cat,
                            Material: Material || row.Material,
                            Sizeone: Sizeone || row.Sizeone,
                            Sizetwo: Sizetwo || row.Sizetwo,
                            mqty: qty || row.qty,
                            Unit: Unit || row.Unit,
                            Unit_Weight: Unit_Weight || row.Unit_Weight,
                            Total_Weight: Total_Weight || row.Total_Weight,
                            ItemPos_X: ItemPos_X || row.ItemPos_X,
                            ItemPos_Y: ItemPos_Y || row.ItemPos_Y,
                            ItemPos_Z: ItemPos_Z || row.ItemPos_Z,
                            Unit_Weight_Ref: Unit_Weight_Ref || row.Unit_Weight_Ref,
                            mtoSource: mtoSource || row.mtoSource
                        };

                        // Update the existing record
                        projectDb.run(
                            `UPDATE LineList SET fluidCode = ?, lineId = ?, medium = ?, lineSizeIn = ?, lineSizeNb = ?, pipingSpec = ?, insType = ?, insThickness = ?, heatTrace = ?, lineFrom = ?, lineTo = ?, maxOpPress = ?, maxOpTemp = ?, dsgnPress = ?, minDsgnTemp = ?, maxDsgnTemp = ?, testPress = ?, testMedium = ?, testMediumPhase = ?, massFlow = ?, volFlow = ?, density = ?, velocity = ?, paintSystem = ?, ndtGroup = ?, chemCleaning = ?, pwht = ? WHERE tag = ?`,
                            [updatedLine.fluidCode, updatedLine.lineId, updatedLine.medium, updatedLine.lineSizeIn, updatedLine.lineSizeNb, updatedLine.pipingSpec, updatedLine.insType, updatedLine.insThickness, updatedLine.heatTrace, updatedLine.lineFrom, updatedLine.lineTo, updatedLine.maxOpPress, updatedLine.maxOpTemp, updatedLine.dsgnPress, updatedLine.minDsgnTemp, updatedLine.maxDsgnTemp, updatedLine.testPress, updatedLine.testMedium, updatedLine.testMediumPhase, updatedLine.massFlow, updatedLine.volFlow, updatedLine.density, updatedLine.velocity, updatedLine.paintSystem, updatedLine.ndtGroup, updatedLine.chemCleaning, updatedLine.pwht, tag],
                            (err) => {
                                if (err) {
                                    console.error('Error updating data in LineList:', err.message);
                                    return;
                                }
                                console.log(`Row updated in LineList with tag: ${updatedLine.tagId}`);
                                event.reply("tag-exists", { success: true, message: `Tag number ${tag} already exist and data updated` })
                                projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from LineList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-lines-fetched', rows);
                                });
                            }
                        );
                    }
                    else {


                        projectDb.run(
                            `INSERT OR IGNORE INTO MtoAreaTagRelTable (mtoareaId,mtotagId,areaname,tagnumber) VALUES (?, ?)`,
                            [mtoareaId, mtotagId, areaName, tagNo],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into MtoAreaTagRelTable:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into MtoAreaTagRelTable with area name: ${areaName}`);
                                projectDb.all("SELECT * FROM MtoAreaTagRelTable", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from MtoAreaTagRelTable table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('mtoline-area-save', rows);
                                });
                            }
                        );


                    }
                });
            });
        });
    });

    ipcMain.on('save-group-markings', (event, datas) => {

        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }


        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // db.run('CREATE TABLE IF NOT EXISTS MarkingDetailsTable(markId TEXT,  rectId TEXT ,projectCoords TEXT , viewState TEXT, fillColor TEXT , strokeColor TEXT, strokeWidth REAL, PRIMARY KEY(rectId))')
            const markId = generateCustomID('Mark');
            // datas.forEach(data => {
            //     projectDb.run(
            //         'INSERT INTO MarkingDetailsTable (markId , rectId, X, Y, width, height, absoluteX, absoluteY, absoluteWidth, absoluteHeight, zoomLevel, fillColor, strokeColor, strokeWidth  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            //         [markId, data.rectId, data.x, data.y, data.width, data.height, data.absoluteX, data.absoluteY, data.absoluteWidth, data.absoluteHeight, data.zoomLevel, data.fillColor, data.strokeColor, data.strokeWidth],
            //         function (err) {
            //             if (err) {
            //                 console.error('Error inserting into MarkingDetailsTable:', err.message);
            //                 return;
            //             }
            //             console.log(`Row inserted with X: ${data.X}`);
            //         }

            //     );
            // })

            datas.forEach(data => {
                projectDb.run(
                    'INSERT INTO MarkingDetailsTable (markId , rectId, projectCoords, viewState, fillColor, strokeColor, strokeWidth  ) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [markId, data.rectId, data.projectCoords, data.viewState, data.fillColor, data.strokeColor, data.strokeWidth],
                    function (err) {
                        if (err) {
                            console.error('Error inserting into MarkingDetailsTable:', err.message);
                            return;
                        }
                        console.log(`Row inserted with X: ${data.X}`);
                    }

                );
            })


            projectDb.all("SELECT * FROM MarkingDetailsTable", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the MarkingDetailsTable table:', rows);
                mainWindow.webContents.send('group-markings-saved', rows);
            });
        })

    })


});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

