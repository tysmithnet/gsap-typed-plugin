///<reference path="AugmentedTreeBuilding.ts"/>
///<reference path="TreeTraversal.ts"/>

import TreeElement = AugmentedTreeBuilding.TreeElement;
import TreeTraverser = TreeTraversal.Traverser;
module TreePrinting
{
    export class TreePrinter
    {
        private fromTree:TreeElement;
        private fromTreeInOrderTraversal:TreeElement[];
        private toTree:TreeElement;
        private toTreeInOrderTraversal:TreeElement[];
        private numBackSpacesUntilCommon:number;
        private numKeyPressesFromCommonUntilFinish:number;

        constructor(fromTree:TreeElement, toTree:TreeElement)
        {
            this.fromTree = fromTree;
            this.toTree = toTree;
            this.fromTreeInOrderTraversal = TreeTraverser.InOrderTraversal(fromTree);
            this.toTreeInOrderTraversal = TreeTraverser.InOrderTraversal(toTree);
            this.calculateNumberOfBackspacesUntilCommon();
            this.calculateNumberOfKeyPressesUntilFinish();
        }

        private calculateNumberOfBackspacesUntilCommon():void
        {
            var inOrderTraversal = TreeTraverser.InOrderTraversal(this.fromTree);
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
            var inOrderTraversal = TreeTraverser.InOrderTraversal(this.toTree);
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
            var cloneTraversal = TreeTraversal.Traverser.InOrderTraversal(clone);
            var runningTotal = 0;
            for(var i = this.fromTreeInOrderTraversal.length - 1; i >= 0; i--)
            {
                var element = this.fromTreeInOrderTraversal[i];
                var node = cloneTraversal[i];
                if(element.getNumberKeyPressesToReveal() + runningTotal < numberOfBackspaces)
                {
                    node.parentNode.removeChild(node);
                    runningTotal += element.getNumberKeyPressesToReveal();
                }
                else
                {
                    if(node.nodeType != Node.TEXT_NODE)
                        return clone;
                    var text = (<Text>element.node).wholeText;
                    var lengthOfRemainingText = text.length - (numberOfBackspaces - runningTotal);
                    var display = text.substring(0, lengthOfRemainingText);
                    var parent = node.parentNode;
                    parent.removeChild(node);
                    if(display != "")
                        parent.appendChild(document.createTextNode(display));
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
                        var text = (<Text>top.element.node).wholeText;
                        var display = text.substring(0, numKeyPresses - runningTotal);
                        var textnode = document.createTextNode(display);

                        if(navStack.length < 2)
                            return textnode;
                        else
                            currentNode.appendChild(textnode);

                        break;
                    }
                }
            }
            return clone;
        }

        printTree(percentCompleteToDisplay:number):Node
        {
            percentCompleteToDisplay = Math.min(1, percentCompleteToDisplay);
            percentCompleteToDisplay = Math.max(0, percentCompleteToDisplay);
            var total = this.getTotalKeyPressCount();
            var keyPressesFromPercent = (total * percentCompleteToDisplay) | 0;
            if(percentCompleteToDisplay != 1 && keyPressesFromPercent <= this.numBackSpacesUntilCommon)
                return this.showRemainingBackspaceContent(keyPressesFromPercent);
            else
                return this.showRemainingTypedContent(keyPressesFromPercent - this.numBackSpacesUntilCommon);
        }
    }
}