import * as d3 from "d3";
import {useEffect, useRef, useState} from "react";
import useChartDimensions from "../helpers/useChartDimensions";

const DonutChart = () => {
	const [ref, dms] = useChartDimensions();

	const colors = ["#333357", "#FC497F", "#FD98B7", "#FEE9F0"];
	const [data] = useState([
		{channel: "Organic Search", count: 16024},
		{channel: "Direct", count: 9345},
		{channel: "Paid Search", count: 6164},
		{channel: "Email", count: 1229},
	]);

	const svgRef = useRef(null);

	useEffect(() => {
		console.log(dms);
		const width = dms.boundedWidth;
		const height = dms.boundedHeight;
		const radius = Math.min(width, height) / 2.5;

		const arc = d3
			.arc()
			.innerRadius(radius * 0.75)
			.outerRadius(radius - 1);

		const pie = d3
			.pie()
			.padAngle(1 / radius)
			.sort(null)
			.value((d) => d.count);

		const svg = d3
			.select(svgRef.current)
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [-width / 2, -height / 2, width, height])
			.attr("style", "max-width: 100%; height: auto;");

		// Remove any existing elements within the SVG
		svg.selectAll("*").remove();

		// Pie chart and total count on the left
		const leftGroup = svg
			.append("g")
			.attr("transform", `translate(${-width / 5}, 0)`); // Adjust the translate values as needed

		const pieChartData = pie(data);

		leftGroup
			.selectAll("path")
			.data(pieChartData)
			.join("path")
			.attr("fill", (_, i) => d3.color(colors[i]))
			.attr("d", arc)
			.append("title")
			.text((d) => `${d.data.channel}: ${d.data.count.toLocaleString()}`);

		const totalVisitors = data.reduce((acc, curr) => acc + curr.count, 0);

		leftGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "-0.2em")
			.text(totalVisitors)
			.attr("font-size", "22px")
			.attr("font-family", "Montserrat")
			.attr("letter-spacing", "1.5px");

		leftGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "2em")
			.text("Website Visitors")
			.attr("font-size", "12px")
			.attr("font-family", "Montserrat")
			.attr("fill", "#808080");

		// Legend on the right
		const legend = svg
			.append("g")
			.attr("transform", `translate(${width / 8}, -${height / 6})`); // Adjust the translate values as needed

		const legendItems = legend
			.selectAll("g")
			.data(data)
			.join("g")
			.attr("transform", (_, i) => `translate(0, ${i * 30})`);

		legendItems
			.append("circle") // Use circles instead of rects
			.attr("cx", 9) // Center X coordinate of the circle
			.attr("cy", 9) // Center Y coordinate of the circle
			.attr("r", 9) // Radius of the circle
			.attr("fill", (_, i) => colors[i]);

		legendItems
			.append("text")
			.attr("x", 24)
			.attr("y", 9)
			.attr("dy", "0.35em")
			.text((d) => `${d.channel} - ${d.count}`)
			.attr("font-size", "12px")
			.attr("font-family", "Montserrat")
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

export default DonutChart;
