import React, { Component } from 'react'
import RacksView from './RacksView';
import CreateRackForm from './CreateRackForm'
import EditRackForm from './EditRackForm'
import RackFilters from './RackFilters'
import DeleteMultipleRacksForm from './DeleteMultipleRacksForm'
import axios from 'axios'
import CreateMultipleRacksForm from './CreateMultipleRacksForm';
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
      showIndividualInstanceView: false,
      showCondensedView: false,
      detailedInstanceID: 0,
      filterQuery: '',
      editID: 0,
      deleteID: 0,
      prevPage: null,
      nextPage: null,
    };
    this.getShowRacks = this.getShowRacks.bind(this);
    this.getFilterQuery = this.getFilterQuery.bind(this);
    this.getDetailedInstanceID = this.getDetailedInstanceID.bind(this);
  }

  getShowRacks = (show, condensed) => {
    if(show && condensed){
      console.log(' racks condensed');
      this.setState({
        showRacksView: true,
        showCreateView : false,
        showMassCreateView: false,
        sendMassDeleteView: false,
        showIndividualInstanceView: false,
        showCondensedView: true,
        showEditView: false,
        showDeleteView: false,
      })
    } 
    else if(show && !condensed){
      console.log("racks not condensed");
      this.setState({
        showRacksView: true,
        showCreateView : false,
        showMassCreateView: false,
        sendMassDeleteView: false,
        showIndividualInstanceView: false,
        showCondensedView: false,
        showEditView: false,
        showDeleteView: false,
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
      showIndividualInstanceView: false,
      showEditView: false,
      showDeleteView: false,
    })
    : this.setState({
      showCreateView : false,
    }) 
  }

  getShowMassCreate = (show) => {
    show ? this.setState({
      showRacksView: false,
      showCreateView : false,
      showMassCreateView: true,
      showIndividualInstanceView: false,
      showEditView: false,
      showDeleteView: false,
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
      showIndividualInstanceView: false,
      showEditView: false,
      showDeleteView: false,
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
      showIndividualInstanceView: false,
      showEditView: true,
      showDeleteView: false,
    })
    : this.setState({
      showEditView : false,
    }) 
  }

  getShowDelete = (show) => {
    show ? this.setState({
      showTableView: false,
      showCreateView : false,
      showMassCreateView: false,
      showIndividualInstanceView: false,
      showEditView: false,
      showDeleteView: true,
    })
    : this.setState({
      showDeleteView : false,
    }) 
  }

  getShowDetailedInstance = (show) => {
    show ? this.setState({
      showTableView: false,
      showCreateView : false,
      showMassCreateView: false,
      showIndividualInstanceView: true,
      showEditView: false,
      showDeleteView: false,
    })
    : this.setState({
      showIndividualInstanceView : false,
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

  getFilterQuery = (q) => {
    this.setState({ filterQuery: q });
    console.log(this.state.filterQuery);
  }

  getSortQuery = (q) => {
    this.setState({ sortQuery: q })
    console.log(this.state.sortQuery);
  }

  componentDidMount() {
    this.refreshRacks();
    
  }

  componentDidUpdate(prevProps, prevState) {
    // Once filter changes, rerender
    if (prevState.filterQuery !== this.state.filterQuery) {
      this.refreshRacks();
    }
    // Once sort changes, rerender
    // if (prevState.sortQuery !== this.state.sortQuery) {
    //   this.getInstances();
    // }
  }
    
  refreshRacks = () => {
    let dst = '/api/racks/'+ '?' + this.state.filterQuery; //+ '&' + this.state.sortQuery
    console.log('querryyyyy');
    console.log(dst);
    axios.get(dst).then(res => {
      this.setState({ 
        racks: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });

      console.log(this.state.racks);
    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });
  }

  paginateNext = () => {
    this.state.racks = null;
    axios.get(this.state.nextPage).then(res => {
      this.setState({ 
        racks: res.data.results,
        prevPage: res.data.previous,
        nextPage: res.data.next,
      });

      console.log(this.state.racks);

    })
    .catch(function (error) {
      // TODO: handle error
      console.log(error.response);
    });

    console.log(this.state.racks);
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

  render() { 
    let content; 

    console.log("render again");
    console.log(this.state);

   // let sorting = <InstanceSort sendSortQuery={ this.getSortQuery } />

    if (this.state.showRacksView){
      content = 
        <RacksView rack={this.state.racks}
                  sendShowCreate={this.getShowCreate}
                  sendShowMassCreate={this.getShowMassCreate}
                  sendShowMassDelete={this.getShowMassDelete}
                  sendShowDetailedInstance={this.getShowDetailedInstance}
                  sendInstanceID={ this.getDetailedInstanceID }
                  sendShowEdit={this.getShowEdit}
                  sendEditID={this.getEditID}
                  sendShowDelete={this.getShowDelete} />
    }
    else if (this.state.showIndividualInstanceView) {
     //insert here
    }
    else if (this.state.showCreateView){
        content = <CreateRackForm sendShowTable={this.getShowRacks} /> 
    }
    else if (this.state.showMassCreateView){
      content = <CreateMultipleRacksForm sendShowTable={this.getShowRacks} /> 
    }
    else if (this.state.showMassDeleteView){
      content = <DeleteMultipleRacksForm sendShowTable={this.getShowRacks} /> 
    }
    else if (this.state.showEditView){
        content= <EditRackForm editID={this.state.editID} 
                    sendShowTable={ this.getShowRacks } 
                    sendShowCreate={this.getShowCreate}
                    sendShowMassCreate={this.getShowMassCreate}
                    sendShowMassDelete={this.getShowMassDelete}
                    sendShowDetailedInstance={this.getShowDetailedInstance}
                    sendInstanceID={ this.getDetailedInstanceID }
                    sendShowEdit={this.getShowEdit}
                    sendShowDelete={this.getShowDelete}/> 
    }
    
    let filters = <RackFilters sendFilterQuery={ this.getFilterQuery } />;
    let paginateNavigation;
    let sorting;
    if (this.state.prevPage == null && this.state.nextPage != null) {
      paginateNavigation = <div><button onClick={ this.paginateNext }>next page</button></div>;
    } 
    else if (this.state.prevPage != null && this.state.nextPage == null) {
      paginateNavigation = <div><button onClick={ this.paginatePrev }>prev page</button></div>;
    }
    else if (this.state.prevPage != null && this.state.nextPage != null) {
      paginateNavigation = <div><button onClick={ this.paginatePrev }>prev page</button><button onClick={ this.paginateNext }>next page</button></div>;
    }

    // if we're not on the table, then don't show pagination
    if (! this.state.showRacksView) {
      paginateNavigation = <p></p>;
      filters = <p></p>;
      sorting = <p></p>;
    }
  
      return (
        <div>
          { paginateNavigation } { filters }
            {content}
        </div>
      )
    }
  }
//}

export default RackController