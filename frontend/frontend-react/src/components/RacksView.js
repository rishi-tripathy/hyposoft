import React, { Component, Fragment } from 'react'
import '../stylesheets/RacksView.css'
import '../stylesheets/RackTable.css'
import RackTable from './RackTable'
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class RacksView extends Component {
    //rack isn't variable/no other API endpoint for individual rack

    constructor() {
	    super();
        this.showCreateForm = this.showCreateForm.bind(this);
        this.showMassCreateForm = this.showMassCreateForm.bind(this);
        this.showEditForm = this.showEditForm.bind(this);
        this.showEditForm = this.showEditForm.bind(this);
	}

    showCreateForm = () => {
		this.props.sendShowCreate(true);
   }
   
   showMassCreateForm = () => {
       this.props.sendShowMassCreate(true);
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

      //this.props.sendShowDelete(true);
  }

    render(){
        return(
            <div>
                
            <p>gonna put filters and stuff here</p><button onClick={ this.showCreateForm }>Add Single Rack</button>
            <button onClick={ this.showMassCreateForm }>Add Multiple Racks</button>
                { this.props.rack.map((item, key) =>
                <div id="rackContainer">
                    {/* {console.log(item.id)} */}
                    <button onClick={ () => this.showEditForm(item.id) }>Edit this Rack</button>
                    <button onClick={ () => this.showDeleteForm(item.id) }>Delete this Rack</button>
                    <RackTable rack={item} />                    
                    </div> 
                )}
            </div>
        )
    }
}
export default RacksView