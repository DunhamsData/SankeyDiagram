//https://spin.js.org/

import {Spinner} from './spin.js';

var opts = {
  lines: 13, // The number of lines to draw
  length: 18, // The length of each line
  width: 7, // The line thickness
  radius: 25, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 0.8, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#333', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '30%', // Top position relative to parent
  left: '70%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 999, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning
};
var wheelTarget
var wheel

// Browser detection
// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;
// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;
// Chrome 1 - 79
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
// Edge (based on chromium) detection
var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

var CONTEXTMENU = false
var plots, plot1, plot1rect, plot1content, glass, plot2, plot2rect, plot2content, glass, border
var sidebarRect, tooltipRect, glassRect
var WIDTH = 2810
var HEIGHT = 2200
var PLOT2_TOP_OFFSET = -4
var PLOT2_LEFT_OFFSET = 20
var SCALE1 = 1, SCALE1ORIGINAL = 1, SCALE2 = 1
var SHOW_TOOLTIP_IN_PLOT1 = false
var SHOW_TOOLTIP_IN_PLOT2 = true
var SHOW_TOOLTIP_IN_BOTH = true
var SEARCH_IS_ACTIVE = false

var FULLWIDTH = screen.availWidth
var FULLHEIGHT = screen.availHeight
//var FULLWIDTH = screen.width
//var FULLHEIGHT = screen.height

var windowInnerWidth, windowInnerHeight

var SCALEW, SCALEH, SCALE
var SCREENW, SCREENH, SCALE3, REVSCL3
var DEPTH = (FULLWIDTH * FULLHEIGHT)**0.5 / 1000

var nodes1a = [], nodes1b = [], nodes1c = [], nodes2a = [], nodes2b = [], nodes2c = []
var links1 = [], links2 = []

