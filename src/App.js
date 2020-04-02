import React from "react"
import { Trend } from "./components"
import { useTimer } from "./hooks"
import { casesByDate } from "./data"
import "./App.css"

function App() {
	const timer = useTimer({
		startTime: new Date(casesByDate[0].Date),
		endTime: new Date(casesByDate[casesByDate.length - 1].Date),
		step: 1000 * 60 * 60,
		frequency: 24,
	})

	return (
		<div className="App">
			<Trend data={casesByDate.map(row => ({ ...row, Date: new Date(row.Date) }))} {...timer} />
			{!timer.isPlaying ? <button onClick={timer.play}>Play</button> : <button onClick={timer.stop}>Stop</button>}
		</div>
	)
}

export default App
