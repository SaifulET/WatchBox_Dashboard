import LegalDocument from "../../Components/Public/LegalDocument";

const fallbackHtml = `
  <h2>1. Who we are</h2>
  <p>WatchBox operates a luxury watch marketplace and related admin tools. This Privacy Policy explains what personal data we collect, why we collect it, and the choices you have.</p>
  <h2>2. Data we collect</h2>
  <p>We collect account details such as name, email, password hash, phone, country, and location when you provide them. We also collect listings, messages, purchase and subscription records, device and log data, and support requests.</p>
  <h2>3. How we use data</h2>
  <p>We use personal data to create and secure your account, operate the marketplace, process payments, send verification and reset codes, provide customer support, prevent fraud, and improve the service.</p>
  <h2>4. Sharing</h2>
  <p>We share data with service providers that host, store, email, process payments, or power marketplace integrations. We may disclose information when required by law or to protect users and the platform. We do not sell personal data.</p>
  <h2>5. Your rights</h2>
  <p>You may request access, correction, export, or deletion of your personal data from the Account Deletion page, in-app settings, or the Contact form.</p>
`;

const PublicPrivacyPolicy = () => (
  <LegalDocument slug="privacy-policy" title="Privacy Policy" fallbackHtml={fallbackHtml} />
);

export default PublicPrivacyPolicy;
