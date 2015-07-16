# gsap-typed-plugin
A Greensock plugin that mimics the typing of words.  It also supports arbitrary HTML content.

Installation
------------
Include TweenMax or TweenLite.

Then include gsap-typed-plugin.js like so:

    <script src="TweenLite.js"></script>
    <script src="gsap-typed-plugin.js"></script>

Usage
-----
You must have TweenMax or TweenLite set up first.
Optionally, you can use TimelineMax or TimelineLite as well.

The target you pass in will have its content replaced as the animation takes place.
For example, the following will replace the text inside a div after 3 seconds.

    TweenMax.to('#target', 3, {typed:{to:"the div will have this content now", stopOnCommon:false}});

You can pass in HTML by passing in an HTMLElement or a jQuery element:

    TweenLite.to('#target', 1, {typed:{to:$('<strong>').text('hi'), stopOnCommon:true}});


You can also pass in HTML as a string if it is not part of an array:

    TweenLite.to('#target', 1, {typed:{to:["<strong>this is not bold and renders the start and end tags</strong>"], stopOnCommon:true}});
    TweenLite.to('#target', 1, {typed:{to:"<strong>this IS bold, notice no []</strong>", stopOnCommon:true}});

Setting `stopOnCommon` to `true` will stop erasing characters when it reaches content that is common to the start and the end.

You can easily make a cursor by using some css and 2 spans:

    .blinking-cursor {
        font-weight: 100;
        color: #2E3D48;
        -webkit-animation: 1s blink step-end infinite;
        -moz-animation: 1s blink step-end infinite;
        -ms-animation: 1s blink step-end infinite;
        -o-animation: 1s blink step-end infinite;
        animation: 1s blink step-end infinite;
    }
    
    @keyframes "blink" {
        from, to {
            color: transparent;
        }
        50% {
            color: black;
        }
    }
    
    @-moz-keyframes blink {
        from, to {
            color: transparent;
        }
        50% {
            color: black;
        }
    }
    
    @-webkit-keyframes "blink" {
        from, to {
            color: transparent;
        }
        50% {
            color: black;
        }
    }
    
    @-ms-keyframes "blink" {
        from, to {
            color: transparent;
        }
        50% {
            color: black;
        }
    }
    
    @-o-keyframes "blink" {
        from, to {
            color: transparent;
        }
        50% {
            color: black;
        }
    }
    
...and then...

    TweenLite.to('#b', 5, {typed:{to: "this will have a cursor in the caret position", stopOnCommon:true}});

... and finally...

    <div id="a"><span id="b"></span><span class="blinking-cursor">|</span></div>

You can provide your own matching and rendering functions to customize the way content is displayed. A good example of this
is rendering icons like those from font awesome or from glyphicons.  The following illustrates how you could display icons
as if they were characters.

    
    var matcher = {
    isMatch:function(node)
    {
       return node instanceof HTMLElement && node.classList.contains('fa');
    },
    getDisplayStrategy: function(node){
       return {
           displayNode: function(node, numKeyPresses){
               return node;
           },
           numberKeyPressesToReveal: 1
       };
    }
    };
    
    TweenMax.to('#target', 3, {typed:{to:"<span class='fa fa-user'></span><span class='fa fa-heart'></span><span class='fa fa-user'></span>", stopOnCommon:false, customMatchers:[matcher]}, ease: Linear.easeNone});
    
You provide an object that exposes 2 properties: `isMatch` and `getDisplayStrategy`.  `isMatch` is a function that
should return `true` if the matcher is capable of processing the `Node` passed to it, and false if it cannot.  `getDisplayStrategy`
is a function that takes a `Node` and returns an object.  The object it returns should have 2 properties: `displayNode`
and `numberKeyPressesToReveal`.  `displayNode` is a function that takes a `Node` an integer.  The `Node` is the DOM element
that was matched in `isMatch`.  `numKeyPresses` is how the number of "key presses" that should be consumed on this node.  It will
be a number between 0 and `numberKeyPressesToReveal`.  `numKeyPressesToReveal` lets the plugin know how many keypresses it takes to
completely reveal this node.  

Options
-------
