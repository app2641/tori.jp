
var App = {};
App.VideoComponent = React.createClass({displayName: "VideoComponent",
  propTypes: {
    id: React.PropTypes.string.isRequired,
    style: React.PropTypes.shape({
      display: React.PropTypes.string.isRequired
    }),
    src: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      React.createElement("video", {
        id: this.props.id, 
        className: "video-player", 
        style: this.props.style, 
        type: "video/mp4", 
        src: this.props.src}
      )
    );
  }
});

App.VideoWraperComponent = React.createClass({displayName: "VideoWraperComponent",
  getInitialState: function () {
    return {
      data: {total: 0, movies: null},
      rands: {green: 0, blue: 0},
      style: {green: {display:'block'}, blue: {display: 'none'}},
      display_id: 'green',
      hide_id: 'blue',
      green_movie: {user: '', caption: '', url: ''},
      blue_movie: {user: '', caption: '', url: ''}
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
    this.getDisplayVideo().on('loadeddata', this.onLoadedDataHandler);
    this.getDisplayVideo().on('ended', this.onEndedHandler);
    this.getHideVideo().on('ended', this.onEndedHandler);
  },

  getDisplayVideo: function () {
    return $('video[id="'+this.state.display_id+'"]');
  },

  getHideVideo: function () {
    return $('video[id="'+this.state.hide_id+'"]');
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
    this.getDisplayVideo()[0].onloadeddata = null;
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
    this.getDisplayVideo()[0].play();
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

  render: function () {
    return (
      React.createElement("div", {id: "video-wraper"}, 
        React.createElement(App.VideoComponent, {
          id: "green", 
          style: this.state.style.green, 
          src: this.state.green_movie.url}
        ), 
        React.createElement(App.VideoComponent, {
          id: "blue", 
          style: this.state.style.blue, 
          src: this.state.blue_movie.url}
        )
      )
    );
  }
});

React.render(
  React.createElement(App.VideoWraperComponent, null),
  document.getElementById('video-container')
);

