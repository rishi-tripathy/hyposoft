import React, { Component } from 'react'
import RacksView from './RacksView';

export class RackController extends Component {

  state = {
    results: [
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
    
    // initializeNumberArray(){
    //   var array = [];

    //   for (var i = 43; i > 0; i--) {
    //     array.push(i);
    //   }

    //   return array;
    // }

  render() {
    let numberArray = [];
     
    //for rendering multiple racks, map the arr and return multiple RackViews 

    return <RacksView rack={this.state.results[0]} />
  }
}

export default RackController