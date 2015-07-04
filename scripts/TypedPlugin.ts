///<reference path="TreePrinting.ts"/>
///<reference path="AugmentedTreeBuilding.ts"/>
///<reference path="TreeCommonality.ts"/>

///<reference path="vendor/greensock.d.ts"/>

interface IPluginOptions
{
    stopOnCommon:boolean;
    to:Node;
}

class TypedPlugin
{
    propName:string = "typed";
    API:number = 2;
    version:string = "0.0.1";
    parent:Node;
    currentChild:Node;
    printer:TreePrinting.TreePrinter;

    init(target:any, value:IPluginOptions, tween: Tween):boolean
    {
        if(!(target instanceof Node))
            return false;

        this.parent = target.parentNode;
        this.currentChild = target;
        var commonTree:Node = null;
        if(value.stopOnCommon)
        {
            commonTree = TreeCommonality.CommonLeftSubTreeFinder.findCommonLeftSubTree(target, value.to).leftCommonSubTree;
        }
        var fromAug = new AugmentedTreeBuilding.AugmentedTreeBuilder(target, commonTree).buildTree();
        var toAug = new AugmentedTreeBuilding.AugmentedTreeBuilder(value.to, commonTree).buildTree();
        this.printer = new TreePrinting.TreePrinter(fromAug, toAug);

        return true;
    }

    set(ratio:number):void
    {
        var newContent = this.printer.printTree(ratio);
        this.parent.replaceChild(newContent, this.currentChild);
        this.currentChild = newContent;
    }
}