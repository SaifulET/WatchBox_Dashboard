import React, { useEffect, useRef, useState } from 'react';
import { Alert, message } from 'antd';
import { FiSearch, FiSend, FiX, FiUploadCloud, FiFileText, FiTrash2 } from 'react-icons/fi';
import RichHtmlEditor from '../../Components/Editor/RichHtmlEditor';
import { getApiErrorMessage } from '../../lib/api';
import { adminBulkEmailApi } from '../../services/adminBulkEmailApi';

const defaultBody = `<p><strong>Hi there,</strong></p>
<p>We've been working hard to bring you a better experience. In our latest update, we've introduced several key features designed to streamline your administrative workflow.</p>
<ul>
  <li><strong>Automated Reporting:</strong> Get insights delivered straight to your inbox every Monday.</li>
  <li><strong>Smart Filters:</strong> Drill down into your user base with precision.</li>
  <li><strong>Performance Boost:</strong> The dashboard now loads faster.</li>
</ul>
<p>Check out the new features today and let us know what you think!</p>
<p>Best regards,<br/>The Modevin Team</p>`;
const defaultSubject = 'Exciting New Updates to Your Workspace';

const BulkEmail = () => {
  const [usersData, setUsersData] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [subject, setSubject] = useState(defaultSubject);
  const [template, setTemplate] = useState('');
  const [body, setBody] = useState(defaultBody);
  const [searchQuery, setSearchQuery] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      setLoading(true);
      setError('');

      try {
        const [recipients, templateList] = await Promise.all([
          adminBulkEmailApi.listRecipients({ limit: 1000 }),
          adminBulkEmailApi.listTemplates(),
        ]);

        if (!mounted) return;

        setUsersData(recipients || []);
        setSelectedUsers([]);
        setTemplates(templateList || []);

        const firstTemplate = templateList?.[0];
        if (firstTemplate) {
          setTemplate(firstTemplate.id);
          setSubject(firstTemplate.subject || defaultSubject);
          setBody(firstTemplate.body || defaultBody);
        }
      } catch (loadError) {
        if (!mounted) return;
        setError(getApiErrorMessage(loadError));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const timeout = setTimeout(async () => {
      try {
        const recipients = await adminBulkEmailApi.listRecipients({
          q: searchQuery || undefined,
          limit: 1000,
        });
        if (!mounted) return;
        setUsersData(recipients || []);
        setError('');
      } catch (searchError) {
        if (!mounted) return;
        setError(getApiErrorMessage(searchError));
      }
    }, 300);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [searchQuery]);
  
  const handleSelectUser = (user) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const selectedById = new Map(selectedUsers.map((user) => [user.id, user]));
      usersData.forEach((user) => selectedById.set(user.id, user));
      setSelectedUsers(Array.from(selectedById.values()));
    } else {
      const visibleIds = new Set(usersData.map((user) => user.id));
      setSelectedUsers(selectedUsers.filter((user) => !visibleIds.has(user.id)));
    }
  };

  const removeUser = (id) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== id));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAttachments([...attachments, ...files]);
    }
    // reset input so same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleTemplateChange = (event) => {
    const templateId = event.target.value;
    setTemplate(templateId);
    const selectedTemplate = templates.find((item) => item.id === templateId);
    if (selectedTemplate) {
      setSubject(selectedTemplate.subject || '');
      setBody(selectedTemplate.body || '');
    }
  };

  const handleSendEmail = async () => {
    setSending(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('subject', subject);
      payload.append('body', body);
      payload.append('templateId', template);
      payload.append('templateName', templates.find((item) => item.id === template)?.name || template);
      payload.append('recipientIds', JSON.stringify(selectedUsers.map((user) => user.id)));
      attachments.forEach((file) => payload.append('attachments', file));

      const campaign = await adminBulkEmailApi.createCampaign(payload);
      await adminBulkEmailApi.sendCampaign(campaign.id);
      message.success(`Email campaign queued for ${selectedUsers.length} recipient(s).`);
    } catch (sendError) {
      const messageText = getApiErrorMessage(sendError);
      setError(messageText);
      message.error(messageText);
    } finally {
      setSending(false);
    }
  };

  const visibleSelectedCount = usersData.filter((user) => selectedUsers.some((selected) => selected.id === user.id)).length;
  const isAllSelected = visibleSelectedCount === usersData.length && usersData.length > 0;
  const isSomeSelected = visibleSelectedCount > 0 && visibleSelectedCount < usersData.length;
  const canSend = selectedUsers.length > 0 && subject.trim() && body.trim();

  return (
    <div className="p-8 bg-[#fdfdfd] min-h-screen font-sans mt-16">
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Pane - Target Audience */}
        <div className="w-full lg:w-[40%] bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-[18px] font-bold text-[#001f3f] mb-4">Target Audience</h2>
          
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search users or admins by name or email"
              className="w-full bg-[#f8fafc] border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-[13px] text-gray-700 outline-none focus:border-[#002B49] transition-colors"
            />
          </div>

          {error && (
            <Alert className="mb-4" message={error} showIcon type="error" />
          )}

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-2 w-10">
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      ref={input => {
                        if (input) input.indeterminate = isSomeSelected;
                      }}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded text-[#002B49] focus:ring-[#002B49] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="py-3 px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-[13px] text-gray-400 font-semibold">
                      Loading recipients...
                    </td>
                  </tr>
                ) : usersData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-[13px] text-gray-400 font-semibold">
                      No recipients found
                    </td>
                  </tr>
                ) : usersData.map(user => {
                  const isSelected = !!selectedUsers.find(u => u.id === user.id);
                  return (
                    <tr 
                      key={user.id} 
                      className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-[#f8fafc]' : ''}`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <td className="py-4 px-2">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => {}} // handled by row click
                          className="w-4 h-4 rounded text-[#002B49] focus:ring-[#002B49] cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-[13px] font-medium text-gray-700">{user.name}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-[13px] text-gray-500 break-all">{user.email}</div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                          user.status === 'TRIAL' ? 'bg-amber-100 text-amber-700' : 
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Pane - Compose Campaign */}
        <div className="w-full lg:w-[60%] bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-[20px] font-bold text-[#001f3f]">Compose</h2>
              <h2 className="text-[20px] font-bold text-[#001f3f]">Campaign</h2>
            </div>
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={sending || !canSend}
              className="bg-[#002B49] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#002B49]/90 text-[14px] font-bold transition-colors shadow-sm disabled:opacity-70"
            >
              <FiSend size={16} /> {sending ? 'Queueing...' : 'Send Email'}
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {/* Recipients */}
            <div>
              <label className="block text-[13px] text-gray-600 font-medium mb-2">Recipients ({selectedUsers.length} selected)</label>
              <div className="w-full min-h-[46px] bg-[#f8fafc] border border-gray-200 rounded-lg p-2 flex flex-wrap gap-2">
                {selectedUsers.map(user => (
                  <div key={user.id} className="bg-white border border-gray-200 rounded-md px-3 py-1 flex items-center gap-2 shadow-sm">
                    <span className="text-[13px] font-medium text-gray-700">{user.name}</span>
                    <span className="text-[11px] font-semibold text-gray-400">{user.role || 'User'}</span>
                    <button 
                      onClick={() => removeUser(user.id)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Select Template */}
            <div>
              <label className="block text-[13px] text-gray-600 font-medium mb-2">Select Template</label>
              <select 
                value={template}
                onChange={handleTemplateChange}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-[#002B49] transition-colors appearance-none"
              >
                {templates.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            {/* Email Subject */}
            <div>
              <label className="block text-[13px] text-gray-600 font-medium mb-2">Email Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] font-medium text-[#001f3f] outline-none focus:border-[#002B49] transition-colors"
              />
            </div>

            {/* Email Body Editor */}
            <div>
              <label className="block text-[13px] text-gray-600 font-medium mb-2">Email Body</label>
              <RichHtmlEditor
                value={body}
                onChange={setBody}
                minHeight={300}
                placeholder="Compose the email body..."
              />
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-[13px] text-gray-600 font-medium mb-2">Attachments</label>
              <div 
                className="w-full h-24 border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/50 transition-colors mb-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUploadCloud className="text-indigo-400 mb-1" size={24} />
                <span className="text-[13px] font-medium text-[#001f3f]">Click to upload or drag and drop</span>
                <span className="text-[11px] text-gray-400">PDF, JPG, PNG or ZIP (max. 10MB)</span>
                <input 
                  type="file" 
                  multiple
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
              
              {/* Attachment File List */}
              {attachments.length > 0 && (
                <div className="flex flex-col gap-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="w-max max-w-full border border-gray-200 rounded-lg p-3 flex items-center gap-3 bg-white shadow-sm">
                      <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <FiFileText size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-[#001f3f] line-clamp-1">{file.name}</span>
                        <span className="text-[10px] text-gray-500 font-medium">{formatFileSize(file.size)}</span>
                      </div>
                      <button 
                        onClick={() => removeAttachment(index)}
                        className="ml-4 p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default BulkEmail;
