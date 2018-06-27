exports.handler = async (event) => {
    //https://github.com/vmpowerio/chartjs-node
    console.log('started');
    const ChartjsNode = require('chartjs-node');
    
    var data = demoData();
    var height = 600;
    var width = 600;
    if(event && event.body)
    {
        var body = {};
        data = JSON.parse(event.body);
        console.log("using body parameter");
        if(data.height && !isNaN(data.height)){
            console.log("found height");
            height = data.height;
        }
        if(data.width && !isNaN(data.width)){
            console.log("found width");
            width = data.width;
        }
    }
   
    var chartNode = new ChartjsNode(width,height);
    
    console.log('about to start chart generation');
    var value = chartNode.drawChart(data)
    .then(() => {
        // chart is created
        // get image as png buffer
        return chartNode.getImageBuffer('image/png');
    })
    .then(buffer => {
        //Convert buffer to base64 which can be sent as a response
        var responseBody = JSON.stringify({
            contentType: 'image/png',
            base64: new Buffer(buffer).toString('base64')
        });
        let response = {
            statusCode: 200,
            headers: null,
            body: responseBody,
            isBase64Encoded : true,
        };
        console.log('Chart generated');
        return response;
    });
    console.log('returning value');
    return value;
};


function demoData()
{
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