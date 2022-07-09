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
