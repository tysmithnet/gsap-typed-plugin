//project:      gsap-typed-plugin.js
//author:       Ty Smith
//email:        ty@tysmith.net
//twitter:      @tysmithnet
//description:  A plugin for the Greensock animation library (www.greensock.com)
//
//Copyright (C) 2015 Ty Smith
//
//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.
//
//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//GNU General Public License for more details.
//
//You should have received a copy of the GNU General Public License
//along with this program.  If not, see <http://www.gnu.org/licenses/>.
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {
    "use strict";

    var TreeTraversal;
(function (TreeTraversal) {
    var Traverser = (function () {
        function Traverser() {
        }
        Traverser.getInorderTraversal = function (root) {
            if (root == null)
                return [];
            var resultStack = [];
            var navStack = [root];
            while (navStack.length > 0) {
                var top = navStack.pop();
                resultStack.push(top);
                for (var i = top.childNodes.length - 1; i >= 0; i--) {
                    navStack.push(top.childNodes[i]);
                }
            }
            return resultStack;
        };
        return Traverser;
    })();
    TreeTraversal.Traverser = Traverser;
})(TreeTraversal || (TreeTraversal = {}));
var NodeCommonality;
(function (NodeCommonality) {
    var NodeComparisonStrategy = (function () {
        function NodeComparisonStrategy() {
        }
        NodeComparisonStrategy.findCommonSubString = function (lhs, rhs) {
            if (lhs == null || rhs == null)
                return null;
            var result = "";
            for (var i = 0; i < Math.min(lhs.length, rhs.length); i++) {
                if (lhs.charAt(i) == rhs.charAt(i))
                    result = result + lhs.charAt(i);
                else
                    break;
            }
            return result;
        };
        NodeComparisonStrategy.areEqual = function (left, right) {
            if (left == null && right == null)
                return true;
            if ((left == null && right != null) || (left != null && right == null))
                return false;
            if (left.nodeType != right.nodeType)
                return false;
            if (left.nodeName != right.nodeName)
                return false;
            if (left.nodeValue != right.nodeValue)
                return false;
            if (!NodeComparisonStrategy.areNodeAttributesEqual(left.attributes, right.attributes))
                return false;
            return true;
        };
        NodeComparisonStrategy.areNodeAttributesEqual = function (left, right) {
            if (left == null && right == null)
                return true;
            if (left == null && right != null)
                return false;
            if (right == null && left != null)
                return false;
            if (left.length != right.length)
                return false;
            for (var i = 0; i < left.length; i++) {
                var l = left.item(i);
                var r = right.getNamedItem(l.name);
                if (l.name == 'class' && r && r.name == 'class') {
                    var lClasses = l.value.split(/\s+/).sort();
                    var rClasses = r.value.split(/\s+/).sort();
                    if (lClasses.length != rClasses.length)
                        return false;
                    for (var j = 0; j < lClasses.length; j++)
                        if (lClasses[j] != rClasses[j])
                            return false;
                    continue;
                }
                if (r == null || l.value != r.value)
                    return false;
            }
            return true;
        };
        return NodeComparisonStrategy;
    })();
    NodeCommonality.NodeComparisonStrategy = NodeComparisonStrategy;
})(NodeCommonality || (NodeCommonality = {}));
var CompStrat = NodeCommonality.NodeComparisonStrategy;
var TreeCommonality;
(function (TreeCommonality) {
    var CommonLeftSubTree = (function () {
        function CommonLeftSubTree() {
            this.leftCommonSubTree = null;
        }
        return CommonLeftSubTree;
    })();
    TreeCommonality.CommonLeftSubTree = CommonLeftSubTree;
    var CommonLeftSubTreeFinder = (function () {
        function CommonLeftSubTreeFinder() {
        }
        CommonLeftSubTreeFinder.areNodesTextNodes = function () {
            var nodes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                nodes[_i - 0] = arguments[_i];
            }
            if (nodes == null || nodes.length == 0)
                return false;
            for (var i = 0; i < nodes.length; i++) {
                if (!(nodes[i] instanceof Text))
                    return false;
            }
            return true;
        };
        CommonLeftSubTreeFinder.findCommonLeftSubTree = function (left, right) {
            if (left == null || right == null)
                throw new Error("You must provide non null values for parameters");
            var compareStrategy = CompStrat.areEqual;
            var result = new CommonLeftSubTree();
            var differenceHasBeenFound = false;
            var leftResultStack;
            var rightResultStack;
            var leftNavStack = [left];
            var rightNavStack = [right];
            var leftVisited = [];
            while (!differenceHasBeenFound) {
                var topL;
                var topR;
                topL = leftNavStack[leftNavStack.length - 1];
                topR = rightNavStack[rightNavStack.length - 1];
                if (leftVisited.indexOf(topL) > -1 || compareStrategy(topL, topR) || CommonLeftSubTreeFinder.areNodesTextNodes(topL, topR)) {
                    var lClone = topL.cloneNode(false);
                    var rClone = topR.cloneNode(false);
                    if (CommonLeftSubTreeFinder.areNodesTextNodes(topL, topR)) {
                        var common = CompStrat.findCommonSubString(topL.wholeText, topR.wholeText);
                        lClone = document.createTextNode(common);
                        rClone = document.createTextNode(common);
                        if (topL.wholeText != topR.wholeText)
                            differenceHasBeenFound = true;
                    }
                    if (leftVisited.indexOf(topL) == -1) {
                        if (!leftResultStack) {
                            result.leftCommonSubTree = lClone;
                            leftResultStack = [lClone];
                            rightResultStack = [rClone];
                        }
                        else {
                            leftResultStack[leftResultStack.length - 1].appendChild(lClone);
                            rightResultStack[rightResultStack.length - 1].appendChild(rClone);
                            leftResultStack.push(lClone);
                            rightResultStack.push(rClone);
                        }
                        leftVisited.push(topL);
                    }
                    var lrsTop = leftResultStack[leftResultStack.length - 1];
                    var rrsTop = rightResultStack[rightResultStack.length - 1];
                    if (lrsTop.childNodes.length < topL.childNodes.length &&
                        rrsTop.childNodes.length < topR.childNodes.length) {
                        leftNavStack.push(topL.childNodes[lrsTop.childNodes.length]);
                        rightNavStack.push(topR.childNodes[rrsTop.childNodes.length]);
                    }
                    else {
                        if (topL.childNodes.length != topR.childNodes.length)
                            differenceHasBeenFound = true;
                        else {
                            leftNavStack.pop();
                            rightNavStack.pop();
                            leftResultStack.pop();
                            rightResultStack.pop();
                            if (leftNavStack.length == 0)
                                differenceHasBeenFound = true;
                        }
                    }
                }
                else {
                    differenceHasBeenFound = true;
                }
            }
            return result;
        };
        return CommonLeftSubTreeFinder;
    })();
    TreeCommonality.CommonLeftSubTreeFinder = CommonLeftSubTreeFinder;
})(TreeCommonality || (TreeCommonality = {}));
var AugmentedTreeBuilding;
(function (AugmentedTreeBuilding) {
    var Traverser = TreeTraversal.Traverser;
    var TreeElement = (function () {
        function TreeElement(parent, node, isInCommonSubTree, displayStrategy, childNodes) {
            if (childNodes === void 0) { childNodes = []; }
            this.childNodes = [];
            this.parent = parent;
            this.node = node;
            this.childNodes = childNodes;
            this.isInCommonSubTree = isInCommonSubTree;
            this.displayStrategy = displayStrategy;
        }
        TreeElement.prototype.getNumberKeyPressesToReveal = function () {
            return this.displayStrategy.numberKeyPressesToReveal;
        };
        return TreeElement;
    })();
    AugmentedTreeBuilding.TreeElement = TreeElement;
    var DisplayStrategy = (function () {
        function DisplayStrategy(node) {
            this.numberKeyPressesToReveal = 0;
            if (node == null)
                throw Error("node must have a value");
            this.node = node;
            if (this.node.nodeType == Node.TEXT_NODE) {
                this.numberKeyPressesToReveal = this.node.textContent.length;
            }
        }
        DisplayStrategy.prototype.displayNode = function (node, numKeyPresses) {
            if (node.nodeType == Node.TEXT_NODE) {
                var text = node.textContent;
                return document.createTextNode(text.substring(0, numKeyPresses));
            }
            else {
                return node;
            }
        };
        return DisplayStrategy;
    })();
    AugmentedTreeBuilding.DisplayStrategy = DisplayStrategy;
    var Matcher = (function () {
        function Matcher() {
        }
        Matcher.prototype.isMatch = function (node) {
            return true;
        };
        Matcher.prototype.getDisplayStrategy = function (node) {
            return new DisplayStrategy(node);
        };
        return Matcher;
    })();
    AugmentedTreeBuilding.Matcher = Matcher;
    var AugmentedTreeBuilder = (function () {
        function AugmentedTreeBuilder(fullTreeRoot, commonSubTreeRoot) {
            this.matchers = [new Matcher()];
            this.fullTreeRoot = fullTreeRoot;
            this.commonSubTreeRoot = commonSubTreeRoot;
            if (commonSubTreeRoot)
                this.splitLastNode();
        }
        AugmentedTreeBuilder.prototype.splitLastNode = function () {
            var fullTraversal = Traverser.getInorderTraversal(this.fullTreeRoot);
            var commonTraversal = Traverser.getInorderTraversal(this.commonSubTreeRoot);
            var lastFull = fullTraversal[commonTraversal.length - 1];
            var lastCommon = commonTraversal[commonTraversal.length - 1];
            if (lastFull.nodeType != Node.TEXT_NODE)
                return;
            if (lastFull.textContent == lastCommon.textContent)
                return;
            var length = lastCommon.textContent.length;
            lastFull.splitText(length);
        };
        AugmentedTreeBuilder.prototype.addMatcher = function (matcher) {
            this.matchers.push(matcher);
        };
        AugmentedTreeBuilder.prototype.buildTree = function () {
            var _this = this;
            if (this.fullTreeRoot == null)
                throw Error("The full tree root must be non-null");
            var result;
            var numberOfCommonNodes = Traverser.getInorderTraversal(this.commonSubTreeRoot).length;
            var numberMarkedAsCommon = 0;
            var recursion = function (parent, node) {
                var isInCommonSubTree = numberMarkedAsCommon++ < numberOfCommonNodes;
                var displayStrategy;
                for (var i = 0; i < _this.matchers.length; i++) {
                    var matcher = _this.matchers[i];
                    if (matcher.isMatch(node)) {
                        displayStrategy = matcher.getDisplayStrategy(node);
                    }
                }
                var element = new TreeElement(parent, node, isInCommonSubTree, displayStrategy);
                if (parent == null)
                    result = element;
                else
                    parent.childNodes.push(element);
                for (var i = 0; i < node.childNodes.length; i++) {
                    recursion(element, node.childNodes[i]);
                }
            };
            recursion(null, this.fullTreeRoot);
            return result;
        };
        return AugmentedTreeBuilder;
    })();
    AugmentedTreeBuilding.AugmentedTreeBuilder = AugmentedTreeBuilder;
})(AugmentedTreeBuilding || (AugmentedTreeBuilding = {}));
var TreeElement = AugmentedTreeBuilding.TreeElement;
var TreeTraverser = TreeTraversal.Traverser;
var TreePrinting;
(function (TreePrinting) {
    var TreePrinter = (function () {
        function TreePrinter(fromTree, toTree) {
            this.fromTree = fromTree;
            this.toTree = toTree;
            this.fromTreegetInorderTraversal = TreeTraverser.getInorderTraversal(fromTree);
            this.toTreegetInorderTraversal = TreeTraverser.getInorderTraversal(toTree);
            this.calculateNumberOfBackspacesUntilCommon();
            this.calculateNumberOfKeyPressesUntilFinish();
        }
        TreePrinter.prototype.calculateNumberOfBackspacesUntilCommon = function () {
            var inOrderTraversal = TreeTraverser.getInorderTraversal(this.fromTree);
            var runningTotal = 0;
            for (var i = inOrderTraversal.length - 1; i >= 0; i--) {
                var element = inOrderTraversal[i];
                if (element.isInCommonSubTree)
                    break;
                else
                    runningTotal += element.getNumberKeyPressesToReveal();
            }
            this.numBackSpacesUntilCommon = runningTotal;
        };
        TreePrinter.prototype.getTotalKeyPressCount = function () {
            return this.numBackSpacesUntilCommon + this.numKeyPressesFromCommonUntilFinish;
        };
        TreePrinter.prototype.calculateNumberOfKeyPressesUntilFinish = function () {
            var inOrderTraversal = TreeTraverser.getInorderTraversal(this.toTree);
            var runningTotal = 0;
            for (var i = 0; i < inOrderTraversal.length; i++) {
                var element = inOrderTraversal[i];
                if (element.isInCommonSubTree)
                    continue;
                else
                    runningTotal += element.getNumberKeyPressesToReveal();
            }
            this.numKeyPressesFromCommonUntilFinish = runningTotal;
        };
        TreePrinter.prototype.showRemainingBackspaceContent = function (numberOfBackspaces) {
            var clone = this.fromTree.node.cloneNode(true);
            var cloneTraversal = TreeTraversal.Traverser.getInorderTraversal(clone);
            var runningTotal = 0;
            for (var i = this.fromTreegetInorderTraversal.length - 1; i >= 0; i--) {
                var element = this.fromTreegetInorderTraversal[i];
                var node = cloneTraversal[i];
                if (element.getNumberKeyPressesToReveal() + runningTotal < numberOfBackspaces) {
                    node.parentNode.removeChild(node);
                    runningTotal += element.getNumberKeyPressesToReveal();
                }
                else {
                    var parent = node.parentNode;
                    var newNode = element.displayStrategy.displayNode(node, element.getNumberKeyPressesToReveal() - (numberOfBackspaces - runningTotal));
                    if (parent != null) {
                        parent.removeChild(node);
                        if (newNode.nodeType != Node.TEXT_NODE || (newNode.nodeType == Node.TEXT_NODE && newNode.textContent != ""))
                            parent.appendChild(newNode);
                    }
                    else {
                        return newNode;
                    }
                    break;
                }
            }
            return clone;
        };
        TreePrinter.prototype.showRemainingTypedContent = function (numKeyPresses) {
            var clone = this.toTree.node.cloneNode(false);
            var currentNode = clone;
            var navStack = [{ element: this.toTree, childIndex: -1 }];
            var runningTotal = 0;
            if (numKeyPresses == 0)
                return this.toTree.node;
            while (navStack.length) {
                var top = navStack[navStack.length - 1];
                if (top.element.isInCommonSubTree) {
                    if (navStack.length > 1 && top.childIndex == -1) {
                        var newNode = top.element.node.cloneNode(false);
                        currentNode.appendChild(newNode);
                        currentNode = newNode;
                    }
                    if (++top.childIndex < top.element.childNodes.length)
                        navStack.push({
                            element: top.element.childNodes[top.childIndex],
                            childIndex: -1 });
                    else {
                        navStack.pop();
                        currentNode = currentNode.parentNode;
                    }
                }
                else {
                    if (runningTotal + top.element.getNumberKeyPressesToReveal() < numKeyPresses) {
                        if (navStack.length > 1 && top.childIndex == -1) {
                            var newNode = top.element.node.cloneNode(false);
                            currentNode.appendChild(newNode);
                            currentNode = newNode;
                        }
                        if (++top.childIndex < top.element.childNodes.length)
                            navStack.push({
                                element: top.element.childNodes[top.childIndex],
                                childIndex: -1 });
                        else {
                            navStack.pop();
                            currentNode = currentNode.parentNode;
                        }
                        runningTotal += top.element.getNumberKeyPressesToReveal();
                    }
                    else {
                        var newNode = top.element.displayStrategy.displayNode(top.element.node, numKeyPresses - runningTotal);
                        if (navStack.length < 2)
                            return newNode;
                        else
                            currentNode.appendChild(newNode);
                        break;
                    }
                }
            }
            return clone;
        };
        TreePrinter.normalizeTree = function (root) {
            if (!root)
                return;
            root.normalize();
            for (var i = 0; i < root.childNodes.length; i++)
                TreePrinter.normalizeTree(root.childNodes[i]);
        };
        TreePrinter.prototype.printTree = function (percentCompleteToDisplay) {
            percentCompleteToDisplay = Math.min(1, percentCompleteToDisplay);
            percentCompleteToDisplay = Math.max(0, percentCompleteToDisplay);
            var total = this.getTotalKeyPressCount();
            var keyPressesFromPercent = (total * percentCompleteToDisplay) | 0;
            var result;
            if (percentCompleteToDisplay != 1 && keyPressesFromPercent <= this.numBackSpacesUntilCommon)
                result = this.showRemainingBackspaceContent(keyPressesFromPercent);
            else
                result = this.showRemainingTypedContent(keyPressesFromPercent - this.numBackSpacesUntilCommon);
            TreePrinter.normalizeTree(result);
            return result;
        };
        return TreePrinter;
    })();
    TreePrinting.TreePrinter = TreePrinter;
})(TreePrinting || (TreePrinting = {}));
var Finder = TreeCommonality.CommonLeftSubTreeFinder;
var TreeBuilder = AugmentedTreeBuilding.AugmentedTreeBuilder;
var Printer = TreePrinting.TreePrinter;
var NodeArrayConverter = (function () {
    function NodeArrayConverter() {
    }
    NodeArrayConverter.convertToNode = function (value) {
        if (value instanceof jQuery)
            return value[0];
        if (value instanceof Node)
            return value;
        if (typeof (value) == 'string')
            return document.createTextNode(value);
        return null;
    };
    NodeArrayConverter.convert = function (value) {
        if (value == null)
            return null;
        if (value instanceof Array) {
            var newArray = [];
            for (var i = 0; i < value.length; i++) {
                var converted = NodeArrayConverter.convertToNode(value[i]);
                if (!converted)
                    return null;
                newArray.push(converted);
            }
            return newArray;
        }
        if (value instanceof NodeList)
            return value;
        if (typeof (value) == 'string') {
            var div = document.createElement("div");
            div.innerHTML = value;
            return div.childNodes;
        }
        if (value instanceof jQuery)
            return [value[0]];
        if (value instanceof Node)
            return [value];
        return null;
    };
    return NodeArrayConverter;
})();
var TypedPlugin = (function () {
    function TypedPlugin() {
        this.propName = "typed";
        this.API = 2;
        this.version = "1.0.2";
    }
    TypedPlugin.prototype.init = function (target, value, tween) {
        this.target = NodeArrayConverter.convertToNode(target);
        if (this.target == null)
            return false;
        if (value == null || value.to == undefined)
            return false;
        this.endingValue = NodeArrayConverter.convert(value.to);
        if (this.endingValue == null)
            return false;
        var targetClone = document.createElement("div");
        for (var i = 0; i < this.target.childNodes.length; i++)
            targetClone.appendChild(this.target.childNodes[i].cloneNode(true));
        var fakeToRoot = document.createElement("div");
        for (var i = 0; i < this.endingValue.length; i++)
            fakeToRoot.appendChild(this.endingValue[i].cloneNode(true));
        var commonSubtree = null;
        if (value.stopOnCommon) {
            commonSubtree = Finder.findCommonLeftSubTree(targetClone, fakeToRoot).leftCommonSubTree;
        }
        var fromBuilder = new TreeBuilder(targetClone, commonSubtree);
        var toBuilder = new TreeBuilder(fakeToRoot, commonSubtree);
        if (value.customMatchers && value.customMatchers.length) {
            for (var i = 0; i < value.customMatchers.length; i++) {
                fromBuilder.addMatcher(value.customMatchers[i]);
                toBuilder.addMatcher(value.customMatchers[i]);
            }
        }
        var fromAug = fromBuilder.buildTree();
        var toAug = toBuilder.buildTree();
        this.printer = new Printer(fromAug, toAug);
        return true;
    };
    TypedPlugin.prototype.set = function (ratio) {
        var newContent = this.printer.printTree(ratio);
        while (this.target.firstChild)
            this.target.removeChild(this.target.firstChild);
        while (newContent.firstChild)
            this.target.appendChild(newContent.firstChild);
    };
    return TypedPlugin;
})();

    _gsScope._gsDefine.plugin(new TypedPlugin());

}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }