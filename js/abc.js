$(window).load(function() {

    // Bindings for dragstart to the menu on the left
    $('.elementBox.type_a').bind('dragstart', function(e) {
        var dt = e.originalEvent.dataTransfer;
        dt.setData('Text', 'type_a');
        nodeDragged = new NodeA();
        return true;
    }).bind('dragend', function(e) {
        nodeDragged = null;
        return true;
    });

    $('.elementBox.type_b').bind('dragstart', function(e) {
        var dt = e.originalEvent.dataTransfer;
        dt.setData('Text', 'type_b');
        nodeDragged = new NodeB();
        return true;
    }).bind('dragend', function(e) {
        nodeDragged = null;
        return true;
    });

    $('.elementBox.type_c').bind('dragstart', function(e) {
        var dt = e.originalEvent.dataTransfer;
        dt.setData('Text', 'type_c');
        nodeDragged = new NodeC();
        return true;
    }).bind('dragend', function(e) {
        nodeDragged = null;
        return true;
    });

    $('.menu button').click(function() {
        console.log(JSON.stringify($.nodeBase.toJSON()));
    });

    // Convert a type to a Single Letter for Display
    function typeToText(type) {
        switch(type) {
            case 'type_a':
                return 'A';
            case 'type_b':
                return 'B';
            case 'type_c':
                return 'C';
        }
    }

    // NodeBase <- NodeA
    //          <- NodeB
    //          <- NodeC
    var NodeBase = function() {
        this.children = [];
        this.view = null;
        return this;
    }

    var nodeBase = new NodeBase();
    nodeBase.view = $('div.dropzone').parent();
    $.nodeBase = nodeBase;
    var nodeDragged = null;

    NodeBase.dragenter = function(e) {
        if (nodeBase.isValidChild(nodeDragged)) {
            var n = $(this);
            n.removeClass('unsetNode');
            n.addClass('setNode');
            n.addClass('type_a');
        }
        return false;
    };

    NodeBase.dragleave = function(e) {
        var n = $(this);
        n.removeClass('setNode');
        n.addClass('unsetNode');
        n.removeClass('type_a type_b type_c');
        n.text('A');
        return false;
    };

    NodeBase.dragover = function(e) {
        if (nodeBase.isValidChild(nodeDragged)) {
            var n = $(this);
            n.removeClass('unsetNode');
            n.addClass('setNode');
            n.addClass('type_a');
        }
        return false;
    };

    NodeBase.drop = function(e) {
        e.stopPropagation();
        if (nodeBase.isValidChild(nodeDragged)) {
            var n = $(this);

            // Insert nodeDragged into the Node tree/array
            nodeBase.addChild(nodeDragged);
            n.data('node', nodeDragged);
            nodeDragged.view = n;

            // Ensure the View looks correct
            n.removeClass('unsetNode nodeBase');
            n.addClass('setNode');
            n.addClass('type_a');

            // Append another "blank" A Node column
            var tag = ['<div class="elementList nodeCol roundedBox dropzone">',
                '<div class="node unsetNode nodeText roundedBox nodeBase noHandlers">A</div>',
                '</div>'];

            $('body').append(tag.join(''));

            // Unbind Events
            n.unbind('dragenter dragleave dragover drop');

            // Append the "blank" dropzones of nodeDragged's potential children
            nodeDragged.appendChildHtml(n);

            setupHandlers();
        }
        return false;
    };

    NodeBase.JSON = function(node) {
        if (node.children.length == 0) {
            this.dropped = null;
        } else {
            this.dropped = [];
            for(var i = 0; i < node.children.length; i++) {
                this.dropped[i] = node.children[i].toJSON();
            }
        }
        return this;
    };

    NodeBase.prototype.toJSON = function() {
        return new NodeBase.JSON(this);
    };

    NodeBase.prototype.isValidChild = function(child) {
        // nodeType === 'type_a' only Valid Child type
        if (child === null) { return false; }
        if (child.nodeType === undefined) { return false; }
        if (child.nodeType != 'type_a') { return false; }
        return true;
    };

    // TODO: force is unimplemented
    NodeBase.prototype.addChild = function(child, index, force) {
        var children = this.children;
        if (!this.isValidChild(child)) { return false; }
        child.parentNode = this;
        if (index === undefined || isNaN(index)) {
            children.push(child);
        } else {
            children.splice(index, 0, child);
        }
        return true;
    };

    // Returns the index of the child or -1 if it doesn't exist
    NodeBase.prototype.isChild = function(child) {
    };

    function NodeA() {
        this.children = [null,null];
        this.nodeType = 'type_a';
        return this;
    }

    NodeA.dragenter = function(e) {
        if (NodeA.isValidChild(nodeDragged)) {
            var n = $(this);
            n.removeClass('unsetNode');
            n.addClass('setNode');

            var type = e.originalEvent.dataTransfer.getData('Text');
            type = type ? type : nodeDragged.nodeType;
            n.addClass(type);

            n.text(typeToText(type));
        }
        return false;
    };

    NodeA.dragleave = function(e) {
        var n = $(this);
        n.removeClass('setNode');
        n.addClass('unsetNode');
        n.removeClass('type_a type_b type_c');
        n.text('A,B,C');
        return false;
    };

    NodeA.dragover = function(e) {
        if (NodeA.isValidChild(nodeDragged)) {
            var n = $(this);
            n.removeClass('unsetNode');
            n.addClass('setNode');

            var type = e.originalEvent.dataTransfer.getData('Text');
            type = type ? type : nodeDragged.nodeType;
            n.addClass(type);

            n.text(typeToText(type));
        }
        return false;
    };

    NodeA.drop = function(e) {
        e.stopPropagation();
        if (NodeA.isValidChild(nodeDragged)) {
            var n = $(this);

            // Insert nodeDragged into the Node tree/array
            var index = n.parents('div.type_a:first').children('div.node').index(n);
            n.parents('div.type_a:first').data('node').addChild(nodeDragged, index);
            n.data('node', nodeDragged);
            
            // Setup CSS
            n.removeClass('unsetNode');
            n.addClass('setNode');

            var type = e.originalEvent.dataTransfer.getData('Text');
            type = type ? type : nodeDragged.nodeType;
            n.addClass(type);
            n.text(typeToText(type));

            n.unbind('dragenter dragleave dragover drop');

            // Create the dropzones for nodeDragged's potential children
            nodeDragged.appendChildHtml(n);
            setupHandlers();
        }
        return false;
    };

    NodeA.prototype = new NodeBase();

    NodeA.JSON = function(node) {
        this.type = 'A';
        this.children = [null, null];
        for(var i = 0; i < node.children.length; i++) {
            if (node.children[i] != null) {
                this.children[i] = node.children[i].toJSON();
            }
        }
        return this;
    };

    NodeA.prototype.toJSON = function() {
        return new NodeA.JSON(this);
    };

    NodeA.prototype.appendChildHtml = function(ele) {
        var html = '<div class="node unsetNode nodeText roundedBox noHandlers">A,B,C</div>';
        ele.append(html);
        ele.append(html);
    };

    NodeA.isValidChild = function(child) {
        if (child.nodeType === undefined) { return false; }
        return true;
    }
    NodeA.prototype.isValidChild = NodeA.isValidChild;

    // TODO: force is unimplemented
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
            } else {
                child.parentNode = this;
                this.children[index] = child;
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
            n.removeClass('unsetNode');
            n.addClass('setNode');

            var type = e.originalEvent.dataTransfer.getData('Text');
            type = type ? type : nodeDragged.nodeType;
            n.addClass(type);

            n.text(typeToText(type));
        }
        return false;
    };

    NodeB.dragleave = function(e) {
        var n = $(this);
        n.removeClass('setNode');
        n.addClass('unsetNode');
        n.removeClass('type_a type_b type_c');
        n.text('B,C');
        return false;
    };

    NodeB.dragover = function(e) {
        if (NodeB.isValidChild(nodeDragged)) {
            var n = $(this);
            n.removeClass('unsetNode');
            n.addClass('setNode');

            var type = e.originalEvent.dataTransfer.getData('Text');
            type = type ? type : nodeDragged.nodeType;
            n.addClass(type);

            n.text(typeToText(type));
        }
        return false;
    };

    NodeB.drop = function(e) {
        e.stopPropagation();
        if (NodeB.isValidChild(nodeDragged)) {
            // add nodeDragged into the tree/array
            var n = $(this);
            n.parents("div.type_b:first").data('node').addChild(nodeDragged);
            n.data('node', nodeDragged);

            // Setup the css
            n.removeClass('unsetNode');
            n.addClass('setNode');

            var type = e.originalEvent.dataTransfer.getData('Text');
            type = type ? type : nodeDragged.nodeType;
            n.addClass(type);
            n.text(typeToText(type));

            n.unbind('dragenter dragleave dragover drop');

            // Create some more Dom elements
            nodeDragged.appendChildHtml(n);
            n.parent().append(NodeB.childHtml);
            setupHandlers();
        }
        return false;
    };

    NodeB.prototype = new NodeBase();

    
    NodeB.JSON = function(node) {
        this.type = 'B';
        if(node.children.length == 0) {
            this.children = null;
        } else {
            this.children = [];
            for(var i = 0; i < node.children.length; i++) {
                if (node.children[i] != null) {
                    this.children[i] = node.children[i].toJSON();
                }
            }
        }
        return this;
    };

    NodeB.prototype.toJSON = function() {
        return new NodeB.JSON(this);
    };

    NodeB.childHtml = '<div class="node unsetNode nodeText roundedBox noHandlers">B,C</div>';
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

    // TODO: force is unimplemented
    NodeB.prototype.addChild = function(child, index, force) {
        if(!this.isValidChild(child)) { return false; }

        if(index === undefined) {
            var children = this.children;
            child.parentNode = this;
            children.push(child);
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

    NodeC.JSON = function(node) {
        this.type = 'C';
        return this;
    };

    NodeC.prototype.toJSON = function() {
        return new NodeC.JSON(this);
    };

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
        $('div.dropzone.elementList > div.unsetNode.nodeBase.noHandlers')
            .bind('dragenter',  NodeBase.dragenter)
            .bind('dragleave',  NodeBase.dragleave)
            .bind('dragover',   NodeBase.dragover)
            .bind('drop',       NodeBase.drop)
            .removeClass('noHandlers');
        $('div.dropzone.elementList div.type_a > div.unsetNode.noHandlers')
            .bind('dragenter',  NodeA.dragenter)
            .bind('dragleave',  NodeA.dragleave)
            .bind('dragover',   NodeA.dragover)
            .bind('drop',       NodeA.drop)
            .removeClass('noHandlers');
        $('div.dropzone.elementList div.type_b > div.unsetNode.noHandlers')
            .bind('dragenter',  NodeB.dragenter)
            .bind('dragleave',  NodeB.dragleave)
            .bind('dragover',   NodeB.dragover)
            .bind('drop',       NodeB.drop)
            .removeClass('noHandlers');
    };

    // Setup the initial dropzone
    setupHandlers();
});
