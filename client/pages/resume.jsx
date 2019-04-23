import React, { Component } from 'react';
import { Layout, Menu, message, Modal } from 'antd';
import { Link, Switch, Route, withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import ResumeModel from '../model/resumeModel';

const { Header, Content } = Layout;

import Index from './resume/index';
import Resumes from './resume/resumes';
import Themes from './resume/themes';
import PublishButton from './resume/publish';

const updateInfoDate = gql`
  mutation($infoId: String) {
    infos {
      updateInfoDate(id: $infoId)
    }
  }
`;
const resume_share = gql`
  mutation($infoId: String) {
    resumes {
      resume_share(infoId: $infoId)
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
const query_resume = gql`
  query ($infoId: String) {
    resumes {
      resume(infoId: $infoId) {
        ... on Resume {
          path
        }
        ... on resumeFailType {
          failType
          infoId
        }
      }
    }
  }
`;

class Resume extends Component {
  constructor(props) {
    super(props)
    this.state = {
      themesVisible: false,
      infoId: ""
    }
  }

  componentDidMount() {
    ResumeModel.getRecentInfo().then((res) => {
      let data = {};
      if (res.data.status && res.data.status.code === 0) {
        data = {
          infoId: (res.data.data && res.data.data.infoId) || ""
        }
      } else {
        message.error(res.data.status ? res.data.status.msg : 'recent info error');
      }
      this.setState(data);
    })
  }

  changeInfoId = (infoId) => {
    this.setState({ infoId });
  }

  showThemes = () => {
    this.setState({
      themesVisible: true
    });
  }

  hideThemes = () => {
    this.setState({
      themesVisible: false
    });
  }

  exportPDF = () => {
    document.getElementById("resume").contentWindow.savePDF();
  }

  render() {
    let current_page = this.props.location.pathname.split('/').pop();

    return (
      <Layout style={{ height: "100%"}}>
        <Header className="sub-header">
          <Menu 
            mode="horizontal"
            selectedKeys={[current_page]}
            style={{ lineHeight: "36px", padding: "0 30px" }}
          >
            <Menu.Item key="resumes">
              <Link to="/resume/resumes">Resumes</Link>
            </Menu.Item>
            <Menu.Item key="themes">
              <span onClick={this.showThemes}>Themes</span>
            </Menu.Item>
            <Menu style={{ float: "right", lineHeight: "36px" }}>
              <Menu.Item key="reedit">
                <Mutation
                  mutation={updateInfoDate}
                  refetchQueries={[
                    // promise jump back to Content
                    { 
                      query: query_info
                    },
                    // promise jump back to Resume/Index
                    {
                      query: query_resume,
                      variables: { infoId: "" }
                    }
                  ]}
                  onCompleted = {(data) => {
                    // default show the latest version resume
                    if (data.infos.updateInfoDate == 'success') {
                      this.props.history.push('/');
                    }
                  }}
                >
                  {(updateInfoDate) => {
                    const handleClick = (e) => {
                      e.preventDefault();
                      updateInfoDate({ variables: { infoId: this.state.infoId } })
                    };

                    return (
                      <span onClick={handleClick}>ReEdit</span>
                    )
                  }}
                </Mutation>
              </Menu.Item>
              <Menu.Item key="export">
                <span onClick={this.exportPDF}>Export</span>
              </Menu.Item>
              <Menu.Item key="share">
                <Mutation
                  mutation={resume_share}
                  onCompleted = {(data) => {
                    if (data.resumes.resume_share != "") {
                      Modal.success({
                        title: 'Share Success!',
                        content: (
                          <div>
                            <p style={{marginBottom: '6px'}}>The URL is localhost:8080/share/{data.resumes.resume_share}</p>
                            <p>And the URL will expire in three days!</p>
                          </div>
                        )
                      });
                    } else {
                      message.error("Something Wrong");
                    }
                  }}
                >
                  {(resume_share) => {
                    const handleClick = (e) => {
                      e.preventDefault();
                      resume_share({ variables: { infoId: this.state.infoId }})
                    }

                    return (
                      <span onClick={handleClick}>Share</span>                      
                    );
                  }}
                </Mutation>
              </Menu.Item>
              <Menu.Item key="publish" style={{ borderBottom: "2px solid transparent" }}>
                <PublishButton infoId={this.state.infoId} />
              </Menu.Item>
            </Menu>
          </Menu>
        </Header>
        <Themes infoId={this.state.infoId} themesVisible={this.state.themesVisible} hideThemes={this.hideThemes} />
        <Content>
          <Switch>
            <Route exact path="/resume" component={Index} />
            <Route path="/resume/resumes" component={() => <Resumes changInfoId={this.changeInfoId} infoId={this.state.infoId} />} />
          </Switch>
        </Content>
      </Layout>
    )
  }
}

export default withRouter(Resume);