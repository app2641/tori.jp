import $ from 'jquery'
import Request from 'superagent'
import VideoManager from './video_manager.js'
import MobileVideoManager from './mobile_video_manager.js'
import Speaker from './speaker.js'

class App {
  constructor () {
    this.showMask()

    let videos = [$('.video-player:visible'), $('.video-player:hidden')]
    this.video_manager = (this.isMobile()) ? new MobileVideoManager(videos): new VideoManager(videos)
    this.speaker = new Speaker($('#speaker'), videos)
  }

  init () {
    this.prepareMovieData()
    this.speaker.initEventListeners()
  }

  isMobile () {
    if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) ||
        navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
      return true
    } else {
      return false
    }
  }

  showMask () {
    $('#logo-image').animate({
      opacity: 1
    }, 1000)
  }

  hideMask () {
    let _this = this
    $('.mask-component').delay(2000).animate({
      opacity: 0
    }, 1000, null, (e) => {
      $('.mask-component').hide()
      _this.video_manager.playVideo()
    })
  }

  prepareMovieData () {
    let _this = this
    Request.get('/contents/movies.json').end((err, res) => {
      let info = JSON.parse(res.body)
      _this.video_manager.setState('total', info.total)
      _this.video_manager.setState('movies', info.movies)
      _this.video_manager.initMovieUrl()
      _this.video_manager.initEventListeners()
      _this.hideMask()
    })
  }
}

export default App
