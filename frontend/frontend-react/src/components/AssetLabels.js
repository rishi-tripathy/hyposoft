import React, { Component } from 'react'
import ReactToPrint from 'react-to-print';


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
const labelHeight = 50
const labelWidth = 4
const textAlignPosition = 'left'

export class AssetLabels extends Component {
  constructor() {
    super();
  }

  render() {
    //var React = require('react');
    var ReactDOM = require('react-dom');
    var Barcode = require('react-barcode');

    //ReactPDF.render(<MyDocument />, `${__dirname}/test.pdf`);
    return (
      <div>
        <p>asset labels</p>

        {/* <PDFViewer>
          <MyDocument />
        </PDFViewer> */}
        <ReactToPrint
          trigger={() => <a href="#">Print this out!</a>}
          content={() => this.componentRef}
        />
        <ComponentToPrint ref={el => (this.componentRef = el)} />
      </div>
    )
  }
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
      labelTable: [
        {
          one: 100000,
          two: 100001,
          three: 100002,
          four: 100003,
        },
        {
          one: 100004,
          two: 100005,
          three: 100006,
          four: null,
        }
      ]
    })
  }

  renderTableData() {
    var ReactDOM = require('react-dom');
    var Barcode = require('react-barcode');
    return this.state.labelTable.map((row, index) => {
      const { one, two, three, four } = row //destructuring
      return (
        <tr>
          <td>
            {
              one ? (
                <Barcode
                  value={one}
                  width={labelWidth}
                  height={labelHeight}
                  format={'CODE128C'}
                  text={'HypoSoft    ' + one}
                  textAlign={textAlignPosition}
                />
              ) : <div></div>
            }
          </td>
          <td>
            {
              two ? (
                <Barcode
                  value={two}
                  width={labelWidth}
                  height={labelHeight}
                  format={'CODE128C'}
                  text={'HypoSoft    ' + two}
                  textAlign={textAlignPosition}
                />
              ) : <div></div>
            }
          </td>
          <td>
            {
              three ? (
                <Barcode
                  value={three}
                  width={labelWidth}
                  height={labelHeight}
                  format={'CODE128C'}
                  text={'HypoSoft    ' + three}
                  textAlign={textAlignPosition}
                />
              ) : <div></div>
            }
          </td>
          <td>
            {
              four ? (
                <Barcode
                  value={four}
                  width={labelWidth}
                  height={labelHeight}
                  format={'CODE128C'}
                  text={'HypoSoft    ' + four}
                  textAlign={textAlignPosition}
                />
              ) : <div></div>
            }
          </td>
        </tr>
      )
    })
  }

  render() {

    return (
      <table>
        <thead>
          <th>column 1</th>
          <th>column 2</th>
          <th>column 3</th>
          <th>column 4</th>
        </thead>
        <tbody>
          {this.renderTableData()}
        </tbody>
      </table>
    );
  }
}

export default AssetLabels
