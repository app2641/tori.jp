
var React   = require('react');
var Fluxxor = require('fluxxor');
var request = require('superagent');

var constants = {
  CHANGE_NEXT_MOVIE: 'CHANGE_NEXT_MOVIE',
  GET_NEXT_MOVIE: 'GET_NEXT_MOVIE',
  SET_MOVIE_DATA: 'SET_MOVIE_DATA'
};

var MovieStore = Fluxxor.createStore({
  initialize: function() {
    this.movies = [];
    this.last_movie_number = null;

    this.bindActions(
      constants.CHANGE_NEXT_MOVIE, this.changeNextMovie,
      constants.SET_MOVIE_DATA, this.setMovieData
    );
  },

  setMovieData: function(payload) {
    console.log(payload);
    this.emit("change");
  },

  changeNextMovie: function() {
    console.log('change');
    this.emit("change");
  },

  getState: function() {
    return {
      url: 'url'
    };
  }
});


var actions = {
  changeNextMovie: function() {
    this.dispatch(constants.CHANGE_NEXT_MOVIE);
  },
  getNextMovie: function() {
    this.dispatch(constants.GET_NEXT_MOVIE);
  },
  getMovieData: function() {
    request.get('/contents/movies.json')
    .end(function(err, response) {
      var info = JSON.parse(response.body);
      console.log(info);
      this.dispatch(constants.SET_MOVIE_DATA, {
        total: info.total,
        movies: info.movies
      });
    });
  }
};


var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var VideoContainer = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("MovieStore")],

  componentDidMount: function() {
    // this.initEventHandler();
    this.getMovieData();
  },

  getStateFromFlux: function() {
    return this.getFlux().store('MovieStore').getState();
  },

  initEventHandler: function() {
    var videos = document.getElementsByTagName('video');
    for (i in videos) {
      videos[i].addEventListener('ended', this.onEndedHandler);
    }
  },

  onEndedHandler: function() {
    this.getFlux().actions.changeNextMovie();
  },

  getMovieData: function() {
    this.getFlux().actions.getMovieData();
  },

  render: function() {
    var i = 'https://google.com';
    var b = true;
    return (<Video src={i} display={b} />);
  }
});


var Video = React.createClass({
  propTypes: {
    src: React.PropTypes.string.isRequired,
    display: React.PropTypes.bool.isRequired
  },

  componentDidMount: function() {
    // console.log(document.getElementsByTagName('video'));
  },

  render: function() {
    var style = (this.props.display) ? 'block': 'none';

    return (
      <video
        className="video-player"
        style={{display: style}}
        type="video/mp4"
        src={this.props.src}
        controls
      />
    );
  }
});


var stores = { MovieStore: new MovieStore() };
var flux = new Fluxxor.Flux(stores, actions);

React.render(
  <VideoContainer />,
    document.getElementById('video-container')
);

