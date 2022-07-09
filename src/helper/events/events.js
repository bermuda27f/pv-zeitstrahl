import { buildToolTip } from '../../graphics/draw/tooltips.js';
import * as toggleFuncs from  '../../graphics/update/toggle.js';

import * as d3_select from 'd3-selection';

export function mouse(eType, type, key, props, e, d) {

    // eType = click, mouseleave etc.
    // type = bars or event-handles?
    // key = item name
    // dataset = ereignisse or kaiser

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
        const symbol = d3_select.select("#symbol_" + type + "_" + key);
        const lines = d3_select.selectAll(".normalLine_" + type + "_" + key);
        symbol
            .attr("opacity", _mode ? 1 : props.state.ereignisHandle.opacity)
            .attr("fill", _mode ? props.state.highlightColor : props.state.standardColor);
        lines.attr("opacity", _mode ? 1 : props.state.ereignisHandle.opacity);
        lines.attr("stroke", _mode ? props.state.highlightColor : props.state.standardColor);
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
        case "wahlen" :
        case "perioden" :
            toggleLineSymbol(_type, _key, mode);
            if(eventType === "click" && _type !== "perioden"){
                props.state.selections.HL_NavLine
                    .transition(t)
                    .attr("x1", props.state.x_scale(_d.Datum))
                    .attr("x2", props.state.x_scale(_d.Datum))
                    .attr("opacity", mode ? 1 : 0)
            }
            break;
        case "partei" :
            const path = d3_select.select("#" + _key + "_path")
            path.attr("stroke-width", mode ? props.state.graphHighlight.pathActive : props.state.graphHighlight.pathIdle)
            path.transition(t).attr("opacity", mode ? 
                props.state.pathOpacity.active : props.parteienState["checked_" + _key] ? 
                props.state.pathOpacity.active : props.state.pathOpacity.disabled)
            break;
        default:
            break;
        }

    switch(_type){
        case "perioden":
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
