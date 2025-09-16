sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
       async onInit() {
        try{
            const response = await fetch("https://sakhiculapi.vercel.app/api/categories");
            const categories = await response.json();
            var j = new sap.ui.model.json.JSONModel(categories)
            this.getView().setModel(j,"categories")
        }catch{
            
        }
            

        try{
            const response = await fetch("https://sakhiculapi.vercel.app/api/product");
            const products = await response.json();
            var p = new sap.ui.model.json.JSONModel(products)
            this.getView().setModel(p,"products")
        }catch{
            
        }
        },
        tabselect:function(oevent)
        {
            
            this.getView().byId('pageContainer').to(this.getView().byId(oevent.getParameter("key")))
        }
    });
});