import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class Home extends Component {

    constructor() {
        super();
        this.state = {
            movieName : "",
            upcomingMovies : [],
            releasedMovies : [],
            genres : [],
            artists : [],
            genresList : [],
            artistsList : [],
            releaseDateStart : "",
            releaseDateEnd : ""
        }
    }

//Handling events with React elements is very similar to handling events on DOM elements

    movieNameChangeHandler = occur => {
        this.setState({ movieName : occur.target.value });
    }

    genreSelectHandler = occur => {
        this.setState({ genres : occur.target.value });
    }

    artistSelectHandler = occur => {
        this.setState({ artists : occur.target.value });
    }

    releaseDateStartHandler = occur => {
        this.setState({ releaseDateStart : occur.target.value });
    }

    releaseDateEndHandler = occur => {
        this.setState({ releaseDateEnd : occur.target.value });
    }

    movieClickHandler = (filmId) => {
        this.props.history.push('/movie/' + filmId);
    }

   //method allows us to execute the React code synchronously when the component gets loaded or mounted in the DOM (Document Object Model). 
    componentWillMount() {
        let data = null;
        let abc = new XMLHttpRequest();
        let at = this;
        abc.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                at.setState({
                    upcomingMovies : JSON.parse(this.responseText).movies
                });
            }
        });

        abc.open("GET", this.props.baseUrl + "movies?status=PUBLISHED");
        abc.setRequestHeader("Cache-Control", "no-cache");
        abc.send(data);

        // Get released movies
        let dataReleased = null;
        let abcReleased = new XMLHttpRequest();
        abcReleased.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                at.setState({
                    releasedMovies : JSON.parse(this.responseText).movies
                });
            }
        });

        abcReleased.open("GET", this.props.baseUrl + "movies?status=RELEASED");
        abcReleased.setRequestHeader("Cache-Control", "no-cache");
        abcReleased.send(dataReleased);

        // Get filters
        //It's the process of looping through an array and including or excluding elements inside that array based on a condition that you provide
        let dataGenres = null;
        let abcGenres = new XMLHttpRequest();
        abcGenres.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                at.setState({
                    genresList : JSON.parse(this.responseText).genres
                });
            }
        });

        abcGenres.open("GET", this.props.baseUrl + "genres");
        abcGenres.setRequestHeader("Cache-Control", "no-cache");
        abcGenres.send(dataGenres);

        // Get artists
        //It's the process of looping through an array and including or excluding elements inside that array based on a condition that you provide
        let dataArtists = null;
        let abcArtists = new XMLHttpRequest();
        abcArtists.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                at.setState({
                    artistsList : JSON.parse(this.responseText).artists
                });
            }
        });

        abcArtists.open("GET", this.props.baseUrl + "artists");
        abcArtists.setRequestHeader("Cache-Control", "no-cache");
        abcArtists.send(dataArtists);
    }
//The filter() method creates a new array filled with elements that pass a test provided by a function.
    filterApplyHandler = () => {
        let queryString = "?status=RELEASED";
        if (this.state.movieName !== "") {
            queryString += "&title=" + this.state.movieName;
        }
        if (this.state.genres.length > 0) {
            queryString += "&genres=" + this.state.genres.toString();
        }
        if (this.state.artists.length > 0) {
            queryString += "&artists=" + this.state.artists.toString();
        }
        if (this.state.releaseDateStart !== "") {
            queryString += "&start_date=" + this.state.releaseDateStart;
        }
        if (this.state.releaseDateEnd !== "") {
            queryString += "&end_date=" + this.state.releaseDateEnd;
        }

        let at = this;
        let dataFilter = null;
        let abcFilter = new XMLHttpRequest();
        abcFilter.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                at.setState({
                    releasedMovies : JSON.parse(this.responseText).movies
                });
            }
        });

        abcFilter.open("GET", this.props.baseUrl + "movies" + encodeURI(queryString));
        abcFilter.setRequestHeader("Cache-Control", "no-cache");
        abcFilter.send(dataFilter);
    }
