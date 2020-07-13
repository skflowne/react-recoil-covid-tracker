import { atom, selector, selectorFamily, waitForNone } from "recoil"
import { format, parse, subDays } from "date-fns"

export const viewDate = atom({
    key: "view-date",
    default: new Date(),
})

export const formattedViewDate = selector({
    key: "formatted-view-date",
    get: ({ get }) => {
        const date = get(viewDate)
        return format(date, "yyyy-MM-dd")
    },
})

export const statusByDateQuery = selectorFamily({
    key: "status-by-date",
    get: (formattedDate) => async ({ get }) => {
        console.log("get status by date", formattedDate)

        try {
            const res = await fetch(`https://covid19-api.org/api/status?date=${formattedDate}`)
            const status = await res.json()

            return status
        } catch (e) {
            console.error("status by date error", e)
        }
    },
})

export const statusByDateList = selector({
    key: "status-by-date-list",
    get: async ({ get }) => {
        const formattedDate = get(formattedViewDate)
        const status = await get(statusByDateQuery(formattedDate))

        const date = parse(formattedDate, "yyyy-MM-dd", new Date())
        const toPrefetchDates = new Array(30).fill(0).map((_, i) => format(subDays(date, i + 1), "yyyy-MM-dd"))
        get(waitForNone(toPrefetchDates.map((fd) => statusByDateQuery(fd))))

        return status
    },
})
