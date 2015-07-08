module NodeCommonality
{
    export class NodeComparisonStrategy
    {
        static findCommonSubString(lhs:string, rhs:string):string
        {
            if(lhs == null || rhs == null)
                return null;

            var result = "";
            for(var i = 0; i < Math.min(lhs.length, rhs.length); i++)
            {
                if(lhs.charAt(i) == rhs.charAt(i))
                    result = result + lhs.charAt(i);
                else
                    break;
            }

            return result;
        }

        static areEqual(left:Node, right:Node):boolean
        {
            if(left == null && right == null)
                return true;

            if((left == null && right != null) || (left != null && right == null))
                return false;

            if(left.nodeType != right.nodeType)
                return false;

            if(left.nodeName != right.nodeName)
                return false;

            if(left.nodeValue != right.nodeValue)
                return false;

            if(!NodeComparisonStrategy.areNodeAttributesEqual(left.attributes, right.attributes))
                return false;

            return true;
        }

        static areNodeAttributesEqual(left:NamedNodeMap, right:NamedNodeMap):boolean
        {
            if(left == null && right == null)
                return true;

            if(left == null && right != null)
                return false;

            if(right == null && left != null)
                return false;

            if(left.length != right.length)
                return false;

            for(var i = 0; i < left.length; i++)
            {
                var l:Attr = left.item(i);
                var r:Attr = right.getNamedItem(l.name);

                if(l.name == 'class' && r && r.name == 'class') {
                    var lClasses = l.value.split(/\s+/).sort();
                    var rClasses = r.value.split(/\s+/).sort();
                    if(lClasses.length != rClasses.length)
                        return false;

                    for(var j = 0; j < lClasses.length; j++)
                        if(lClasses[j] != rClasses[j])
                            return false;

                    continue;
                }

                if(r == null || l.value != r.value)
                    return false;
            }

            return true;
        }
    }
}