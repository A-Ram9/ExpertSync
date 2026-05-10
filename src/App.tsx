import React, { useEffect, useState } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { LogIn, LogOut, Calendar, User as UserIcon, Search, Filter, Loader2 } from 'lucide-react';
import { ExpertList } from './components/ExpertList';
import { ExpertDetail } from './components/ExpertDetail';
import { MyBookings } from './components/MyBookings';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { seedDatabase } from './lib/seed';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'bookings' | 'detail'>('home');
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      // Seed database if empty - one time call
      // This will now happen after auth, allowing admin to populate data
      if (u) {
        seedDatabase();
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Signed in successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign in');
    }
  };

  const logout = () => {
    signOut(auth);
    toast.success('Signed out');
  };

  const navigateToExpert = (id: string) => {
    setSelectedExpertId(id);
    setView('detail');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main text-text-primary font-sans">
      <Toaster 
        theme="dark" 
        toastOptions={{ 
          className: "bg-bg-card border-border-dim text-text-primary",
        }}
        position="top-center" 
      />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-bg-side/80 backdrop-blur-md border-b border-border-dim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setView('home')}
          >
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-bg-main shadow-lg shadow-accent/10 transition-transform group-hover:scale-110">
              <span className="font-serif font-black text-xl">E</span>
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight text-accent">ExpertSync</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 mr-4">
              <button 
                onClick={() => setView('home')}
                className={`text-xs font-bold uppercase tracking-widest transition-all hover:text-accent ${view === 'home' ? 'text-accent border-b border-accent pb-1' : 'text-text-muted'}`}
              >
                Experts
              </button>
              <button 
                onClick={() => setView('bookings')}
                className={`text-xs font-bold uppercase tracking-widest transition-all hover:text-accent ${view === 'bookings' ? 'text-accent border-b border-accent pb-1' : 'text-text-muted'}`}
              >
                My Bookings
              </button>
            </div>
            
            <div className="h-6 w-px bg-border-dim" />
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold leading-none">{user.displayName}</p>
                  <p className="text-[10px] text-text-muted italic">{user.email}</p>
                </div>
                <img 
                  src={user.photoURL || ''} 
                  className="w-10 h-10 rounded-xl object-cover border border-accent/20" 
                  alt="Avatar"
                />
                <button 
                  onClick={logout}
                  className="p-2 text-text-muted hover:text-accent hover:bg-white/5 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="flex items-center gap-2 bg-accent text-bg-main px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent/90 transition-all shadow-lg shadow-accent/10"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ExpertList onExpertClick={navigateToExpert} />
            </motion.div>
          )}

          {view === 'detail' && selectedExpertId && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ExpertDetail 
                expertId={selectedExpertId} 
                user={user}
                onBack={() => setView('home')} 
                onBookingSuccess={() => setView('bookings')}
              />
            </motion.div>
          )}

          {view === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MyBookings user={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
