import React, { Component } from 'react'
import ModelTable from './ModelTable'
import CreateModelForm from './CreateModelForm'
import axios from 'axios'
import EditModelForm from './EditModelForm';
import ModelFilters from './ModelFilters';
import ModelSort from './ModelSort';
import DetailedModel from './DetailedModel';
import { UncontrolledCollapse, Button, ButtonGroup, Container, Card, ButtonToolbar, Row, Col } from 'reactstrap';
import RackFilters from "./RackFilters";

axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class ModelController extends Component {
  constructor() {
    super();
    this.state = {
      models: [ {}
        // {
        //   'id': 99,
        //   'vendor': 'default',
        //   'model_number': 'default',
        //   'height': 2,
        //   'display_color': 'Red',
        //   'ethernet_ports': 1,
        //   'power_ports': 1,
        //   'cpu': 'Intel CPU',
        //   'memory': 3,
        //   'storage': 'Lots of Raid',
        //   'comment': 'First Model'
        // }
      ],
      showTableView: true,
      showIndividualModelView: false,
      showCreateView: false,
      showEditView: false,
      editID: 0,
      deleteID: 0,
      prevPage: null,
      nextPage: null,
      filterQuery: '',
      sortQuery: '',
      rerender: false,
    };

    // I don't think i need this bind here; but too scared to take it out lol
    this.getShowTable = this.getShowTable.bind(this);
  }

  getRerender = (re) => {
    if (re) {
      this.setState({ rerender: true })
    }
  }

  getDetailedModelID = (id) => {
    this.setState({ detailedModelID: id});
  }
  

  getShowTable = (show) => {
    show ? this.setState({
      showTableView: true,
      // everything else false
      showIndividualModelView: false,
      showCreateView : false,
      showEditView: false,
    })
    : this.setState({
      showTableView : true,
    }) 
  }

  getShowDetailedModel = (show) => {
    show ? this.setState({
      showIndividualModelView: true,
      // everything else false
      showTableView: false,
      showCreateView : false,
      showEditView: false,
    })
    : this.setState({
      showIndividualModelView: false,
    }) 
  }

  getShowCreate = (show) => {
    show ? this.setState({
      showCreateView : true,
      // everything else false
      showTableView: false,
      showIndividualModelView: false,
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
      showCreateView : false,
      showIndividualModelView: false,
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

  getFilterQuery = (q) => {
    this.setState({ filterQuery: q });
    console.log(this.state.filterQuery);
  }

  getSortQuery = (q) => {
    this.setState({ sortQuery: q })
    console.log(this.state.sortQuery);
  }

  componentDidMount() {
    this.getModels();
  }

  componentDidUpdate(prevProps, prevState) {
    const delay = 50;

    // When showing table again, rerender
    if (prevState.showTableView === false && this.state.showTableView === true) {
      setTimeout(() => {
        this.getModels();
      }, delay); 
    }
    
    // Once filter changes, rerender
    if (prevState.filterQuery !== this.state.filterQuery) {
      setTimeout(() => {
        this.getModels();
      }, delay); 
    }

    // Once sort changes, rerender
    if (prevState.sortQuery !== this.state.sortQuery) {
      setTimeout(() => {
        this.getModels();
      }, delay); 
    }

    // After crud, rerender
    if (prevState.rerender === false && this.state.rerender === true) {
      setTimeout(() => {
        this.getModels();
        this.setState({ rerender: false });
      }, delay); 
      
    }
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

    let dst = '/api/models/' + '?' + filter + sort + 'export=true';
    console.log('exporting to:  ' + dst);
    const FileDownload = require('js-file-download');

    axios.get(dst).then(res => {
      // console.log(res.data.next)
      FileDownload(res.data, 'model_export.csv');
      alert("Export was successful.");
    })
    .catch(function (error) {
      alert('Export was not successful.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  getModels = () => {
    let dst = '/api/models/' + '?' + this.state.filterQuery + '&' + this.state.sortQuery;
    console.log('QUERY')
    console.log(dst)
    axios.get(dst).then(res => {
      this.setState({ 
        models: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response, null, 2));
    });
    // setTimeout(function() {
      
    // }, 100); 
    
    
  }

  getAllModels = () => {
    let filter = this.state.filterQuery;
    let sort = this.state.sortQuery;

    if (this.state.filterQuery.length !== 0) {
      filter = filter + '&';
    }

    if (this.state.sortQuery.length !== 0) {
      sort = sort + '&'
    }

    let dst = '/api/models/' + '?' + filter + sort + 'show_all=true';
    
    console.log('QUERY')
    console.log(dst)
    axios.get(dst).then(res => {
      this.setState({ 
        models: res.data,
        prevPage: null,
        nextPage: null,
      });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  paginateNext = () => {
    axios.get(this.state.nextPage).then(res => {
      this.setState({ 
        models: res.data.results,
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
        models: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
    .catch(function (error) {
      // TODO: handle error
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
  }

  render() {
    let content;
    console.log('rerender')

    if (this.state.showTableView){
      content = <div><ModelTable models={ this.state.models }
                  sendRerender={ this.getRerender }
                  sendShowTable={ this.getShowTable }
                  sendShowDetailedModel={ this.getShowDetailedModel }
                  sendModelID={ this.getDetailedModelID }
                  sendShowCreate={this.getShowCreate}
                  sendShowEdit={this.getShowEdit}
                  sendEditID={this.getEditID} 
                  is_admin={this.props.is_admin}/></div>
    }
    else if (this.state.showIndividualModelView) {
      content = <DetailedModel modelID={ this.state.detailedModelID }
                              sendShowTable={ this.getShowTable } /> ;
    }
    else if (this.state.showCreateView){
        content = <CreateModelForm 
                    
                    sendShowTable={this.getShowTable} /> 
    }
    else if (this.state.showEditView){
        content= <EditModelForm editID={this.state.editID} 
                    sendShowTable={ this.getShowTable } 
                    sendShowCreate={this.getShowCreate}
                    sendShowEdit={this.getShowEdit} /> 
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
        <ModelFilters sendFilterQuery={ this.getFilterQuery } />
        <ModelSort sendSortQuery={ this.getSortQuery }/>
     </UncontrolledCollapse>{' '}
  </div>;

    let exp = <Button onClick={ this.exportData } >Export</Button>
    let showAll = <Button onClick={this.getAllModels } >Show All</Button>


//     let buttonToolbar =    	<div>
//       <h4>Model Table</h4>
//         <ButtonToolbar>
//                     <ButtonGroup>
//                       {paginateNavigation}{' '}
//                       {exp}{' '}
//                       {showAll}{' '}
//                     </ButtonGroup>
//             </ButtonToolbar>
// </div>;
    // if we're not on the table, then don't show pagination or filters or sort
    if (! this.state.showTableView) {
      paginateNavigation = <p></p>;
      filters_sorts = <p></p>;
      exp = <p></p>;
      showAll = <p></p>;
      //buttonToolbar = <p></p>
    }
  
    return (
      <Container className="themed-container">
        <h2>Models</h2>
        <Row>
          <Col>{ filters_sorts }</Col>
        </Row>
        <Row>
          <Col>{ showAll }</Col>
          <Col>{ exp }</Col>
          <Col>{ paginateNavigation }</Col>
          <br></br>
          <Col></Col>
        </Row>
        {content}
      </Container>
    )
  }
}

export default ModelController