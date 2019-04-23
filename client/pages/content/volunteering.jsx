import React, { Component } from 'react';
import { Card, Form, Input, Icon, Button, message, DatePicker, Divider } from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const { RangePicker } = DatePicker;

const edit_volunteering = gql`
  mutation($id: String, $volunteering: [InfoInputVolunteering]) {
    infos {
      editVolunteering(id: $id, volunteering: $volunteering)
    }
  }
`;

const query_volunteering = gql`
  query($id: String) {
    infos {
      info(id: $id) {
        volunteering {
          title
          duration
          organization
          location
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
class VolunteeringForm extends Component {
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  }

  add = () => {
    const { form, volunteering } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(volunteering.length + id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  }

  render() {
    const { getFieldValue, getFieldDecorator } = this.props.form;

    let length = this.props.volunteering.length;
    getFieldDecorator('keys', { initialValue: Array.from(new Array(length), (val,index) => index) });
    const keys = getFieldValue('keys');

    const formItems = keys.map((k) => (
      <div key={k}>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Volunteering Title"
        >
          {getFieldDecorator(`volunteering[${k}].title`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input volunteering title."
            }]
          })(
            <Input placeholder="Input Volunteering Title" />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Duration"
        >
          {getFieldDecorator(`volunteering[${k}].duration`, {
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
          label="Organization"
        >
          {getFieldDecorator(`volunteering[${k}].organization`, {})(
            <Input placeholder="Input Organization" />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Location"
        >
          {getFieldDecorator(`volunteering[${k}].location`, {})(
            <Input placeholder="Input Location" />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Description"
        >
          {getFieldDecorator(`volunteering[${k}].description`, {})(
            <Input placeholder="Input Description" />
          )}
        </Form.Item>
        <Button type="danger" onClick={() => this.remove(k)}>
          Delete this Volunteering
        </Button>
        <Divider />
      </div>
    ));

    return (
      <Mutation
        mutation={edit_volunteering}
        refetchQueries={[
          {
            query: query_volunteering,
            variables: { id: this.props.id }
          },
          {
            query: query_info
          }
        ]}
        onCompleted = {(data) => {
          if (data.infos.editVolunteering == "success") {
            message.success("Saved Volunteering");
          } else if (data.info.editVolunteering == "error") {
            message.error("Something Wrong");
          }
        }}
      >
        {(edit_volunteering, { data }) => {
          const handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                let { id, volunteering } = values;
                // remove empty item
                volunteering = volunteering.filter((item) => item != undefined);
                // transfer moment to time string
                volunteering = volunteering.map((item) => {
                  item.duration = item.duration.map((d) => d.format('YYYY-MM-DD'))
                  return item;
                });
                edit_volunteering({ variables: {
                  id,
                  volunteering
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
                  <Icon type="plus" /> Add Volunteering
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

const WrappedVolunteeringForm = Form.create({
  name: 'volunteering_form',
  mapPropsToFields(props) {
    let formFields = {
      id: Form.createFormField({
        ...props.id,
        value: props.id
      })
    };
    props.volunteering.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        if (key == "duration") {
          // use moment to handle time
          let [start, end] = item[key];
          let duration = [moment(start), moment(end)];
          formFields[`volunteering[${index}].${key}`] = Form.createFormField({
            value: duration
          });
        } else {
          formFields[`volunteering[${index}].${key}`] = Form.createFormField({
            value: item[key]
          });
        }
      });
    });
    return formFields;
  }
})(VolunteeringForm);

export default class Volunteering extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Query
        query={query_volunteering}
        variables={{ id: this.props.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          data.infos.info.id = this.props.id;

          return (
            <Card style={{ margin: '20px' }}
              title="Volunteering" bordered={false}
            >
              <WrappedVolunteeringForm {...data.infos.info} />
            </Card>
          )
        }}
      </Query>
    )
  }
}