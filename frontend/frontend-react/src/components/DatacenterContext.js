import React from 'react';
import axios from 'axios'

const DatacenterContext = React.createContext({
    datacenter_id: -1,
    datacenter_name: 'ALL',
    datacenter_ab: 'ALL',
    is_admin: false,
    logged_in: false,
    setLoginInfo: () => {},
    setDatacenter: () => {},
    resetDatacenter: () => {},
    user_first: null,
    user_last: null,
    username: null,
  });

export default DatacenterContext;