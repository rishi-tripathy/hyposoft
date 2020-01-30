import React, { Component } from 'react'
import PropTypes from 'prop-types';
import '../stylesheets/TableView.css'
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ModelTable extends Component {

	constructor() {
		super();
      this.showCreateForm = this.showCreateForm.bind(this);
      this.showEditForm = this.showEditForm.bind(this);
      this.showEditForm = this.showEditForm.bind(this);
	}

	showCreateForm = () => {
		this.props.sendShowCreate(true);
  }
   
	showEditForm = (id) => {
		this.props.sendShowEdit(true);
		this.props.sendEditID(id);
	}
   
   showDeleteForm = (id) => {
		if (window.confirm('Are you sure you want to delete?')) {
			let dst = '/api/models/'.concat(id).concat('/');
			axios.delete(dst)
			.then(function (response) {
				alert('Delete was successful');
			})
			.catch(function (error) {
				alert('Delete was not successful.\n' + JSON.stringify(error.response.data));
			});
		}

		//this.props.sendShowDelete(true);
	}
	//this.props.sendShowDelete(true);
}

  renderTableHeader() {
   //  if (this.props.models[0] == null) return;
    let header = Object.keys(this.props.models[0]);
    return header.map((key, index) => {
       return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.props.models.map((model, index) => {
       const { id, vendor, model_number, height, display_color } = model //destructuring
       const { ethernet_ports, power_ports, cpu, memory, storage, comment } = model //more destructuring
       return (
          <tr key={id}>
						<td>{id}</td>
						<td>{vendor}</td>
						<td>{model_number}</td>
						<td>{height}</td>
						<td>{display_color}</td>
						<td>{ethernet_ports}</td>
						<td>{power_ports}</td>
						<td>{cpu}</td>
						<td>{memory}</td>
						<td>{storage}</td>
						<td><button onClick={ () => this.showEditForm(id) }>Edit</button></td>
            <td><button onClick={ () => this.showDeleteForm(id) }>Delete</button></td>
          </tr>
       )
    })
	}

  
  render() {
    return (
      <div>
				 <div>
					 <p>gonna put filters and stuff here</p>
					 <button onClick={ this.showCreateForm }>Add Model</button>
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

ModelTable.propTypes = {
  models: PropTypes.array.isRequired
}

export default ModelTable