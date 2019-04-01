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
      uploadError: null,
      loading: false
    }
    this.setProjection = this.setProjection.bind(this)
    this.setGeojson = this.setGeojson.bind(this)
    this.uploadData = this.uploadData.bind(this)
  }

  setProjection (event) {
    this.setState({
      projection: event.target.value,
      uploadError: false,
      loading: true
    })
  }

  setGeojson (event) {
    this.setState({
      dataSource: event.target.value,
      uploadedData: 'empty',
      uploadError: false,
      loading: true
    })
  }

  uploadData (event) {
    var reader = new FileReader()
    var self = this

    this.setState({ loading: true })
    reader.onload = function (event) {
      try {
        var obj = JSON.parse(event.target.result)
      } catch (e) {
        return self.setState({
          uploadError: true,
          loading: false
        })
      }
      self.setState({
        uploadedData: obj,
        uploadError: false,
        loading: false
      })
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
            <h3><span className='header__text'>Created by </span><a href='https://www.developmentseed.org/' target='_blank'><span className="collecticon collecticons-devseed"></span><span className='header__text'>Development Seed</span></a></h3>
            <div className='header__divider'>
              <p className='header__description header__description--desktop'>Download geojson for common features in different projections, or upload your own WGS84 geojson and reproject it.</p>
              <p className='header__description header__description--mobile'>Download geojson for common features in different projections.</p>
            </div>
          </header>

          <div className='selection'>
            <dt><div className='boldme'>1.</div> Choose Your Data</dt>
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
              <span><span className="collecticon collecticons-share"></span><span className='button__text'>Upload Geojson</span></span>
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
              <button className='button__download'><span className='collecticon collecticons-download'></span><span className='button__text'>Download</span></button>
            </dd>
          </div>
          <footer className='selection__panel--footer'>
            <span className='button__text button__about'><a onClick={this.aboutToggle}>About</a> | </span><a href='https://github.com/developmentseed/dirty-reprojectors' target='_blank'><span className="collecticon collecticons-github"></span><span className='button__text'>Dirty Reprojectors CLI</span></a>
          </footer>
        </div>
      </section>

      <section className='map__container'>
        <Map data={this.state.dataSource} projection={this.state.projection} uploadedData={this.state.uploadedData} loading={this.state.loading} />
      </section>

      <footer className='footer__mobile'>
        <a href='https://github.com/developmentseed/dirty-reprojectors' target='_blank'><span className="collecticon collecticons-github"></span><span className='button__text'>Dirty Reprojectors CLI</span></a>
      </footer>
    </div>
  }
}

ReactDOM.render(<App />, app)
