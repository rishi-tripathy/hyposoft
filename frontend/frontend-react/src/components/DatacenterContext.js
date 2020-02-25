import React from 'react';
import axios from 'axios'

const DatacenterContext = React.createContext({
    datacenter_id: null,
    datacenter_name: null,
    datacenter_ab: null,
    is_admin: false,
    logged_in: false,
    datacenter_name: null,
    setLoginInfo: () => {},
    setDatacenter: () => {},
    resetDatacenter: () => {},
    user_first: null,
    user_last: null,
    username: null,
  });

export default DatacenterContext;