var FREEZE = false
var wasClipped = true, wasFrozen = FREEZE
$(document).ready(function () {

wheelTarget = document.getElementById('spinner');
wheel = new Spinner(opts).spin(wheelTarget);

setTimeout(() => {
    var tmpImg = new Image() ;
    tmpImg.src = $('#background-sankey-image').attr('src') ;
    tmpImg.onload = function() {
        imgLoaded()
    } ;
}, 100)

function imgLoaded() {

    Plotly.d3.csv(NODE_DATA_PATH, function(nodes) {
    Plotly.d3.csv(LINK_DATA_PATH, function(links) {
    Plotly.d3.csv(AKAS_DATA_PATH, function(akas_csv) {
    
    var akas = {}
    for (var i=0; i<akas_csv.length; i++) {
        var elem = akas_csv[i]
        var name = elem['SCREEN NAME']
        var aka = elem['PUBLIC AKAS']
        akas[name] = aka
    }
    
    plots = document.getElementById('plots')
    plot1 = document.getElementById('plot1')
    plot2 = document.getElementById('plot2')
    
    function drawGlassBorder() {
        border.style.height = glass.style.height
        border.style.width = glass.style.width
        var A = glass.A-0.2
        var C = glass.C+0.2
        border.innerHTML = ' \
         <svg height="'+glass.offsetHeight+'" width="'+glass.offsetWidth+'"> \
          <line class="border" x1="'+(0-10)+'px" y1="'+A+'px" x2="'+C+'px" y2="'+(glass.offsetHeight+10)+'px" /> \
         </svg> '
    }
    
    function plotSankey() {
        //WIDTH = 2900
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
            height: HEIGHT,
            width: WIDTH,
            //height:600,
            //width:930,
            font: {
                size: 10
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
        }
        
        function plotPlot1() {
            Plotly.newPlot('plot1', data, layout, {responsive: true})
            plot1.on('plotly_afterplot', function() {
                
                $('#plot1').width(WIDTH+120)
                $('div.svg-container').width(WIDTH+120)
                $('svg.main-svg').width(WIDTH+120)
                
                
                
                $('div.modebar-container').hide()
                
                var plot1Aux = $('#plot1 .plot-container')
                plot1Aux.prop('id', 'myglass')
                plot1Aux.addClass('rollingwindow mycomponent')
                glass = document.getElementById('myglass')
                glassRect = glass.getBoundingClientRect()
                
                plot1content = $('#plot1 .svg-container')[0]
                plot1rect = plot1content.getBoundingClientRect()
                
                // Fullscreen
                var fs = document.createElement('a')
                fs.id = 'fullscreen'
                fs.className = 'glass-control'
                fs.width = 20
                fs.height = 20
                fs.setAttribute('data-tooltip', 'Fullscreen')
                glass.appendChild(fs)
                fs.addEventListener("click", function() {
                    $(glass).toggleClass('fullscreen')
                    $('#fullscreen').toggleClass('fullscreen2')
                    if ($(glass).hasClass('fullscreen')) {
                        $(glass).addClass('rollingwindow2')
                        $( "#myglass" ).draggable('disable')
                        $(plot1content).draggable('disable')
                        $(plot1content).css({cursor: 'auto'})
                        $('#border').addClass('invisibleBorder')
                        $('#clear').show()
                        SHOW_TOOLTIP_IN_PLOT1 = true
                        SHOW_TOOLTIP_IN_PLOT2 = false
                    }
                    else {
                        if (wasClipped) {
                            $(glass).removeClass('rollingwindow2')
                            $('#border').removeClass('invisibleBorder')
                            //drawGlassBorder()
                        }
                        $(glass).css({'background-color': 'rgb(0, 0, 0, 0.02) 10px 10px 30px'})
                        $( "#myglass" ).draggable('enable')
                        $(plot1content).draggable('disable')
                        $(plot1content).css({cursor: 'grab'})
                        $('#clear').hide()
                        SHOW_TOOLTIP_IN_PLOT1 = false
                        SHOW_TOOLTIP_IN_PLOT2 = true
                    }
                    FREEZE = false
                });
                
                // Clear
                var cl = document.createElement('a')
                cl.id = 'clear'
                cl.className = 'clearall glass-control'
                cl.width = 20
                cl.height = 20
                cl.setAttribute('data-tooltip', 'Clear\xa0all')
                glass.appendChild(cl)
                
                // Reset zoom
                var zm = document.createElement('a')
                zm.id = 'zoom'
                zm.className = 'resetzoom glass-control'
                zm.width = 20
                zm.height = 20
                zm.setAttribute('data-tooltip', 'Reset\xa0zoom')
                glass.appendChild(zm)
                $('#zoom').on('click', zoom);
                
                // Border
                border = document.createElement('div');
                border.id = 'border'
                border.style.position = 'absolute'
                border.style.top = 0
                border.style.zIndex = -100
                glass.appendChild(border)
                
                function plotPlot2() {
                    $(plot1).clone(true).attr('id', 'plot2').appendTo('#plots')
                    $('#plot2 #myglass').removeClass('rollingwindow')
                    $('#plot2 #myglass').attr('id', null)
                    plot2 = document.getElementById('plot2')
                    
                    $('div.modebar-container').hide()
                    
                    $('#plot2 .svg-container').addClass('scalable')
                    $('#plot2 .svg-container').css({'top': PLOT2_TOP_OFFSET + 'px'})
                    $('#plot2 .svg-container').css({'left': PLOT2_LEFT_OFFSET + 'px'})
                    
                    plot2content = $('#plot2 .svg-container')[0]
                    plot2rect = plot2content.getBoundingClientRect()
                    
                    window.addEventListener('resize', setupResize1)
                    
                    function setupResize1(ev) {
//                        windowInnerWidth = Math.min(window.innerWidth, FULLWIDTH)
//                        windowInnerHeight = Math.min(window.innerHeight, FULLHEIGHT)
                        windowInnerWidth = window.innerWidth
                        windowInnerHeight = window.innerHeight
                        
                        SCALEW  = Math.min(windowInnerWidth / FULLWIDTH, 1)
                        SCALEH  = Math.min(windowInnerHeight / FULLHEIGHT, 1)
                        SCALE   = Math.min(SCALEW, SCALEH)
                        
                        SCREENW = Math.min(windowInnerWidth / WIDTH, 1)
                        SCREENH = Math.min(windowInnerHeight / HEIGHT, 1)
                        SCALE3  = Math.min(SCREENW, SCREENH)
                        
                        REVSCL3  = 1 / SCALE3
                        
                        // Background sankey
                        $('#plot2 .svg-container').css({
                            'transform': 'scale('+SCALE3+')',
                        })
                        plot2content = $('#plot2 .svg-container')[0]
                        plot2rect = plot2content.getBoundingClientRect()
                        
                        // Title
//                        $('#title').css({
//                            'font-size': 24 * SCALEW * DEPTH,
//                        })
                        
                        // Triangle
                        var A = 0
                        var B = 0
                        var C = plot2rect.right * 0.3 + 'px'
                        var D = 0
                        var E = plot2rect.right * 1.5 + 'px'
                        var F = plot2rect.bottom  + 'px'
                        var G = 0
                        var H = plot2rect.bottom  + 'px'
                        
                        var w = plot2rect.right
                        var h = plot2rect.bottom
                        $('.triangle1').css({
                            'shape-outside': 'polygon('+A+' '+B+', '+C+' '+D+', '+E+' '+F+', '+G+' '+H+')'
                        })
                        
                        // Description
                        $('#desc').css({
                            'font-size': 13 * SCALEW * DEPTH,
                        })
                        
                        // Sidebar
                        var P = 0.55
                        var sidebarTop = plot2rect.height * P
                        var sidebarWidth = plot2rect.width * 0.4
                        var sidebarHeight = plot2rect.height * (1-P)
                        var sidebarBottom = Math.max(0, windowInnerHeight - plot2rect.bottom)
                        $('#sidebar').css({
                            'transform': 'scale('+ SCALE +')',
                            'transform-origin': 'top left',
                            'top': sidebarTop,
                            'left': 0,
                            'width': sidebarWidth / SCALE,
                            'height': sidebarHeight / SCALE,
                        })
                        var searchbarBottom
                        var Ok = false
                        var i = 1700
                        while(!Ok && i > 0) {
                            $('#sidebar .item').css({
                                'font-size': i/1000 + 2 - SCALE + 'vh',
                                'margin-top': 10 + 10 * (1-SCALE) + 'px',
                            })
                            $('#sidebar .title').css({
                                'font-size': 4 - SCALE + 'vh',
                                //'margin-top': '10px',
                                //'margin-bottom': 10 * SCALE + 'px'
                            })
                            searchbarBottom = document
                              .getElementById('searchInput')
                              .getBoundingClientRect().bottom
                            Ok = plot2rect.bottom - searchbarBottom >= 10
                            i--
                        }
                        $('.searchResults').css({
                            'height': sidebarHeight * 0.7 / SCALE + 'px',
                        })
                        $('.searchResultsContainer').css({
                            'height': sidebarHeight * 0.65 / SCALE + 'px'
                        })
                        sidebarRect = document.getElementById('sidebar').getBoundingClientRect()
                        
                        // Legend
                        createLegend()
                        
                        // Glass
                        // See setupResize2
                    }
                    setupResize1()
                    
                    glass.addEventListener("mousemove", updateGlassView);
                    glass.addEventListener("touchmove", updateGlassView);
                    plot2.addEventListener("mousemove", updateGlassView);
                    plot2.addEventListener("touchmove", updateGlassView);
                    plot2.addEventListener("wheel", zoom);
                    glass.addEventListener("wheel", zoom);
                    window.addEventListener('resize', setupResize2)
                    
                    function formatGlass() {
                        var desc = document.getElementById('desc')
                        var descRect = desc.getBoundingClientRect()
                        
//                                             TT
//                        A________________________________________B
//                        |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
//                        |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
//                       E|\xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
//                        | \xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
//                        |  \xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
//                    LL  |   \xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|  RR
//                        |    \xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
//                        |     \xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
//                        |      \xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
//                        |       \xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
//                        |________\_______________________________|
//                                 D                               C
//                                             BB
                        
                        var P2TO = PLOT2_TOP_OFFSET
                        var P2LO = PLOT2_LEFT_OFFSET
                        var MM, TT, RR, BB, LL, AA, CC
                        MM = descRect.bottom * 0.05
                        TT = descRect.bottom + MM * 1
                        RR = descRect.right
                        BB = plot2rect.bottom - MM * 4
                        LL = plot2rect.width * 0.7 + P2LO
                        AA = Math.max(plot2rect.height * 0.45 + P2TO, TT) // E
                        CC = Math.min(plot2rect.width * 1.15 + P2LO, RR)  // D
                        
                        var h = BB - TT
                        var w = RR - LL
                        var absA = AA - TT
                        var absC = CC - LL
                        var A = absA / h * 100
                        var C = absC / w * 100
                        
                        // Consider 2x10px box shadow
                        glass.A = absA
                        glass.C = absC
                        //var p = 'polygon(-10% -10%, 110% -10%, 110% 110%, '+C+'% 110%, -10% '+A+'%)'
                        
                        var TT2 = 0 - 10 + 'px'
                        var RR2 = w + 10 + 'px'
                        var BB2 = h + 10 + 'px'
                        var LL2 = 0 - 10 + 'px'
                        var AA2 = absA + 'px'
                        var CC2 = absC + 'px'
                        var p = 'polygon('+LL2+' '+TT2+', '+RR2+' '+TT2+', '+RR2+' '+BB2+', '+CC2+' '+BB2+', '+LL2+' '+AA2+')'
                        glass.style.left = null
                        $('#myglass').css({
                            'width': w,
                            'height': h,
                            'clip-path': p,
                            'top': TT,
                            'right': 20,
                        })
                        glass.style.left = glass.getBoundingClientRect().left + 'px'
                        glassRect = glass.getBoundingClientRect()
                        
                        plot1content.style.top = '-9999px'
                        plot1content.style.left = '-9999px'
                        
                        drawGlassBorder()
                        
                        $('.glass-control').css({
                            'transform': 'scale('+SCALE+')',
                        })
                        zoom(null, true)
                    }
                    formatGlass()
                    
                    function setupResize2() {
                        formatGlass()
                    }
                    
                    setTimeout(() => {
                    everythingElse()
                    }, 100)
                }
                plotPlot2()
            })
        }
        plotPlot1()
    }
    plotSankey()
    
    function everythingElse() {
        $('#background-sankey-image').hide()
        //$('#loading').hide()
        wheel.stop()
        $('.mycomponent').css('opacity', 1)
        
        $('.clearall').on('click', function(ev) {
            ev.preventDefault()
            restoreDefaultSankey()
            return false
        });
        
        $(function() {
            $( "#myglass" ).draggable({
                start: function( event, ui ) {
                    $(this).css({cursor: 'move'})
                    $(glass).css({cursor: 'move'})
                    $(plot1content).css({cursor: 'move'})
                    //drawGlassBorder()
                },
                drag: function( event, ui ) {
                    $(this).css({cursor: 'move'})
                    $(glass).css({cursor: 'move'})
                    $(plot1content).css({cursor: 'move'})
                    //drawGlassBorder()
                },
                stop: function( event, ui ) {
                    $(this).css({cursor: 'grab'})
                    $(glass).css({cursor: 'grab'})
                    $(plot1content).css({cursor: 'grab'})
                    //drawGlassBorder()
                }
            })
            $(plot1content).draggable({
                disabled: true,
                start: function( event, ui ) {
                    $(this).css({cursor: 'move'})
                    $(glass).css({cursor: 'move'})
                    $(plot1content).css({cursor: 'move'})
                },
                drag: function( event, ui ) {
                    $(this).css({cursor: 'move'})
                    $(glass).css({cursor: 'move'})
                    $(plot1content).css({cursor: 'move'})
                },
                stop: function( event, ui ) {
                    $(this).css({cursor: 'grab'})
                    $(glass).css({cursor: 'grab'})
                    $(plot1content).css({cursor: 'grab'})
                }
            })
            $( "#myglass" ).resizable({
                handles: 'all',
                autoHide: true,
                start: function( event, ui ) {
                    //drawGlassBorder()
                },
                resize: function( event, ui ) {
                    //drawGlassBorder()
                },
                stop: function( event, ui ) {
                    //drawGlassBorder()
                }
            })
        });
        
        var nodes1aux = $('#plot1 g.sankey-node')
        for (var i=0; i<nodes1aux.length; i++) {
            var n = nodes1aux[i]
            nodes1a.push(n)
        }
        //nodes1a.sort(sortNodes)
        
        for (var i=0; i<nodes1a.length; i++) {
            var n = nodes1a[i]
            var r = n.querySelector('rect.node-rect')
            var s = n.querySelector('g.node-entered')
            nodes1b.push(r)
            nodes1c.push(s)
        }
        
        var links1aux = $('#plot1 g.sankey-links path')
        for (var i=0; i<links1aux.length; i++) {
            var n = links1aux[i]
            links1.push(n)
        }
        //links1.sort(sortLinks)
        
        var nodes2aux = $('#plot2 g.sankey-node')
        for (var i=0; i<nodes2aux.length; i++) {
            var n = nodes2aux[i]
            nodes2a.push(n)
        }
        //nodes2a.sort(sortNodes)
        
        for (var i=0; i<nodes2a.length; i++) {
            var n = nodes2a[i]
            var r = n.querySelector('rect.node-rect')
            var s = n.querySelector('g.node-entered')
            nodes2b.push(r)
            nodes2c.push(s)
        }
        
        var links2aux = $('#plot2 g.sankey-links path')
        for (var i=0; i<links2aux.length; i++) {
            var n = links2aux[i]
            links2.push(n)
        }
        //links2.sort(sortLinks)
        
        function copyObjects(src, dst, includeNodeType=false) {
            for (var i=0; i<src.length; i++) {
                var srcObj = src[i]
                var dstObj = dst[i]
                var keys = Object.keys(srcObj)
                var len = keys.length;
                for (var j=0; j<len; j++) {
                    var k = keys[j]
                    dstObj[k] = srcObj[k]
                }
                if (includeNodeType) {
                    var typeVal = srcObj.getAttribute('node-type__2')
                    dstObj.setAttribute('node-type__2', typeVal)
                }
            }
        }
        copyObjects(nodes1a, nodes2a)
        copyObjects(nodes1b, nodes2b)
        copyObjects(nodes1c, nodes2c, true)
        copyObjects(links1, links2)
        
        if (nodes1a.length != nodes1b.length)
            throw new Error('Node lengths don\'t match.')
        if (nodes1a.length != nodes1c.length)
            throw new Error('Node lengths don\'t match.')
        if (nodes2a.length != nodes2b.length)
            throw new Error('Node lengths don\'t match.')
        if (nodes2a.length != nodes2c.length)
            throw new Error('Node lengths don\'t match.')
        if (nodes1a.length != nodes2a.length)
            throw new Error('Node lengths don\'t match.')
        if (nodes1b.length != nodes2b.length)
            throw new Error('Node lengths don\'t match.')
        if (nodes1c.length != nodes2c.length)
            throw new Error('Node lengths don\'t match.')
        for (var i=0; i<nodes1a.length; i++) {
            var n1a = nodes1a[i]
            var n1b = nodes1b[i]
            var n1c = nodes1c[i]
            var n2a = nodes2a[i]
            var n2b = nodes2b[i]
            var n2c = nodes2c[i]
            var d1a = n1a.__data__
            var d1b = n1b.__data__
            var d1c = n1c.__data__
            var d2a = n2a.__data__
            var d2b = n2b.__data__
            var d2c = n2c.__data__
            if (d1a.index != d1b.index)
                throw new Error('Node indexes don\'t match.')
            if (d1a.index != d1c.index)
                throw new Error('Node indexes don\'t match.')
            if (d2a.index != d2b.index)
                throw new Error('Node indexes don\'t match.')
            if (d2a.index != d2c.index)
                throw new Error('Node indexes don\'t match.')
            if (d1a.index != d2a.index)
                throw new Error('Node indexes don\'t match.')
            if (d1b.index != d2b.index)
                throw new Error('Node indexes don\'t match.')
            if (d1c.index != d2c.index)
                throw new Error('Node indexes don\'t match.')
        }
        
        if (links1.length != links2.length)
                throw new Error('Link lengths don\'t match.')
        for (var i=0; i<links1.length; i++) {
            var l1 = links1[i]
            var l2 = links2[i]
            var d3 = l1.__data__
            var d4 = l2.__data__
            if (d3.link.index != d4.link.index)
                throw new Error('Link indexes don\'t match.')
            if (d3.key != d4.key)
                throw new Error('Link keys don\'t match.')
        }
        
        // Sorting
        nodes1a.sort(sortNodes)
        nodes1b = []
        nodes1c = []
        for (var i=0; i<nodes1a.length; i++) {
            var n = nodes1a[i]
            var r = n.querySelector('rect.node-rect')
            var s = n.querySelector('g.node-entered')
            nodes1b.push(r)
            nodes1c.push(s)
        }
        links1.sort(sortLinks)
        nodes2a.sort(sortNodes)
        nodes2b = []
        nodes2c = []
        for (var i=0; i<nodes2a.length; i++) {
            var n = nodes2a[i]
            var r = n.querySelector('rect.node-rect')
            var s = n.querySelector('g.node-entered')
            nodes2b.push(r)
            nodes2c.push(s)
        }
        links2.sort(sortLinks)
        
        var defaulSankey = {
            nodesA: {},
            nodesB: {},
            nodesC: {},
            links: {},
        }
        function storeDefaultSankey() {
            for (var i=0; i<nodes1a.length; i++) {
                defaulSankey.nodesA[i] = {}
                var n1 = nodes1a[i]
                var attributes = n1.attributes;
                for (var j=0; j<attributes.length; j++) {
                    var a = attributes[j].name
                    var v = n1.getAttribute(a)
                    defaulSankey.nodesA[i][a] = v
                }
            }
            for (var i=0; i<nodes1b.length; i++) {
                defaulSankey.nodesB[i] = {}
                var n1 = nodes1b[i]
                var attributes = n1.attributes;
                for (var j=0; j<attributes.length; j++) {
                    var a = attributes[j].name
                    var v = n1.getAttribute(a)
                    defaulSankey.nodesB[i][a] = v
                }
            }
            for (var i=0; i<nodes1c.length; i++) {
                defaulSankey.nodesC[i] = {}
                var n1 = nodes1c[i]
                var attributes = n1.attributes;
                for (var j=0; j<attributes.length; j++) {
                    var a = attributes[j].name
                    var v = n1.getAttribute(a)
                    defaulSankey.nodesC[i][a] = v
                }
            }
            for (var i=0; i<links1.length; i++) {
                defaulSankey.links[i] = {}
                var l1 = links1[i]
                var attributes = l1.attributes;
                for (var j=0; j<attributes.length; j++) {
                    var a = attributes[j].name
                    var v = l1.getAttribute(a)
                    defaulSankey.links[i][a] = v
                }
            }
        }
        storeDefaultSankey()
        
        function restoreDefaultSankey() {
            var srcNodesA = defaulSankey.nodesA
            var srcNodesB = defaulSankey.nodesB
            var srcNodesC = defaulSankey.nodesC
            var srcLinks = defaulSankey.links
            var dstNodes1a = nodes1a
            var dstNodes1b = nodes1b
            var dstNodes1c = nodes1c
            var dstLinks1 = links1
            for (var i in srcNodesA) {
                var n0 = srcNodesA[i]
                var n1 = nodes1a[i]
                var attributes = n0
                for (var a in attributes) {
                    var v = attributes[a]
                    n1.setAttribute(a, v)
                }
                n1.removeAttribute('selected')
                n1.removeAttribute('hovered')
            }
            for (var i in srcNodesB) {
                var n0 = srcNodesB[i]
                var n1 = nodes1b[i]
                var attributes = n0
                for (var a in attributes) {
                    var v = attributes[a]
                    n1.setAttribute(a, v)
                }
                //n1.removeAttribute('selected')
                //n1.removeAttribute('hovered')
            }
            for (var i in srcNodesC) {
                var n0 = srcNodesC[i]
                var n1 = nodes1c[i]
                var attributes = n0
                for (var a in attributes) {
                    var v = attributes[a]
                    n1.setAttribute(a, v)
                }
            }
            for (var i in srcLinks) {
                var l0 = srcLinks[i]
                var l1 = links1[i]
                var attributes = l0
                for (var a in attributes) {
                    var v = attributes[a]
                    l1.setAttribute(a, v)
                }
                l1.removeAttribute('selected')
                l1.removeAttribute('hovered')
            }
            copySankey(1, 2)
        }
        
        function copySankey(src, dst) {
            var srcNodesA, srcNodesB, srcNodesC, srcLinks, dstNodesA, dstNodesB, dstNodesC, dstLinks
            if (src == 1 && dst == 2) {
                srcNodesA = nodes1a
                srcNodesB = nodes1b
                srcNodesC = nodes1c
                srcLinks = links1
                dstNodesA = nodes2a
                dstNodesB = nodes2b
                dstNodesC = nodes2c
                dstLinks = links2
            }
            else if (src == 2 && dst == 1) {
                srcNodesA = nodes2a
                srcNodesB = nodes2b
                srcNodesC = nodes2c
                srcLinks = links2
                dstNodesA = nodes1a
                dstNodesB = nodes1b
                dstNodesC = nodes1c
                dstLinks = links1
            }
            else
                throw new Error('Copy index error.')
            
            for (var i=0; i<srcNodesA.length; i++) {
                var n1 = srcNodesA[i]
                var n2 = dstNodesA[i]
                var attributes = n1.attributes;
                for (var j=0; j<attributes.length; j++) {
                    var a = attributes[j].name
                    var v = n1.getAttribute(a)
                    n2.setAttribute(a, v)
                }
                if (!('selected' in attributes))
                    n2.removeAttribute('selected')
                if (!('hovered' in attributes))
                    n2.removeAttribute('hovered')
            }
            
            for (var i=0; i<srcNodesB.length; i++) {
                var n1 = srcNodesB[i]
                var n2 = dstNodesB[i]
                var attributes = n1.attributes;
                for (var j=0; j<attributes.length; j++) {
                    var a = attributes[j].name
                    var v = n1.getAttribute(a)
                    n2.setAttribute(a, v)
                }
                //if (!('selected' in attributes))
                //    n2.removeAttribute('selected')
                //if (!('hovered' in attributes))
                //    n2.removeAttribute('hovered')
            }
            for (var i=0; i<srcLinks.length; i++) {
                var l1 = srcLinks[i]
                var l2 = dstLinks[i]
                var attributes = l1.attributes;
                for (var j=0; j<attributes.length; j++) {
                    var a = attributes[j].name
                    var v = l1.getAttribute(a)
                    l2.setAttribute(a, v)
                }
                if (!('selected' in attributes))
                    l2.removeAttribute('selected')
                if (!('hovered' in attributes))
                    l2.removeAttribute('hovered')
            }
        }
        
        $('#plot2 g.sankey-node').on('mousemove', interactWithPerformer2)
        $('#plot2 g.sankey-node').on('mousedown', interactWithPerformer2)
        $('#plot2 g.sankey-node').on('mouseover', interactWithPerformer2)
        $('#plot2 g.sankey-node').on('mouseout', interactWithPerformer2)
        $('#plot2 path.sankey-link').on('mousemove', interactWithPerformer2)
        $('#plot2 path.sankey-link').on('mousedown', interactWithPerformer2)
        $('#plot2 path.sankey-link').on('mouseover', interactWithPerformer2)
        $('#plot2 path.sankey-link').on('mouseout', interactWithPerformer2)
//        plot1.on('plotly_click',    function() {$('#ready').val(12); copySankey(1, 2)})
//        plot1.on('plotly_hover',    function() {$('#ready').val(12); copySankey(1, 2)})
//        plot1.on('plotly_unhover',  function() {$('#ready').val(12); copySankey(1, 2)})
        plot1.on('plotly_click',    function() {$('#ready').val(12); copySankey(1, 2)})
        plot1.on('plotly_hover',    function() {$('#ready').val(12); copySankey(1, 2)})
        plot1.on('plotly_unhover',  function() {$('#ready').val(12); copySankey(1, 2)})
        
        $('#plot1 g.sankey-node').on('mouseover', formatTooltipOver)
        $('#plot1 path.sankey-link').on('mouseover', formatTooltipOver)
        $('#plot1 g.sankey-node').on('mouseout', formatTooltipOut)
        $('#plot1 path.sankey-link').on('mouseout', formatTooltipOut)
        
//        $('#plot1 g.sankey-node, #plot1 path.sankey-link').on('mouseover', onPlot)
//        $('#plot2 g.sankey-node, #plot2 path.sankey-link').on('mouseover', onPlot)
        $('#plot1, #plot1 *').on('mouseover', onPlot)
        $('#plot2, #plot2 *').on('mouseover', onPlot)
        
        $('#ready').change(function (ev) {
            if (this.value == 12)
                copySankey(1, 2)
            else if (this.value == 21)
                copySankey(2, 1)
            else
                console.log('Error.')
        })
        
        $( plot1 ).contextmenu(function(ev) {
            if (!CONTEXTMENU) ev.preventDefault()
            if ($(glass).hasClass('fullscreen'))
                freezeContent()
                if (FREEZE) {
                    $(glass).css({cursor: 'grab'})
                    $(plot1content).css({cursor: 'grab'})
                    $( "#myglass" ).draggable('disable')
                    $(plot1content).draggable('enable')
                }
                else {
                    $(glass).css({cursor: 'auto'})
                    $(plot1content).css({cursor: 'auto'})
                    $( "#myglass" ).draggable('disable')
                    $(plot1content).draggable('disable')
                }
            if (!CONTEXTMENU) return false
        })
        $( plot2 ).contextmenu(function(ev) {
            if (!CONTEXTMENU) ev.preventDefault()
            freezeContent()
            if (!CONTEXTMENU) return false
        })
        function freezeContent() {
            FREEZE = !FREEZE
            if (FREEZE) {
                //$(glass).css({'box-shadow': 'rgb(50, 50, 50) 10px 10px 30px'})
                //glass.style.top = (glass.offsetTop - 5) + 'px'
                //glass.style.left = (glass.offsetLeft - 5) + 'px'
                $(glass).css({'background-color': 'rgb(255, 0, 0, 0.05) 10px 10px 30px'})
                $( "#myglass" ).draggable('disable')
                $(plot1content).draggable('enable')
            }
            else {
                //$(glass).css({'box-shadow': 'rgb(50, 50, 50) 0px 0px 10px'})
                //glass.style.top = (glass.offsetTop + 5) + 'px'
                //glass.style.left = (glass.offsetLeft + 5) + 'px'
                $(glass).css({'background-color': 'rgb(0, 0, 0, 0.02) 10px 10px 30px'})
                $( "#myglass" ).draggable('enable')
                $(plot1content).draggable('disable')
            }
        }
        
        buildSearchBar()
        startGlassView()
    }
    
    function buildSearchBar() {
        var searchBar = document.getElementById('searchBar')
        //searchBar.style.position = 'fixed'
        //searchBar.style.bottom = '35%'
        //searchBar.style.left = '2%'
        $('#searchBar').show()
        
        var performers = []
        nodes.forEach(function(x) {
            if (x.nodeType__2 == 'cast' && !x.name.endsWith(' 2'))
                performers.push([x.label, akas[x.label]])
                //performers.push(x.label)
        })
        performers.sort()
        var ul = document.getElementById('searchUL')
        ul.classList.add('ulPerformers')
        performers.forEach(function (x) {
            let li = document.createElement('li')
            li.id = x[0]
            li.classList.add('liPerformer')
            li.style.display = 'none'
            ul.appendChild(li)
            //li.innerHTML = '<a href="#" id="'+formatId(x)+'">'+x+'</a>'
            li.innerHTML = x[1]
            //li.innerHTML = x
            li.addEventListener('mousemove', interactWithPerformer)
            li.addEventListener('mousedown', interactWithPerformer)
            li.addEventListener('mouseover', interactWithPerformer)
            li.addEventListener('mouseout' , interactWithPerformer)
            //var a = li.getElementsByTagName('a')[0]
            //a.addEventListener('mousedown', clickOnPerformer)
        })
        document.getElementById('searchInput').value = ''
        document.getElementById('searchCloseButton').addEventListener('click', closeSearch)
        searchBar.addEventListener('keyup', searchPerformer)
        document.getElementById('searchInput').addEventListener('focusin', (ev) => {
//            $('#searchBar').css({'margin-top': '10px'})
            //$('#searchCloseButton').css({'margin-top': '20px'})
            $( "#instructions" ).slideUp("slow", function() {
                //$('#instructions .title').hide()
                $('#searchCloseButton').show()
            })
            SEARCH_IS_ACTIVE = true
        })
        //searchBar.addEventListener('focusout', closeSearch)
    }
    
    function createLegend() {
        
        var bandWidth = 200
        var bandHeight = 50
        var width = bandWidth + 0
        var height = bandHeight + 40
        var left = plot2rect.width * 0.4 + 10*SCALE
        var bottom = Math.max(0, windowInnerHeight - plot2rect.bottom) + 10*SCALE
        
        
        $('#legendDiv').css({
            'position': 'absolute',
            'left': left,
            'bottom': bottom,
            'width': width,
            'height': height,
            'transform': 'scale('+SCALE+')',
            'transform-origin': 'bottom left',
        })
        
        $('#legend').css({
            'position': 'absolute',
            'top': 20,
        })
        
        $('#legend-text').text('First “check-in”')
        $('#legend-text').css({
            'position': 'absolute',
            'font-size': 13,
        })
        
        $('#legend-label-1').text('1947')
        $('#legend-label-1').css({
            'position': 'absolute',
            'bottom': 0,
            'left': 0,
            'font-size': 12,
        })
        
        $('#legend-label-2').text('1960')
        $('#legend-label-2').css({
            'position': 'absolute',
            'bottom': 0,
            'right': 0,
            'font-size': 12,
        })
        
        
        
        
//        container.style('position', 'absolute')
//        container.style('left', left + 'px')
//        container.style('bottom', bottom+5+40*(1-SCALE) + 'px')
//        
//        $('#legend').addClass('active-legend')
//        $('#legend-text').text('First “check-in”')
//        left = plot2rect.width * 0.4 + 15*SCALE
//        $('#legend-text').css('left', left + 'px')
//        $('#legend-text').css('bottom', bottom + 70*SCALE + 6*(1-SCALE) + 'px')
//        $('#legend-text').css('font-size', 13*SCALE + 'px')
//        
//        bottom += 6*SCALE + 6*(1-SCALE)
//        $('#legend-label-1').text('1947')
//        $('#legend-label-1').css('position', 'absolute')
//        $('#legend-label-1').css('left', left + 'px')
//        $('#legend-label-1').css('bottom', bottom + 'px')
//        $('#legend-label-1').css('font-size', 12*SCALE + 'px')
//        
//        $('#legend-label-2').text('1960')
//        $('#legend-label-2').css('position', 'absolute')
//        $('#legend-label-2').css('left', left + width - 30*SCALE + 'px')
//        $('#legend-label-2').css('bottom', bottom + 'px')
//        $('#legend-label-2').css('font-size', 12*SCALE + 'px')
        
    }
    
//    document.body.onkeydown = function(ev) {
//        // https://keycode.info/
//        if (ev.keyCode == 72 && ev.ctrlKey) { // H
//            ev.preventDefault()
//            $('#myglass').toggleClass('rollingwindow2')
//            wasClipped = !wasClipped
//            glass.style.top = '30%'
//            glass.style.right = '2%'
//            glass.style.left = 'auto'
//            //if (!$('#myglass').hasClass('rollingwindow2'))
//            //    drawLine()
//        }
//    }
    
    }) }) })
    
}
})

