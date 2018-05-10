var myDB = require("./connect");


var obj = {
   
    "username": "brendon",
    "email": "brendon@1234",
    "password": "1234",
    "lists": [
        {
            "name": "grocery list",
            "categories": [
                {
                    "name": "Produce",
                    "items": [
                        "brocoli",
                        "pear",
                        "orange"
                    ]
                },
                {
                    "name": "Vegetables",
                    "items": [
                        "carrot",
                        "lettuce",
                        "eggplant"
                    ]
                },
                {
                    "name": "Dairy",
                    "items": [
                        "milk",
                        "creamer"
                    ]
                }
            ]
        }
    ]
};

describe("addRecord function testing", ()=>{
    test("added product to a list", ()=>{
        myDB.addRecord(obj,"Users", function(msg){
            expect(msg).toBe("success");
        })
        
    
    });
    
});
    
        