var TIMELINE_COLORS = {
    zone1: [5, 50, 'grey'],
    zone2: [],
}

function get_first_date_index(colors) {
    var r = 0
    var found = false
    var i = 1
    while (i < colors.length - 1 && !found) {
        if (colors[i] == colors[r]) {
            r = i
            i++
        }
        else {
            r = i
            found = true
        }
    }
    return r
}

function fff() {
    var total_size = data['node']['color'].length
    var cast_size = get_first_date_index(data['node']['color'])
    var n_layers = total_size - cast_size * 2 + 2
    var n_zones = n_layers - 1
    console.log(n_zones)
    
    var sankey_div = document.getElementById(div_id)
    var sankey_width = div.offsetWidth
    var zone_width = sankey_width / n_zones
    var edge_width_percent = 5

}

function add_timeline(main_div_id) {
    
    if (typeof TIMELINE1 !== 'undefined' && TIMELINE1) {
        var r = "linear-gradient(to top, white 0%, white 3%, transparent 50%, white 97%, white 100%), linear-gradient(to right, white 0%, white 5.275%, grey 5.275%, grey 19.5%, lightgrey 19.5%, lightgrey 44.875%, grey 44.875%, grey 65.6%, lightgrey 65.6%, lightgrey 82.1%, grey 82.1%, grey 93.8%, white 93.8%, white 100%)"
        
        text_div_1 = document.createElement('div')
        text_div_1.innerHTML = 'Period 1<br>May 1947 - Jul 1950'
        text_div_1.style.position = "relative";
        text_div_1.style.top = "-70%";
        text_div_1.style.left = "8%";
        text_div_1.style.fontSize = "30px";
        text_div_1.style.width = "350px";
        //text_div_1.style.transform = "translate(-60%, 10%)";
        
        text_div_2 = document.createElement('div')
        text_div_2.innerHTML = 'Period 2<br>Jul 1950 - Nov 1955'
        text_div_2.style.position = "relative";
        text_div_2.style.top = "-47%";
        text_div_2.style.left = "28%";
        text_div_2.style.fontSize = "30px";
        text_div_2.style.width = "350px";
        //text_div_1.style.transform = "translate(-60%, 10%)";
        
        text_div_3 = document.createElement('div')
        text_div_3.innerHTML = 'Period 3<br>Nov 1955 - Feb 1957'
        text_div_3.style.position = "relative";
        text_div_3.style.top = "-35%";
        text_div_3.style.left = "51%";
        text_div_3.style.fontSize = "30px";
        text_div_3.style.width = "350px";
        //text_div_1.style.transform = "translate(-60%, 10%)";
        
        text_div_4 = document.createElement('div')
        text_div_4.innerHTML = 'Period 4<br>Feb 1957 - Mar 1958'
        text_div_4.style.position = "relative";
        text_div_4.style.top = "-35%";
        text_div_4.style.left = "69%";
        text_div_4.style.fontSize = "30px";
        text_div_4.style.width = "350px";
        //text_div_1.style.transform = "translate(-60%, 10%)";
        
        text_div_5 = document.createElement('div')
        text_div_5.innerHTML = 'Period 5<br>Mar 1958 - Apr 1960'
        text_div_5.style.position = "relative";
        text_div_5.style.top = "-47%";
        text_div_5.style.left = "83%";
        text_div_5.style.fontSize = "30px";
        text_div_5.style.width = "350px";
        //text_div_1.style.transform = "translate(-60%, 10%)";
        
    }
    if (typeof TIMELINE2 !== 'undefined' && TIMELINE2) {
        var r = "linear-gradient(to top right, white 0%, white 30%, transparent 50%, white 65%, white 100%), linear-gradient(to top, white 0%, white 3%, transparent 50%, white 97%, white 100%), linear-gradient(to right, white 0%, white 5.275%, grey 5.275%, grey 19.5%, lightgrey 19.5%, lightgrey 44.875%, grey 44.875%, grey 65.6%, lightgrey 65.6%, lightgrey 82.1%, grey 82.1%, grey 93.8%, white 93.8%, white 100%)"
        
        text_div_1 = document.createElement('div')
        text_div_1.innerHTML = 'Period 1<br>May 1947 - Jul 1950'
        text_div_1.style.position = "relative";
        text_div_1.style.top = "0%";
        text_div_1.style.left = "5%";
        text_div_1.style.fontSize = "30px";
        text_div_1.style.width = "350px";
        //text_div_1.style.transform = "translate(-60%, 10%)";
        
        text_div_2 = document.createElement('div')
        text_div_2.innerHTML = 'Period 2<br>Jul 1950 - Nov 1955'
        text_div_2.style.position = "relative";
        text_div_2.style.top = "0%";
        text_div_2.style.left = "18%";
        text_div_2.style.fontSize = "30px";
        text_div_2.style.width = "350px";
        //text_div_1.style.transform = "translate(-60%, 10%)";
        
        text_div_3 = document.createElement('div')
        text_div_3.innerHTML = 'Period 3<br>Nov 1955 - Feb 1957'
        text_div_3.style.position = "relative";
        text_div_3.style.top = "0%";
        text_div_3.style.left = "35%";
        text_div_3.style.fontSize = "30px";
        text_div_3.style.width = "350px";
        //text_div_1.style.transform = "translate(-60%, 10%)";
        
        text_div_4 = document.createElement('div')
        text_div_4.innerHTML = 'Period 4<br>Feb 1957 - Mar 1958'
        text_div_4.style.position = "relative";
        text_div_4.style.top = "0%";
        text_div_4.style.left = "49%";
        text_div_4.style.fontSize = "30px";
        text_div_4.style.width = "350px";
        //text_div_1.style.transform = "translate(-60%, 10%)";
        
        text_div_5 = document.createElement('div')
        text_div_5.innerHTML = 'Period 5<br>Mar 1958 - Apr 1960'
        text_div_5.style.position = "relative";
        text_div_5.style.top = "0%";
        text_div_5.style.left = "59%";
        text_div_5.style.fontSize = "30px";
        text_div_5.style.width = "350px";
        //text_div_1.style.transform = "translate(-60%, 10%)";
        
    }
    
    sankey_svg = jQuery("svg.main-svg:first-of-type")
    sankey_svg.css("background", r)
    
    main_div = document.getElementById(main_div_id)
    
    main_div.appendChild(text_div_1)
    main_div.appendChild(text_div_2)
    main_div.appendChild(text_div_3)
    main_div.appendChild(text_div_4)
    main_div.appendChild(text_div_5)
    
}