window.onkeydown = function(ev) {
    // https://keycode.info/
    if (ev.keyCode == 72 && ev.ctrlKey) { // H
        ev.preventDefault()
//        $('#myglass').toggleClass('rollingwindow2')
//        $('#border').toggleClass('invisibleBorder')
//        wasClipped = !wasClipped
//        glass.style.top = '30%'
//        glass.style.right = '2%'
//        glass.style.left = glass.getBoundingClientRect().left + 'px'
        //if (!$('#myglass').hasClass('rollingwindow2'))
        //    drawLine()
    }
    else if (ev.which == '61' ||
             ev.which == '107' ||
             ev.which == '173' ||
             ev.which == '109' ||
             ev.which == '187' ||
             ev.which == '189') {
        // 107 Num Key  +
        // 109 Num Key  -
        // 173 Min Key  hyphen/underscor Hey
        // 61 Plus key  +/= key
        ev.preventDefault();
    }
//    else if (ev.keyCode == 48 && (ev.ctrlKey == true || ev.shiftKey == true || ev.altKey == true || ev.metaKey == true)) { // 0
//        SCALE2 = 1
//        $('body').css({'transform': 'scale('+ SCALE2 +')'})
//    }
    else if (ev.keyCode == 80) {
        var x = document.getElementById('searchInput')
        var y = document.getElementById('searchCloseButton')
        console.log(x, x.getBoundingClientRect())
        console.log(y, y.getBoundingClientRect())
    }
    else if (ev.keyCode == 48 && (ev.ctrlKey == true || ev.shiftKey == true || ev.altKey == true || ev.metaKey == true)) { // 0
        SHOW_TOOLTIP_IN_PLOT1 = false
        SHOW_TOOLTIP_IN_PLOT2 = false
        SHOW_TOOLTIP_IN_BOTH = false
    }
    else if (ev.keyCode == 49 && (ev.ctrlKey == true || ev.shiftKey == true || ev.altKey == true || ev.metaKey == true)) { // 1
        SHOW_TOOLTIP_IN_PLOT1 = true
        SHOW_TOOLTIP_IN_PLOT2 = false
        SHOW_TOOLTIP_IN_BOTH = false
    }
    else if (ev.keyCode == 50 && (ev.ctrlKey == true || ev.shiftKey == true || ev.altKey == true || ev.metaKey == true)) { // 2
        SHOW_TOOLTIP_IN_PLOT1 = false
        SHOW_TOOLTIP_IN_PLOT2 = true
        SHOW_TOOLTIP_IN_BOTH = false
    }
    else if (ev.keyCode == 51 && (ev.ctrlKey == true || ev.shiftKey == true || ev.altKey == true || ev.metaKey == true)) { // 3
        SHOW_TOOLTIP_IN_PLOT1 = true
        SHOW_TOOLTIP_IN_PLOT2 = true
        SHOW_TOOLTIP_IN_BOTH = false
    }
    else if (ev.keyCode == 52 && (ev.ctrlKey == true || ev.shiftKey == true || ev.altKey == true || ev.metaKey == true)) { // 4
        SHOW_TOOLTIP_IN_BOTH = true
    }
}


