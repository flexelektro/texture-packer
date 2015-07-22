var BinPackingAlgorithm = function(blocks,w,h){
    this.root = {x:0,y:0,w:w,h:h}

    this.fit = function(blocks){
        var n,node,block;
        for(n = 0; n < blocks.length;n++){
            block = blocks[n];
            if(node = this.findNode(this.root,block.width,block.height)){
                block.fit = this.splitNode(node, block.width,block.height);
                block.x = block.fit.x;
                block.y = block.fit.y;
            }else{
                this.root = this.growForNode(this.root,block.width,block.height);
                if(node = this.findNode(this.root,block.width,block.height)){
                    block.fit = this.splitNode(node, block.width,block.height);
                    block.x = block.fit.x;
                    block.y = block.fit.y;
                }
            }
        }
        return blocks;
    }

    this.findNode = function(root,w,h){
        if (root.used)
            return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
        else if ((w <= root.w) && (h <= root.h))
            return root;
        else
            return null;
    }

    this.splitNode = function(node,w,h){
        node.used = true;
        node.down  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h };
        node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h          };
        return node;
    }

    this.growForNode = function(root,w,h){

        var canGrowRight = (h <= root.h);
        var canGrowDown = (w <= root.w);

        var shouldGrowRight = canGrowRight && ( ( root.w + w ) <= root.h);
        var shouldGrowDown = canGrowDown && ((root.h + h ) <= root.w);
        var node = root;
        if(shouldGrowRight){
            return this.growRight(node,w,h);
        }else if(shouldGrowDown){
            return this.growDown(node,w,h);
        }else if(canGrowRight){
            return this.growRight(node,w,h);
        }else if(canGrowDown){
            return this.growDown(node,w,h);
        }else{
            return null;
        }
    }

    this.growRight = function(node,w,h){
        var newNode = {
            "used":true,
            "x":0,
            "y":0,
            "w": (node.w + w),
            "h": node.h,
            "down" : node,
            "right" : {
                "x":node.w+node.x,
                "y":node.y,
                "w":w,
                "h":node.h
            }
        };
        return newNode
    }

    this.growDown = function(node,w,h){
        var newNode = {
            "used":true,
            "x":0,
            "y":0,
            "w": (node.w),
            "h": (node.h+h),
            "down" : {
                "x":node.x,
                "y":node.y + node.h,
                "w":node.w,
                "h": h
            },
            "right" : node
        };
        return newNode;
    }

    var theBlocks = this.fit(blocks);
    return {
        "elements":theBlocks,
        "size":{
            width:this.root.w,
            height:this.root.h
        }
    }
}

module.exports = BinPackingAlgorithm;