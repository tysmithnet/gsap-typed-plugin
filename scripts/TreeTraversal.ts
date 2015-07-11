module TreeTraversal
{
    interface IHasChildNodes
    {
        childNodes:any;
    }
    export class Traverser
    {
        static getInorderTraversal<T extends IHasChildNodes>(root:T):T[] {
            if(root == null)
                return [];

            var resultStack:T[] = [];
            var navStack:T[] = [root];

            while(navStack.length > 0) {
                var top = navStack.pop();
                resultStack.push(top);
                for(var i = top.childNodes.length - 1; i >= 0; i--)
                {
                    navStack.push(top.childNodes[i]);
                }
            }

            return resultStack;
        }
    }


}