window.onmousemove = function(ev) {
    ev.preventDefault();
    if (ev.ctrlKey)
        console.log(ev)
}

//$(window).bind('wheel mousewheel DOMMouseScroll', function (ev) {
//    ev.preventDefault();
//    if (ev.ctrlKey == true || ev.shiftKey == true || ev.altKey == true || ev.metaKey == true) {
//        SCALE2 += ev.detail * -0.01;
//        $('body').css({'transform': 'scale('+ SCALE2 +')'})
//        //$('body').css({'transform-origin': 'top left'})
//    }
//})

function drawLine() {
    //polygon(-10% -10%, 110% -10%, 110% 110%, 42% 110%, 42% 80%, -10% 20%);
    //var context = glass.getContext('2d')
    var width = canvas.width
    var height = canvas.height
    var points = [width*0, height*0.2, width*0.42, height*0.8, width*0.42, height*1]
    context.clearRect(0, 0, width, height)
    context.beginPath()
    context.moveTo(points[0], points[1])
    for (var i=2; i<points.length; i+=2) {
        context.lineTo(points[i], points[i+1])
    }
    context.stroke()
}

function sortNodes(a, b) {
    var p1 = a.__data__.node.pointNumber
    var p2 = b.__data__.node.pointNumber
    var r = p1 < p2 ? -1 : p1 > p2 ? 1 : 0
    return r
}
function sortLinks(a, b) {
    var p1 = a.__data__.link.pointNumber
    var p2 = b.__data__.link.pointNumber
    var r = p1 < p2 ? -1 : p1 > p2 ? 1 : 0
    return r
}

