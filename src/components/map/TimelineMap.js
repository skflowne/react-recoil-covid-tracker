import React from "react"
import DeckGL from "@deck.gl/react"
import { ScatterplotLayer, TextLayer } from "@deck.gl/layers"
import { StaticMap } from "react-map-gl"

import { useRecoilValueLoadable } from "recoil"
import { countryList } from "../../state/countries"
import { statusByDateList } from "../../state/status"

import { token } from "../../map-box-token"

import TimelineSlider from "./TimelineSlider"

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = token

// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -20,
    latitude: 0,
    zoom: 2,
    pitch: 0,
    bearing: 0,
}

const TimelineMap = (props) => {
    const countries = useRecoilValueLoadable(countryList)
    const status = useRecoilValueLoadable(statusByDateList)

    const startDate = new Date("20 Jan 2020")
    const endDate = new Date()

    let data = []

    if (countries.state === "hasValue" && status.state === "hasValue") {
        data = status.contents.map((cs) => {
            const country = countries.contents[cs.country]
            return {
                name: country.name,
                coordinates: country ? [country.longitude, country.latitude] : [0, 0],
                ...cs,
            }
        })
    }

    const timelineLayer = new ScatterplotLayer({
        id: "countries-layer",
        data,
        stroked: false,
        filled: true,
        getPosition: (d) => d.coordinates,
        getRadius: (d) => (d.cases > 0 ? 70000 + d.cases * 0.7 : 0),
        getFillColor: (d) => [
            (d.cases * 255) / 500000,
            255 - (d.cases * 255) / 2000000,
            0,
            255 - (d.cases * 255) / 5000000,
        ],
        //getFillColor: (d) => [255, 255, 0, 255 - (d.cases * 255) / 5000000],
    })

    const casesLayer = new TextLayer({
        id: "cases-layer",
        data,
        pickable: true,
        billbpard: true,
        getPosition: (d) => d.coordinates,
        getText: (d) => (d.cases > 0 ? d.cases.toString() : ""),
        getSize: (d) => (d.cases > 0 ? 20 : 0),
        getColor: (d) => [(d.cases * 255) / 5000000, 255 - (d.cases * 255) / 5000000, 0],
    })

    return (
        <div className="w-full">
            <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={[timelineLayer /*casesLayer*/]}>
                <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
            </DeckGL>
            <TimelineSlider timelineStart={startDate} timelineEnd={endDate} />
        </div>
    )
}

export default TimelineMap
