sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";
    return Controller.extend("qrscan.controller.Login", {
        onInit: function () {

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
            sap.ui.core.BusyIndicator.hide();
            MessageBox.success("You are Logged in!");
            // Get Router Info
            that.oRouter = that.getOwnerComponent().getRouter();
            that.oRouter.navTo("Main");
            that.onReset();
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