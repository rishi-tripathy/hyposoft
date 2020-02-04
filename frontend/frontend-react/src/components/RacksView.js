import React, { Component } from 'react'
import ReactDOMServer from 'react-dom'
import '../stylesheets/RacksView.css'
import '../stylesheets/RackTable.css'
import '../stylesheets/Printing.css'
import RackTable from './RackTable'
import * as jsPDF from 'jspdf'
import axios from 'axios'
import { Button } from 'reactstrap'
import ButtonToolbar from "reactstrap/es/ButtonToolbar";
import ButtonGroup from "reactstrap/es/ButtonGroup";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class RacksView extends Component {
    //rack isn't variable/no other API endpoint for individual rack

    constructor() {
        super();
        this.state = {
            condensedView: false,
        }
        this.showCreateForm = this.showCreateForm.bind(this);
        this.showMassCreateForm = this.showMassCreateForm.bind(this);
        this.showMassDeleteForm = this.showMassDeleteForm.bind(this);
        this.showEditForm = this.showEditForm.bind(this);        this.showAllRacks = this.showAllRacks.bind(this);
	}

    showCreateForm = () => {
		this.props.sendShowCreate(true);
   }
   
   showMassCreateForm = () => {
       this.props.sendShowMassCreate(true);
   }

   showMassDeleteForm = () => {
       this.props.sendShowMassDelete(true);
   }
      
   showEditForm = (id) => {
  // console.log("in edit");
   // console.log(id);
    this.props.sendShowEdit(true);
    this.props.sendEditID(id);
 }

 showDeleteForm = (id) => {
    // console.log("in delete");
    // console.log(id);
      if (window.confirm('Are you sure you want to delete?')) {
          let dst = '/api/racks/'.concat(id).concat('/');
          axios.delete(dst)
          .then(function (response) {
              alert('Delete was successful');
          })
          .catch(function (error) {
              alert('Delete was not successful.\n' + JSON.stringify(error.response.data));
          });
      }
  }

  handleCondensation = () => {
    this.setState({condensedView: true});
  }

  handleCondensationOff = () => {
      this.setState({condensedView: false});
  }

  showAllRacks = () => {
      this.props.sendShowAllRacks(true);
  }

    render(){
        return(
            <div>
            <div id='hideOnPrint'>
            <ButtonToolbar>
                <ButtonGroup>
                    <Button color='success' size="sm" onClick={ this.showCreateForm }>Add Single Rack +</Button>{' '}
                    <Button color='success' size="sm" onClick={ this.showMassCreateForm }>Add Multiple Racks ++</Button>{' '}
                </ButtonGroup>
                    <Button color='danger' size="sm" onClick={ this.showMassDeleteForm }>Delete Multiple Racks --</Button>{' '}
                    <ButtonGroup>
                        <Button size="sm" onClick={ this.handleCondensation }>Condensed Rack View</Button>{' '}
                        <Button size="sm" onClick={ this.handleCondensationOff }>Full Rack View</Button>{' '}
                        <Button size="sm" onClick={ this.showAllRacks }>Show All Racks</Button>{' '}
                    </ButtonGroup>
            </ButtonToolbar>
            </div>
                    <br></br>
                        <h1>Racks</h1>
                        { this.props.rack.map((item, key) =>
                        <div id="rackContainer">
                            <div id='hideOnPrint'>
                                <Button color="warning" size="sm" onClick={ () => this.showEditForm(item.id) }>Edit this Rack</Button>{' '}
                                <Button color="danger" size="sm" onClick={ () => this.showDeleteForm(item.id) }>Delete this Rack</Button>{' '}
                            </div>
                            <br></br>
                            <br></br>
                            <RackTable rack={item} condensedState={this.state.condensedView} />    
                        </div>  
                )}
            </div>
        )
    }
}
export default RacksView