# Rectpack
a very fast implementation of a bin-packing algorithm. Good for spritesheets or atlastextures.
Its data-based not DOM-based, so you can use it for DOM-objects as well as for canvas ...

##Demo

[DEMO on Website](http://flexelektro.github.io/texture-packer/)

##Usage

Download the [minified library](https://raw.githubusercontent.com/flexelektro/texture-packer/master/dist/rectpack.min.js) and include it in your html.

```html
<script src="js/two.min.js"></script>
```

It can als be installed via `npm`

```js
npm install --save recter.js
```

Create a your, by calling the global Function **RP** :

```js
var rectdata = RP(objectsData,options);
```

where **objectsDatas** is basicaly an array of objects which have tow fields mandatory:
```js
singleObject = {
    width:  number
    height: number
    ownDataOrObjects: any 
}
```

you will get back the generated bin-packed-data, where elements are basically your inputElemnts with attached x (left) and y (top) values :


```js
{
    atlasSize:{
        height:number,
        width:number
    },
    elements:[
        {
            width:  number
            height: number
            ownDataOrObjects: any,
            x: number,
            y: number
        },
        {
            width:  number
            height: number
            ownDataOrObjects: any,
            x: number,
            y: number
        }
        ...
    ]
}
```

##example


```js 
    var elements = [];
    for(var i = 0; i < 600; i++){
       var el =  document.createElement("div");
            el.style.width = (3 +Math.random()*30)+"px";
            el.style.height = (3 +Math.random()*30)+"px";
            el.style.backgroundColor = "rgba("+makeRandom255()+")";
            el.style.position = "absolute";
        someHTMLElement.appendChild(el);
            elements.push({
                "el":el,
                "id":i,
                "width":el.style.width,
                "height":el.style.height
            });
        }
    var els = RP(elements,{
        padding:2
    });
    console.log(els);
    els.elements.forEach(function(obj){ 
        obj.el.style.top = obj.y + "px";
        obj.el.style.left = obj.x + "px";
    });
```

for a small Demo have a look here: [DEMO](http://flexelektro.github.io/texture-packer)



