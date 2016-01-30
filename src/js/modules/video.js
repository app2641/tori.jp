import $ from 'jquery'

class Video {
  constructor (elem) {
    this.elem = elem
  }

  isVisible () {
    return this.elem.is(':visible')
  }

  isInvisible () {
    return this.elem.is(':hidden')
  }

  reverseVisual () {
    if (this.isVisible()) {
      this.elem.hide()
      return
    }
    if (this.isInvisible()) {
      this.elem.show()
      return
    }
  }

  initLoadedDataEvent () {
    let _this = this
    this.elem.on('loadeddata', () => {
      _this.elem.play()
    })
  }

  initEndedEvent () {
    let _this = this
    this.elem.on('ended', () => {
      _this.elem.off('loadeddata')
      _this.reverseVisual()
    })
  }
}

export default Video
