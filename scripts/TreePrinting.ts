///<reference path="AugmentedTreeBuilding.ts"/>
///<reference path="TreeTraversal.ts"/>

import TreeElement = AugmentedTreeBuilding.TreeElement;
import TreeTraverser = TreeTraversal.Traverser;
module TreePrinting
{
    export class TreePrinter
    {
        private fromTree:TreeElement;
        private fromTreegetInorderTraversal:TreeElement[];
        private toTree:TreeElement;
        private toTreegetInorderTraversal:TreeElement[];
        private numBackSpacesUntilCommon:number;
        private numKeyPressesFromCommonUntilFinish:number;

        constructor(fromTree:TreeElement, toTree:TreeElement)
        {
            this.fromTree = fromTree;
            this.toTree = toTree;
            this.fromTreegetInorderTraversal = TreeTraverser.getInorderTraversal(fromTree);
            this.toTreegetInorderTraversal = TreeTraverser.getInorderTraversal(toTree);
            this.calculateNumberOfBackspacesUntilCommon();
            this.calculateNumberOfKeyPressesUntilFinish();
        }

        private calculateNumberOfBackspacesUntilCommon():void
        {
            var inOrderTraversal = TreeTraverser.getInorderTraversal(this.fromTree);
            var runningTotal = 0;
            for(var i = inOrderTraversal.length - 1; i >= 0; i--)
            {
                var element = inOrderTraversal[i];
                if(element.isInCommonSubTree)
                    break;
                else
                    runningTotal += element.getNumberKeyPressesToReveal();
            }
            this.numBackSpacesUntilCommon = runningTotal;
        }

        private getTotalKeyPressCount():number
        {
            return this.numBackSpacesUntilCommon + this.numKeyPressesFromCommonUntilFinish;
        }

        private calculateNumberOfKeyPressesUntilFinish():void
        {
            var inOrderTraversal = TreeTraverser.getInorderTraversal(this.toTree);
            var runningTotal = 0;
            for(var i = 0; i < inOrderTraversal.length; i++)
            {
                var element = inOrderTraversal[i];
                if(element.isInCommonSubTree)
                    continue;
                else
                    runningTotal += element.getNumberKeyPressesToReveal();
            }
            this.numKeyPressesFromCommonUntilFinish = runningTotal;
        }

        private showRemainingBackspaceContent(numberOfBackspaces): Node
        {
            var clone = this.fromTree.node.cloneNode(true);
            var cloneTraversal = TreeTraversal.Traverser.getInorderTraversal(clone);
            var runningTotal = 0;
            for(var i = this.fromTreegetInorderTraversal.length - 1; i >= 0; i--)
            {
                var element = this.fromTreegetInorderTraversal[i];
                var node = cloneTraversal[i];
                if(element.getNumberKeyPressesToReveal() + runningTotal < numberOfBackspaces)
                {
                    node.parentNode.removeChild(node);
                    runningTotal += element.getNumberKeyPressesToReveal();
                }
                else
                {
                    var parent = node.parentNode;
                    var newNode = element.displayStrategy.displayNode(node,
                        element.getNumberKeyPressesToReveal() - (numberOfBackspaces - runningTotal));

                    if(parent != null)
                    {
                        parent.removeChild(node);
                        if(newNode.nodeType != Node.TEXT_NODE || (newNode.nodeType == Node.TEXT_NODE && (<Text>newNode).textContent != ""))
                            parent.appendChild(newNode);
                    }
                    else
                    {
                        return newNode;
                    }
                    break;
                }
            }
            return clone;
        }

        private showRemainingTypedContent(numKeyPresses):Node
        {
            var clone = this.toTree.node.cloneNode(false);
            var currentNode = clone;
            var navStack: [{element:TreeElement; childIndex:number}] = [{element:this.toTree, childIndex:-1}];
            var runningTotal = 0;

            if(numKeyPresses == 0)
                return this.toTree.node;

            while(navStack.length)
            {
                var top = navStack[navStack.length - 1];
                if(top.element.isInCommonSubTree)
                {
                    if(navStack.length > 1 && top.childIndex == -1)
                    {
                        var newNode = top.element.node.cloneNode(false);
                        currentNode.appendChild(newNode);
                        currentNode = newNode;
                    }

                    if(++top.childIndex < top.element.childNodes.length)
                        navStack.push({
                            element:top.element.childNodes[top.childIndex],
                            childIndex: -1});
                    else
                    {
                        navStack.pop();
                        currentNode = currentNode.parentNode;
                    }
                }
                else
                {
                    if(runningTotal + top.element.getNumberKeyPressesToReveal() < numKeyPresses)
                    {
                        if(navStack.length > 1 && top.childIndex == -1)
                        {
                            var newNode = top.element.node.cloneNode(false);
                            currentNode.appendChild(newNode);
                            currentNode = newNode;
                        }

                        if(++top.childIndex < top.element.childNodes.length)
                            navStack.push({
                                element:top.element.childNodes[top.childIndex],
                                childIndex: -1});
                        else
                        {
                            navStack.pop();
                            currentNode = currentNode.parentNode;
                        }

                        runningTotal += top.element.getNumberKeyPressesToReveal();
                    }
                    else
                    {
                        var newNode = top.element.displayStrategy.displayNode(top.element.node,
                            numKeyPresses - runningTotal);

                        if(navStack.length < 2)
                            return newNode;
                        else
                            currentNode.appendChild(newNode);

                        break;
                    }
                }
            }
            return clone;
        }

        static normalizeTree(root:Node):void
        {
            if(!root)
                return;

            root.normalize();
            for(var i = 0; i < root.childNodes.length; i++)
                TreePrinter.normalizeTree(root.childNodes[i]);
        }

        printTree(percentCompleteToDisplay:number):Node
        {
            percentCompleteToDisplay = Math.min(1, percentCompleteToDisplay);
            percentCompleteToDisplay = Math.max(0, percentCompleteToDisplay);
            var total = this.getTotalKeyPressCount();
            var keyPressesFromPercent = (total * percentCompleteToDisplay) | 0;
            var result: Node;
            if(percentCompleteToDisplay != 1 && keyPressesFromPercent <= this.numBackSpacesUntilCommon)
                result = this.showRemainingBackspaceContent(keyPressesFromPercent);
            else
                result = this.showRemainingTypedContent(keyPressesFromPercent - this.numBackSpacesUntilCommon);

            TreePrinter.normalizeTree(result);
            return result;
        }
    }
}