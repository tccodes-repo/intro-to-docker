$(document).ready(function() {

    $('form').submit(function(e) {
        e.preventDefault();
        var email = $('input[name=email]').val();
        var subject = $('input[name=subject').val();
        var body = $('textarea').val();

        $.ajax({
            type: 'POST',
            url: '/send',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({ 
                sendTo: email,
                subject: subject,
                body: body
             }),
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

        var rowClass = 'row';

        if (i == (data.length) - 1) {
            rowClass = 'row last';
        }
        
        container.append('<div class="' + rowClass + '">' +
            '<div class="sentTo">To: ' + s.to + '</div>' +
            '<div class="subject">Subject: ' + s.subject + '</div>' +
            '<div class="sentOn">' + new Date(s.dateSent).toLocaleString() + '</div>' +
        '</div>');
    }
}