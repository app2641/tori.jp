import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Request from 'superagent'
import Video from './video.js'
import Speaker from './speaker.js'

class VideoContainer extends Component {
  constructor () {
    super()
    this.state = {
      movies: [],
      total: 0,
      last_movie_number: null,
      first_movie_url: '',
      second_movie_url: '',
      first_movie_visible: true,
      second_movie_visible: false,
      is_muted: false
    }
  }

  componentDidMount () {
    let me = this
    Request.get('/contents/movies.json')
    .end((err, response) => {
      let info = JSON.parse(response.body);

      me.setState({
        total: info.total,
        movies: info.movies
      })

      let first_movie  = this.getRandomMovie()
      let second_movie = this.getRandomMovie()

      me.setState({
        first_movie_url: first_movie.url,
        second_movie_url: second_movie.url
      })

      me.initEventListeners()
    })
  }

  getRandomMovie () {
    do  {
      var num = Math.floor(Math.random() * this.state.total)
    } while (this.state.last_movie_number == num)

    this.setState({last_movie_number: num})
    return this.state.movies[num]
  }

  initEventListeners () {
    let me = this
    this.getVisibleVideo().addEventListener('loadeddata', () => {
      me.getVisibleVideo().play()
    })
    this.getVisibleVideo().addEventListener('ended', () => {
      me.getVisibleVideo().onloadeddata = null
      me.reverseVisible()
      me.getVisibleVideo().play()
      me.updateNextMovie()
    })
    this.getInvisibleVideo().addEventListener('ended', () => {
      me.getVisibleVideo().onloadeddata = null
      me.reverseVisible()
      me.getVisibleVideo().play()
      me.updateNextMovie()
    })
  }

  getVisibleId () {
    return (this.state.first_movie_visible) ? 'first': 'second'
  }

  getInvisibleId () {
    return (this.state.first_movie_visible) ? 'second': 'first'
  }

  getVisibleVideo () {
    let visible_id = this.getVisibleId()
    return ReactDOM.findDOMNode(this.refs[visible_id])
  }

  getInvisibleVideo () {
    let invisible_id = this.getInvisibleId()
    return ReactDOM.findDOMNode(this.refs[invisible_id])
  }

  reverseVisible () {
    this.setState({
      visible_id: this.state.invisible_id,
      invisible_id: this.state.visible_rd,
      first_movie_visible: !this.state.first_movie_visible,
      second_movie_visible: !this.state.second_movie_visible
    })
  }

  updateNextMovie () {
    let invisible_id = this.getInvisibleId()
    let next_movie = this.getRandomMovie()
    let property_name  = invisible_id+'_movie_url';
    let state_data = {}
    state_data[property_name] = next_movie.url

    this.setState(state_data)
  }

  muteEvent () {
    let is_muted = !this.state.is_muted;
    this.setState({is_muted: is_muted});
  }

  render () {
    return (
      <div id="videos">
        <Video
          ref="first"
          src={this.state.first_movie_url}
          visible={this.state.first_movie_visible}
          is_muted={this.state.is_muted}
        />
        <Video
          ref="second"
          src={this.state.second_movie_url}
          visible={this.state.second_movie_visible}
          is_muted={this.state.is_muted}
        />
      </div>
    )
  }
}

export default VideoContainer
