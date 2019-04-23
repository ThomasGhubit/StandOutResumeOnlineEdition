import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Button } from 'antd';

export default class InfoSelect extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let menuItems = this.props.infos.map(({id, name}) => (
      <Menu.Item key={id +"," + name}>{name}</Menu.Item>
    ));
    let menu = (
      <Menu onClick={this.props.onChangeInfo}>
        {menuItems}
      </Menu>
    );

    return (
      <Dropdown overlay={menu} >
        <Button style={this.props.style}>
          {this.props.infoName}
          <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}