///<reference path="vendor/jquery.d.ts"/>
///<reference path="vendor/jasmine.d.ts"/>
///<reference path="TypedPlugin.ts"/>
///<reference path="vendor/greensock.d.ts"/>


describe("init", () => {
    it("should return false if a Node is not passed to init", () => {
        expect(new TypedPlugin().init(null, null, null)).toEqual(false);
    });

    it("should return true if valid values are passed in", () => {
        var parent = document.createElement("div");
        var target = document.createElement("div");
        parent.appendChild(target);

        var values:IPluginOptions = {
            stopOnCommon: true,
            to: $('<div>').html("hi")[0]
        };
        expect(new TypedPlugin().init(target, values, null)).toEqual(true);
    });

    it("should return true if valid values are passed in", () => {
        var parent = document.createElement("div");
        var target = document.createElement("div");
        parent.appendChild(target);

        var values:IPluginOptions = {
            stopOnCommon: false,
            to: $('<div>').html("hi")[0]
        };
        expect(new TypedPlugin().init(target, values, null)).toEqual(true);
    });
});

describe("set", () => {
   it("should swap out the target element for the created element after set is called", () => {
       var parent = document.createElement("div");
       var from = $("<div>")[0];
       parent.appendChild(from);
       var to = $("<div>").html("12")[0];
       var values:IPluginOptions = {
           stopOnCommon: true,
           to: to
       };
       var plugin = new TypedPlugin();
       plugin.init(from, values, null);
       plugin.set(0);
       expect(parent.childNodes[0]).toEqual($("<div>").html("")[0]);
       plugin.set(.5);
       expect(parent.childNodes[0]).toEqual($("<div>").html("1")[0]);
       plugin.set(1);
       expect(parent.childNodes[0]).toEqual($("<div>").html("12")[0]);
   });
});