import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/dashboard/Navigation';
import { Sidebar, TopicContent } from '../components/learning';
import { TOPICS, getTopicById } from '../data/aptitudeData';

export const Learning = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);

  useEffect(() => {
    // If a topic ID is provided in the URL, use it
    if (topicId) {
      setActiveTopicId(parseInt(topicId));
    } else if (TOPICS.length > 0 && !activeTopicId) {
      // Default to first topic
      setActiveTopicId(TOPICS[0].id);
    }
  }, [topicId]);

  const handleSelectTopic = (id: number) => {
    setActiveTopicId(id);
    navigate(`/learning/${id}`);
  };

  const activeTopic = activeTopicId ? getTopicById(activeTopicId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <div className="pt-16 flex">
        {/* Sidebar */}
        <Sidebar
          topics={TOPICS}
          activeTopicId={activeTopicId}
          onSelectTopic={handleSelectTopic}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-6 lg:p-8">
          {activeTopic ? (
            <TopicContent topic={activeTopic} />
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <span className="text-6xl mb-4">📚</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Learning</h2>
              <p className="text-gray-500 mb-6">Select a topic from the sidebar to get started</p>
              <button
                onClick={() => TOPICS.length > 0 && handleSelectTopic(TOPICS[0].id)}
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition"
              >
                Start with {TOPICS[0]?.name || 'First Topic'}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
