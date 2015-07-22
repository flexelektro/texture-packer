
var example1 = {
    where:null,
    elements:[],
    els:[],
    sel:null,
    xthis:null,
    generateElements:function(){
        "use strict";
        for(var i = 0; i < 600; i++){
            var el = document.createElement("div");
            el.style.width = (3 +Math.random()*30)+"px";
            el.style.height = (3 +Math.random()*30)+"px";
            el.style.backgroundColor = "rgba("+makeRandom255()+")";
            el.style.position = "absolute";
            el.style.border = "0px solid red";
            //el.innerHTML = ""+i;

            this.where.appendChild(el);
            this.elements.push({
                "el":el,
                "id":i,
                "width":el.style.width,
                "height":el.style.height
            });
        }
    },
    clearSurface:function(){
        "use strict";
        var next;
        while(next = this.where.firstChild){
            this.where.removeChild(next)
        }
    },
    positionateElements:function(){
        "use strict";

        console.log(this.els);

        this.els.elements.forEach(function(obj){
            //console.log(obj);
            obj.el.style.top = obj.y + "px";
            obj.el.style.left = obj.x + "px";
        });

        this.where.style.width = "100%";
        this.where.style.height = this.els.atlasSize.height + 50 + "px";
    },

    useRP: function(){
        "use strict";
        var pad = this.sel.value;
        this.els = RP(this.elements,{
            padding:pad

        });
    },

    changeInit : function(e){
        var that = example1;
        that.init(that.where,that.sel);
    },

    listener: function(){
        "use strict";
        var that = this;
        this.sel.removeEventListener("change",that.changeInit);
        this.sel.addEventListener("change",that.changeInit);
    },

    init:function(where,sel){
        "use strict";
        this.xthis = this;
        this.elements = [];
        this.els = [];
        this.where = where;
        this.sel = sel;
        this.clearSurface();
        this.generateElements();
        this.useRP();
        this.positionateElements();
        this.listener();
    }
}

// UTILITY

function makeRandom255(){
    return (parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + ",1");
}


var example1box = document.getElementById("example1box");
var example1sel = document.getElementById("ex1sel");
example1.init(example1box,example1sel);