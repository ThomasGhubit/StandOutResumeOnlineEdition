import React, { Component } from 'react';
import { Layout, Menu, Modal, Button, Input, message } from 'antd';
import { Link, Switch, Route } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Basic from './content/basic';
import Summary from './content/summary';
import Education from './content/education';
import Employment from './content/employment';
import Skill from './content/skill';
import Project from './content/project';
import Award from './content/award';
import Activity from './content/activity';
import Volunteering from './content/volunteering';
import InfoSelect from './content/infoSelect';

const { Sider, Content, Footer } = Layout;

const add_info = gql`
  mutation($name: String) {
    infos {
      addInfo(name: $name)
    }
  }
`;

const query_info = gql`
  {
    infos {
      infos {
        id
        name
      }
    }
  }
`;

// information input
const info_parts = [
  { key: 'basic', url: '/content/basic', name: 'Basic Information' },
  { key: 'summary', url: '/content/summary', name: 'Summary' },
  { key: 'education', url: '/content/education', name: 'Education' },
  { key: 'employment', url: '/content/employment', name: 'Employment' },
  { key: 'skill', url: '/content/skill', name: 'Skill' },
  { key: 'project', url: '/content/project', name: 'Project' },
  { key: 'award', url: '/content/award', name: 'Award' },
  { key: 'activity', url: '/content/activity', name: 'Activity' },
  { key: 'volunteering', url: '/content/volunteering', name: 'Volunteering' },
];

export default class ResumeContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      infoName: "",
      infoId: "",
    }
  }

  onChangeInfo = ({ key }) => {
    let [id, name] = key.split(",");
    this.setState({
      infoName: name,
      infoId: id
    });
  }

  render() {
    return (
      <Query
        query={query_info}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          // sidebar
          let current_page = this.props.location.pathname.split('/').pop();
          current_page = 
            info_parts.filter(({key}) => key == current_page).length > 0
            ? current_page
            : "basic";        

          // render sidebar
          let info_part_com = info_parts.map(({key, url, name}) => (
            <Menu.Item key={key}>
              <Link to={url}>{name}</Link>
            </Menu.Item>
          ));

          // remind user to create a first resuem
          if (data.infos.infos.length === 0) {
            return (
              <Mutation
                mutation={add_info}
                refetchQueries={[
                  { query: query_info }
                ]}
                onCompleted = {(data) => {
                  if (data.infos.addInfo == "success") {
                    message.success("Success");
                  } else if (data.infos.addInfo == "error") {
                    message.error("Something Wrong");
                  }
                }}
              >
                {(addInfo, { data }) => {
                  let input = "";
                  const handleOk = (e) => {
                    e.preventDefault();
                    addInfo({ variables: { name: input }})
                  };
                  const onChange = (e) => {
                    input = e.target.value;
                  }

                  return (
                    <Modal
                      title="Give your first info a name"
                      visible={ true }
                      closable={ false }
                      footer={[
                        <Button key="submit" type="primary" onClick={handleOk} >Submit</Button>
                      ]}
                    >
                      <Input onChange={onChange} />
                    </Modal>
                  );
                }}
              </Mutation>
            );
          }

          // default to more recent updates
          let infoName = this.state.infoName ? this.state.infoName : data.infos.infos[0].name;
          let infoId = this.state.infoId ? this.state.infoId : data.infos.infos[0].id;

          return (
            <Layout>
              <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                  mode="inline"
                  selectedKeys={[current_page]}
                  style={{ minHeight: 'calc(100vh - 64px)' }}
                >
                  <InfoSelect style={{ margin: "10px 24px" }} 
                    infoName={infoName} infos={data.infos.infos} onChangeInfo={this.onChangeInfo} />
                  { info_part_com }
                </Menu>
              </Sider>
              <Layout>
                <Content>
                  <Switch>
                    <Route exact path="/" component={() => <Basic id={infoId} />} />
                    <Route exact path="/content" component={() => <Basic id={infoId} />} />
                    <Route exact path="/content/basic" component={() => <Basic id={infoId} />} />
                    <Route exact path="/content/summary" component={() => <Summary id={infoId} />} />
                    <Route exact path="/content/education" component={() => <Education id={infoId} />} />
                    <Route exact path="/content/employment" component={() => <Employment id={infoId} />} />
                    <Route exact path="/content/skill" component={() => <Skill id={infoId} />} />
                    <Route exact path="/content/project" component={() => <Project id={infoId} />} />
                    <Route exact path="/content/award" component={() => <Award id={infoId} />} />
                    <Route exact path="/content/activity" component={() => <Activity id={infoId} />} />
                    <Route exact path="/content/volunteering" component={() => <Volunteering id={infoId} />} />
                  </Switch>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                  ©2019 Stand Out
                </Footer>
              </Layout>
            </Layout>
          );
        }}
      </Query>
    );
  }
}