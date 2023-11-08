//MovieComponents
import React from "react";
import styled from "styled-components";

const MovieContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 280px;
  box-shadow: 0 3px 10px 0 #aaa;
  cursor: pointer;
  background-color:#cf3721;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #f7f7f7;
    transform: translateY(-5px);
  }
`;

const CoverImage = styled.img`
  object-fit: cover;
  height: 362px;
`;


const MovieName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: black;
  margin: 15px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const Overview = styled.p`
  font-size: 14px;
  color: #fbbc04;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  
  

  
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const MovieInfo = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: black;
  white-space: nowrap;
  overflow: hidden;
  text-transform: capitalize;
  text-overflow: ellipsis;
`;

const MovieComponent = (props) => {
  const { title, poster_path, overview, vote_average } = props.movie;

  return (
    <MovieContainer
      onClick={() => {
        props.onMovieSelect(props.movie);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <CoverImage src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={title} />
      <MovieName>{title}</MovieName>
      <MovieInfo>Rating: {vote_average}</MovieInfo>
      <InfoColumn>
        <Overview>{overview}</Overview>
      </InfoColumn>
    </MovieContainer>
  );
};

export default MovieComponent;