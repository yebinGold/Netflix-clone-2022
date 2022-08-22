import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "./../api";
import { IGetMoviesResult } from "./../api";
import { makeImagePath } from "./../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Wrapper = styled.div`
  background-color: black;
  height: 200vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
  font-size: 24px;
`;
const Slider = styled.div`
  position: relative;
  top: -80px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;
const MovieBox = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  border: 1px solid black;
  height: 150px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const SliderName = styled.h2`
  padding: 15px 10px;
  font-size: 22px;
`;
const SliderBtn = styled(motion.div)`
  position: absolute;
  width: 50px;
  height: 100%;
  background-color: transparent;
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const BackBtn = styled(SliderBtn)`
  left: 0;
`;
const FrontBtn = styled(SliderBtn)`
  right: 0;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 16px;
  }
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
  font-size: 28px;
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

const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth - 14 : window.outerWidth + 14,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth + 14 : -window.outerWidth - 14,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    y: -30,
    transition: { delay: 0.5 },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5 },
  },
};

const offset = 6; // 한번에 보여줄 영화 개수

const Home = () => {
  const { isLoading, data } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const movieIdMatch = useMatch("/movies/:movieId");
  const navigate = useNavigate();
  const onBoxClicked = (movidId: number) => {
    navigate(`/movies/${movidId}`);
  };
  const onOverlayClick = () => navigate(-1);
  const clickedMovie =
    movieIdMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === movieIdMatch.params.movieId
    );

  const { scrollY } = useScroll();

  const [index, setIndex] = useState(0);
  const [isBack, setIsBack] = useState(false);
  const increaseIdx = () => {
    setIsBack(false);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1; // 최대 페이지
      setIndex((prev) => (prev === maxIndex ? prev : prev + 1));
    }
  };
  const decreaseIdx = () => {
    setIsBack(true);
    if (leaving) return;
    toggleLeaving();
    setIndex((prev) => (prev === 0 ? prev : prev - 1));
  };

  // 동시에 여러 번 슬라이드 했을 때 exit 애니메이션이 겹치는 에러 디버깅
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Banner bgImg={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <SliderName>NOWPLAYING</SliderName>
            <AnimatePresence
              custom={isBack}
              initial={false}
              onExitComplete={toggleLeaving}
            >
              <Row
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.7 }}
              >
                <>
                  <BackBtn
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={decreaseIdx}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </BackBtn>
                  {data?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                      <MovieBox
                        layoutId={movie.id + ""}
                        key={movie.id}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        onClick={() => onBoxClicked(movie.id)}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </MovieBox>
                    ))}
                  <FrontBtn
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={increaseIdx}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </FrontBtn>
                </>
              </Row>
            </AnimatePresence>
          </Slider>
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
