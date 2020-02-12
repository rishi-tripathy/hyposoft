import React, {Component} from 'react'
import axios from 'axios'
import Select from 'react-select';
import {Button, Form, FormGroup, Input, Row, Col} from "reactstrap";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ModelSort extends Component {

  constructor() {
    super();
    this.state = {
      sortableOptions: [],
      selectedSortableOptions: [],
    }
  }

  mountSortables = () => {
    let dst = '/api/models/sorting_fields/';
    axios.get(dst).then(res => {
      let myOptions = [];
      for (let i = 0; i < res.data.sorting_fields.length; i++) {
        myOptions.push({value: res.data.sorting_fields[i], label: res.data.sorting_fields[i] + ' ↑'});
        myOptions.push({value: '-' + res.data.sorting_fields[i], label: res.data.sorting_fields[i] + ' ↓'});
      }
      console.log(res.data)
      this.setState({
        sortableOptions: myOptions,
      });
    })
      .catch(function (error) {
        // TODO: handle error
        console.log(error.response);
      });
  }

  componentDidMount() {
    this.mountSortables();
  }

  handleChangeSortable = (opt) => {
    this.setState({selectedSortableOptions: opt});
  }

  createQuery = () => {
    let arr = this.state.selectedSortableOptions;
    let q = 'ordering=';
    for (let i = 0; i < arr.length; i++) {
      q = q + arr[i].value + ',';
    }
    // take off the last &
    q = q.slice(0, -1);
    return q;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(this.state.selectedSortableOptions);
    // console.log(this.createQuery());
    this.props.sendSortQuery(this.createQuery());
  }

  render() {
    return (
      <div>

        <Form onSubmit={this.handleSubmit}>
          <h4>Sorting</h4>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Select
                  value={this.state.selectedSortableOptions}
                  onChange={this.handleChangeSortable}
                  options={this.state.sortableOptions}
                  searchable={true}
                  clearable={true}
                  isMulti={true}/>
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Input type="submit" value="Apply Sort"/>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default ModelSort
