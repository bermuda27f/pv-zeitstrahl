import * as toggle from  '../../graphics/update/toggle.js';

export function fire(props, mode, switchMode, eventType) {

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
            toggle.eventElement(props, _key, mode);
            break;
        case "persons" :
            if(eventType === "click") toggle.person(props, _key, mode)
            break;
        default:
            break;
    }

}