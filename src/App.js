import React, { Suspense } from "react"

import { RecoilRoot } from "recoil"
import TimelineMap from "./components/map/TimelineMap"
import TimelineDateSelector from "./components/map/TimelineDateSelector"
import TimelineStatSelector from "./components/map/TimelineStatSelector"

function App() {
    return (
        <RecoilRoot>
            <TimelineMap />
            <TimelineDateSelector />
            <TimelineStatSelector />
        </RecoilRoot>
    )
}

export default App
