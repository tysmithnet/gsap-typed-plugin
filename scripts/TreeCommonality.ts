///<reference path="NodeCommonality.ts"/>

module TreeCommonality
{
    export class CommonLeftSubTree
    {
        leftCommonSubTree: Node;

        constructor(){
            this.leftCommonSubTree = null;
        }
    }

    export class CommonLeftSubTreeFinder
    {
        static findCommonLeftSubTree(left:Node, right:Node):CommonLeftSubTree{
            if(left == null || right == null)
                throw new Error("You must provide non null values for parameters")

            var compareStrategy = NodeCommonality.NodeComparisonStrategy.areEqual;

            var result = new CommonLeftSubTree();

            var differenceHasBeenFound = false;

            var leftResultStack:Node[];
            var rightResultStack:Node[];

            var leftNavStack:Node[] = [left];
            var rightNavStack:Node[] = [right];

            var leftVisited:Node[] = [];

            while(!differenceHasBeenFound)
            {
                var topL:Node;
                var topR:Node;

                topL = leftNavStack[leftNavStack.length - 1];
                topR = rightNavStack[rightNavStack.length - 1];

                if(leftVisited.indexOf(topL) > -1 || compareStrategy(topL, topR))
                {
                    var lClone = topL.cloneNode(false);
                    var rClone = topR.cloneNode(false);

                    if(leftVisited.indexOf(topL) == -1) {
                        if (!leftResultStack) {
                            result.leftCommonSubTree = lClone;
                            leftResultStack = [lClone];
                            rightResultStack = [rClone];
                        }
                        else {
                            leftResultStack[leftResultStack.length - 1].appendChild(lClone);
                            rightResultStack[rightResultStack.length - 1].appendChild(rClone);
                            leftResultStack.push(lClone);
                            rightResultStack.push(rClone);
                        }
                        leftVisited.push(topL);
                    }

                    var lrsTop = leftResultStack[leftResultStack.length - 1];
                    var rrsTop = rightResultStack[rightResultStack.length - 1];

                    if(lrsTop.childNodes.length < topL.childNodes.length &&
                        rrsTop.childNodes.length < topR.childNodes.length)
                    {
                        leftNavStack.push(topL.childNodes[lrsTop.childNodes.length]);
                        rightNavStack.push(topR.childNodes[rrsTop.childNodes.length]);
                    }
                    else
                    {
                        if(topL.childNodes.length != topR.childNodes.length)
                            differenceHasBeenFound = true;
                        else
                        {
                            leftNavStack.pop();
                            rightNavStack.pop();
                            leftResultStack.pop();
                            rightResultStack.pop();
                            if(leftNavStack.length == 0)
                                differenceHasBeenFound = true;
                        }
                    }
                }
                else
                {
                    differenceHasBeenFound = true;
                }
            }

            return result;
        }
    }
}