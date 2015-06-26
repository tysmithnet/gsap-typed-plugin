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
        numberKeyPressesToReveal:number;
        isInCommonSubTree:boolean;
    }
    
    export class AugmentedTreeBuilder
    {
        static buildTree(fullTreeRoot:Node, commonSubTreeRoot:Node):TreeElement
        {
            if(fullTreeRoot == null)
                throw Error("The full tree root must be non-null");

            var result:TreeElement;

            var numberOfCommonNodes = Traverser.InOrderTraversal(commonSubTreeRoot).length;
            var numberMarkedAsCommon = 0;

            var recursion = (parent:TreeElement, node:Node):void => {
                var element = new TreeElement();
                element.node = node;
                element.parent = parent;
                element.isInCommonSubTree = numberMarkedAsCommon++ < numberOfCommonNodes;

                if(node.nodeType == Node.TEXT_NODE)
                    element.numberKeyPressesToReveal = (<Text>node).wholeText.length;
                else
                    element.numberKeyPressesToReveal = 0;

                if(parent == null)
                    result = element;
                else
                    parent.childNodes.push(element);

                for(var i = 0; i < node.childNodes.length; i++)
                {
                    recursion(element, node.childNodes[i]);
                }
            }

            recursion(null, fullTreeRoot);

            return result;
        }
    }
}