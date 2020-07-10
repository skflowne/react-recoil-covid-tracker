import { atom, selector } from "recoil"
import { format } from "date-fns"

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

export const statusByDateList = selector({
    key: "status-by-date",
    get: async ({ get }) => {
        const formattedDate = get(formattedViewDate)

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
