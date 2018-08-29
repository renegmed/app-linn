import React, { Component } from 'react'
import { Header, Menu } from 'semantic-ui-react' 
import { Link, Router } from '../../routes';

export default class MainMenu extends Component {
  state = {activeItem: ''} 
 
   handleSelectedItem = async (event, activeItem) => {
    
    console.log('+++++ MainMenu.handleSelectedItem itemName +++++++')    
    console.log(activeItem)
   // console.log(activeItem.name) 

   this.setState({ activeItem })   
   await Router.pushRoute(`/${activeItem.name}`);    
  }

  render() {
    
    console.log(this.state.activeItem.name)
    return (
      <Menu vertical compact >
        <Menu.Item>
          <Menu.Header as='h3'>Home</Menu.Header>

          <Menu.Menu>
            <Menu.Item
              name='Index'
              active={this.state.activeItem.name === 'Index'}
              fitted='horizontally'
              onClick={this.handleSelectedItem}
            >            
            go to home
            </Menu.Item> 
          </Menu.Menu>
        </Menu.Item>
 

        <Menu.Item>
          <Menu.Header as='h3'>Users</Menu.Header>

          <Menu.Menu>
            <Menu.Item
              name='Users'
              active={this.state.activeItem.name === 'Users'}
              fitted='horizontally'
              onClick={this.handleSelectedItem}
            >
            <Header sub >Listing</Header>
            <p>list of users</p>
            </Menu.Item>
 
          </Menu.Menu>
        </Menu.Item>
 
         
        <Menu.Item>
          <Menu.Header as='h3'>Permissions</Menu.Header>

          <Menu.Menu>
            <Menu.Item
              name='Permissions'
              active={this.state.activeItem.name === 'Permissions'}
              fitted='horizontally'
              onClick={this.handleSelectedItem}
            >
            <Header sub >List</Header>
            <p>List of permissions</p>
            </Menu.Item>
 
          </Menu.Menu>
        </Menu.Item>

          
          <Menu.Item>
          <Menu.Header as='h3'>Records</Menu.Header>

          <Menu.Menu>
            <Menu.Item
              name='Records'
              active={this.state.activeItem.name === 'Records'}
              fitted='horizontally'
              onClick={this.handleSelectedItem}
            >
            <Header sub >List</Header>
            <p>List of records</p>
            </Menu.Item>
 
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    )
  }
}
