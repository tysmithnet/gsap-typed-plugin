///<reference path="vendor/jquery.d.ts"/>
///<reference path="vendor/jasmine.d.ts"/>
///<reference path="TypedPlugin.ts"/>
///<reference path="vendor/greensock.d.ts"/>

var $ = jQuery;
var Converter = NodeArrayConverter;

describe("NodeArrayConverter.convertToNode()", () =>{
    it("should convert jquery", () => {
        var j = $('<div>');
        expect(Converter.convertToNode(j)).toEqual(j[0]);
    });

    it("should return the param if it is node", () => {
        var n = document.createElement("div")
        expect(Converter.convertToNode(n)).toBe(n);

        var t = document.createTextNode("hi");
        expect(Converter.convertToNode(t)).toBe(t);
    });

    it("should convert a string to a textnode", () => {
        expect(Converter.convertToNode("hi")).toEqual(document.createTextNode("hi"));
    });
});

describe("NodeArrayConverter.convert()", () => {
    it("should return null if null is passed in", () => {
        expect(Converter.convert(null)).toEqual(null);
    });

    it("should return the value if it is a NodeList", () => {
        var div = document.createElement("div");
        expect(Converter.convert(div.childNodes)).toBe(div.childNodes);
        div.innerHTML = "<div>hi</div>";
        expect(Converter.convert(div.childNodes)).toBe(div.childNodes);
    });

    it("should return an array with all converted elements", () => {
        var j = $('<div>');
        var n = document.createElement("div");
        var a = [j, n];
        var e = [j[0], n];
        expect(Converter.convert(a)).toEqual(e);
    });

    it("should return null if any element of an array cannot be converted", () => {
        expect(Converter.convert([true, {}, document.createElement("div")])).toEqual(null);
    });

    it("should return a NodeList if a string is passed in", () => {
        var s = "<div>hi</div><strong>there</strong>";
        var d = document.createElement("div");
        d.innerHTML = s;
        expect(Converter.convert(s)).toEqual(d.childNodes);
    });

    it("should null if anything else is passed in", () => {
        expect(Converter.convert({})).toEqual(null);
        expect(Converter.convert(() => {})).toEqual(null);
        expect(Converter.convert(true)).toEqual(null);
        expect(Converter.convert(1)).toEqual(null);
    });

    it("should return an array made up if a jQuery object is passed in", () => {
        var j = $('<strong>');
        expect(Converter.convert(j)).toEqual([j[0]]);
    });

    it("should return an array that contains a node if a node is passed in", () => {
        var n = document.createElement("div");
        expect(Converter.convert(n)).toEqual([n]);
    });
});

describe("init", () => {
    it("should return false if a null target is passed in", () => {
        var val = {to:"hi", stopOnCommon:true};
        expect(new TypedPlugin().init(null, val, null)).toEqual(false);
    });

    it("should return false if a null value is passed in", () => {
        expect(new TypedPlugin().init(document.createElement("div"), null, null)).toEqual(false);
    });

    it("should return false if to is not set", () => {
        expect(new TypedPlugin().init(document.createElement("div"), (<IPluginOptions>{}), null)).toEqual(false);
    });

    it("should return true if a an array of jQuery objects is passed in", () => {
        expect(new TypedPlugin().init(document.createElement("div"), {to: [$('<div>'), $('<strong>')], stopOnCommon: true}, null)).toEqual(true);
    });

    it("should return true if a string is passed in for the destination", () => {
        expect(new TypedPlugin().init(document.createElement("div"), {to:"<div>hi</div><strong>there</strong>", stopOnCommon:false}, null)).toEqual(true);
    });

    it("should return false if a non convertible value is passed in ", () => {
        expect(new TypedPlugin().init(document.createElement("div"), {to:true, stopOnCommon: false}, null)).toEqual(false);
    });

    it("should return true if valid values are passed in", () => {
        var parent = document.createElement("div");
        var target = document.createElement("div");
        parent.appendChild(target);

        var values:IPluginOptions = {
            stopOnCommon: true,
            to: $('<div>').html("hi")[0].childNodes
        };
        expect(new TypedPlugin().init(target, values, null)).toEqual(true);
    });

    it("should return true if valid values are passed in", () => {
        var parent = document.createElement("div");
        var target = document.createElement("div");
        parent.appendChild(target);

        var values:IPluginOptions = {
            stopOnCommon: false,
            to: $('<div>').html("hi")[0].childNodes
        };
        expect(new TypedPlugin().init(target, values, null)).toEqual(true);
    });
});

describe("set", () => {
    it("should replace the child nodes, but leave the root node intact", () => {
        var root = $('<div id="a">').text("hi")[0];
        var strong = document.createTextNode("hello");
        var to = [strong];
        var values:IPluginOptions = {
            stopOnCommon: false,
            to: to
        };
        var plugin = new TypedPlugin();
        plugin.init(root, values, null);
        plugin.set(1);
        expect($(root).text()).toEqual('hello');
    });
});