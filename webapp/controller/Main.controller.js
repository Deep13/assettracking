sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("qrscan.controller.Main", {
            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oModel);
                this.flag = true;
            },

            checkAuth: function () {
                var that = this;
                // firebase Auth
                // var fireAuth = this.getView().getModel("fbModel").getData().fireAuth;
                // console.log(fireAuth);
                // fireAuth.onAuthStateChanged((user) => {
                //     if (user) {
                //         // User is signed in, so you can proceed with the user's session.
                //         that.flag = true;
                //     } else {
                //         // No user is signed in. Redirect to login page or show an error.
                //         that.oRouter = that.getOwnerComponent().getRouter();
                //         that.oRouter.navTo("Login");
                //     }
                // });
            },

            onLogout: function () {
                var that = this;
                // Implement logout functionality
                // Example with Firebase Auth
                // firebase.auth().signOut().then(() => {
                //     // Handle successful logout
                //     that.oRouter = that.getOwnerComponent().getRouter();
                //     that.oRouter.navTo("Login");
                //     // ... navigate to the login page or show a message
                // }).catch((error) => {
                //     // Handle logout errors
                //     // ... show an error message
                // });
            },

            onFileUpload: function (event) {
                // this.checkAuth();
                var that = this;
                if (this.flag) {
                    var file = event.getParameter("files")[0];
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = new Uint8Array(e.target.result);
                        var workbook = XLSX.read(data, {
                            type: 'array'
                        });
                        // Extract data from the first sheet
                        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                        var jsonData = XLSX.utils.sheet_to_json(worksheet);
                        that.byId("textAreaQRCodeData").setValue(JSON.stringify(jsonData));
                        // Use the jsonData as desired (e.g., display in a table, perform operations, etc.)
                        console.log(jsonData);
                        that.jsonData = jsonData;
                    };
                    reader.readAsArrayBuffer(file);
                }
            },

            onGenerateQRCode: function () {
                // this.checkAuth();
                // Assuming the data from Excel is in JSON format.
                var aDataFromExcel = this.jsonData; // Use the actual JSON string here

                var oModel = this.getView().getModel();
                var aQRData = aDataFromExcel.map(function (oEntry) {
                    if (oEntry["Location"] && oEntry["Asset"]) {
                        return {
                            locationData: oEntry["Location"],
                            assetData: oEntry["Asset"],
                            qrCodeUrl: "https://quickchart.io/qr?text=" + encodeURIComponent(oEntry.Location) + '-' + encodeURIComponent(oEntry.Asset)
                        };
                    } else if (oEntry["Location"] && !oEntry["Asset"]) {
                        return {
                            locationData: oEntry["Location"],
                            assetData: oEntry["Asset"],
                            qrCodeUrl: "https://quickchart.io/qr?text=" + encodeURIComponent(oEntry.Location)
                        };
                    }
                });

                oModel.setProperty("/items", aQRData);
            },

            onPrint: function () {
                // this.checkAuth();
                // Get the selected items from the table
                var oTable = this.byId("idQRCodeTable");
                var aSelectedItems = oTable.getSelectedItems();
                if (aSelectedItems.length > 0) {
                    // Open a new window for the print content
                    var oPrintWindow = window.open('', '_blank');

                    // Check if the window has been successfully opened
                    if (oPrintWindow) {
                        // Start constructing the HTML for printing
                        var sHtml = "<html><head><title>Print</title></head><body>";

                        // Loop over each selected item and construct the HTML
                        aSelectedItems.forEach(function (oItem, index) {
                            var oContext = oItem.getBindingContext();
                            var sData = oContext.getProperty("data");
                            var sQRCodeUrl = oContext.getProperty("qrCodeUrl");
                            var assetInfo;
                            if (oContext.getProperty("assetData")) {
                                assetInfo = oContext.getProperty("locationData") + '-' + oContext.getProperty("assetData");
                            } else {
                                assetInfo = oContext.getProperty("locationData");
                            }
                            var pageBreakStyle = index < aSelectedItems.length - 1 ? "break-after: page;" : "";
                            sHtml += "<div class='page' style='" + pageBreakStyle + "'>" + "<div style='display: flex; align-items: center;'>" +
                                "<img src='" + sQRCodeUrl + "' alt='QR Code' style='width: 100px; height: 100px; margin-right: 10px;'/>" +
                                "<p style='margin: 0;'>" + assetInfo + "</p>" +
                                "</div>" + "</div>";
                        });

                        // Finish the HTML construction
                        sHtml += "</body></html>";

                        // Write the HTML to the new window and print
                        oPrintWindow.document.open();
                        oPrintWindow.document.write(sHtml);
                        oPrintWindow.document.close();

                        // Wait for the content to load before printing
                        setTimeout(function () {
                            oPrintWindow.focus();
                            oPrintWindow.print();  // This will trigger the print dialog with a preview
                            // Optional: Close the print window after printing
                            // Some browsers may handle this automatically after printing
                            oPrintWindow.close();
                        }, 250);
                    } else {
                        // If the window did not open, alert the user
                        MessageBox.error("Popup was blocked. Please allow popups for this website and try again.");
                    }
                } else {
                    MessageBox.error("Select a data from checkbox before trying to Print!");
                }

            },

            onDownloadExcel: function () {
                this.checkAuth();
                // Create an array to hold data for the export
                var aExportData = [];

                // Access the table by its ID
                var oTable = this.byId("idQRCodeTable");

                // Check if the table exists
                if (!oTable) {
                    console.error("Table not found");
                    return;
                }

                // Get the items (rows) of the table
                var aItems = oTable.getItems();

                // Push column headers to the first row of the export data
                var aColumnHeaders = oTable.getColumns().map(function (column) {
                    return column.getHeader().getText();
                });
                aExportData.push(aColumnHeaders);

                // Loop over each item (row) and extract the cell data
                aItems.forEach(function (item) {
                    var aCells = item.getCells();

                    // Adjust the indices according to your table's structure
                    var dataCell = aCells[0].getTitle();
                    var qrCodeCell = aCells[1].getSrc(); // assuming this is how you have the QR code

                    // Here you need to fetch and convert the QR code to base64, this part is just illustrative
                    //   var qrCodeBase64 = qrCodeCell.split(',')[1] || '';

                    // Add the row to the export data
                    aExportData.push([dataCell, qrCodeCell]);
                });

                // Convert the export data to worksheet
                var oSheet = XLSX.utils.aoa_to_sheet(aExportData);

                // Create a new workbook and add the worksheet
                var oWorkbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(oWorkbook, oSheet, "QRCodeData");

                // Trigger the download
                XLSX.writeFile(oWorkbook, "QRCodeData.xlsx");
            },

            onUsersCreate: function (oEvent) {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.navTo("CreateUsers");
            }
        });
    });