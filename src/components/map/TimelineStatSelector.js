import React from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { viewStat, viewableStats } from "../../state/status"

const TimelineStatSelector = (props) => {
    const [stat, setStat] = useRecoilState(viewStat)
    const stats = useRecoilValue(viewableStats)

    const handleChange = (e) => {
        setStat(e.target.value)
    }

    return (
        <div className="absolute top-0 right-0 p-2">
            <select value={stat} className="p-2" onChange={handleChange}>
                {stats.map((s) => {
                    return <option key={s} value={s}>{`${s[0].toUpperCase()}${s.substring(1)}`}</option>
                })}
            </select>
        </div>
    )
}

export default TimelineStatSelector
