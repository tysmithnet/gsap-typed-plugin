///<reference path="vendor/jasmine.d.ts"/>
///<reference path="vendor/jquery.d.ts"/>
///<reference path="AugmentedTreeBuilding.ts"/>
///<reference path="TreeTraversal.ts"/>


import TreeBuilder = AugmentedTreeBuilding.AugmentedTreeBuilder;
import TreeElement = AugmentedTreeBuilding.TreeElement;
import Traverser = TreeTraversal.Traverser;
import DisplayStrategy = AugmentedTreeBuilding.DisplayStrategy;
import IDisplalyStrategy = AugmentedTreeBuilding.IDisplayStrategy;
import IMatcher = AugmentedTreeBuilding.IMatcher;

var $ = jQuery;

beforeEach(() => {
    jasmine.addMatchers({
        toDeepDiffEquals: () => {
            return {
                compare: (actual:any, expected:any) => {
                    var diff = DeepDiff.diff(actual, expected);
                    var result = {};
                    result.pass = !diff;
                    if(!result.pass)
                        result.message = JSON.stringify(diff);
                    return result;
                }
            }
        }
    });
});

describe("Common sub tree augmented tree building", () => {
    var commonTree0;
    var fullTree0;
    var expectation0;

    var commonTree1;
    var fullTree1;
    var expectation1;

    var commonTree2;
    var fullTree2;
    var expectation2;

    function buildCommonTree0()
    {
        commonTree0 = $('<A>').html('<B><D></D><E><F></F></E></B>')[0];
        fullTree0 = $('<A>').html('<B><D></D><E><F></F><G></G></E></B><C><H><I></I></H></C>')[0];
        var A = $(fullTree0)[0];
        var B = $(fullTree0).find('B')[0];
        var C = $(fullTree0).find('C')[0];
        var D = $(fullTree0).find('D')[0];
        var E = $(fullTree0).find('E')[0];
        var F = $(fullTree0).find('F')[0];
        var G = $(fullTree0).find('G')[0];
        var H = $(fullTree0).find('H')[0];
        var I = $(fullTree0).find('I')[0];

        var a = new TreeElement(null, A, true, new DisplayStrategy(A));

        var b = new TreeElement(a, B, true, new DisplayStrategy(B));
        a.childNodes.push(b);

        var c = new TreeElement(a, C, false, new DisplayStrategy(C));
        a.childNodes.push(c);

        var d = new TreeElement(b, D, true, new DisplayStrategy(D));
        b.childNodes.push(d);

        var e = new TreeElement(b, E, true, new DisplayStrategy(E));
        b.childNodes.push(e);

        var f = new TreeElement(e, F, true, new DisplayStrategy(F));
        e.childNodes.push(f);

        var g = new TreeElement(e, G, false, new DisplayStrategy(G));
        e.childNodes.push(g);

        var h = new TreeElement(c, H, false, new DisplayStrategy(H));
        c.childNodes.push(h);

        var i = new TreeElement(h, I, false, new DisplayStrategy(I));
        h.childNodes.push(i);

        expectation0 = a;
    }

    function buildCommonTree1()
    {
        commonTree1 = $('<A>').html("<B></B>")[0];
        fullTree1 = $('<A>').html("<B></B><C></C>")[0];

        var A = $(fullTree1)[0];
        var B = $(fullTree1).find('B')[0];
        var C = $(fullTree1).find('C')[0];

        var a = new TreeElement(null, A, true, new DisplayStrategy(A));

        var b = new TreeElement(a, B, true, new DisplayStrategy(B));
        a.childNodes.push(b);

        var c = new TreeElement(a, C, false, new DisplayStrategy(C));
        a.childNodes.push(c);

        expectation1 = a;
    }

    function buildCommonTree2()
    {
        commonTree2 = $('<div>').html("this <strong> is </strong>")[0];
        fullTree2 = $('<div>').html("this <strong> is </strong><h1>bigger</h1>")[0];

        var THIS_ = fullTree2.childNodes[0];
        var STRONG = fullTree2.childNodes[1];
        var H1 = fullTree2.childNodes[2];
        var IS = STRONG.childNodes[0];
        var BIGGER = H1.childNodes[0];

        var div = new TreeElement(null, fullTree2, true, new DisplayStrategy(fullTree2));

        var this_ = new TreeElement(div, THIS_, true, new DisplayStrategy(THIS_));
        div.childNodes.push(this_);

        var strong = new TreeElement(div, STRONG, true, new DisplayStrategy(STRONG));
        div.childNodes.push(strong);

        var is = new TreeElement(strong, IS, true, new DisplayStrategy(IS));
        strong.childNodes.push(is);

        var h1 = new TreeElement(div, H1, false, new DisplayStrategy(H1));
        div.childNodes.push(h1);

        var bigger = new TreeElement(h1, BIGGER, false, new DisplayStrategy(BIGGER));
        h1.childNodes.push(bigger);

        expectation2 = div;
    }


    beforeEach(() => {
        buildCommonTree0();
        buildCommonTree1();
        buildCommonTree2();
    });

    it("should throw error if the full tree root is null", () => {
        expect(() => {
            new TreeBuilder(null, null).buildTree();
        }).toThrowError();

        expect(() => {
            new TreeBuilder(null, commonTree0).buildTree();
        }).toThrowError();
    });

    it("should build an augmented tree", () => {
        var result = new TreeBuilder(fullTree0, commonTree0).buildTree();
        expect(result).toDeepDiffEquals(expectation0);
        expect(new TreeBuilder(fullTree1, commonTree1).buildTree()).toDeepDiffEquals(expectation1);
        var result = new TreeBuilder(fullTree2, commonTree2).buildTree();
        expect(result).toDeepDiffEquals(expectation2);
    });

    it("should build a tree with all nodes not in the common sub tree if the common sub tree is null", () => {
        var tree = new TreeBuilder(fullTree0, null).buildTree();
        var traversal = Traverser.InOrderTraversal(tree);
        var agg = false;
        for(var i = 0; i < traversal.length; i++)
        {
            agg = agg || traversal[i].isInCommonSubTree;
        }
        expect(agg).toEqual(false);
    });

});

describe("Tree building with custom strategy", () => {
    it("should match using a customer matcher if provided", () => {
        var example = $('<div>').html("<span class='fa fa-play' />")[0];
        var customDisplayStrat = (node:Node, numKeyPresses):Node => {
            return node;
        };

        var getDisplayStrat = (node:Node):IDisplalyStrategy => {
            return {
                displayNode: customDisplayStrat,
                numberKeyPressesToReveal: 1
            };
        };

        var matcher:IMatcher = {
            isMatch:(node:Node):boolean =>
            {
                return node instanceof HTMLElement && (<HTMLElement>node).classList.contains('fa');
            },
            getDisplayStrategy: getDisplayStrat
        };
        var root = new TreeElement(null, example, false, new DisplayStrategy(example));
        var span = new TreeElement(root, example.childNodes[0], false, matcher.getDisplayStrategy(example.childNodes[0]));
        root.childNodes.push(span);
        var builder = new TreeBuilder(example, null);
        builder.addMatcher(matcher);
        expect(builder.buildTree()).toEqual(root);
    });


});