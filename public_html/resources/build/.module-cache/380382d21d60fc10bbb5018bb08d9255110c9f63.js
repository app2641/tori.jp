
var App = {};
App.VideoComponent = React.createClass({displayName: "VideoComponent",
  propTypes: {
    total: React.PropTypes.number.isRequired,
    date: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      next_key: null,
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
        var data  = JSON.parse(response);
        var rand  = this.getRandomNum(this.state.next_key);
        var rand2 = this.getRandomNum(rand);

        this.setState({
          next_key: rand2,
          movies: [data[rand], data[rand2]],
          movie_data: data
        });

        // MediaElementPlayerの初期化
        this.initMediaElementPlayer();
      },
      context: this
    });
  },

  getRandomNum: function (base_int) {
    var rand = base_int;
    while (rand == base_int) {
      rand = Math.floor(Math.random()* this.props.total);
    }

    return rand;
  },

  loadNextMovie: function () {
    var rand = this.getRandomNum(this.state.next_key);
    var data = this.state.movie_data;

    this.setState({
        next_key: rand,
        movies: [this.state.movies[1], data[rand]],
        movie_data: data
    });
  },

  initMediaElementPlayer: function() {
    var me = this;

    $('video')[0].addEventListener('loadeddata', function (){
      this.play()
    });
    $('video')[0].addEventListener('ended', function () {
      me.loadNextMovie();
    });
  },

  render: function () {
    return (
      React.createElement("video", {id: "video", width: "640", height: "640", controls: "foo", autoplay: "bar"}, 
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

