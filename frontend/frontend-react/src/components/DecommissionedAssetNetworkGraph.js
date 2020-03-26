import React, { Component } from 'react'
import { Graph } from "react-d3-graph";
import {
  Typography, Paper,
  Grid, TextField
} from "@material-ui/core";

const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    "maxZoom": 4,
    "minZoom": 0.1,
    "focusAnimationDuration": 0.75,
    "focusZoom": 1,
    color: "lightgreen",
    size: 500,
    highlightStrokeColor: "blue",
  },
  link: {
    highlightColor: "lightblue",
  },
};

export class DecommissionedAssetNetworkGraph extends Component {

  constructor() {
    super();
    this.state = {
      data: {
        nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
        links: [{ source: "Harry", target: "Sally" }, { source: "Harry", target: "Alice" }],
        focusedNodeId: "Harry",
      }
    }
  }

  loadData = () => {
    if (this.props.asset) {
      let dataObject = Object.assign({}, this.props.asset.network_graph.data)
      this.setState({
        data: dataObject
      })
    }
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.asset !== this.props.asset) {
      this.loadData();
    }
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <Paper>
          <Grid container spacing={3}>
            <Graph
              id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
              data={this.state.data}
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

export default DecommissionedAssetNetworkGraph
