import React, { useRef } from "react"
import styled from "@emotion/styled"
import { addDays, differenceInCalendarDays, format, parse } from "date-fns"
import { useRecoilState } from "recoil"
import { viewDate } from "../../state/status"

const StyledSlider = styled("div")`
    width: 100%;
    height: 30px;
    background: #aaa;
    position: absolute;
    bottom: 4rem;
`

const StyledThumb = styled("div")`
    position: absolute;
    width: 30px;
    height: 50px;
    top: -10px;
    left: calc(50% - 15px);
    background: #fff;
`

const getPercentage = (current, max) => (current / max) * 100

const getLeft = (percentage) => `calc(${percentage}% - 30px)`

const TimelineSlider = (props) => {
    const { timelineStart, timelineEnd } = props
    const days = differenceInCalendarDays(timelineEnd, timelineStart) + 1
    const dates = new Array(days).fill(0).map((d, i) => format(addDays(timelineStart, i), "yyyy-MM-dd"))

    const [currentDate, setCurrentDate] = useRecoilState(viewDate)

    const currentDateIndex = dates.indexOf(format(currentDate, "yyyy-MM-dd"))
    const sliderStartPercentage = getPercentage(currentDateIndex, dates.length - 1)

    const slider = useRef()
    const thumb = useRef()

    const diff = useRef()

    const handleMouseMove = (e) => {
        let newX = e.clientX - diff.current - slider.current.getBoundingClientRect().left

        const start = 30
        const end = slider.current.offsetWidth - thumb.current.offsetWidth

        console.log(slider.current.offsetWidth, thumb.current.offsetWidth)
        if (newX < start) {
            newX = start
        }

        if (newX > end) {
            newX = end
        }

        const newPercentage = getPercentage(newX, end)

        thumb.current.style.left = getLeft(newPercentage)
        const newDateIndex = parseInt((dates.length - 1) * (newPercentage / 100))
        const newDate = parse(dates[newDateIndex], "yyyy-MM-dd", new Date())
        setCurrentDate(newDate)
    }

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }

    const handleMouseDown = (e) => {
        diff.current = e.clientX - thumb.current.getBoundingClientRect().left
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    return (
        <StyledSlider ref={slider}>
            <StyledThumb
                ref={thumb}
                style={{ left: `calc(${sliderStartPercentage}% - 30px)` }}
                onMouseDown={handleMouseDown}
            ></StyledThumb>
        </StyledSlider>
    )
}

export default TimelineSlider
