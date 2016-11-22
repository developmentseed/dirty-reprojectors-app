const React = require('react')
const mapboxgl = require('mapbox-gl')
const reproject = require('dirty-reprojectors')
const projections = require('dirty-reprojectors/projections')
const clone = require('lodash.clonedeep')

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
            data: 'ne_110m_land.json'
          }
        },
        layers: [{
          id: 'bg',
          type: 'background',
          paint: {
            'background-color': '#2f2f2f'
          }
        }, {
          id: 'land',
          type: 'fill',
          source: 'land',
          paint: {
            'fill-color': '#333'
          }
        }, {
          id: 'line',
          type: 'line',
          source: 'geojson',
          paint: {
            'line-color': '#788'
          }
        }]
      }
    })

    this.map.on('load', () => {
      this.setMapData(this.props.data, this.props.projection)
    })
  }

  setMapData (data, projection) {
    if (!this.map.loaded()) { return }
    if (projection) {
      data = clone(data)
      for (const feature of data.features) {
        reproject({
          forward: projection,
          reverse: 'mercator',
          projections: projections
        }, feature.geometry.coordinates)
      }
    }
    this.map.getSource('geojson').setData(data)
  }

  componentWillReceiveProps (next) {
    if (next.data !== this.props.data || next.projection !== this.props.projection) {
      if (next.data && next.data.features) {
        this.setMapData(next.data, next.projection)
      }
    }
  }

  render () {
    return (
      <div style={Object.assign({
        height: '100%'
      }, this.props.style)}>
        <div style={{height: '100%', width: '100%'}}
          ref={(el) => { this.container = el }}>
        </div>
      </div>
    )
  }
}

module.exports = Map
