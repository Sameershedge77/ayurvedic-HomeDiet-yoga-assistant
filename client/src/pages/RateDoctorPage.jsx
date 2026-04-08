import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/layout/Navbar";

const RateDoctorPage = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a rating from 1 to 5 stars.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const res = await axios.post(`http://localhost:5000/api/appointments/${appointmentId}/rate`, {
                rating,
                review,
            });

            if (res.data.success) {
                setSubmitted(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-ayur-gradient">
                <Navbar />
                <main className="max-w-2xl mx-auto px-4 pt-32 pb-16 text-center">
                    <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100">
                        <div className="text-6xl mb-4">🌿</div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-4">Thank You!</h1>
                        <p className="text-slate-600 mb-8">
                            Your feedback has been successfully submitted. We appreciate you taking the time to share your experience!
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow hover:shadow-lg"
                        >
                            Return to Home
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ayur-gradient">
            <Navbar />
            <main className="max-w-2xl mx-auto px-4 pt-32 pb-16">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">Rate Your Experience</h1>
                    <p className="text-slate-500 text-center mb-10">
                        Please let us know how your recent consultation went.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col items-center">
                            <label className="block text-sm font-bold text-slate-700 mb-4">
                                Overall Rating
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className={`text-5xl transition-colors cursor-pointer focus:outline-none ${(hoverRating || rating) >= star ? 'text-amber-400' : 'text-slate-200'
                                            }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="review"
                                className="block text-sm font-bold text-slate-700 mb-2"
                            >
                                Write a Review <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <textarea
                                id="review"
                                rows="5"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Share more details about your experience..."
                                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all resize-y"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || rating === 0}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default RateDoctorPage;
