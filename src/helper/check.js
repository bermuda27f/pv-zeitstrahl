import * as d3_array from 'd3-array';

export function touchDevice () {  
    try {  
        document.createEvent("TouchEvent");  
        return true;  
    } catch (e) {  
        return false;  
    }  
}

export function sameHighlight (props, type, key) {
    return (type === props.highlight.ident) && (key === props.highlight.key)
}

export function eventsVisible(state, setState, zoomInfo){

    const calc_events = state.data.events.map((event, i) => { 
        return {
            ...event, 
            x : zoomInfo.scaleX(event.datum)
        } 
    }).filter((event) => { return !(event.x <= 0 || event.x >= state.width) })


    setState({
        ...state,
        data : {
            ...state.data,
            events_visible : calc_events
        }
    })
}