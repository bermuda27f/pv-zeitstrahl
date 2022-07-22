import { buildToolTip } from '../../graphics/draw/tooltips.js';
import * as toggleFuncs from  '../../graphics/update/toggle.js';
import * as d3_array from 'd3-array';

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
            toggleEventElement(props, _key, mode);
            break;
        case "persons" :
            if(eventType === "click") togglePerson(props, _key, mode)
            break;
        default:
            break;
    }

}

function toggleEventElement({state}, key, on) {

    const el = state.selections.events.select("#img_node_" + key)
    const circle = el.select("circle");
    const line = el.select("line");

    circle.attr("stroke", on ? state.highlightColor : state.standardColor)
        .attr("stroke-width", on ? state.handle.lineWidth.highlight : state.handle.lineWidth.normal);
    line.attr("stroke", on ? state.highlightColor : state.standardColor)
        .attr("opacity", on ? 1 : state.handle.opacity)
        .attr("stroke-width", on ? state.handle.lineWidth.highlight : state.handle.lineWidth.normal);
}

function togglePerson({state}, id, on) {

    const el = state.selections.personHL.select("rect")

    el.transition(state.transition)
        .attr("y", state.y_scale(id + 3))
        .attr("opacity", on ? 1 : 0)
}

export function setOrder (props, _key){

    const el = props.state.selections.events.select("#img_node_" + _key)
    const oldOrder = el.data()[0].order
    el.raise();

    const tmpArray = JSON.parse(JSON.stringify(props.state.data.events))
        .map((event, i) => {
            if(event.order < oldOrder){
                return { ...event, order : event.order + 1 }
            }
            else if(event.order === oldOrder ){
                return { ...event, order : 0 }
            }
            else { return { ...event } }
        }).sort((a,b) => { return d3_array.descending(a.order, b.order) })

    const newData = {
        ...props.state.data,
        events : tmpArray,
    }

    props.setState({
        ...props.state,
        data : newData
    })
}