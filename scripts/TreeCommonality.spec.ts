///<reference path="vendor/jasmine.d.ts"/>
///<reference path="vendor/jquery.d.ts"/>
///<reference path="TreeCommonality.ts"/>

var finder = TreeCommonality.CommonLeftSubTreeFinder;

describe("", () => {
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

    it("should return an null root for the left common subtree if the trees have nothing in common", () => {
        expect(finder.findCommonLeftSubTree(example1Left, example1Right)).toEqual(new TreeCommonality.CommonLeftSubTree());
    });

    it("should return a copy of both trees if they are the same", () => {
        expect(finder.findCommonLeftSubTree(example0Left, example0Left).leftCommonSubTree).toEqual(example0Left);
        expect(finder.findCommonLeftSubTree(example0Right, example0Right).leftCommonSubTree).toEqual(example0Right);
    });

    it("should correctly identify common left subtrees", () => {
        expect(finder.findCommonLeftSubTree(example0Left, example0Right).leftCommonSubTree).toEqual(example0Expectation);
        expect(finder.findCommonLeftSubTree(example0Right, example0Left).leftCommonSubTree).toEqual(example0Expectation);

        expect(finder.findCommonLeftSubTree(example2Left, example2Right).leftCommonSubTree).toEqual(example2Expectation);
        expect(finder.findCommonLeftSubTree(example2Right, example2Left).leftCommonSubTree).toEqual(example2Expectation);
    });
});