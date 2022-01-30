import { setNewParteiState } from './calc_set.js'

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

export function partei (state, action){

    let newState, same_partei, startHighlight, stopHighlight

    switch(action.type){

        case "INIT":
        case "NEW_SET":
            return  {
                ...action.value,
                save : { 
                    ...action.value, 
                    save : action.value,
                    data : state.data
                },
            };
        case "PARTEIEN":
            newState = {  
                ...state, 
                ["checked_" + action.partei] : action.value, 
            }
            return { 
                ...newState,
                save : newState
            };
        case "STROEMUNGEN_ALL":
            newState = {
                ...state, 
                ...action.value_partei, 
                ...action.value_stroemung, 
                hide_all : action.condition,
            }
            return {
                ...newState,
                save : newState
            };

        case "PARTEI_HIGHLIGHT":
            same_partei = action.partei === state.highlight_partei;
            startHighlight = !state.highlight && state.highlight_partei === undefined;
            stopHighlight = state.highlight && same_partei && state.highlight_partei !== undefined
            newState = !stopHighlight || startHighlight ? 
                { ...setNewParteiState(state, state.data, action.partei, undefined) } : state.save;

            return {
                ...state,
                ...newState,
                save : startHighlight ? 
                    state : { 
                        ...state.save, 
                        save : state.save,
                        data : state.data
                    },
                highlight : action.highlight.highlight_main ? same_partei ? false : true : true,
                highlight_partei : stopHighlight ? undefined : action.partei
            };
        case "KILL_HIGHLIGHT_PARTEI":
            return { 
                ...state.save, 
                save : state.save, 
                data : state.data 
                };
        default:
            return state;
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