import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { getShowDetail, IShowDetail } from "../../api";
import { makeImagePath } from "../../utils";
import { motion, useScroll } from "framer-motion";
import Loader from "../Loader";

interface IModalProps {
  showId: string | undefined;
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
const createsToString = (creates: { name: string }[]) => {
  let str = "";
  creates.forEach((create) => {
    str += create.name + ", ";
    return str;
  });
  const result = str.slice(0, -2);
  return result;
};

const Modal = ({ showId }: IModalProps) => {
  const { isLoading: detailLoading, data: detailData } = useQuery<IShowDetail>(
    ["tv", "detail"],
    () => getShowDetail(showId)
  );

  const { scrollY } = useScroll();
  return (
    <ShowCard layoutId={showId} style={{ top: scrollY.get() + 100 }}>
      {detailLoading || !detailData ? (
        <Loader />
      ) : (
        <>
          <ShowCardCover
            style={{
              backgroundImage: `linear-gradient(transparent, black), url(
            ${makeImagePath(detailData.backdrop_path, "w500")}
          )`,
            }}
          />
          <ShowCardTitle>{detailData.name}</ShowCardTitle>
          <ShowCardDetail>
            <div>
              <span>{detailData.last_air_date.slice(0, 4)}</span>
              {detailData.created_by[0] && (
                <span style={{ maxWidth: "60%" }}>
                  제작: {createsToString(detailData.created_by)}
                </span>
              )}
            </div>
            <div>
              <span>
                시즌 {detailData.number_of_seasons}개 | 에피소드{" "}
                {detailData.number_of_episodes}개
              </span>
              <span style={{ maxWidth: "60%" }}>
                장르: {genresToString(detailData.genres)}
              </span>
            </div>
          </ShowCardDetail>
          <ShowCardOverview>{detailData.overview}</ShowCardOverview>
        </>
      )}
    </ShowCard>
  );
};

export default Modal;

const ShowCard = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 40vw;
  min-height: 60vh;
  border-radius: 15px;
  overflow: hidden;
  background-color: black;
`;
const ShowCardCover = styled.div`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center center;
`;
const ShowCardTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 30px;
  position: relative;
  top: -60px;
  padding: 20px;
  padding-bottom: 30px;
`;
const ShowCardDetail = styled.div`
  position: relative;
  top: -50px;
  padding: 0 20px;
  color: ${(props) => props.theme.white.darker};
  div:first-child {
    display: flex;
    justify-content: space-between;
  }
  div:last-child {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
  }
`;
const ShowCardOverview = styled.p`
  position: relative;
  top: -45px;
  padding: 20px;
  font-size: 16px;
  line-height: 1.2rem;
`;
