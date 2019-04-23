import React, { Component } from 'react';
import { message, Modal, Tag, Input, Icon, Button } from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import ResumeModel from '../../model/resumeModel';

const CheckableTag = Tag.CheckableTag;

const resume_publish = gql`
  mutation($infoId: String, $publish: Boolean, $tags: [String]) {
    resumes {
      resume_publish(infoId: $infoId, publish: $publish, tags: $tags)
    }
  }
`;

const query_resume = gql`
  query ($infoId: String) {
    resumes {
      resume(infoId: $infoId) {
        ... on Resume {
          publish
          tags
        }
        ... on resumeFailType {
          failType
        }
      }
    }
  }
`;

export default class PublishButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagShow: false,
      tags: [],
      selectedTags: [],
      hots: [],
      inputValue: "",
      inputVisible: false
    }
  }

  componentDidMount() {
    ResumeModel.getHotTags({num: 6}).then((res) => {
      let data = {};
      if (res.data.status && res.data.status.code === 0) {
        data = {
          hots: (res.data.data && res.data.data.hots.map(({name}) => name)) || [],
        };
      } else {
        message.error(res.data.status ? res.data.status.msg : 'get templates error');
      }
      this.setState(data);
    });
  }

  removeTag = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags, selectedTags, hots } = this.state;

    // if choose hot tag
    if (hots.indexOf(inputValue) != -1 && selectedTags.indexOf(inputValue) == -1) {
      selectedTags = [...selectedTags, inputValue];
    }

    if (inputValue && tags.indexOf(inputValue) == -1 && selectedTags.indexOf(inputValue) == -1) {
      tags = [...tags, inputValue];
    }

    this.setState({
      tags,
      selectedTags,
      inputVisible: false,
      inputValue: ""
    });
  }

  handleChange = (tag, checked) => {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);
    this.setState({ selectedTags: nextSelectedTags });
  }

  clearTags = () => {
    this.setState({
      tags: [],
      selectedTags: []
    });
  }

  saveInputRef = input => this.input = input

  showTag = () => {
    this.setState({
      tagShow: true
    });
  }

  hideTag = () => {
    this.setState({
      tagShow: false
    });
  }

  render() {
    const { hots, selectedTags, tags, inputVisible, inputValue } = this.state;

    return (
      <Query
        query={query_resume}
        variables={{ infoId: this.props.infoId }}
        pollInterval={500}
      >
        {({ loading, error, data, startPolling, stopPolling }) => {
          if (loading) return <span>Loading...</span>;
          if (error) {
            return <Button size="small" type="primary">Publish</Button>;
          }

          if (data.resumes.resume.failType) {
            return <Button size="small" type="primary">Publish</Button>;
          }

          // polling to the server till no errors
          stopPolling();

          return (
            <Mutation
              mutation={resume_publish}
              refetchQueries={[
                {
                  query: query_resume,
                  variables: { infoId: this.props.infoId }
                }
              ]}
              onCompleted = {(data) => {
                if (data.resumes.resume_publish == "success") {
                  message.success("Success");
                  this.hideTag();
                  this.clearTags();
                } else if (data.resumes.resume_publish == "error") {
                  message.error("Something Wrong");
                }
              }}
            >
              {(resume_publish) => {
                const handleUnPublish = (e) => {
                  e.preventDefault();
                  resume_publish({ variables: {
                    infoId: this.props.infoId,
                    publish: false,
                    tags: data.resumes.resume.tags
                  }});
                };
                const handlePublish = (e) => {
                  e.preventDefault();
                  resume_publish({ variables: {
                    infoId: this.props.infoId,
                    publish: true,
                    tags: tags.concat(selectedTags)
                  }});
                };

                let tag_modal = (
                  <Modal
                    title="Select Tag to Publish"
                    visible={this.state.tagShow}
                    onOk={handlePublish}
                    onCancel={this.hideTag}
                  >
                    <div style={{display: 'inline-block'}}>
                      {/* 把用户以前设置的标签放在最上面，便于用户重新选择 */}
                      {data.resumes.resume.tags.map((tag) => {
                        return (
                          <CheckableTag
                            key={tag}
                            checked={selectedTags.indexOf(tag) > -1}
                            onChange={checked => this.handleChange(tag, checked)}
                          >
                            {tag}
                          </CheckableTag>
                        );
                      })}
                      {/* 要去重 */}
                      {hots.filter((tag) => (data.resumes.resume.tags.indexOf(tag) == -1)).map((tag) => {
                        return (
                          <CheckableTag
                            key={tag}
                            checked={selectedTags.indexOf(tag) > -1}
                            onChange={checked => this.handleChange(tag, checked)}
                          >
                            {tag}
                          </CheckableTag>
                        );
                      })}
                      {tags.map((tag) => {
                        return (
                          <Tag key={tag} closable={true}
                            onClose={() => this.removeTag(tag)}
                          >{tag}</Tag>
                        );
                      })}
                    </div>
                    {inputVisible && (
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    )}
                    {!inputVisible && (
                      <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                        <Icon type="plus" /> New Tag
                      </Tag>
                    )}
                  </Modal>
                )

                let btn = data.resumes.resume.publish 
                ? (<Button size="small" type="danger" onClick={handleUnPublish}>UnPublish</Button>)
                : (<Button size="small" type="primary" onClick={this.showTag}>Publish</Button>);

                return (
                  <div>
                    {btn}
                    {tag_modal}
                  </div>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}