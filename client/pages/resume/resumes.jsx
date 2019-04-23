import React, { Component } from 'react';
import { Layout, Menu, Icon, Modal, Button, Input, message, Dropdown } from 'antd';
import { Query, Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import Index from './index';

const add_info = gql`
  mutation($name: String) {
    infos {
      addInfo(name: $name)
    }
  }
`;
const delete_info = gql`
  mutation($id: String) {
    infos {
      deleteInfo(id: $id)
    }
  }
`;
const rename_info = gql`
  mutation($id: String, $name: String) {
    infos {
      renameInfo(id: $id, name: $name)
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

const { Content, Sider } = Layout;

class Resume extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addInfo: false,
      deleteInfo: false,
      renameInfo: false,
      operId: ""
    }
  }

  openAddInfo = () => {
    this.setState({
      addInfo: true
    });
  }

  openDeleteInfo = ({domEvent}) => {
    // stop event
    domEvent.stopPropagation();
    this.setState({
      deleteInfo: true
    });
  }

  closeDeleteInfo = () => {
    this.setState({
      deleteInfo: false
    });
  }

  openRenameInfo = ({domEvent}) => {
    domEvent.stopPropagation();
    this.setState({
      renameInfo: true
    });
  }

  closeRenameInfo = () => {
    this.setState({
      renameInfo: false
    })
  }

  setOperId = (id) => {
    this.setState({
      operId: id
    });
  }

  render() {
    let { changInfoId, infoId } = this.props;
    
    const sub_menu = (infoId) => (
      <Menu>
        <Menu.Item onClick={(e) => { this.openRenameInfo(e); this.setOperId(infoId); }}>Rename</Menu.Item>
        <Menu.Item onClick={(e) => { this.openDeleteInfo(e); this.setOperId(infoId); }}>Delete</Menu.Item>
      </Menu>
    );

    const addInfoModal = (
      <Mutation
        mutation={add_info}
        refetchQueries={[
          { query: query_info },
          {
            query: query_resume,
            variables: { infoId: "" }
          },
        ]}
        onCompleted = {(data) => {
          if (data.infos.addInfo == "success") {
            message.success("Success");
            this.props.history.push('/');
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
              title="Give your info a name"
              visible={ this.state.addInfo }
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

    const deleteInfoModel = (
      <Mutation
        mutation={delete_info}
        refetchQueries={[
          { query: query_info },
          {
            query: query_resume,
            variables: { infoId: "" }
          },
          { query: query_resumes }
        ]}
        onCompleted = {(data) => {
          if (data.infos.deleteInfo == "success") {
            message.success("Success");
            this.closeDeleteInfo();
            this.props.changInfoId("");
          } else if (data.infos.deleteInfo == "error") {
            message.error("Something Wrong");
          }
        }}
      >
        {(deleteInfo) => {
          const handleOk = (e) => {
            e.preventDefault();
            deleteInfo({ variables: { id: this.state.operId }});
          }

          return (
            <Modal
              title="Danger"
              visible={ this.state.deleteInfo }
              closable={ false }
              onOk={handleOk}
              onCancel={this.closeDeleteInfo}
            >
              <p>This operation is irreversible, are you sure you want to delete it?</p>
            </Modal>
          )
        }}
      </Mutation>
    );

    const renameInfoModal = (
      <Mutation
        mutation={rename_info}
        refetchQueries={[
          { query: query_info },
          {
            query: query_resume,
            variables: { infoId: "" }
          },
        ]}
        onCompleted = {(data) => {
          if (data.infos.renameInfo == "success") {
            message.success("Success");
            this.closeRenameInfo();
          } else if (data.infos.renameInfo == "error") {
            message.error("Something Wrong");
          }
        }}
      >
        {(renameInfo, { data }) => {
          let input = "";
          const handleOk = (e) => {
            e.preventDefault();
            renameInfo({ variables: { id: this.state.operId, name: input }})
          };
          const onChange = (e) => {
            input = e.target.value;
          }

          return (
            <Modal
              title="Give your info a new name"
              visible={ this.state.renameInfo }
              closable={ false }
              onOk={handleOk}
              onCancel={this.closeRenameInfo}
            >
              <Input onChange={onChange} />
            </Modal>
          );
        }}
      </Mutation>
    );

    return (
      <Layout style={{ marginTop: '3px' }}>
        <Sider width={200} style={{ background: '#fff' }}>
          <Query
            query={query_resumes}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              let resmue_item = data.resumes.resumes.map(({info}) => (
                <Menu.Item key={info.id} onClick={() => changInfoId(info.id)}>
                  {info.name}
                  <Dropdown overlay={() => sub_menu(info.id)}>
                    <Icon style={{ float: 'right', lineHeight: '40px' }} type="more" />
                  </Dropdown>
                </Menu.Item>
              ));

              return (
                <Menu
                  mode="inline"
                  style={{ height: '100%' }}
                  selectedKeys={[infoId]}
                >
                  {resmue_item}
                  <Menu.Item onClick={this.openAddInfo}>
                    <Icon type="plus" /> New Info
                  </Menu.Item>
                </Menu>
              );
            }}
          </Query>
        </Sider>
        <Content>
          <Index infoId={infoId} />
        </Content>
        { addInfoModal }
        { deleteInfoModel }
        { renameInfoModal }
      </Layout>
    )
  }
};

export default withRouter(Resume);