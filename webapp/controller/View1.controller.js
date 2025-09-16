sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        async onInit() {
            try {
                const response = await fetch("https://sakhiculapi.vercel.app/api/categories");
                const categories = await response.json();
                var j = new sap.ui.model.json.JSONModel(categories)
                this.getView().setModel(j, "categories")
            }
            catch {

            }

            try {
                const response = await fetch("https://sakhiculapi.vercel.app/api/product");
                const products = await response.json();
                var p = new sap.ui.model.json.JSONModel(products)
                this.getView().setModel(p, "products")
            }
            catch {

            }
        },
        tabselect: function (oevent) {
            this.getView().byId('pageContainer').to(this.getView().byId(oevent.getParameter("key")))
        },
        opendialog: function () {
            var pDialog2
            if (!pDialog2) {
                // new sap.m.BusyIndicator.show()
                pDialog2 = this.loadFragment({
                    name: "project1.fragment.dialog",
                });
            }
            pDialog2.then(function (oDialog1) {
                // new sap.m.BusyIndicator.hide()
                oDialog1.open();
            });

        },
        onCloseDialog: function (oevent) {
            oevent.getSource().getParent().destroy()
            oevent.getSource().getParent().close()

        },
        addcategories: function (oevent) {
            sap.ui.core.BusyIndicator.show()

            var catname = this.getView().byId('categname').getValue()
            var that = this
            var obj = {
                "catid": catname,
                "name": catname,
                "image": this.imagebas
            }
            fetch("https://sakhiculapi.vercel.app/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Upload failed");
                    }
                    return response.json();
                })
                .then(data => {
                    sap.m.MessageToast.show("Upload successful!");
                    that.afterupload(oevent)
                })
                .catch(error => {
                    sap.m.MessageToast.show("Upload failed: " + error.message);
                    console.error("Error:", error);
                });

        },
        afterupload: async function (oevent) {
            oevent.getSource().getParent().destroy()

            try {
                const response = await fetch("https://sakhiculapi.vercel.app/api/categories");
                const categories = await response.json();
                this.getView().getModel("categories").setData(categories)
                this.getView().getModel("categories").refresh()
            }
            catch {

            }
            sap.ui.core.BusyIndicator.hide()


        },
        handleUploadComplete: function (oEvent) {
            var file = oEvent.getParameter('files')[0];
            var that = this
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var base64Image = e.target.result;
                    that.imagebas = base64Image
                    console.log(base64Image);
                };
                reader.readAsDataURL(file);
            }

        },
        ondelete: async function (oevent) {
            var that = this
            var catbdy = oevent.getSource().getParent().getParent().getParent().getParent().getBindingContext("categories").getObject()
            sap.ui.core.BusyIndicator.show()

            fetch("https://sakhiculapi.vercel.app/api/categories", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(catbdy)
            }
            )
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Delete failed");
                    }
                    sap.ui.core.BusyIndicator.hide()
                    return res.json();

                })
                .then(data => {
                    sap.m.MessageToast.show(data.message);
                    console.log("Deleted:", data);

                    // optional: refresh model or update UI
                })
                .catch(err => {
                    sap.m.MessageToast.show("Error: " + err.message);
                    console.error(err);
                    sap.ui.core.BusyIndicator.hide()

                });
            setTimeout(async () => {

                try {
                    const response = await fetch("https://sakhiculapi.vercel.app/api/categories");
                    const categories = await response.json();
                    this.getView().getModel("categories").setData(categories)
                    this.getView().getModel("categories").refresh(true)
                    sap.ui.core.BusyIndicator.hide()

                }
                catch {

                }
            }, 2000);

        }




    });
});