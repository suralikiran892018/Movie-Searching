//MovieDetailsComponent
import React, { useState, useEffect } from "react";
import Axios from "axios";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

import { API_KEY } from "../App";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px 30px;
  justify-content: center;
  border-bottom: 1px solid lightgray;
`;

const CoverImage = styled.img`
  object-fit: cover;
  height: 350px;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`;

const MovieName = styled.span`
  font-size: 22px;
  font-weight: 600;
  color: black;
  margin: 15px 0;
  white-space: nowrap;
  overflow: hidden;
  text-transform: capitalize;
  text-overflow: ellipsis;

  & span {
    opacity: 0.8;
  }
`;

const MovieInfo = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: black;
  overflow: hidden;
  margin: 4px 0;
  text-transform: capitalize;
  text-overflow: ellipsis;

  & span {
    opacity: 0.5;
  }
`;

const Close = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: black;
  background: lightgray;
  height: fit-content;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.8;
`;

const BackButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const BackButton = styled(Link)`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #555;
    color: #fbbc04;
  }
`;

const MovieDetailsComponent = (props) => {
  const { selectedMovie } = props;
  const [movieDetails, setMovieDetails] = useState(null);
  const [movieCredits, setMovieCredits] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await Axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  };

  const fetchMovieCredits = async (movieId) => {
    try {
      const response = await Axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching movie credits:", error);
      return null;
    }
  };

  useEffect(() => {
    if (selectedMovie) {
      Promise.all([
        fetchMovieDetails(selectedMovie.id),
        fetchMovieCredits(selectedMovie.id),
      ]).then(([details, credits]) => {
        setMovieDetails(details);
        setMovieCredits(credits);
      });
    }
  }, [selectedMovie]);

  return (
    <>
      <Container>
        {selectedMovie && movieDetails && movieCredits ? (
          <>
            <CoverImage
              src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
              alt={selectedMovie.title}
            />
            <InfoColumn>
              <MovieName>
                Movie Name: <span>{selectedMovie.title}</span>
              </MovieName>
              <MovieInfo>
                Release Date: <span>{selectedMovie.release_date}</span>
              </MovieInfo>
              <MovieInfo>
                Rating: <span>{selectedMovie.vote_average}</span>
              </MovieInfo>
              <MovieInfo>
                Year of Release:{" "}
                <span>{selectedMovie.release_date.slice(0, 4)}</span>
              </MovieInfo>
              <MovieInfo>
                Length: <span>{movieDetails.runtime} min</span>
              </MovieInfo>
              <MovieInfo>
                Director:{" "}
                <span>
                  {movieCredits.crew.find(
                    (member) => member.job === "Director"
                  )?.name || "N/A"}
                </span>
              </MovieInfo>
              <MovieInfo>
                Cast:{" "}
                <span>
                  {movieCredits.cast
                    .slice(0, 5)
                    .map((actor) => actor.name)
                    .join(", ")}
                </span>
              </MovieInfo>
              <MovieInfo>
                Description: <span>{selectedMovie.overview}</span>
              </MovieInfo>
            </InfoColumn>
            <Close>
              <Link to="/">X</Link>
            </Close>
          </>
        ) : (
          "Loading..."
        )}
      </Container>
      <BackButtonContainer>
        <BackButton to="/" onClick={() => navigate(-1)}>
          Back
        </BackButton>
      </BackButtonContainer>
    </>
  );
};

export default MovieDetailsComponent;