function unpack(rows, key) {
    return rows.map(function(row) { return row[key]; });
}

function straightlineEquation(x1, y1, x2, y2, x) {
    var y = ((y2 - y1) / (x2 - x1)) * (x - x1) + y1
    return y
}

function searchPerformer(ev) {
  ev.preventDefault()
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('searchInput');
  filter = input.value.toUpperCase();
  
  if (filter.length > 0) {
      $('#searchCloseButton').show()
      $('div.searchResults').show()
      ul = document.getElementById('searchUL');
      li = ul.getElementsByTagName('li');
      
      var counter = 0
      // Loop through all list items, and hide those who don't match the search query
      for (i = 0; i < li.length; i++) {
        a = li[i]//.getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
          counter ++;
        } else {
          li[i].style.display = "none";
        }
      }
      if (counter) {
        $('#noResults').hide()
        $('.searchResults').css({'background-color': 'white'})
      }
      else {
        $('#noResults').show()
        $('.searchResults').css({'background-color': 'rgb(0,0,0,0)'})
      }
  }
  else {
      //$('#searchCloseButton').hide()
      $('#searchUL li.liPerformer').hide()
      $('div.searchResults').hide()
  }
}

function closeSearch(ev) {
    ev.preventDefault()
    document.getElementById('searchInput').value = ''
    $('#searchCloseButton').hide()
    $('#searchUL li.liPerformer').hide()
    $('div.searchResults').hide()
    
    $('#searchInput').blur()
//    $('#searchBar').css({'margin-top': 'none'})
//    $('#searchCloseButton').css({'margin-top': 'none'})
    $('#instructions .title').show()
    $( "#instructions" ).slideDown("slow", function() {
    })
    SEARCH_IS_ACTIVE = false
    return false
}

