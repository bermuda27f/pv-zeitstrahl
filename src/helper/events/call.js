import * as handleEvents from  './events.js';

export function events(type, key, props) {
    return (g) => {
        g.on("mouseenter", (e, d) => {
            if(!props.state.isTouch) set("enter", type, key, props, e, d)
        });
        g.on("mouseleave", (e, d) => {
            if(!props.state.isTouch) set("leave", type, key, props, e, d)}
            );
        g.on("click", (e, d) => {
            if(!props.state.isTouch) set("click", type, key, props, e, d)
        });
        g.on("touchstart", (e, d) => {
            if(props.state.isTouch) set("click", type, key, props, e, d)
        });

    };
}

export function behaviour(active) {
    return (g) => {
        g.attr("cursor", active ? "pointer" : "none")
        g.style("pointer-events", active ? "auto" : "none")
    }
}

function set(eType, type, key, props, e, d) {

    // eType = click, mouseleave etc.
    // type = bars or event-handles?
    // key = item name
    // dataset = events or persons

    props.setMOUSE({
        type : "MULTIPLE", 
        value : { 
            mouseEvent : eType,
            type : type,
            key : d.id,
            dataSet : type,
            e : e,
            d : d
        }
    })
}