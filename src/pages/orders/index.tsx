import React from 'react'
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OrderView } from 'src/sections/orders/view';

const Orders = () => {
    console.log("hi");
    return (
        <>
          <Helmet>
            <title> {`Orders - ${CONFIG.appName}`}</title>
          </Helmet>
    
          <OrderView />
        </>
      );
}

export default Orders