import React, { useEffect, useState, useRef } from "react"
import { scaleTime, scaleLinear, extent, line, area, curveBasis, axisBottom, axisLeft, select } from "d3"

export default ({ data, time, startTime, endTime, updateTime }) => {
	/** Trend dimensions */
	const width = 800
	const height = 300

	/** Axes and plot dimensions */
	const yAxisWidth = 40
	const xAxisHeight = 15
	const plotWidth = width - yAxisWidth
	const plotHeight = height - xAxisHeight

	/** XScale spans timer's startTime and endTime across the plot width */
	const xScale = scaleTime()
		.domain([startTime, endTime])
		.range([0, plotWidth])

	/** yScale spans the data's min and max values across the plot height */
	const yScale = scaleLinear()
		.domain(extent(data.map(d => d.Confirmed)))
		.range([plotHeight, 0])

	/** area and line paths define the paths data */
	const [areaPath, setAreaPath] = useState(null)
	const [linePath, setLinePath] = useState(null)
	/** When data changes.. */
	useEffect(() => {
		/** generate a new area */
		const areaPathGenerator = area()
			.x(d => xScale(d.Date))
			.y0(yScale.range()[0])
			.y1(d => yScale(d.Confirmed))
			.curve(curveBasis)

		setAreaPath(areaPathGenerator(data))

		/** generate a new line */
		const linePathGenerator = line()
			.x(d => xScale(d.Date))
			.y(d => yScale(d.Confirmed))
			.curve(curveBasis)

		setLinePath(linePathGenerator(data))
	}, [data])

	/** This is the time span of the current time based on the timer */
	const [selectedWidth, setSelectedWidth] = useState(0)
	useEffect(() => {
		setSelectedWidth(xScale(time))
	}, [time.valueOf()])

	/** Ref to xAxis */
	const xAxisRef = useRef()
	useEffect(() => {
		/** Get xAxis */
		const xAxisGroup = select(xAxisRef.current)

		/** Create axis */
		const xAxis = axisBottom()
			.scale(xScale)
			.tickSize(0)

		/** Attach axis to group */
		xAxisGroup.call(xAxis)
	}, [xAxisRef])

	/** Ref to yAxis */
	const yAxisRef = useRef()
	useEffect(() => {
		/** Get yAxis */
		const yAxisGroup = select(yAxisRef.current)

		/** Create axis */
		const yAxis = axisLeft()
			.scale(yScale)
			.tickSize(-plotWidth)
			.ticks(6)

		/** Attach axis to group */
		yAxisGroup.call(yAxis)
	}, [yAxisRef])

	/** Update time when click on svg */
	const svgRef = useRef()
	const handlePlotClick = evt => {
		const { left } = svgRef.current.getBoundingClientRect()
		const clickX = evt.clientX - left - yAxisWidth
		updateTime(xScale.invert(clickX >= 0 ? clickX : 0))
	}

	return (
		<svg ref={svgRef} width={width} height={height} onClick={handlePlotClick}>
			<defs>
				<clipPath id="selected-region">
					<rect x={0} y={0} width={selectedWidth} height={height} />
				</clipPath>
			</defs>
			<g ref={yAxisRef} className="trend__y-axis trend__axis" transform={`translate(${yAxisWidth}, 0)`} />
			<g className="trend__plot" transform={`translate(${yAxisWidth}, 0)`}>
				<g>
					{areaPath !== null ? <path d={areaPath} className="trend__base-area" /> : null}
					{linePath !== null ? <path d={linePath} className="trend__base-line" /> : null}
				</g>
				<g clipPath={"url(#selected-region)"}>
					{areaPath !== null ? <path d={areaPath} className="trend__area" /> : null}
					{linePath !== null ? <path d={linePath} className="trend__line" /> : null}
				</g>
			</g>
			<g ref={xAxisRef} className="trend__x-axis trend__axis" transform={`translate(${yAxisWidth}, ${plotHeight})`} />
		</svg>
	)
}
