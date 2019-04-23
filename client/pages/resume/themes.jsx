import React, { Component } from 'react';
import { Drawer, Spin, message, Card, Modal  } from 'antd';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import ResumeModel from '../../model/resumeModel';
import './themes.scss';

const confirm = Modal.confirm;

const resume_template_change = gql`
  mutation($infoId: String, $template: String) {
    resumes {
      resume_template_change(infoId: $infoId, template: $template)
    }
  }
`;

class Themes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templates: [],
      loading: false,
    }
  }

  componentDidMount() {
    this.setState({ loading: true });
    ResumeModel.getTemplates().then((res) => {
      let data = { loading: false };
      if (res.data.status && res.data.status.code === 0) {
        data = {
          ...data,
          templates: (res.data.data && res.data.data.templates) || [],
        };
      } else {
        message.error(res.data.status ? res.data.status.msg : 'get templates error');
      }
      this.setState(data);
    });
  }

  renderTemplates() {
    const { templates } = this.state;
    return (
      templates.length < 1
        ? null
        : (
          <div className="template-list">
            {
              templates.map((r, idx) => (
                <Mutation
                  key={`${r.name}-${idx}`} 
                  mutation={resume_template_change}
                  onCompleted = {(data) => {
                    if (data.resumes.resume_template_change == "success") {
                      message.success("Success");
                    } else if (data.resumes.resume_template_change == "error") {
                      message.error("Something Wrong");
                    }
                    this.props.hideThemes();
                    // refresh html in iframe
                    document.getElementById('resume').contentWindow.location.reload(true);
                  }}
                >
                  {(resume_template_change) => {
                    const handleClick = (infoId, template) => {
                      confirm({
                        title: "Do you want to change the resume's template?",
                        content: "When clicked the OK button, the resume's template will be changed.",
                        onOk() {
                          resume_template_change({ variables: {
                            infoId,
                            template
                          }});
                        }
                      });
                    };

                    return (
                      <Card 
                        hoverable
                        className="template-card" 
                        bodyStyle={{ padding: 0 }}
                        onClick = {() => handleClick(this.props.infoId, r.name)}
                      >
                        <div className="template-image">
                          <img alt={r.name} width="100%" src={r.image}/>
                        </div>
                        <div className="template-title">
                          <h3>{r.name}</h3>
                        </div>
                      </Card>
                    );
                  }}
                </Mutation>
              ))
            }
          </div>
        )
    );
  }

  render() {
    let content = this.state.loading
      ? (<Spin />)
      : (this.renderTemplates());

    return (
      <Drawer
        titel="Themes"
        placement="top"
        closable={true}
        onClose={this.props.hideThemes}
        visible={this.props.themesVisible}
      >
        { content }
      </Drawer>
    );
  }
}

export default withRouter(Themes);