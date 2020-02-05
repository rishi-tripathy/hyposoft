import React, { Component, useState } from 'react'
import RacksView from './RacksView';
import CreateRackForm from './CreateRackForm'
import EditRackForm from './EditRackForm'
import RackFilters from './RackFilters'
import DeleteMultipleRacksForm from './DeleteMultipleRacksForm'
import axios from 'axios'
import '../stylesheets/Printing.css'
import '../stylesheets/RackTable.css'
import '../stylesheets/RacksView.css'
import CreateMultipleRacksForm from './CreateMultipleRacksForm';
import { UncontrolledCollapse, Button, CardBody, Card, Container } from 'reactstrap';
import DetailedInstance from './DetailedInstance'
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export class RackController extends Component {

  constructor() {
    super();

    this.state = {
      racks: [],
      showRacksView: true,
      showCreateView: false,
      showMassCreateView: false,
      showMassDeleteView: false,
      showEditView: false,
      showDeleteView: false,
      showDetailedInstanceView: false,
      showCondensedView: false,
      showAllRacks: false,
      detailedInstanceID: 0,
      filterQuery: '',
      editID: 0,
      IDurl: '',
      deleteID: 0,
      prevPage: null,
      nextPage: null,
      rerender: false,
    };
    this.getShowRacks = this.getShowRacks.bind(this);
    this.getFilterQuery = this.getFilterQuery.bind(this);
    this.getShowDetailedInstance = this.getShowDetailedInstance.bind(this);
    this.getDetailedInstanceUrl = this.getDetailedInstanceUrl.bind(this);
  }

  getRerender = (re) => {
    if (re) {
      this.setState({ rerender: true })
    }
  }

  getShowRacks = (show, condensed) => {
    if(show && condensed){
      this.setState({
        showRacksView: true,
        showCreateView : false,
        showMassCreateView: false,
        sendMassDeleteView: false,
        showDetailedInstanceView: false,
        showCondensedView: true,
        showEditView: false,
        showDeleteView: false,
        showAllRacks: false,
      })
    } 
    else if(show && !condensed){
      this.setState({
        showRacksView: true,
        showCreateView : false,
        showMassCreateView: false,
        sendMassDeleteView: false,
        showDetailedInstanceView: false,
        showCondensedView: false,
        showEditView: false,
        showDeleteView: false,
        showAllRacks: false
      })
    }
    else{
      this.setState({
      showRacksView : false,
    }) 
    }
  }

  getShowCreate = (show) => {
    show ? this.setState({
      showRacksView: false,
      showCreateView : true,
      showMassCreateView: false,
      sendMassDeleteView: false, 
      showDetailedInstanceView: false,
      showEditView: false,
      showDeleteView: false,
      showAllRacks: false,
    })
    : this.setState({
      showCreateView : false,
    }) 
  }

  getDetailedInstanceView = (show) => {
    show ? this.setState({
      showRacksView: false,
      showCreateView : false,
      showMassCreateView: false,
      sendMassDeleteView: false, 
      showDetailedInstanceView: true,
      showEditView: false,
      showDeleteView: false,
      showAllRacks: false,
    })
    : this.setState({
      showDetailedInstanceView : false,
    }) 
  }

  getShowMassCreate = (show) => {
    show ? this.setState({
      showRacksView: false,
      showCreateView : false,
      showMassCreateView: true,
      showDetailedInstanceView: false,
      showEditView: false,
      showDeleteView: false,
      showAllRacks: false,
    })
    : this.setState({
      showMassCreateView : false,
    })    
  }

  getShowMassDelete = (show) => {
    show ? this.setState({
      showRacksView: false,
      showCreateView : false,
      showMassCreateView: false,
      showMassDeleteView: true,
      showDetailedInstanceView: false,
      showEditView: false,
      showDeleteView: false,
      showAllRacks: false,
    })
    : this.setState({
      showMassDeleteView : false,
    })    
  }

  getShowEdit = (show) => {
    show ? this.setState({
      showRacksView: false,
      showCreateView : false,
      showMassCreateView: false,
      showDetailedInstanceView: false,
      showEditView: true,
      showDeleteView: false,
      showAllRacks: false,
    })
    : this.setState({
      showEditView : false,
    }) 
  }

  getShowDelete = (show) => {
    show ? this.setState({
      showRacksView: false,
      showCreateView : false,
      showMassCreateView: false,
      showDetailedInstanceView: false,
      showEditView: false,
      showDeleteView: true,
      showAllRacks: false,
    })
    : this.setState({
      showDeleteView : false,
    }) 
  }

  getShowDetailedInstance = (show, id) => {
    show ? this.setState({
      showRacksView: false,
      showCreateView : false,
      showMassCreateView: false,
      showDetailedInstanceView: true,
      showEditView: false,
      showDeleteView: false,
      showAllRacks: false,
      IDurl: id,
    })
    : this.setState({
      showDetailedInstanceView : false,
    }) 
  }

  getDetailedInstanceUrl = (url) => {
    this.setState({
      IDurl: url,
    });
  }

  getShowAllRacks = (show) => {
    show ? this.setState({
      showRacksView: true,
      showCreateView : false,
      showMassCreateView: false,
      showDetailedInstanceView: false,
      showEditView: false,
      showDeleteView: false,
      showAllRacks: true,
    })
    : this.setState({
      showDeleteView : false,
    }) 
  }

  getEditID = (id) => {
    this.setState({
      editID: id,
    });
  }

  getFilterQuery = (q) => {
    this.setState({ filterQuery: q });
  }

  getSortQuery = (q) => {
    this.setState({ sortQuery: q })
  }

  componentDidMount() {
    this.refreshRacks();
    
  }

  componentDidUpdate(prevProps, prevState) {
    const delay = 50;

    // Once filter changes, rerender
    if (prevState.filterQuery !== this.state.filterQuery){
      setTimeout(() => {
        this.refreshRacks();
      }, delay); 
    }

    if( prevState.showRacksView !== this.state.showRacksView) {
      setTimeout(() => {
        this.refreshRacks();
      }, delay); 
    }
    if( prevState.showAllRacks !== this.state.showAllRacks) {
      setTimeout(() => {
        this.refreshRacks();
      }, delay); 
    }
    
      if (prevState.rerender === false && this.state.rerender === true) {
        setTimeout(() => {
          this.refreshRacks();
          this.setState({ rerender: false });
        }, delay); 
      }
    }
    
  refreshRacks = () => {
    if(!this.state.showAllRacks){
      let dst = '/api/racks/'+ '?' + this.state.filterQuery;
      
      axios.get(dst).then(res => {
      this.setState({ 
        racks: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
      alert('Cannot load. Re-login.\n' + JSON.stringify(error.response.data, null, 2));
    });
    }
    else {
      //show all racks
        let dst = '/api/racks/?show_all=true';

        axios.get(dst).then(res => {
          this.setState({
            racks: res.data,
            prevPage: null,
            nextPage: null,
          });
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
    
  }

  paginateNext = () => {
    this.state.racks = null;
    axios.get(this.state.nextPage).then(res => {
      this.setState({ 
        racks: res.data.results,
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
        racks: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }

  print() {
    window.print();
  }


  render() { 
    let content; 

    if (this.state.showRacksView){
      content = 
        <RacksView rack={this.state.racks}
                  sendRerender={ this.getRerender }
                  sendShowCreate={this.getShowCreate}
                  sendShowMassCreate={this.getShowMassCreate}
                  sendShowMassDelete={this.getShowMassDelete}
                  sendViewsToController={this.getShowDetailedInstance}
                  sendDetailedInstanceUrl={ this.getDetailedInstanceUrl }
                  sendShowEdit={this.getShowEdit}
                  sendEditID={this.getEditID}
                  sendShowDelete={this.getShowDelete} 
                  sendShowAllRacks={this.getShowAllRacks}
                  is_admin={this.props.is_admin}/>
    }
    else if (this.state.showDetailedInstanceView) {
      content = <DetailedInstance instanceID = {this.state.IDurl} 
                            sendShowTable = {this.getShowRacks} />    }
    else if (this.state.showCreateView){
      content = <CreateRackForm sendShowTable={this.getShowRacks} 
                  sendRerender={ this.getRerender }/> 
    }
    else if (this.state.showMassCreateView){
      content = <CreateMultipleRacksForm sendShowTable={this.getShowRacks} 
      sendRerender={ this.getRerender }/> 
    }
    else if (this.state.showMassDeleteView){
      content = <DeleteMultipleRacksForm sendShowTable={this.getShowRacks} 
      sendRerender={ this.getRerender }/> 
    }
    else if (this.state.showEditView){
      content= <EditRackForm editID={this.state.editID} 
                    sendShowTable={ this.getShowRacks } 
                    sendShowCreate={this.getShowCreate}
                    sendShowMassCreate={this.getShowMassCreate}
                    sendShowMassDelete={this.getShowMassDelete}
                    sendShowEdit={this.getShowEdit}
                    sendShowDelete={this.getShowDelete}
                    sendRerender={ this.getRerender }/> 
    }
    
    let filters =
  <div><Button color="primary" id="toggler" style={{ marginBottom: '1rem' }}> Toggle Filtering Dialog </Button>
      <UncontrolledCollapse toggler="#toggler">
        <RackFilters sendFilterQuery={ this.getFilterQuery } />
       </UncontrolledCollapse>
  </div>;
    let printButton = <Button color="primary" onClick= { this.print }>Print Racks</Button>;
    let paginateNavigation;

    if (this.state.prevPage == null && this.state.nextPage != null) {
      paginateNavigation = <div><Button color="link" disabled>prev page</Button>{'  '}<Button color="link" onClick={ this.paginateNext }>next page</Button></div>;
    } 
    else if (this.state.prevPage != null && this.state.nextPage == null) {
    paginateNavigation = <div><Button color="link" onClick={ this.paginatePrev }>prev page</Button>{'  '}<Button color="link" disabled>next page</Button></div>;
    }
    else if (this.state.prevPage != null && this.state.nextPage != null) {
      paginateNavigation = <div><Button color="link" onClick={ this.paginatePrev }>prev page</Button>{'  '}<Button color="link" onClick={ this.paginateNext }>next page</Button></div>;
    }

    // if we're not on the table, then don't show pagination
    if (! this.state.showRacksView) {
      paginateNavigation = <p></p>;
      filters = <p></p>;
      printButton = <p></p>;
    }

      return (
        <Container className="themed-container">
          <div id="hideOnPrint">
            {filters}{' '}
            { printButton }{' '}
            <br></br>
            <br></br>
            { paginateNavigation }{' '}
          </div>
          {content}
        </Container>
      )
    }
  }
//}

export default RackController