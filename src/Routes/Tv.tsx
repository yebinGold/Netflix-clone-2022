import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import {
  getShows,
  getTodayShows,
  getPopularShows,
  getTopShows,
} from "./../api";
import { IGetShowsResult } from "./../api";
import { makeImagePath } from "./../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useMatch } from "react-router-dom";
import Slider from "../Components/tv/TvSlider";
import Loader from "../Components/Loader";
import TvModal from "../Components/tv/TvModal";

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

const Tv = () => {
  const { isLoading, data } = useQuery<IGetShowsResult>(
    ["tv", "onAir"],
    getShows
  );
  const { isLoading: todayLoading, data: todayData } =
    useQuery<IGetShowsResult>(["tv", "today"], getTodayShows);
  const { isLoading: popularLoading, data: popularData } =
    useQuery<IGetShowsResult>(["tv", "popular"], getPopularShows);
  const { isLoading: topLoading, data: topData } = useQuery<IGetShowsResult>(
    ["tv", "topRated"],
    getTopShows
  );

  const showIdMatch = useMatch("/tv/:showId");
  const navigate = useNavigate();
  const onOverlayClick = () => navigate(-1);

  return (
    <Wrapper>
      {isLoading || todayLoading || popularLoading || topLoading ? (
        <Loader />
      ) : (
        <>
          <Banner bgImg={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <div style={{ position: "relative", top: "-100px" }}>
            <SliderWrapper>
              <SliderName>ON AIR</SliderName>
              <Slider data={data} />
            </SliderWrapper>
            <SliderWrapper>
              <SliderName>AIRING TODAY</SliderName>
              <Slider data={todayData} />
            </SliderWrapper>
            <SliderWrapper>
              <SliderName>POPULAR</SliderName>
              <Slider data={popularData} />
            </SliderWrapper>
            <SliderWrapper>
              <SliderName>TOP RATED</SliderName>
              <Slider data={topData} />
            </SliderWrapper>
          </div>

          <AnimatePresence>
            {showIdMatch && (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <TvModal showId={showIdMatch.params.showId} />
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Tv;
