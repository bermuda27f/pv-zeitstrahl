export function yAxis (props, container, type) {

    const labelWahlen = (g) => { 
        g.text("Stimmanteile in % **")
    }

    const label = container.append("g")
        .attr("class", "yAxisLabel noselect")
        .attr("opacity", 1)
        .attr("id", "yAxisLabel_" + type)
        .attr("transform", `translate(0, ${ -8 })`)
            .append("text").attr("text-anchor", "start").style("fill", "grey")
            .style("font-family", "sans-serif")
            .style("font-size", "10pt")
            label.call(labelWahlen);
}