sap.ui.define([
  "../controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
  "use strict";

  return Controller.extend("qrscan.controller.CreateUsers", {
    onInit: function () {
      this.oData = {
        Users: []
      };

      // Set initial data to the table
      var oModel = new JSONModel(this.oData);
      this.getView().setModel(oModel);

      // Initialize Firebase
      // Configure Firebase and Firestore here

    },

    onAfterRendering: async function () {
      this.loadUsers();
    },

    onCreateUser: function () {
      // Get user input
      var that = this;
      var oView = this.getView();
      var sName = oView.byId("nameInput").getValue();
      var sEmail = oView.byId("emailInput").getValue();
      var sPassword = oView.byId("passwordInput").getValue();
      this.http = "http://";
      this.uri = this.http + this.getHost();

      // fetch('./php/index.php', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ username: sEmail, pwd: sPassword })
      // })
      //   .then(response => response.json())
      //   .then(data => {
      //     if (data.success) {
      //       alert("Sign up successful! Please login.");
      //       // Redirect to the login page upon successful index
      //       window.location.href = 'index.html';
      //     } else {
      //       alert("Sign up failed. Please try again.");
      //     }
      //   })
      //   .catch((error) => {
      //     console.error('Error:', error);
      //   });

      $.ajax({
        url: './php/index.php',
        type: "POST",
        data: {
          method: "createUsers",
          data: JSON.stringify({ name: sName, username: sEmail, pwd: sPassword })
        },
        dataType: "json",
        success: function (dataClient) {
          that.loadUsers();
          sap.m.MessageToast.show('User created successful')
        },
        error: function (request, error) {
          // console.log("fhfj");
        },
      });






      // var fireAuth = this.getView().getModel("fbModel").getData().fireAuth;
      // Create user in Firebase Authentication
      // fireAuth.createUserWithEmailAndPassword(sEmail, sPassword)
      //   .then(function(userCredential) {
      //     // User created successfully
      //     var user = userCredential.user;
      //     var oModel = this.getView().getModel("fbModel").getData();

      //     // Create a document in Firestore for the "users" collection
      //     var oUser = {
      //       Name: sName,
      //       Email: sEmail,
      //       Status: true // You can set the initial status here
      //     };

      //     // Add the user data to Firestore collection 'users'
      //     var db = oModel.firestore;
      //     db.collection("users").add(oUser)
      //       .then(function(docRef) {
      //         // Document successfully written
      //         MessageBox.success("User Created Successfully");

      //         // Add the user to the table
      //         this.oData.Users.push(oUser);
      //         this.getView().getModel().refresh();

      //         // Clear user input fields
      //         oView.byId("nameInput").setValue("");
      //         oView.byId("emailInput").setValue("");
      //         oView.byId("passwordInput").setValue("");
      //       }.bind(this))
      //       .catch(function(error) {
      //         MessageBox.error("Error adding document: ", error);
      //       });
      //   }.bind(this))
      //   .catch(function(error) {
      //     // Handle errors when creating the user
      //     var errorCode = error.code;
      //     var errorMessage = error.message;
      //     MessageBox.error("Error creating user: ", errorCode, errorMessage);
      //   });
    },

    // Attach an event handler to the "Delete" button in your table
    onDeleteUser: function (oEvent) {
      var oTable = this.byId("userTable");
      var oItem = oEvent.getSource().getBindingContext().getObject();
      // Delete the user from Firebase Authentication
      // Assuming you have an "ID" field in your user data
      var userId = oItem.ID;
      var fireAuth = this.getView().getModel("fbModel").getData().fireAuth;

      fireAuth.deleteUser(userId).then(function () {
        var oModel = this.getView().getModel("fbModel").getData();
        var db = oModel.firestore;
        // Delete the user from Firestore
        db.collection("users")
          .doc(userId)
          .delete()
          .then(function () {
            // User deleted successfully from Firestore
            sap.m.MessageToast.show("User deleted successfully.");
          })
          .catch(function (error) {
            MessageBox.error("Error deleting user from Firestore: ", error);
          });
      })
        .catch(function (error) {
          MessageBox.error("Error deleting user from Firebase Authentication: ", error);
        });

      // Remove the user from the model to update the table
      var oModel = oTable.getModel();
      var aUsers = oModel.getProperty("/users");
      var iIndex = aUsers.findIndex(function (user) {
        return user.id === userId;
      });

      if (iIndex !== -1) {
        aUsers.splice(iIndex, 1);
        oModel.setProperty("/users", aUsers);
      }
    },

    // Attach an event handler to the "Status" switch in your table
    onStatusChange: function (oEvent) {
      var oView = this.getView();
      var oTable = oView.byId("userTable");
      var oItem = oEvent.getSource().getBindingContext().getObject();
      var oModel = this.getView().getModel("fbModel").getData();

      // Check the status of the switch
      var bStatus = oTable.getModel().getProperty("Status", oItem);

      if (bStatus) {
        // If the status is true (activated), update Firestore status to true
        var db = oModel.firestore;
        db.collection("users").doc(oItem.id).update({
          Status: true
        })
          .then(function () {
            // Firestore status updated successfully
            console.log("Firestore status updated successfully");
          })
          .catch(function (error) {
            console.error("Error updating Firestore status: ", error);
          });
      } else {
        // If the status is false (deactivated), show an error message
        sap.m.MessageToast.show("Create a new user using the above form before enabling the status.");
        // Revert the switch state to true (or your initial value)
        oEvent.getSource().setState(true);
      }
    },

    loadUsers: function () {
      var that = this;
      // Load existing users from Firestore and update the table
      $.ajax({
        url: './php/index.php',
        type: "POST",
        data: {
          method: "getAllusers",
          data: JSON.stringify({})
        },
        dataType: "json",
        success: function (dataClient) {
          console.log(dataClient);
          var oModel = new sap.ui.model.json.JSONModel({ results: dataClient });
          that.getView().byId("userTable").setModel(oModel);
          // sap.ui.core.BusyIndicator.hide();
        },
        error: function (request, error) {
          // console.log("fhfj");
        },
      });
    }
  });
});  