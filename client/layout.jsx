import React from 'react';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const { Header, Content } = Layout;

const header_parts = [
  { key: 'content', url: '/content', name: "Content" },
  { key: 'resume', url: '/resume', name: "Resume" },
  { key: 'square', url: '/square', name: "Square"}
];

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

      let current_page = window.location.href.split('/').slice(-2);
      let in_map_page = header_parts.filter(({key}) => current_page.indexOf(key) != -1);
      current_page = 
        in_map_page.length > 0
        ? in_map_page[0].key
        : "content";

      let header_part_com = header_parts.map(({key, url, name}) => (
        <Menu.Item key={key}>
          <Link to={url}>{name}</Link>
        </Menu.Item>
      ));

      return (
        <Layout style={{ minHeight: "100vh" }}>
          <Header className="header">
            <div>
              <p className="logo">Stand Out</p>
              <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[current_page]}
                style={{ lineHeight: "64px" }}
              >
                { header_part_com }
              </Menu>
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