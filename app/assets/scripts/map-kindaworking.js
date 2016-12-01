const React = require('react')
const mapboxgl = require('mapbox-gl')
const reproject = require('dirty-reprojectors')
const projections = require('dirty-reprojectors/projections')
const clone = require('lodash.clonedeep')
const $ = require('jquery')

var jsonHolder = ''

class Map extends React.Component {
  componentDidMount () {
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
            data: this.updateGeojson(this.props.data, this.props.projection)
          }
        },
        layers: [{
          id: 'bg',
          type: 'background',
          paint: {
            'background-color': '#dedede'
          }
        }, {
          id: 'line',
          type: 'line',
          source: 'geojson',
          paint: {
            'line-color': '#788'
          }
        }, {
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
      this.setMapData(this.props.data, this.props.projection)
    })
  }

  updateGeojson (dataSource, projection, callback) {
    var src = 'http://10.1.10.181:8000/ne_110m_land.geojson'

    $.getJSON(src, function (json) {
      jsonHolder = json
    })
  }

  setMapData (data, projection) {
    if (!this.map.loaded()) { return }
    if (projection) {
      data = clone(jsonHolder)
      for (const feature of data.features) {
        feature.geometry = reproject({
          forward: projection,
          reverse: 'mercator',
          projections: projections
        }, feature.geometry)
      }
    }
    console.log(data)
    this.map.getSource('geojson').setData(data)
  }

  componentWillReceiveProps (next) {
    if (next.data !== this.props.data || next.projection !== this.props.projection) {
      this.updateGeojson(next.data)
      this.setMapData(next.data, next.projection)
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
