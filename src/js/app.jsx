
var React   = require('react');
var Fluxxor = require('fluxxor');
var Request = require('superagent');

var constants = {
  CHANGE_NEXT_MOVIE: 'CHANGE_NEXT_MOVIE',
  GET_NEXT_MOVIE:    'GET_NEXT_MOVIE',
  HANDLE_SPEAKER:    'HANDLE_SPEAKER',
  INIT_VIDEO_MOVIES: 'INIT_VIDEO_MOVIES',
  PLAY_MOVIE:        'PLAY_MOVIE'
};

var MovieStore = Fluxxor.createStore({
  initialize: function() {
    this.movies = [];
    this.total  = 0;
    this.last_movie_number = null;

    this.first_movie_url  = '';
    this.second_movie_url = '';

    this.first_video_display  = true;
    this.second_video_display = false;

    this.is_muted = false;

    this.bindActions(
      constants.CHANGE_NEXT_MOVIE, this.onChangeNextMovie,
      constants.HANDLE_SPEAKER,    this.onHandleSpeaker,
      constants.INIT_VIDEO_MOVIES, this.onInitVideoMovies,
      constants.PLAY_MOVIE,        this.onPlayMovie
    );
  },

  onInitVideoMovies: function(payload) {
    this.total  = payload.total;
    this.movies = payload.movies;

    var first_movie  = this.getRandomMovie();
    var second_movie = this.getRandomMovie();

    this.first_movie_url  = first_movie.url;
    this.second_movie_url = second_movie.url;

    this.emit('change');
  },

  getRandomMovie: function() {
    do {
      var num = Math.floor(Math.random() * this.total);
    } while (this.last_movie_number == num);

    this.last_movie_number = num;
    return this.movies[num];
  },

  onChangeNextMovie: function(payload) {
    var data_name  = payload.video_id+'_movie_url';
    var next_movie = this.getRandomMovie();
    this[data_name] = next_movie.url;

    this.first_video_display  = !this.first_video_display;
    this.second_video_display = !this.second_video_display;

    this.emit("change");
  },

  onHandleSpeaker: function() {
    this.is_muted = !this.is_muted;
    this.emit('change');
  },

  onPlayMovie: function() {
    var videos = document.getElementsByTagName('video');
    for (var i = 0; i < videos.length; i++) {
      if (videos[i].style.display == 'block') {
        videos[i].play();
      }
    }
  },

  getState: function() {
    return {
      first_movie_url:  this.first_movie_url,
      second_movie_url: this.second_movie_url,
      first_video_display:  this.first_video_display,
      second_video_display: this.second_video_display,
      is_muted: this.is_muted
    };
  }
});


var actions = {
  changeNextMovie: function(video_id) {
    this.dispatch(constants.CHANGE_NEXT_MOVIE, {
      video_id: video_id
    });
  },

  initVideoMovies: function() {
    var me = this;

    Request.get('/contents/movies.json')
    .end(function(err, response) {
      var info = JSON.parse(response.body);
      me.dispatch(constants.INIT_VIDEO_MOVIES, {
        total: info.total,
        movies: info.movies
      });
    });
  },

  playMovie: function() {
    this.dispatch(constants.PLAY_MOVIE);
  },

  handleSpeaker: function() {
    this.dispatch(constants.HANDLE_SPEAKER);
  }
};


var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var VideoContainer = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin("MovieStore")],

  componentDidMount: function() {
    this.getFlux().actions.initVideoMovies();
  },

  getStateFromFlux: function() {
    return this.getFlux().store('MovieStore').getState();
  },

  handleSpeaker: function() {
    this.getFlux().actions.handleSpeaker();
  },

  render: function() {
    return (
      <div id="videos">
        <Video
          video_id="first"
          src={this.state.first_movie_url}
          display={this.state.first_video_display}
          is_muted={this.state.is_muted}
        />
        <Video
          video_id="second"
          src={this.state.second_movie_url}
          display={this.state.second_video_display}
          is_muted={this.state.is_muted}
        />
        <Speaker
          is_muted={this.state.is_muted}
          handleSpeaker={this.handleSpeaker}
        />
      </div>
    );
  }
});


var Speaker = React.createClass({
  propTypes: {
    handleSpeaker: React.PropTypes.func.isRequired,
    is_muted: React.PropTypes.bool.isRequired
  },

  render: function() {
    var img = (this.props.is_muted) ? 'vol_off.png': 'vol_on.png';
    var src = '/resources/images/'+img;

    return (
      <img
        id="speaker"
        src={src}
        onClick={this.props.handleSpeaker}
      />
    );
  }
});


var Video = React.createClass({
  mixins: [FluxMixin],

  propTypes: {
    video_id: React.PropTypes.string.isRequired,
    src: React.PropTypes.string.isRequired,
    display: React.PropTypes.bool.isRequired,
    is_muted: React.PropTypes.bool.isRequired
  },

  getInitialState: function() {
    return {url: ''};
  },

  componentDidMount: function() {
    this.initVideoEventListener();
  },

  initVideoEventListener: function() {
    var me = this;
    var video = React.findDOMNode(this.refs[this.props.video_id]);
    video.addEventListener('ended', function() {
      me.getFlux().actions.changeNextMovie(me.props.video_id);
      me.getFlux().actions.playMovie();
    });
  },

  render: function() {
    var style = (this.props.display) ? 'block': 'none';

    return (
      <video
        ref={this.props.video_id}
        className="video-player"
        style={{display: style}}
        type="video/mp4"
        src={this.props.src}
        muted={this.props.is_muted}
        controls
      />
    );
  }
});


var stores = { MovieStore: new MovieStore() };
var flux = new Fluxxor.Flux(stores, actions);

React.render(
  <VideoContainer flux={flux} />,
    document.getElementById('video-container')
);

