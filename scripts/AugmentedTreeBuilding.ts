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
    }

    export class CommonSubTreeElement extends TreeElement
    {
        parent:CommonSubTreeElement;
        isInCommonSubTree:boolean;
        childNodes:CommonSubTreeElement[] = [];
    }

    export class VisualCommonSubTreeElement extends CommonSubTreeElement
    {
        numberKeyPressesToReveal:number;
    }

    export class CommonSubTreeAugmentedTreeBuilder
    {
        static buildTree(fullTreeRoot:Node, commonSubTreeRoot:Node):CommonSubTreeElement
        {
            if(fullTreeRoot == null || commonSubTreeRoot == null)
                throw Error("Both tree roots must be non-null");

            var result:CommonSubTreeElement;

            var numberOfCommonNodes = Traverser.InOrderTraversal(commonSubTreeRoot).length;
            var numberMarkedAsCommon = 0;

            var recursion = (parent:CommonSubTreeElement, node:Node):void => {
                var element:CommonSubTreeElement;
                if(node.nodeType == Node.TEXT_NODE)
                {
                    var newVisualElement = new VisualCommonSubTreeElement();
                    newVisualElement.numberKeyPressesToReveal = (<Text>node).wholeText.length;
                    element = newVisualElement;
                }
                else
                {
                    element = new CommonSubTreeElement();
                }

                element.node = node;
                element.parent = parent;
                element.isInCommonSubTree = numberMarkedAsCommon++ < numberOfCommonNodes;

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