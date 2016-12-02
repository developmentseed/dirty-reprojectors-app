const React = require('react')
const mapboxgl = require('mapbox-gl')
const reproject = require('dirty-reprojectors')
const projections = require('dirty-reprojectors/projections')
const clone = require('lodash.clonedeep')
const $ = require('jquery')

import { saveAs } from 'file-saver'

const land = require('../data/ne_110m_land.json')

var downloadme = ''

class Map extends React.Component {
  componentDidMount () {
    this.downloadData(this.props.data, this.props.uploadedData, this.props.projection)

    this.map = new mapboxgl.Map({
      container: this.container,
      style: {
        version: 8,
        sources: {
          geojson: {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] }
          },
          land: {
            type: 'geojson',
            data: land
          }
        },
        layers: [{
          id: 'bg',
          type: 'background',
          paint: {
            'background-color': '#dedede'
          }
        },
        {
          id: 'line-blur',
          type: 'line',
          source: 'geojson',
          paint: {
            'line-color': '#bbb',
            'line-width': 0.75,
            'line-translate': [
              1,
              1
            ]
          }
        },
        {
          id: 'line',
          type: 'line',
          source: 'geojson',
          paint: {
            'line-color': '#788',
            'line-width': 0.75
          }
        }]
      }
    })

    this.map.addControl(new mapboxgl.NavigationControl({position: 'bottom-right'}))
    this.map.dragRotate.disable()
    this.map.touchZoomRotate.disableRotation()

    this.map.on('load', () => {
      this.setMapData(land, this.props.uploadedData, this.props.projection)
    })
  }

  updateGeojson (dataSource, upload, callback) {
    var src = 'http://10.1.10.181:8000/ne_110m_land.geojson'

    if (upload !== 'empty') {
      src = upload
    } else if (dataSource === 'Land') {
      src = 'assets/data/ne_110m_land.json'
    } else if (dataSource === 'Water') {
      src = 'assets/data/ne_110m_water.geojson'
    } else if (dataSource === 'Countries') {
      src = 'assets/data/ne_110m_admin_0.geojson'
    } else if (dataSource === 'States, Providences') {
      src = 'assets/data/ne_110m_admin_1.geojson'
    } else if (dataSource === 'Lakes') {
      src = 'assets/data/ne_110m_lakes.geojson'
    } else if (dataSource === 'Rivers') {
      src = 'assets/data/ne_10m_rivers.geojson'
    } else if (dataSource === 'Populated Places') {
      src = 'assets/data/ne_110m_populated_places.geojson'
    } else {
      console.log('error will robinson! error!')
    }

    $.getJSON(src, function (json) {
      callback(null, json)
    })
  }

  setMapData (data, upload, projection) {
    if (!this.map.loaded()) { return }
    if (projection) {
      data = clone(data)
      for (const feature of data.features) {
        feature.geometry = reproject({
          forward: projection,
          reverse: 'mercator',
          projections: projections
        }, feature.geometry)
      }
    }

    downloadme = data

    this.map.getSource('geojson').setData(data)
  }

  downloadData (data, uploadedData, projection) {
    const downloadButton = $('.button__download')

    downloadButton.on('click', function () {
      console.log(downloadme)
      const blob = new Blob([JSON.stringify(downloadme)], {type: 'application/json;charset=utf-8'})
      saveAs(blob, 'projected-geography.geojson')
    })
  }

  componentWillReceiveProps (next) {
    if (next.data !== this.props.data || next.projection !== this.props.projection || next.uploadedData !== this.props.uploadedData) {
      const self = this

      this.updateGeojson(next.data, next.uploadedData, function (err, data) {
        if (err) console.log('uh oh')
        else self.setMapData(data, next.uploadedData, next.projection)
      })
    }
  }

  render () {
    return (
      <div style={Object.assign({
        height: '100%'
      }, this.props.style)}>
        <div className='main-map'
          ref={(el) => { this.container = el }}>
        </div>
      </div>
    )
  }
}

module.exports = Map

// add new prop to map component - onChange as a function to kick over reprojection

// Style for points

// {
//   id: 'point',
//   type: 'circle',
//   source: 'geojson',
//   paint: {
//     'circle-radius': {
//       'base': 0.8,
//       'stops': [[8, 2], [12, 6]]
//     },
//     'circle-color': 'black'
//   }
// },
