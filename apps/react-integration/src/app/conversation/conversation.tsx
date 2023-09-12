import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { httpPromise } from '../../utils/http';
import { IData } from '../../utils/interfaces';
import { dateOptions } from '../../utils/constants';
import Loading from '../loading/loading';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import {
  PlusOutlined,
  EnterOutlined,
  DeleteOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import FormItem from 'antd/es/form/FormItem';
import Meta from 'antd/es/card/Meta';
import ConversationMessages from './conversation-messages/conversation-messages';

const StyledConversation = styled.div`
  .conversation-input {
    position: relative;
    height: 70px;
    background: #edf1f8;
    padding: 10px 20px;
    align-self: end;
    margin-bottom: 0;
    font-size: 14px;
  }

  .conversation-input > button {
    position: absolute;
    right: 35px;
    top: 15.5px;
    background: transparent;
    border: none;
    outline: none;
    border-radius: 25px;
    width: 30px;
    padding: 0;
    cursor: pointer;
  }

  .conversation-input > button:hover {
    opacity: 0.7;
  }

  .conversation-input > input {
    width: 100%;
    height: 85%;
    font-size: 13px;
    border-radius: 20px;
    border: none;
    outline: none;
    padding-inline: 15px 55px;
    box-shadow: 0px 10px 10px -10px #b9b5a966;
  }

  .conversation-input > input::placeholder {
    color: #cecece;
    opacity: 1;
  }

  .conversation-messages {
    overflow: auto;
    padding: 20px 25px 0;
    min-height: calc(100vh - 240px);
    max-height: calc(100vh - 240px);
    margin-bottom: 15px;
  }

  .conversation-messages::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .conversation-messages::-webkit-scrollbar-thumb {
    background: #1677ff;
    border-radius: 0;
  }

  .conversation-messages > span > pre {
    text-wrap: wrap;
    white-space: break-spaces;
    font-family: 'Montserrat', sans-serif;
  }

  .conversation-messages > span > pre a {
    color: #1677ff;
  }

  .conversation-messages > span > pre a:hover {
    opacity: 0.7;
  }

  .conversation-message {
    padding: 15px 25px;
    border-top-right-radius: 24px;
    border-top-left-radius: 24px;
    font-size: 13px;
    overflow-wrap: anywhere;
    margin-bottom: 10px !important;

    span {
      display: table;
      margin-left: auto;
    }
  }

  .conversation-message.loading {
    display: flex;
    height: 14px;
    width: 33px;
    padding: 18px 45px 18px 40px;
    margin-bottom: 13px;
  }

  .conversation-message:not(.user-message) {
    border-bottom-right-radius: 24px;
    border: 1px solid #1677ff;
  }

  .conversation-message.user-message {
    margin-block: 13px;
    border-bottom-left-radius: 24px;
    color: #455977;
    background-color: #edf1f8;
  }

  .conversation-show-more-loading {
    display: flex;
    height: 17px;
  }

  .ant-row {
    margin: 0 !important;
  }

  .btn-back {
    position: absolute;
    right: 0;
    top: -60px;
  }
`;

export function Conversation() {
  const [isStarted, setStarted] = useState<boolean | undefined>(undefined);
  const [conversationId, setConversationId] = useState('');
  const [conversations, setConversations] = useState<IData[]>([]);

  const [newConversationForm] = Form.useForm<never>();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    httpPromise('/conversations', 'GET')
      .then((data: IData[]) => {
        setConversations(data);
        setStarted(false);
      })
      .catch(() => {
        setStarted(false);
      });
  };

  const createNewConversation = (value: never) => {
    httpPromise('/conversations', 'POST', value).then(() => {
      newConversationForm.resetFields();
      loadConversations();
    });
  };

  const selectConversation = (id: string) => {
    setConversationId(id);
  };

  const deleteConversation = (id: string) => {
    httpPromise(`/conversations/${id}`, 'DELETE').then(() => {
      loadConversations();
    });
  };

  return (
    <StyledConversation>
      {isStarted === undefined && !conversationId ? (
        <Loading />
      ) : conversationId ? (
        <ConversationMessages
          conversationId={conversationId}
          setConversationId={setConversationId}
        />
      ) : (
        <>
          <Form form={newConversationForm} onFinish={createNewConversation}>
            <Row justify="space-between" gutter={40}>
              <Col flex={1}>
                <FormItem
                  name="conversationname"
                  rules={[
                    {
                      whitespace: true,
                      message: 'Conversation name cannot be empty',
                    },
                    {
                      required: true,
                      message: 'Conversation name is required',
                    },
                  ]}
                >
                  <Input size="large" />
                </FormItem>
              </Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                htmlType="submit"
              >
                Create new conversation
              </Button>
            </Row>
          </Form>
          <Row>
            {conversations.map(({ id, conversationname, date }) => (
              <Card
                key={id}
                style={{ width: 300, marginInline: 16, marginBottom: 16 }}
                actions={[
                  <EnterOutlined
                    style={{ fontSize: '25px', color: '#0b8235' }}
                    onClick={() => selectConversation(id)}
                  />,
                  <DeleteOutlined
                    style={{ fontSize: '25px', color: '#f81d22' }}
                    onClick={() => deleteConversation(id)}
                  />,
                ]}
              >
                <Meta
                  avatar={<MessageOutlined style={{ fontSize: '40px' }} />}
                  title={conversationname}
                  description={new Date(date).toLocaleString(
                    'en-US',
                    dateOptions
                  )}
                />
              </Card>
            ))}
          </Row>
        </>
      )}
    </StyledConversation>
  );
}

export default Conversation;
