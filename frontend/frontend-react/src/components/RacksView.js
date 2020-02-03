import React, { Component } from 'react'
import ReactDOMServer from 'react-dom'
import '../stylesheets/RacksView.css'
import '../stylesheets/RackTable.css'
import RackTable from './RackTable'
import * as jsPDF from 'jspdf'
import axios from 'axios'
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
        this.showEditForm = this.showEditForm.bind(this);
        this.showEditForm = this.showEditForm.bind(this);
        this.showCondensedView = this.showEditForm.bind(this);
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

  generatePDF = () => {
    let doc = new jsPDF('landscape');
    doc.fromHTML(ReactDOMServer.renderToStaticMarkup(<RackTable rack={this.props.rack[0]} />));
    doc.save("pdf");
 }

  handleCondensation = () => {
    this.setState({condensedView: true});
  }

  handleCondensationOff = () => {
      this.setState({condensedView: false});
  }

    render(){
        return(
            <div>
            <button onClick={ this.showCreateForm }>Add Single Rack</button>
            <button onClick={ this.showMassCreateForm }>Add Multiple Racks</button>
            <button onClick={ this.showMassDeleteForm }>Delete Multiple Racks</button>
            <button onClick={ this.generatePDF }>Print Racks</button>
            <br></br>
                { this.props.rack.map((item, key) =>
                <div id="rackContainer">
                    <button onClick={ () => this.showEditForm(item.id) }>Edit this Rack</button>
                    <button onClick={ () => this.showDeleteForm(item.id) }>Delete this Rack</button>
                    <div id="print">
                        <RackTable rack={item} /> 
                    </div>                   
                    <br></br>
                    <RackTable rack={item} condensedState={this.state.condensedView} />                    
                    </div> 
                )}
            </div>
        )
    }
}
export default RacksView