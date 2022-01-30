export function isEmpty(obj) {
    return Object.keys(obj).length < 2;
}
export function isEqual (obj1, obj2) {
    const obj1Length = Object.keys(obj1).length;
    const obj2Length = Object.keys(obj2).length;

    if (obj1Length === obj2Length) {
        return Object.keys(obj1).every(
            key => obj2.hasOwnProperty(key)
                && obj2[key] === obj1[key]);
    }
    return false;
}

export function touchDevice () {  
    try {  
        document.createEvent("TouchEvent");  
        return true;  
    } catch (e) {  
        return false;  
    }  
}

export function excludeParteien(x) {

    return(
        x !== "CDU" && 
        x !== "SED" && 
        x !== "LDPD"
    )
}

export function nullHundret (d) { return d && ( d.Ergebnis !== null )};

export function sameHighlight (props, type, key) {
    return (type === props.highlight.ident) && (key === props.highlight.key)
}
