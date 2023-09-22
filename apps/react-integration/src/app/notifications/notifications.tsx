import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { INotification, IPageable } from '../../utils/interfaces';
import { httpPromise } from '../../utils/http';
import { dateOptions } from '../../utils/constants';
import Loading from '../loading/loading';
import { Button, Col, Form, Input, Row } from 'antd';
import { PlusOutlined, RetweetOutlined } from '@ant-design/icons';

const StyledNotifications = styled.div`
  .notification-show-more-loading {
    display: flex;
    height: 17px;
  }

  .ant-row {
    margin: 0 !important;
  }

  .notification-container {
    overflow: auto;
    padding: 20px 25px 0;
    min-height: calc(100vh - 240px);
    max-height: calc(100vh - 240px);
    margin-bottom: 15px;
  }

  .notification-container::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .notification-container::-webkit-scrollbar-thumb {
    background: #1677ff;
    border-radius: 0;
  }

  .notification-content {
    padding: 20px;
    margin-block: 13px;
    border-radius: 24px;
    color: #455977;
    background-color: #edf1f8;

    span {
      display: table;
      margin-left: auto;
    }
  }
`;

export function Notifications() {
  const [pageNo, setPageNo] = useState({ value: 0 });

  const [notifications, setNotifications] =
    useState<IPageable<INotification>>();
  const [isLoadingMore, setLoadingMore] = useState(false);

  const [beforeDate, setBeforeDate] = useState(new Date());

  const notificationsRef = useRef<HTMLDivElement>(null);
  const scrollBehavior = useRef<ScrollBehavior>('instant');
  const reachTheEndRef = useRef<HTMLElement>(null);

  const [notificationForm] = Form.useForm<never>();

  useEffect(() => {
    const params = new URLSearchParams();
    params.append('pageNo', pageNo.value.toString());
    const url = `/notifications/all?${params.toString()}`;

    httpPromise(url, 'POST', { date: beforeDate })
      .then((data: IPageable<INotification>) => {
        if (pageNo.value === 0) {
          setNotifications(() => ({
            ...data,
            content: data.content,
          }));
          scrollBehavior.current = 'auto';
        } else if (
          notifications?.content &&
          typeof notifications?.pageNo === 'number'
        ) {
          const { content, ...newNotifications } = data;
          setNotifications({
            ...newNotifications,
            content: notifications.content.concat(content).reverse(),
          });
          setLoadingMore(false);
        }
      })
      .catch(() => {
        setNotifications({ content: [], totalElements: 0 });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          notifications?.content &&
          notifications?.content?.length < notifications?.totalElements &&
          entries[0].isIntersecting
        ) {
          if (reachTheEndRef.current)
            observer.unobserve(reachTheEndRef.current);
          setLoadingMore(true);
          setPageNo({ value: pageNo.value + 1 });
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
  }, [notifications]);

  const onAddNotification = (value: never) => {
    httpPromise('/notifications', 'POST', value).then(() => {
      notificationForm.resetFields();
    });
  };

  const handleRefreshNotifications = () => {
    setNotifications(undefined);
    setBeforeDate(new Date());
    setPageNo({ value: 0 });
  };

  return (
    <StyledNotifications>
      <Form form={notificationForm} onFinish={onAddNotification}>
        <Row justify="space-between" gutter={40}>
          <Col flex={1}>
            <Form.Item
              name="content"
              rules={[
                {
                  whitespace: true,
                  message: 'Content cannot be empty',
                },
                {
                  required: true,
                  message: 'Content is required',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            htmlType="submit"
          >
            Add
          </Button>
          <Button
            style={{ marginLeft: '20px' }}
            type="text"
            icon={<RetweetOutlined />}
            size="large"
            onClick={() => handleRefreshNotifications()}
          />
        </Row>
      </Form>
      <div className="notification-container" ref={notificationsRef}>
        {(isLoadingMore || pageNo.value === 0
          ? notifications?.content
          : notifications?.content.reverse()
        )?.map(({ id, content, date }, index) => {
          return (
            <span key={id}>
              {notifications?.content?.at(index - 1) && (
                <p className="notification-content">
                  {content}
                  <span>
                    {date &&
                      new Date(date).toLocaleString('en-US', dateOptions)}
                  </span>
                </p>
              )}
            </span>
          );
        })}
        {notifications === undefined && <Loading />}
        <span ref={reachTheEndRef} />
        {notifications !== undefined && isLoadingMore && (
          <div className="notification-show-more-loading">
            <Loading />
          </div>
        )}
      </div>
    </StyledNotifications>
  );
}

export default Notifications;
