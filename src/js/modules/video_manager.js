import $ from 'jquery'
import StateManager from './state_manager.js'

class VideoManager extends StateManager {
  constructor (videos) {
    super()
    this.videos = videos
  }

  reverseVisual () {
    let visible_video = this.getVisibleVideo()
    let invisible_video = this.getInvisibleVideo()
    invisible_video.show()
    visible_video.hide()
  }

  playVideo () {
    this.getVisibleVideo().get(0).play()
  }

  getRandomMovieUrl () {
    let _this = this
    do  {
      var num = Math.floor(Math.random() * _this.getState('total'))
    } while (_this.state.last_movie_number == num)

    this.setState('last_movie_number', num)
    return this.getState('movies')[num]
  }

  updateInvisibleVideoSrc () {
    this.getInvisibleVideo().attr('src', this.getRandomMovieUrl().url)
  }

  initMovieUrl () {
    this.getVisibleVideo().attr('src', this.getRandomMovieUrl().url)
    this.getInvisibleVideo().attr('src', this.getRandomMovieUrl().url)
  }

  initEventListeners () {
    let _this = this
    let endedEvent = () => {
      _this.reverseVisual()
      _this.playVideo()
      _this.updateInvisibleVideoSrc()
    }
    this.getVisibleVideo().get(0).addEventListener('ended', endedEvent)
    this.getInvisibleVideo().get(0).addEventListener('ended', endedEvent)
  }

  getVisibleVideo () {
    let result = false
    $.each(this.videos, (i, video) => {
      if (video.is(':visible')) result = video
    })

    return result
  }

  getInvisibleVideo () {
    let result = false
    $.each(this.videos, (i, video) => {
      if (video.is(':hidden')) result = video
    })

    return result
  }
}

export default VideoManager
