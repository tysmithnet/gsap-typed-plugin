///<reference path="TreePrinting.ts"/>
///<reference path="AugmentedTreeBuilding.ts"/>
///<reference path="TreeCommonality.ts"/>
///<reference path="vendor/greensock.d.ts"/>
///<reference path="vendor/jquery.d.ts"/>


import Finder = TreeCommonality.CommonLeftSubTreeFinder;
import TreeBuilder = AugmentedTreeBuilding.AugmentedTreeBuilder;
import Printer = TreePrinting.TreePrinter;
import IMatcher = AugmentedTreeBuilding.IMatcher;

interface IPluginOptions
{
    stopOnCommon:boolean;
    to:any;
    customMatchers:IMatcher[];
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

        if(value instanceof jQuery)
            return [value[0]];

        if(value instanceof Node)
            return [value];

        return null;
    }
}

class TypedPlugin
{
    propName:string = "typed";
    API:number = 2;
    version:string = "1.0.2";
    printer:TreePrinting.TreePrinter;
    target:Node;
    endingValue:Node[] | NodeList;

    init(target:any, value:IPluginOptions, tween: Tween):boolean
    {
        this.target = NodeArrayConverter.convertToNode(target);
        if(this.target == null)
            return false;

        if(value == null || value.to == undefined)
            return false;

        this.endingValue = NodeArrayConverter.convert(value.to);
        if(this.endingValue == null)
            return false;

        var targetClone = document.createElement("div");
        for(var i = 0; i < this.target.childNodes.length; i++)
            targetClone.appendChild(this.target.childNodes[i].cloneNode(true));

        var fakeToRoot = document.createElement("div");
        for(var i = 0 ; i < this.endingValue.length; i++)
            fakeToRoot.appendChild(this.endingValue[i].cloneNode(true));

        var commonSubtree:Node = null;
        if(value.stopOnCommon)
        {
            commonSubtree = Finder.findCommonLeftSubTree(targetClone, fakeToRoot).leftCommonSubTree;
        }

        var fromBuilder = new TreeBuilder(targetClone, commonSubtree);
        var toBuilder = new TreeBuilder(fakeToRoot, commonSubtree);
        if(value.customMatchers && value.customMatchers.length)
        {
            for(var i = 0; i < value.customMatchers.length; i++)
            {
                fromBuilder.addMatcher(value.customMatchers[i]);
                toBuilder.addMatcher(value.customMatchers[i]);
            }
        }
        var fromAug = fromBuilder.buildTree();

        var toAug = toBuilder.buildTree();

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