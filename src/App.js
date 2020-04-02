import React, { useState, useEffect } from "react"
import { Trend, Map } from "./components"
import { useTimer } from "./hooks"
import { casesByDate, casesByCounty } from "./data"
import { nest, max } from "d3"
import "./App.css"

const nestedCasesByCounty = nest()
	.key(d => d.Date)
	.entries(casesByCounty)
	.reduce(
		(acc, row) => ({
			...acc,
			[new Date(row.key).toLocaleDateString()]: row.values.map(value => {
				const { Date, ...valueRemainder } = value
				return valueRemainder
			}),
		}),
		{}
	)

const maxCases = max(casesByCounty.map(d => d.Cases))

function App() {
	const timer = useTimer({
		startTime: new Date(casesByDate[0].Date),
		endTime: new Date(casesByDate[casesByDate.length - 1].Date),
		step: 1000 * 60 * 60,
		frequency: 24,
	})

	const timerDate = timer.time.toLocaleDateString()
	const [data, setData] = useState([])
	useEffect(() => {
		setData(nestedCasesByCounty[timerDate])
	}, [timerDate])

	return (
		<div className="App">
			<Trend data={casesByDate.map(row => ({ ...row, Date: new Date(row.Date) }))} {...timer} />
			<div>
				{!timer.isPlaying ? <button onClick={timer.play}>Play</button> : <button onClick={timer.stop}>Stop</button>}
			</div>
			<Map data={data} maxCases={maxCases} />
		</div>
	)
}

export default App
