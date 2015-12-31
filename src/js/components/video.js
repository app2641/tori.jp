import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Video extends Component {
  render () {
    let style = (this.props.visible) ? 'block': 'none';

    return (
      <video
        className="video-player"
        style={{display: style}}
        type="video/mp4"
        src={this.props.src}
        muted={this.props.is_muted}
        controls
      />
    )
  }
}

Video.propTypes = {
  src: React.PropTypes.string.isRequired,
  visible: React.PropTypes.bool.isRequired,
  is_muted: React.PropTypes.bool.isRequired
}

export default Video
