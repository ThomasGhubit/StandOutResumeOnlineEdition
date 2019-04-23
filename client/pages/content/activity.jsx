import React, { Component } from 'react';
import { Card, Form, Input, Icon, Button, message, DatePicker, Divider } from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const { RangePicker } = DatePicker;

const edit_activity = gql`
  mutation($id: String, $activity: [InfoInputActivity]) {
    infos {
      editActivity(id: $id, activity: $activity)
    }
  }
`;

const query_activity = gql`
  query($id: String) {
    infos {
      info(id: $id) {
        activity {
          title
          duration
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
class ActivityForm extends Component {
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  }

  add = () => {
    const { form, activity } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(activity.length + id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  }

  render() {
    const { getFieldValue, getFieldDecorator } = this.props.form;

    let length = this.props.activity.length;
    getFieldDecorator('keys', { initialValue: Array.from(new Array(length), (val,index) => index) });
    const keys = getFieldValue('keys');

    const formItems = keys.map((k) => (
      <div key={k}>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Activity Title"
        >
          {getFieldDecorator(`activity[${k}].title`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input activity title."
            }]
          })(
            <Input placeholder="Input Activity Title" />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Duration"
        >
          {getFieldDecorator(`activity[${k}].duration`, {
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
          label="Description"
        >
          {getFieldDecorator(`activity[${k}].description`, {})(
            <Input placeholder="Input Description" />
          )}
        </Form.Item>
        <Button type="danger" onClick={() => this.remove(k)}>
          Delete this Activity
        </Button>
        <Divider />
      </div>
    ));

    return (
      <Mutation
        mutation={edit_activity}
        refetchQueries={[
          {
            query: query_activity,
            variables: { id: this.props.id }
          },
          {
            query: query_info
          }
        ]}
        onCompleted = {(data) => {
          if (data.infos.editActivity == "success") {
            message.success("Saved Activity");
          } else if (data.info.editActivity == "error") {
            message.error("Something Wrong");
          }
        }}
      >
        {(edit_activity, { data }) => {
          const handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                let { id, activity } = values;
                // remove empty item
                activity = activity.filter((item) => item != undefined);
                // transfer moment to time string
                activity = activity.map((item) => {
                  item.duration = item.duration.map((d) => d.format('YYYY-MM-DD'))
                  return item;
                });
                edit_activity({ variables: {
                  id,
                  activity
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
                  <Icon type="plus" /> Add Activity
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

const WrappedActivityForm = Form.create({
  name: 'activity_form',
  mapPropsToFields(props) {
    let formFields = {
      id: Form.createFormField({
        ...props.id,
        value: props.id
      })
    };
    props.activity.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        if (key == "duration") {
          // use moment to handle time
          let [start, end] = item[key];
          let duration = [moment(start), moment(end)];
          formFields[`activity[${index}].${key}`] = Form.createFormField({
            value: duration
          });
        } else {
          formFields[`activity[${index}].${key}`] = Form.createFormField({
            value: item[key]
          });
        }
      });
    });
    return formFields;
  }
})(ActivityForm);

export default class Activity extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Query
        query={query_activity}
        variables={{ id: this.props.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          data.infos.info.id = this.props.id;

          return (
            <Card style={{ margin: '20px' }}
              title="Activity" bordered={false}
            >
              <WrappedActivityForm {...data.infos.info} />
            </Card>
          )
        }}
      </Query>
    )
  }
}
