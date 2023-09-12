import styled from 'styled-components';

/* eslint-disable-next-line */
export interface NotificationsProps {}

const StyledNotifications = styled.div`
  color: pink;
`;

export function Notifications(props: NotificationsProps) {
  return (
    <StyledNotifications>
      <h1>Welcome to Notifications!</h1>
    </StyledNotifications>
  );
}

export default Notifications;
