$(window).load(function() {
    $('.elementBox').bind('dragstart', function(e) {
        var dt = e.originalEvent.dataTransfer;
        dt.setData("Text", "Dropped " + e.target.id);
        return true;
    });

});
