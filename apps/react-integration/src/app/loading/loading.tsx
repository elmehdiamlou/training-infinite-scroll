import styled from 'styled-components';

/* eslint-disable-next-line */
export interface LoadingProps {}

const StyledLoading = styled.div`
  display: inline-block;
  position: relative;
  width: 100%;
  text-align: center;

  > div {
    position: absolute;
    margin-left: calc(50% - 35px) !important;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background-color: #1677ff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  > div:nth-child(1) {
    left: 8px;
    animation: ellipsis1 0.6s infinite;
  }

  > div:nth-child(2) {
    left: 8px;
    animation: ellipsis2 0.6s infinite;
  }

  > div:nth-child(3) {
    left: 32px;
    animation: ellipsis2 0.6s infinite;
  }

  > div:nth-child(4) {
    left: 56px;
    animation: ellipsis3 0.6s infinite;
  }

  @keyframes ellipsis1 {
    0% {
      transform: scale(0);
    }

    100% {
      transform: scale(1);
    }
  }

  @keyframes ellipsis3 {
    0% {
      transform: scale(1);
    }

    100% {
      transform: scale(0);
    }
  }

  @keyframes ellipsis2 {
    0% {
      transform: translate(0, 0);
    }

    100% {
      transform: translate(24px, 0);
    }
  }
`;

export function Loading(props: LoadingProps) {
  return (
    <StyledLoading>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </StyledLoading>
  );
}

export default Loading;
