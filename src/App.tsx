/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Factory, 
  MapPin, 
  Maximize2, 
  Phone, 
  Search, 
  Filter,
  ArrowRight,
  Info
} from 'lucide-react';

interface Property {
  id: number;
  type: 'real-estate' | 'factory';
  title: string;
  location: string;
  area: string;
  price: string;
  description: string;
  image: string;
}

const MOCK_DATA: Property[] = [
  {
    id: 1,
    type: 'real-estate',
    title: 'فيلا سكنية فاخرة',
    location: 'الرياض، حي النرجس',
    area: '450 م²',
    price: '3,500,000 ر.س',
    description: 'فيلا بتصميم عصري تضم 5 غرف نوم ومسبح خاص.',
    image: 'https://picsum.photos/seed/villa/800/600'
  },
  {
    id: 2,
    type: 'factory',
    title: 'مصنع مواد غذائية',
    location: 'المنطقة الصناعية الثالثة، جدة',
    area: '2500 م²',
    price: '12,000,000 ر.س',
    description: 'مصنع مجهز بالكامل لإنتاج وتغليف المواد الغذائية مع مستودعات تبريد.',
    image: 'https://picsum.photos/seed/factory1/800/600'
  },
  {
    id: 3,
    type: 'real-estate',
    title: 'عمارة استثمارية',
    location: 'الدمام، حي الشاطئ',
    area: '600 م²',
    price: '5,800,000 ر.س',
    description: 'عمارة مكونة من 12 شقة سكنية مؤجرة بالكامل.',
    image: 'https://picsum.photos/seed/building/800/600'
  },
  {
    id: 4,
    type: 'factory',
    title: 'مستودع لوجستي',
    location: 'مدينة الملك عبدالله الاقتصادية',
    area: '5000 م²',
    price: '8,500,000 ر.س',
    description: 'مستودع تخزين جاف مع مكاتب إدارية وساحة تحميل.',
    image: 'https://picsum.photos/seed/warehouse/800/600'
  }
];

export default function App() {
  const [filter, setFilter] = useState<'all' | 'real-estate' | 'factory'>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = MOCK_DATA.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title.includes(searchQuery) || item.location.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-20" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Building2 className="text-white" size={20} />
            </div>
            <h1 className="font-bold text-xl tracking-tight">عقارات ومصانع</h1>
          </div>
          <button className="p-2 text-zinc-500">
            <Info size={20} />
          </button>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text"
            placeholder="ابحث عن عقار أو مصنع..."
            className="w-full bg-white border border-zinc-200 rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
            label="الكل"
          />
          <FilterButton 
            active={filter === 'real-estate'} 
            onClick={() => setFilter('real-estate')}
            label="عقارات"
            icon={<Building2 size={16} />}
          />
          <FilterButton 
            active={filter === 'factory'} 
            onClick={() => setFilter('factory')}
            label="مصانع"
            icon={<Factory size={16} />}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {filteredData.map((item) => (
          <motion.div 
            key={item.id}
            layoutId={`card-${item.id}`}
            onClick={() => setSelectedProperty(item)}
            className="bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="relative h-48">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                {item.type === 'real-estate' ? 'عقار' : 'مصنع'}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <div className="flex items-center gap-1 text-zinc-500 text-sm mb-3">
                <MapPin size={14} />
                <span>{item.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-bold">{item.price}</span>
                <div className="flex items-center gap-1 text-zinc-400 text-xs">
                  <Maximize2 size={14} />
                  <span>{item.area}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              layoutId={`card-${selectedProperty.id}`}
              className="fixed inset-x-4 bottom-4 top-20 bg-white rounded-3xl z-50 overflow-hidden flex flex-col"
            >
              <div className="relative h-64 shrink-0">
                <img 
                  src={selectedProperty.image} 
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedProperty(null)}
                  className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedProperty.title}</h2>
                    <div className="flex items-center gap-1 text-zinc-500">
                      <MapPin size={16} />
                      <span>{selectedProperty.location}</span>
                    </div>
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold">
                    {selectedProperty.price}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-zinc-50 p-4 rounded-2xl">
                    <span className="text-zinc-400 text-xs block mb-1">المساحة</span>
                    <span className="font-bold">{selectedProperty.area}</span>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-2xl">
                    <span className="text-zinc-400 text-xs block mb-1">النوع</span>
                    <span className="font-bold">{selectedProperty.type === 'real-estate' ? 'عقار سكني' : 'منشأة صناعية'}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold mb-2">الوصف</h4>
                  <p className="text-zinc-600 leading-relaxed">
                    {selectedProperty.description}
                  </p>
                </div>

                <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                  <Phone size={20} />
                  تواصل الآن
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Nav (Mobile Feel) */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-zinc-200 px-6 py-3 flex justify-between items-center z-30">
        <NavItem active icon={<Building2 size={24} />} label="الرئيسية" />
        <NavItem icon={<Search size={24} />} label="البحث" />
        <NavItem icon={<Factory size={24} />} label="المصانع" />
        <NavItem icon={<Phone size={24} />} label="اتصل بنا" />
      </nav>
    </div>
  );
}

function FilterButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon?: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
        ${active 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
          : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300'}
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 ${active ? 'text-indigo-600' : 'text-zinc-400'}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
