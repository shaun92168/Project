var myDB = require("./connect");
//var server = require("./server.js")
var signupfcn = require("./public/signup_function.js");

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

// beforeAll(() => {
//     myDB.addUserDB(obj, "Users", function(msg){
//     });
// })

afterAll(() => {
    myDB.deleteUserDB(obj, "Users", function(msg){
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

describe("addUserDB function testing", ()=>{
    test("added product to a list", ()=>{
        myDB.addUserDB(obj, "Users", function(msg){
            expect(msg).toBe("success");
        });
    });
});

describe.skip("deleteUserDB function testing", ()=>{
    test("deleted product from a list", ()=>{
        myDB.deleteUserDB(obj, "Users", function(msg){
            expect(msg).toBe("success");
        });
    });
});

describe.skip("addListDB function testing", () => {
    test("adding a list inside user", () => {
       myDB.addListDB('nick@123.ca', 'electronic list', (msg) => {
            expect(msg).toBe('success')
       });
    });
});

describe.skip("deleteListDB testing", () => {
    test("Should return 'success'", () => {
        myDB.deleteListDB('test@1.ca', 'Produce', (msg) => {
            expect(msg).toBe('success')
        });
    });
});

describe("getListIndex testing", () => {
    test("should return a number", () => {
        expect(myDB.getListIndex('grocery list', obj)).toBe(0);
    })
})

var email = {"email":"brendon@1234"};
var shaunObj = {
    
    "username": "shaun",
    "email": "shaun@1234",
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

describe.skip("updateDB testing", ()=>{
    test("update brendon@1234 to shaun@1234", ()=>{
        myDB.updateDb(email, shaunObj)
    }); 
});

/*
describe("signup test"), ()=>{
    test("add user shauntseng", ()=>{
        server.signup("shauntseng", "shaun@123.ca", "123", "123", (msg)=>{
            expect(msg).toBe("success");
        })
    }); 
}
*/

describe.skip("deleteCategoryDB function testing", () => {
    test("delete category inside list", () => {
        myDB.deleteCategoryDB('test@1.ca', 'grocery list', 'Produce', (msg) => {
            expect(msg).toBe("success");
        });
    });
});

describe.skip("deleteItem function testing", ()=>{
    test("delete item from category", ()=>{
        myDB.deleteItemDB('brendon@1234', "grocery list", "Produce", "orange", (msg) =>{
            expect(msg).toBe("success");
        });
    });
});

describe.skip("additem function testing",()=>{
	test("add item to category",()=>{
		myDB.addItemDB('nick@123.ca',"list1","Meat","Turkey",(msg)=>{
			expect(msg).toBe("success");
		})
	})
})

describe("getItemIndex function testing", () => {
    test("get index of item in category", () => {
        expect(myDB.getItemIndex('grocery list', 'Produce', "pear", obj)).toBe(1)
    });
});

describe("checkSignUp function testing", ()=> {
    test("check wrong email format", () => {
        expect(signupfcn.checkSignUp("shaun", "shaun@123.a", "123", "123")).toBe("Email format incorrect")
    });
    test("check unmatched passwords", () => {
        expect(signupfcn.checkSignUp("shaun", "shaun@123.ca", "123", "1234")).toBe("Passwords don't match")
    });
    test("check Username is empty", () => {
        expect(signupfcn.checkSignUp("", "shaun@123.ca", "123", "123")).toBe("Username cannot be empty")
    });
    test("check Email is empty", () => {
        expect(signupfcn.checkSignUp("shaun", "", "123", "123")).toBe("Email cannot be empty")
    });
    test("check Password is empty", () => {
        expect(signupfcn.checkSignUp("shaun", "shaun@123.ca", "", "123")).toBe("Password cannot be empty")
    });
    test("check Re-enter Password is empty", () => {
        expect(signupfcn.checkSignUp("shaun", "shaun@123.ca", "123", "")).toBe("Re-enter Password cannot be empty")
    });
    test("check all fields are empty", () => {
        expect(signupfcn.checkSignUp("", "", "", "")).toBe("Username cannot be empty")
    });
});

describe("signup function testing", () => {
    test("sign up a new account", () => {
        myDB.signup("testuser", "testuser@123.com", "123", "123", (msg) => {
            expect(msg).toBe("success");
        });
    });
    test("sign up with incorrect email format", () => {
        myDB.signup("testuser", "testuser@123.a", "123", "123", (msg) => {
            expect(msg).toBe("failed");
        });
    });
    test("sign up with incorrect email format", () => {
        myDB.signup("testuser", "testuser.ca@123", "123", "123", (msg) => {
            expect(msg).toBe("failed");
        });
    });
    test("sign up with incorrect re-entered password", () => {
        myDB.signup("testuser", "testuser@123.ca", "123", "1234", (msg) => {
            expect(msg).toBe("failed");
        });
    });
    test("sign up with empty username field", () => {
        myDB.signup("", "testuser@123.ca", "123", "123", (msg) => {
            expect(msg).toBe("failed");
        });
    });
    test("sign up with empty email field", () => {
        myDB.signup("testuser", "", "123", "123", (msg) => {
            expect(msg).toBe("failed");
        });
    });
    test("sign up with empty password field", () => {
        myDB.signup("testuser", "testuser@123.ca", "", "123", (msg) => {
            expect(msg).toBe("failed");
        });
    });
    test("sign up with empty re-enter password field", () => {
        myDB.signup("testuser", "testuser@123.ca", "123", "", (msg) => {
            expect(msg).toBe("failed");
        });
    });
    test("sign up with all empty fields", () => {
        myDB.signup("", "", "", "", (msg) => {
            expect(msg).toBe("failed");
        });
    });
});