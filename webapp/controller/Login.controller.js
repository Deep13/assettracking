sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";
    return Controller.extend("qrscan.controller.Login", {
        onInit: function () {
            this.checkAuth();
        },

        checkAuth: function () {
            var that = this;
            sap.ui.core.BusyIndicator.show();
            var userCred = localStorage.getItem('user');
            if (userCred) {
                var sCred = window.atob(userCred);
                if (sCred) {
                    var credentials = JSON.parse(sCred);
                    $.ajax({
                        url: './php/index.php',
                        type: "POST",
                        data: {
                            method: "loginCheck",
                            data: JSON.stringify({ username: credentials.username, pwd: credentials.pass })
                        },
                        dataType: "json",
                        success: function (dataClient) {
                            sap.ui.core.BusyIndicator.hide();
                            if (dataClient) {
                                if (dataClient[0] == 'Login unsuccesfull') {
                                    localStorage.removeItem('user');
                                    that.oRouter = that.getOwnerComponent().getRouter();
                                    that.oRouter.navTo("Login");
                                }
                                else {
                                    // Get Router Info
                                    that.oRouter = that.getOwnerComponent().getRouter();
                                    that.oRouter.navTo("Main");
                                }
                            }

                        },
                        error: function (request, error) {
                            sap.ui.core.BusyIndicator.hide();
                            localStorage.removeItem('user');
                            that.oRouter = that.getOwnerComponent().getRouter();
                            that.oRouter.navTo("Login");
                        },
                    });
                }
                else {
                    sap.ui.core.BusyIndicator.hide();
                    localStorage.removeItem('user');
                    that.oRouter = that.getOwnerComponent().getRouter();
                    that.oRouter.navTo("Login");
                }
            }
            else {
                sap.ui.core.BusyIndicator.hide();
                that.oRouter = that.getOwnerComponent().getRouter();
                that.oRouter.navTo("Login");
            }
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

        onEmailSignin: function (oEvent) {
            var that = this;
            sap.ui.core.BusyIndicator.show();
            var email = this.byId("idu_admin").getValue();
            var password = this.byId("idp_admin").getValue();
            var errorMessage = "";
            // Create a Fireauth Auth reference
            // var oModel = this.getView().getModel("fbModel").getData();
            // var fireAuth = oModel.fireAuth;
            // var firestoreData = oModel.firestore;
            // fireAuth.signInWithEmailAndPassword(email, password).then(function (usersigned) {
            $.ajax({
                url: './php/index.php',
                type: "POST",
                data: {
                    method: "loginCheck",
                    data: JSON.stringify({ username: email, pwd: password })
                },
                dataType: "json",
                success: function (dataClient) {
                    sap.ui.core.BusyIndicator.hide();
                    if (dataClient) {
                        if (dataClient[0] == 'Login unsuccesfull') {
                            MessageBox.error("Wrong credentials");
                        }
                        else {
                            // MessageBox.success("You are Logged in!");
                            localStorage.setItem('user', window.btoa(JSON.stringify({ username: email, pass: password })))
                            // Get Router Info
                            that.oRouter = that.getOwnerComponent().getRouter();
                            that.oRouter.navTo("Main");
                            that.onReset();
                        }
                    }
                    else {
                        MessageBox.error("Wrong credentials");
                    }

                },
                error: function (request, error) {
                    MessageBox.error("Error in login");
                },
            });

            // }).catch(function (error) {
            //     sap.ui.core.BusyIndicator.hide();
            //     // Handle Errors here.
            //     errorMessage = error.message;
            //     MessageBox.error(errorMessage);
            // });
        },
        onReset: function (oEvent) {
            this.byId("idu_admin").setValue("");
            this.byId("idp_admin").setValue("");
        }
    });
});