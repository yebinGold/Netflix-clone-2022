import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getSearchMovies,
  ISearchMovieResult,
  getSearchShows,
  ISearchShowResult,
} from "./../api";
import Loader from "../Components/Loader";
import MovieSlider from "../Components/home/MovieSlider";
import TvSlider from "../Components/tv/TvSlider";

const Search = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("keyword");

  const { isLoading: movieSearchLoading, data: movieSearchData } =
    useQuery<ISearchMovieResult>(["search", "movies", "1"], () =>
      getSearchMovies(search ? search : "")
    );

  const { isLoading: movieSearchLoading2, data: movieSearchData2 } =
    useQuery<ISearchMovieResult>(["search", "movies", "2"], () =>
      getSearchMovies(search ? search : "", 2)
    );

  const { isLoading: tvSearchLoading, data: tvSearchData } =
    useQuery<ISearchShowResult>(["search", "tv", "1"], () =>
      getSearchShows(search ? search : "")
    );

  const { isLoading: tvSearchLoading2, data: tvSearchData2 } =
    useQuery<ISearchShowResult>(["search", "tv", "2"], () =>
      getSearchShows(search ? search : "", 2)
    );

  return (
    <Wrapper>
      <>
        {movieSearchLoading || movieSearchLoading2 ? (
          <Loader />
        ) : (
          <MovieSliderWrapper>
            <SliderWrapper>
              <SliderName>Search for MOVIES</SliderName>
              <MovieSlider data={movieSearchData} />
            </SliderWrapper>
            {movieSearchData2?.results !== [] && (
              <SliderWrapper>
                <MovieSlider data={movieSearchData2} />
              </SliderWrapper>
            )}
          </MovieSliderWrapper>
        )}
        {tvSearchLoading || tvSearchLoading2 ? (
          <Loader />
        ) : (
          <TvSliderWrapper>
            <SliderWrapper>
              <SliderName>Search for TV SHOWS</SliderName>
              <TvSlider data={tvSearchData} />
            </SliderWrapper>
            {tvSearchData2?.results !== [] && (
              <SliderWrapper>
                <TvSlider data={tvSearchData2} />
              </SliderWrapper>
            )}
          </TvSliderWrapper>
        )}
      </>
    </Wrapper>
  );
};

export default Search;

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  min-height: 120vh;
  margin-top: 8%;
`;
const MovieSliderWrapper = styled.div`
  margin-bottom: 400px;
`;
const TvSliderWrapper = styled.div`
`;
const SliderWrapper = styled.div`
  margin-bottom: 200px;
`;
const SliderName = styled.h2`
  padding: 15px 10px;
  font-size: 22px;
`;
