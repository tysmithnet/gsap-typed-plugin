///<reference path="vendor/jasmine.d.ts"/>
///<reference path="vendor/jquery.d.ts"/>
///<reference path="NodeCounting.ts"/>

var strategy = NodeCounting.NodeCountingStrategy;
var result = NodeCounting.NodeCountingResult;

describe("Default node counting strategy", () => {
    var textNode0 = document.createTextNode("a");
    var textNode0Result = new result(true, 1);

    it("should throw an error if the node is null", () => {
        expect(() => {
            strategy.shouldCountNode(null);
        }).toThrowError();
    });

    it("should return a status of true for text nodes", () => {
        expect(strategy.shouldCountNode(textNode0)).toEqual(textNode0Result);
    });

    it("should return false for other types of nodes than text node", () => {
        var div = document.createElement("div");

        expect(strategy.shouldCountNode(div)).toEqual(new result(false, 0));
    });
});