const React = require('React')
const ReactDOM = require('react-dom')
const Map = require('./map')

const land = require('./ne_110m_land.json')

const projections = require('dirty-reprojectors/projections')
const projectionNames = Object.keys(projections)

const app = document.createElement('div')
document.body.appendChild(app)

class App extends React.Component {
  constructor () {
    super()
    this.state = { projection: 'albers' }
    this.setProjection = this.setProjection.bind(this)
  }

  setProjection (event) {
    this.setState({projection: event.target.value})
  }

  render () {
    console.log(this.state)
    return <div id='app' style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <div style={{textAlign: 'right'}}>
        <select value={this.state.projection} onChange={this.setProjection}>
          {projectionNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      <Map style={{width: 'calc(50% - 1px)', float: 'left'}} data={land} />
      <Map style={{width: 'calc(50% - 1px)', marginLeft: '2px', float: 'left'}} data={land} projection={this.state.projection} />
    </div>
  }
}

ReactDOM.render(<App />, app)
