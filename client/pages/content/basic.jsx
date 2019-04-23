import React, { Component } from 'react';
import { Card , Form, Input, Button, message } from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const edit_basic = gql`
  mutation($id: String, $basic: InfoInputBasic) 
  {
    infos {
      editBasic(id: $id, basic: $basic)
    }
  }
`;

const query_basic = gql`
  query($id: String) {
    infos {
      info(id: $id) {
        basic {
          firstName
          lastName
          occupation
          email
          phone
          website
          location
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

class BasicForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Mutation 
        mutation={edit_basic}
        // query again to refresh apollo cache
        refetchQueries={[
          { 
            query: query_basic,
            variables: { id: this.props.id }
          },
          {
            query: query_info
          }
        ]}
        onCompleted = {(data) => {
          if (data.infos.editBasic == "success") {
            message.success("Saved Basic Infomation");
          } else if (data.info.editBasic == "error") {
            message.error("Something Wrong");
          }
        }}
      >
        {(edit_basic, { data }) => {
          const handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                let {id, ...basic} = values;
                edit_basic({ variables: {
                  id,
                  basic
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
              <Form.Item style={{marginBottom: '8px'}} label="First Name">
                {
                  getFieldDecorator("firstName", {
                    rules: [{
                      required: true, message: "Please input your first name!"
                    }]
                  })(
                    <Input placeholder="Input Your First Name" />
                  )
                }
              </Form.Item>
              <Form.Item style={{marginBottom: '8px'}} label="Last Name">
                {
                  getFieldDecorator("lastName", {
                    rules: [{
                      required: true, message: "Please input your last name!"
                    }]
                  })(
                    <Input placeholder="Input Your Last Name" />
                  )
                }
              </Form.Item>
              <Form.Item style={{marginBottom: '8px'}} label="Occupation">
                {
                  getFieldDecorator("occupation", {})(
                    <Input placeholder="Input Your Occupation" />
                  )
                }
              </Form.Item>
              <Form.Item style={{marginBottom: '8px'}} label="Email">
                {
                  getFieldDecorator("email", {
                    rules: [{
                      type: "email", message: "The input is not valid E-mail!"
                    }]
                  })(
                    <Input placeholder="Input Your Email" />
                  )
                }
              </Form.Item>
              <Form.Item style={{marginBottom: '8px'}} label="Phone">
                {
                  getFieldDecorator("phone", {})(
                    <Input placeholder="Input Your Phone Number" />
                  )
                }
              </Form.Item>
              <Form.Item style={{marginBottom: '8px'}} label="Website">
                {
                  getFieldDecorator("website", {})(
                    <Input placeholder="Input Your Website" />
                  )
                }
              </Form.Item>
              <Form.Item style={{marginBottom: '8px'}} label="Location or Address">
                {
                  getFieldDecorator("location", {})(
                    <Input placeholder="Input Your Location or Address" />
                  )
                }
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

const WrappedBasicForm = Form.create({
  name: 'basic_form',
  mapPropsToFields(props) {
    return {
      id: Form.createFormField({
        ...props.id,
        value: props.id
      }),
      firstName: Form.createFormField({
        ...props.firstName,
        value: props.firstName
      }),
      lastName: Form.createFormField({
        ...props.lastName,
        value: props.lastName
      }),
      occupation: Form.createFormField({
        ...props.occupation,
        value: props.occupation
      }),
      email: Form.createFormField({
        ...props.email,
        value: props.email
      }),
      phone: Form.createFormField({
        ...props.phone,
        value: props.phone
      }),
      website: Form.createFormField({
        ...props.website,
        value: props.website
      }),
      location: Form.createFormField({
        ...props.location,
        value: props.location
      }),
    }
  }
})(BasicForm);

export default class Basic extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Query
        query={query_basic}
        variables = {{ id: this.props.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          data.infos.info.basic.id = this.props.id;

          return (
            <Card style={{ margin: '20px' }}
              title="Basic Information" bordered={false}
            >
              <WrappedBasicForm {...data.infos.info.basic} />
            </Card>
          );
        }}
      </Query>
    )
  }
}