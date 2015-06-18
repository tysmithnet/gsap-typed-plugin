///<reference path="vendor/jasmine.d.ts"/>
///<reference path="TreeTraversal.ts"/>

var Traverser = TreeTraversal.Traverser;

describe("In order traversal", () => {
    var exampleTree0;
    var exampleTree1;
    var exampleTree2;

    beforeEach(() => {
        exampleTree0 = document.createElement("A");

        exampleTree1 = document.createElement("A");
        exampleTree1.innerHTML = "<B></B><C></C><D><E></E><F><X></X><Y></Y></F><G></G><H></H></D>";

        exampleTree2 = document.createElement("A");
        exampleTree2.innerHTML = "<B></B><C></C>";
    });

    it("should throw an error if no value is supplied", () => {
        expect(() => {
            Traverser.InOrderTraversal(null);
        }).toThrowError();

        expect(() => {
            Traverser.InOrderTraversal(undefined);
        }).toThrowError();
    });

    it("should return just the root if that is the only node in the tree", () => {
        expect(Traverser.InOrderTraversal(exampleTree0)).toEqual([exampleTree0]);
    });

    it("should return a traversal in this order nodes: root, left, right", () => {
        var A = exampleTree1;
        var B = exampleTree1.querySelector("B");
        var C = exampleTree1.querySelector("C");
        var D = exampleTree1.querySelector("D");
        var E = exampleTree1.querySelector("E");
        var F = exampleTree1.querySelector("F");
        var G = exampleTree1.querySelector("G");
        var H = exampleTree1.querySelector("H");
        var X = exampleTree1.querySelector("X");
        var Y = exampleTree1.querySelector("Y");

        var expectation = [A, B, C, D, E, F, X, Y, G, H];

        expect(Traverser.InOrderTraversal(exampleTree1)).toEqual(expectation);
    });
});

describe("Common left subtree finding", () => {
    var exampleTree0;
    var exampleTree1;
    var exampleTree2;

    beforeEach(() => {
        exampleTree0 = document.createElement("A");

        exampleTree1 = document.createElement("A");
        exampleTree1.innerHTML = "<B></B><C></C><D><E></E><F><X></X><Y></Y></F><G></G><H></H></D>";

        exampleTree2 = document.createElement("A");
        exampleTree2.innerHTML = "<B></B><C></C>";
    });

    it("should throw an error if either of the supplied elements is null", () => {

    });
});