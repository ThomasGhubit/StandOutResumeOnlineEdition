import React, { Component } from 'react';
import { Card, Col, Row, Rate, message, Tag } from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import ResumeModel from '../model/resumeModel';

const CheckableTag = Tag.CheckableTag;

const publish_resumes = gql`
  query($tags: [String]) {
    resumes {
      publish_resumes(tags: $tags) {
        id
        path
        sum
        info {
          name
        }
      }
    }
  }
`;

const resume_rating = gql`
  mutation($id: String, $point: Int) {
    resumes {
      resume_rating(id: $id, point: $point)
    }
  }
`;

const { Meta } = Card;

export default class Square extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hots: [],
      selectedTags: []
    }
  }

  componentDidMount() {
    ResumeModel.getHotTags({num: 20}).then((res) => {
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

  handleChange = (tag, checked) => {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);
    this.setState({selectedTags: nextSelectedTags});
  }

  render() {
    const { selectedTags, hots } = this.state;
    const handleChange = this.handleChange;

    return (
      <Query
        query={publish_resumes}
        variables={{tags: selectedTags}}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return (
            <div style={{margin: '20px'}}>
              <Card title="Select Tags" bordered={false}>
                {hots.map(tag => (
                  <CheckableTag
                    key={tag}
                    checked={selectedTags.indexOf(tag) > -1}
                    onChange={checked => handleChange(tag, checked)}
                  >
                    {tag}  
                  </CheckableTag>
                ))}
              </Card>
              <Row gutter={24} style={{marginTop: '10px'}}>
                {data.resumes.publish_resumes.map((resume) => {
                  let iframe = (
                    <iframe scrolling="no" frameBorder="0" src={resume.path} />
                  );

                  return (
                    <Col span={4} key={resume.path}>
                      <Mutation
                        mutation={resume_rating}
                        onCompleted = {(data) => {
                          if (data.resumes.resume_rating == "success") {
                            message.success("Success");
                          } else if (data.resumes.resume_rating == "error") {
                            message.error("Something Wrong");
                          }
                        }}
                      >
                        {(resume_rating) => {
                          const handleChange = (value) => {
                            resume_rating({
                              variables: {
                                id: resume.id,
                                point: value
                              }
                            });
                          }

                          return (
                            <Card 
                              hoverable
                              bordered={false}
                              cover={iframe}
                              actions={[<Rate onChange={handleChange} />]}
                            >
                              <a href={resume.path} target="_blank">
                                <Meta
                                  title={resume.info.name}
                                  description={`rating: ${resume.sum ? resume.sum : 0}`}
                                />
                              </a>
                            </Card>
                          )
                        }}
                      </Mutation>
                      
                    </Col>
                  )
                })}
              </Row>
            </div>
          );
        }}
      </Query>
    )
  }
}