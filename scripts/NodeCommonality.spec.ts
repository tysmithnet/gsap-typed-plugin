///<reference path="vendor/jasmine.d.ts"/>
///<reference path="NodeCommonality.ts"/>
///<reference path="vendor/jquery.d.ts"/>

var $ = jQuery;
var comparer = NodeCommonality.NodeComparisonStrategy;

describe("Default node comparison strategy", () => {
    it("should return true if both are null", () => {
        expect(comparer.areEqual(null, null)).toEqual(true);
    });

    it("should return false if one or the other but not both are null", () => {
        var node = document.createElement("div");
        expect(comparer.areEqual(null, node)).toEqual(false);
        expect(comparer.areEqual(node, null)).toEqual(false);
    });

    it("should return false if the node types are different", () => {
        var left = document.createElement("div");
        var right = document.createTextNode("hi");
        expect(comparer.areEqual(left, right)).toEqual(false);
        expect(comparer.areEqual(right, left)).toEqual(false);
    });

    it("should return false if the names are different", () => {
        var left = document.createElement("div");
        var right = document.createElement("span");
        expect(comparer.areEqual(left, right)).toEqual(false);
        expect(comparer.areEqual(right, left)).toEqual(false);
    });

    it("should return false if the node values are different", () => {
        var left = document.createTextNode("a");
        var right = document.createTextNode("b");
        expect(comparer.areEqual(left, right)).toEqual(false);
        expect(comparer.areEqual(right, left)).toEqual(false);
    });

    it("should return true for 2 equivalent nodes", () => {
        var left = document.createElement("div");
        var right = document.createElement("div");
        expect(comparer.areEqual(left, right)).toEqual(true);
        expect(comparer.areEqual(right, left)).toEqual(true);
    });

    it("should return false if they have different attributes", () => {
        var left = $('<div>').attr('name', 'name1')[0];
        var right = $('<div>')[0];
        expect(comparer.areEqual(left, right)).toEqual(false);
        expect(comparer.areEqual(right, left)).toEqual(false);
    });
});

describe("Node attribute comparison strategy", () => {

    it("should return true if both are null", () => {
        expect(comparer.areNodeAttributesEqual(null, null)).toEqual(true);
    });

    it("should return false if one or the other is null but not both", () => {
        var left = document.createElement("div").attributes;
        expect(comparer.areNodeAttributesEqual(left, null)).toEqual(false);
        expect(comparer.areNodeAttributesEqual(null, left)).toEqual(false);
    });

    it("should return false if they have different lengths", () => {
        var left = $('<input>').attr('name', 'name1')[0].attributes;
        var right = $('<input>')[0].attributes;
        expect(comparer.areNodeAttributesEqual(left, right)).toEqual(false);
        expect(comparer.areNodeAttributesEqual(right, left)).toEqual(false);
    });

    it("should return false if they have different classes but the same number", () => {
        var left = $('<div>').addClass('a')[0].attributes;
        var right = $('<div>').addClass('b')[0].attributes;
        expect(comparer.areNodeAttributesEqual(left, right)).toEqual(false);
        expect(comparer.areNodeAttributesEqual(right, left)).toEqual(false);
    });

    it("should return false if they have different number of classes", () => {
        var left = $('<div>').addClass('a').addClass('b')[0].attributes;
        var right = $('<div>').addClass('b')[0].attributes;
        expect(comparer.areNodeAttributesEqual(left, right)).toEqual(false);
        expect(comparer.areNodeAttributesEqual(right, left)).toEqual(false);
    });

    it("should return true if they have the same classes in different orders", () => {
        var left = $('<div>').addClass('a').addClass('b')[0].attributes;
        var right = $('<div>').addClass('b').addClass('a')[0].attributes;
        expect(comparer.areNodeAttributesEqual(left, right)).toEqual(true);
        expect(comparer.areNodeAttributesEqual(right, left)).toEqual(true);
    });

    it("should return false if one has a class and the other does not", () => {
        var left = $('<div>').addClass('a').addClass('b')[0].attributes;
        var right = $('<div>')[0].attributes;
        expect(comparer.areNodeAttributesEqual(left, right)).toEqual(false);
        expect(comparer.areNodeAttributesEqual(right, left)).toEqual(false);
    });

    it("should return false if they have the same attributes with different values", () => {
        var left = $('<div>').attr('name', 'name1')[0].attributes;
        var right = $('<div>').attr('name', 'name2')[0].attributes;
        expect(comparer.areNodeAttributesEqual(left, right)).toEqual(false);
        expect(comparer.areNodeAttributesEqual(right, left)).toEqual(false);
    });

    it("should return true if they have the same attributes", () => {
        var left = $('<div>').attr('class', 'a b c').attr('name', 'n').attr('id', 'i')[0].attributes;
        var right = $('<div>').attr('class', 'c b a').attr('name', 'n').attr('id', 'i')[0].attributes;
        expect(comparer.areNodeAttributesEqual(left, right)).toEqual(true);
        expect(comparer.areNodeAttributesEqual(right, left)).toEqual(true);
    });
});