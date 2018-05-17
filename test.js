var myDB = require("./connect");
// var server = require("./server.js")
var obj = {
   
    "username": "tester",
    "email": "test@1.ca",
    "password": "1",
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
        myDB.addUserDB(obj, "Users", function(msg){
            expect(msg).toBe("success");
        });
    });
});

describe("deleteCategoryDB function testing", () => {
    test("delete category inside list", () => {
        myDB.deleteCategoryDB('test@1.ca', 'grocery list', 'Produce', (msg) => {
            expect(msg).toBe("success");
        });
    });
});

describe("login validation testing.", () => {
    test("email should be proper email format.", () => {
        myDB.login('nick123.com', '123', (user) => {
            expect(user).toBe('failed');
        });

        myDB.login('nick@123', '123', (user) => {
            expect(user).toBe('failed');
        });

        myDB.login('nick@123com', '123', (user) => {
            expect(user).toBe('failed');
        });
    });
});

describe("getListIndex testing", () => {
    test("should return a number", () => {
        expect(myDB.getListIndex('grocery list', obj)).toBe(0);
    });
});

describe("getCategoryIndex testing", () => {
    test("should return a number", () => {
        expect(myDB.getCategoryIndex('grocery list', 'Vegetables', obj)).toBe(1);
    });
});

describe("readFile testing", () => {
    test("should return an error message", () => {
        myDB.readFile('nick@1a', (user) => {
            expect(user).toBe('failed')
        });
    });

    test("Should return a file with the same email inputted", () => {
        myDB.readFile('nick@123.ca', (user) => {
            expect(user.email).toBe('nick@123.ca')
        })
    });
});

describe("deleteListDB testing", () => {
    test("Should return 'success'", () => {
        myDB.deleteListDB('test@1.ca', 'grocery list', (msg) => {
            expect(msg).toBe('success')
        });
    });
});

describe("deleteRecord function testing", ()=>{
    test("deleted product from a list", ()=>{
        myDB.deleteUserDB(obj, "Users", function(msg){
            expect(msg).toBe("success");
        });
    });
});

describe("addListDB function testing", () => {
    test("adding a list inside user", () => {
       myDB.addListDB('nick@123.ca', 'electronic list', (msg) => {
            expect(msg).toBe('success')
       });
    });
});