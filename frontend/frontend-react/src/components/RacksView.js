import React, { Component } from 'react'
import ReactDOMServer from 'react-dom'
import '../stylesheets/RacksView.css'
import '../stylesheets/RackTable.css'
import '../stylesheets/Printing.css'
import RackTable from './RackTable'
import * as jsPDF from 'jspdf'
import axios from 'axios'
import html2canvas from 'html2canvas'
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

  generatePDF = () => {
    console.log("in generate")
    let doc = new jsPDF('landscape');
    let content = document.getElementById('print');
    console.log(doc);
    console.log(content);
    doc.fromHTML((<RackTable rack={this.props.rack[0]} />));
    html2canvas(content)
    .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        // pdf.output('dataurlnewwindow');
        pdf.save("download.pdf");
      });

    let pdf = new jsPDF();
    pdf.addJS(content);
    pdf.save('pdf');

 }

//  openNewTab = () => {
//     <RackTable rack={item} condensedState={this.state.condensedView} /> 
//  }


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
                    <button onClick={ this.showCreateForm }>Add Single Rack</button>
                    <button onClick={ this.showMassCreateForm }>Add Multiple Racks</button>
                    <button onClick={ this.showMassDeleteForm }>Delete Multiple Racks</button>
                    <button onClick={ this.showAllRacks }>Show All Racks</button>
                </div>
            <br></br>
                { this.props.rack.map((item, key) =>
                <div id="rackContainer">
                    <div id='hideOnPrint'>
                        <button onClick={ () => this.showEditForm(item.id) }>Edit this Rack</button>
                        <button onClick={ () => this.showDeleteForm(item.id) }>Delete this Rack</button> 
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