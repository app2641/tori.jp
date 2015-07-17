
var React   = require('react');
var request = require('superagent');

var App = {};
App.VideoComponent = React.createClass({
  propTypes: {
    style: React.PropTypes.shape({
      display: React.PropTypes.string.isRequired
    }),
    src: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      <video
        className="video-player"
        style={this.props.style}
        type="video/mp4"
        src={this.props.src}
        controls
      />
    );
  }
});

App.SpeakerComponent = React.createClass({
  propTypes: {
    handle: React.PropTypes.func.isRequired,
    muted: React.PropTypes.bool.isRequired
  },

  render: function () {
    var img = (this.props.muted) ? 'vol_off.png': 'vol_on.png';
    var src = '/resources/images/'+img;

    return (
      <img
        id="speaker"
        src={src}
        onClick={this.props.handle}
      />
    );
  }
});

App.VideoWraperComponent = React.createClass({
  getInitialState: function () {
    return {
      data: {total: 0, movies: null},
      rands: {green: 0, blue: 0},
      style: {green: {display:'block'}, blue: {display: 'none'}},
      display_id: 'green',
      hide_id: 'blue',
      green_movie: {user: '', caption: '', url: ''},
      blue_movie: {user: '', caption: '', url: ''},
      muted: false
    };
  },

  componentDidMount: function () {
    $.ajax({
      url: '/contents/movies.json',
      success: function (response) {
        var info   = JSON.parse(response);
        var g_rand = this.getRandomNum(info.total, 0);
        var b_rand = this.getRandomNum(info.total, g_rand);

        this.initEventHandler();

        this.setState({
          info: info,
          rands: {green: g_rand, blue: b_rand},
          green_movie: info.movies[g_rand],
          blue_movie: info.movies[b_rand]
        });
      },
      context: this
    });
  },

  initEventHandler: function () {
    this.getDisplayVideo().addEventListener('loadeddata', this.onLoadedDataHandler);
    this.getDisplayVideo().addEventListener('ended', this.onEndedHandler);
    this.getHideVideo().addEventListener('ended', this.onEndedHandler);
  },

  getDisplayVideo: function () {
    return React.findDOMNode(this.refs[this.state.display_id]);
  },

  getHideVideo: function () {
    return React.findDOMNode(this.refs[this.state.hide_id]);
  },

  onLoadedDataHandler: function () {
    this.playVideo();
  },

  onEndedHandler: function () {
    this.destroyPlayerEvents();
    this.reverseStyle();
    this.playVideo();
    this.updateRandomNum();
  },

  getRandomNum: function (total, base_rand) {
    var rand = base_rand;
    while (base_rand == rand) {
      rand = Math.floor(Math.random() * total);
    }

    return rand;
  },

  destroyPlayerEvents: function () {
    this.getDisplayVideo().onloadeddata = null;
  },

  reverseStyle: function () {
    var display_id = this.state.hide_id;
    var hide_id = this.state.display_id;
    var style = {};
    style[display_id] = {display: 'block'};
    style[hide_id] = {display: 'none'};

    this.setState({
      display_id: display_id,
      hide_id: hide_id,
      style: style
    });
  },

  playVideo: function () {
    this.getDisplayVideo().play();
  },

  updateRandomNum: function () {
    var base_rand = this.state.rands[this.state.display_id];
    var rand = this.getRandomNum(this.state.info.total, base_rand);

    var rands = {rands: {}};
    rands[this.state.hide_id] = rand;
    rands[this.state.display_id] = base_rand;

    var property = this.state.hide_id+'_movie';
    var movie = this.state.info.movies[rand];

    var state = {rands: rands};
    state[property] = movie;

    this.setState(state);
  },

  handleMute: function () {
    var muted = !this.state.muted;
    React.findDOMNode(this.refs[this.state.display_id]).muted = muted;
    React.findDOMNode(this.refs[this.state.hide_id]).muted = muted;

    this.setState({
      muted: muted
    });
  },

  render: function () {
    return (
      <div id="video-wraper">
        <App.VideoComponent
          ref="green"
          style={this.state.style.green}
          src={this.state.green_movie.url}
        />
        <App.VideoComponent
          ref="blue"
          style={this.state.style.blue}
          src={this.state.blue_movie.url}
        />
        <App.SpeakerComponent
          handle={this.handleMute}
          muted={this.state.muted}
        />
      </div>
    );
  }
});

React.render(
  <App.VideoWraperComponent />,
  document.getElementById('video-container')
);

