import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { getMovies, getTopMovies, getUpcomingMovies } from "./../api";
import { IGetMoviesResult } from "./../api";
import { makeImagePath } from "./../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useNavigate, useMatch } from "react-router-dom";
import Slider from "../Components/Slider";
import Loader from "../Components/Loader";

const Wrapper = styled.div`
  background-color: black;
  height: 200vh;
`;

const Banner = styled.div<{ bgImg: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgImg});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 30px;
`;
const Overview = styled.p`
  width: 50%;
  font-size: 22px;
  line-height: 2rem;
`;
const SliderWrapper = styled.div`
  margin-bottom: 200px;
`;
const SliderName = styled.h2`
  padding: 15px 10px;
  font-size: 22px;
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;

const MovieCard = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 40vw;
  height: 80vh;
  border-radius: 15px;
  overflow: hidden;
  background-color: black;
`;
const MovieCardCover = styled.div`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center center;
`;
const MovieCardTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 30px;
  position: relative;
  top: -60px;
  padding: 20px;
`;
const MovieCardOverview = styled.p`
  position: relative;
  top: -50px;
  padding: 20px;
  font-size: 16px;
  line-height: 1.2rem;
`;

const Home = () => {
  const { isLoading, data } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { isLoading: topLoading, data: topData } = useQuery<IGetMoviesResult>(
    ["movies", "topRated"],
    getTopMovies
  );
  const { isLoading: upcomingLoading, data: upcomingData } =
    useQuery<IGetMoviesResult>(["movies", "upcoming"], getUpcomingMovies);

  const movieIdMatch = useMatch("/movies/:movieId");
  const navigate = useNavigate();
  const onOverlayClick = () => navigate(-1);
  
  const clickedMovie =
    movieIdMatch?.params.movieId &&
    (data?.results.find(
      (movie) => movie.id + "" === movieIdMatch.params.movieId
    ) ||
      topData?.results.find(
        (movie) => movie.id + "" === movieIdMatch.params.movieId
      ) ||
      upcomingData?.results.find(
        (movie) => movie.id + "" === movieIdMatch.params.movieId
      ));

  const { scrollY } = useScroll();

  return (
    <Wrapper>
      {isLoading || topLoading || upcomingLoading ? (
        <Loader />
      ) : (
        <>
          <Banner bgImg={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <div style={{ position: "relative", top: "-100px" }}>
            <SliderWrapper>
              <SliderName>NOW PLAYING</SliderName>
              <Slider data={data} />
            </SliderWrapper>

            <SliderWrapper>
              <SliderName>TOP RATED</SliderName>
              <Slider data={topData} />
            </SliderWrapper>

            <SliderWrapper>
              <SliderName>UPCOMING</SliderName>
              <Slider data={upcomingData} />
            </SliderWrapper>
          </div>

          <AnimatePresence>
            {movieIdMatch && (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <MovieCard
                  layoutId={movieIdMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <MovieCardCover
                        style={{
                          backgroundImage: `linear-gradient(transparent, black), url(
                            ${makeImagePath(clickedMovie.backdrop_path, "w500")}
                          )`,
                        }}
                      />
                      <MovieCardTitle>{clickedMovie.title}</MovieCardTitle>
                      <MovieCardOverview>
                        {clickedMovie.overview}
                      </MovieCardOverview>
                    </>
                  )}
                </MovieCard>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
