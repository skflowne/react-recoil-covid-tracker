import React from "react"
import DeckGL from "@deck.gl/react"
import { ScatterplotLayer } from "@deck.gl/layers"
import { StaticMap } from "react-map-gl"
import { token } from "../../map-box-token"
import { statusByDateList } from "../../state/status"
import { countryList } from "../../state/countries"
import { useRecoilValue } from "recoil"

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = token

// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -122.41669,
    latitude: 37.781,
    zoom: 5,
    pitch: 0,
    bearing: 0,
}

const TimelineMap = (props) => {
    const countries = useRecoilValue(countryList)
    const status = useRecoilValue(statusByDateList)

    const data = status.map((cs) => {
        const country = countries[cs.country]
        return {
            name: country.name,
            coordinates: country ? [country.longitude, country.latitude] : [0, 0],
            ...cs,
        }
    })

    return (
        <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true}>
            <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
            <ScatterplotLayer
                id="countries-layer"
                data={data}
                stroked={false}
                filled={true}
                getPosition={(d) => d.coordinates}
                getRadius={(d) => (d.cases > 0 ? 50000 + d.cases * 0.3 : 0)}
                getFillColor={[255, 0, 0]}
            />
        </DeckGL>
    )
}

export default TimelineMap
