# inrt.js

inrt.js is a lightweight and simple class that gives you the ability to apply inertial scrolling a container. I wanted to create a inertial wrapper class that didn't require the use of external libraries such as jQuery.

### Basic Usage

inrt.js is very easy to add to your page, below shows the basics.

    <head>
      <script type="text/javascript" src="js/inrt.js"></script>
    </head>
    
    <div id="viewport">
      <!-- content goes here -->
    </div>
    
    <script type="text/javascript">
      new inrt.scroller({elementId: "viewport"});
    </script>
    
### Options

inrt.js comes with some configurable options, so you can tweak them to suit your needs. These are as follows:

1. invertMovement [defaults to false]
    
2. defaultDrag [defaults to 0.9] - how fast the control will come to a stop (lower = longer)
    
3. maxScrollSpeed [defaults to 40] - the max speed the control can travel in either direction


