import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import {
  getMovies,
  getTopMovies,
  getUpcomingMovies,
} from "./../api";
import { IGetMoviesResult } from "./../api";
import { makeImagePath } from "./../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useMatch } from "react-router-dom";
import Slider from "../Components/home/MovieSlider";
import Loader from "../Components/Loader";
import Modal from "../Components/home/MovieModal";

const Wrapper = styled.div`
  background-color: black;
  min-height: 200vh;
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
                <Modal movieId={movieIdMatch.params.movieId} />
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
