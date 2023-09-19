import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import useChartDimensions from "../helpers/useChartDimensions";

const AreaChart = () => {
	const [ref, dms] = useChartDimensions();
	const svgRef = useRef(null);

	const [data] = useState([
		{date: "2023-04-01", value: "3800"},
		{date: "2023-05-01", value: "3500"},
		{date: "2023-06-01", value: "3800"},
		{date: "2023-07-01", value: "3100"},
		{date: "2023-08-01", value: "4300"},
	]);

	useEffect(() => {
		const width = dms.boundedWidth;
		const height = dms.boundedHeight;
		const marginTop = 20;
		const marginBottom = 30;
		const marginLeft = 40;

		// Declare the x (horizontal position) scale.
		const x = d3.scaleUtc(
			d3.extent(data, (d) => new Date(d.date)),
			[15, width - 15]
		);

		// Declare the y (vertical position) scale.
		const y = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => +d.value)])
			.range([height - marginBottom, marginTop]);

		// Declare the area generator.
		const area = d3
			.area()
			.x((d) => x(new Date(d.date)))
			.y0(y(0))
			.y1((d) => y(+d.value));

		// Declare the line generator.
		const line = d3
			.line()
			.x((d) => x(new Date(d.date)))
			.y((d) => y(+d.value));

		// Create the SVG container.
		const svg = d3
			.select(svgRef.current)
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [0, 0, width, height])
			.attr("style", "max-width: 100%; height: auto;");

		svg.selectAll("*").remove();

		// Append a path for the area (under the axes).
		svg.append("path").attr("fill", "#EAF2F8").attr("d", area(data));

		// Append a path for the line (on top of the area).
		svg.append("path")
			.attr("fill", "none")
			.attr("stroke", "#AFB5BA")
			.attr("stroke-width", 2)
			.attr("d", line(data));

		// Add the x-axis.
		svg.append("g")
			.attr("transform", `translate(0,${height - marginBottom})`)
			.call(
				d3
					.axisBottom(x)
					.ticks(width / 80)
					.tickSizeOuter(0)
			);

		// Add the y-axis, remove the domain line, add grid lines and a label.
		svg.append("g")
			.attr("transform", `translate(${marginLeft},0)`)
			.call((g) => g.select(".domain").remove())
			.call((g) =>
				g
					.selectAll(".tick line")
					.clone()
					.attr("x2", width)
					.attr("stroke-opacity", 0.1)
			);

		// Append text elements to display values on the line.
		svg.selectAll(".value-text")
			.data(data)
			.enter()
			.append("text")
			.attr("class", "value-text")
			.attr("x", (d) => x(new Date(d.date)))
			.attr("y", (d) => y(+d.value) - 20)
			.text((d) => d.value / 1000 + "k")
			.attr("text-anchor", "middle")
			.attr("font-size", "12px")
			.attr("fill", "#92979B");
	}, [data, dms]);

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
		</div>
	);
};

export default AreaChart;
