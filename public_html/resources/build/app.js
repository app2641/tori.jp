
var App = {};
App.VideoComponent = React.createClass({displayName: "VideoComponent",

  getInitialState: function () {
    return {
      data: {total: 0, movies: null},
      rands: {green: 0, blue: 0},
      style: {green: {display:'block'}, blue: {display: 'none'}},
      display_id: 'green',
      hide_id: 'blue',
      green_movie: {user: null, caption: null, url: null},
      blue_movie: {user: null, caption: null, url: null}
    };
  },

  display_style: {
    display: 'block'
  },

  hide_style: {
    display: 'none'
  },


  componentDidMount: function () {
    $.ajax({
      url: '/contents/movies.json',
      success: function (response) {
        var info = JSON.parse(response);
        this.initPlayer(info);
      },
      context: this
    });
  },

  initPlayer: function (info) {
    var me = this;
    var g_rand = this.getRandomNum(info.total, 0);
    var b_rand = this.getRandomNum(info.total, g_rand);

    $('video[id="'+this.state.display_id+'"]')[0].onloadeddata = function () {
      this.play();
    };

    $('video[id="'+this.state.display_id+'"]')[0].addEventListener(
      'ended', function () {
        me.destroyPlayerEvents();
        me.reverseStyle();
        me.playVideo();
        me.updateRandomNum();
      }
    );

    $('video[id="'+this.state.hide_id+'"]')[0].addEventListener(
      'ended', function () {
        me.destroyPlayerEvents();
        me.reverseStyle();
        me.playVideo();
        me.updateRandomNum();
      }
    );

    this.setState({
      info: info,
      rands: {green: g_rand, blue: b_rand},
      green_movie: info.movies[g_rand],
      blue_movie: info.movies[b_rand]
    });
  },

  getRandomNum: function (total, base_rand) {
    var rand = base_rand;
    while (base_rand == rand) {
      rand = Math.floor(Math.random() * total);
    }

    return rand;
  },

  destroyPlayerEvents: function () {
    $('video[id="'+this.state.display_id+'"]')[0].onloadeddata = null;
  },

  reverseStyle: function () {
    var display_id = this.state.hide_id;
    var hide_id = this.state.display_id;
    var style = {};
    style[display_id] = this.display_style;
    style[hide_id] = this.hide_style;

    this.setState({
      display_id: display_id,
      hide_id: hide_id,
      style: style
    });
  },

  playVideo: function () {
    $('video[id="'+this.state.display_id+'"]')[0].play();
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
        React.createElement("video", {
          id: "green", 
          className: "video-player", 
          style: this.state.style.green, 
          controls: true, 
          type: "video/mp4", 
          src: this.state.green_movie.url}
        ), 
        React.createElement("video", {
          id: "blue", 
          className: "video-player", 
          style: this.state.style.blue, 
          controls: true, 
          type: "video/mp4", 
          src: this.state.blue_movie.url}
        )
      )
    );
  }
});

React.render(
  React.createElement(App.VideoComponent, null),
  document.getElementById('video-container')
);

