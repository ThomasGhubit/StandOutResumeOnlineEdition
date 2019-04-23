import React, { Component } from 'react';
import { Card, Form, Input, Icon, Button, message } from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const edit_summary = gql`
  mutation($id: String, $summary: [String]) {
    infos {
      editSummary(id: $id, summary: $summary)
    }
  }
`;

const query_summary = gql`
  query($id: String) {
    infos {
      info(id: $id) {
        summary
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
class SummaryForm extends Component {
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  }

  add = () => {
    const { form, summary } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(summary.length + id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    let length = this.props.summary.length;
    getFieldDecorator('keys', { initialValue: Array.from(new Array(length), (val,index) => index) });
    const keys = getFieldValue('keys');

    const formItems = keys.map((k) => (
      <Form.Item
        label={k == 0 ? "Description" : ""}
        style={{marginBottom: '8px'}}
        required={false}
        key={k}
      >
        {getFieldDecorator(`summary[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            whitespace: true,
            message: "Please input description or delete this field."
          }]
        })(
          <Input style={{ width: "92%", marginRight: "2%" }} placeholder="Input Description" />
        )}
        <Icon
          type="minus-circle-o"
          onClick={() => this.remove(k)}
        />
      </Form.Item>
    ));

    return (
      <Mutation
        mutation={edit_summary}
        refetchQueries={[
          {
            query: query_summary,
            variables: { id: this.props.id }
          },
          {
            query: query_info
          }
        ]}
        onCompleted = {(data) => {
          if (data.infos.editSummary == "success") {
            message.success("Saved Summary");
          } else if (data.info.editSummary == "error") {
            message.error("Something Wrong");
          }
        }}
      >
        {(edit_summary, { data }) => {
          const handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                // in case of empty because of deletion，need to be filtered
                edit_summary({ variables: {
                  id: values.id,
                  summary: values.summary ? values.summary.filter((item) => item != undefined) : []
                }});
              }
            });
          }

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
                  <Icon type="plus" /> Add Description
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

const WrappedSummaryForm = Form.create({
  name: 'summary_form',
  mapPropsToFields(props) {
    let formFields = {
      id: Form.createFormField({
        ...props.id,
        value: props.id
      })
    };
    // assign for each index of the array
    props.summary.forEach((item, index) => {
      formFields[`summary[${index}]`] = Form.createFormField({
        value: item
      })
    });
    return formFields;
  }
})(SummaryForm);


export default class Summary extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Query
        query={query_summary}
        variables={{ id: this.props.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          data.infos.info.id = this.props.id;

          return (
            <Card style={{ margin: '20px' }}
              title="Summary" bordered={false}
            >
              <WrappedSummaryForm {...data.infos.info} />
            </Card>
          )
        }}
      </Query>
    )
  }
}