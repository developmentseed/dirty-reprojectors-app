const React = require('react')
const mapboxgl = require('mapbox-gl')
const reproject = require('dirty-reprojectors')
const projections = require('dirty-reprojectors/projections')
const clone = require('lodash.clonedeep')
const $ = require('jquery')

const land = require('../data/ne_110m_land.json')

class Map extends React.Component {
  componentDidMount () {
    this.downloadData(this.props.data, this.props.uploadedData)

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
          id: 'line',
          type: 'line',
          source: 'geojson',
          paint: {
            'line-color': '#788'
          }
        },
        {
          id: 'line-blur',
          type: 'line',
          source: 'geojson',
          paint: {
            'line-color': '#bbb',
            'line-translate': [
              3,
              2
            ]
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
      src = 'http://10.1.10.181:8000/ne_110m_land.geojson'
    } else if (dataSource === 'Water') {
      src = 'http://10.1.10.181:8000/ne_110m_water.geojson'
    } else if (dataSource === 'Countries') {
      src = 'http://10.1.10.181:8000/ne_110m_admin_0.geojson'
    } else if (dataSource === 'States, Providences') {
      src = 'http://10.1.10.181:8000/ne_110m_admin_1.geojson'
    } else if (dataSource === 'Lakes') {
      src = 'http://10.1.10.181:8000/ne_110m_lakes.geojson'
    } else if (dataSource === 'Rivers') {
      src = 'http://10.1.10.181:8000/ne_10m_rivers.geojson'
    } else if (dataSource === 'Roads') {
      src = 'http://10.1.10.181:8000/ne_10m_roads.geojson'
    } else if (dataSource === 'Populated Places') {
      src = 'http://10.1.10.181:8000/ne_110m_populated_places.geojson'
    } else {
      console.log('error will robinson! error!')
    }

    $.getJSON(src, function (json) {
      callback(null, json)
    })
  }

  setMapData (data, upload, projection) {
    console.log(upload)

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
    this.map.getSource('geojson').setData(data)
  }

  downloadData (data, uploadedData) {
    const downloadButton = $('.button__download')

    this.updateGeojson(data, uploadedData, function (err, data) {
      if (err) console.log('uh oh')
      else {
        var dataStr = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))

        downloadButton.attr('href', dataStr)
        downloadButton.attr('download', 'projected-data.json')
        downloadButton.click()
      }
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

// if (dataSource === 'Land') {
//   src = 'http://10.1.10.181:8000/ne_110m_land.geojson'
// } else if (dataSource === 'Water') {
//   src = 'http://10.1.10.181:8000/ne_110m_water.geojson'
// } else if (dataSource === 'Countries') {
//   src = 'http://10.1.10.181:8000/ne_110m_admin_0.geojson'
// } else {
//   console.log('error will robinson! error!')
// }

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

