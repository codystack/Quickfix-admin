import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ResetPasswordView } from 'src/sections/auth/reset-password-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Reset Password - ${CONFIG.appName}`}</title>
      </Helmet>

      <ResetPasswordView />
    </>
  );
}
