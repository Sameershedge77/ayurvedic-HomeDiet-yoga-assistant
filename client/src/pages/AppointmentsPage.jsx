import { doctors } from "../data/doctors";
import BookingModal from "../components/appointments/BookingModal";
import { useState } from "react";

export default function Appointments() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold text-center text-green-700">
        Connect with Certified Ayurvedic Doctors
      </h1>
      <p className="text-center text-gray-600 mt-2">
        Get personalized consultation from qualified practitioners
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {doctors.map(doc => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl p-6 border hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-4">
              <img
                src={doc.image}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{doc.name}</h3>
                <p className="text-sm text-gray-600">{doc.specialty}</p>
                <p className="text-xs text-gray-500">{doc.experience}</p>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">
                {doc.availability}
              </span>
              <span className="bg-yellow-100 px-3 py-1 text-xs rounded-full">
                ⭐ {doc.rating}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {doc.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <span className="font-semibold text-gray-700">
                ₹{doc.fee}
              </span>
              <button
                onClick={() => setSelectedDoctor(doc)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
              >
                Book Consultation
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
}
