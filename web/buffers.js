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

function add_nodes_and_links(data, left_node, right_node, nLeft, nRight) {
    var N_SPACES_LEFT = nLeft
    var N_SPACES_RIGHT = nRight
    
    var next_node_index = data['node']['color'].length
    
    for (var i=0; i<N_SPACES_LEFT+N_SPACES_RIGHT; i++) {
        data['node']['label'].push('')
        data['node']['color'].push('transparent')
        data['node']['nodeType__2'].push('space')
    }
    for (var i=0; i<N_SPACES_LEFT; i++) {
        if (i == N_SPACES_LEFT - 1) {
            data['link']['target'].unshift(left_node)
        }
        else {
            data['link']['target'].unshift(next_node_index + 1)
        }
        data['link']['source'].unshift(next_node_index)
        data['link']['value'].unshift(0.01)
        data['link']['label'].unshift(-1)
        data['link']['color'].unshift('transparent')
        
        next_node_index++
    }
    for (var i=0; i<N_SPACES_RIGHT; i++) {
        if (i == 0) {
            data['link']['source'].unshift(right_node)
        }
        else {
            data['link']['source'].unshift(next_node_index - 1)
        }
        data['link']['target'].unshift(next_node_index)
        data['link']['value'].unshift(0.01)
        data['link']['label'].unshift(-1)
        data['link']['color'].unshift('transparent')
        
        next_node_index++
    }
    return data
}

// BUFFER EDGES
function add_buffers(data, nLeft, nRight) {
    
    var next_node_index = data['node']['color'].length
    var first_date_index = get_first_date_index(data['node']['color'])
    var last_date_index =  next_node_index - first_date_index - 1
    
    data = add_nodes_and_links(data, first_date_index, last_date_index, nLeft, nRight)
    
    return data
}
// END BUFFER EDGES


function add_buffers2(data, nLeft, nRight) {
    
    var next_node_index = data['node']['color'].length
    var first_date_index = get_first_date_index(data['node']['color'])
    var last_date_index =  next_node_index - first_date_index - 1
    
    
    
    //Vertical fill
    
    for (var i=0; i<next_node_index*2; i++) {
        data['node']['label'].push('x')
        data['node']['color'].push('black')
    }
    for (var i=0; i<next_node_index-1; i++) {
        data['link']['source'].unshift(next_node_index + i)
        data['link']['target'].unshift(next_node_index*2 + i)
        data['link']['value'].unshift(0.01)
        data['link']['label'].unshift(-1)
        data['link']['color'].unshift('black')
        
    }
    var next_node_index = data['node']['color'].length
    
    //Horizontal fill
    
    n_levels = next_node_index - first_date_index * 2 + 2
    
    for (var i=0; i<n_levels+nLeft+nRight; i++) {
        data['node']['label'].push('')
        data['node']['color'].push('white')
    }
    for (var i=0; i<n_levels-1+nLeft+nRight; i++) {
        data['link']['source'].unshift(next_node_index + i)
        data['link']['target'].unshift(next_node_index + i + 1)
        data['link']['value'].unshift(0.01)
        data['link']['label'].unshift(-1)
        data['link']['color'].unshift('black')
        
    }
    
    n_nodes = next_node_index
    n_cast = first_date_index
    //n_links = data['link']['source'].length
    for (var i=0; i<n_cast; i++) {
        j = n_nodes - n_cast + i
        var first_verticals = []
        var last_verticals = []
        for (var k=0; k<data['link']['source'].length; k++) {
            if (data['link']['source'][k] == i) {
                first_verticals.push(data['link']['target'][k])
            }
            if (data['link']['target'][k] == j) {
                last_verticals.push(data['link']['source'][k])
            }
        }
        m1 = Math.min.apply(null, first_verticals)
        m2 = Math.max.apply(null, last_verticals)
        
        level1 = m1 - n_cast + 1
        level2 = m2 - n_cast + 1
        
        node1 = next_node_index + level1 - 2
        node2 = next_node_index + level2 + 2
        
        
        if (level1 >= 2) {
        data['link']['source'].unshift(node1)
        data['link']['target'].unshift(i)
        data['link']['value'].unshift(0.01)
        data['link']['label'].unshift(-1)
        data['link']['color'].unshift('white')
        }
        if (level2 < n_levels - 2) {
        data['link']['source'].unshift(j)
        data['link']['target'].unshift(node2)
        data['link']['value'].unshift(0.01)
        data['link']['label'].unshift(-1)
        data['link']['color'].unshift('white')
        }
    }


    
}


function add_buffers_no(data, nLeft, nRight) {
    
    var next_node_index = data['node']['color'].length
    var first_date_index = get_first_date_index(data['node']['color'])
    var last_date_index =  next_node_index - first_date_index - 1
    
    //console.log(first_date_index)
    //console.log(last_date_index)
    
    n_nodes = next_node_index
    n_cast = first_date_index
    //n_links = data['link']['source'].length
    for (var i=0; i<n_cast; i++) {
        j = n_nodes - n_cast + i
        var first_verticals = []
        var last_verticals = []
        for (var k=0; k<data['link']['source'].length; k++) {
            if (data['link']['source'][k] == i) {
                first_verticals.push(data['link']['target'][k])
            }
            if (data['link']['target'][k] == j) {
                last_verticals.push(data['link']['source'][k])
            }
        }
        m1 = Math.min.apply(null, first_verticals)
        m2 = Math.max.apply(null, last_verticals)
        
        n1 = m1 - n_cast
        n2 = n_nodes - n_cast - 1 - m2
        
        
        data = add_nodes_and_links(data, i, j, n1, n2, -2)
        
        //var N_SPACES_LEFT = n1 // +- nLeft
        //var N_SPACES_RIGHT = n2 //+- nRight
        
        //
    }
    return data
}









function qqq(){

    for (var i=last_date_index + 1; i<next_node_index; i++) {
        data['node']['color'][i] = 'orange'
    }



}








