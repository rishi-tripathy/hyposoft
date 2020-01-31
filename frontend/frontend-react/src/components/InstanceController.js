import React, { Component } from 'react'
import InstanceTable from './InstanceTable'
import axios from 'axios'
import DetailedInstance from './DetailedInstance';
import CreateInstanceForm from './CreateInstanceForm';
import EditInstanceForm from './EditInstanceForm';
import InstanceFilters from './InstanceFilters';
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class InstanceController extends Component {


  constructor() {
    super();
    this.state = {
      instances: [ {}
        // {
        //   id: 99,
        //   model: 'default',
        //   hostname: 'default',
        // }
      ],
      showTableView: true,
      showIndividualInstanceView: false,
      detailedInstanceID: 0,
      showCreateView: false,
      showEditView: false,
      prevPage: null,
      nextPage: null,
      filterQuery: '',
    };

    this.getShowTable = this.getShowTable.bind(this);
    this.getDetailedInstanceID = this.getDetailedInstanceID.bind(this);
    this.getFilterQuery = this.getFilterQuery.bind(this);
  }

  getShowTable = (show) => {
    show ? this.setState({
      showTableView : true,
      showIndividualInstanceView: false
    })
    : this.setState({
      showTableView : false,
      showIndividualInstanceView: true
    }) 
  }

  getShowCreate = (show) => {
    show ? this.setState({
      showTableView: false,
      showIndividualInstanceView: false,
      showCreateView : true,
      showEditView: false,
      showDeleteView: false,
    })
    : this.setState({
      showCreateView : false,
    }) 
  }

  getShowEdit = (show) => {
    show ? this.setState({
      showTableView: false,
      showIndividualInstanceView: false,
      showCreateView : false,
      showEditView: true,
      showDeleteView: false,
    })
    : this.setState({
      showEditView : false,
    }) 
  }

  getEditID = (id) => {
    this.setState({
      editID: id,
    });
  }

  getDetailedInstanceID = (id) => {
    this.setState({ detailedInstanceID: id});
  }

  getInstances() {
    console.log('retrieving instnaces')
    let dst = '/api/instances/' + this.state.filterQuery;
    axios.get(dst).then(res => {
      console.log(res.data.next)
      this.setState({ 
        instances: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }

  getFilterQuery = (q) => {
    this.setState({
      filterQuery: q,
    });
    console.log(this.state.filterQuery);
  }

  componentDidMount() {
    this.getInstances();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.filterQuery !== this.state.filterQuery) {
      console.log('instnace controller update')
      this.getInstances();
    }
    
  }

  paginateNext = () => {
    axios.get(this.state.nextPage).then(res => {
      this.setState({ 
        instances: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }

  paginatePrev = () => {
    axios.get(this.state.prevPage).then(res => {
      this.setState({ 
        instances: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }


  render() {
    let content;

    if (this.state.showTableView) {
      content = <InstanceTable 
                  instances={ this.state.instances } 
                  sendShowTable={ this.getShowTable } 
                  sendInstanceID={ this.getDetailedInstanceID }
                  sendShowCreate={this.getShowCreate }
                  sendShowEdit={this.getShowEdit }
                  sendEditID={this.getEditID } />;
    }
    else if (this.state.showIndividualInstanceView) {
      content = <DetailedInstance instanceID={ this.state.detailedInstanceID } /> ;
    }
    else if (this.state.showCreateView) {
      content = <CreateInstanceForm sendShowTable={this.getShowTable } />
    }
    else if (this.state.showEditView) {
      content = <EditInstanceForm editID={this.state.editID} 
                  sendShowTable={ this.getShowTable } 
                  sendShowCreate={this.getShowCreate }
                  sendShowEdit={this.getShowEdit } />
    }

    let paginateNavigation = <p></p>;
    if (this.state.prevPage == null && this.state.nextPage != null) {
      paginateNavigation = <div><button onClick={ this.paginateNext }>next page</button></div>;
    } 
    else if (this.state.prevPage != null && this.state.nextPage == null) {
      paginateNavigation = <div><button onClick={ this.paginatePrev }>prev page</button></div>;
    }
    else if (this.state.prevPage != null && this.state.nextPage != null) {
      paginateNavigation = <div><button onClick={ this.paginatePrev }>prev page</button><button onClick={ this.paginateNext }>next page</button></div>;
    }

    let filters = <InstanceFilters sendFilterQuery={ this.getFilterQuery } />

    // if we're not on the table, then don't show pagination
    if (! this.state.showTableView) {
      paginateNavigation = <p></p>;
      filters = <p></p>;
    }

    return (
      <div>
        { filters }
        <br></br>
        { paginateNavigation }
        <br></br>
        { content }
      </div>
    )
  }
}

export default InstanceController