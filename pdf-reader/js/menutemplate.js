"use strict";
/*------------------------------------------------------------------------------
 *  Copyright (c) 2019 Sagar Gurtu
 *  Licensed under the MIT License.
 *  See License in the project root for license information.
 *----------------------------------------------------------------------------*/

const { app, dialog } = require('electron');

exports.buildMenuTemplate = function (win) {
    return [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open...',
                    id: 'file-open',
                    accelerator: 'CmdOrCtrl+O',
                    click() {
                        dialog.showOpenDialog(win, {
                            properties: ['openFile'],
                            filters: [
                                { name: 'PDF Files', extensions: ['pdf'] }
                            ]
                        }).then(result => {
                            if (result.filePaths.length > 0) {
                                win.webContents.send('file-open',
                                result.filePaths[0])
                            }
                        })
                    }
                },
                {
                    label: 'Print...',
                    id: 'file-print',
                    accelerator: 'CmdOrCtrl+P',
                    enabled: false,
                    click() {
                        win.webContents.send('file-print')
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Properties...',
                    id: 'file-properties',
                    enabled: false,
                    click() {
                        win.webContents.send('file-properties')
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Close',
                    id: 'file-close',
                    enabled: false,
                    click() {
                        win.webContents.send('file-close')
                    }
                },
                {
                    label: 'Exit',
                    click() {
                        win.close()
                    }
                }
            ]
        }

    ];
};