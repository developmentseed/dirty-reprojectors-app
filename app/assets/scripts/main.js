'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

import config from './config'
import Map from './map'
import About from './about'
import projections from 'dirty-reprojectors/projections'

console.log.apply(console, config.consoleMessage)
console.log('Environment', config.environment)

const projectionNames = Object.keys(projections)

const app = document.createElement('div')
document.body.appendChild(app)

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      projection: 'albers',
      dataSource: 'Land',
      uploadedData: 'empty'
    }
    this.setProjection = this.setProjection.bind(this)
    this.setGeojson = this.setGeojson.bind(this)
    this.uploadData = this.uploadData.bind(this)
  }

  setProjection (event) {
    this.setState({projection: event.target.value})
  }

  setGeojson (event) {
    this.setState({
      dataSource: event.target.value,
      uploadedData: 'empty'
    })
  }

  uploadData (event) {
    this.setState({uploadedData: event.target.value})
  }

  aboutToggle () {
    const aboutSection = $('.about__panel')
    if (aboutSection.hasClass('hidden')) {
      aboutSection.removeClass('hidden')
    } else {
      aboutSection.addClass('hidden')
    }
  }

  render () {
    return <div id='app' style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <section className='main'>
        <section className='about__panel hidden' onClick={this.aboutToggle}>
          <About />
        </section>

        <div className='selection__panel'>
          <header>
            <h1>Dirty Reprojectors</h1>
            <p>Create "projected" GeoJSON's for vector tile servers</p>
          </header>

          <dt className='dt__no-top'><div className='boldme'>1.</div> Choose Your Data</dt>
          <dd>
            <select value={this.state.dataSource} onChange={this.setGeojson}>
              <option>Land</option>
              <option>Countries</option>
              <option>States, Providences</option>
              <option>Water</option>
              <option>Lakes</option>
              <option>Rivers</option>
              <option>Populated Places</option>
            </select>
          </dd>
          <div className='dd__split'>or</div>
          <dd>
            <input type='file' className='button__upload' value='' onChange={this.uploadData} />
          </dd>

          <dt><div className='boldme'>2.</div> Choose a Projection</dt>
          <dd>
            <select value={this.state.projection} onChange={this.setProjection}>
              {projectionNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </dd>
          <dt><div className='boldme'>3.</div> Get Projected Geojson</dt>
          <dd>
            <button className='button__download'>Download</button>
          </dd>
        </div>
      </section>

      <section className='map-land'>
        <Map data={this.state.dataSource} projection={this.state.projection} uploadedData={this.state.uploadedData} />
      </section>
      <footer className='footer'>
        <section className='footer__left'>
          <a onClick={this.aboutToggle}>About</a> | <a href='https://github.com/developmentseed/dirty-reprojectors-app'>Dirty Reprojectors CLI</a>
        </section>
        <section className='footer__right'>
          Made with ♥ by <a href='https://www.developmentseed.org/'>Development Seed</a>
        </section>
      </footer>
    </div>
  }
}

ReactDOM.render(<App />, app)
