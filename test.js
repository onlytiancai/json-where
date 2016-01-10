var assert = require("assert");
var jsonWhere = require('./json-where');

var data = [
    {name:"Alice",age:25, email: "alice@searchjs.com",city:{"Montreal":"first","Toronto":"second"}, other: { personal: { birthPlace: "Vancouver" } } },
    {name:"Brian",age:30, email: "brian@searchjs.com",male:true,empty:"hello"},
    {name:"Carrie",age:30, email: "carrie@searchjs.com",city:{"Montreal":true,"New York":false}},
    {name:"David",age:35, email: "david@searchjs.com",male:true},
    {name:"Alice",age:30, email: ["alice@searchjs.com","alice@gmail.com"], cars: [{brand: 'BMW', cds: [{title:'Best Of 2015'}, {title:'Best Of 2016'}]}, {brand: 'Porsche'}]}
];

function log(cond){
    console.log(cond);
    data.filter(jsonWhere(cond))
    .map(function(x){
        console.log("\t" + JSON.stringify(x).substring(0, 100)); 
    });
}

describe('json-where', function() {
    function test(cond, expect){
        log(cond);
        it(cond, function() {
            var ret = data.filter(jsonWhere(cond));
            assert.equal(ret.length, expect.length);
            for (var i = 0; i < ret.length; i++) {
                assert.equal(ret[i].name, expect[i]);
            };
        });
    }

    test("name == 'Alice'", ['Alice', 'Alice']);
    test("name != 'Alice'", ['Brian', 'Carrie', 'David']);
    test("age > 30", ['David']);
    test("age >= 30", ['Brian', 'Carrie', 'David', 'Alice']);
    test("age < 30", ['Alice']);
    test("age <= 30", ['Alice', 'Brian', 'Carrie', 'Alice']);
    test("age in '25, 30'", ['Alice', 'Brian', 'Carrie', 'Alice']);
    test("name like 'lice'", ['Alice', 'Alice']);
    test("age >= 30 && male == true", ['Brian', 'David']);
    test("age >= 30 || male == true", ['Brian', 'Carrie', 'David', 'Alice']);
    test("age >= 30 || !(male == true)", ['Alice', 'Brian', 'Carrie', 'David', 'Alice']);
    test("age >= 30 && email != 1 || age < 31", ['Alice', 'Brian', 'Carrie', 'David', 'Alice']);
    test("age > -30", ['Alice', 'Brian', 'Carrie', 'David', 'Alice']);
});



