import React, { Component } from 'react'
import PropTypes from 'prop-types';
import '../stylesheets/RackView.css'

export class RackView extends Component {


    render() {
        return(
            <div>
                <div id="LeftBar"> left</div> 
                <div id="CenterBar"> top</div>
                <div id="RightBar">right </div>
                <div id="BottomBar"> bottom </div>
            </div>
        )
    }
}

export default RackView