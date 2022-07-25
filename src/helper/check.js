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

export function eventsVisible(stateRefs, x_scale, on){

    const { state } = stateRefs

    let calc_events = []
    if(on){
        calc_events = state.data.events.map((event, i) => { 
            return {
                ...event, 
                x : x_scale(new Date(event.datum))
            } 
        }).filter((event) => { return !(event.x <= 0 || event.x >= state.width)})
    }

    return calc_events
}