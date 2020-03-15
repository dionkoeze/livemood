const socket = io();

$(document).on('click', '.label', function() {
    console.log('click')
    $.post(`${$(this).text()}`, {
        secret: $('#secret').val(),
    });
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

    chart.data.labels = labels.map(label => label.text);
    chart.data.datasets[0].data = labels.map(label => label.votes);
    chart.update({duration: 400});
});