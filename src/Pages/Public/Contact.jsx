import { useState } from "react";
import { Alert, Form, Input, message } from "antd";
import { getApiErrorMessage } from "../../lib/api";
import { publicPagesApi } from "../../services/publicPagesApi";

const { TextArea } = Input;

const PublicContact = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ticketId, setTicketId] = useState("");

  const onFinish = async (values) => {
    setSubmitting(true);
    setError("");

    try {
      const result = await publicPagesApi.submitContact(values);
      setTicketId(result?.ticketId || "");
      form.resetFields();
      message.success("Your message was sent.");
    } catch (submitError) {
      const text = getApiErrorMessage(submitError);
      setError(text);
      message.error(text);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#002B49] px-6 py-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300 font-semibold mb-1">Public</p>
          <h1 className="text-white text-2xl font-bold">Contact Us</h1>
          <p className="text-white/70 text-sm mt-2">
            Anyone can send a message here. No login is required.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {ticketId ? (
            <Alert
              className="mb-6"
              type="success"
              showIcon
              message="Message received"
              description={`Your support ticket is ${ticketId}. We will reply to the email you provided.`}
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
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email." },
                { type: "email", message: "Enter a valid email." },
              ]}
            >
              <Input size="large" type="email" placeholder="you@example.com" />
            </Form.Item>
            <Form.Item
              label="Subject"
              name="subject"
              rules={[{ required: true, message: "Please enter a subject." }, { min: 3 }]}
            >
              <Input size="large" placeholder="How can we help?" />
            </Form.Item>
            <Form.Item
              label="Message"
              name="message"
              rules={[{ required: true, message: "Please enter a message." }, { min: 10, message: "Write at least 10 characters." }]}
            >
              <TextArea rows={6} placeholder="Describe your question or issue." />
            </Form.Item>
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-[#002B49] hover:bg-[#061F36] text-white text-sm font-semibold rounded-lg disabled:opacity-70"
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PublicContact;
