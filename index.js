//https://github.com/vmpowerio/chartjs-node

const ChartjsNode = require('chartjs-node');
// 600x600 canvas size
var chartNode = new ChartjsNode(600, 600);
var chartJsOptions = demoOptions();

return chartNode.drawChart(chartJsOptions)
.then(() => {
    // chart is created
 
    // get image as png buffer
    return chartNode.getImageBuffer('image/png');
})
.then(buffer => {
    Array.isArray(buffer) // => true
    //Convert buffer to base64 which can be sent as a response
    var base64data = new Buffer(buffer).toString('base64');
    let response = {
        statusCode: 200,
        headers: {'Content-type' : 'image/png'},
        body: base64data,
        isBase64Encoded : true,
      };
      console.log(response);
    //return callback(null, response);
    // as a stream

    return chartNode.getImageStream('image/png');
})
.then(streamResult => {
    // using the length property you can do things like
    // directly upload the image to s3 by using the
    // stream and length properties
    streamResult.stream // => Stream object
    streamResult.length // => Integer length of stream
    // write to a file
    return chartNode.writeImageToFile('image/png', './testimage.png');
})
.then(() => {
    // chart is now written to the file path
    // ./testimage.png
});

function demoOptions()
{
    var horizontalBarChartData = demoData();
    return {
        type: 'bar',
        data: {
            labels: ["2018-06-11", "2018-06-12", "2018-06-13", "2018-06-14", "2018-06-15", "2018-06-16", "2018-06-17"],
            datasets: [ {
                label: "Symbicort Actuals",
                type: "bar",
                yAxesGroup: "1",
                backgroundColor: "rgba(255,0,0,.75)",
                data: [4, 5, 3, 2, 4, 4, 2]
            },
            {
                label: "Ventolin Actuals",
                type: "bar",
                yAxesGroup: "1",
                backgroundColor: "rgba(0,0,255,.75)",
                data: [1, 1, 0, 1, 0, 0, 2]
            },{
                label: "Symbicort Prescribed",
                type: "line",
                yAxesGroup: "2",
                borderColor: "rgba(255,0,0,1)",
                borderWidth: 1,
                data: [4, 4, 4, 4, 4, 4, 4]
            },{
                label: "Ventolin Prescribed",
                type: "line",
                yAxesGroup: "2",
                borderColor: "rgba(0,0,255,1)",
                borderWidth: 1,data: [0, 0, 0, 0, 0, 0, 0]
            }],
            yAxes: [{
                name: "1",
                scalePositionLeft: false,
                scaleFontColor: "rgba(151,137,200,0.8)"
            }, {
                name: "2",
                scalePositionLeft: true,
                scaleFontColor: "rgba(151,187,205,0.8)"
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                },
            ],
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day',
                    unitStepSize: 1,
                    displayFormats: {
                    'day': 'MMM DD'
                    }
                }
            }]
            }
        }
    };
};
