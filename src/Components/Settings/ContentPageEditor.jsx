import { useEffect, useRef, useState } from 'react';
import { Alert, message } from 'antd';
import {
  FiArrowLeft,
  FiTrash2,
  FiUploadCloud,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import RichHtmlEditor from '../Editor/RichHtmlEditor';
import { getApiErrorMessage } from '../../lib/api';
import { adminContentApi } from '../../services/adminContentApi';

const defaultCopy = {
  about: '',
  'privacy-policy': '',
  terms: '',
};

const ContentPageEditor = ({ slug, title }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [content, setContent] = useState(defaultCopy[slug] || '');
  const [pageExists, setPageExists] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadPage = async () => {
      setLoading(true);
      setError('');

      try {
        const page = await adminContentApi.getPage(slug);
        if (!mounted) return;

        setContent(page?.data?.content || '');
        setImagePreview(page?.data?.image || null);
        setPageExists(true);
      } catch (loadError) {
        if (!mounted) return;

        if (loadError?.response?.status === 404) {
          setContent(defaultCopy[slug] || '');
          setPageExists(false);
          return;
        }

        setError(getApiErrorMessage(loadError));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = (event) => {
    event.stopPropagation();
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('title', title);
      payload.append('content', content);
      payload.append('status', 'active');
      if (selectedImage) {
        payload.append('image', selectedImage);
      }

      const saved = pageExists
        ? await adminContentApi.updatePage(slug, payload)
        : await adminContentApi.createPage(slug, payload);

      setPageExists(true);
      setSelectedImage(null);
      setImagePreview(saved?.data?.image || imagePreview);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      message.success(`${title} saved successfully.`);
    } catch (saveError) {
      const messageText = getApiErrorMessage(saveError);
      setError(messageText);
      message.error(messageText);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 bg-[#fdfdfd] min-h-screen font-sans mt-16 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit flex flex-col min-h-[600px]">
        <div className="bg-[#002B49] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            <h2 className="text-white text-[20px] font-bold tracking-wide">{title}</h2>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading || !content.trim()}
            className="bg-white text-[#002B49] font-bold text-[13px] px-6 py-1.5 rounded-sm hover:bg-gray-100 transition-colors disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="flex flex-col flex-1 p-6">
          {error && (
            <Alert className="mb-4" message={error} showIcon type="error" />
          )}

          {loading ? (
            <div className="min-h-[350px] flex items-center justify-center text-sm font-semibold text-gray-400">
              Loading...
            </div>
          ) : (
            <RichHtmlEditor
              value={content}
              onChange={setContent}
              minHeight={380}
              placeholder={`Write ${title.toLowerCase()} content...`}
            />
          )}

          <div className="mt-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-t border-gray-100 pt-4 bg-white">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FiUploadCloud size={20} />
                )}
              </button>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-[#333]">Upload your image</span>
                <span className="text-[11px] text-gray-400">jpg/png - Max. 10MB</span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#002B49] text-white text-[12px] font-bold px-4 py-1.5 rounded-sm hover:bg-[#002B49]/90 transition-colors ml-2"
              >
                Upload
              </button>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-2 bg-rose-50 text-rose-500 rounded-md hover:bg-rose-100 transition-colors"
                  title="Remove selected image"
                >
                  <FiTrash2 size={14} />
                </button>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContentPageEditor;
