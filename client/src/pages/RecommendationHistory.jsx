// client/src/pages/RecommendationHistory.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import { getUser } from "../hooks/useAuth";

const RecommendationHistory = () => {
  const user = getUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/dashboard/recommendation-history/${user.id}`
        );

        if (res.data.success) {
          setHistory(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to load recommendation history", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchHistory();
    }
  }, [user]);

  const getYogaImage = (keyword) => {
    if (!keyword) return "/images/yoga-placeholder.jpg";
    const fileName = keyword.includes('.') ? keyword : `${keyword}.jpg`;
    return `/images/asanas/${fileName}`;
  };

  const getRemedyImage = (keyword) => {
    if (!keyword) return "/images/remedy-placeholder.jpg";
    const fileName = keyword.includes('.') ? keyword : `${keyword}.jpg`;
    return `/images/remedies/${fileName}`;
  };

  return (
    <div className="min-h-screen bg-ayur-gradient">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-20">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 tracking-tight">
          Recommendation History 🌿
        </h1>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-600 text-lg animate-pulse">Loading your wellness journey...</p>
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 text-lg">No previous recommendations found.</p>
          </div>
        )}

        <div className="space-y-12">
          {history.map((rec, index) => (
            <div
              key={rec.id}
              className="bg-white/90 backdrop-blur-md rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-50 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Plan from {new Date(rec.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    {index === 0 && <span className="ml-3 text-xs bg-emerald-500 text-white px-3 py-1 rounded-full uppercase tracking-wider">Latest</span>}
                  </h2>
                  <p className="text-slate-500 mt-1">Focus: {rec.healthIssues}</p>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-1.5 rounded-xl text-sm font-bold border ${rec.severity === 'Severe' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {rec.severity || "General"}
                  </span>
                </div>
              </div>

              {/* Dosha Analysis */}
              {rec.doshaAnalysis && (
                <div className="mb-8 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                  <h3 className="text-emerald-900 font-bold mb-2 flex items-center">
                    <span className="mr-2">✨</span> Dosha Insights
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed">{rec.doshaAnalysis}</p>
                </div>
              )}

              {/* Yoga Section */}
              {rec.yoga && rec.yoga.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-bold mb-5 text-slate-800 flex items-center">
                    🧘 Yoga Sequence
                  </h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {rec.yoga.map((yoga, i) => (
                      <div key={i} className="group bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100 hover:border-emerald-200 transition-all">
                        <div className="h-40 overflow-hidden relative">
                          <img
                            src={getYogaImage(yoga.image_keyword)}
                            alt={yoga.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => { e.target.src = "https://placehold.co/400x300/e2e8f0/1e293b?text=Yoga"; }}
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-slate-900">{yoga.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{yoga.benefits}</p>
                          {yoga.video && (
                            <a
                              href={yoga.video}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-red-600 font-bold mt-2 flex items-center gap-1 hover:text-red-700 transition-colors"
                            >
                              ▶ WATCH VIDEO
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Remedies Section */}
              {(rec.remedies || rec.ayurveda) && (rec.remedies?.length > 0 || rec.ayurveda?.length > 0) && (
                <div className="mb-10">
                  <h3 className="text-xl font-bold mb-5 text-slate-800">🌿 Ayurvedic Protocol</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(rec.ayurveda?.length > 0 ? rec.ayurveda : rec.remedies).map((remedy, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                        <img
                          src={getRemedyImage(remedy.image_keyword)}
                          alt={remedy.name}
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                          onError={(e) => { e.target.src = "https://placehold.co/200x200/e2e8f0/1e293b?text=Remedy"; }}
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-tight">{remedy.name}</h4>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1 tracking-wide">{remedy.type || "HERBAL"}</p>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2">{remedy.benefits}</p>
                          {remedy.video && (
                            <a
                              href={remedy.video}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] text-red-600 font-bold mt-2 flex items-center gap-1 hover:text-red-700"
                            >
                              ▶ WATCH
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diet & Lifestyle Grid */}
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                {(rec.dietTips || rec.remedies?.diet_do || rec.diet_do) && (
                  <div className="bg-orange-50/30 rounded-2xl p-6 border border-orange-100/50">
                    <h4 className="font-bold text-orange-900 mb-4 flex items-center">
                      🍎 Dietary Guidelines
                    </h4>
                    <ul className="space-y-3">
                      {rec.diet_do || rec.remedies?.diet_do ? (
                        <>
                          <li className="flex text-sm text-emerald-800 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-3 shrink-0" />
                            DO: {rec.diet_do || rec.remedies?.diet_do}
                          </li>
                          {(rec.diet_dont || rec.remedies?.diet_dont) && (
                            <li className="flex text-sm text-red-800 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 mr-3 shrink-0" />
                              AVOID: {rec.diet_dont || rec.remedies?.diet_dont}
                            </li>
                          )}
                        </>
                      ) : (
                        (rec.dietTips || rec.remedies?.diet_tips || rec.remedies?.dietTips || [])?.map((tip, i) => (
                          <li key={i} className="flex text-sm text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 mr-3 shrink-0" />
                            {tip}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}

                {(rec.lifestyleTips || rec.remedies?.lifestyle_do || rec.lifestyle_do) && (
                  <div className="bg-blue-50/30 rounded-2xl p-6 border border-blue-100/50">
                    <h4 className="font-bold text-blue-900 mb-4 flex items-center">
                      🌙 Lifestyle Edits
                    </h4>
                    <ul className="space-y-3">
                      {rec.lifestyle_do || rec.remedies?.lifestyle_do ? (
                        <>
                          <li className="flex text-sm text-blue-800 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-3 shrink-0" />
                            DO: {rec.lifestyle_do || rec.remedies?.lifestyle_do}
                          </li>
                          {(rec.lifestyle_dont || rec.remedies?.lifestyle_dont) && (
                            <li className="flex text-sm text-amber-800 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-3 shrink-0" />
                              AVOID: {rec.lifestyle_dont || rec.remedies?.lifestyle_dont}
                            </li>
                          )}
                        </>
                      ) : (
                        (rec.lifestyleTips || rec.remedies?.lifestyle_tips || rec.remedies?.lifestyleTips || [])?.map((tip, i) => (
                          <li key={i} className="flex text-sm text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-3 shrink-0" />
                            {tip}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RecommendationHistory;
