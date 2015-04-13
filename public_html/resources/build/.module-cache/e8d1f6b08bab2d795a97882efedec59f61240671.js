
var App = {};
App.VideoComponent = React.createClass({displayName: "VideoComponent",
  propTypes: {
    total: React.PropTypes.number.isRequired,
    date: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      movies: [
        {user: null, caption: null, url: null},
        {user: null, caption: null, url: null}
      ],
      movie_data: null
    };
  },

  componentDidMount: function () {
    var dates = this.props.date.split('-');
    var url = "/contents/"+dates[0]+"/"+dates[1]+"/"+dates[2]+"/movies.json";

    $.ajax({
      url: url,
      success: function (response) {
        var data = JSON.parse(response);
        var rand = this.getRandomNum();
        var rand2 = rand;

        while (rand2 == rand) {
          rand2 = this.getRandomNum();
        }

        this.setState({
          movies: [data[rand], data[rand2]],
          movie_data: data
        });

        // MediaElementPlayerの初期化
        this.initMediaElementPlayer();
      },
      context: this
    });
  },

  getRandomNum: function () {
    return Math.floor(Math.random()* this.props.total);
  },

  loadNextMovie: function () {
    var sources = $('video source');
    console.log(sources);
  },

  initMediaElementPlayer: function() {
    var me = this;

    $('video').mediaelementplayer({
      enableAutosize: true,
      alwaysShowControls: false,
      alwaysShowHours: false
    });
    $('video')[0].addEventListener('loadeddata', function (){
      this.play()
    });
    $('video')[0].addEventListener('ended', function () {
      me.loadNextMovie();
    });
  },

  render: function () {
    return (
      React.createElement("video", {id: "video", controls: "controls", preload: "auto", width: "640", height: "640"}, 
        React.createElement("source", {type: "video/mp4", src: this.state.movies[0].url}), 
        React.createElement("source", {type: "video/mp4", src: this.state.movies[1].url})
      )
    );
  }
});

React.render(
  React.createElement(App.VideoComponent, {total: Info.total, date: Info.date}),
  document.getElementById('video-container')
);

