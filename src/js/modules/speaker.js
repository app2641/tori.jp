import $ from 'jquery'

class Speaker {
  constructor (elem, videos) {
    this.elem = elem
    this.videos = videos
    this.is_muted = false
  }

  initEventListeners () {
    let _this = this
    this.elem.on('click', () => {
      _this.is_muted = !_this.is_muted

      let img = _this.is_muted ? 'vol_off.png': 'vol_on.png'
      _this.elem.attr('src', '/resources/images/' + img)

      $.each(_this.videos, (i, video) => {
        video.prop('muted', _this.is_muted)
      })
    })
  }
}

export default Speaker
