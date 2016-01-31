import $ from 'jquery'
import VideoManager from './video_manager.js'

class MobileVideoManager extends VideoManager {
  initEventListeners () {
    let _this = this
    let endedEvent = () => {
      _this.initMovieUrl()
      _this.playVideo()
    }
    this.getVisibleVideo().get(0).addEventListener('ended', endedEvent)
  }

  initMovieUrl () {
    this.getVisibleVideo().attr('src', this.getRandomMovieUrl().url)
  }
}

export default MobileVideoManager
