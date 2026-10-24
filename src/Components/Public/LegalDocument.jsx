import { useEffect, useState } from "react";
import { Spin } from "antd";
import { publicPagesApi } from "../../services/publicPagesApi";

const LegalDocument = ({ slug, title, fallbackHtml, localOnly = false }) => {
  const [content, setContent] = useState(fallbackHtml);
  const [pageTitle, setPageTitle] = useState(title);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(!localOnly);

  useEffect(() => {
    let mounted = true;

    if (localOnly) {
      setContent(fallbackHtml);
      setPageTitle(title);
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    const loadPage = async () => {
      setLoading(true);

      try {
        const page = await publicPagesApi.getContent(slug);
        if (!mounted) return;
        setPageTitle(page?.data?.title || title);
        setContent(page?.data?.content || fallbackHtml);
        setImage(page?.data?.image || null);
      } catch {
        if (!mounted) return;
        setPageTitle(title);
        setContent(fallbackHtml);
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
  }, [slug, title, fallbackHtml, localOnly]);

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#002B49] px-6 py-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300 font-semibold mb-1">Public</p>
          <h1 className="text-white text-2xl font-bold">{pageTitle}</h1>
        </div>
        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="min-h-[280px] flex items-center justify-center">
              <Spin />
            </div>
          ) : (
            <>
              {image && (
                <img src={image} alt="" className="w-full max-h-72 object-cover rounded-lg mb-6" />
              )}
              <div className="legal-prose" dangerouslySetInnerHTML={{ __html: content }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalDocument;
