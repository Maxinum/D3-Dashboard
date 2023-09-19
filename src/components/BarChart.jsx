import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import useChartDimensions from "../helpers/useChartDimensions";

const BarChart = () => {
	const [ref, dms] = useChartDimensions();
	const svgRef = useRef(null);

	const [data] = useState([
		{channel: "Paid", value: "38", color: "#EAF2F8"},
		{channel: "Organic", value: "62", color: "#FC497F"},
	]);

	useEffect(() => {
		const width = dms.boundedWidth;
		const height = dms.boundedHeight;
		const marginTop = 30;
		const marginBottom = 30;

		// Declare the x (horizontal position) scale.
		const x = d3
			.scaleBand()
			.domain(
				d3.groupSort(
					data,
					([d]) => -d.value,
					(d) => d.channel
				)
			) // descending frequency
			.range([15, width - 15])
			.padding(0.1);

		// Declare the y (vertical position) scale.
		const y = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.value)])
			.range([height - marginBottom, marginTop]);

		// Create the SVG container.
		const svg = d3
			.select(svgRef.current)
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [0, 0, width, height])
			.attr("style", "max-width: 100%; height: auto;");

		// Remove any existing elements within the SVG
		svg.selectAll("*").remove();

		// Add a rect for each bar with custom colors based on the channel.
		svg.append("g")
			.selectAll()
			.data(data)
			.join("rect")
			.attr("x", (d) => x(d.channel))
			.attr("y", (d) => y(d.value))
			.attr("height", (d) => y(0) - y(d.value))
			.attr("width", x.bandwidth())
			.attr("fill", (d) => d.color); // Use the color from the data

		// Add the x-axis and label.
		svg.append("g")
			.attr("transform", `translate(0,${height - marginBottom})`)
			.call(d3.axisBottom(x).tickSizeOuter(0));

		// Add text labels on top of the bars for showing the percentage
		svg.append("g")
			.selectAll()
			.data(data)
			.join("text")
			.text((d) => `${d.value}%`)
			.attr("x", (d) => x(d.channel) + x.bandwidth() / 2)
			.attr("y", (d) => y(parseInt(d.value)) - 5) // Adjust the vertical position
			.attr("text-anchor", "middle")
			.attr("font-size", "12px")
			.attr("fill", "#303030");
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

export default BarChart;
