import React, { Component } from 'react'
import InstanceTable from './InstanceTable'
import axios from 'axios'
import DetailedInstance from './DetailedInstance';
import CreateInstanceForm from './CreateInstanceForm';
import EditInstanceForm from './EditInstanceForm';
import InstanceFilters from './InstanceFilters';
import InstanceSort from './InstanceSort';
import { UncontrolledCollapse, Button, ButtonGroup, Container, Card, ButtonToolbar, Row, Col } from 'reactstrap';
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
      sortQuery: '',
      rerender: false,
    };

    this.getShowTable = this.getShowTable.bind(this);
    this.getDetailedInstanceID = this.getDetailedInstanceID.bind(this);
    this.getFilterQuery = this.getFilterQuery.bind(this);
    //this.getRerender = this.getRerender.bind(this);
  }

  getRerender = (re) => {
    if (re) {
      this.setState({ rerender: true })
    }
  }

  getShowTable = (show) => {
    show ? this.setState({
      showTableView : true,
      // everything else false
      showIndividualInstanceView: false,
      showCreateView: false,
      showEditView: false,
    })
    : this.setState({
      showTableView : false,
    }) 
  }

  getShowDetailedInstance = (show) => {
    show ? this.setState({
      showIndividualInstanceView: true,
      // everything else false
      showTableView : false,
      showCreateView: false,
      showEditView: false,
    })
    : this.setState({
      showIndividualInstanceView : false,
    }) 
  }

  getShowCreate = (show) => {
    show ? this.setState({
      showCreateView : true,
      // everything else false
      showTableView: false,
      showIndividualInstanceView: false,
      showEditView: false,

    })
    : this.setState({
      showCreateView : false,
    }) 
  }

  getShowEdit = (show) => {
    show ? this.setState({
      showEditView: true,
      // everything else false
      showTableView: false,
      showIndividualInstanceView: false,
      showCreateView : false,
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

  getInstances = () => {
    let dst = '/api/instances/' + '?' + this.state.filterQuery + '&' + this.state.sortQuery;
    console.log('QUERY')
    console.log(dst)
    axios.get(dst).then(res => {
      // console.log(res.data.next)
      this.setState({ 
        instances: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  getAllInstances = () =>  {
    let filter = this.state.filterQuery;
    let sort = this.state.sortQuery;

    if (this.state.filterQuery.length !== 0) {
      filter = filter + '&';
    }

    if (this.state.sortQuery.length !== 0) {
      sort = sort + '&'
    }

    let dst = '/api/instances/' + '?' + filter + sort + 'show_all=true';
    
    console.log('QUERY')
    console.log(dst)
    axios.get(dst).then(res => {
      // console.log(res.data.next)
      this.setState({ 
        instances: res.data,
        prevPage: null,
        nextPage: null,
      });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  getFilterQuery = (q) => {
    this.setState({ filterQuery: q });
  }

  getSortQuery = (q) => {
    this.setState({ sortQuery: q })
    console.log(this.state.sortQuery);
  }

  componentDidMount() {
    this.getInstances();
  }

  componentDidUpdate(prevProps, prevState) {

    // When showing table again, rerender
    if (prevState.showTableView === false && this.state.showTableView === true) {
      this.getInstances();
    }

    // Once filter changes, rerender
    if (prevState.filterQuery !== this.state.filterQuery) {
      this.getInstances();
    }

    // Once sort changes, rerender
    if (prevState.sortQuery !== this.state.sortQuery) {
      this.getInstances();
    }

    // After crud, rerender
    if (prevState.rerender === false && this.state.rerender === true) {
      this.getInstances();
      this.setState({ rerender: false });
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
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
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
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  exportData = () => {
    let filter = this.state.filterQuery;
    let sort = this.state.sortQuery;

    if (this.state.filterQuery.length !== 0) {
      filter = filter + '&';
    }

    if (this.state.sortQuery.length !== 0) {
      sort = sort + '&'
    }

    let dst = '/api/instances/' + '?' + filter + sort + 'export=true';
    console.log('exporting to:  ' + dst);
    const FileDownload = require('js-file-download');
    axios.get(dst).then(res => {
      // console.log(res.data.next)
      FileDownload(res.data, 'instance_export.csv');
      alert("Export was successful.");
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Export was not successful.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }


  render() {
    let content;

    if (this.state.showTableView) {
      content = <InstanceTable 
                  instances={ this.state.instances } 
                  sendRerender={ this.getRerender }
                  sendShowTable={ this.getShowTable } 
                  sendShowDetailedInstance= { this.getShowDetailedInstance }
                  sendInstanceID={ this.getDetailedInstanceID }
                  sendShowCreate={this.getShowCreate }
                  sendShowEdit={this.getShowEdit }
                  sendEditID={this.getEditID } 
                  is_admin={this.props.is_admin}/>;
    }
    else if (this.state.showIndividualInstanceView) {
      content = <DetailedInstance instanceID={ this.state.detailedInstanceID }
                                  sendShowTable={ this.getShowTable }  /> ;
    }
    else if (this.state.showCreateView) {
      content = <CreateInstanceForm sendRerender={ this.getRerender }
                                    sendShowTable={this.getShowTable } />
    }
    else if (this.state.showEditView) {
      content = <EditInstanceForm editID={this.state.editID} 
                  sendRerender={ this.getRerender }
                  sendShowTable={ this.getShowTable } 
                  sendShowCreate={this.getShowCreate }
                  sendShowEdit={this.getShowEdit } />
    }

    let paginateNavigation = <p></p>;
    if (this.state.prevPage == null && this.state.nextPage != null) {
      paginateNavigation = <div><ButtonGroup><Button color="link" disabled>prev page</Button>{'  '}<Button color="link" onClick={ this.paginateNext }>next page</Button></ButtonGroup></div>;
    }
    else if (this.state.prevPage != null && this.state.nextPage == null) {
    paginateNavigation = <div><ButtonGroup><Button color="link" onClick={ this.paginatePrev }>prev page</Button>{'  '}<Button color="link" disabled>next page</Button></ButtonGroup></div>;
    }
    else if (this.state.prevPage != null && this.state.nextPage != null) {
      paginateNavigation = <div><ButtonGroup><Button color="link" onClick={ this.paginatePrev }>prev page</Button>{'  '}<Button color="link" onClick={ this.paginateNext }>next page</Button></ButtonGroup></div>;
    }

    let filters_sorts = <div><Button color="primary" id="toggler" style={{ marginBottom: '1rem' }}> Toggle Filtering and Sorting Dialog </Button>
      <UncontrolledCollapse toggler="#toggler">
        <InstanceFilters sendFilterQuery={ this.getFilterQuery } />
        <InstanceSort sendSortQuery={ this.getSortQuery } />
     </UncontrolledCollapse>{' '}
    </div>;

    // let filters = <InstanceFilters sendFilterQuery={ this.getFilterQuery } />
    // let sorting = <InstanceSort sendSortQuery={ this.getSortQuery } />
    let exp = <Button onClick={ this.exportData } >Export</Button>
    let showAll = <Button onClick={this.getAllInstances } >Show All</Button>

    // if we're not on the table, then don't show pagination or filters or sorting
    if (! this.state.showTableView) {
      paginateNavigation = <p></p>;
      filters_sorts = <p></p>;
      // filters = <p></p>;
      // sorting = <p></p>;
      showAll = <p></p>;
      exp = <p></p>;
    }

    return (
      <Container className="themed-container">
        <h2>Instances</h2>
        <Row>
          <Col>{ filters_sorts }</Col>
        </Row>
        <Row>
          <Col>{ showAll }</Col>
          <Col>{ exp }</Col>
          <Col>{ paginateNavigation }</Col>
          <Col></Col>
        </Row>
        {content}
      </Container>
    )
  }
}

export default InstanceController