//React renders HTML to the web page by using a function called render(). The purpose of the function is to display the specified HTML code inside the specified HTML element. 
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header baseUrl={this.props.baseUrl} />

                <div className={classes.upcomingMoviesHeading}>
                    <span>Upcoming Movies</span>
                </div>

                <GridList cols={5} className={classes.gridListUpcomingMovies} >
                    {this.state.upcomingMovies.map(movie => (
                        <GridListTile key={"upcoming" + movie.id}>
                            <img src={movie.poster_url} className="movie-poster" alt={movie.title} />
                            <GridListTileBar title={movie.title} />
                        </GridListTile>
                    ))}
                </GridList>

                <div className="flex-container">
                    <div className="left">
                        <GridList cellHeight={350} cols={4} className={classes.gridListMain}>
                            {this.state.releasedMovies.map(movie => (
                                <GridListTile onClick={() => this.movieClickHandler(movie.id)} className="released-movie-grid-item" key={"grid" + movie.id}>
                                    <img src={movie.poster_url} className="movie-poster" alt={movie.title} />
                                    <GridListTileBar
                                        title={movie.title}
                                        subtitle={<span>Release Date : {new Date(movie.release_date).toDateString()}</span>}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                    <div className="right">
                        <Card>
                            <CardContent>
                                <FormControl className={classes.formControl}>
                                    <Typography className={classes.title} color="textSecondary">
                                        FIND MOVIES BY :
                                    </Typography>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                                    <Input id="movieName" onChange={this.movieNameChangeHandler} />
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="select-multiple-checkbox">Genres</InputLabel>
                                    <Select
                                        multiple
                                        input={<Input id="select-multiple-checkbox-genre" />}
                                        renderValue={selected => selected.join(',')}
                                        value={this.state.genres}
                                        onChange={this.genreSelectHandler}
                                    >
                                        {this.state.genresList.map(genre => (
                                            <MenuItem key={genre.id} value={genre.genre}>
                                                <Checkbox checked={this.state.genres.indexOf(genre.genre) > -1} />
                                                <ListItemText primary={genre.genre} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="select-multiple-checkbox">Artists</InputLabel>
                                    <Select
                                        multiple
                                        input={<Input id="select-multiple-checkbox" />}
                                        renderValue={selected => selected.join(',')}
                                        value={this.state.artists}
                                        onChange={this.artistSelectHandler}
                                    >
                                        {this.state.artistsList.map(artist => (
                                            <MenuItem key={artist.id} value={artist.first_name + " " + artist.last_name}>
                                                <Checkbox checked={this.state.artists.indexOf(artist.first_name + " " + artist.last_name) > -1} />
                                                <ListItemText primary={artist.first_name + " " + artist.last_name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="releaseDateStart"
                                        label="Release Date Start"
                                        type="date"
                                        defaultValue=""
                                        InputLabelProps={{ shrink : true }}
                                        onChange={this.releaseDateStartHandler}
                                    />
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="releaseDateEnd"
                                        label="Release Date End"
                                        type="date"
                                        defaultValue=""
                                        InputLabelProps={{ shrink : true }}
                                        onChange={this.releaseDateEndHandler}
                                    />
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formControl}>
                                    <Button onClick={() => this.filterApplyHandler()} variant="contained" color="primary">
                                        APPLY
                                    </Button>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div >
        )
    }
}

const styles = theme => ({
    root : {
        flexGrow : 1,
        backgroundColor : theme.palette.background.paper
    },
    upcomingMoviesHeading : {
        textAlign : 'center',
        background : '#ff9999',
        padding : '8px',
        fontSize : '1rem'
    },
    gridListUpcomingMovies : {
        flexWrap : 'nowrap',
        transform : 'translateZ(0)',
        width : '100%'
    },
    gridListMain : {
        transform : 'translateZ(0)',
        cursor : 'pointer'
    },
    formControl : {
        margin : theme.spacing.unit,
        minWidth : 240,
        maxWidth : 240
    },
    title : {
        color : theme.palette.primary.light,
    }
});


export default withStyles(styles)(Home);