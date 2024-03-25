// import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import React from 'react';
// import {Map} from "google-map-react";
// DOC -> https://www.npmjs.com/package/google-maps-react
import './GoogleMapLocations.scss';

const { REACT_APP_FIREBASE_API_KEY } = process.env;

export class MapContainer extends React.Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
    };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
        });

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
            });
        }
    };

    render() {
        let locations = this.props.locations;

        let bounds = new this.props.google.maps.LatLngBounds();

        for (let i = 0; i < locations.length; i++) {
            let _points = {
                lat: parseFloat(locations[i].latitude),
                lng: parseFloat(locations[i].longitude),
            };
            bounds.extend(_points);
        }

        return (
            <div className="GoogleMapLocation">
                <Map
                    key="my-map"
                    className="GoogleMapLocation--map"
                    google={this.props.google}
                    initialCenter={{
                        lat: locations[0].latitude,
                        lng: locations[0].longitude,
                    }}
                    zoom={14}
                    onClick={this.onMapClicked}
                    fullscreenControl={false}
                    streetViewControl={false}
                    scaleControl={false}
                    mapTypeControl={false}
                    panControl={false}
                    // only calculate and use the bounds if there is more than 1 location
                    bounds={locations.length > 1 ? bounds : undefined}
                >
                    {locations.map((element, index) => {
                        return (
                            <Marker
                                key={`${index}_${element.latitude}_${element.longitude}`}
                                title={element.fullAddress}
                                name={element.fullAddress}
                                position={{
                                    lat: element.latitude,
                                    lng: element.longitude,
                                }}
                                onClick={this.onMarkerClick}
                            />
                        );
                    })}

                    <InfoWindow
                        key={this.state.selectedPlace.name}
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}
                    >
                        <div>
                            <p>{this.state.selectedPlace.name}</p>
                        </div>
                    </InfoWindow>
                </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: REACT_APP_FIREBASE_API_KEY,
})(MapContainer);
