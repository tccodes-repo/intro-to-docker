$(document).ready(function() {

    $('form').submit(function(e) {
        e.preventDefault();
        var email = $('input[name=email]').val();

        $.ajax({
            type: 'POST',
            url: '/send',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({ sendTo: email }),
            success: function() {
                loadSent();
            },
            failure: function(err) {
                console.log(err);
            }

        });
    });

    
    loadSent();
});

function loadSent() {
    $.ajax({
        type: "GET",
        url: '/sent?t=' + new Date().getTime(),
        success: function(res) {
            console.log(res);
            renderSent(res);
        }
    }); 
}

function renderSent(data) {
    var container = $('#container');

    container.html('');

    for(var i = 0; i < data.length; i++) {
        var s = data[i];
        
        container.append('<div>' +
            '<div class="sentTo">Sent Email To: ' + s.to + '</div>' +
            '<div class="sentOn">' + s.dateSent + '</div>' +
        '</div>');
    }
}