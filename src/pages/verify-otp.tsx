import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { VerifyOTPView } from 'src/sections/auth/verify-otp-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Verify OTP - ${CONFIG.appName}`}</title>
      </Helmet>

      <VerifyOTPView />
    </>
  );
}
