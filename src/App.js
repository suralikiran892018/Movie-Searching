import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import MovieComponent from "./components/MovieComponent";
import MovieDetailsComponent from "./components/MovieDetailsComponent";

export const API_KEY = "e962670b332083797d37df4aa8dad8be"; // Define API_KEY here

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
  z-index: 100;
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  border-radius: 6px;
  margin-left: 30px;
  width: 40%;
  background-color: white;
`;

const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const MovieImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 15px;
  margin-right: 40px;
  cursor: pointer;
  transition: background-color 0.1s, transform 0.1s;

  &:hover {
    transform: translateY(-5px);
  }
`;
const MovieImage1 = styled.img`
width: 48px;
height: 48px;
margin: 15px;
margin-right: 40px;

border-radius: 50%;
cursor: pointer;
transition: background-color 0.1s, transform 0.1s;

&:hover {
  
  transform: translateY(+5px);
}
`;

const SearchInput = styled.input`
  color: black;
  font-size: 14px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
  width: 30%;
`;

const MovieListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 25px;
  justify-content: space-evenly;
`;

function App() {
  const [searchQuery, updateSearchQuery] = useState("");
  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState();
  const [page, setPage] = useState(1);

  const [timeoutId, updateTimeoutId] = useState();

  const fetchUpcomingMovies = useCallback(async () => {
    try {
      const response = await Axios.get(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`
      );

      const newMovies = response.data.results;

      // Filter and sort only the latest upcoming movies
      const latestMovies = newMovies
        .filter((movie) => new Date(movie.release_date) >= new Date())
        .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

      updateMovieList((prevMovies) => [...prevMovies, ...latestMovies]);
      setPage(page + 1);
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
    }
  }, [page]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      fetchUpcomingMovies();
    }
  }, [fetchUpcomingMovies]);

  useEffect(() => {
    fetchUpcomingMovies();
  }, [fetchUpcomingMovies]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const fetchData = async (searchString) => {
    try {
      const response = await Axios.get(
        `https://api.themoviedb.org/3/search/movie?query=${searchString}&api_key=${API_KEY}`
      );

      const filteredMovies = response.data.results.filter(
        (movie) => movie.vote_average > 0
      );

      // Sort movies by release date in descending order
      filteredMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

      updateMovieList(filteredMovies);
      setPage(1);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const onTextChange = (e) => {
    onMovieSelect("");
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    const timeout = setTimeout(() => fetchData(e.target.value), 500);
    updateTimeoutId(timeout);
  };

  return (
    <Router>
      <Container>
        <Header>
          <SearchBox>
            <SearchIcon src="/react-movie-app/search-icon.svg" />
            <SearchInput
              placeholder="Search Movie"
              value={searchQuery}
              onChange={onTextChange}
            />
          </SearchBox>
          <AppName>
            <Link to="/">
              <MovieImage1 src="/react-movie-app/git.png" />
            </Link>
            <Link to="/">
              <MovieImage src="/react-movie-app/home.png" />
            </Link>
            
          </AppName>
        </Header>
        <Routes>
          <Route
            path="/"
            element={
              <MovieListContainer>
                {movieList.length === 0 ? (
                  "Loading..."
                ) : (
                  movieList.map((movie, index) => (
                    <Link key={index} to={`/details/${movie.id}`}>
                      <MovieComponent movie={movie} onMovieSelect={onMovieSelect} />
                    </Link>
                  ))
                )}
              </MovieListContainer>
            }
          />

          <Route
            path="/details/:movieId"
            element={
              <MovieDetailsComponent
                selectedMovie={selectedMovie}
                onMovieSelect={onMovieSelect}
              />
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
