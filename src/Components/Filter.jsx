import React from 'react';

import { setNewStroemungState, setNewParteiState, getElement } from '../helper/calc_set.js'
import { excludeParteien } from '../helper/check.js';
import { zoomToElement } from '../helper/zoom.js';

export default function Filter(props) {

    const isolate = (org) => {

        if(!props.highlight.highlight_main){
 
            const element = getElement(props.state.data.infos, "ORG", org)

            props.setHIGHLIGHT({
                type : "HIGHLIGHT_MAIN",
                ident : "partei",
                infos : props.state.data.infos,
                key :  org,
                element : element
            })

            props.setPARTEI({
                type : "PARTEI_HIGHLIGHT",
                highlight : props.highlight,
                partei : org,
            });
            zoomToElement (props, "partei", org, element)
        }
        else{
            // CANCEL ISOLATION :
            props.setHIGHLIGHT({ type : "KILL_HIGHLIGHT_MAIN" })
            props.setPARTEI({type : "KILL_HIGHLIGHT_PARTEI",});
        }
    }

    const toggleSingleElement = (org) => {
        props.setPARTEI({ 
            "type" : "PARTEIEN",
            "partei" : org , 
            "value" : props.parteienState["checked_" + org] ? false : true,
        });
    };
    
    const toggleAll = () => {

        let newCondition = props.parteienState["hide_all"] ? false : true;

        let newParteiState = setNewParteiState(props.parteienState, props.state.data.infos, undefined, newCondition)
        let newStroemungState = setNewStroemungState(props.state.data.stroemungen, undefined, newCondition)

        props.setPARTEI({
                "type" : "STROEMUNGEN_ALL",
                "condition" : newCondition,
                "value_partei" : newParteiState, 
                "value_stroemung" : newStroemungState, 
        })        
    }

    const toggleSpectrum = (parteien, richtung) => {

        let newCondition = props.parteienState[richtung] === true ? false : true;
        let newSet = {...props.parteienState, [richtung] : newCondition}

        parteien.forEach((partei)=>{    
            newSet = {
                ...newSet,
                ["checked_" + partei] : newCondition
            }
        })

        props.setPARTEI({
            "type" : "NEW_SET",
            "value" : newSet 
        });
    }

    return (
        <div>
            <div>toggle all:
                <button 
                    disabled = { props.highlight.highlight_main }
                    onClick = { toggleAll }>
                    { props.parteienState["hide_all"] ? "hide all" : "show all" }
                </button>
            </div>
            <div style ={{display: "flex", flexWrap: "wrap", }}>toggle spectrum:
                {props.state.data.stroemungen.map((x)=>{
                    return (
                        <div key={x.richtung} >
                            <button 
                                disabled = { props.highlight.highlight_main }
                                style = {{ color: "white", backgroundColor : props.parteienState[x.richtung] === true ? x.color : "lightgrey" }}
                                onClick = { () => toggleSpectrum(x.parteien, x.richtung) }
                            >
                            {"..." + x.richtung }
                            </button>
                        </div>
                    )
                })}
            </div>
            <div style ={{display: "flex", flexWrap: "wrap" }} >toggle parties:
                {props.state.data.infos.map((x)=>{
                    const isHighlight = props.highlight.ident === "partei" && props.highlight.key === x.ORG
                    if(excludeParteien(x.ORG)){
                        return (
                            <div key={x.ORG} style={{border : "1px solid grey", margin: "2px", padding : "2px"}}>
                                <input type ="checkbox" 
                                    disabled = { props.highlight.highlight_main }
                                    name = {x.Name}
                                    style = {{ color: x.Farbcode }}
                                    checked = { props.parteienState["checked_" + x.ORG] } 
                                    onChange = { () => toggleSingleElement(x.ORG) }
                                />
                                <button 
                                    disabled = { props.highlight.highlight_main && !isHighlight } 
                                    onClick={()=>{ isolate(x.ORG) }}>
                                        {props.highlight.highlight_main && isHighlight ? "cancel" : "isolate"}
                                </button>
                                <label htmlFor = { x.Name } style = {{color : x.Farbcode}}> { x.Abkuerzung } </label>
                            </div>
                        )
                    }
                    else {
                        return null
                    }
                })}
            </div>
        </div>
    );
}