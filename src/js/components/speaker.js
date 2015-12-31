import React, { Component } from 'react'

class Speaker extends Component {
  render () {
    let img = (this.props.is_muted) ? 'vol_off.png': 'vol_on.png';
    let src = '/resources/images/'+img;

    return (
      <img
        id="speaker"
        src={src}
        onClick={this.props.handle}
      />
    )
  }
}

Speaker.propTypes = {
  handle: React.PropTypes.func.isRequired,
  is_muted: React.PropTypes.bool.isRequired
}

export default Speaker
