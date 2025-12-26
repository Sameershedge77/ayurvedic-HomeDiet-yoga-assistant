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

  return (
    <div className="min-h-screen bg-ayur-gradient">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-20">
        <h1 className="text-3xl font-semibold mb-6">
          Recommendation History 🌿
        </h1>

        {loading && (
          <p className="text-slate-600">Loading recommendations...</p>
        )}

        {!loading && history.length === 0 && (
          <p className="text-slate-600">
            No previous recommendations found.
          </p>
        )}

        <div className="space-y-10">
          {history.map((rec, index) => (
            <div
              key={rec.id}
              className="bg-white/80 rounded-3xl p-6 border shadow-soft-card"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Recommendation {index === 0 ? "(Latest)" : ""}
                </h2>
                <span className="text-sm text-slate-500">
                  {new Date(rec.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Summary */}
              <div className="mb-6 text-sm text-slate-700">
                <p>
                  <strong>Health Issues:</strong> {rec.healthIssues}
                </p>
                <p>
                  <strong>Lifestyle:</strong>{" "}
                  {rec.lifestyle || "Not specified"}
                </p>
                <p>
                  <strong>Severity:</strong>{" "}
                  {rec.severity || "Not specified"}
                </p>
              </div>

              {/* Yoga Section */}
              {rec.yoga.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-3">
                    🧘 Yoga to Practice
                  </h3>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {rec.yoga.map((yoga, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl p-4 border hover:shadow-md transition"
                      >
                        <img
                          src={yoga.image || "https://via.placeholder.com/150"}
                          alt={yoga.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />

                        <h4 className="font-semibold text-slate-900">
                          {yoga.name}
                        </h4>

                        <p className="text-xs text-slate-500 mt-1">
                          {yoga.benefits}
                        </p>

                        {yoga.video && (
                          <a
                            href={yoga.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 mt-2 inline-block hover:underline"
                          >
                            ▶ Watch guided video
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Remedies Section */}
              {rec.remedies.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-3">
                    🌿 Ayurvedic Home Remedies
                  </h3>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {rec.remedies.map((remedy, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl p-4 border hover:shadow-md transition"
                      >
                        <img
                          src={remedy.image || "https://via.placeholder.com/150"}
                          alt={remedy.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />

                        <h4 className="font-semibold text-slate-900">
                          {remedy.name}
                        </h4>

                        <p className="text-xs text-slate-500 mt-1">
                          Ingredients: {remedy.ingredients}
                        </p>

                        {remedy.video && (
                          <a
                            href={remedy.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 mt-2 inline-block hover:underline"
                          >
                            ▶ Watch preparation video
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RecommendationHistory;
