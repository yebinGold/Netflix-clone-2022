import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../../utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IGetMoviesResult } from "../../api";

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

interface ISliderProps {
  data?: IGetMoviesResult;
}

const Slider = ({ data }: ISliderProps) => {
  const navigate = useNavigate();
  const onBoxClicked = (movidId: number) => {
    navigate(`/movies/${movidId}`);
  };

  const [index, setIndex] = useState(0);
  const [isBack, setIsBack] = useState(false);
  const increaseIdx = () => {
    setIsBack(false);
    if (data) {
      if (leaving) {
        toggleLeaving();
        return;
      }
      toggleLeaving();
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1; // 최대 페이지
      setIndex((prev) => (prev === maxIndex ? prev : prev + 1));
      toggleLeaving();
    }
  };
  const decreaseIdx = () => {
    setIsBack(true);
    if (leaving) {
      toggleLeaving();
      return;
    }
    toggleLeaving();
    setIndex((prev) => (prev === 0 ? prev : prev - 1));
    toggleLeaving();
  };

  // 동시에 여러 번 슬라이드 했을 때 exit 애니메이션이 겹치는 에러 디버깅
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  return (
    <Wrapper>
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
    </Wrapper>
  );
};

export default Slider;

const Wrapper = styled.div``;

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
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 16px;
  }
`;
