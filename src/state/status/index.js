import { atom, selector, selectorFamily, waitForNone } from "recoil"
import { format, parse, subDays } from "date-fns"

export const viewDate = atom({
    key: "view-date",
    default: new Date(),
})

export const viewStat = atom({
    key: "view-stat",
    default: "cases",
})

export const viewStatMax = selector({
    key: "view-stat-max",
    get: ({ get }) => {
        const currentStat = get(viewStat)
        const multiplier = 1.514

        switch (currentStat) {
            case "cases":
                return 3301820 * multiplier
            case "deaths":
                return 150000 * multiplier
            case "recovered":
                return 1000000 * multiplier
        }
    },
})

export const viewableStats = atom({
    key: "viewable-stats",
    default: ["cases", "deaths", "recovered"],
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

        console.log("status", formattedDate, status)

        const date = parse(formattedDate, "yyyy-MM-dd", new Date())
        const toPrefetchDates = new Array(60).fill(0).map((_, i) => format(subDays(date, i + 1), "yyyy-MM-dd"))
        get(waitForNone(toPrefetchDates.map((fd) => statusByDateQuery(fd))))

        return status
    },
})
