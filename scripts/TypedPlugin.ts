///<reference path="TreePrinting.ts"/>
///<reference path="AugmentedTreeBuilding.ts"/>
///<reference path="TreeCommonality.ts"/>

///<reference path="vendor/greensock.d.ts"/>

import Finder = TreeCommonality.CommonLeftSubTreeFinder;
import TreeBuilder = AugmentedTreeBuilding.AugmentedTreeBuilder;
import Printer = TreePrinting.TreePrinter;

interface IPluginOptions
{
    stopOnCommon:boolean;
    to:Node[]
}

class TypedPlugin
{
    propName:string = "typed";
    API:number = 2;
    version:string = "0.0.1";
    printer:TreePrinting.TreePrinter;
    target:Node;

    init(target:any, value:IPluginOptions, tween: Tween):boolean
    {
        if(!(target instanceof Node))
        {
            return false;
        }

        this.target = target;
        var targetClone = document.createElement("div");
        for(var i = 0; i < target.childNodes.length; i++)
            targetClone.appendChild(target.childNodes[i].cloneNode(true));

        var fakeToRoot = document.createElement("div");
        for(var i = 0 ; i < value.to.length; i++)
            fakeToRoot.appendChild(value.to[i].cloneNode(true));

        var commonSubtree:Node = null;
        if(value.stopOnCommon)
        {
            commonSubtree = Finder.findCommonLeftSubTree(targetClone, fakeToRoot).leftCommonSubTree;
        }

        var fromAug = new TreeBuilder(targetClone, commonSubtree).buildTree();
        var toAug = new TreeBuilder(fakeToRoot, commonSubtree).buildTree();
        this.printer = new Printer(fromAug, toAug);

        return true;
    }

    set(ratio:number):void
    {
        var newContent = this.printer.printTree(ratio);
        while(this.target.firstChild)
            this.target.removeChild(this.target.firstChild);

        while(newContent.firstChild)
            this.target.appendChild(newContent.firstChild);
    }
}