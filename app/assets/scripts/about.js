'use strict'
import React from 'react'
import $ from 'jquery'

class About extends React.Component {
  aboutToggleOff () {
    const aboutSection = $('.about__panel')
    aboutSection.addClass('hidden')
  }

  render () {
    return (
      <div className='about__content'>
        <div onClick={this.aboutToggleOff} className='about__content--backing'></div>
          <div className='about__content--text'>
            <div onClick={this.aboutToggleOff} className='about__exit'>X</div>
            <h2>About</h2>
            <p>Dirty Reprojectors was built by <a>Development Seed</a> to create projected geojson's for use in Mapbox GL. In short, Dirty Reprojectors takes a geojson, projects it using D3, and then reprojects the coordinates back to Mercator but keeps the geometry intact. This gets around vector tile services requirement that uploaded files be in Mercator.
            </p>
            <p>This tool is a front-face for our CLI. For further control over the projection, parralels, & center, you'll want to use the CLI. Instructions for downloading and use can be found in the <a>Dirty Reprojectors Github Repo</a>.
            </p>
            <p>This project was inspired by <a>this technique</a>, and owes all the hard lifting to <a>D3</a>. The default data provided here are 110m geojson's derived from <a>NaturalEarthData.com</a>.
            </p>
            <p>Dirty Reprojectors was made possible through working on the <a>Washington Post's 2016 Election Maps.</a>
            </p>
          </div>
        </div>
    )
  }
}

module.exports = About
