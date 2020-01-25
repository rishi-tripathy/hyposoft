import React, { Component } from 'react'
import RacksView from './RacksView';
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class RackController extends Component {

  state = {
    racks: [
      {
          "id": 1,
          "rack_number": "B12",
          "u1": null,
          "u2": null,
          "u3": null,
          "u4": null,
          "u5": 1,
          "u6": null,
          "u7": null,
          "u8": null,
          "u9": null,
          "u10": null,
          "u11": 'im a rack',
          "u12": null,
          "u13": null,
          "u14": null,
          "u15": null,
          "u16": null,
          "u17": null,
          "u18": null,
          "u19": null,
          "u20": null,
          "u21": null,
          "u22": null,
          "u23": null,
          "u24": null,
          "u25": null,
          "u26": null,
          "u27": null,
          "u28": null,
          "u29": null,
          "u30": null,
          "u31": null,
          "u32": null,
          "u33": null,
          "u34": null,
          "u35": null,
          "u36": null,
          "u37": null,
          "u38": null,
          "u39": null,
          "u40": null,
          "u41": null,
          "u42": null
      }
  ]
    
  }
    
  componentDidMount() {
    axios.get('/api/racks/').then(res => {
      const r = res.data.results;
      this.setState({ racks: r });
      console.log("in axios")
    });
  }

  render() { 
    //for rendering multiple racks, map the arr and return multiple RackViews 
    console.log(this.state.racks);
    if (this.state.racks[0] == null) {
      return <p> No Racks Exist </p>

    } else {
     // console.log(this.state.racks);
      return <p>hey</p>//<RacksView rack={this.state.racks} />
    }
  }
}

export default RackController