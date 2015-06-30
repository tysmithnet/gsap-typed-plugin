///<reference path="NodeCommonality.ts"/>
///<reference path="TreeCommonality.ts"/>
///<reference path="TreeTraversal.ts"/>

module AugmentedTreeBuilding
{
    import NodeCompare = NodeCommonality.NodeComparisonStrategy;
    import CommonLeftSubTree = TreeCommonality.CommonLeftSubTree;
    import Traverser = TreeTraversal.Traverser;

    export class TreeElement
    {
        parent:TreeElement;
        node: Node;
        childNodes:TreeElement[] = [];
        isInCommonSubTree:boolean;
        displayStrategy:IDisplayStrategy;


        constructor(parent:AugmentedTreeBuilding.TreeElement, node:Node,
                    isInCommonSubTree:boolean, displayStrategy:AugmentedTreeBuilding.IDisplayStrategy,
                    childNodes:AugmentedTreeBuilding.TreeElement[] = []) {
            this.parent = parent;
            this.node = node;
            this.childNodes = childNodes;
            this.isInCommonSubTree = isInCommonSubTree;
            this.displayStrategy = displayStrategy;
        }

        getNumberKeyPressesToReveal():number
        {
            return this.displayStrategy.numberKeyPressesToReveal;
        }
    }

    export interface IDisplayStrategy
    {
        displayNode(node:Node, numKeyPresses):Node;
        numberKeyPressesToReveal:number;
    }

    export class DisplayStrategy implements IDisplayStrategy
    {
        private node:Node;
        numberKeyPressesToReveal:number = 0;

        constructor(node:Node) {
            if(node == null)
                throw Error("node must have a value");

            this.node = node;

            if(this.node.nodeType == Node.TEXT_NODE)
            {
                this.numberKeyPressesToReveal = (<Text>this.node).wholeText.length;
            }
        }

        displayNode(node:Node, numKeyPresses):Node {
            if(node.nodeType == Node.TEXT_NODE)
            {
                var text = (<Text>node).wholeText;
                return document.createTextNode(text.substring(0, numKeyPresses));
            }
            else
            {
                return node;
            }
        }
    }

    export interface IMatcher
    {
        isMatch(node:Node):boolean;
        getDisplayStategy(node:Node): IDisplayStrategy;
    }

    export class Matcher implements IMatcher
    {
        isMatch(node:Node):boolean {
            return true;
        }

        getDisplayStategy(node:Node):IDisplayStrategy {
            return new DisplayStrategy(node);
        }
    }



    export class AugmentedTreeBuilder
    {
        private fullTreeRoot:Node;
        private commonSubTreeRoot:Node;
        private matchers: IMatcher[] = [new Matcher()];

        constructor(fullTreeRoot:Node, commonSubTreeRoot:Node) {
            this.fullTreeRoot = fullTreeRoot;
            this.commonSubTreeRoot = commonSubTreeRoot;
        }

        addMatcher(matcher:IMatcher)
        {
            this.matchers.push(matcher);
        }

        buildTree():TreeElement
        {
            if(this.fullTreeRoot == null)
                throw Error("The full tree root must be non-null");

            var result:TreeElement;

            var numberOfCommonNodes = Traverser.InOrderTraversal(this.commonSubTreeRoot).length;
            var numberMarkedAsCommon = 0;

            var recursion = (parent:TreeElement, node:Node):void => {

                var isInCommonSubTree = numberMarkedAsCommon++ < numberOfCommonNodes;
                var displayStrategy:IDisplayStrategy;

                for(var i = 0; i < this.matchers.length; i++)
                {
                    var matcher = this.matchers[i];
                    if(matcher.isMatch(node))
                    {
                        displayStrategy = matcher.getDisplayStategy(node);
                    }
                }

                var element = new TreeElement(parent, node, isInCommonSubTree, displayStrategy);

                if(parent == null)
                    result = element;
                else
                    parent.childNodes.push(element);

                for(var i = 0; i < node.childNodes.length; i++)
                {
                    recursion(element, node.childNodes[i]);
                }
            }

            recursion(null, this.fullTreeRoot);

            return result;
        }
    }
}