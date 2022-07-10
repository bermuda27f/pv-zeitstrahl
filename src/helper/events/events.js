import { buildToolTip } from '../../graphics/draw/tooltips.js';
import * as toggleFuncs from  '../../graphics/update/toggle.js';

import * as d3_select from 'd3-selection';

export function mouse(eType, type, key, props, e, d) {

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

export function showTooltip(props){

    const {
        type,
        key,
        e,
        d,
    } = props.mouseEvents

    if(!props.highlight.highlight_main || key !== props.highlight.key){
        if(e && e.type !== "click" && !props.state.isTouch) {
            buildToolTip(props, e, d, "name");
        }
    }
}

export function toggle(props, mode, switchMode, eventType) {

    function toggleLineSymbol(type, key, _mode) {
        const el = props.state.selections.events.select("#img_node_" + key)
        const circle = el.select("circle");
        const line = el.select("line");
        console.log(line)

        circle.attr("stroke", _mode ? props.state.highlightColor : props.state.standardColor);
        line.attr("stroke", _mode ? props.state.highlightColor : props.state.standardColor)
            .attr("opacity", _mode ? 1 : props.state.handle.opacity)
            .attr("stroke-width", _mode ? 1.5 : props.state.handle.lineWidth);
    }

    let _type, _key, _d
    const t = props.state.transition

    switch(switchMode){
        case "new":
            _type = props.mouseEvents.type;
            _key = props.mouseEvents.key;
            _d = props.mouseEvents.d;
            break;
        case "switch" :
            _type = props.highlight.ident;
            _key = props.highlight.key;
            _d = props.highlight.element
            break;
        default:
            break;
    }
   
    switch(_type){
        case "events" :
        case "persons" :
            toggleLineSymbol(_type, _key, mode);
            // if(eventType === "click" && _type !== "perioden"){
            //     props.state.selections.HL_NavLine
            //         .transition(t)
            //         .attr("x1", props.state.x_scale(_d.Datum))
            //         .attr("x2", props.state.x_scale(_d.Datum))
            //         .attr("opacity", mode ? 1 : 0)
            // }
            break;
        default:
            break;
        }

    switch(_type){
        case "events":
            if(eventType === "click"){
                const el = props.state.selections.events.select("#img_node_" + _key)
                el.raise();
                // if(props.highlight.ident === "perioden") toggleLineSymbol(props.highlight.ident, props.highlight.key, false) 
                // if(switchMode === "new") toggleLineSymbol("perioden", _key, true)
                // toggleFuncs.highlighter(props, _d, mode, "main") 
                // toggleFuncs.highlighterNAV(props, _d, mode, "perioden");
            }
            break;
        default:
            break;
    }

}
