import React, { Component, Fragment } from 'react'
import '../stylesheets/RacksView.css'
import '../stylesheets/RackTable.css'
import RackTable from './RackTable'
import RackRow from './RackRow'
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class RacksView extends Component {
    //rack isn't variable/no other API endpoint for individual rack

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

    render(){
        console.log("in racks view");
        console.log(this.props.rack);

        return(
            <div>
            <p>gonna put filters and stuff here</p>
            <button onClick={ this.showCreateForm }>Add</button>
            
                { this.props.rack.map((item, key) =>
                <div id="rackContainer">
                    <RackTable rack={item} />
                    </div> 
                )}
            </div>
        )
    }
}
export default RacksView