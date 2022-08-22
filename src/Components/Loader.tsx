import React from "react";
import styled from "styled-components";
import { BeatLoader } from "react-spinners";

const Wrapper = styled.div`
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loader = () => {
  return (
    <Wrapper>
      <BeatLoader color="#e2e2e2" />
    </Wrapper>
  );
};

export default Loader;
