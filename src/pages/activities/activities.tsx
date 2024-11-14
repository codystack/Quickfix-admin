import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ActivitiesView } from 'src/sections/activities/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Activities - ${CONFIG.appName}`}</title>
      </Helmet>

      <ActivitiesView />
    </>
  );
}
