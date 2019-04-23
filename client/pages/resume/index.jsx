import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import './index.scss';

const update_resume = gql`
  mutation($infoId: String) {
    resumes {
      resume(infoId: $infoId)
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
const query_resumes = gql`
  {
    resumes {
      resumes {
        info {
          id
          name
        }
      }
    }
  }
`;

export default class Index extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let infoId = this.props.infoId;

    return (
      <Query
        query={query_resume}
        variables={{ infoId: infoId ? infoId : "" }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          if (data.resumes.resume.failType) {
            return (
              <Mutation
                mutation={update_resume}
                refetchQueries={[
                  { 
                    query: query_resume,
                    variables: { infoId: infoId ? infoId : "" }
                  },
                  { query: query_resumes }
                ]}
                onCompleted = {(data) => {
                  if (data.resumes.update_resume == "success") {
                    message.success("Success");
                  } else if (data.resumes.update_resume == "error") {
                    message.error("Something Wrong");
                  }
                }}
              >
                {(update_resume) => {
                  const handleOk = (e) => {
                    e.preventDefault();
                    update_resume({ variables: { infoId: data.resumes.resume.infoId }});
                  };

                  return (
                    <Modal
                      title="Attention"
                      visible={ true }
                      closable={ false }
                      footer={[
                        <Button key="submit" type="primary" onClick={handleOk} >Ok</Button>
                      ]}
                    >
                      { 
                        data.resumes.resume.failType == 1
                          ? "The resume haven't been created. Create Now?"
                          : "The resume should be updated. Update Now?"
                      }
                    </Modal>
                  );
                }}
              </Mutation>
            );
          }

          return (
            <div>
              <iframe id="resume" scrolling="no" frameBorder="0" src={data.resumes.resume.path} />
            </div>
          )
        }}
      </Query>
    )
  }
}