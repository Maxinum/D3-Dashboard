import * as d3 from "d3";
import {useEffect, useRef, useState} from "react";
import useChartDimensions from "../helpers/useChartDimensions";

const LineChart = () => {
	const [ref, dms] = useChartDimensions();
	const svgRef = useRef(null);

	const [data] = useState([
		{date: "2023-08-29", value: 2800},
		{date: "2023-08-30", value: 2400},
		{date: "2023-08-31", value: 2850},
		{date: "2023-09-01", value: 2378},
		{date: "2023-09-02", value: 2870},
		{date: "2023-09-03", value: 1100},
		{date: "2023-09-04", value: 1200},
		{date: "2023-09-05", value: 1000},
		{date: "2023-09-06", value: 2850},
		{date: "2023-09-07", value: 3700},
		{date: "2023-09-08", value: 3400},
		{date: "2023-09-09", value: 4100},
		{date: "2023-09-10", value: 4300},
		{date: "2023-09-11", value: 2400},
		{date: "2023-09-12", value: 2000},
		{date: "2023-09-13", value: 3300},
		{date: "2023-09-14", value: 3200},
		{date: "2023-09-15", value: 3350},
		{date: "2023-09-16", value: 2950},
		{date: "2023-09-17", value: 3100},
		{date: "2023-09-18", value: 3200},
	]);

	useEffect(() => {
		console.log(dms);
		// Declare the chart dimensions and margins.
		const width = dms.boundedWidth;
		const height = dms.boundedHeight;
		const marginTop = 20;
		const marginRight = 30;
		const marginBottom = 30;
		const marginLeft = 40;

		// Declare the x (horizontal position) scale.
		const x = d3.scaleUtc(
			d3.extent(data, (d) => new Date(d.date)),
			[marginLeft, width - marginRight]
		);

		// Declare the y (vertical position) scale.
		const minValue = d3.min(data, (d) => d.value);
		const maxValue = d3.max(data, (d) => d.value);
		const y = d3
			.scaleLinear()
			.domain([minValue, maxValue])
			.range([height - marginBottom, marginTop]);

		// Declare the line generator.
		const line = d3
			.line()
			.x((d) => x(new Date(d.date)))
			.y((d) => y(d.value));

		// Create the SVG container.
		const svg = d3
			.select(svgRef.current)
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [0, 0, width, height])
			.attr("style", "max-width: 100%; height: auto; height: intrinsic;");

		svg.selectAll("*").remove();

		// Add the y-axis, remove the domain line, add grid lines and a label.
		svg.append("g")
			.attr("transform", `translate(${marginLeft},0)`)
			.call(
				d3
					.axisLeft(y)
					.ticks(height / 80)
					.tickFormat((d) => "$" + d3.format(",.0f")(d))
			)
			.call((g) => g.select(".domain").remove())
			.call((g) =>
				g
					.selectAll(".tick line")
					.attr("x2", width)
					.attr("stroke-opacity", 0.2)
					.attr("transform", `translate(-${marginLeft},0)`)
					.attr("stroke", "#000000")
			)
			.selectAll("text")
			.attr("transform", `translate(0,-10)`)
			.attr("fill", "#404040");

		svg.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", (d) => x(new Date(d.date)))
			.attr("cy", (d) => y(d.value))
			.attr("r", 4) // Adjust the radius as needed
			.attr("fill", "#333357");

		// Append a path for the line.
		svg.append("path")
			.attr("fill", "none")
			.attr("stroke", "#333357")
			.attr("stroke-width", 0.8)
			.attr("d", line(data));

		const tooltip = d3.select("#tooltip-line");
		// Add event listeners to show/hide the tooltip
		svg.selectAll("circle")
			.on("mouseover", (event, d) => {
				tooltip.transition().duration(200).style("opacity", 0.9);
				tooltip
					.html(`Date: ${d.date}<br/>Value: ${d.value}`)
					.style("left", event.pageX + "px")
					.style("top", event.pageY - 28 + "px");
			})
			.on("mouseout", () => {
				tooltip.transition().duration(500).style("opacity", 0);
			});
	}, [dms, data]);

	return (
		<div
			ref={ref}
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				justifyContent: "center",
			}}
		>
			<svg ref={svgRef}></svg>
			<div
				id="tooltip-line"
				style={{
					position: "absolute",
					textAlign: "center",
					padding: "8px",
					fontSize: "14px",
					background: "rgba(0, 0, 0, 0.7)",
					color: "#fff",
					borderRadius: "4px",
					pointerEvents: "none",
				}}
			></div>
		</div>
	);
};
export default LineChart;
