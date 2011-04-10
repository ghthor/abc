$(window).load(function() {
    $('.elementBox.type_a').bind('dragstart', function(e) {
        var dt = e.originalEvent.dataTransfer;
        dt.setData("Text", 'type_a');
        nodeDragged = new NodeA();
        return true;
    }).bind('dragend', function(e) {
        nodeDragged = null;
        return true;
    });

    $('.elementBox.type_b').bind('dragstart', function(e) {
        var dt = e.originalEvent.dataTransfer;
        dt.setData("Text", 'type_b');
        nodeDragged = new NodeB();
        return true;
    }).bind('dragend', function(e) {
        nodeDragged = null;
        return true;
    });

    $('.elementBox.type_c').bind('dragstart', function(e) {
        var dt = e.originalEvent.dataTransfer;
        dt.setData("Text", 'type_c');
        nodeDragged = new NodeC();
        return true;
    }).bind('dragend', function(e) {
        nodeDragged = null;
        return true;
    });

    var NodeBase = function() {
        this.children = [];
        this.changeStack = [];
        this.view = null;
        return this;
    }

    var nodeBase = new NodeBase();
    nodeBase.view = $('div.dropzone ul');
    $.nodeBase = nodeBase;
    var nodeDragged = null;

    NodeBase.dragenter = function(e) {
        if (nodeBase.isValidChild(nodeDragged)) {
            var n = $(this);
            n.removeClass("unsetNode");
            n.addClass("setNode");
            n.addClass("type_a");
        }
        return false;
    };

    NodeBase.dragleave = function(e) {
        var n = $(this);
        n.removeClass("setNode");
        n.addClass("unsetNode");
        n.removeClass("type_a type_b type_c");
        n.text("A");
        return false;
    };

    NodeBase.dragover = function(e) {
        if (nodeBase.isValidChild(nodeDragged)) {
            var n = $(this);
            n.removeClass("unsetNode");
            n.addClass("setNode");
            n.addClass("type_a");
        }
        return false;
    };

    NodeBase.drop = function(e) {
        e.stopPropagation();
        if (nodeBase.isValidChild(nodeDragged)) {
            nodeBase.addChild(nodeDragged);

            // Ensure the View looks correct
            var n = $(this);
            n.removeClass("unsetNode nodeBase");
            n.addClass("setNode");
            n.addClass("type_a");
            var tag = ['<div class="nodeCol roundedBox dropzone">',
                '<ul class="elementList">',
                "<li><div class='unsetNode nodeText roundedBox nodeBase noHandlers'>A</div></li>",
                '</ul></div>'];

            $("body") .append(tag.join(''));
            n.unbind('dragenter dragleave dragover drop');

            nodeDragged.appendChildHtml(n);
            setupHandlers();
        }
        return false;
    };

    NodeBase.prototype.isValidChild = function(child) {
        // nodeType === 'type_a' only Valid Child type
        if (child === null) { return false; }
        if (child.nodeType === undefined) { return false; }
        if (child.nodeType != 'type_a') { return false; }
        return true;
    };

    NodeBase.prototype.addChild = function(child, index) {
        var children = this.children;
        if (!this.isValidChild(child)) { return false; }
        child.parentNode = this;
        if (index === undefined || isNaN(index)) {
            children.push(child);
            // TODO: This might be inefficent
            this.changeStack.push(function() { children.pop(); });
        } else {
            children.splice(index, 0, child);
            // TODO: This might be inefficent
            this.changeStack.push(function() { children.splice(index, 1); });
        }
        return true;
    };
    NodeBase.prototype.commit = function() { this.changeStack = []; }
    NodeBase.prototype.reset = function() {
        var s = this.changeStack;
        // Retrace the Stack of changes
        for(var c = s.pop(); c != undefined; c = s.pop()) { c(); }
    };

    function NodeA() {
        this.children = [null,null];
        this.nodeType = 'type_a';
        return this;
    }

    function typeToText(type) {
        switch(type) {
            case "type_a":
                return 'A';
            case "type_b":
                return 'B';
            case "type_c":
                return 'C';
        }
    }

    NodeA.dragenter = function(e) {
        if (NodeA.isValidChild(nodeDragged)) {
            var n = $(this);
            n.removeClass("unsetNode");
            n.addClass("setNode");

            var type = e.originalEvent.dataTransfer.getData("Text");
            type = type ? type : nodeDragged.nodeType;
            n.addClass(type);

            n.text(typeToText(type));
        }
        return false;
    };

    NodeA.dragleave = function(e) {
        var n = $(this);
        n.removeClass("setNode");
        n.addClass("unsetNode");
        n.removeClass("type_a type_b type_c");
        n.text("A,B,C");
        return false;
    };

    NodeA.dragover = function(e) {
        if (NodeA.isValidChild(nodeDragged)) {
            var n = $(this);
            n.removeClass("unsetNode");
            n.addClass("setNode");

            var type = e.originalEvent.dataTransfer.getData("Text");
            type = type ? type : nodeDragged.nodeType;
            n.addClass(type);

            n.text(typeToText(type));
        }
        return false;
    };

    NodeA.drop = function(e) {
        e.stopPropagation();
        if (NodeA.isValidChild(nodeDragged)) {
            //TODO: Fuck how do I handle this???
            //nodeBase.addChild(nodeDragged);

            // Ensure the View looks correct
            var n = $(this);
            n.removeClass("unsetNode");
            n.addClass("setNode");

            var type = e.originalEvent.dataTransfer.getData("Text");
            type = type ? type : nodeDragged.nodeType;
            n.addClass(type);
            n.text(typeToText(type));

            n.unbind('dragenter dragleave dragover drop');

            nodeDragged.appendChildHtml(n);
            setupHandlers();
        }
        return false;
    };

    NodeA.prototype = new NodeBase();
    NodeA.prototype.appendChildHtml = function(ele) {
        var html = '<li><div class="unsetNode nodeText roundedBox noHandlers">A,B,C</div></li>';
        ele.append(html);
        ele.append(html);
    };

    NodeA.isValidChild = function(child) {
        if (child.nodeType === undefined) { return false; }
        return true;
    }
    NodeA.prototype.isValidChild = NodeA.isValidChild;

    NodeA.prototype.addChild = function(child, index, force) {
        if(!this.isValidChild(child)) { return false; }

        if (index === undefined) {
            for(var i = 0; i < 2; i++) {
                if (this.children[i] != null) {
                    child.parentNode = this;
                    this.children[i] = child;
                    return true;
                }
            }
        } else if ( !isNaN(index) ) {
            if ( this.children[index] != null ) {
                if ( force ) {
                    // Force add child, dropping children[index]
                } else {
                    return false;
                }
            }
        }
        return false;
    };

    function NodeB() {
        this.children = [];
        this.nodeType = 'type_b';
        return this;
    };
    
    NodeB.dragenter = function(e) {
        if (NodeB.isValidChild(nodeDragged)) {
            var n = $(this);
            n.removeClass("unsetNode");
            n.addClass("setNode");

            var type = e.originalEvent.dataTransfer.getData("Text");
            type = type ? type : nodeDragged.nodeType;
            n.addClass(type);

            n.text(typeToText(type));
        }
        return false;
    };

    NodeB.dragleave = function(e) {
        var n = $(this);
        n.removeClass("setNode");
        n.addClass("unsetNode");
        n.removeClass("type_a type_b type_c");
        n.text("B,C");
        return false;
    };

    NodeB.dragover = function(e) {
        if (NodeB.isValidChild(nodeDragged)) {
            var n = $(this);
            n.removeClass("unsetNode");
            n.addClass("setNode");

            var type = e.originalEvent.dataTransfer.getData("Text");
            type = type ? type : nodeDragged.nodeType;
            n.addClass(type);

            n.text(typeToText(type));
        }
        return false;
    };

    NodeB.drop = function(e) {
        e.stopPropagation();
        if (NodeB.isValidChild(nodeDragged)) {
            //TODO: Fuck how do I handle this???
            //nodeBase.addChild(nodeDragged);

            // Ensure the View looks correct
            var n = $(this);
            n.removeClass("unsetNode");
            n.addClass("setNode");

            var type = e.originalEvent.dataTransfer.getData("Text");
            type = type ? type : nodeDragged.nodeType;
            n.addClass(type);
            n.text(typeToText(type));

            n.unbind('dragenter dragleave dragover drop');

            nodeDragged.appendChildHtml(n);
            n.parent().parent().append(NodeB.childHtml);
            setupHandlers();
        }
        return false;
    };

    NodeB.prototype = new NodeBase();
    NodeB.childHtml = '<li><div class="unsetNode nodeText roundedBox noHandlers">B,C</div></li>';
    NodeB.prototype.appendChildHtml = function(ele) {
        ele.append(NodeB.childHtml);
    };
    NodeB.isValidChild = function(child) {
        if (child === undefined) { return false; }
        if (child.nodeType === undefined) { return false; }
        switch(child.nodeType) {
            case 'type_b':
            case 'type_c':
                return true;
                break;
            case 'type_a':
            default:
                return false;
                break;
        }
        return false;
    };
    NodeB.prototype.isValidChild = NodeB.isValidChild;

    NodeB.prototype.addChild = function(child, index, force) {
        if(!this.isValidChild(child)) { return false; }

        if(index === undefined) {
            var children = this.children;
            child.parentNode = this;
            children.push(child);
            this.changeStack.push(function() { children.pop().parentNode = null; });
            return true;
        } else if (!isNaN(index)) {
           if (this.children[index]) {
              if (force) {
                 // Force add child, dropping children[index]
              } else {
                  return false;
              }
           } else {
               child.parentNode = this;
               this.children[index] = child;
               return true;
           }
        }
        return false;
    };

    function NodeC() {
        this.nodeType = 'type_c';
        return this;
    }

    NodeC.prototype = new NodeBase();
    NodeC.prototype.appendChildHtml = function(ele) {
    };
    NodeC.isValidChild = function(child) {
        return false;
    };
    NodeC.prototype.isValidChild = NodeC.isValidChild;

    NodeC.prototype.addChild = function(child) {
        return false;
    };

    var setupHandlers = function() {
        $('div.dropzone > ul.elementList > li > div.unsetNode.nodeBase.noHandlers')
            .bind('dragenter',  NodeBase.dragenter)
            .bind('dragleave',  NodeBase.dragleave)
            .bind('dragover',   NodeBase.dragover)
            .bind('drop',       NodeBase.drop)
            .removeClass('noHandlers');
        $('div.dropzone ul.elementList div.type_a > li > div.unsetNode.noHandlers')
            .bind('dragenter',  NodeA.dragenter)
            .bind('dragleave',  NodeA.dragleave)
            .bind('dragover',   NodeA.dragover)
            .bind('drop',       NodeA.drop)
            .removeClass('noHandlers');
        $('div.dropzone ul.elementList div.type_b > li > div.unsetNode.noHandlers')
            .bind('dragenter',  NodeB.dragenter)
            .bind('dragleave',  NodeB.dragleave)
            .bind('dragover',   NodeB.dragover)
            .bind('drop',       NodeB.drop)
            .removeClass('noHandlers');
    };
    setupHandlers();
});
