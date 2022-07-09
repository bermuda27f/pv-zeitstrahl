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
        const circle = props.state.selections.events.selectAll("circle");
        //lines.attr("opacity", _mode ? 1 : props.state.ereignisHandle.opacity);
        circle.attr("stroke", _mode ? props.state.highlightColor : props.state.standardColor);
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
            if(eventType === "click" && _type !== "perioden"){
                props.state.selections.HL_NavLine
                    .transition(t)
                    .attr("x1", props.state.x_scale(_d.Datum))
                    .attr("x2", props.state.x_scale(_d.Datum))
                    .attr("opacity", mode ? 1 : 0)
            }
            break;
        default:
            break;
        }

    switch(_type){
        case "persons":
            if(eventType === "click"){
                if(props.highlight.ident === "perioden") toggleLineSymbol(props.highlight.ident, props.highlight.key, false) 
                if(switchMode === "new") toggleLineSymbol("perioden", _key, true)
                toggleFuncs.highlighter(props, _d, mode, "main") 
                toggleFuncs.highlighterNAV(props, _d, mode, "perioden");
            }
            break;
        default:
            break;
    }

}
