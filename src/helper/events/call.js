import * as handleEvents from  './events.js';

export function events(type, key, props) {
    return (g) => {
        g.on("mouseenter", (e, d) => {
            if(!props.state.isTouch) handleEvents.mouse("enter", type, key, props, e, d)
        });
        g.on("mouseleave", (e, d) => {
            if(!props.state.isTouch) handleEvents.mouse("leave", type, key, props, e, d)}
            );
        g.on("click", (e, d) => {
            if(!props.state.isTouch) handleEvents.mouse("click", type, key, props, e, d)
        });
        g.on("touchstart", (e, d) => {
            if(props.state.isTouch) handleEvents.mouse("click", type, key, props, e, d)
        });

    };
}

export function behaviour(active) {
    return (g) => {
        g.attr("cursor", active ? "pointer" : "none")
        g.style("pointer-events", active ? "auto" : "none")
    }
}