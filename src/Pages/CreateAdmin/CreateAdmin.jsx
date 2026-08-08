import { useRef, useState } from 'react';
import { Alert, Form, message } from 'antd';
import { FiEye, FiEyeOff, FiImage, FiTrash2 } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';

const CreateAdmin = () => {
  const [form] = Form.useForm();
  const registerAdmin = useAuthStore((state) => state.registerAdmin);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation(); // Prevent triggering the file input click
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (values) => {
    try {
      await registerAdmin({
        displayName: values.displayName,
        email: values.email,
        password: values.password,
      });
      form.resetFields();
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      message.success('Admin created successfully.');
    } catch (submitError) {
      message.error(submitError.message);
    }
  };

  return (
    <div className="p-8 bg-[#fdfdfd] min-h-screen font-sans mt-16 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
        {/* Header */}
        <div className="bg-[#002B49] px-6 py-4">
          <h2 className="text-white text-[20px] font-bold tracking-wide">Create Admin</h2>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <Form
            form={form}
            className="flex flex-col gap-6"
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={clearError}
            requiredMark={false}
          >
            {error && (
              <Alert message={error} showIcon type="error" />
            )}

            {/* Name */}
            <div>
              <label className="block text-[13px] text-gray-700 font-medium mb-2">Name</label>
              <Form.Item
                name="displayName"
                rules={[
                  { required: true, message: 'Please enter admin name.' },
                  { min: 2, message: 'Name must be at least 2 characters.' },
                ]}
                className="mb-0"
              >
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-[#002B49] transition-colors"
                />
              </Form.Item>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] text-gray-700 font-medium mb-2">Email</label>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter admin email.' },
                  { type: 'email', message: 'Please enter a valid email.' },
                ]}
                className="mb-0"
              >
                <input
                  type="email"
                  placeholder="admin@example.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-[#002B49] transition-colors"
                />
              </Form.Item>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] text-gray-700 font-medium mb-2">New Password</label>
                <div className="relative">
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Please enter a password.' },
                      { min: 8, message: 'Password must be at least 8 characters.' },
                    ]}
                    className="mb-0 w-full"
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-[#002B49] transition-colors pr-10"
                    />
                  </Form.Item>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[13px] text-gray-700 font-medium mb-2">Confirm New Password</label>
                <div className="relative">
                  <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm the password.' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match.'));
                        },
                      }),
                    ]}
                    className="mb-0 w-full"
                  >
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="********"
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-[#002B49] transition-colors pr-10"
                    />
                  </Form.Item>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div>
              <label className="block text-[13px] text-gray-700 font-medium mb-2">Profile Image</label>
              <div
                className="w-full h-32 bg-gray-50 border border-gray-200 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden group"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                      <span className="text-white text-[13px] font-medium mr-4">Change Image</span>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-1.5 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
                        title="Remove image"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <FiImage className="text-gray-400 mb-2" size={24} />
                    <span className="text-[13px] text-gray-400 font-medium">Upload Image</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#002B49] text-white font-bold text-[14px] px-12 py-3 rounded-md hover:bg-[#002B49]/90 transition-colors w-full max-w-sm shadow-sm disabled:opacity-70"
              >
                {loading ? 'Creating...' : 'Create Admin'}
              </button>
            </div>

          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
