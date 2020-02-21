import React from 'react';
import axios from 'axios'

const DatacenterContext = React.createContext({
    datacenter: null,
    datacenter_name: null,
    setDatacenter: () => {}
  });

export default DatacenterContext;