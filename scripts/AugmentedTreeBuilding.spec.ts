///<reference path="vendor/jasmine.d.ts"/>
///<reference path="vendor/jquery.d.ts"/>
///<reference path="AugmentedTreeBuilding.ts"/>

var TreeBuilder = AugmentedTreeBuilding.CommonSubTreeAugmentedTreeBuilder;
var CommonSubTreeElement = AugmentedTreeBuilding.CommonSubTreeElement;
var $ = jQuery;

describe("Common sub tree augmented tree building", () => {
    var commonTree0;
    var fullTree0;
    var expectation0;

    var commonTree1;
    var fullTree1;
    var expectation1;

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

        var a = new CommonSubTreeElement();
        a.node = A;
        a.isInCommonSubTree = true;
        a.parent = null;

        var b = new CommonSubTreeElement();
        b.node = B;
        b.isInCommonSubTree = true;
        b.parent = a;
        a.childNodes.push(b);

        var c = new CommonSubTreeElement();
        c.node = C;
        c.isInCommonSubTree = false;
        c.parent = a;
        a.childNodes.push(c);

        var d = new CommonSubTreeElement();
        d.node = D;
        d.isInCommonSubTree = true;
        d.parent = b;
        b.childNodes.push(d);

        var e = new CommonSubTreeElement();
        e.node = E;
        e.isInCommonSubTree = true;
        e.parent = b;
        b.childNodes.push(e);

        var f = new CommonSubTreeElement();
        f.node = F;
        f.isInCommonSubTree = true;
        f.parent = e;
        e.childNodes.push(f);

        var g = new CommonSubTreeElement();
        g.node = G;
        g.isInCommonSubTree = false;
        g.parent = e;
        e.childNodes.push(g);

        var h = new CommonSubTreeElement();
        h.node = H;
        h.isInCommonSubTree = false;
        h.parent = c;
        c.childNodes.push(h);

        var i = new CommonSubTreeElement();
        i.node = I;
        i.isInCommonSubTree = false;
        i.parent = h;
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

        var a = new CommonSubTreeElement();
        a.parent = null;
        a.isInCommonSubTree = true;
        a.node = A;

        var b = new CommonSubTreeElement();
        b.parent = a;
        b.isInCommonSubTree = true;
        b.node = B;
        a.childNodes.push(b);

        var c = new CommonSubTreeElement();
        c.parent = a;
        c.node = C;
        c.isInCommonSubTree = false;
        a.childNodes.push(c);

        expectation1 = a;
    }

    beforeEach(() => {
        buildCommonTree0();
        buildCommonTree1();
    });

    it("should throw error if either root is null", () => {
        expect(() => {
            TreeBuilder.buildTree(null, null);
        }).toThrowError();

        expect(() => {
            TreeBuilder.buildTree(null, commonTree0);
        }).toThrowError();

        expect(() => {
            TreeBuilder.buildTree(commonTree0, null);
        }).toThrowError();
    });

    it("should build an augmented tree", () => {
        expect(TreeBuilder.buildTree(fullTree0, commonTree0)).toEqual(expectation0);
        expect(TreeBuilder.buildTree(fullTree1, commonTree1)).toEqual(expectation1);
    });
});