function formatId(s) {
    return s
        .replaceAll(',', '')
        .replaceAll('.', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('[', '')
        .replaceAll(']', '')
        .replaceAll("'", '-')
        .replaceAll(' ', '-')
}

function interactWithPerformer(ev) {
    var performer = ev.target.id
    var elems = $('#plot2 g.sankey-node:contains('+performer+')')
    elems.sort(sortNodes)
    var elem = elems[0]
    elem.dispatchEvent(new MouseEvent(ev.type))
    if (ev.type == 'mousedown') {
        $(this).toggleClass('selected')
    }
    if (ev.type != 'mouseout') {
        var position = elem.getBoundingClientRect()
        updateGlassViewFromSearch(position)
    }
}

function startGlassView() {
    setTimeout(() => {
        var a = plot2rect.right
        var b = plot2rect.bottom
        updateGlassViewAux(a, b, false, 'end')
    }, 0)
    setTimeout(() => {
        var x = plot2rect.left
        var y = plot2rect.top
        updateGlassViewAux(x, y, true, 'start')
    }, 1000)
}

function updateGlassViewFromSearch(position) {
    var pos, x, y
    pos = position
    x = pos.x
    y = pos.y
    
    updateGlassViewAux(x, y, true)
}

function updateGlassViewAux(x, y, fromSearch=false, fromStart='no') { // fromStart = 'no' | 'start' | 'end'
    var x1start = plot1rect.x
    var x1end   = plot1rect.x + plot1rect.width
    var y1start = plot1rect.y
    var y1end   = plot1rect.y + plot1rect.height
    var x2start = plot2rect.x
    var x2end   = plot2rect.x + plot2rect.width
    var y2start = plot2rect.y
    var y2end   = plot2rect.y + plot2rect.height

//    var x1start = plot2rect.x - PLOT2_LEFT_OFFSET
//    var x1end = x1start + WIDTH
//    var y1start = plot2rect.y - PLOT2_TOP_OFFSET
//    var y1end = y1start + HEIGHT
//    var x2start = plot2rect.x - PLOT2_LEFT_OFFSET
//    var x2end = x2start + plot2rect.width
//    var y2start = plot2rect.y - PLOT2_TOP_OFFSET
//    var y2end = y2start + plot2rect.height

    if (fromStart == 'no') {
        var clipped = !$(glass).hasClass('rollingwindow2')
        var w = glass.offsetWidth * (clipped ? 0.6 : 0.5);
        var h = glass.offsetHeight * (clipped ? 0.4 : 0.5);
    }
    else {
        var isStart = fromStart == 'start'
        var w = glass.offsetWidth * (isStart ? 0.1 : 0.9);
        var h = glass.offsetHeight * (isStart ? -0.1 : 0.9);
    }
    if (!fromSearch) {
        x += x2start
        y += y2start
    }
    var mappedX = straightlineEquation(x2start, x1start, x2end, x1end, x)
    var mappedY = straightlineEquation(y2start, y1start, y2end, y1end, y)
    
    if ($(glass).hasClass('fullscreen')) {
        w = straightlineEquation(x2start, x2start, x2end, x2end, x)
        h = straightlineEquation(y2start, y2start, y2end, y2end, y)
    }
    
    if (fromSearch) {
        plot1content.classList.add('transition')
    }
    plot1content.style.top = -(mappedY - h - y1start) + 'px'
    plot1content.style.left = -(mappedX - w - x1start) + 'px'
    if (fromSearch) {
        plot1content.offsetHeight; // Trigger a reflow, flushing the CSS changes
        plot1content.classList.remove('transition')
    }
}

function zoom(ev, manual=false) {
//    ev.preventDefault();
//    scale += ev.deltaY * -0.01;
//    // Restrict scale
//    scale = Math.min(Math.max(.125, scale), 4);
//    // Apply scale transform
//    el.style.transform = `scale(${scale})`;

    if (!manual) {
        ev.preventDefault();
        if (ev.type == 'wheel') {
            //SCALE1 += ev.deltaY * -0.01;
            SCALE1 += Math.sign(ev.deltaY) * -0.05;
            SCALE1 = SCALE1 > 2 ? 2 : SCALE1
            SCALE1 = SCALE1 < SCALE3 ? SCALE3 : SCALE1
        }
        else if (ev.type == 'click') {
            SCALE1 = SCALE1ORIGINAL
        }
    }
    else {
        SCALE1 = SCALE*1.15
    }
    $('#plot1 .svg-container').css({'transform': 'scale('+ SCALE1 +')'})
    $('#plot1 .svg-container').css({'transform-origin': 'top left'})
    var rect = plot1content.getBoundingClientRect()
    plot1rect.width = rect.width
    plot1rect.height = rect.height
    $('#plot1 svg.main-svg').css({
        'height': $('#plot1 .svg-container').css('height'),
        'width': $('#plot1 .svg-container').css('width'),
    })
    //plot1rect = rect
    
    if (!manual)
        updateGlassView(ev)
}

function getCursorPos(e) {
    var a, x = 0, y = 0;
    e = e || window.event;
    /*get the x and y positions of the image:*/
    a = plot2rect
    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /*consider any page scrolling:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x : x, y : y};
}

function getGlassPos() {
    var a, x = 0, y = 0
    /*get the x and y positions of the glass:*/
    a = plot2rect
    /*calculate glass' center*/
    x = a.left + a.width/2
    y = a.top + a.height/2
    /*consider any page scrolling:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x : x, y : y};
}

function updateGlassView(e) {
    if (!FREEZE) {
        var pos, x, y
        /*prevent any other actions that may occur when moving over the image*/
        /*get the glass' x and y positions:*/
        //pos = getGlassPos()
        pos = getCursorPos(e)
        x = pos.x
        y = pos.y
        
        updateGlassViewAux(x, y)
    }
}

