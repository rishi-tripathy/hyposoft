import React, { Component } from 'react'

export class UserTable extends Component {

  renderTableHeader() {
		let header = ['id', 'username', 'email', 'first name',
		'last name'];
    return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.props.users.map((user, index) => {
       const { id, url, username, email, first_name, last_name } = user //destructuring
       
       return (
          <tr key={id}>
						<td>{id}</td>
						<td>{username}</td>
						<td>{email}</td>
						<td>{first_name}</td>
            <td>{last_name}</td>
          </tr>
       )
    })
  }

  showCreateForm = () => {
		this.props.sendShowCreate(true);
	}
  

  render() {
    return (
      <div>
        <div>
					<button onClick={ this.showCreateForm }>Add User</button>
				</div>

        <table id="entries">
          <tbody>
            <tr>{this.renderTableHeader()}</tr>
            { this.renderTableData() }
          </tbody>
         </table>
      </div>
    )
  }
}

export default UserTable
