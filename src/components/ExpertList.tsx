import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Expert } from '../types';
import { Search, Filter, Star, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const CATEGORIES = ["All", "Software Engineering", "Product Design", "Data Science", "Career Coaching"];

export function ExpertList({ onExpertClick }: { onExpertClick: (id: string) => void }) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function fetchExperts() {
      setLoading(true);
      try {
        const q = query(collection(db, 'experts'), orderBy('name'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expert));
        setExperts(data);
      } catch (error) {
        console.error("Error fetching experts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchExperts();
  }, []);

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || expert.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif text-accent leading-tight">Find Your Expert</h1>
          <p className="text-text-secondary text-sm italic font-serif">Connecting you with world-class consultants in real-time.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search experts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-bg-card border border-border-dim rounded-full text-sm text-text-primary focus:outline-none focus:border-accent transition-all placeholder:text-text-muted"
            />
          </div>
          
          <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar scroll-smooth">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
                  selectedCategory === cat 
                    ? "bg-accent text-bg-main border-accent shadow-lg shadow-accent/20" 
                    : "bg-bg-card text-text-muted border-border-dim hover:border-accent/40 hover:text-text-primary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-bg-card rounded-[2rem] p-8 h-96 animate-pulse border border-border-dim">
              <div className="w-20 h-20 bg-white/5 rounded-2xl mb-6" />
              <div className="h-8 w-3/4 bg-white/5 rounded mb-4" />
              <div className="h-4 w-1/2 bg-white/5 rounded mb-8" />
              <div className="space-y-4">
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-full bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredExperts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredExperts.map((expert, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: 'spring', damping: 20 }}
              key={expert.id}
              className="bg-bg-card rounded-[2rem] border border-border-dim p-8 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all group flex flex-col cursor-pointer relative overflow-hidden"
              onClick={() => onExpertClick(expert.id)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex items-start justify-between mb-8">
                <div className="relative">
                  <img 
                    src={expert.imageUrl} 
                    alt={expert.name} 
                    className="w-20 h-20 rounded-2xl object-cover ring-1 ring-border-dim group-hover:ring-accent/40 transition-all shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-accent text-bg-main w-8 h-8 rounded-lg flex items-center justify-center shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60 px-3 py-1 border border-accent/20 rounded-full">
                  {expert.rating.toFixed(1)} &bull; Top Rated
                </span>
              </div>
              
              <div className="flex-1 relative z-10">
                <h3 className="text-2xl font-serif text-text-primary mb-2 group-hover:text-accent transition-colors">{expert.name}</h3>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-accent uppercase tracking-[0.15em] mb-4">
                  {expert.category}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-text-muted mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/5 rounded-lg">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium uppercase tracking-widest">{expert.experience}</span>
                  </div>
                </div>
                
                <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed mb-8 italic font-serif">
                  "{expert.bio}"
                </p>
              </div>

              <div className="pt-6 border-t border-border-dim flex items-center justify-between relative z-10">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Live availability</span>
                <button className="px-6 py-2 bg-white/5 border border-border-dim text-text-primary text-[10px] font-black uppercase tracking-widest rounded-lg group-hover:bg-accent group-hover:text-bg-main group-hover:border-accent transition-all">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-bg-card border border-border-dim rounded-full mb-6">
            <Search className="w-10 h-10 text-text-muted" />
          </div>
          <h3 className="text-2xl font-serif text-text-primary mb-2">No expertise found</h3>
          <p className="text-text-secondary text-sm italic">Adjust your search parameters to find the right consultant.</p>
        </div>
      )}
    </div>
  );
}