function interactWithPerformer2(ev) {
    var elem
    if ($(ev.currentTarget).attr('class') == 'sankey-node') {
        var i = nodes2a.indexOf(ev.currentTarget)
        elem = nodes1a[i]
    }
    else if ($(ev.currentTarget).attr('class') == 'sankey-link') {
        var i = links2.indexOf(ev.currentTarget)
        elem = links1[i]
    }
    elem.dispatchEvent(new MouseEvent(ev.type))
}

function formatTooltipOver(ev) {
    var scale1 = SCALE1
    var scl1 = 1 / scale1
    $('#plot1 g.hoverlayer').css({
        'transform': 'scale('+scl1+')',
        'opacity': SHOW_TOOLTIP_IN_PLOT1 ? 1 : 0
    })
    $('.js-plotly-plot g.hovertext path:first').css('fill-opacity', 0.85)
    // Format number
    if ($(this).attr('class') == 'sankey-node') {
        if (this.__data__.node.nodeType__2 == 'checkin') {
            formatTooltipNumber(this.__data__.node)
        }
    }
    if (SHOW_TOOLTIP_IN_PLOT2) {
        $('#title, #desc, #myglass').css('z-index', -1)
        if (!SEARCH_IS_ACTIVE)
            $('#sidebar').css('z-index', -1)
        var tooltip = $('#plot1 g.hovertext')
        var translation = tooltip.attr('transform')
        if (translation) {
            var scale2 = SCALE3
            var scl2 = 1 / scale2
            var coords = eval(translation.slice(translation.indexOf('(')).replace('(', '[').replace(')', ']'))
//            var coords = translation.replace(',', 'px,').replace(')', 'px)')
            var x = coords[0] * scale2 / scale1
            var y = coords[1] * scale2 / scale1
            $('#plot1 g.hovertext').clone(true).appendTo('#plot2 g.hoverlayer')
            $('#plot2 g.hoverlayer').css({
                'transform': 'scale('+scl2+')'
            })
            $('#plot2 g.hovertext').css({
                'transform': 'translate('+x+'px,'+y+'px)'
            })
            
            // Flip tooltip horizontally
            tooltipRect = $('#plot2 g.hoverlayer')[0].getBoundingClientRect()
            if ($(this).attr('class') == 'sankey-node') {
                if (this.__data__.node.nodeType__2 == 'cast') {
                    if (performerTooltipMustBeFlipped())
                        flipPerformerTooltip()
                }
                else if (this.__data__.node.nodeType__2 == 'checkin') {
                    if (checkinTooltipMustBeFlipped())
                        flipCheckinTooltip()
                }
            }
            else if ($(this).attr('class') == 'sankey-link') {
//                if (linkTooltipMustBeFlipped())
//                    flipLinkTooltip()
                if (performerTooltipMustBeFlipped())
                    flipPerformerTooltip()
            }
        }
    }
}

