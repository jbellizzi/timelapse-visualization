const { readJSON, writeJSON } = require("fs-extra")
const path = require("path")

readJSON(path.resolve(__dirname, "../src/data/casesByCounty_flat.json"))
	.then(res =>
		res.map(row => ({
			...row,
			FIPS: row.FIPS.toString(),
		}))
	)
	.then(data => writeJSON(path.resolve(__dirname, "../src/data/casesByCounty.json"), data))
