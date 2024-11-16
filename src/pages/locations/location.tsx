import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LocationView } from 'src/sections/location/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Locations - ${CONFIG.appName}`}</title>
      </Helmet>

      <LocationView />
    </>
  );
}
