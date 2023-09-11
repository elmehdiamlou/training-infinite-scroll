import styled from 'styled-components';
import { NotificationOutlined, WechatOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import Conversation from './conversation/conversation';
import Notifications from './notifications/notifications';

const StyledApp = styled.div`
  margin: 32px 50px;
`;

export function App() {
  const items = [
    {
      label: (
        <span>
          <WechatOutlined style={{ fontSize: '20px' }} />
          Conversations
        </span>
      ),
      key: 'conversation',
      children: <Conversation />,
    },
    {
      label: (
        <span>
          <NotificationOutlined style={{ fontSize: '20px' }} />
          Notifications
        </span>
      ),
      key: 'notifications',
      children: <Notifications />,
    },
  ];
  return (
    <StyledApp>
      <Tabs
        size="large"
        defaultActiveKey="conversations"
        items={items}
        destroyInactiveTabPane
      />
    </StyledApp>
  );
}

export default App;
