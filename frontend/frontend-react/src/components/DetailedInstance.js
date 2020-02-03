import React, { Component } from 'react'
import axios from 'axios'
import InstanceCard from './InstanceCard';

export class DetailedInstance extends Component {

  constructor() {
    super();
    // keep this default here so InstanceCard doesn't freak out
    this.state = {
      instance: 
        {
<<<<<<< HEAD
          // 'id': 999,
          // 'model': {
          //     'url': 'http://localhost:5000/api/models/10/',
          //     'vendor': 'default',
          //     'model_number': 'df',
          //     'display_color': 'adf'
          // },
          // 'hostname': 'default',
          // 'rack': {
          //     'url': 'http://localhost:5000/api/racks/1/',
          //     'rack_number': 'A111'
          // },
          // 'rack_u': 4,
          // 'owner': {
          //     'url': 'http://localhost:5000/api/users/6/',
          //     'username': 'adsfd'
          // },
          // 'comment': 'default'
=======
          'id': 999,
          'model': {
              'url': 'http://localhost:5000/api/models/10/',
              'vendor': 'default',
              'model_number': 'df',
              'display_color': 'adf'
          },
          'hostname': 'default',
          'rack': {
              'url': 'http://localhost:5000/api/racks/1/',
              'rack_number': 'A111'
          },
          'rack_u': 4,
          'owner': {
              'url': 'http://localhost:5000/api/users/6/',
              'username': 'adsfd'
          },
          'comment': 'default'
>>>>>>> 03e3a9c43312cf02201cfac700ba54be32741cc6
        }
    }
  }

<<<<<<< HEAD
  loadInstance = () => {
    if (this.props.instanceID !== undefined) {
      let dst = '/api/instances/'.concat(this.props.instanceID).concat('/');
      axios.get(dst).then(res => {
        this.setState({
          instance: res.data
        });
      });
    }
  }

  componentDidMount() {
    this.loadInstance();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.instanceID !== this.props.instanceID) {
      this.loadInstance();
    }
=======
  componentDidMount() {
    let dst = '/api/instances/'.concat(this.props.instanceID).concat('/');
    axios.get(dst).then(res => {
      this.setState({
        instance: res.data
      });
    });
>>>>>>> 03e3a9c43312cf02201cfac700ba54be32741cc6
  }

  render() {
    return (
      <div>
        <InstanceCard inst={ this.state.instance } />
      </div>
    )
  }
}

export default DetailedInstance
