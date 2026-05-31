import { useNavigate } from 'react-router-dom';

export const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-lg font-bold text-gray-800 font-sans">AI-Based Pre-Placement Trainer</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-6" />
          <h1 className="text-4xl font-black text-gray-900 font-sans mb-3">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Last Updated: May 31, 2026</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">1</span>
              Information We Collect
            </h2>
            <p className="mb-3">We collect the following types of information when you use our Platform:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account Information:</strong> Full name, email address, and encrypted password provided during registration.</li>
              <li><strong>Resume Data:</strong> Content extracted from uploaded resumes for keyword analysis and interview preparation.</li>
              <li><strong>Interview Data:</strong> Audio recordings, transcriptions, and AI-generated feedback from mock interview sessions.</li>
              <li><strong>Performance Data:</strong> Quiz scores, aptitude test results, learning progress, and session history.</li>
              <li><strong>Device & Usage Data:</strong> Browser type, IP address, pages visited, time spent, and interaction patterns.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">2</span>
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide, maintain, and improve our AI-powered training services.</li>
              <li>To personalize your learning experience and generate tailored interview questions.</li>
              <li>To analyze your performance and provide meaningful feedback and progress reports.</li>
              <li>To communicate important updates, security alerts, and service notifications.</li>
              <li>To ensure platform security, detect fraud, and enforce our Terms and Conditions.</li>
              <li>To conduct aggregated, anonymized research to improve our AI models and services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">3</span>
              Data Sharing & Third Parties
            </h2>
            <p className="mb-3">We do not sell your personal data. We may share limited data with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Google Cloud Services:</strong> For AI processing (Gemini API) and speech-to-text transcription.</li>
              <li><strong>Hosting Providers:</strong> Our backend and database are hosted on secure cloud infrastructure.</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our legal rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">4</span>
              Data Security & Retention
            </h2>
            <p className="mb-3">
              We implement industry-standard security measures including HTTPS encryption, JWT-based authentication, password hashing, 
              and access controls. Your data is retained for as long as your account is active. Upon account deletion, your personal 
              data will be removed within 30 days, except where retention is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">5</span>
              Your Rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and review the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your account and associated personal data.</li>
              <li>Withdraw consent for data processing at any time.</li>
              <li>Lodge a complaint with a relevant data protection authority.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">6</span>
              Contact Us
            </h2>
            <p className="mb-4">For privacy-related inquiries, contact us at:</p>
            <div className="bg-gray-50 rounded-xl p-6">
              <p><strong>Email:</strong> <a href="mailto:privacy@aitrainer.edu" className="text-primary hover:underline">privacy@aitrainer.edu</a></p>
            </div>
          </section>

          <div className="border-t border-gray-200 pt-8 mt-10 text-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-10 rounded-lg transition-all duration-200 uppercase text-sm tracking-wider shadow-button hover:shadow-card-hover"
            >
              I Understand, Go Back
            </button>
          </div>
        </div>

        <div className="text-center py-8 text-xs text-gray-400">
          © 2026 AI-Based Pre-Placement Trainer & Feedback Model. All rights reserved.
        </div>
      </div>
    </div>
  );
};
