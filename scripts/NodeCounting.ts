module NodeCounting
{
    export class NodeCountingResult
    {
        shouldCount:boolean;
        numberKeyPresses:number;

        constructor(shouldCount:boolean, numberKeyPresses:number) {
            this.shouldCount = shouldCount;
            this.numberKeyPresses = numberKeyPresses;
        }
    }

    export class NodeCountingStrategy
    {
        static shouldCountNode(node:Node):NodeCountingResult
        {
            var result = new NodeCountingResult(false, 0);
            if(node.nodeType == Node.TEXT_NODE)
            {
                result.shouldCount = true;
                result.numberKeyPresses = (<Text>node).wholeText.length;
            }
            return result;
        }
    }
}