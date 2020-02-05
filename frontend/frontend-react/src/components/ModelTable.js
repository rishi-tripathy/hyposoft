import React, { Component } from 'react'
import PropTypes from 'prop-types';
import '../stylesheets/TableView.css'
import axios, { post } from 'axios'
import { UncontrolledCollapse, Button, Table, Input, Form, ButtonGroup, Container, Card, Row, Col } from 'reactstrap';
import FormGroup from "reactstrap/es/FormGroup";
import ButtonToolbar from "reactstrap/es/ButtonToolbar";

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
	}

	showCreateForm = () => {
		this.props.sendShowCreate(true);
	}

	showDetailedModel = (id) => {
		//this.props.sendShowTable(false);
		this.props.sendShowDetailedModel(true);
    	this.props.sendModelID(id);
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
				alert('Delete was not successful.\n' + JSON.stringify(error.response.data, null, 2));
			});
		}
		this.showRerender();
	}

	showRerender = () => {
    this.props.sendRerender(true);
  }

  renderTableHeader() {
		let header = ['id', 'vendor', 'model number', 'height',
		'display color', 'ethernet ports', 'power ports', 'cpu', 'memory', 'storage'];
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
						<td><div style={{
							width: 12,
							height: 12,
							backgroundColor: '#' + display_color,
							left: 5,
							top: 5,
							}}></div>{display_color}</td>
						<td>{ethernet_ports}</td>
						<td>{power_ports}</td>
						<td>{cpu}</td>
						<td>{memory}</td>
						<td>{storage}</td>
						{this.props.is_admin ? (
							<div>
								<td><Button color="info" size="sm" onClick={ () => this.showDetailedModel(id) }>Details</Button></td>
								<td><Button color="warning" size="sm" onClick={ () => this.showEditForm(id) }>Edit</Button></td>
								<td><Button color="danger" size="sm" onClick={ () => this.showDeleteForm(id) }>Delete</Button></td>
							</div>
						):
						(<p></p>)}
          </tr>
       )
    })
	}

	handleImport = (e) => {
		e.preventDefault();
		let f = this.state.file;
		this.fileUpload(this.state.file).then((response)=>{
			alert("Import was successful.\n" + JSON.stringify(response));
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

			if (window.confirm('Import was not successful.\n' + JSON.stringify(error.response.data, null, 2))) {
				fileUploadOverride(f).then((response)=>{
					alert("Import was successful.\n" + JSON.stringify(response, null, 2));
				})
				.catch(function (error) {
					console.log(error.response)
					alert('Import was not successful.\n' + JSON.stringify(error.response.data, null, 2));
				});
			}
		});
		this.showRerender();
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
				<br></br>
		  { this.props.is_admin ? (
				<div>
					<Row>
						<Col><Button color="success" onClick={ this.showCreateForm }>Add Model +</Button></Col>
						<Col>	
							<Card>
								<Form onSubmit={this.handleImport} >
									<FormGroup>
										<Input type="file" name="file" onChange={this.handleFileUpload}/>{' '}
									</FormGroup>
									<Button>Import</Button>{' '}
								</Form>
							</Card>
						</Col>
						
						<Col></Col>
						<Col></Col>
					</Row>
					
				</div> ) : (<p></p>)}
		  
				<br></br>
         <Table hover striped>
            <tbody>
               <tr>{this.renderTableHeader()}</tr>
               { this.renderTableData() }
            </tbody>
         </Table>
      </div>
   )
  }
}

ModelTable.propTypes = {
  models: PropTypes.array.isRequired
}

export default ModelTable
