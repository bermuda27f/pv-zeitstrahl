export function setCoords(state, x, y_pos, type, id) {
    switch(type){
        // brush graph
        case "perioden": 
            return {
                x: state.x_scale(x.start),
                y: y_pos,
                width: state.x_scale(x.end) - state.x_scale(x.start),
            };
        // highlights :
        case "init":
            return {
                x: state.x_scale(state.startDate),
                width : state.x_scale(state.stopDate) - state.x_scale(state.startDate)
            }
        case "resize" :
            return {
                x: state.x_scale(x.start),
                width : state.x_scale(x[id]) - state.x_scale(x.start)
            }
        case "line" :
            return {
                x: state.x_scale(x.Datum),
            }
        default:
            break;
    }
}