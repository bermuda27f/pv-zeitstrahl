export function mutables (state, action){

    switch(action.type){
        case "SINGLE_BOOL":
            return {
                ...state,
                [action.varName] : state[action.varName] ? false : true
            }
        case "SINGLE_VALUE":
            return {
                ...state,
                [action.varName] : action.value
            }
        case "MULTIPLE":
            return {
                ...state,
                ...action.value
            }
        default:
            return state
    }
}

export function highlight (state, action) {

    switch(action.type){
        case "HIGHLIGHT_MAIN" :
            return  {
                highlight_main : true,
                ident : action.ident,
                infos : action.infos,
                key : action.key,
                element : action.element
            }
        case "KILL_HIGHLIGHT_MAIN" :
            return { 
                ...state,
                highlight_main : false,
            }
        case "HANDLE_UPDATE" :
            return {
                ...state,
                ["handle_" + action.handle_type] : action.handle
            }
        case "NEW_SET":
            return action.set
        default:
            return state;
    }
}