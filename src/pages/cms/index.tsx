import React from 'react'
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CMSView } from 'src/sections/cms/view';

const CMS = () => {
    console.log("hi");
    return (
      <>
        <Helmet>
          <title> {`Blog - ${CONFIG.appName}`}</title>
        </Helmet>
  
        <CMSView />
      </>
    );
}

export default CMS