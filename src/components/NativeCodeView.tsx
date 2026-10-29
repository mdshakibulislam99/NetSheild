import React, { useState } from 'react';
import { ANDROID_FILES, AndroidCodeFile } from '../utils/nativeAndroidTemplates';
import { Copy, Check, FileCode, Download, ArrowLeft, Terminal, Cpu, CheckCircle2 } from 'lucide-react';

interface NativeCodeViewProps {
  onBack?: () => void;
}

export const NativeCodeView: React.FC<NativeCodeViewProps> = ({ onBack }) => {
  const [selectedFile, setSelectedFile] = useState<AndroidCodeFile>(ANDROID_FILES[1]); // NetShieldVpnService.kt
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const bundle = ANDROID_FILES.map(
      (f) => `// ==========================================\n// File: ${f.path}\n// ==========================================\n\n${f.code}\n\n`
    ).join('\n');

    const blob = new Blob([bundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ShieldNet_Android_Source.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 animate-fade-in pb-6 text-[#17365D]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1 pb-2 border-b border-[#F0F6FF]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-xl hover:bg-[#F0F6FF] text-[#17365D] flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-base font-bold text-[#17365D]">
              Native Android Kotlin Source
            </h1>
            <p className="text-xs text-[#64748B]">
              Production-ready VpnService files for Android Studio & Google Play
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadAll}
          className="min-h-[40px] px-3.5 py-1.5 bg-[#1677FF] hover:bg-[#0E62DB] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download All</span>
        </button>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="bg-[#F0F6FF] border border-[#DCE7F5] rounded-xl p-3 space-y-1">
          <span className="text-xs font-bold text-[#1677FF] block">1. Local TUN Interface</span>
          <p className="text-[11px] text-[#64748B]">
            Creates a virtual 10.1.10.1 loopback interface that catches UDP port 53 DNS queries on device.
          </p>
        </div>
        <div className="bg-[#F0F6FF] border border-[#DCE7F5] rounded-xl p-3 space-y-1">
          <span className="text-xs font-bold text-[#14B88A] block">2. 0.0.0.0 Sinkhole</span>
          <p className="text-[11px] text-[#64748B]">
            Restricted domains receive 0.0.0.0. All browsers instantly halt navigation with no data leak.
          </p>
        </div>
        <div className="bg-[#F0F6FF] border border-[#DCE7F5] rounded-xl p-3 space-y-1">
          <span className="text-xs font-bold text-[#17365D] block">3. Play Store Compliant</span>
          <p className="text-[11px] text-[#64748B]">
            Adheres strictly to the Google Play VpnService policy with zero remote proxy traffic.
          </p>
        </div>
      </div>

      {/* File Browser & Code Box (Pure Light Theme) */}
      <div className="bg-white border border-[#DCE7F5] rounded-2xl overflow-hidden shadow-2xs">
        
        {/* File Tabs Strip */}
        <div className="bg-[#F0F6FF] px-3 py-2 border-b border-[#DCE7F5] flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {ANDROID_FILES.map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedFile.name === file.name
                    ? 'bg-white text-[#1677FF] font-bold border border-[#DCE7F5] shadow-2xs'
                    : 'text-[#64748B] hover:text-[#17365D]'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="min-h-[34px] px-3 py-1 bg-white border border-[#DCE7F5] rounded-lg text-xs font-semibold text-[#17365D] hover:bg-[#F0F6FF] flex items-center gap-1.5 shrink-0 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#14B88A]" />
                <span className="text-[#14B88A]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>Copy File</span>
              </>
            )}
          </button>
        </div>

        {/* Selected File Description */}
        <div className="px-4 py-2 bg-[#FAFCFF] border-b border-[#F0F6FF] text-[11px] text-[#64748B] flex items-center justify-between">
          <span className="font-mono text-[#17365D] font-semibold">{selectedFile.path}</span>
          <span className="hidden sm:inline">{selectedFile.description}</span>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto max-h-[460px] bg-white text-[#17365D] font-mono text-xs leading-relaxed selection:bg-[#F0F6FF]">
          <pre>
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>

      {/* Build Steps */}
      <div className="bg-[#F0F6FF] border border-[#DCE7F5] rounded-2xl p-4 text-xs space-y-2 text-[#17365D]">
        <h4 className="font-bold flex items-center gap-1.5 text-xs text-[#1677FF]">
          <Terminal className="w-4 h-4" />
          <span>How to build APK in Android Studio:</span>
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-[#64748B] pl-1 text-[11px]">
          <li>Create an <strong>Empty Views Activity</strong> project in Android Studio with package <code>com.netshield.android</code>.</li>
          <li>Paste the source files above into the respective directories in your Android project.</li>
          <li>Go to <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> to generate the installable <code>.apk</code>.</li>
        </ol>
      </div>

    </div>
  );
};
