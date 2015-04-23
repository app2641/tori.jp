
var App = {};
App.VideoComponent = React.createClass({displayName: "VideoComponent",

  getInitialState: function () {
    return {
      total: 0,
      movie: {user: null, caption: null, url: null},
      movie_data: null
    };
  },

  componentDidMount: function () {

    $.ajax({
      url: '/contents/movies.json',
      success: function (response) {
        var data  = JSON.parse(response);
        var rand = this.getRandomNum(data.total);

        this.setState({
          total: data.total,
          movie: data.movies[rand],
          movie_data: data.movies
        });

        this.initPlayer();
      },
      context: this
    });
  },

  getRandomNum: function (total) {
    return Math.floor(Math.random()* total);
  },

  loadNextMovie: function () {
    var rand = this.getRandomNum(this.state.total);

    this.setState({
      total: this.state.total,
      movie: this.state.movie_data[rand],
      movie_data: this.state.movie_data
    });
  },

  initPlayer: function() {
    var me = this;

    $('video')[0].addEventListener('loadeddata', function (){
      this.play();
    });
    $('video')[0].addEventListener('ended', function () {
      me.loadNextMovie();
    });
  },

  render: function () {
    return (
      React.createElement("video", {id: "video-player", controls: true, autoplay: true, 
          type: "video/mp4", src: this.state.movie.url})
    );
  }
});

React.render(
  React.createElement(App.VideoComponent, null),
  document.getElementById('video-container')
);

