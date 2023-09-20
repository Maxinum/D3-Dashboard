import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";
import useChartDimensions from "../helpers/useChartDimensions";

const StackedBarChart = () => {
	const [ref, dms] = useChartDimensions();
	const svgRef = useRef(null);

	const [data] = useState([
		{category: "Category A", newMRR: 100, expansion: 50, contraction: -30},
		{category: "Category B", newMRR: 80, expansion: 40, contraction: -20},
		{category: "Category C", newMRR: 120, expansion: 60, contraction: -40},
		{category: "Category D", newMRR: 90, expansion: 45, contraction: -25},
		{category: "Category E", newMRR: 110, expansion: 55, contraction: -35},
		{category: "Category F", newMRR: 70, expansion: 35, contraction: -15},
		{category: "Category G", newMRR: 130, expansion: 65, contraction: -45},
		{category: "Category H", newMRR: 85, expansion: 42, contraction: -28},
		{category: "Category I", newMRR: 95, expansion: 47, contraction: -27},
	]);

	useEffect(() => {
		const width = dms.boundedWidth;
		const height = dms.boundedHeight;
		const marginTop = 30;
		const marginBottom = 30;

		// Stack the data
		const stackedData = d3
			.stack()
			.keys(["newMRR", "expansion", "contraction"])
			.offset(d3.stackOffsetDiverging)(data);

		const x = d3
			.scaleBand()
			.domain(data.map((d) => d.category))
			.range([0, width])
			.paddingInner(0.4)
			.paddingOuter(1);

		const y = d3
			.scaleLinear()
			.domain([
				d3.min(stackedData.flatMap((d) => d.map((e) => e[0]))),
				d3.max(stackedData.flatMap((d) => d.map((e) => e[1]))),
			])
			.nice()
			.range([height - marginBottom, marginTop]);

		const color = d3
			.scaleOrdinal()
			.domain(["newMRR", "expansion", "contraction"])
			.range(["#333357", "#FC497F", "#EAF2F8"]);

		const svg = d3
			.select(svgRef.current)
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", [0, 0, width, height])
			.attr("style", "max-width: 100%; height: auto; height: intrinsic;");

		svg.selectAll("*").remove();

		svg.selectAll("g")
			.data(stackedData)
			.enter()
			.append("g")
			.attr("fill", (d) => color(d.key))
			.selectAll("rect")
			.data((d) => d)
			.enter()
			.append("rect")
			.attr("x", (d) => x(d.data.category))
			.attr("y", (d) => (d[1] < 0 ? y(0) : y(d[1])))
			.attr("height", (d) => Math.abs(y(d[0]) - y(d[1])))
			.attr("width", x.bandwidth())
			.on("mouseenter", onMouseEnter)
			.on("mouseleave", onMouseLeave);

		// Add the y-axis, remove the domain line, add grid lines and a label.
		svg.append("g")
			.attr("transform", `translate(${40},0)`)
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
					.attr("stroke-opacity", 0.1)
					.attr("transform", `translate(0,0)`)
					.attr("stroke", "#000000")
			)
			.selectAll("text")
			.attr("transform", `translate(0,-10)`)
			.attr("fill", "#808080");

		const legend = svg
			.append("g")
			.attr("transform", `translate(20, ${height - 20})`);

		const legendItemSize = 20;
		const legendSpacing = 10;

		const legendItems = legend
			.selectAll(".legend-item")
			.data(["New MRR", "Expansion", "Contraction"])
			.enter()
			.append("g")
			.attr("className", "legend-item")
			.attr("transform", (_, i) => `translate(${i * 100}, 0)`);

		legendItems
			.append("circle")
			.attr("cx", legendItemSize / 2)
			.attr("cy", legendItemSize / 2)
			.attr("r", legendItemSize / 2)
			.attr("fill", color);

		legendItems
			.append("text")
			.attr("x", legendItemSize + legendSpacing)
			.attr("y", legendItemSize - 5)
			.text((d) => d)
			.style("font-size", "12px")
			.attr("fill", "#303030");

		const tooltip = d3.select("#tooltip-stacked-bar");
		const yAccessor = (d) => Math.abs(d.data.newMRR + d.data.expansion);
		function onMouseEnter(_, data) {
			tooltip.select("#mrr").text("New MRR: " + data.data.newMRR);
			tooltip
				.select("#expansion")
				.text("Expansion: " + data.data.expansion);
			tooltip
				.select("#contraction")
				.text("Contraction: " + data.data.contraction);

			const xTooltip = x(data.data.category);
			const yTooltip = y(yAccessor(data)) + dms.marginTop;

			console.log(data.data.newMrr, data[1]);

			tooltip.style(
				"transform",
				`translate(` +
					`calc( -133% + ${xTooltip}px),` +
					`calc( -112% + ${yTooltip}px)` +
					`)`
			);

			tooltip.style("opacity", 1);
		}

		function onMouseLeave() {
			tooltip.style("opacity", 0);
		}
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
			<div
				id="tooltip-stacked-bar"
				style={{
					position: "absolute",
					background: "rgba(0, 0, 0, 0.7)",
					color: "#fff",
					borderRadius: "4px",
					padding: "0.6em 1em",
					boxShadow:
						"0 6px 8px rgba(52, 73, 94, .2), 0 1px 1px rgba(52, 73, 94, 0.1)",
					zIndex: 10,
					transition: "all 0.2s ease-out",
					pointerEvents: "none",
					opacity: 0,
				}}
			>
				<div className="tooltip-mrr" id="mrr"></div>
				<div className="tooltip-expansion" id="expansion"></div>
				<div className="tooltip-contraction" id="contraction"></div>
			</div>
		</div>
	);
};

export default StackedBarChart;
