import * as d3_select from 'd3-selection';

export function buildToolTip ({ state, mutables }, event, d, type) {  

    const padding = 9
    let _text; 

    switch(type) {
        case "story" :
            const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(d.Datum)
            _text = date.toLocaleDateString('de-DE', dateOptions) + " — " + d.Name;
            break;
        case "name":
            _text = (mutables.graphType === "regierungen" && d.Partei) ? 
                d.PersName + (d.Partei === "Sonstige" ? "" : ", " + d.Partei) + (d.koalition ? ", Kabinett " + d.Kabinett : "") : d.Name;
            break;
        case "partei" :
            _text = state.data.infos.find(org => org.ORG === d).Name
            break;
        default:
            break;
    }

    let tooltip_container = d3_select.select("body")
        .append("div")
        .attr("class", "tooltip_container")
        .style("z-index", 1000)
        .style("opacity", 0)
        .style("position","absolute")		
        .style("background", "white")
        .style("border", "1px solid lightgrey")
        
    let tooltip_text = tooltip_container.append("span")
        .style("position", "absolute" )		
        .style("text-align", "left")
        .style("padding", padding + "px")			
        .style("font", "12px sans-serif")	
        .html(_text)

    const container_height = tooltip_text.node().scrollHeight
    const container_width = tooltip_text.node().scrollWidth

    tooltip_container.style("height", container_height + "px")
    tooltip_container.style("width", container_width + padding + "px")

    let tooltip_arrow_bg = tooltip_container.append("span")
        .style("position", "absolute")
        .style("width", 0)
        .style("height", 0)
        .style("border-style", "solid")
        .style("border-width", "6px 6px 0 6px")
        .style("border-color", "lightgrey transparent transparent transparent");

    let tooltip_arrow = tooltip_container.append("span")
        .style("position", "absolute")
        .style("width", 0 + "px")
        .style("height", 0 + "px")
        .style("border-style", "solid")
        .style("border-width", "5px 5px 0 5px")
        .style("border-color", "white transparent transparent transparent");
    
    tooltip_container.transition()		
        .duration(200)		
        .style("opacity", 1);

    tooltip_container
        .style("left", (event.pageX - (container_width/2)) + "px")		
        .style("top", (event.pageY - (container_height + 10)) + "px")

    tooltip_text
        .style("left", 0 + "px")		
        .style("top", 0 + "px")
        
    tooltip_arrow
        .style("left", 0 + ((container_width/2) - 6) + "px")		
        .style("top", 1 + (container_height - 1)+ "px")
        
    tooltip_arrow_bg
        .style("left", -1 + ((container_width/2) - 6) + "px")		
        .style("top", 1 + (container_height - 1) + "px")

}

export function deleteTooltip(){

    d3_select.selectAll(".tooltip_container")
        .transition()		
            .duration(20)		
            .style("opacity", 0)
                .remove();
}