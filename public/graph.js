const ctx = document.getElementById('graph').getContext('2d');

const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        datasets: [{
            label: 'Your mood',
            backgroundColor: 'rgba(40, 40, 200, 0.4)',
        }],
    },
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    min: 0,
                    max: 1,
                }
            }]
        },
    },
});

