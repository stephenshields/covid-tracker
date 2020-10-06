import React, { useState } from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';

import { promiseToFlyTo, geoJsonToMarkers, clearMapLayers } from 'lib/map';
import { trackerLocationsToGeoJson, trackerFeatureToHtmlMarker } from 'lib/coronavirus';
import { commafy, friendlyDate } from 'lib/util';
import { useCoronavirusTracker } from 'hooks';

import Layout from 'components/Layout';
// import Container from 'components/Container';
import Map from 'components/Map';

const LOCATION = {
    lat: 0,
    lng: 0,
};

const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 1;

const IndexPage = () => {

    const [FEATURED, setFEATURED] = useState({
        name: '-',
        cases: '-',
        active: '-',
        deaths: '-',
        recovered: '-'
    });

    const { data: countries = [] } = useCoronavirusTracker({
        api: 'countries',
    });

    const { data: stats = {} } = useCoronavirusTracker({
        api: 'all',
    });

    const hasCountries = Array.isArray(countries) && countries.length > 0;

    /**
     * mapEffect
     * @description Fires a callback once the page renders
     * @example Here this is and example of being used to zoom in and set a popup on load
     */

    async function mapEffect({ leafletElement: map } = {}) {
        if (map._zoom === 1) {
            map.invalidateSize()
        };
        map.setMinZoom(2);

        if (!map || !hasCountries) return;
        clearMapLayers({
            map,
            excludeByName: ['Mapbox'],
        });

        const locationsGeoJson = trackerLocationsToGeoJson(countries);

        const locationsGeoJsonLayers = geoJsonToMarkers(locationsGeoJson, {
            onClick: handleOnMarkerClick,
            featureToHtml: trackerFeatureToHtmlMarker,
        });

        const bounds = locationsGeoJsonLayers.getBounds();

        locationsGeoJsonLayers.addTo(map);

        map.fitBounds(bounds);
    }

    function handleOnMarkerClick({ feature = {} } = {}, event = {}) {
        const { target = {} } = event;
        const { _map: map = {} } = target;

        const { geometry = {}, properties = {} } = feature;
        const { coordinates } = geometry;
        const { countryBounds, countryCode } = properties;

        setFEATURED({
            name: feature.properties.country,
            cases: feature.properties.cases,
            active: feature.properties.active,
            deaths: feature.properties.deaths,
            recovered: feature.properties.recovered
        })

        promiseToFlyTo(map, {
            center: {
                lat: coordinates[1],
                lng: coordinates[0],
            },
            zoom: 5,
        });

        if (countryBounds && countryCode !== 'US') {
            const boundsGeoJsonLayer = new L.GeoJSON(countryBounds);
            const boundsGeoJsonLayerBounds = boundsGeoJsonLayer.getBounds();

            map.fitBounds(boundsGeoJsonLayerBounds);
        }
    }

    const mapSettings = {
        center: CENTER,
        defaultBaseMap: 'Mapbox',
        zoom: DEFAULT_ZOOM,
        mapEffect,
    };

    return (
        <Layout pageName="home">
      <Helmet>
        <title>Covid Tracker</title>
        <link rel="icon" type="image/png" href="https://img.icons8.com/metro/26/000000/virus.png"/>
      </Helmet>

      <div className="tracker">
        <Map {...mapSettings} />

        <div className="tracker-stats">
          <ul>
          <h3 className="tracker-header">
          {FEATURED.name}
          </h3>
          <li className="selected-tracker-stat">
              <p className="tracker-stat-primary">
                {commafy( FEATURED?.cases )}
                <strong>Total Cases</strong>
              </p>
              <p className="tracker-stat-secondary">
                {commafy( FEATURED?.deaths )}
                <strong>Total deaths</strong>
              </p>
            </li>
            <li className="selected-tracker-stat">
              <p className="tracker-stat-primary">
                {commafy( FEATURED?.active )}
                <strong>Total Active Cases</strong>
              </p>
              <p className="tracker-stat-secondary">
                {commafy( FEATURED?.recovered )}
                <strong>Total Recovered</strong>
              </p>
            </li>
            <h3 className="tracker-header">
          World
          </h3>
            <li className="tracker-stat">
              <p className="tracker-stat-primary">
                { stats ? commafy( stats?.tests ) : '-' }
                <strong>Total Tests</strong>
              </p>
              <p className="tracker-stat-secondary">
                { stats ? commafy( stats?.testsPerOneMillion ) : '-' }
                <strong>Per 1 Million</strong>
              </p>
            </li>
            <li className="tracker-stat">
              <p className="tracker-stat-primary">
                { stats ? commafy( stats?.cases ) : '-' }
                <strong>Total Cases</strong>
              </p>
              <p className="tracker-stat-secondary">
                { stats ? commafy( stats?.casesPerOneMillion ) : '-' }
                <strong>Per 1 Million</strong>
              </p>
            </li>
            <li className="tracker-stat">
              <p className="tracker-stat-primary">
                { stats ? commafy( stats?.deaths ) : '-' }
                <strong>Total Deaths</strong>
              </p>
              <p className="tracker-stat-secondary">
                { stats ? commafy( stats?.deathsPerOneMillion ) : '-' }
                <strong>Per 1 Million</strong>
              </p>
            </li>
            <li className="tracker-stat">
              <p className="tracker-stat-primary">
                { stats ? commafy( stats?.active ) : '-' }
                <strong>Active</strong>
              </p>
            </li>
            <li className="tracker-stat">
              <p className="tracker-stat-primary">
                { stats ? commafy( stats?.critical ) : '-' }
                <strong>Critical</strong>
              </p>
            </li>
            <li className="tracker-stat">
              <p className="tracker-stat-primary">
                { stats ? commafy( stats?.recovered ) : '-' }
                <strong>Recovered</strong>
              </p>
            </li>
          </ul>
        </div>

        <div className="tracker-last-updated">
          <p>Last Updated: { stats ? friendlyDate( stats?.updated ) : '-' }</p>
        </div>
      </div>
    </Layout>
    );
};

export default IndexPage;