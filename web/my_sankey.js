$(document).ready(function () {
    Plotly.d3.csv(NODE_DATA_PATH, function(nodes) {
    Plotly.d3.csv(LINK_DATA_PATH, function(links) {
    
        function plotSankey() {
            var WIDTH = 2810
            var NODE_THICK = 3
            var LINE_THICK = 0.5
            if (typeof LARGE !== 'undefined' && LARGE == true) {
                WIDTH = 20000
                NODE_THICK = 2
            }
            if (typeof NO_NODES !== 'undefined' && NO_NODES == true) {
                NODE_THICK = 1
                LINE_THICK = 0
            }
            
            var data = {
                type: 'sankey',
                orientation: 'h',
                valueformat: ".0f",
                node: {
                    pad: 8,
                    thickness: NODE_THICK,
                    line: {
                        color: 'white',
                        width: LINE_THICK
                    },
                    label: unpack(nodes, 'label'),
                    color: unpack(nodes, 'color'),
                    nodeType__2: unpack(nodes, 'nodeType__2'),
                    city__2: unpack(nodes, 'city__2'),
                    country__2: unpack(nodes, 'country__2'),
                },
                link: {
                    source: unpack(links, 'source'),
                    target: unpack(links, 'target'),
                    value: unpack(links, 'value'),
                    label: unpack(links, 'label'),
                    color: unpack(links, 'color'),
                    //color: new Array(links.length).fill('lightgrey')
                }
            }
            
            data = add_buffers(data, 13, 0)
            
            var data = [data]
            var layout = {
                //title: 'Personnel',
                height: 2200,
                width: WIDTH,
                font: {
                    size: 10
                }
            }
            Plotly.newPlot('plot1', data, layout).then(increaseMainSVG)
            actionsAfterPlottingSankeyDiagram()
        
            function increaseMainSVG() {
                $('#plot1').width(WIDTH+120)
                $('div.svg-container').width(WIDTH+120)
                $('svg.main-svg').width(WIDTH+120)
            }
        }
        
        plotSankey()
        
        $('#clearAll-NO').on('click', function () {
            // alt method
        });
        
    }) })
})

function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
}

function actionsAfterPlottingSankeyDiagram() {
    if (typeof TIMELINE1 !== 'undefined' && TIMELINE1 || typeof TIMELINE2 !== 'undefined' && TIMELINE2) add_timeline("plots");
}






