import React from "react"
import { addDays, subDays, formatDistanceToNow, format } from "date-fns"
import { useRecoilState } from "recoil"
import { viewDate } from "../../state/status"

const TimelineDateSelector = (props) => {
    const [date, setDate] = useRecoilState(viewDate)
    console.log("date", date)

    const handleForward = (e) => {
        setDate(addDays(date, 30))
    }

    const handleBackward = (e) => {
        setDate(subDays(date, 30))
    }

    return (
        <div className="absolute flex flex-col bg-gray-100">
            <span className="px-4 flex items-center justify-center">{format(date, "MMM do yyyy")}</span>
            <span className="px-4 flex items-center justify-center">
                {formatDistanceToNow(date, { addSuffix: true })}
            </span>
            <div className="flex flex-row items-center">
                <div className="p-2 border" onClick={handleBackward}>
                    &lt; Backward
                </div>
                <div className="p-2 border" onClick={handleForward}>
                    Forward &gt;
                </div>
            </div>
        </div>
    )
}

export default TimelineDateSelector
