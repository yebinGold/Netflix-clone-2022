import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail, IMovieDetail } from "./../api";
import { makeImagePath } from "./../utils";
import { motion, useScroll } from "framer-motion";
import Loader from "../Components/Loader";

interface IModalProps {
  movieId: string | undefined;
}

const genresToString = (genres: { id: number; name: string }[]) => {
  let str = "";
  genres.forEach((genre) => {
    str += genre.name + ", ";
    return str;
  });
  const result = str.slice(0, -2);
  return result;
};

const Modal = ({ movieId }: IModalProps) => {
  const { isLoading: detailLoading, data: detailData } = useQuery<IMovieDetail>(
    ["movies", "detail"],
    () => getMovieDetail(movieId)
  );
  console.log(detailData);

  const { scrollY } = useScroll();
  return (
    <MovieCard layoutId={movieId} style={{ top: scrollY.get() + 100 }}>
      {detailLoading || !detailData ? (
        <Loader />
      ) : (
        <>
          <MovieCardCover
            style={{
              backgroundImage: `linear-gradient(transparent, black), url(
            ${makeImagePath(detailData.backdrop_path, "w500")}
          )`,
            }}
          />
          <MovieCardTitle>{detailData.title}</MovieCardTitle>
          <MovieCardDetail>
            <div>
              <span>
                {detailData.release_date.slice(0, 4)} | ⭐
                {detailData.vote_average.toFixed(1)}
              </span>
              <span>{detailData.runtime}분</span>
            </div>
            <div>장르: {genresToString(detailData.genres)}</div>
          </MovieCardDetail>
          <MovieCardOverview>{detailData.overview}</MovieCardOverview>
        </>
      )}
    </MovieCard>
  );
};

export default Modal;

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
  padding-bottom: 30px;
`;
const MovieCardDetail = styled.div`
  position: relative;
  top: -50px;
  padding: 0 20px;
  color: ${(props) => props.theme.white.darker};
  div:first-child{
    display: flex;
    justify-content: space-between;
  }
  div:last-child{
    text-align: end;
    margin-top: 5px;
  }
`;
const MovieCardOverview = styled.p`
  position: relative;
  top: -50px;
  padding: 20px;
  font-size: 16px;
  line-height: 1.2rem;
`;
