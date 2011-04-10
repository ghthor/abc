$(window).load(function() {
    $('.elementBox.type_a').bind('dragstart', function(e) {
        var dt = e.originalEvent.dataTransfer;
        dt.setData("nodeType", 'a');
        nodeDragged = new NodeA();
        return true;
    }).bind('dragend', function(e) {
        nodeDragged = null;
        return true;
    });


    $('.elementBox.type_b').bind('dragstart', function(e) {
        var dt = e.originalEvent.dataTransfer;
        dt.setData("nodeType", 'b');
        nodeDragged = null;
        return true;
    });

    var setupHandlers = function() {
        $('#dropzone ul.elementList li div.unsetNode').bind('dragenter', function(e) {
            if (nodeBase.isValidChild(nodeDragged)) {
                var n = $(this);
                n.removeClass("unsetNode");
                n.addClass("elementBox");
                n.addClass("type_a");
            }
            return true;
        }).bind('dragleave', function(e) {
            var dt = e.originalEvent.dataTransfer;
            var nodeType = dt.getData("nodeType");
            if (nodeType === 'a') {
                var n = $(this);
                n.addClass("unsetNode");
                n.removeClass("elementBox");
                n.removeClass("type_a");
            }
            return true;
        }).bind('dragover', function(e) {
            return false;
        }).bind('drop', function(e) {
            e.stopPropagation();
            if (nodeBase.isValidChild(nodeDragged)) {
                nodeBase.addChild(nodeDragged);
                $(this).parent()
            .append("<li><div class='unsetNode nodeText roundedBox'>A</div></li");
                $(this).unbind('dragenter dragleave dragover drop');
                setupHandlers();
            }
            return false;
        });
    };
    setupHandlers();

    var NodeBase = function() {
        this.children = [];
        this.changeStack = [];
        return this;
    }

    var nodeBase = new NodeBase();
    $.nodeBase = nodeBase;
    var nodeDragged = null;

    NodeBase.prototype.isValidChild = function(child) {
        // nodeType === 'a' only Valid Child type
        if (child === null) { return false; }
        if (child.nodeType === undefined) { return false; }
        if (child.nodeType != 'a') { return false; }
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
        this.nodeType = 'a';
        return this;
    }
    NodeA.prototype = NodeBase;
    NodeA.prototype.isValidChild = function(child) {
        if (child.nodeType === undefined) { return false; }
        return true;
    }
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



});
