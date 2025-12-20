import { doctors } from "../../data/doctors";
import { useNavigate } from "react-router-dom";

export default function AppointmentPreview() {
  const navigate = useNavigate();

  return (
    <section className="mt-14">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          Book an Appointment 🩺
        </h2>
        <button
          onClick={() => navigate("/appointments")}
          className="text-green-600 hover:underline font-medium"
        >
          View all doctors →
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {doctors.map(doc => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Availability */}
            <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mb-3">
              {doc.availability}
            </span>

            {/* Doctor */}
            <div className="flex items-center gap-4">
              <img
                src={doc.image}
                alt={doc.name}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h3 className="font-semibold">{doc.name}</h3>
                <p className="text-sm text-gray-600">{doc.specialty}</p>
                <p className="text-xs text-gray-500">{doc.experience}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {doc.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-5">
              <div className="text-sm">
                ⭐ {doc.rating}
                <span className="block text-gray-500">₹{doc.fee}</span>
              </div>
              <button
                onClick={() => navigate("/appointments")}
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
