import React from 'react';
import unsupportedScreenIllustration from './unsupported_screen.svg';

const UnsupportedScreen = () => (
  <main className="flex items-center justify-center min-h-screen px-4 py-8 bg-background-lightgrey-plutus">
    <section className="w-full max-w-md p-6 text-center bg-white border shadow-sm rounded-2xl border-outline-grey-plutus">
      <img
        src={unsupportedScreenIllustration}
        alt="Device not supported"
        className="mx-auto mb-6 w-full max-w-[280px] h-auto"
      />

      <h1 className="mb-2 text-2xl font-bold font-lato text-primary-dark-plutus">
        Desktop experience required
      </h1>

      <p className="mb-5 text-sm leading-6 font-lato text-primary-grey-plutus">
        Plutus CRM is a desktop CRM built for larger screens to ensure the best usability and data
        visibility. Please open this app on a laptop or desktop browser.
      </p>

      <div className="flex items-center justify-center gap-2 text-xs font-lato text-primary-grey-plutus">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-secondary-green-plutus" />
        <span>Recommended: 768px width or above</span>
      </div>
    </section>
  </main>
);

export default UnsupportedScreen;
