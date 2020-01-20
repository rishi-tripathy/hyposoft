import React, { Component } from 'react'
import PropTypes from 'prop-types';
import '../stylesheets/RackView.css'

export class RackView extends Component {


    render() {
        return(
            <div id="ParentElement">
                <div id="CenterBar"> B12 </div>
                <div id="LeftBar">  
                    42 41 40 39 38 37 36 35 34 33 32 31 30 29 28 27
                    26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11
                    10 9 <br></br>8 <br></br>7 <br></br>6 <br></br>5 <br></br>4 
                    <br></br>3 <br></br>2 <br></br> 1 <br></br> 0      
                </div> 
                <div id="RightBar">
                    42 41 40 39 38 37 36 35 34 33 32 31 30 29 28 27
                    26 25 24 23 22 21 20 19 18 17 16 15 14 13 12 11
                    10 9 <br></br>8 <br></br>7 <br></br>6 <br></br>5 <br></br>4 
                    <br></br>3 <br></br>2 <br></br> 1 <br></br> 0
                    </div>
                <div id="BottomBar"> B12 </div>

            </div>
        )
    }
}

export default RackView