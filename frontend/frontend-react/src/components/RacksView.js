import React, { Component, Fragment } from 'react'
import '../stylesheets/RackTable.css'
import RackTable from './RackTable'
import RackRow from './RackRow'

export class RacksView extends Component {
    //some api call that gets how many racks to display

    render(){
        return(
            <div id="rackContainer">
                <h1 id="title">
                    Racks 
                </h1>
                <RackTable rack={this.props.rack} />
            </div>
        )
    }
}
export default RacksView