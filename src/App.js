import React from "react"
import { useTimer } from "./hooks"
import "./App.css"

function App() {
	const { time, play, stop } = useTimer({
		startTime: new Date("1/1/2020"),
		endTime: new Date("4/30/2020"),
		step: 1000 * 60 * 60,
		frequency: 24,
	})

	return (
		<div className="App">
			<button onClick={play}>Play</button>
			<button onClick={stop}>Stop</button>
			<h1>{time.toLocaleString()}</h1>
		</div>
	)
}

export default App
