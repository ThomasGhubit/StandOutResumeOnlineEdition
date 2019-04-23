import React, { Component } from 'react';
import { Card, Form, Input, Icon, Button, message, DatePicker, Divider } from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const { RangePicker } = DatePicker;

const edit_project = gql`
  mutation($id: String, $project: [InfoInputProject]) {
    infos {
      editProject(id: $id, project: $project)
    }
  }
`;

const query_project = gql`
  query($id: String) {
    infos {
      info(id: $id) {
        project {
          name
          duration
          link
          description
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

let id = 0;
class ProjectForm extends Component {
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  }

  add = () => {
    const { form, project } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(project.length + id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  }

  render() {
    const { getFieldValue, getFieldDecorator } = this.props.form;

    let length = this.props.project.length;
    getFieldDecorator('keys', { initialValue: Array.from(new Array(length), (val,index) => index) });
    const keys = getFieldValue('keys');

    const formItems = keys.map((k) => (
      <div key={k}>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Project Name"
        >
          {getFieldDecorator(`project[${k}].name`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input project name."
            }]
          })(
            <Input placeholder="Input Project Name" />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Duration"
        >
          {getFieldDecorator(`project[${k}].duration`, {
            rules: [{
              type: "array",
              required: true,
              message: "Please select time."
            }]
          })(
            <RangePicker />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Link"
        >
          {getFieldDecorator(`project[${k}].link`, {})(
            <Input placeholder="Input Link" />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Description"
        >
          {getFieldDecorator(`project[${k}].description`, {})(
            <Input placeholder="Input Description" />
          )}
        </Form.Item>
        <Button type="danger" onClick={() => this.remove(k)}>
          Delete this Project
        </Button>
        <Divider />
      </div>
    ));

    return (
      <Mutation
        mutation={edit_project}
        refetchQueries={[
          {
            query: query_project,
            variables: { id: this.props.id }
          },
          {
            query: query_info
          }
        ]}
        onCompleted = {(data) => {
          if (data.infos.editProject == "success") {
            message.success("Saved Project");
          } else if (data.info.editProject == "error") {
            message.error("Something Wrong");
          }
        }}
      >
        {(edit_project, { data }) => {
          const handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                let { id, project } = values;
                // remove empty item
                project = project.filter((item) => item != undefined);
                // transfer moment to time string
                project = project.map((item) => {
                  item.duration = item.duration.map((d) => d.format('YYYY-MM-DD'))
                  return item;
                });
                edit_project({ variables: {
                  id,
                  project
                }});
              }
            });
          };

          return (
            <Form onSubmit={handleSubmit}>
              <Form.Item style={{display: 'none'}} label="id">
                {
                  getFieldDecorator("id", {})(
                    <Input />
                  )
                }
              </Form.Item>
              {formItems}
              <Form.Item>
                <Button type="dashed" onClick={this.add}>
                  <Icon type="plus" /> Add Project
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Save</Button>
              </Form.Item>
            </Form>
          );
        }}
      </Mutation>
    )
  }
}

const WrappedProjectForm = Form.create({
  name: 'project_form',
  mapPropsToFields(props) {
    let formFields = {
      id: Form.createFormField({
        ...props.id,
        value: props.id
      })
    };
    props.project.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        if (key == "duration") {
          // use moment to handle time
          let [start, end] = item[key];
          let duration = [moment(start), moment(end)];
          formFields[`project[${index}].${key}`] = Form.createFormField({
            value: duration
          });
        } else {
          formFields[`project[${index}].${key}`] = Form.createFormField({
            value: item[key]
          });
        }
      });
    });
    return formFields;
  }
})(ProjectForm);

export default class Project extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Query
        query={query_project}
        variables={{ id: this.props.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          data.infos.info.id = this.props.id;

          return (
            <Card style={{ margin: '20px' }}
              title="Project" bordered={false}
            >
              <WrappedProjectForm {...data.infos.info} />
            </Card>
          )
        }}
      </Query>
    )
  }
}