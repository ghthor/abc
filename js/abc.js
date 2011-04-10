$(window).load(function() {
    $('.elementBox.type_a').bind('dragstart', function(e) {
        var dt = e.originalEvent.dataTransfer;
        dt.setData("nodeType", 'a');
        return true;
    });

    $('.elementBox.type_b').bind('dragstart', function(e) {
        var dt = e.originalEvent.dataTransfer;
        dt.setData("nodeType", 'b');
        return true;
    });

    $('#dropzone ul.elementList li div').bind('dragenter', function(e) {
        e.stopPropagation();
        var dt = e.originalEvent.dataTransfer;
        var nodeType = dt.getData("nodeType");
        if (nodeType === 'a') {
            var n = $(this);
            n.removeClass("unsetNode");
            n.addClass("elementBox");
            n.addClass("type_a");
        }
        return false;
    });

    $('#dropzone ul.elementList li div').bind('dragleave', function(e) {
        e.stopPropagation();
        var dt = e.originalEvent.dataTransfer;
        var nodeType = dt.getData("nodeType");
        if (nodeType === 'a') {
            var n = $(this);
            n.addClass("unsetNode");
            n.removeClass("elementBox");
            n.removeClass("type_a");
        }
        return false;
    });

    var NodeBase = function() {
        this.children = [];
        this.changeStack = [];
        return this;
    }

    NodeBase.prototype.isValidChild = function(child) {
        // nodeType === 'a' only Valid Child type
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
