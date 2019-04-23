import React, { Component } from 'react';
import { Card, Form, Input, Icon, Button, message, Divider } from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const edit_skill = gql`
  mutation($id: String, $skill: [InfoInputSkill]) {
    infos {
      editSkill(id: $id, skill: $skill)
    }
  }
`;

const query_skill = gql`
  query($id: String) {
    infos {
      info(id: $id) {
        skill {
          group
          skillNames
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
class SkillForm extends Component {
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
    const { form, skill } = this.props;
    const key_name = k == -1 ? 'keys' : `keys-${k}`;
    const keys = form.getFieldValue(key_name);
    let key;
    if (k == -1) {
      key = skill.length + id++;
    } else {
      if (!eid[k]) eid[k] = 0;
      key = skill[k].skillNames.length + eid[k]++;
    }
    const nextKeys = keys.concat(key);

    const temp = {};
    temp[key_name] = nextKeys;
    form.setFieldsValue(temp);
  }

  render() {
    const { getFieldValue, getFieldDecorator } = this.props.form;
    
    let length = this.props.skill.length;
    getFieldDecorator('keys', { initialValue: Array.from(new Array(length), (val,index) => index) });
    const keys = getFieldValue('keys');

    const formItems = keys.map((k) => {
      let skill = this.props.skill[k];
      if (!skill) {
        this.props.skill[k] = {
          group: "",
          skillNames: []
        }
      }
      let len = skill ? skill.skillNames.length : 0;
      getFieldDecorator(`keys-${k}`, { initialValue: Array.from(new Array(len), (val,index) => index) });
      const skillKeys = getFieldValue(`keys-${k}`);

      const skillNameItems = skillKeys.map((ek, index) => (
        <div key={ek}>
          <Form.Item
            style={{marginBottom: '8px'}}
            label={index == 0 ? "Skill Name" : ""}
          >
            {getFieldDecorator(`skill[${k}].skillNames[${ek}]`, {
              rules: [{
                required: true,
                whitespace: true,
                message: "Please input skill name or delete this field."
              }]
            })(
              <Input style={{ width: "92%", marginRight: "2%" }} placeholder="Input Skill Name" />
            )}
            <Icon
              type="minus-circle-o"
              onClick={() => this.remove(k, ek)}
            />
          </Form.Item>
        </div>
      ));

      return (
        <div key={k}>
          <Form.Item
            style={{marginBottom: '8px'}}
            label="Group Name"
          >
            {getFieldDecorator(`skill[${k}].group`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                whitespace: true,
                message: "Please input group name."
              }]
            })(
              <Input placeholder="Input Group Name" />
            )}
          </Form.Item>
          { skillNameItems }
          <Form.Item>
            <Button style={{marginRight: "20px"}} onClick={() => this.add(k)}>
              Add New Skill Name
            </Button>
            <Button type="danger" onClick={() => this.remove(k)}>
              Delete this Group
            </Button>
          </Form.Item>
          <Divider />
        </div>
      );
    });

    return (
      <Mutation
        mutation={edit_skill}
        refetchQueries={[
          {
            query: query_skill,
            variables: { id: this.props.id }
          },
          {
            query: query_info
          }
        ]}
        onCompleted = {(data) => {
          if (data.infos.editSkill == "success") {
            message.success("Saved Skill");
          } else if (data.info.editSkill == "error") {
            message.error("Something Wrong");
          }
        }}
      >
        {(edit_skill, { data }) => {
          const handleSubmit =(e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                let { id, skill } = values;
                // remove skill empty item
                skill = skill.filter((item) => item != undefined);
                skill = skill.map((item) => {
                  if (!item.skillNames) return item;
                  // remove skill empty item
                  item.skillNames = item.skillNames.filter((it) => it != undefined);
                  return item;
                });
                edit_skill({ variables: {
                  id,
                  skill
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
                  <Icon type="plus" /> Add Group
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

const WrappedSkillForm =Form.create({
  name: 'skill_form',
  mapPropsToFields(props) {
    let formFields = {
      id: Form.createFormField({
        ...props.id,
        value: props.id
      })
    };
    props.skill.forEach((item, index) => {
      Object.keys(item).forEach((key) => {
        if (key == "skillNames") {
          item[key].forEach((sk, ei) => {
            formFields[`skill[${index}].${key}[${ei}]`] = Form.createFormField({
              value: sk
            });
          });
        } else {
          formFields[`skill[${index}].${key}`] = Form.createFormField({
            value: item[key]
          });
        }
      });
    });
    return formFields;
  }
})(SkillForm);

export default class Skill extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Query
        query={query_skill}
        variables={{ id: this.props.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          data.infos.info.id = this.props.id;

          return (
            <Card style={{ margin: '20px' }}
              title="Skill" bordered={false}
            >
              <WrappedSkillForm {...data.infos.info} />
            </Card>
          )
        }}
      </Query>
    );
  }
}