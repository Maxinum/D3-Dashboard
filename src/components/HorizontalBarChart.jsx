import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import useChartDimensions from "../helpers/useChartDimensions";

const HorizontalBarChart = () => {
	const [ref, dms] = useChartDimensions();
	const svgRef = useRef(null);

	const [data] = useState([
		{category: "Index", value: 67, color: "#333357"},
		{category: "Pricing", value: 32, color: "#FC497F"},
		{category: "About", value: 23, color: "#EAF2F8"},
	]);

	useEffect(() => {
		const width = dms.boundedWidth;
		const height = dms.boundedHeight;
		const marginTop = 30;
		const marginBottom = 30;

		const x = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.value)])
			.nice()
			.range([40, width - 30]); // Adjust padding as needed

		const y = d3
			.scaleBand()
			.domain(data.map((d) => d.category))
			.rangeRound([marginTop, height - marginBottom])
			.padding(0.3);

		const svg = d3.select(svgRef.current);

		svg.selectAll("*").remove();

		svg.append("g")
			.selectAll()
			.data(data)
			.join("rect")
			.attr("y", (d) => y(d.category))
			.attr("height", y.bandwidth())
			.attr("width", (d) => x(d.value) - 60)
			.attr("fill", (d) => d.color)
			.attr("transform", "translate(40, 0)");

		svg.append("g")
			.attr("font-size", "12px")
			.attr("fill", "#303030")
			.selectAll()
			.data(data)
			.join("text")
			.attr("x", (d) => x(d.value) - 15) // Adjust distance from the end of the bar
			.attr("y", (d) => y(d.category) + y.bandwidth() / 2)
			.attr("dy", "0.35em")
			.text((d) => `${d.value}K`);

		svg.append("g")
			.attr("transform", `translate(${x(0)},0)`)
			.call(d3.axisLeft(y).tickSizeOuter(0));
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

export default HorizontalBarChart;
