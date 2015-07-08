///<reference path="vendor/jasmine.d.ts"/>
///<reference path="vendor/jquery.d.ts"/>
///<reference path="TreeCommonality.ts"/>

var finder = TreeCommonality.CommonLeftSubTreeFinder;

describe("areNodesTextNodes", () => {
    it("should return false if nothing is passed in", () => {
        expect(finder.areNodesTextNodes()).toEqual(false);
        expect(finder.areNodesTextNodes(null)).toEqual(false);
    });

    it("should return false if at least one is not a text node", () => {
        expect(finder.areNodesTextNodes(document.createElement("div"))).toEqual(false);
        expect(finder.areNodesTextNodes(document.createElement("div"), document.createTextNode("hi"))).toEqual(false);
    });

    it("shoudl return true if all are test nodes", () => {
        expect(finder.areNodesTextNodes(document.createTextNode("a"))).toEqual(true);
        expect(finder.areNodesTextNodes(document.createTextNode("a"), document.createTextNode("b"))).toEqual(true);
    });
});

describe("Tree commonality", () => {
    var example0Left;
    var example0Right;
    var example0Expectation;

    var example1Left;
    var example1Right;

    var example2Left;
    var example2Right;
    var example2Expectation;

    beforeEach(() => {
        example0Left = $('<A>').html('<B><X></X><Y></Y><Z></Z></B><C></C>')[0];
        example0Right = $('<A>').html('<B><X></X><Y></Y></B><C></C>')[0];
        example0Expectation = $('<A>').html('<B><X></X><Y></Y></B>')[0];

        example1Left = $('<B>')[0];
        example1Right = $('<C>')[0];

        example2Left = $('<div>').html("this <strong> is </strong><h2>big</h2>")[0];
        example2Right = $('<div>').html("this <strong> is </strong><h1>bigger</h1>")[0];
        example2Expectation = $('<div>').html("this <strong> is </strong>")[0];
    });

    it("should throw an error if any of the arguments are null", () => {
        expect(() => {
            finder.findCommonLeftSubTree(null, null);
        }).toThrowError();
    });

    it("should return a nnull root for the left common subtree if the trees have nothing in common", () => {
        var result = finder.findCommonLeftSubTree(example1Left, example1Right);
        expect(result).toDeepDiffEquals(new TreeCommonality.CommonLeftSubTree());
    });

    it("should return a copy of both trees if they are the same", () => {
        expect(finder.findCommonLeftSubTree(example0Left, example0Left).leftCommonSubTree).toEqual(example0Left);
        expect(finder.findCommonLeftSubTree(example0Right, example0Right).leftCommonSubTree).toEqual(example0Right);
    });

    it("should return the common part of a text node if the difference lies within a text node", () => {
        var left = document.createTextNode("0123456");
        var right = document.createTextNode("01234");
        expect(finder.findCommonLeftSubTree(left, right).leftCommonSubTree).toEqual(document.createTextNode("01234"));
    });

    it("should return an empty text node as common if that is the only common part of a text node", () => {
        var left = document.createTextNode("abc");
        var right = document.createTextNode("def");
        expect(finder.findCommonLeftSubTree(left, right).leftCommonSubTree).toEqual(document.createTextNode(""));

    });

    it("should return return an empty node as a child if the two text nodes are not the same", () => {
        var left = $('<div>').text('abc')[0];
        var right = $('<div>').text('def')[0];
        var expectation = document.createElement("div");
        expectation.appendChild(document.createTextNode(''));
        expect(finder.findCommonLeftSubTree(left, right).leftCommonSubTree).toEqual(expectation);
    });

    it("should correctly identify common left subtrees", () => {
        expect(finder.findCommonLeftSubTree(example0Left, example0Right).leftCommonSubTree).toEqual(example0Expectation);
        expect(finder.findCommonLeftSubTree(example0Right, example0Left).leftCommonSubTree).toEqual(example0Expectation);

        expect(finder.findCommonLeftSubTree(example2Left, example2Right).leftCommonSubTree).toEqual(example2Expectation);
        expect(finder.findCommonLeftSubTree(example2Right, example2Left).leftCommonSubTree).toEqual(example2Expectation);
    });
});