const socket = io();

$(document).on('click', '.label', function() {
    socket.emit('vote', $(this).text());
});

$('#add-field').keyup(function(event) {
    if ($(this).val().length > 20) {
        $(this).css('border-color', 'red');
    } else {
        $(this).css('border-color', '');
    }

    if (event.which === 13) {
        $('#add-button').click()
    }
});

$('#add-button').click(function() {
    socket.emit('vote', $('#add-field').val());
});

socket.on('user-count', function(count) {
    $('#user-count').text(count)
    chart.options.scales.yAxes[0].ticks.max = count;
    chart.update({duration: 400});
});

socket.on('label-list', function(labels) {
    $('#labels').empty();

    labels.forEach(label => {
        $('#labels').append('<p class="label bordered">' + label.text + '</p>');
    });

    labels.sort((a, b) => b.votes - a.votes);

    chart.data.labels = labels.map(label => label.text);
    chart.data.datasets[0].data = labels.map(label => label.votes);
    chart.update({duration: 400});
});