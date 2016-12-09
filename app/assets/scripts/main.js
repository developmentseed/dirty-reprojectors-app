'use strict'
import React from 'react'
import ReactDOM from 'react-dom'

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
      uploadedData: 'empty',
      uploadError: null
    }
    this.setProjection = this.setProjection.bind(this)
    this.setGeojson = this.setGeojson.bind(this)
    this.uploadData = this.uploadData.bind(this)
  }

  setProjection (event) {
    document.querySelector('.loader__box').classList.remove('hidden')
    this.setState({projection: event.target.value})
  }

  setGeojson (event) {
    document.querySelector('.loader__box').classList.remove('hidden')

    this.setState({
      dataSource: event.target.value,
      uploadedData: 'empty'
    })
  }

  uploadData (event) {
    var reader = new FileReader()
    var self = this

    document.querySelector('.loader__box').classList.remove('hidden')

    reader.onload = function (event) {
      try {
        var obj = JSON.parse(event.target.result)
      }
      catch (e) {
        return self.setState({uploadError: true});
      }
      self.setState({uploadedData: obj})
    }
    reader.readAsText(event.target.files[0])
  }

  aboutToggle () {
    const aboutPanelBack = document.querySelector('.about__content--backing')
    const aboutPanelText = document.querySelector('.about__content--text')
    aboutPanelBack.classList.remove('hidden')
    aboutPanelText.classList.remove('hidden')
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
        <section className='about__panel'>
          <About />
        </section>

        <div className='selection__panel'>
          <header>
            <h1>Dirty Reprojectors</h1>
            <h3><span className='header__text'>Created by </span><a href='https://www.developmentseed.org/' target='_blank'><span className="collecticon collecticon-devseed"></span><span className='header__text'>Development Seed</span></a></h3>
            <div className='header__divider'>
              <p className='header__description'>Getting projected data into vector tiles is a pain. Here you can upload a geojson, project it, and download a projected version of it that can be used in Mapbox Studio.</p>
            </div>
          </header>

          <div className='selection'>
            <dt className='dt__no-top'><div className='boldme'>1.</div> Choose Your Data</dt>
            <dd>
              <select className='button__data' value={this.state.dataSource} onChange={this.setGeojson}>
                <option>Land</option>
                <option>Countries</option>
                <option>United States</option>
                <option>Water</option>
                <option>Lakes</option>
                <option>Rivers</option>
                <option>Populated Places</option>
              </select>
            </dd>
            <dd className='button__upload--face'>
              <span><span className="collecticon collecticon-share"></span><span className='button__text'>Upload Geojson</span></span>
              <input type='file' className='button__upload' value='' onChange={this.uploadData} />
            </dd>
            {this.state.uploadError ? (
              <label className='button__upload--error'>Please upload valid geojson only!</label>
            ) : null}

            <dt><div className='boldme'>2.</div> Choose a Projection</dt>
            <dd>
              <select value={this.state.projection} onChange={this.setProjection}>
                {projectionNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </dd>
            <dt><div className='boldme'>3.</div> Download Projected Geojson</dt>
            <dd>
              <button className='button__download'><span className='collecticon collecticon-download'></span><span className='button__text'>Download</span></button>
            </dd>
          </div>
          <footer className='selection__panel--footer'>
            <span className='button__text'><a onClick={this.aboutToggle}>About</a> | </span><a href='https://github.com/developmentseed/dirty-reprojectors' target='_blank'><span className="collecticon collecticon-github"></span><span className='button__text'>Dirty Reprojectors CLI</span></a>
          </footer>
        </div>
      </section>

      <section className='map-land'>
        <Map data={this.state.dataSource} projection={this.state.projection} uploadedData={this.state.uploadedData} />
      </section>
    </div>
  }
}

ReactDOM.render(<App />, app)
