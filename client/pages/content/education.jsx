import React, { Component } from 'react';
import { Card, Form, Input, Icon, Button, message, DatePicker, Divider } from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const { RangePicker } = DatePicker;

const edit_education = gql`
  mutation($id: String, $education: [InfoInputEducation]) {
    infos {
      editEducation(id: $id, education: $education)
    }
  }
`;

const query_education = gql`
  query($id: String) {
    infos {
      info(id: $id) {
        education {
          schoolName,
          duration,
          degree,
          field,
          note
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
class EducationForm extends Component {
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  }

  add = () => {
    const { form, education } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(education.length + id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  }

  render() {
    const { getFieldValue, getFieldDecorator } = this.props.form;

    let length = this.props.education.length;
    getFieldDecorator('keys', { initialValue: Array.from(new Array(length), (val,index) => index) });
    const keys = getFieldValue('keys');

    const formItems = keys.map((k) => (
      <div key={k}>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="School Name"
        >
          {getFieldDecorator(`education[${k}].schoolName`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input school name."
            }]
          })(
            <Input placeholder="Input School Name" />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Duration"
        >
          {getFieldDecorator(`education[${k}].duration`, {
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
          label="Degree"
        >
          {getFieldDecorator(`education[${k}].degree`, {})(
            <Input placeholder="Input Degree" />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Field"
        >
          {getFieldDecorator(`education[${k}].field`, {})(
            <Input placeholder="Input Field" />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Note"
        >
          {getFieldDecorator(`education[${k}].note`, {})(
            <Input placeholder="Input Note" />
          )}
        </Form.Item>
        <Button type="danger" onClick={() => this.remove(k)}>
          Delete this Education
        </Button>
        <Divider />
      </div>
    ));

    return (
      <Mutation
        mutation={edit_education}
        refetchQueries={[
          {
            query: query_education,
            variables: { id: this.props.id }
          },
          {
            query: query_info
          }
        ]}
        onCompleted = {(data) => {
          if (data.infos.editEducation == "success") {
            message.success("Saved Education");
          } else if (data.info.editEducation == "error") {
            message.error("Something Wrong");
          }
        }}
      >
        {(edit_education, { data }) => {
          const handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                let { id, education } = values;
                // remove empty item
                education = education.filter((item) => item != undefined);
                // transfer moment to time string
                education = education.map((item) => {
                  item.duration = item.duration.map((d) => d.format('YYYY-MM-DD'))
                  return item;
                });
                edit_education({ variables: {
                  id,
                  education
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
                  <Icon type="plus" /> Add Education
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

const WrappedEducationForm = Form.create({
  name: 'education_form',
  mapPropsToFields(props) {
    let formFields = {
      id: Form.createFormField({
        ...props.id,
        value: props.id
      })
    };
    props.education.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        if (key == "duration") {
          // use moment to handle time
          let [start, end] = item[key];
          let duration = [moment(start), moment(end)];
          formFields[`education[${index}].${key}`] = Form.createFormField({
            value: duration
          });
        } else {
          formFields[`education[${index}].${key}`] = Form.createFormField({
            value: item[key]
          });
        }
      });
    });
    return formFields;
  }
})(EducationForm);

export default class Education extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Query
        query={query_education}
        variables={{ id: this.props.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          data.infos.info.id = this.props.id;

          return (
            <Card style={{ margin: '20px' }}
              title="Education" bordered={false}
            >
              <WrappedEducationForm {...data.infos.info} />
            </Card>
          )
        }}
      </Query>
    )
  }
}