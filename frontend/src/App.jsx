import React, { useState, useEffect } from 'react';
import { Car, Search, Fuel, Gauge, RefreshCw, PlusCircle } from 'lucide-react';

export default function App() {
    const [cars, setCars] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/cars');
            if (!res.ok) throw new Error('Maʼlumot olishda xatolik');
            const data = await res.json();
            setCars(data);
        } catch (err) {
            console.error('Xatolik:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleAddCar = async () => {
        const newCar = {
            name: "BMW",
            model: "M4 Competition",
            year: 2024,
            price: "76,000",
            description: "Agressiv dizayn va kuchli twin-turbo dvigatel.",
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"
        };

        try {
            const res = await fetch('http://localhost:5000/api/cars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCar)
            });
            if (res.ok) {
                fetchCars();
            }
        } catch (err) {
            console.error('Qoʻshishda xatolik:', err);
        }
    };

    const filteredCars = cars.filter(car =>
        car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Car className="w-8 h-8 text-sky-600" />
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">AutoMarket</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleAddCar}
                            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Test qo'shish
                        </button>
                        <button
                            onClick={fetchCars}
                            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600 transition"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Yangilash
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Avtomobil qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredCars.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                        <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-slate-700">Avtomobil topilmadi</h3>
                        <p className="text-slate-500 text-sm mt-1">Hozircha `cars.json` bo'sh yoki mos mashina yo'q.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCars.map((car, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                            >
                                {car.image && (
                                    <div className="h-48 overflow-hidden bg-slate-100 relative">
                                        <img
                                            src={car.image}
                                            alt={car.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-xs font-semibold px-2.5 py-1 rounded-full text-slate-700">
                                            {car.year || '2024'}
                                        </span>
                                    </div>
                                )}

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{car.name} {car.model}</h3>
                                        <p className="text-2xl font-extrabold text-sky-600 mb-2">${car.price}</p>
                                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{car.description}</p>
                                    </div>

                                    <button className="w-full bg-slate-900 hover:bg-sky-600 text-white font-medium py-2.5 rounded-xl transition-colors duration-200">
                                        Batafsil
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}