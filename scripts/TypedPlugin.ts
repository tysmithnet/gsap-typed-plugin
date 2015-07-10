///<reference path="TreePrinting.ts"/>
///<reference path="AugmentedTreeBuilding.ts"/>
///<reference path="TreeCommonality.ts"/>
///<reference path="vendor/greensock.d.ts"/>
///<reference path="vendor/jquery.d.ts"/>


import Finder = TreeCommonality.CommonLeftSubTreeFinder;
import TreeBuilder = AugmentedTreeBuilding.AugmentedTreeBuilder;
import Printer = TreePrinting.TreePrinter;

interface IPluginOptions
{
    stopOnCommon:boolean;
    to:any;
}

class NodeArrayConverter
{
    static convertToNode(value:any):Node
    {
        if(value instanceof jQuery)
            return value[0];

        if(value instanceof Node)
            return value;

        if(typeof(value) == 'string')
            return document.createTextNode(value);

        return null;
    }

    static convert(value:any):Node[] | NodeList
    {
        if(value == null)
            return null;

        if(value instanceof Array)
        {
            var newArray = [];
            for(var i = 0; i < value.length; i++)
            {
                var converted = NodeArrayConverter.convertToNode(value[i]);
                if(!converted)
                    return null;
                newArray.push(converted);
            }
            return newArray;
        }

        if(value instanceof NodeList)
            return value;

        if(typeof(value) == 'string')
        {
            var div = document.createElement("div");
            div.innerHTML = value;
            return div.childNodes;
        }

        return null;
    }
}

class TypedPlugin
{
    propName:string = "typed";
    API:number = 2;
    version:string = "0.0.1";
    printer:TreePrinting.TreePrinter;
    target:Node;
    endingValue:Node[] | NodeList;

    init(target:any, value:IPluginOptions, tween: Tween):boolean
    {
        if(!(target instanceof Node))
        {
            return false;
        }

        if(value == null || value.to == undefined)
            return false;

        this.endingValue = NodeArrayConverter.convert(value.to);
        if(this.endingValue == null)
            return false;

        this.target = target;
        var targetClone = document.createElement("div");
        for(var i = 0; i < target.childNodes.length; i++)
            targetClone.appendChild(target.childNodes[i].cloneNode(true));

        var fakeToRoot = document.createElement("div");
        for(var i = 0 ; i < this.endingValue.length; i++)
            fakeToRoot.appendChild(this.endingValue[i].cloneNode(true));

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