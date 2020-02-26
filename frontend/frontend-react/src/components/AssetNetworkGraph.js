import React, { Component } from 'react'
import { Graph } from "react-d3-graph";
import axios from 'axios'
import {
  Typography, Paper,
  Grid, TextField
} from "@material-ui/core";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

// graph payload (with minimalist structure)
const data = {
  nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
  links: [{ source: "Harry", target: "Sally" }, { source: "Harry", target: "Alice" }],
  focusedNodeId: "Harry",
};

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    color: "lightgreen",
    size: 500,
    highlightStrokeColor: "blue",
  },
  link: {
    highlightColor: "lightblue",
  },
};

export class AssetNetworkGraph extends Component {

  constructor() {
    super();
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    let dst = '/api/assets/'.concat(this.props.assetID).concat('/network_graph/');
    axios.get(dst).then(res => {
      this.setState({
        data: res.data
      });
    })
      .catch(function (error) {
        // TODO: handle error
        alert('Cannot load graph. Re-login.\n' + JSON.stringify(error.response, null, 2));
      });
  }

  render() {
    return (
      <div>
        <Paper>
          <Grid container spacing={3}>
            <Graph
              id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
              data={data}
              config={myConfig}
            // onClickNode={onClickNode}
            // onRightClickNode={onRightClickNode}
            // onClickGraph={onClickGraph}
            // onClickLink={onClickLink}
            // onRightClickLink={onRightClickLink}
            // onMouseOverNode={onMouseOverNode}
            // onMouseOutNode={onMouseOutNode}
            // onMouseOverLink={onMouseOverLink}
            // onMouseOutLink={onMouseOutLink}
            // onNodePositionChange={onNodePositionChange}
            />
          </Grid>
        </Paper>
      </div>
    )
  }
}

export default AssetNetworkGraph
