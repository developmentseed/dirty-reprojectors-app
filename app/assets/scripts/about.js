'use strict'
import React from 'react'

class About extends React.Component {
  aboutToggleOff () {
    const aboutPanelBack = document.querySelector('.about__content--backing')
    const aboutPanelText = document.querySelector('.about__content--text')
    aboutPanelBack.classList.add('hidden')
    aboutPanelText.classList.add('hidden')
  }

  render () {
    return (
      <div className='about__content'>
        <div onClick={this.aboutToggleOff} className='about__content--backing hidden'></div>
        <div className='about__content--text hidden'>
          <div onClick={this.aboutToggleOff} className='about__exit'>X</div>
          <h2>About</h2>
          <p>Dirty Reprojectors was built by <a href='https://www.developmentseed.org/'>Development Seed</a> to create projected geojson's for use in Mapbox GL. In short, Dirty Reprojectors takes a geojson, projects it using <a href='https://github.com/d3/d3/blob/master/API.md#projections'>D3</a>, and then reprojects the coordinates back to Mercator but keeps the geometry intact. This gets around vector tile services requirement that uploaded files be in Mercator.
          </p>
          <p>This tool is a front-face for our CLI. For further control over the projection, parralels, & center, you'll want to use the CLI. Instructions for downloading and use can be found in the <a href='https://github.com/developmentseed/dirty-reprojectors'>Dirty Reprojectors Github Repo</a>.
          </p>
          <p>This tool is also untested for each and every projection. It is entirely possible that your Geojson may not project perfectly.
          </p>
          <p>This project was inspired by <a href='https://www.mapbox.com/blog/mapping-arctic-ice-polar-projection/'>this technique</a>, and owes all the hard lifting to <a href='https://d3js.org/'>D3</a>. The default data provided here are 110m geojson's derived from <a href='http://www.naturalearthdata.com/'>NaturalEarthData.com</a>.
          </p>
          <p>Dirty Reprojectors was made possible through working with the <a href='https://www.washingtonpost.com'>Washington Post</a> on their <a href='https://www.washingtonpost.com/2016-election-results/us-presidential-race/'>2016 Election Maps.</a>
          </p>
        </div>
      </div>
    )
  }
}

module.exports = About
