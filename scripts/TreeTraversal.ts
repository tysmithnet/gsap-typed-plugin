module TreeTraversal
{
    export class Traverser
    {
        static InOrderTraversal(root:Node):Node[] {
            if(root == null)
                return [];

            var resultStack:Node[] = [];
            var navStack:Node[] = [root];

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