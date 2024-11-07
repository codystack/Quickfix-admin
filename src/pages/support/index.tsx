import React from 'react'
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SupportView } from 'src/sections/support/view';

const CustomerSupport = () => {
    console.log("ds");
    
    return (
      <>
        <Helmet>
          <title> {`Users - ${CONFIG.appName}`}</title>
        </Helmet>
  
        <SupportView />
      </>
    );
}

export default CustomerSupport