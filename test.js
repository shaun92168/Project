var myDB = require("./connect.js");
var obj = {
   
    "username": "brendon1",
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

describe.skip("addRecord function testing", ()=>{
    test("added product to a list", ()=>{
        myDB.addUserDB(obj, "Users", function(msg){
            expect(msg).toBe("success");
        });
    });
});

describe.skip("deleteRecord function testing", ()=>{
    test("deleted product from a list", ()=>{
        myDB.deleteUserDB(obj, "Users", function(msg){
            expect(msg).toBe("success");
        });
    });
});

describe.skip("dropCategory function testing", () => {
    test("delete category inside list", () => {
        myDB.deleteCategoryDB('nick@123.ca', 'grocery list', 'Produce', (msg) => {
            expect(msg).toBe("success");
        });
    });
});

describe.skip("login validation testing.", () => {
    test("email should be proper email format.", () => {
        extra.login('nick123.com', '123', (user) => {
            expect(user).toBe('failed');
        });

        extra.login('nick@123', '123', (user) => {
            expect(user).toBe('failed');
        });

        extra.login('nick@123com', '123', (user) => {
            expect(user).toBe('failed');
        });
    });
});

describe.skip("getListIndex testing", () => {
    test("should return a number", () => {
        expect(myDB.getListIndex('grocery list', obj).tobe(0))
    })
})