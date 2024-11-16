import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ReasonView } from 'src/sections/reasons/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Reasons - ${CONFIG.appName}`}</title>
      </Helmet>

      <ReasonView />
    </>
  );
}
