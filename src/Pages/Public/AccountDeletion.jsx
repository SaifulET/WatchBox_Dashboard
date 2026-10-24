import { useState } from "react";
import { Alert, Checkbox, Form, Input, message } from "antd";
import LegalDocument from "../../Components/Public/LegalDocument";
import { getApiErrorMessage } from "../../lib/api";
import { publicPagesApi } from "../../services/publicPagesApi";

const { TextArea } = Input;

const fallbackHtml = `
  <h2>How to delete your WatchBox account</h2>
  <p>You can delete your customer account from the WatchBox app, or submit a deletion request with the form on this page. Deletion is permanent and cannot be undone.</p>
  <h2>What is deleted</h2>
  <ul>
    <li>Your profile, email, and login credentials</li>
    <li>Active sessions and verification codes</li>
    <li>Access to listings and settings tied to that login</li>
  </ul>
  <h2>How to delete your account in the app</h2>
  <ol>
    <li>Open the WatchBox app and sign in.</li>
    <li>Go to Profile or Account settings.</li>
    <li>Choose Delete account and confirm.</li>
  </ol>
  <p>If you cannot access the app, use the request form below with the email on the account.</p>
`;

const PublicAccountDeletion = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ticketId, setTicketId] = useState("");

  const onFinish = async (values) => {
    setSubmitting(true);
    setError("");

    try {
      const result = await publicPagesApi.submitContact({
        name: values.name,
        email: values.email,
        subject: "Account deletion request",
        message: values.message,
      });
      setTicketId(result?.ticketId || "");
      form.resetFields();
      message.success("Your deletion request was sent.");
    } catch (submitError) {
      const text = getApiErrorMessage(submitError);
      setError(text);
      message.error(text);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <LegalDocument
        slug="account-deletion"
        title="Account Deletion Method"
        fallbackHtml={fallbackHtml}
        localOnly
      />

      <div className="max-w-4xl mx-auto px-5 pb-12">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#002B49] px-6 py-5">
            <h2 className="text-white text-xl font-bold">Request account deletion</h2>
            <p className="text-white/80 text-sm mt-2">
              Submit this form with the email on your account. Our team will process the request and reply to that email.
            </p>
          </div>
          <div className="p-6 sm:p-8">
            {ticketId ? (
              <Alert
                className="mb-6"
                type="success"
                showIcon
                message="Deletion request received"
                description={`Your request ticket is ${ticketId}. We will contact you at the email you provided.`}
              />
            ) : null}
            {error && <Alert className="mb-6" type="error" showIcon message={error} />}

            <Form form={form} layout="vertical" requiredMark={false} onFinish={onFinish}>
              <Form.Item
                label="Full name"
                name="name"
                rules={[{ required: true, message: "Please enter your name." }, { min: 2 }]}
              >
                <Input size="large" placeholder="Your name" />
              </Form.Item>
              <Form.Item
                label="Account email"
                name="email"
                rules={[
                  { required: true, message: "Please enter the account email." },
                  { type: "email", message: "Enter a valid email." },
                ]}
              >
                <Input size="large" type="email" placeholder="you@example.com" />
              </Form.Item>
              <Form.Item
                label="Reason or details"
                name="message"
                rules={[
                  { required: true, message: "Please describe your request." },
                  { min: 10, message: "Write at least 10 characters." },
                ]}
              >
                <TextArea rows={5} placeholder="Please delete my WatchBox account. Include any extra details we should know." />
              </Form.Item>
              <Form.Item
                name="understood"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error("Confirm that you are requesting deletion of this account.")),
                  },
                ]}
              >
                <Checkbox>I request deletion of the account for this email.</Checkbox>
              </Form.Item>
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-[#002B49] hover:bg-[#061F36] text-white text-sm font-semibold rounded-lg disabled:opacity-70"
              >
                {submitting ? "Sending..." : "Submit deletion request"}
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicAccountDeletion;
