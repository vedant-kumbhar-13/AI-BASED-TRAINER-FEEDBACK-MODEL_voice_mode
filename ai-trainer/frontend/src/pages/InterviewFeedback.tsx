import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from '../components/dashboard/Navigation';
import { 
  RotateCcw, ChevronDown, ChevronUp, 
  CheckCircle, AlertTriangle, Trophy, ArrowRight, Home
} from 'lucide-react';

interface QuestionAnswer {
  question: {
    question_text: string;
    question_number: number;
    category: string;
  };
  answer: string;
  feedback: {
    score: number;
    ai_feedback: string;
    strengths: string[];
    improvements: string[];
  };
}

export const InterviewFeedback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // New flow: { evaluation, sessionId }
  const evaluation = location.state?.evaluation;
  // Old flow: { session, feedback, answers }
  const session  = location.state?.session;
  const feedback = location.state?.feedback;
  const answers: QuestionAnswer[] = location.state?.answers || [];

  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  // ── Extract scores ── prefer new evaluation, fall back to session
  // NOTE: Backend submit_all already scales 0–10 → 0–100 via to_100()
  const scores = evaluation?.scores || {};
  const overallScore       = evaluation
    ? (evaluation.overall_score ?? 0)
    : session?.overall_score;
  const communicationScore = evaluation
    ? (scores.communication ?? 0)
    : session?.communication_score;
  const technicalScore = evaluation
    ? (scores.technical ?? 0)
    : session?.technical_score;
  const confidenceScore = evaluation
    ? (scores.confidence ?? 0)
    : session?.confidence_score;

  // ── Strengths / improvements ──
  const strengths: string[]    = evaluation
    ? (evaluation.top_strength ? [evaluation.top_strength] : [])
    : (feedback?.strengths || []);
  const improvements: string[] = evaluation
    ? (evaluation.top_weakness ? [evaluation.top_weakness] : [])
    : (feedback?.weaknesses || []);
  const recommendations: string[] = evaluation?.recommendations || [];
  const summary: string = evaluation?.summary || feedback?.overall_summary || '';
  const placement: string = evaluation?.placement_readiness || '';

  // ── Per-question results from submit-all ──
  const questionResults: any[] = evaluation?.question_results || [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number | undefined) => {
    if (score === undefined) return 'No Data';
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-card">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-light to-white border-4 border-primary flex items-center justify-center">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Interview Complete!</h1>
              <p className="text-gray-500">Here's your detailed performance analysis</p>
            </div>

            {/* Overall Score */}
            <div className="text-center mb-8">
              <div className="inline-flex items-baseline">
                <span className={`text-6xl font-bold ${overallScore !== undefined ? getScoreColor(overallScore) : 'text-gray-400'}`}>
                  {overallScore !== undefined ? Math.round(overallScore) : 'NA'}
                </span>
                {overallScore !== undefined && <span className="text-2xl text-gray-400 ml-1">/100</span>}
              </div>
              <p className="text-lg font-bold text-gray-800 mt-2">{getScoreLabel(overallScore)} Performance</p>
              <div className="w-full max-w-md mx-auto mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${overallScore || 0}%` }}
                />
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Communication', score: communicationScore, icon: '💬' },
                { label: 'Technical', score: technicalScore, icon: '💻' },
                { label: 'Confidence', score: confidenceScore, icon: '⚡' },
                { label: 'Overall', score: overallScore, icon: '🎯' }
              ].map((metric, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl text-center">
                  <span className="text-2xl mb-2 block">{metric.icon}</span>
                  <p className="text-2xl font-bold text-gray-800">
                    {metric.score !== undefined ? `${Math.round(metric.score)}%` : 'NA'}
                  </p>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="font-bold text-gray-800">Strengths</h2>
              </div>
              {strengths.length > 0 ? (
                <ul className="space-y-3">
                  {strengths.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No specific strengths identified</p>
              )}
            </div>

            {/* Improvements */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="font-bold text-gray-800">Areas to Improve</h2>
              </div>
              {improvements.length > 0 ? (
                <ul className="space-y-3">
                  {improvements.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="text-yellow-500 mt-0.5">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No specific improvements identified</p>
              )}
            </div>
          </div>

          {/* Summary + Recommendations (new submit-all flow) */}
          {(summary || recommendations.length > 0) && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {summary && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-bold text-gray-800 mb-3">Overall Assessment</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
                  {placement && (
                    <span className="inline-block mt-4 px-3 py-1 bg-primary-light text-primary text-xs font-bold rounded-full capitalize">
                      {placement.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
              )}
              {recommendations.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="font-bold text-gray-800 mb-3">🎯 Recommendations</h2>
                  <ul className="space-y-3">
                    {recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <span className="text-primary mt-0.5 font-bold">{i + 1}.</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Question Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-bold text-gray-800">Question-by-Question Breakdown</h2>
            </div>

            {questionResults.length > 0 ? (
              /* New flow: per-question results from submit-all */
              questionResults.map((qr: any, index: number) => {
                const scoreVal = Math.round(qr.score ?? 0);
                return (
                  <div key={index} className="border-b border-gray-100 last:border-0">
                    <button
                      onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-sm">
                          Q{qr.question_index}
                        </span>
                        <p className="font-medium text-gray-800 text-sm line-clamp-1">
                          {qr.strength || 'See feedback below'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${getScoreColor(scoreVal)}`}>{scoreVal}%</span>
                        {expandedQuestion === index
                          ? <ChevronUp className="w-5 h-5 text-gray-400" />
                          : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                    </button>
                    {expandedQuestion === index && (
                      <div className="px-4 pb-4 bg-gray-50">
                        <div className="ml-12 space-y-3">
                          {qr.feedback && (
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase mb-1">AI Feedback</p>
                              <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">{qr.feedback}</p>
                            </div>
                          )}
                          {qr.improvement && (
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Improvement Area</p>
                              <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">→ {qr.improvement}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : answers.length > 0 ? (
              /* Old flow: session answers */
              answers.map((qa, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-sm">
                        Q{qa.question.question_number}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1">{qa.question.question_text}</p>
                        <p className="text-sm text-gray-500">{qa.question.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${getScoreColor(qa.feedback?.score || 70)}`}>
                        {qa.feedback?.score || 70}%
                      </span>
                      {expandedQuestion === index
                        ? <ChevronUp className="w-5 h-5 text-gray-400" />
                        : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </button>
                  {expandedQuestion === index && (
                    <div className="px-4 pb-4 bg-gray-50">
                      <div className="ml-12 space-y-4">
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Your Answer</p>
                          <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">{qa.answer}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">AI Feedback</p>
                          <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                            {qa.feedback?.ai_feedback || 'Good attempt!'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">No question data available</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/ai-interview')}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-button flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Retry Interview
            </button>
            
            <button
              onClick={() => navigate('/ai-interview-history')}
              className="px-6 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary-light flex items-center justify-center gap-2"
            >
              View History
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewFeedback;
