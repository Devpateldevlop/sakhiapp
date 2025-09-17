sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {

        async apicall() {
            sap.ui.core.BusyIndicator.show()
            var a = new sap.ui.model.json.JSONModel({})
            this.getView().setModel(a, "addproductdialog")
            try {
                const response = await fetch("https://sakhiculapi.vercel.app/api/categories");
                const categories = await response.json();
                var j = new sap.ui.model.json.JSONModel(categories)
                this.getView().setModel(j, "categories")
                sap.ui.core.BusyIndicator.hide()
            }
            catch {

            }

            try {
                const response = await fetch("https://sakhiculapi.vercel.app/api/product");
                const products = await response.json();
                var p = new sap.ui.model.json.JSONModel(products)
                this.getView().setModel(p, "products")
                sap.ui.core.BusyIndicator.hide()
            }
            catch {

            }

        },
        onInit() {
            var b = new sap.ui.model.json.JSONModel({})
            this.getView().setModel(b, "editproductdialog")
            this.apicall()
        },
        tabselect: function (oevent) {
            this.getView().byId('pageContainer').to(this.getView().byId(oevent.getParameter("key")))
            this.tabname = oevent.getParameter("key")
        },
        opendialog: function () {
            var pDialog2
            var dia

            if (this.tabname == "Categories" || this.tabname == undefined) {
                if (!pDialog2) {
                    // new sap.m.BusyIndicator.show()
                    pDialog2 = this.loadFragment({
                        name: "project1.fragment.addcategory",
                    });
                }
                pDialog2.then(function (oDialog1) {
                    // new sap.m.BusyIndicator.hide()
                    oDialog1.open();
                });

            } else {
                if (!pDialog2) {
                    // new sap.m.BusyIndicator.show()
                    pDialog2 = this.loadFragment({
                        name: "project1.fragment.addproduct",
                    });
                }
                pDialog2.then(function (oDialog1) {
                    // new sap.m.BusyIndicator.hide()
                    oDialog1.open();
                });

            }


        },
        onCloseDialog: function (oevent) {
            oevent.getSource().getParent().destroy()
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
            this.getView().getModel("categories").setData("")
            this.getView().getModel("categories").refresh(true)
            this.getView().getModel("categories").setData("")
            this.getView().getModel("categories").refresh(true)
            this.apicall()
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

        },
        oneditproddialog: function (oevent) {
            var pDialog2
             if (!pDialog2) {
                    // new sap.m.BusyIndicator.show()
                    pDialog2 = this.loadFragment({
                        name: "project1.fragment.editproduct",
                    });
                }
                pDialog2.then(function (oDialog1) {
                    // new sap.m.BusyIndicator.hide()
                    oDialog1.open();
                });


            var prodbody = oevent.getSource().getParent().getParent().getParent().getBindingContext("products").getObject()
             delete prodbody.categoryname
            this.getView().getModel("editproductdialog").setData(prodbody)
            this.getView().getModel("editproductdialog").refresh(true)
            this.editimage=prodbody.images
           
        },
        editprod:function(oevent)
        {   var that=this
               sap.ui.core.BusyIndicator.show()
             var p= this.getView().getModel("editproductdialog").getData()
             if(p.images==undefined || p.images=="")
             {
                p.images === this.editimage
             }
                

             if (p.categoryname == undefined || p.categoryname == "" || p.price== undefined || p.price == "" || p.name == undefined || p.name == "") {
                MessageBox.error("Data bharne Badho")
                return
            }

             fetch("https://sakhiculapi.vercel.app/api/product", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(p)   // send whole object
            })
                .then(res => {
                    that.afterupload(oevent)

                })
                .then(data => console.log("Updated:", data))
                .catch(err => console.error("Error:", err));

        },

        addproduct: function (oevent) {
            var payload = this.getView().getModel("addproductdialog").getData()
            payload.images = this.imagebas
            var that = this
            sap.ui.core.BusyIndicator.show()
            if (payload.categoryname == undefined || payload.categoryname == "" || payload.price == undefined || payload.price == "" || payload.name == undefined || payload.name == "") {
                MessageBox.error("Data bharne Badho")
                return
            }


            fetch("https://sakhiculapi.vercel.app/api/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
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
        deleteproduct: function (oevent) {
            var prodbody = oevent.getSource().getParent().getParent().getParent().getBindingContext("products").getObject()
            var that = this
            MessageBox.confirm("Are you sure you want to delete this category?", {
                title: "Confirm Deletion",
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        sap.ui.core.BusyIndicator.show()

                        fetch("https://sakhiculapi.vercel.app/api/product", {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(prodbody)
                        })
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
                                that.apicall()
                                // optional: refresh model or update UI
                            })
                            .catch(err => {
                                sap.m.MessageToast.show("Error: " + err.message);
                                console.error(err);
                                sap.ui.core.BusyIndicator.hide()

                            });
                    }


                }

            })
        }

    });
});