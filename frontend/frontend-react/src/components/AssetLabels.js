import React, { Component } from 'react'
import ReactToPrint from 'react-to-print';
import {
  Grid, Button, Container, Paper,
  ButtonGroup, Switch, FormControlLabel,
  Typography, Tooltip, IconButton, CircularProgress
} from "@material-ui/core"
import '../stylesheets/PrintingAssetLabels.css'

// fontOptions={this.state.fontOptions}
// font={this.state.font}
// textAlign={this.state.center}
// textPosition={this.state.textPosition}
// textMargin={this.state.textMargin}
// fontSize={this.state.fontSize}
// background={this.state.background}
// lineColor={this.state.lineColor}
// margin={this.state.margin}
// marginTop={this.state.marginTop}
// marginBottom={this.state.marginBottom}
// marginLeft={this.state.marginLeft}
// marginRight={this.state.marginRight}

// LABEL PARAMETERS
//height 18 -> fits 20

const labelHeight = 18
const labelWidth = 2.7
const textAlignPosition = 'left'

// 10 is default
const mTop = 5
const mBottom = 25
const mLeft = 32
const mRight = 48

export class AssetLabels extends Component {
  constructor() {
    super();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.prevProps.location.state.labelTable !== this.props.location.state.labelTable) {
  //     globalData = this.props.location.state.labelTable
  //   }
  // }

  // componentDidMount() {
  //   globalData = this.
  // }

  render() {
    //var React = require('react');
    var ReactDOM = require('react-dom');
    var Barcode = require('react-barcode');

    //ReactPDF.render(<MyDocument />, `${__dirname}/test.pdf`);
    return (
      <div>
        <Container maxwidth="xl">
          <ReactToPrint
            trigger={() => <Button variant="contained" color="primary" id="hideOnPrint">Print Asset Labels</Button>}
            content={() => this.componentRef}
          />
          <ComponentToPrint ref={el => (this.componentRef = el)} myData={this.props.location.state.labelTable}/>
        </Container>
      </div>
    )
  }
}

const myTableRowStyle = {
  //border: '1px solid black',
  textAlign: 'center',
  width: '10%'
};

const myTableStyle = {
  width: '50%', 
  //borderSpacing: '10mm 0mm'
}

class ComponentToPrint extends Component {

  constructor() {
    super();
    this.state = {
      labelTable: []
    }
  }

  componentDidMount() {
    this.loadLabelTable();
  }

  loadLabelTable = () => {
    this.setState({
      labelTable: this.props.myData
    })
    // this.setState({
    //   labelTable: [
    //     {
    //       one: 100000,
    //       two: 100001,
    //       three: 100002,
    //       four: 100003,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100000,
    //       two: 100001,
    //       three: 100002,
    //       four: 100003,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100000,
    //       two: 100001,
    //       three: 100002,
    //       four: 100003,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100000,
    //       two: 100001,
    //       three: 100002,
    //       four: 100003,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100000,
    //       two: 100001,
    //       three: 100002,
    //       four: 100003,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100000,
    //       two: 100001,
    //       three: 100002,
    //       four: 100003,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100000,
    //       two: 100001,
    //       three: 100002,
    //       four: 100003,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //     {
    //       one: 100004,
    //       two: 100005,
    //       three: 100006,
    //       four: 100007,
    //     },
    //   ]
    // })
  }

  renderTableData() {
    var ReactDOM = require('react-dom');
    var Barcode = require('react-barcode');
    return this.state.labelTable.map((row, index) => {
      const { one, two, three, four } = row //destructuring
      return (
        <tr>
          <td style={myTableRowStyle}>
            {
              one ? (
                <Barcode
                  value={one}
                  width={labelWidth}
                  height={labelHeight}
                  format={'CODE128C'}
                  text={'HypoSoft    ' + one}
                  textAlign={textAlignPosition}
                  margin={0}
                  marginTop={mTop}
                  marginBottom={mBottom}
                  marginLeft={mLeft}
                  marginRight={mRight}
                />
              ) : <div></div>
            }
          </td>
          <td style={myTableRowStyle}>
            {
              two ? (
                <Barcode
                  value={two}
                  width={labelWidth}
                  height={labelHeight}
                  format={'CODE128C'}
                  text={'HypoSoft    ' + two}
                  textAlign={textAlignPosition}
                  margin={0}
                  marginTop={mTop}
                  marginBottom={mBottom}
                  marginLeft={mLeft}
                  marginRight={mRight}
                />
              ) : <div></div>
            }
          </td>
          <td style={myTableRowStyle}>
            {
              three ? (
                <Barcode
                  value={three}
                  width={labelWidth}
                  height={labelHeight}
                  format={'CODE128C'}
                  text={'HypoSoft    ' + three}
                  textAlign={textAlignPosition}
                  margin={0}
                  marginTop={mTop}
                  marginBottom={mBottom}
                  marginLeft={mLeft}
                  marginRight={mRight}
                />
              ) : <div></div>
            }
          </td>
          <td style={myTableRowStyle}>
            {
              four ? (
                <Barcode
                  value={four}
                  width={labelWidth}
                  height={labelHeight}
                  format={'CODE128C'}
                  text={'HypoSoft    ' + four}
                  textAlign={textAlignPosition}
                  margin={0}
                  marginTop={mTop}
                  marginBottom={mBottom}
                  marginLeft={mLeft}
                  marginRight={mRight}
                />
              ) : <div></div>
            }
          </td>
        </tr>
      )
    })
  }

  render() {
    console.log(this.props)
    return (
      <table style={myTableStyle} >
        <thead>
          {/* <th>column 1</th>
          <th>column 2</th>
          <th>column 3</th>
          <th>column 4</th> */}
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </thead>
        <tbody>
          {this.renderTableData()}
        </tbody>
      </table>
    );
  }
}

export default AssetLabels
