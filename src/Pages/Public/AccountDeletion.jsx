import LegalDocument from "../../Components/Public/LegalDocument";

const fallbackHtml = `
  <h2>How to delete your WatchBox account</h2>
  <p>You can delete your customer account from the WatchBox app. Deletion is permanent and cannot be undone.</p>
  <h2>What is deleted</h2>
  <ul>
    <li>Your profile, email, and login credentials</li>
    <li>Active sessions and verification codes</li>
    <li>Access to listings and settings tied to that login</li>
  </ul>
  <h2>How to delete your account</h2>
  <ol>
    <li>Open the WatchBox app and sign in.</li>
    <li>Go to Profile or Account settings.</li>
    <li>Choose Delete account and confirm.</li>
  </ol>
  <p>If you cannot access the app, send a deletion request from the Contact page using the email on the account.</p>
`;

const PublicAccountDeletion = () => (
  <LegalDocument
    slug="account-deletion"
    title="Account Deletion Method"
    fallbackHtml={fallbackHtml}
    localOnly
  />
);

export default PublicAccountDeletion;
