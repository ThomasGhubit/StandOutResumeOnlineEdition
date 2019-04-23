import React, { Component } from 'react';
import { Card, Form, Input, Icon, Button, message, DatePicker, Divider } from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const edit_award = gql`
  mutation($id: String, $award: [InfoInputAward]) {
    infos {
      editAward(id: $id, award: $award)
    }
  }
`;

const query_award = gql`
  query($id: String) {
    infos {
      info(id: $id) {
        award {
          name
          time
          awarder
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
class AwardForm extends Component {
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  }

  add = () => {
    const { form, award } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(award.length + id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  }

  render() {
    const { getFieldValue, getFieldDecorator } = this.props.form;

    let length = this.props.award.length;
    getFieldDecorator('keys', { initialValue: Array.from(new Array(length), (val,index) => index) });
    const keys = getFieldValue('keys');

    const formItems = keys.map((k) => (
      <div key={k}>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Award Name"
        >
          {getFieldDecorator(`award[${k}].name`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input award name."
            }]
          })(
            <Input placeholder="Input Award Name" />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Time"
        >
          {getFieldDecorator(`award[${k}].time`, {
            rules: [{
              required: true,
              message: "Please select time."
            }]
          })(
            <DatePicker />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Awarder"
        >
          {getFieldDecorator(`award[${k}].awarder`, {})(
            <Input placeholder="Input Awarder" />
          )}
        </Form.Item>
        <Form.Item
          style={{marginBottom: '8px'}}
          label="Description"
        >
          {getFieldDecorator(`award[${k}].description`, {})(
            <Input placeholder="Input Description" />
          )}
        </Form.Item>
        <Button type="danger" onClick={() => this.remove(k)}>
          Delete this Award
        </Button>
        <Divider />
      </div>
    ));

    return (
      <Mutation
        mutation={edit_award}
        refetchQueries={[
          {
            query: query_award,
            variables: { id: this.props.id }
          },
          {
            query: query_info
          }
        ]}
        onCompleted = {(data) => {
          if (data.infos.editAward == "success") {
            message.success("Saved Award");
          } else if (data.info.editAward == "error") {
            message.error("Something Wrong");
          }
        }}
      >
        {(edit_award, { data }) => {
          const handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                let { id, award } = values;
                // remove empty item
                award = award.filter((item) => item != undefined);
                // transfer moment to time string
                award = award.map((item) => {
                  item.time = item.time.format('YYYY-MM-DD');
                  return item;
                });
                edit_award({ variables: {
                  id,
                  award
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
                  <Icon type="plus" /> Add Award
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

const WrappedAwardForm = Form.create({
  name: 'award_form',
  mapPropsToFields(props) {
    let formFields = {
      id: Form.createFormField({
        ...props.id,
        value: props.id
      })
    };
    props.award.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        if (key == "time") {
          // use moment to handle time
          formFields[`award[${index}].${key}`] = Form.createFormField({
            value: moment(item[key])
          });
        } else {
          formFields[`award[${index}].${key}`] = Form.createFormField({
            value: item[key]
          });
        }
      });
    });
    return formFields;
  }
})(AwardForm);

export default class Award extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Query
        query={query_award}
        variables={{ id: this.props.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          data.infos.info.id = this.props.id;

          return (
            <Card style={{ margin: '20px' }}
              title="Award" bordered={false}
            >
              <WrappedAwardForm {...data.infos.info} />
            </Card>
          )
        }}
      </Query>
    )
  }
}

