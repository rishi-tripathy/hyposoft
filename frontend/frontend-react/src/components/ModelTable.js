import React, { Component } from 'react'
import PropTypes from 'prop-types';
import '../stylesheets/TableView.css'
import axios, { post } from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ModelTable extends Component {

	constructor() {
		super();
		this.state = {
			file: null,
		}
		this.showCreateForm = this.showCreateForm.bind(this);
		this.showEditForm = this.showEditForm.bind(this);
		this.showEditForm = this.showEditForm.bind(this);
		//this.fileUploadOverride = this.fileUploadOverride.bind(this);
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
	}

  renderTableHeader() {
		let header = ['id', 'vendor', 'model_number', 'height',
		'display_color', 'ethernet_ports,', 'power_ports', 'cpu', 'memory', 'storage', 'comment'];
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

	handleImport = (e) => {
		e.preventDefault();

		let f = this.state.file;


		this.fileUpload(this.state.file).then((response)=>{
      console.log(response.data);
		})
		.catch(function (error) {
			console.log(error.response)

			const fileUploadOverride = (file) => {
				const url = '/api/models/import_file/?override=true';
				const formData = new FormData();
				formData.append('file', file)
				//formData.append('name', 'sup')
				const config = {
						headers: {
								'content-type': 'multipart/form-data'
						}
				}
				return post(url, formData, config)
			}
		
			//alert();
			if (window.confirm('Import was not successful.\n' + JSON.stringify(error.response.data))) {
				fileUploadOverride(f).then((response)=>{
					console.log(response.data);
				})
				.catch(function (error) {
					console.log(error.response)
					alert('Import was not successful.\n' + JSON.stringify(error.response.data));
				});


			}

		});
	}

	

	handleFileUpload = (e) => {
		console.log(e.target.files[0])
		this.setState({
      file: e.target.files[0],
		});
	}

	fileUpload = (file) => {
		const url = '/api/models/import_file/';
    const formData = new FormData();
		formData.append('file', file)
		//formData.append('name', 'sup')
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return post(url, formData, config)
	}

	

  render() {
    return (
      <div>
				<div>
				<button onClick={ this.showCreateForm }>Add Model</button>
				</div>
				<form onSubmit={this.handleImport} >
					<input type="file" name="file" onChange={this.handleFileUpload}/>
					<button type="submit">Import File</button>
				</form>

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
