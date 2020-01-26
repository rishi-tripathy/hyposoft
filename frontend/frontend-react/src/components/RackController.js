import React, { Component } from 'react'
import RacksView from './RacksView';
import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class RackController extends Component {

  constructor() {
    super();

    this.state = {
      racks: [],
      count: 0
    };
  }
    
  getRacks() {
    axios.get('/api/racks/?page=2').then(res => {
      // /api/racks/ does not get all in pagination -- ask them 

      const rackList = res.data.results;
      this.setState({ racks: rackList });
     // const rackListLength = res.data.count;

      if (rackList[0] == null) {
        console.log('rack[0] is null');
        return;
      }
    });
  }

  componentDidMount() {
    this.getRacks();
  }

  render() { 
    if (this.state.racks[0] == null) {
      return <p> No Racks Exist </p>

    } else {
     // console.log(this.state.racks);
     console.log(this.state.racks);
    console.log("we have racks 2 pass");

    let racks = this.state.racks;

    return(
        <RacksView rack={racks} /> 
    )
    }
  }
}

export default RackController