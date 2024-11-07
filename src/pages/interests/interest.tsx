import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { InterestView } from 'src/sections/interest/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Interest - ${CONFIG.appName}`}</title>
      </Helmet>

      <InterestView />
    </>
  );
}
