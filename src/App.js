import React, { Suspense } from "react"

import { RecoilRoot } from "recoil"
import TimelineMap from "./components/map/TimelineMap"
import TimelineDateSelector from "./components/map/TimelineDateSelector"

function App() {
    return (
        <RecoilRoot>
            <TimelineMap />
            <TimelineDateSelector />
        </RecoilRoot>
    )
}

export default App
