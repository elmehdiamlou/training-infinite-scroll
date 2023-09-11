import { Button, Col, Form, Input, Row } from 'antd';
import Loading from '../../loading/loading';
import { IContent, IMessagesResponse } from '../../../utils/interfaces';
import { httpPromise } from '../../../utils/http';
import { dateOptions } from '../../../utils/constants';
import { SendOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

export interface ConversationMessagesProps {
  conversationId: string;
  setConversationId: React.Dispatch<React.SetStateAction<string>>;
}

export function ConversationMessages({
  conversationId,
  setConversationId,
}: ConversationMessagesProps) {
  const [pageNo, setPageNo] = useState(0);

  const [messages, setMessages] = useState<IMessagesResponse>();
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const messagesRef = useRef<HTMLDivElement>(null);
  const bottomMessagesRef = useRef<HTMLElement>(null);
  const scrollBehavior = useRef<ScrollBehavior>('instant');
  const reachTheEndRef = useRef<HTMLElement>(null);

  const [conversationForm] = Form.useForm<never>();

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('pageNo', pageNo.toString());
    const url = `/messages?${params.toString()}`;

    httpPromise(url, 'POST', { conversationId })
      .then((data: IMessagesResponse) => {
        if (pageNo === 0) {
          setMessages({
            ...data,
            content: data.content,
          });
          scrollBehavior.current = 'auto';
        } else if (messages?.content && typeof messages?.pageNo === 'number') {
          const { content, ...newMessages } = data;
          setMessages({
            ...newMessages,
            content: messages.content.reverse().concat(content).reverse(),
          });
          setLoadingMore(false);
        }
      })
      .catch(() => {
        setMessages({ content: [], totalElements: 0 });
        setConversationId('');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (messages && scrollBehavior.current) {
      bottomMessagesRef.current?.scrollIntoView({
        behavior: scrollBehavior.current,
      });
      scrollBehavior.current = 'instant';
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          messages?.content &&
          messages?.content?.length !== messages?.totalElements &&
          messages?.content?.length < messages?.totalElements &&
          entries[0].isIntersecting &&
          messages?.content.at(-1)?.responsemessage[0]?.text &&
          messages?.content.at(-1)?.responsemessage[0]?.text !== '...'
        ) {
          if (reachTheEndRef.current)
            observer.unobserve(reachTheEndRef.current);
          setLoadingMore(true);
          if (messagesRef.current)
            setScrollPosition(
              messagesRef.current.scrollHeight -
                messagesRef.current.scrollTop +
                15
            );
          setPageNo(pageNo + 1);
        }
      },
      { threshold: 1 }
    );

    if (reachTheEndRef.current) observer.observe(reachTheEndRef.current);

    return () => {
      if (reachTheEndRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(reachTheEndRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (!isLoadingMore && scrollPosition) {
      if (messagesRef.current)
        messagesRef.current.scrollTop =
          messagesRef.current.scrollHeight - scrollPosition;
      setScrollPosition(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingMore]);

  const onSendMessage = ({ message }: never) => {
    if (messages?.content) {
      const previousMessage = messages.content.at(-1);
      if (
        previousMessage &&
        ['', '...'].includes(previousMessage.responsemessage[0]?.text ?? '.')
      )
        return;

      const updatedMessages = (
        content: IContent[],
        text = '',
        responseContent?: IContent
      ) => {
        const newMessage = {
          requestmessage: message,
          responsemessage: responseContent?.responsemessage?.map((res) => ({
            ...res,
            text: res.text,
          })) || [{ text }],
          date: responseContent?.date || '',
        };
        return {
          ...messages,
          content:
            pageNo === 0
              ? [newMessage, ...(text ? content : content.reverse())]
              : [...content, newMessage],
        };
      };

      scrollBehavior.current = 'smooth';
      setMessages(updatedMessages(messages.content));

      setTimeout(() => {
        if (messages?.content) {
          scrollBehavior.current = 'smooth';
          setMessages(updatedMessages(messages.content, '...'));

          httpPromise(`/messages/${conversationId}`, 'POST', {
            message,
          })
            .then((data: IContent) => {
              if (messages?.content && message) {
                if (
                  messages.content.length > 9 &&
                  messages?.content?.length < messages?.totalElements
                )
                  pageNo === 0
                    ? messages.content.pop()
                    : messages.content.shift();

                scrollBehavior.current = 'smooth';
                setMessages(updatedMessages(messages.content, '.', data));
              }
            })
            .catch(() => {
              if (messages?.content) setMessages(messages);
            });
        }
      }, 1000);
    }
    conversationForm.setFieldValue('message', '');
  };

  return (
    <>
      <Button
        className="btn-back"
        type="primary"
        danger
        onClick={() => setConversationId('')}
      >
        Back
      </Button>
      <div className="conversation-messages" ref={messagesRef}>
        {messages === undefined && <Loading />}
        <span ref={reachTheEndRef} />
        {messages !== undefined && isLoadingMore && (
          <div className="conversation-show-more-loading">
            <Loading />
          </div>
        )}
        {(isLoadingMore || pageNo !== 0
          ? messages?.content
          : messages?.content.reverse()
        )?.map((message, index) => {
          const requestmessage = message.requestmessage;
          const { id = 'msg-pending' } = message;
          return (
            <span key={id}>
              {messages?.content?.at(index - 1) && (
                <p className="conversation-message user-message">
                  {requestmessage}
                  <span>
                    {message.date &&
                      new Date(message.date).toLocaleString(
                        'en-US',
                        dateOptions
                      )}
                  </span>
                </p>
              )}
              {message.responsemessage.map((response) => {
                if (response.text !== '')
                  return [
                    {
                      ...(response.text !== '...' ? (
                        <pre key={id + '-resp'}>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: response.text,
                            }}
                            className="conversation-message"
                          ></p>
                        </pre>
                      ) : (
                        <div
                          key={id + '-loading'}
                          className="conversation-message loading"
                        >
                          <Loading />
                        </div>
                      )),
                    },
                  ];
              })}
            </span>
          );
        })}
        <span ref={bottomMessagesRef} />
      </div>
      <Form form={conversationForm} onFinish={onSendMessage}>
        <Row justify="space-between" gutter={40}>
          <Col flex={1}>
            <Form.Item
              name="message"
              rules={[
                {
                  whitespace: true,
                  message: 'Message cannot be empty',
                },
                {
                  required: true,
                  message: 'Message is required',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Button
            type="primary"
            icon={<SendOutlined />}
            size="large"
            htmlType="submit"
          >
            Send
          </Button>
        </Row>
      </Form>
    </>
  );
}

export default ConversationMessages;
