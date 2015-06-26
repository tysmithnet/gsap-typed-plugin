///<reference path="vendor/jasmine.d.ts"/>
///<reference path="vendor/jquery.d.ts"/>
///<reference path="AugmentedTreeBuilding.ts"/>

var TreeBuilder = AugmentedTreeBuilding.CommonSubTreeAugmentedTreeBuilder;
var TreeElement = AugmentedTreeBuilding.TreeElement;
var $ = jQuery;

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

        var a = new TreeElement();
        a.node = A;
        a.isInCommonSubTree = true;
        a.parent = null;
        a.numberKeyPressesToReveal = 0;

        var b = new TreeElement();
        b.node = B;
        b.isInCommonSubTree = true;
        b.parent = a;
        a.childNodes.push(b);
        b.numberKeyPressesToReveal = 0;

        var c = new TreeElement();
        c.node = C;
        c.isInCommonSubTree = false;
        c.parent = a;
        a.childNodes.push(c);
        c.numberKeyPressesToReveal = 0;

        var d = new TreeElement();
        d.node = D;
        d.isInCommonSubTree = true;
        d.parent = b;
        b.childNodes.push(d);
        d.numberKeyPressesToReveal = 0;

        var e = new TreeElement();
        e.node = E;
        e.isInCommonSubTree = true;
        e.parent = b;
        b.childNodes.push(e);
        e.numberKeyPressesToReveal = 0;

        var f = new TreeElement();
        f.node = F;
        f.isInCommonSubTree = true;
        f.parent = e;
        e.childNodes.push(f);
        f.numberKeyPressesToReveal = 0;

        var g = new TreeElement();
        g.node = G;
        g.isInCommonSubTree = false;
        g.parent = e;
        e.childNodes.push(g);
        g.numberKeyPressesToReveal = 0;

        var h = new TreeElement();
        h.node = H;
        h.isInCommonSubTree = false;
        h.parent = c;
        c.childNodes.push(h);
        h.numberKeyPressesToReveal = 0;

        var i = new TreeElement();
        i.node = I;
        i.isInCommonSubTree = false;
        i.parent = h;
        h.childNodes.push(i);
        i.numberKeyPressesToReveal = 0;

        expectation0 = a;
    }

    function buildCommonTree1()
    {
        commonTree1 = $('<A>').html("<B></B>")[0];
        fullTree1 = $('<A>').html("<B></B><C></C>")[0];

        var A = $(fullTree1)[0];
        var B = $(fullTree1).find('B')[0];
        var C = $(fullTree1).find('C')[0];

        var a = new TreeElement();
        a.parent = null;
        a.isInCommonSubTree = true;
        a.node = A;
        a.numberKeyPressesToReveal = 0;

        var b = new TreeElement();
        b.parent = a;
        b.isInCommonSubTree = true;
        b.node = B;
        a.childNodes.push(b);
        b.numberKeyPressesToReveal = 0;

        var c = new TreeElement();
        c.parent = a;
        c.node = C;
        c.isInCommonSubTree = false;
        a.childNodes.push(c);
        c.numberKeyPressesToReveal = 0;

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

        var div = new TreeElement();
        div.parent = null;
        div.numberKeyPressesToReveal = 0;
        div.isInCommonSubTree = true;
        div.node = fullTree2;

        var this_ = new TreeElement();
        this_.isInCommonSubTree = true;
        this_.numberKeyPressesToReveal = 5;
        this_.node = THIS_;
        this_.parent = div;
        div.childNodes.push(this_);

        var strong = new TreeElement();
        strong.isInCommonSubTree = true;
        strong.numberKeyPressesToReveal = 0;
        strong.node = STRONG;
        strong.parent = div;
        div.childNodes.push(strong);

        var is = new TreeElement();
        is.isInCommonSubTree = true;
        is.numberKeyPressesToReveal = 4;
        is.node = IS;
        is.parent = strong;
        strong.childNodes.push(is);

        var h1 = new TreeElement();
        h1.isInCommonSubTree = false;
        h1.numberKeyPressesToReveal = 0;
        h1.node = H1;
        h1.parent = div;
        div.childNodes.push(h1);

        var bigger = new TreeElement();
        bigger.isInCommonSubTree = false;
        bigger.numberKeyPressesToReveal = 6;
        bigger.node = BIGGER;
        bigger.parent = h1;
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
            TreeBuilder.buildTree(null, null);
        }).toThrowError();

        expect(() => {
            TreeBuilder.buildTree(null, commonTree0);
        }).toThrowError();
    });

    it("should build an augmented tree", () => {
        expect(TreeBuilder.buildTree(fullTree0, commonTree0)).toEqual(expectation0);
        expect(TreeBuilder.buildTree(fullTree1, commonTree1)).toEqual(expectation1);
        var result = TreeBuilder.buildTree(fullTree2, commonTree2);
        expect(result).toEqual(expectation2);
    });
});
