///<reference path="vendor/jasmine.d.ts"/>
///<reference path="TreePrinting.ts"/>
///<reference path="vendor/jquery.d.ts"/>
///<reference path="TreeCommonality.ts"/>
///<reference path="AugmentedTreeBuilding.ts"/>


import TreePrinter = TreePrinting.TreePrinter;
import Finder = TreeCommonality.CommonLeftSubTreeFinder;
import TreeBuilder = AugmentedTreeBuilding.CommonSubTreeAugmentedTreeBuilder;
var $ = jQuery;

class Example
{
    fromTree:Node;
    toTree:Node;
    fromTreeAug:TreeElement;
    toTreeAug:TreeElement;
}

describe("Tree printing for common subtree", () => {
    var example0: Example;
    var example1: Example;
    var example2: Example;
    var example3: Example;
    var example4: Example;

    function createExample0()
    {
        example0 = new Example();
        example0.fromTree = $('<div>').html("this <strong> is </strong><h2>big</h2>")[0];
        example0.toTree = $('<div>').html("this <strong> is </strong><h1>bigger!</h1>")[0];
        var commonSubTree = Finder.findCommonLeftSubTree(example0.fromTree, example0.toTree);
        example0.fromTreeAug = TreeBuilder.buildTree(example0.fromTree, commonSubTree.leftCommonSubTree);
        example0.toTreeAug = TreeBuilder.buildTree(example0.toTree, commonSubTree.leftCommonSubTree);
    }

    function createExample1()
    {
        example1 = new Example();
        example1.fromTree = $('<div>').html("")[0];
        example1.toTree = $('<div>').html("1234567890")[0];
        var commonSubTree = Finder.findCommonLeftSubTree(example1.fromTree, example1.toTree);
        example1.fromTreeAug = TreeBuilder.buildTree(example1.fromTree, commonSubTree.leftCommonSubTree);
        example1.toTreeAug = TreeBuilder.buildTree(example1.toTree, commonSubTree.leftCommonSubTree);
    }

    function createExample2()
    {
        example2 = new Example();
        example2.fromTree = $('<div>').html("1234567890")[0];
        example2.toTree = $('<div>').html("")[0];
        var commonSubTree = Finder.findCommonLeftSubTree(example2.fromTree, example2.toTree);
        example2.fromTreeAug = TreeBuilder.buildTree(example2.fromTree, commonSubTree.leftCommonSubTree);
        example2.toTreeAug = TreeBuilder.buildTree(example2.toTree, commonSubTree.leftCommonSubTree);
    }

    function createExample3()
    {
        example3 = new Example();
        example3.fromTree = $('<div>').html("<div>abcde<div>ghijk</div></div>")[0];
        example3.toTree = $('<div>').html("<div>edcba<div>ghijk</div></div>")[0];
        var commonSubTree = Finder.findCommonLeftSubTree(example3.fromTree, example3.toTree);
        example3.fromTreeAug = TreeBuilder.buildTree(example3.fromTree, commonSubTree.leftCommonSubTree);
        example3.toTreeAug = TreeBuilder.buildTree(example3.toTree, commonSubTree.leftCommonSubTree);
    }

    function createExample4()
    {
        example4 = new Example();
        example4.fromTree = $('<div>').html("<div><div></div></div>")[0];
        example4.toTree = $('<div>').html("<section><section></section></section>")[0];
        var commonSubTree = Finder.findCommonLeftSubTree(example4.fromTree, example4.toTree);
        example4.fromTreeAug = TreeBuilder.buildTree(example4.fromTree, commonSubTree.leftCommonSubTree);
        example4.toTreeAug = TreeBuilder.buildTree(example4.toTree, commonSubTree.leftCommonSubTree);
    }

    beforeEach(() => {
        createExample0();
        createExample1();
        createExample2();
        createExample3();
        createExample4();
    });

    it("should return the from tree when no key presses should be made", () => {
        var printer = new TreePrinter(example0.fromTreeAug, example0.toTreeAug);
        expect(printer.printTree(0)).toEqual(example0.fromTree);

        printer = new TreePrinter(example1.fromTreeAug, example1.toTreeAug);
        expect(printer.printTree(0)).toEqual($('<div>').html("")[0]);
    });

    it("should return the to tree when every key press should be made", () => {
        var printer = new TreePrinter(example0.fromTreeAug, example0.toTreeAug);
        expect(printer.printTree(1)).toEqual(example0.toTree);

        printer = new TreePrinter(example1.fromTreeAug, example1.toTreeAug);
        expect(printer.printTree(1)).toEqual($('<div>').html("1234567890")[0]);
    });

    it("should return the appropriate tree when a fractional number is passed (example 0)", () => {
        var printer = new TreePrinter(example0.fromTreeAug, example0.toTreeAug);
        expect(printer.printTree(.1)).toEqual($('<div>').html("this <strong> is </strong><h2>bi</h2>")[0]);
        expect(printer.printTree(.2)).toEqual($('<div>').html("this <strong> is </strong><h2>b</h2>")[0]);
        expect(printer.printTree(.3)).toEqual($('<div>').html("this <strong> is </strong><h2></h2>")[0]);
        expect(printer.printTree(.4)).toEqual($('<div>').html("this <strong> is </strong><h1>b</h1>")[0]);
        expect(printer.printTree(.5)).toEqual($('<div>').html("this <strong> is </strong><h1>bi</h1>")[0]);
        expect(printer.printTree(.6)).toEqual($('<div>').html("this <strong> is </strong><h1>big</h1>")[0]);
        expect(printer.printTree(.7)).toEqual($('<div>').html("this <strong> is </strong><h1>bigg</h1>")[0]);
        expect(printer.printTree(.8)).toEqual($('<div>').html("this <strong> is </strong><h1>bigge</h1>")[0]);
        expect(printer.printTree(.9)).toEqual($('<div>').html("this <strong> is </strong><h1>bigger</h1>")[0]);
    });

    it("should return the appropriate tree when a fractional number is passed (example 1)", () => {
        var printer = new TreePrinter(example1.fromTreeAug, example1.toTreeAug);
        expect(printer.printTree(.1)).toEqual($('<div>').html("1")[0]);
        expect(printer.printTree(.2)).toEqual($('<div>').html("12")[0]);
        expect(printer.printTree(.3)).toEqual($('<div>').html("123")[0]);
        expect(printer.printTree(.4)).toEqual($('<div>').html("1234")[0]);
        expect(printer.printTree(.5)).toEqual($('<div>').html("12345")[0]);
        expect(printer.printTree(.6)).toEqual($('<div>').html("123456")[0]);
        expect(printer.printTree(.7)).toEqual($('<div>').html("1234567")[0]);
        expect(printer.printTree(.8)).toEqual($('<div>').html("12345678")[0]);
        expect(printer.printTree(.9)).toEqual($('<div>').html("123456789")[0]);
    });

    it("should return the appropriate tree when a fractional number is passed (example 2)", () => {
        var printer = new TreePrinter(example2.fromTreeAug, example2.toTreeAug);
        expect(printer.printTree(.1)).toEqual($('<div>').html("123456789")[0]);
        expect(printer.printTree(.2)).toEqual($('<div>').html("12345678")[0]);
        expect(printer.printTree(.3)).toEqual($('<div>').html("1234567")[0]);
        expect(printer.printTree(.4)).toEqual($('<div>').html("123456")[0]);
        expect(printer.printTree(.5)).toEqual($('<div>').html("12345")[0]);
        expect(printer.printTree(.6)).toEqual($('<div>').html("1234")[0]);
        expect(printer.printTree(.7)).toEqual($('<div>').html("123")[0]);
        expect(printer.printTree(.8)).toEqual($('<div>').html("12")[0]);
        expect(printer.printTree(.9)).toEqual($('<div>').html("1")[0]);
    });

    it("should return the appropriate tree when a fractional number is passed (example 3)", () => {
        var printer = new TreePrinter(example3.fromTreeAug, example3.toTreeAug);
        expect(printer.printTree(.3)).toEqual($('<div>').html("<div>abcd</div>")[0]);
        expect(printer.printTree(.35)).toEqual($('<div>').html("<div>abc</div>")[0]);
        expect(printer.printTree(.4)).toEqual($('<div>').html("<div>ab</div>")[0]);
        expect(printer.printTree(.45)).toEqual($('<div>').html("<div>a</div>")[0]);
        expect(printer.printTree(.5)).toEqual($('<div>').html("<div></div>")[0]);
        expect(printer.printTree(.55)).toEqual($('<div>').html("<div>e</div>")[0]);
        expect(printer.printTree(.6)).toEqual($('<div>').html("<div>ed</div>")[0]);
        expect(printer.printTree(.65)).toEqual($('<div>').html("<div>edc</div>")[0]);
        expect(printer.printTree(.7)).toEqual($('<div>').html("<div>edcb</div>")[0]);
        expect(printer.printTree(.75)).toEqual($('<div>').html("<div>edcba</div>")[0]);
    });

    it("should return the full to tree for any non zero percent when there are no visual elements", () => {
        var printer = new TreePrinter(example4.fromTreeAug, example4.toTreeAug);
        expect(printer.printTree(0)).toEqual($('<div>').html("<div><div></div></div>")[0]);
        expect(printer.printTree(1)).toEqual($('<div>').html("<section><section></section></section>")[0]);
    });
});