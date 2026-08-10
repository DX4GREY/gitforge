import React, { useState, useEffect } from 'react';
import { Copy, Download, Sparkles, Check, RefreshCw, Eye, Code, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useTheme } from '../context/ThemeContext';
import { getGitHubProfile, generateAIReadmeApi } from '../lib/github';
import { GitHubProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface ReadmeBuilderPageProps {
  onNavigate: (path: string) => void;
}

export const ReadmeBuilderPage: React.FC<ReadmeBuilderPageProps> = () => {
  const { activeTheme } = useTheme();
  const { authState } = useAuth();
  const [username, setUsername] = useState(authState.user?.login || 'octocat');
  const [style, setStyle] = useState('Technical');
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'Header',
    'About',
    'Tech Stack',
    'Featured Projects',
    'GitHub Stats',
    'Contribution graph',
    'Contact',
  ]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const styles = ['Minimal', 'Technical', 'Creative', 'Recruiter-friendly', 'Student', 'Open Source'];
  const availableSections = [
    'Header',
    'About',
    'Tech Stack',
    'Featured Projects',
    'GitHub Stats',
    'Languages',
    'Contribution graph',
    'Contact',
  ];

  const handleGenerate = async () => {
    if (!username.trim()) return;
    setLoading(true);
    try {
      const userProfile = await getGitHubProfile(username);
      setProfile(userProfile);
      const generatedMd = await generateAIReadmeApi(username, style, selectedSections);
      setMarkdown(generatedMd);
    } catch {
      // Handled inside AI fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.user?.login) {
      setUsername(authState.user.login);
    }
  }, [authState.user?.login]);

  useEffect(() => {
    handleGenerate();
  }, [username]);

  const toggleSection = (sec: string) => {
    if (selectedSections.includes(sec)) {
      setSelectedSections(selectedSections.filter((s) => s !== sec));
    } else {
      setSelectedSections([...selectedSections, sec]);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-500" />
          GitHub Profile README Generator
        </h1>
        <p className="text-xs" style={{ color: activeTheme.textMuted }}>
          Customize sections, select themes, and generate production-ready README.md code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
            <h3 className="font-bold text-sm">1. GitHub Username</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="octocat"
                className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none"
                style={{
                  backgroundColor: activeTheme.surfaceSecondary,
                  borderColor: activeTheme.border,
                  color: activeTheme.text,
                }}
              />
            </div>
          </div>

          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
            <h3 className="font-bold text-sm">2. Profile Style</h3>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border text-left transition ${
                    style === s ? 'shadow-md' : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: style === s ? activeTheme.surfaceSecondary : 'transparent',
                    borderColor: style === s ? activeTheme.primary : activeTheme.border,
                    color: style === s ? activeTheme.primary : activeTheme.text,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
            <h3 className="font-bold text-sm">3. Include Sections</h3>
            <div className="space-y-2">
              {availableSections.map((sec) => {
                const isSelected = selectedSections.includes(sec);
                return (
                  <label
                    key={sec}
                    onClick={() => toggleSection(sec)}
                    className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer text-xs font-medium transition hover:opacity-90"
                    style={{
                      backgroundColor: isSelected ? activeTheme.surfaceSecondary : 'transparent',
                      borderColor: isSelected ? activeTheme.primary : activeTheme.border,
                    }}
                  >
                    <input type="checkbox" checked={isSelected} readOnly className="rounded text-blue-600" />
                    <span>{sec}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: activeTheme.gradient, color: '#ffffff' }}
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Generating README...' : 'Generate README.md'}
          </button>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
            <div className="flex items-center justify-center gap-1 bg-black/20 p-1 rounded-lg border border-gray-800">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'code' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> Markdown
              </button>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition hover:opacity-80 cursor-pointer"
                style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
              <button
                onClick={downloadMarkdown}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition hover:opacity-80 cursor-pointer"
                style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
              >
                <Download className="w-3.5 h-3.5" /> Download .md
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="p-6 rounded-xl border min-h-[500px]" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-xs font-mono" style={{ color: activeTheme.textMuted }}>
                  Analyzing repository metrics &amp; generating README...
                </p>
              </div>
            ) : activeTab === 'preview' ? (
              <div className="markdown-body prose max-w-none space-y-4 font-sans text-sm leading-relaxed" style={{ color: activeTheme.text }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    img: ({ node, ...props }) => (
                      <img {...props} className="inline-block max-w-full my-1 rounded" referrerPolicy="no-referrer" />
                    ),
                    a: ({ node, ...props }) => (
                      <a {...props} className="text-blue-500 hover:underline inline-flex items-center gap-1 font-medium" target="_blank" rel="noopener noreferrer" />
                    ),
                    h1: ({ node, ...props }) => (
                      <h1 className="text-2xl font-black border-b pb-2 mb-3 mt-4 flex items-center gap-2" style={{ borderColor: activeTheme.border }} {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-xl font-bold border-b pb-1.5 mb-2 mt-4" style={{ borderColor: activeTheme.border }} {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-lg font-bold mb-2 mt-3" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-3 leading-relaxed" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside space-y-1 mb-3" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside space-y-1 mb-3" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-3 py-1 my-2 opacity-90 italic bg-blue-500/10 rounded-r" {...props} />
                    ),
                    code: ({ node, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !match && !String(children).includes('\n');
                      if (isInline) {
                        return <code className="bg-black/20 dark:bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono font-semibold" {...props}>{children}</code>;
                      }
                      return (
                        <pre className="p-3 bg-black/40 border border-gray-800 rounded-lg overflow-x-auto text-xs font-mono my-3 leading-relaxed" style={{ color: '#e4e4e7' }} {...props}>
                          <code>{children}</code>
                        </pre>
                      );
                    },
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-3">
                        <table className="w-full text-xs border-collapse border border-gray-800" {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th className="border border-gray-800 px-3 py-1.5 bg-black/20 font-bold text-left" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border border-gray-800 px-3 py-1.5" {...props} />
                    ),
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-[520px] p-4 bg-transparent font-mono text-xs outline-none resize-none border-none"
                style={{ color: activeTheme.text }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
