import React, { Component } from 'react'
import '../stylesheets/RacksView.css'
import '../stylesheets/RackTable.css'
import RackTable from './RackTable'
import RackRow from './RackRow'
import ReactToPrint from 'react-to-print';
import axios from 'axios'
import PrintableRacks from './PrintableRacks'
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

  printOrder = (rack) => {
    console.log('printing')
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    console.log(rack)

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.getElementById("rackContainer").innerHTML);
    mywindow.document.write('</body></html>');

  //  mywindow.document.close(); // necessary for IE >= 10
    //mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
   // mywindow.close();

    return true;
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
<<<<<<< HEAD
            <button onClick={ () => this.printOrder(this.state.rack) }>Print Racks</button>;
            <br></br>
=======
            <button onClick={ this.handleCondensation }>Condensed Rack View</button>
            <button onClick={ this.handleCondensationOff }>Full Rack View</button>
            <br></br>
                
            <p>gonna put filters and stuff here</p>
>>>>>>> 0b85f24f6d003da47ba039ff9d8cad5d679b2670
                { this.props.rack.map((item, key) =>
                <div id="rackContainer">
                    <button onClick={ () => this.showEditForm(item.id) }>Edit this Rack</button>
                    <button onClick={ () => this.showDeleteForm(item.id) }>Delete this Rack</button>
<<<<<<< HEAD
                    <div id="print">
                        <RackTable rack={item} /> 
                    </div>                   
=======
                    <br></br>
                    <RackTable rack={item} condensedState={this.state.condensedView} />                    
>>>>>>> 0b85f24f6d003da47ba039ff9d8cad5d679b2670
                    </div> 
                )}
            </div>
        )
    }
}
export default RacksView