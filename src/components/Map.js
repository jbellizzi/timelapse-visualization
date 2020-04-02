import React, { useRef, useEffect } from "react"
import { usStates } from "../data"
import { select, geoAlbersUsa, geoPath, scaleSqrt, easeLinear } from "d3"

export default ({ data, maxCases }) => {
	const svgRef = useRef()

	const width = 800
	const height = 480

	/** Scale mapping the # of cases to the radius of the circle. We are using a square root scale here to place greater
	 * distinction among counties with smaller number of cases */
	const radiusScale = scaleSqrt()
		.domain([0, 1, maxCases])
		.range([0, 2, 75])

	useEffect(() => {
		/** Map Projection */
		const projection = geoAlbersUsa()
			.translate([width / 2, height / 2])
			.scale([width * 1.2])

		/** state path generator */
		const pathGenerator = geoPath().projection(projection)

		const svg = select(svgRef.current)

		/** State */
		const statePathData = svg.selectAll(".state-path").data(usStates.features)
		statePathData
			// Enter new data
			.enter()
			// Append a path for each state feature
			.append("path")
			// Add class for reference
			.attr("class", "state-path")
			// Run data through pathGenerator
			.attr("d", pathGenerator)
			// Style
			.style("fill", "#DFE7EB")
			.style("stroke", "#fff")
			.style("stroke-width", 2)

		/** Circle, mapping county data to each circle plotted. We are using the second parameter of the data function
		 * with a callback function to define the data key on the FIPS so that changing incoming data can be updated
		 * from the appropriate data key */
		const circleData = svg.selectAll(".circle").data(data, d => d.FIPS)
		circleData
			// Enter new data
			.enter()
			// Append a circle for each county data point
			.append("circle")
			// Add class for reference
			.attr("class", "circle")
			// style
			.style("fill", "#E6532E")
			.style("fill-opacity", 0.3)
			// Update x-position
			.attr("cx", d => projection([d.Longitude, d.Latitude])[0])
			// Update y-position
			.attr("cy", d => projection([d.Longitude, d.Latitude])[1])
			// Merge incoming new data
			.merge(circleData)
			// Transition the next update
			.transition()
			.duration(1000)
			.ease(easeLinear)
			// Update the radius to the new cases value
			.attr("r", d => radiusScale(d.Cases))
		// Exit data points no longer in data and remove
		circleData.exit().remove()
	}, [svgRef, data])

	return <svg ref={svgRef} className="map" width={width} height={height} />
}
