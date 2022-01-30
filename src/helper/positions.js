export function setCoords(state, x, y_pos, type, id) {
    switch(type){
        // brush graph
        case "perioden": 
            return {
                x: state.x_scale(new Date(x.start)),
                y: y_pos,
                width: state.x_scale(new Date(x.end)) - state.x_scale(new Date(x.start)),
            };
        // highlights :
        case "init":
            return {
                x: state.x_scale(new Date(state.defaultValues.startDate)),
                width : state.x_scale(new Date(state.defaultValues.stopDate)) - state.x_scale(new Date(state.defaultValues.startDate))
            }
        case "resize" :
            return {
                x: state.x_scale(new Date(x.start)),
                width : state.x_scale(new Date(x[id])) - state.x_scale(new Date(x.start))
            }
        case "line" :
            return {
                x: state.x_scale(new Date(x.Datum)),
            }
        default:
            break;
    }
}