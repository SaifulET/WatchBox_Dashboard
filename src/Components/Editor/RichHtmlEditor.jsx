import { useMemo, useRef } from 'react';
import JoditEditor from 'jodit-react';
import 'jodit/es2021/jodit.min.css';

const defaultButtons = [
  'bold',
  'italic',
  'underline',
  '|',
  'ul',
  'ol',
  '|',
  'left',
  'center',
  'right',
  '|',
  'link',
  'image',
  'table',
  'hr',
  '|',
  'undo',
  'redo',
];

const RichHtmlEditor = ({
  value,
  onChange,
  placeholder = 'Write content...',
  minHeight = 320,
  disabled = false,
}) => {
  const editorRef = useRef(null);

  const config = useMemo(
    () => ({
      readonly: disabled,
      placeholder,
      height: minHeight,
      minHeight,
      toolbarAdaptive: false,
      toolbarSticky: false,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: 'insert_as_html',
      buttons: defaultButtons,
      uploader: {
        insertImageAsBase64URI: true,
      },
      image: {
        editSrc: true,
        useImageEditor: false,
      },
      style: {
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '1.65',
        color: '#1f2937',
      },
    }),
    [disabled, minHeight, placeholder]
  );

  return (
    <div className="modevin-rich-editor overflow-hidden rounded-lg border border-gray-200 bg-white">
      <JoditEditor
        ref={editorRef}
        value={value}
        config={config}
        onBlur={(nextContent) => onChange(nextContent)}
        onChange={(nextContent) => onChange(nextContent)}
      />
    </div>
  );
};

export default RichHtmlEditor;
