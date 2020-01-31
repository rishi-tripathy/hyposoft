import React, { Component, Fragment } from 'react'
import '../stylesheets/RacksView.css'
import '../stylesheets/RackTable.css'
import RackTable from './RackTable'
import RackRow from './RackRow'
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class RacksView extends Component {
    //rack isn't variable/no other API endpoint for individual rack

    render(){
        console.log("in racks view");
        console.log(this.props.rack);

        return(
            <div id="table1">
                <RackTable rack={this.props.rack} />
            </div>
        )
    }
}
export default RacksView