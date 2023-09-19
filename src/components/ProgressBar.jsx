import {useEffect, useRef} from "react";
import * as d3 from "d3";
import useChartdms from "../helpers/useChartDimensions";

const ProgressBar = () => {
	const [ref, dms] = useChartdms();
	const svgRef = useRef();
	const progress = 43;

	useEffect(() => {
		const width = dms.boundedWidth;
		const height = dms.boundedHeight;

		const size = Math.min(dms.width, dms.height);
		const radius = size / 2.5;

		const svg = d3
			.select(svgRef.current)
			.attr("width", width)
			.attr("height", height);

		const arc = d3
			.arc()
			.innerRadius(radius - 30) // Adjust the inner radius to leave a hole in the center
			.outerRadius(radius)
			.startAngle(0)
			.endAngle((Math.PI * 2 * progress) / 100);

		const backgroundArc = d3
			.arc()
			.innerRadius(radius - 30) // Adjust the inner radius to leave a hole in the center
			.outerRadius(radius)
			.startAngle(progress)
			.endAngle((Math.PI * 2) / 100);

		svg.selectAll("*").remove();

		svg.append("g")
			.attr("transform", `translate(${width / 2},${height / 2})`)
			.append("path")
			.datum({endAngle: (Math.PI * 2) / 100})
			.attr("d", backgroundArc)
			.attr("fill", "#EAF2F8"); // Background color for unfilled portion

		svg.append("g")
			.attr("transform", `translate(${width / 2},${height / 2})`)
			.append("path")
			.datum({endAngle: (Math.PI * 2 * progress) / 100})
			.attr("d", arc)
			.attr("fill", "#FC497F"); // Filled portion color

		svg.append("text")
			.attr("x", width / 2)
			.attr("y", height / 2)
			.attr("dy", "0.35em")
			.attr("text-anchor", "middle")
			.attr("fill", "#333357")
			.style("font-size", "24px")
			.text(`${progress}%`);
	}, [dms, progress]);

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

export default ProgressBar;
