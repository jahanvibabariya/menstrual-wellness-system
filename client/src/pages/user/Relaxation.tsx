import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Play, Square, Heart, Wind, Moon, HelpCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { adminService } from '@/services/adminService';
import type { Content } from '@/types';

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

export const Relaxation: React.FC = () => {
  const [tips, setTips] = useState<Content[]>([]);
  const [loadingTips, setLoadingTips] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Breathing exercise states
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('idle');
  const [breathCount, setBreathCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const data = await adminService.getContent();
        setTips(data.filter(c => c.isPublished));
      } catch {
        // fallback
      } finally {
        setLoadingTips(false);
      }
    };
    fetchTips();
  }, []);

  // Breathing timer loop
  useEffect(() => {
    if (breathPhase === 'idle') return;

    let timer: any;
    if (secondsLeft > 0) {
      timer = setTimeout(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else {
      // Transition to next phase
      if (breathPhase === 'inhale') {
        setBreathPhase('hold');
        setSecondsLeft(4);
      } else if (breathPhase === 'hold') {
        setBreathPhase('exhale');
        setSecondsLeft(4);
      } else if (breathPhase === 'exhale') {
        setBreathPhase('inhale');
        setSecondsLeft(4);
        setBreathCount(prev => prev + 1);
      }
    }

    return () => clearTimeout(timer);
  }, [breathPhase, secondsLeft]);

  const startBreathing = () => {
    setBreathPhase('inhale');
    setSecondsLeft(4);
    setBreathCount(0);
  };

  const stopBreathing = () => {
    setBreathPhase('idle');
    setSecondsLeft(0);
    setBreathCount(0);
  };

  const getBreathingMessage = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Inhale deeply... Fill your lungs';
      case 'hold':
        return 'Hold... Feel the calmness';
      case 'exhale':
        return 'Exhale slowly... Let go of all pain';
      default:
        return 'Ready to find your peace?';
    }
  };

  const fallbackTips: Partial<Content>[] = [
    {
      title: 'Apply Warm Heat',
      category: 'wellness_tip',
      description: 'Applying a heating pad or heat wrap to your abdomen helps relax tight uterine muscles, significantly reducing cramp intensity.',
    },
    {
      title: 'Hydrate with Warm Teas',
      category: 'wellness_tip',
      description: 'Drinking warm beverages like chamomile, ginger, or peppermint tea increases blood flow to muscles and helps ease cramps.',
    },
    {
      title: 'Gentle Stretches',
      category: 'wellness_tip',
      description: 'Yoga poses like Child Pose (Balasana) and Cat-Cow help release tension in the lower back and pelvis.',
    }
  ];

  const displayedTips = (tips.length > 0 ? tips.filter(t => t.category === 'wellness_tip') : fallbackTips)
    .filter(t =>
      !searchQuery ||
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const educationalContent = tips.length > 0
    ? tips.filter(t => t.category === 'education')
        .filter(t =>
          !searchQuery ||
          t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.content?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-rose-500" /> Guided Relaxation & Wellness
          </h1>
          <p className="text-gray-500">
            Nourish your mind and body with calming breathing exercises, wellness tips, and guides.
          </p>
        </div>
      </div>

      {searchQuery && (
        <div className="bg-rose-50/70 border border-rose-100/60 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
          <span className="text-sm text-rose-700 font-semibold">
            Showing search results for "<span className="italic">{searchQuery}</span>"
          </span>
          <button
            onClick={() => {
              searchParams.delete('search');
              setSearchParams(searchParams);
            }}
            className="text-xs bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Breathing Exercise Card */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col items-center justify-between p-8 text-center bg-gradient-to-br from-white/90 to-rose-50/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lavender-200/10 rounded-full blur-xl -translate-y-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-200/20 rounded-full blur-xl translate-y-10" />
            
            <div className="w-full flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-rose-600 font-semibold">
                <Wind className="w-5 h-5 animate-pulse" />
                <span>4-4-4 Relaxing Breath</span>
              </div>
              <div className="text-sm font-medium text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                Cycles: <span className="text-rose-600 font-bold">{breathCount}</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center my-8">
              {/* Animated Circle Container */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {breathPhase !== 'idle' && (
                  <>
                    <div className={`absolute inset-0 border-2 border-rose-300/20 rounded-full animate-ping duration-1000`} />
                    <div className="absolute inset-4 border-2 border-lavender-300/30 rounded-full animate-pulse" />
                  </>
                )}
                <div
                  className={`w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-[4000ms] ease-in-out
                    ${breathPhase === 'inhale' ? 'scale-125 bg-rose-300/30 border-2 border-rose-400/50' : ''}
                    ${breathPhase === 'hold' ? 'scale-125 bg-lavender-300/40 border-2 border-lavender-400/60' : ''}
                    ${breathPhase === 'exhale' ? 'scale-100 bg-rose-100/40 border-2 border-rose-200/40' : ''}
                    ${breathPhase === 'idle' ? 'scale-100 bg-rose-50/50 border border-rose-200/30' : ''}
                  `}
                >
                  <span className="text-4xl font-display font-bold text-rose-600 transition-all duration-300">
                    {secondsLeft > 0 ? secondsLeft : ''}
                  </span>
                  {breathPhase !== 'idle' && (
                    <span className="text-xs uppercase tracking-wider font-semibold text-rose-500 mt-2">
                      {breathPhase}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-8 min-h-[2rem]">
                {getBreathingMessage()}
              </h3>
            </div>

            <div className="flex gap-4 justify-center w-full max-w-xs mt-6">
              {breathPhase === 'idle' ? (
                <Button onClick={startBreathing} className="w-full flex items-center justify-center gap-2 py-4">
                  <Play className="w-5 h-5 fill-current" /> Start Exercise
                </Button>
              ) : (
                <Button onClick={stopBreathing} variant="danger" className="w-full flex items-center justify-center gap-2 py-4">
                  <Square className="w-5 h-5 fill-current" /> Stop / Reset
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Relaxation Guide List */}
        <div className="space-y-6">
          <h2 className="text-xl font-display font-bold text-gray-800 flex items-center gap-2">
            <Moon className="w-5 h-5 text-lavender-500" /> Relaxation Guides
          </h2>
          
          <div className="space-y-4">
            <Card className="hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Progressive Muscle Relaxation
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Tense each muscle group for 5 seconds, then release. Focus on pelvis and lower back release.
              </p>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lavender-400" /> Body Scan Meditation
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Close your eyes and mentally scan from toes to head. Notice any discomfort and breathe warmth into it.
              </p>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sage-400" /> Visualization Exercise
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Visualize a calming heat radiating outward from your pelvic core, relaxing every fiber and tissue.
              </p>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-coral-400" /> Child Pose Yoga (Balasana)
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Kneel, sit back on your heels, and fold forward, resting forehead on floor to extend the lower back.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Wellness Tips & Education Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500" /> Personalized Wellness Insights
        </h2>

        {loadingTips ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-40 bg-gray-100/50 animate-pulse rounded-2xl" />
            <div className="h-40 bg-gray-100/50 animate-pulse rounded-2xl" />
            <div className="h-40 bg-gray-100/50 animate-pulse rounded-2xl" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {displayedTips.map((tip, index) => (
              <Card key={index} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="badge-rose mb-3">Wellness Tip</span>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{tip.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Educational Hub */}
      {educationalContent.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-lavender-500" /> Educational Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {educationalContent.map((item) => (
              <Card key={item._id} className="p-6 hover:shadow-md transition-shadow">
                <span className="badge-lavender mb-3">Education</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                <div className="text-sm text-gray-700 leading-relaxed line-clamp-3 whitespace-pre-line">
                  {item.content}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Relaxation;
