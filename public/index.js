const socket = io();

$(document).on('click', '.label', function() {
    socket.emit('vote', $(this).text());
});

$('#add-field').keyup(function() {
    if ($(this).val().length > 20) {
        $(this).css('border-color', 'red');
    } else {
        $(this).css('border-color', '');
    }
});

$('#add-button').click(function() {
    socket.emit('vote', $('#add-field').val());
});

socket.on('user-count', function(count) {
    $('#user-count').text(count)
    chart.options.scales.yAxes[0].ticks.max = count;
    chart.update({duration: 0});
});

socket.on('label-list', function(labels) {
    $('#labels').empty();

    labels.forEach(label => {
        $('#labels').append('<li class="label">' + label.text + '</li>');
    });

    chart.data.labels = labels.map(label => label.text);
    chart.data.datasets[0].data = labels.map(label => label.votes);
    chart.update({duration: 0});
});