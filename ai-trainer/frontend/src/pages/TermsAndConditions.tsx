import { useNavigate } from 'react-router-dom';

export const TermsAndConditions = () => {
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
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-6" />
          <h1 className="text-4xl font-black text-gray-900 font-sans mb-3">Terms & Conditions</h1>
          <p className="text-gray-500 text-sm">Last Updated: May 31, 2026</p>
          <p className="text-gray-400 text-xs mt-1">Effective Date: May 31, 2026</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">

          {/* 1. Introduction */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">1</span>
              Introduction & Acceptance of Terms
            </h2>
            <p className="mb-3">
              Welcome to the <strong>AI-Based Pre-Placement Trainer & Feedback Model</strong> ("Platform", "Service", "we", "us", or "our"). 
              These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User", "you", or "your") and the 
              Platform, governing your access to and use of all services, features, and content provided through our web application.
            </p>
            <p className="mb-3">
              By creating an account, accessing, or using any part of the Platform, you acknowledge that you have read, understood, and agree 
              to be bound by these Terms, along with our Privacy Policy. If you do not agree with any provision of these Terms, you must 
              immediately discontinue use of the Platform.
            </p>
            <p>
              We reserve the right to modify, update, or revise these Terms at any time without prior notice. Any changes will be effective 
              immediately upon posting on this page with an updated "Last Updated" date. Your continued use of the Platform after such changes 
              constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          {/* 2. Eligibility */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">2</span>
              Eligibility & Account Registration
            </h2>
            <p className="mb-3">
              To access and use the Platform, you must meet the following eligibility criteria:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>You must be at least <strong>16 years of age</strong> or the minimum age required in your jurisdiction to enter into a binding agreement.</li>
              <li>You must be a current student, recent graduate, or professional seeking to improve your placement and interview skills.</li>
              <li>You must provide accurate, truthful, and complete information during the registration process.</li>
              <li>You must not have been previously suspended or removed from the Platform for violation of these Terms.</li>
            </ul>
            <p className="mb-3">
              When registering an account, you agree to provide your full legal name, a valid email address, and a secure password. 
              You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur 
              under your account. You agree to immediately notify us of any unauthorized use of your account or any other breach of security.
            </p>
            <p>
              We reserve the right to refuse registration, suspend, or terminate any account at our sole discretion if we believe that 
              you have violated these Terms or if your account poses a risk to the Platform or other users.
            </p>
          </section>

          {/* 3. Description of Services */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">3</span>
              Description of Services
            </h2>
            <p className="mb-3">
              The Platform provides the following AI-powered educational and training services designed to help users prepare for 
              placement processes:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">a.</span>
                <p><strong>AI-Powered Mock Interviews:</strong> Simulated interview sessions using artificial intelligence that generate 
                domain-specific questions, evaluate your responses in real-time, and provide detailed performance feedback including 
                communication skills assessment, technical accuracy, and confidence analysis.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">b.</span>
                <p><strong>Aptitude Training & Testing:</strong> Comprehensive aptitude test modules covering quantitative reasoning, 
                logical reasoning, verbal ability, and data interpretation, with adaptive difficulty levels and performance tracking.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">c.</span>
                <p><strong>Resume Analysis:</strong> AI-driven resume parsing and keyword extraction to evaluate your resume's strengths 
                and provide improvement suggestions tailored to your target industry and roles.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">d.</span>
                <p><strong>Learning Modules:</strong> Curated educational content including video tutorials, study materials, and 
                topic-based learning paths to help build foundational and advanced skills.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-bold">e.</span>
                <p><strong>Performance Analytics:</strong> Comprehensive dashboards and reports tracking your progress, identifying 
                areas for improvement, and providing actionable insights for your preparation strategy.</p>
              </div>
            </div>
            <p>
              The Platform is intended solely for educational and training purposes. We do not guarantee employment, placement, or 
              any specific outcome as a result of using our services.
            </p>
          </section>

          {/* 4. User Conduct */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">4</span>
              User Conduct & Acceptable Use
            </h2>
            <p className="mb-3">
              By using the Platform, you agree to conduct yourself in a manner consistent with all applicable laws, regulations, 
              and these Terms. You expressly agree <strong>not</strong> to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Use the Platform for any unlawful, fraudulent, or unauthorized purpose.</li>
              <li>Attempt to gain unauthorized access to any part of the Platform, other user accounts, or any systems or networks connected to the Platform.</li>
              <li>Upload, transmit, or distribute any viruses, malware, trojans, or other harmful code.</li>
              <li>Scrape, crawl, or use automated tools to extract data from the Platform without express written permission.</li>
              <li>Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Platform's content or services for commercial purposes.</li>
              <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity.</li>
              <li>Interfere with or disrupt the integrity or performance of the Platform or the data contained therein.</li>
              <li>Upload content that is defamatory, obscene, abusive, invasive of privacy, or otherwise objectionable.</li>
              <li>Share your account credentials with third parties or allow multiple individuals to use a single account.</li>
              <li>Attempt to reverse-engineer, decompile, or disassemble any aspect of the Platform's software or AI models.</li>
            </ul>
            <p>
              Violation of any of the above may result in immediate suspension or termination of your account, without prior notice 
              or liability to you.
            </p>
          </section>

          {/* 5. AI-Generated Content */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">5</span>
              AI-Generated Content & Feedback Disclaimer
            </h2>
            <p className="mb-3">
              The Platform utilizes artificial intelligence and machine learning technologies (including but not limited to Google Gemini API) 
              to generate interview questions, evaluate responses, analyze resumes, and provide feedback.
            </p>
            <p className="mb-3">
              You acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>AI-generated content, feedback, and assessments are provided for <strong>educational and practice purposes only</strong> and should not be considered as professional career advice, employment guarantees, or definitive evaluations of your abilities.</li>
              <li>AI models may occasionally produce inaccurate, incomplete, or biased outputs. We do not warrant the accuracy, reliability, or completeness of any AI-generated content.</li>
              <li>The AI's evaluation of your interview performance, resume quality, or aptitude scores is an approximation and may not reflect the assessment criteria of actual employers or recruiters.</li>
              <li>You should use your own judgment and seek professional advice where necessary before making any career-related decisions based on the Platform's outputs.</li>
            </ul>
            <p>
              We continuously work to improve the accuracy and fairness of our AI systems, but we cannot guarantee error-free operation at all times.
            </p>
          </section>

          {/* 6. Intellectual Property */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">6</span>
              Intellectual Property Rights
            </h2>
            <p className="mb-3">
              All content, features, and functionality of the Platform — including but not limited to text, graphics, logos, icons, images, 
              audio clips, video content, data compilations, software, AI models, algorithms, and the overall design and layout — are the 
              exclusive property of the Platform and its licensors, and are protected by Indian and international copyright, trademark, 
              patent, trade secret, and other intellectual property laws.
            </p>
            <p className="mb-3">
              You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for your 
              personal, non-commercial educational purposes only. This license does not permit you to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Modify, adapt, or create derivative works based on the Platform's content.</li>
              <li>Download, copy, or store any content for distribution or commercial exploitation.</li>
              <li>Use data mining, robots, or similar data gathering and extraction tools on the Platform.</li>
              <li>Remove, alter, or obscure any copyright, trademark, or other proprietary notices.</li>
            </ul>
            <p>
              Any unauthorized use of the Platform's content may violate copyright, trademark, and other applicable laws and could result in criminal or civil penalties.
            </p>
          </section>

          {/* 7. User Data & Privacy */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">7</span>
              User Data, Privacy & Data Protection
            </h2>
            <p className="mb-3">
              Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our 
              <strong> Privacy Policy</strong>, which forms an integral part of these Terms. By using the Platform, you consent to the 
              collection and use of your data as described in the Privacy Policy.
            </p>
            <p className="mb-3">Key data practices include:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Personal Information:</strong> We collect your name, email address, and account credentials during registration.</li>
              <li><strong>Usage Data:</strong> We collect data about your interactions with the Platform, including interview sessions, quiz attempts, scores, and learning progress.</li>
              <li><strong>Resume Data:</strong> When you upload your resume, we process it to extract relevant keywords and information. Resume data is processed by AI services and may be temporarily stored for analysis purposes.</li>
              <li><strong>Audio/Video Data:</strong> During live interview sessions, audio recordings may be captured and processed using speech-to-text services (Google Cloud Speech-to-Text) for transcription and evaluation.</li>
              <li><strong>Analytics Data:</strong> We collect performance metrics and analytics data to provide you with progress reports and to improve our services.</li>
            </ul>
            <p className="mb-3">
              We implement industry-standard security measures including encryption, secure authentication (JWT tokens), and access controls 
              to protect your data. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee 
              absolute security.
            </p>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share anonymized, aggregated data for 
              research and service improvement purposes.
            </p>
          </section>

          {/* 8. Third-Party Services */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">8</span>
              Third-Party Services & APIs
            </h2>
            <p className="mb-3">
              The Platform integrates with third-party services to deliver its features. These include but are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Google Gemini API:</strong> For AI-powered question generation, response evaluation, and feedback generation.</li>
              <li><strong>Google Cloud Speech-to-Text:</strong> For processing audio input during live interview sessions.</li>
              <li><strong>Web Speech API:</strong> For text-to-speech functionality within the browser.</li>
            </ul>
            <p className="mb-3">
              Your use of the Platform may be subject to the terms and conditions of these third-party service providers. We are not 
              responsible for the practices, content, or availability of third-party services. Any data shared with third-party APIs 
              is governed by their respective privacy policies and terms of service.
            </p>
            <p>
              We do not guarantee uninterrupted availability of third-party services, and temporary disruptions may affect certain 
              features of the Platform.
            </p>
          </section>

          {/* 9. Limitation of Liability */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">9</span>
              Limitation of Liability & Disclaimers
            </h2>
            <p className="mb-3 font-semibold uppercase text-sm text-gray-800">
              To the maximum extent permitted by applicable law:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>The Platform is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind, whether express, implied, or statutory, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</li>
              <li>We do not warrant that the Platform will be uninterrupted, error-free, secure, or free of viruses or other harmful components.</li>
              <li>We shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, arising from your use of or inability to use the Platform.</li>
              <li>We shall not be liable for any damages resulting from unauthorized access to or alteration of your transmissions or data.</li>
              <li>Our total aggregate liability to you for any claims arising from or related to these Terms or your use of the Platform shall not exceed the amount you have paid to us, if any, in the twelve (12) months preceding the claim.</li>
            </ul>
            <p>
              Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities. In such jurisdictions, 
              our liability shall be limited to the fullest extent permitted by law.
            </p>
          </section>

          {/* 10. Indemnification */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">10</span>
              Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless the Platform, its developers, affiliates, officers, directors, employees, 
              agents, and licensors from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses 
              (including but not limited to attorney's fees) arising from: (a) your use of and access to the Platform; (b) your violation 
              of any provision of these Terms; (c) your violation of any third-party right, including but not limited to any intellectual 
              property right, privacy right, or proprietary right; or (d) any claim that your content or data caused damage to a third party. 
              This indemnification obligation shall survive the termination of your account and these Terms.
            </p>
          </section>

          {/* 11. Termination */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">11</span>
              Account Termination & Suspension
            </h2>
            <p className="mb-3">
              We reserve the right to suspend or terminate your account and access to the Platform at any time, with or without cause, 
              and with or without notice. Grounds for termination include, but are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Violation of any provision of these Terms.</li>
              <li>Engaging in fraudulent, abusive, or illegal activities.</li>
              <li>Requests by law enforcement or government agencies.</li>
              <li>Discontinuance or material modification of the Platform or any part thereof.</li>
              <li>Extended periods of inactivity.</li>
            </ul>
            <p>
              You may terminate your account at any time by contacting us. Upon termination, your right to use the Platform will 
              immediately cease, and we may delete your account data in accordance with our data retention policies. Provisions of 
              these Terms that by their nature should survive termination shall remain in full force and effect.
            </p>
          </section>

          {/* 12. Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">12</span>
              Governing Law & Dispute Resolution
            </h2>
            <p className="mb-3">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law 
              provisions. Any disputes arising out of or relating to these Terms or your use of the Platform shall be subject to the 
              exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India.
            </p>
            <p>
              Before initiating any formal legal proceedings, you agree to first attempt to resolve any disputes informally by contacting 
              us directly. If a dispute cannot be resolved informally within thirty (30) days, either party may pursue formal legal remedies 
              as permitted under applicable law.
            </p>
          </section>

          {/* 13. Miscellaneous */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">13</span>
              General Provisions
            </h2>
            <ul className="list-disc list-inside space-y-3 ml-4">
              <li><strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy, constitute the entire agreement between you and the Platform and supersede all prior agreements, understandings, and communications.</li>
              <li><strong>Severability:</strong> If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.</li>
              <li><strong>Waiver:</strong> The failure of the Platform to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.</li>
              <li><strong>Assignment:</strong> You may not assign or transfer your rights or obligations under these Terms without our prior written consent. We may assign our rights and obligations without restriction.</li>
              <li><strong>Force Majeure:</strong> We shall not be liable for any failure or delay in performing our obligations due to circumstances beyond our reasonable control, including but not limited to natural disasters, war, terrorism, pandemics, strikes, government actions, or internet/power failures.</li>
              <li><strong>Notices:</strong> All notices to you may be provided via email to the address associated with your account. Notices to us should be sent to the contact information provided below.</li>
            </ul>
          </section>

          {/* 14. Contact */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-black">14</span>
              Contact Information
            </h2>
            <p className="mb-4">
              If you have any questions, concerns, or feedback regarding these Terms and Conditions, please contact us at:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 space-y-2">
              <p><strong>Project:</strong> AI-Based Pre-Placement Trainer & Feedback Model</p>
              <p><strong>Department:</strong> Computer Engineering</p>
              <p><strong>Email:</strong> <a href="mailto:support@aitrainer.edu" className="text-primary hover:underline">support@aitrainer.edu</a></p>
            </div>
          </section>

          {/* Footer Acknowledgment */}
          <div className="border-t border-gray-200 pt-8 mt-10 text-center">
            <p className="text-sm text-gray-500 mb-4">
              By creating an account and using the Platform, you acknowledge that you have read, understood, and agree to be bound by 
              these Terms and Conditions in their entirety.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-10 rounded-lg transition-all duration-200 uppercase text-sm tracking-wider shadow-button hover:shadow-card-hover"
            >
              I Understand, Go Back
            </button>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="text-center py-8 text-xs text-gray-400">
          © 2026 AI-Based Pre-Placement Trainer & Feedback Model. All rights reserved.
        </div>
      </div>
    </div>
  );
};
