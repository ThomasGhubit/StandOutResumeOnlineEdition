import React from 'react';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const { Header, Content } = Layout;

export default p => (
  <Query
    query={gql`
      {
        users {
          user {
            username,
            email
          }
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      const dropMenu = (
        <Menu>
          <Menu.Item key="0">{data.users.user.email}</Menu.Item>
          <Menu.Divider />
          <Menu.Item key="1">
            <a href="/signout">Sign Out</a>
          </Menu.Item>
        </Menu>
      );

      return (
        <Layout style={{ minHeight: "100vh" }}>
          <Header className="header">
            <div>
              <p className="logo">Stand Out</p>
            </div>
            <Dropdown className="user-drop" overlay={dropMenu} trigger={['click', 'hover']}>
              <span>{data.users.user.username} <Icon type="down" /></span>
            </Dropdown>
          </Header>
          <Content>
            {p.children}
          </Content>
        </Layout>
      );
    }}
  </Query>
);