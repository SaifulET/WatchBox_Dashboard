import LegalDocument from "../../Components/Public/LegalDocument";

const fallbackHtml = `
  <h2>1. Acceptance of these terms</h2>
  <p>These Terms and Conditions govern access to WatchBox, including the website, mobile apps, marketplace listings, payments, and related services. By creating an account or using WatchBox, you agree to these terms.</p>
  <h2>2. Accounts</h2>
  <p>You must provide accurate registration details and keep your login credentials confidential. You are responsible for activity on your account.</p>
  <h2>3. Marketplace use</h2>
  <p>Listings must describe watches honestly. WatchBox may remove listings that are misleading, infringing, or otherwise prohibited.</p>
  <h2>4. Payments</h2>
  <p>Paid features, fees, and subscription plans are charged as displayed at checkout. Taxes may apply.</p>
  <h2>5. Contact</h2>
  <p>Questions about these terms can be sent through the public Contact page.</p>
`;

const PublicTermsConditions = () => (
  <LegalDocument slug="terms" title="Terms and Conditions" fallbackHtml={fallbackHtml} />
);

export default PublicTermsConditions;