function tooltipLeftOverflows() {
    return tooltipRect.left < plot2rect.left
}

function tooltipRightOverflows() {
    return tooltipRect.right > plot2rect.right
}

//function tooltipOverlapsSidebar() {
//    var rect1 = tooltipRect
//    var rect2 = sidebarRect
//    var overlap = !(rect1.right  < rect2.left   || 
//                    rect1.left   > rect2.right  || 
//                    rect1.bottom < rect2.top    || 
//                    rect1.top    > rect2.bottom)
//    return overlap
//}

//function tooltipOverlapsGlass() {
//    var rect1 = tooltipRect
//    var rect2 = glassRect
//    var overlap = !(rect1.right  < rect2.left   || 
//                    rect1.left   > rect2.right  || 
//                    rect1.bottom < rect2.top    || 
//                    rect1.top    > rect2.bottom)
//    return overlap
//}

function performerTooltipMustBeFlipped() {
    return tooltipLeftOverflows()// || tooltipOverlapsSidebar()
}

function checkinTooltipMustBeFlipped() {
    return tooltipLeftOverflows()// || tooltipOverlapsSidebar()
}

function linkTooltipMustBeFlipped() {
    return tooltipRightOverflows()// || tooltipOverlapsGlass()
}

var CHROME_FACTOR = 1.02
function flipPerformerTooltip() {
    $('#plot2 g.hovertext path').css({
        'transform': 'scaleX(-1)'
    })
    var x = tooltipRect.width
    if (isChrome) x *= CHROME_FACTOR
    $('#plot2 g.hovertext text').css({
        'transform': 'translateX('+x+'px)'
    })
}

function flipCheckinTooltip() {
    var rectRect = $('#plot2 g.hovertext rect')[0].getBoundingClientRect()
    var pathRect = $('#plot2 g.hovertext path')[0].getBoundingClientRect()
    $('#plot2 g.hovertext path, #plot2 g.hovertext rect').css({
        'transform': 'scaleX(-1)'
    })
    var x = rectRect.width/2 + pathRect.width*2
    if (isChrome) x *= CHROME_FACTOR**2
    $('#plot2 g.hovertext text:first').css({
        'transform': 'translateX('+x+'px)'
    })
    var x = pathRect.width
    if (isChrome) x *= CHROME_FACTOR**2
    $('#plot2 g.hovertext text:last').css({
        'transform': 'translateX('+x+'px)'
    })
}

function flipLinkTooltip() {
    $('#plot2 g.hovertext path').css({
        'transform': 'scaleX(-1)'
    })
    var x = -tooltipRect.width
    if (isChrome) x *= CHROME_FACTOR**2
    $('#plot2 g.hovertext text').css({
        'transform': 'translateX('+x+'px)'
    })
}

function formatTooltipNumber(node) {
//    var tooltip = $('.js-plotly-plot g.hovertext')
//    if (node.color == 'black') { // comprehensive check-in
//    }
//    else { // node.color == 'lightgray' // non-comprehensive check-in
        $('.js-plotly-plot g.hovertext rect:first').hide()
        $('.js-plotly-plot g.hovertext text:first').hide()
//    }
}

function formatTooltipOut(ev) {
    $('.js-plotly-plot g.hovertext').remove()
    $('#title, #desc').css('z-index', 'auto')
    $('#myglass').css('z-index', 300)
    if (!SEARCH_IS_ACTIVE)
        $('#sidebar').css('z-index', 300)
}

//function onPlot(ev) {
//    if (SHOW_TOOLTIP_IN_BOTH) {
//        if (this.id == 'plot1') {
//            SHOW_TOOLTIP_IN_PLOT1 = true
//            SHOW_TOOLTIP_IN_PLOT2 = false
//        }
//        else if (this.id == 'plot2') {
//            SHOW_TOOLTIP_IN_PLOT1 = false
//            SHOW_TOOLTIP_IN_PLOT2 = true
//        }
//    }
//}

function onPlot(ev) {
    if (SHOW_TOOLTIP_IN_BOTH) {
        if ($(this).parents('#plot1').length == 1) {
            SHOW_TOOLTIP_IN_PLOT1 = true
            SHOW_TOOLTIP_IN_PLOT2 = false
        }
        else if ($(this).parents('#plot2').length == 1) {
            SHOW_TOOLTIP_IN_PLOT1 = false
            SHOW_TOOLTIP_IN_PLOT2 = true
        }
    }
}

// https://iconmonstr.com/

