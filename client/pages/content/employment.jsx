import React, { Component } from 'react';
import { Card, Form, Input, Icon, Button, message, DatePicker, Divider } from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const { RangePicker } = DatePicker;

const edit_employment = gql`
  mutation($id: String, $employment: [InfoInputEmployment]) {
    infos {
      editEmployment(id: $id, employment: $employment)
    }
  }
`;

const query_employment = gql`
  query($id: String) {
    infos {
      info(id: $id) {
        employment {
          employer
          employee {
            title
            duration
            description
          }
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
let eid = [];
class EmploymentForm extends Component {
  remove = (k, ek = -1) => {
    const { form } = this.props;
    const key_name = ek == -1 ? 'keys' : `keys-${k}`;
    const keys = form.getFieldValue(key_name);
    const nextKeys = keys.filter(key => 
      ek == -1 ? (key !== k) : (key !== ek)
    );

    const temp = {};
    temp[key_name] = nextKeys;
    form.setFieldsValue(temp);
  }

  add = (k = -1) => {
    const { form, employment } = this.props;
    const key_name = k == -1 ? 'keys' : `keys-${k}`;
    const keys = form.getFieldValue(key_name);
    let key;
    if (k == -1) {
      key = employment.length + id++;
    } else {
      if (!eid[k]) eid[k] = 0;
      key = employment[k].employee.length + eid[k]++;
    }
    const nextKeys = keys.concat(key);

    const temp = {};
    temp[key_name] = nextKeys;
    form.setFieldsValue(temp);
  }

  render() {
    const { getFieldValue, getFieldDecorator } = this.props.form;

    let length = this.props.employment.length;
    getFieldDecorator('keys', { initialValue: Array.from(new Array(length), (val,index) => index) });
    const keys = getFieldValue('keys');

    const formItems = keys.map((k) => {
      let employment = this.props.employment[k];
      // define type if it's newly created
      if (!employment) {
        this.props.employment[k] = {
          employer: "",
          employee: []
        }
      }
      let len = employment ? employment.employee.length : 0;
      getFieldDecorator(`keys-${k}`, { initialValue: Array.from(new Array(len), (val,index) => index) });
      const employeeKeys = getFieldValue(`keys-${k}`);

      const employeeItems = employeeKeys.map((ek) => (
        <div key={ek}>
          <Divider>Employment Position</Divider>
          <Form.Item
            style={{marginBottom: '8px'}}
            label="Title"
          >
            {getFieldDecorator(`employment[${k}].employee[${ek}].title`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: "Please input Title / Position."
              }]
            })(
              <Input placeholder="Input Title / Position" />
            )}
          </Form.Item>
          <Form.Item
            style={{marginBottom: '8px'}}
            label="Duration"
          >
            {getFieldDecorator(`employment[${k}].employee[${ek}].duration`, {
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
            {getFieldDecorator(`employment[${k}].employee[${ek}].description`, {})(
              <Input placeholder="Input Description" />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="danger" onClick={() => this.remove(k, ek)}>
              Delete this Employment Position
            </Button>
          </Form.Item>
        </div>
      ));

      return (
        <div key={k}>
          <Form.Item
            style={{marginBottom: '8px'}}
            label="Employer"
          >
            {getFieldDecorator(`employment[${k}].employer`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: "Please input employer name."
              }]
            })(
              <Input placeholder="Input Employer Name" />
            )}
          </Form.Item>
          { employeeItems }
          <Form.Item>
            <Button style={{marginRight: "20px"}} onClick={() => this.add(k)}>
              Add New Employment Position
            </Button>
            <Button type="danger" onClick={() => this.remove(k)}>
              Delete this Employer
            </Button>
          </Form.Item>
          <Divider />
        </div>
      );
    });

    return (
      <Mutation
        mutation={edit_employment}
        refetchQueries={[
          {
            query: query_employment,
            variables: { id: this.props.id }
          },
          {
            query: query_info
          }
        ]}
        onCompleted = {(data) => {
          if (data.infos.editEmployment == "success") {
            message.success("Saved Employment");
          } else if (data.info.editEmployment == "error") {
            message.error("Something Wrong");
          }
        }}
      >
        {(edit_employment, { data }) => {
          const handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                let { id, employment } = values;
                // remove empty item
                employment = employment.filter((item) => item != undefined);
                employment = employment.map((item) => {
                  if (!item.employee) return item;
                  // remove employ empty item
                  item.employee = item.employee.filter((it) => it != undefined);
                  return item;
                });
                // transfer moment to time string
                employment = employment.map((item) => {
                  if (!item.employee) return item;
                  item.employee = item.employee.map((it) => {
                    it.duration = it.duration.map((d) => d.format('YYYY-MM-DD'));
                    return it;
                  });
                  return item;
                });
                edit_employment({ variables: {
                  id,
                  employment
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
              { formItems }
              <Form.Item>
                <Button type="dashed" onClick={() => this.add()}>
                  <Icon type="plus" /> Add Employer
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Save</Button>
              </Form.Item>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

const WrappedEmploymentForm = Form.create({
  name: 'employment_form',
  mapPropsToFields(props) {
    let formFields = {
      id: Form.createFormField({
        ...props.id,
        value: props.id
      })
    };
    props.employment.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        if (key == "employee") {
          item[key].forEach((employee, ei) => {
            Object.keys(employee).forEach((k) => {
              if (k == "duration") {
                // use moment to handle time
                let [start, end] = employee[k];
                let duration = [moment(start), moment(end)];
                formFields[`employment[${index}].${key}[${ei}].${k}`] = Form.createFormField({
                  value: duration
                });
              } else {
                formFields[`employment[${index}].${key}[${ei}].${k}`] = Form.createFormField({
                  value: employee[k]
                });
              }
            });
          });
        } else {
          formFields[`employment[${index}].${key}`] = Form.createFormField({
            value: item[key]
          });
        }
      })
    });
    return formFields;
  }
})(EmploymentForm);

export default class Employment extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Query
        query={query_employment}
        variables={{ id: this.props.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          data.infos.info.id = this.props.id;

          return (
            <Card style={{ margin: '20px' }}
              title="Employment" bordered={false}
            >
              <WrappedEmploymentForm {...data.infos.info} />
            </Card>
          )
        }}
      </Query>
    );
  }
}