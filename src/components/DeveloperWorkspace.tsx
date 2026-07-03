import React, { useState } from 'react';
import { rnCodebase, CodeFile } from '../data/rnCodebase';
import { 
  FileCode, Terminal, BookOpen, Briefcase, Copy, Check, ChevronRight, 
  Settings, Database, Network, Shield, Download, Smartphone, Heart, HelpCircle 
} from 'lucide-react';

export const DeveloperWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'docs' | 'resume' | 'terminal'>('code');
  const [selectedFile, setSelectedFile] = useState<CodeFile>(rnCodebase[1]); // App.js by default
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  const handleCopyCode = (code: string, path: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFileId(path);
    setTimeout(() => setCopiedFileId(null), 2000);
  };

  // Resume Text assets
  const resumeAssets = {
    title: "TaskFlow Mobile Task Management Suite",
    stack: "React Native, Expo SDK, JavaScript (ES6+), React Navigation, Context API, Axios REST API, AsyncStorage, Tailwind CSS",
    bullets: [
      "Designed and developed a production-ready cross-platform task manager utilizing React Native and Expo SDK, delivering fluid responsive rendering for both iOS and Android platforms.",
      "Engineered an offline-first data caching system leveraging AsyncStorage to store task states and session variables, resulting in instant client load times and seamless operations during network disruptions.",
      "Integrated public REST APIs using Axios with custom request/response interceptors to synchronize mock todos from JSONPlaceholder, implementing robust exception handling and fallback states.",
      "Architected a scalable navigation schema using React Navigation, configuring Stack and Bottom-Tab nested structures with secure route guard decorators to segregate unauthenticated flows.",
      "Optimized scroll rendering behavior of high-volume task catalogs by structuring lightweight FlatList arrays with custom React.memo caching, dropping unwanted DOM repaint and re-render spikes.",
      "Built a modern mobile UI matching design standards, featuring a fluid light/dark mode configuration, floating action controllers, priority pills, and swipeable gesture panels."
    ],
    readme: `# TaskFlow Mobile

TaskFlow is a modern, responsive cross-platform task management application built with **React Native** and **Expo**. It supports full task workflows (creation, priority levels, category tagging, search filters), offline session caching via AsyncStorage, and API synchronization.

## 🚀 Key Features

- **Bottom Tab & Stack Navigation**: Nested protected navigation patterns using React Navigation.
- **REST API Integration**: Axios client communicating with JSONPlaceholder for initial synchronization.
- **Async Caching**: Persistent offline task data and preference management.
- **Visual Styling**: Sleek Dark Mode, priority indicator badges, and responsive layouts.

## 🛠️ Getting Started

1. **Clone the Repo & Install Dependencies**
   \`\`\`bash
   git clone https://github.com/yourusername/taskflow-mobile.git
   cd taskflow-mobile
   npm install
   \`\`\`

2. **Run on Expo Dev Server**
   \`\`\`bash
   npx expo start
   \`\`\`
   - Press **a** for Android Emulator.
   - Press **i** for iOS Simulator.
   - Scan the QR code with your Expo Go app to test on physical mobile devices!`,

    linkedin: `🚀 Thrilled to share my latest mobile project: **TaskFlow Mobile**! 📱

TaskFlow is a modern cross-platform task management application I built using **React Native** and the **Expo SDK**! To make this suitable for corporate engineering standards, I focused heavily on modular architecture and performance optimization:

🌟 Key Implementation Details:
- 🛠️ **Navigation Structure**: Built Stack & Tab navigators cleanly using React Navigation.
- 🗄️ **Offline-First Storage**: Implemented asynchronous local persistence using AsyncStorage.
- 🌐 **REST APIs**: Connected an Axios networking layer to public todo endpoints with custom interceptor error handling.
- 🎨 **Modern Interface**: Designed a light/dark mode matching modern visual guidelines.
- ⚡ **FlatList Optimizations**: Handled list cell caching to avoid unnecessary paint cycles.

Check out the full repository here and let me know your thoughts! 👇
#ReactNative #Expo #MobileDevelopment #SoftwareEngineering #Portfolio`
  };

  return (
    <div className="flex flex-col h-full bg-white text-zinc-900 border-l border-zinc-150">
      {/* Workspace Header */}
      <div className="px-6 py-4 border-b border-zinc-150 flex items-center justify-between bg-white">
        <div>
          <span className="text-[9px] font-black tracking-widest text-zinc-400 block uppercase">Workspace Console</span>
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-950 mt-0.5">TaskFlow Codebase</h2>
        </div>
        <div className="flex gap-2 text-[10px] font-black tracking-wider uppercase">
          <span className="text-zinc-400">STATUS:</span>
          <span className="text-zinc-950">READY TO DEPLOY</span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-zinc-150 bg-white overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all shrink-0 ${
            activeTab === 'code' 
              ? 'border-zinc-950 text-zinc-950 bg-white' 
              : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50/50'
          }`}
          id="tab-code-explorer"
        >
          <FileCode size={13} />
          <span>Code Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all shrink-0 ${
            activeTab === 'docs' 
              ? 'border-zinc-950 text-zinc-950 bg-white' 
              : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50/50'
          }`}
          id="tab-docs"
        >
          <BookOpen size={13} />
          <span>Guides & Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab('resume')}
          className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all shrink-0 ${
            activeTab === 'resume' 
              ? 'border-zinc-950 text-zinc-950 bg-white' 
              : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50/50'
          }`}
          id="tab-resume"
        >
          <Briefcase size={13} />
          <span>Career Assets</span>
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex items-center gap-2 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all shrink-0 ${
            activeTab === 'terminal' 
              ? 'border-zinc-950 text-zinc-950 bg-white' 
              : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50/50'
          }`}
          id="tab-terminal"
        >
          <Terminal size={13} />
          <span>CLI & Commands</span>
        </button>
      </div>

      {/* Workspace Panel Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full min-h-[450px]">
            {/* File List Navigation */}
            <div className="col-span-1 border border-zinc-150 rounded-xl overflow-hidden bg-white flex flex-col h-fit">
              <div className="px-3.5 py-2.5 border-b border-zinc-150 bg-[#FAFAFA] text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                Project Files
              </div>
              <div className="divide-y divide-zinc-100 text-xs overflow-y-auto max-h-[400px]">
                {rnCodebase.map((file) => {
                  const isSelected = selectedFile.path === file.path;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                        isSelected 
                          ? 'bg-zinc-950 text-white font-black' 
                          : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                      }`}
                      id={`file-btn-${file.name}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode size={13} className={isSelected ? 'text-white' : 'text-zinc-400'} />
                        <span className="truncate text-xs">{file.name}</span>
                      </div>
                      <ChevronRight size={12} className={isSelected ? 'text-zinc-400' : 'text-zinc-300'} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Code Content Viewer */}
            <div className="col-span-1 md:col-span-3 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 flex flex-col">
              <div className="px-4 py-3 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider">{selectedFile.path}</span>
                  <span className="text-xs text-white font-black mt-0.5 block">{selectedFile.name}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(selectedFile.content, selectedFile.path)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    copiedFileId === selectedFile.path 
                      ? 'bg-zinc-100 text-zinc-950' 
                      : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300'
                  }`}
                  id="copy-mobile-code"
                >
                  {copiedFileId === selectedFile.path ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedFileId === selectedFile.path ? 'copied' : 'copy'}</span>
                </button>
              </div>
              <div className="flex-1 p-4 overflow-auto max-h-[500px] font-mono text-xs text-zinc-300 bg-zinc-950 leading-relaxed scrollbar-thin">
                <pre><code>{selectedFile.content}</code></pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-6 max-w-4xl text-sm leading-relaxed text-zinc-600">
            {/* Architecture Overview */}
            <div className="p-5 border border-zinc-150 rounded-xl bg-white">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950 flex items-center gap-2 mb-3">
                <Settings size={14} className="text-zinc-400" />
                <span>Mobile Architecture Design Patterns</span>
              </h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                TaskFlow's React Native implementation separates the application into five independent, clean layers to demonstrate senior-level software organization:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-zinc-50/50 rounded-xl border border-zinc-150">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-950 flex items-center gap-1.5 mb-1.5">
                    <Database size={13} className="text-zinc-400" /> Context API State
                  </span>
                  <p className="text-xs text-zinc-500 leading-normal">
                    Serves as a centralized reactive engine. Coordinates user logins, task arrays, responsive state hooks, and light/dark configurations.
                  </p>
                </div>
                <div className="p-4 bg-zinc-50/50 rounded-xl border border-zinc-150">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-950 flex items-center gap-1.5 mb-1.5">
                    <Smartphone size={13} className="text-zinc-400" /> React Navigation
                  </span>
                  <p className="text-xs text-zinc-500 leading-normal">
                    Leverages native stack screen wrappers and tab navigators. Uses protected route wrappers that evaluate the user login context dynamically.
                  </p>
                </div>
                <div className="p-4 bg-zinc-50/50 rounded-xl border border-zinc-150">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-950 flex items-center gap-1.5 mb-1.5">
                    <Network size={13} className="text-zinc-400" /> Service API (Axios)
                  </span>
                  <p className="text-xs text-zinc-500 leading-normal">
                    Abstracts API communication away from UI code. Contains global axios interceptors to process errors and set headers systematically.
                  </p>
                </div>
                <div className="p-4 bg-zinc-50/50 rounded-xl border border-zinc-150">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-950 flex items-center gap-1.5 mb-1.5">
                    <Shield size={13} className="text-zinc-400" /> AsyncStorage Caching
                  </span>
                  <p className="text-xs text-zinc-500 leading-normal">
                    Syncs and persists state using AsyncStorage key-value structures. Supports robust offline-first fallback schemas if public network queries time out.
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step EAS Build Instructions */}
            <div className="p-5 border border-zinc-150 rounded-xl bg-white">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950 flex items-center gap-2 mb-3.5">
                <Download size={14} className="text-zinc-400" />
                <span>Production APK Generation using EAS Build</span>
              </h3>
              <ol className="space-y-4 text-xs text-zinc-500 list-decimal pl-4 leading-relaxed">
                <li>
                  <strong className="text-zinc-800 block mb-1">Install Expo Application Services (EAS) CLI</strong>
                  <pre className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 text-zinc-300 font-mono mt-1 font-bold">npm install -g eas-cli</pre>
                </li>
                <li>
                  <strong className="text-zinc-800 block mb-1">Authenticate with Expo account</strong>
                  <pre className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 text-zinc-300 font-mono mt-1 font-bold">eas login</pre>
                </li>
                <li>
                  <strong className="text-zinc-800 block mb-1">Configure EAS Build in mobile folder</strong>
                  <pre className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 text-zinc-300 font-mono mt-1 font-bold">eas build:configure</pre>
                </li>
                <li>
                  <strong className="text-zinc-800 block mb-1">Initiate Android APK Build</strong>
                  <p className="mt-1 mb-2">Run the build command and select the profile options. EAS handles compiling key credentials and compiles output inside Expo cloud servers, delivering an APK link on completion:</p>
                  <pre className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 text-zinc-300 font-mono mt-1 font-bold">eas build -p android --profile preview</pre>
                </li>
              </ol>
            </div>

            {/* Play Store publishing pipeline */}
            <div className="p-5 border border-zinc-150 rounded-xl bg-white">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950 flex items-center gap-2 mb-3">
                <Smartphone size={14} className="text-zinc-400" />
                <span>Google Play Store Publishing Checklist</span>
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                Publishing TaskFlow to the Google Play Store is a systematic process requiring several developer validation checkpoints:
              </p>
              <ul className="space-y-2 text-xs text-zinc-500 list-disc pl-4">
                <li><strong className="text-zinc-800">Google Play Console Account</strong>: Create a Google Developer Account ($25 lifetime registration fee).</li>
                <li><strong className="text-zinc-800">Generate AAB Release Bundle</strong>: Build an optimized Android App Bundle using <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-900 font-mono text-[11px] font-bold">eas build -p android --profile production</code>.</li>
                <li><strong className="text-zinc-800">Store Listing Details</strong>: Prepare short/long descriptions, custom 512x512 app icons, and high-quality 1080p mobile screen recordings.</li>
                <li><strong className="text-zinc-800">Privacy Policy</strong>: Host a static terms and privacy details document (required for apps that transmit network data).</li>
                <li><strong className="text-zinc-800">Release Assessment Track</strong>: Deploy the build bundle inside the Closed Testing track first. Get 20 testers to validate the app for 14 continuous days before moving to Production Review.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="space-y-6 max-w-4xl">
            {/* Resume Details block */}
            <div className="p-5 border border-zinc-150 rounded-xl bg-white">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-150 pb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950 flex items-center gap-2">
                  <Briefcase size={14} className="text-zinc-400" />
                  <span>Resume Section (ATS-Optimized)</span>
                </h3>
                <button
                  onClick={() => handleCopyText(resumeAssets.bullets.join('\n'), 'resume-bullets')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    copiedTextId === 'resume-bullets' 
                      ? 'bg-zinc-950 text-white' 
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200'
                  }`}
                  id="copy-resume-bullets"
                >
                  {copiedTextId === 'resume-bullets' ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedTextId === 'resume-bullets' ? 'copied' : 'copy'}</span>
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <span className="text-[9px] font-black tracking-widest text-zinc-400 block uppercase mb-1">Project Name / Resume Title</span>
                  <span className="text-sm font-black text-zinc-950 tracking-tight block">{resumeAssets.title}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-widest text-zinc-400 block uppercase mb-1">Technical Skills Stack</span>
                  <span className="text-xs text-zinc-950 bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded-lg font-mono mt-1 block leading-normal font-bold">
                    {resumeAssets.stack}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-widest text-zinc-400 block uppercase mb-2">Portfolio Impact Bullet Points</span>
                  <ul className="space-y-3 text-xs text-zinc-600 list-disc pl-4 leading-relaxed font-medium">
                    {resumeAssets.bullets.map((bullet, idx) => (
                      <li key={idx}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* LinkedIn Post Asset */}
            <div className="p-5 border border-zinc-150 rounded-xl bg-white">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">LinkedIn Project Completion Post</h4>
                <button
                  onClick={() => handleCopyText(resumeAssets.linkedin, 'linkedin-post')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    copiedTextId === 'linkedin-post' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                  id="copy-linkedin-post"
                >
                  {copiedTextId === 'linkedin-post' ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedTextId === 'linkedin-post' ? 'copied' : 'copy'}</span>
                </button>
              </div>
              <div className="bg-[#FAFAFA] p-4 rounded-xl border border-zinc-150 text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap font-sans font-medium">
                {resumeAssets.linkedin}
              </div>
            </div>

            {/* GitHub README Markdown Asset */}
            <div className="p-5 border border-zinc-150 rounded-xl bg-white">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">GitHub README.md</h4>
                <button
                  onClick={() => handleCopyText(resumeAssets.readme, 'readme-markdown')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    copiedTextId === 'readme-markdown' ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                  id="copy-readme-markdown"
                >
                  {copiedTextId === 'readme-markdown' ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedTextId === 'readme-markdown' ? 'copied' : 'copy'}</span>
                </button>
              </div>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 text-xs font-mono text-zinc-300 overflow-auto max-h-[250px] scrollbar-thin">
                <pre>{resumeAssets.readme}</pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="space-y-6 max-w-4xl">
            {/* CLI Commands Reference */}
            <div className="p-5 border border-zinc-900 rounded-xl bg-zinc-950 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Terminal size={14} className="text-zinc-500" />
                  <span className="font-bold">Expo CLI Terminal Commands</span>
                </div>
                <span className="text-[10px] text-zinc-600">bash</span>
              </div>

              <div className="space-y-4 text-zinc-300">
                <div>
                  <span className="text-zinc-600 block"># 1. Initialize fresh expo project with routing dependencies</span>
                  <pre className="text-zinc-200 mt-1 font-bold">npx create-expo-app taskflow-mobile --template blank</pre>
                </div>
                <div>
                  <span className="text-zinc-600 block"># 2. Add required mobile libraries</span>
                  <pre className="text-zinc-200 mt-1 font-bold">npx expo install @react-native-async-storage/async-storage @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-safe-area-context react-native-screens axios</pre>
                </div>
                <div>
                  <span className="text-zinc-600 block"># 3. Boot local development server</span>
                  <pre className="text-zinc-200 mt-1 font-bold">npx expo start</pre>
                </div>
                <div>
                  <span className="text-zinc-600 block"># 4. Trigger build compilations on EAS servers</span>
                  <pre className="text-zinc-200 mt-1 font-bold">eas build -p android --profile preview</pre>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-zinc-150 bg-white text-xs text-zinc-500 flex items-start gap-3">
              <HelpCircle size={16} className="text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-950 block">Interpreting Expo Terminal Outputs</span>
                <p className="mt-1 leading-relaxed">
                  Executing <code className="bg-zinc-100 px-1.5 py-0.5 text-zinc-900 rounded text-[11px] font-bold">npx expo start</code> initiates a Metro Bundler server. Scanning the printed QR Code on screen with an Expo Go mobile client compiles the JS bundles on-the-fly, giving you instantaneous hot module reloads directly on real iOS or Android devices!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="px-6 py-4 border-t border-zinc-150 bg-white text-center flex items-center justify-between text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
        <span>
          Made for Portfolio & Careers
        </span>
        <span>© 2026 TaskFlow Mobile Project</span>
      </div>
    </div>
  );
};
