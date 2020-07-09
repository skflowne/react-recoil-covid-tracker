import { atom, selector } from "recoil"

export const countryList = selector({
    key: "countries",
    get: async ({ get }) => {
        try {
            console.log("loading countries")
            const res = await fetch("https://covid19-api.org/api/countries")
            const countries = await res.json()
            return countries.reduce((dict, country) => {
                dict[country.alpha2] = country
                return dict
            }, {})
        } catch (e) {
            console.error("countries error", e)
        }
    },
})
