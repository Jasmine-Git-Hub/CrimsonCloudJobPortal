import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, MapPin, Briefcase, Banknote, Clock, Filter, X, Loader2 } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './config/firebaseSetup';

interface Job {
  id: string;
  jobTitle: string;
  department: string;
  level: string;
  description: string;
  requirements: string;
  employmentType: string;
  salaryRange: string;
  status: string;
  datePosted: string;
}

export function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States para sa Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [remoteFilter, setRemoteFilter] = useState<string>('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // FETCH LIVE JOBS FROM FIREBASE
  useEffect(() => {
    const q = query(collection(db, 'jobs'), where('status', '==', 'Open'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedJobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Job));
      
      // Sort from newest to oldest
      fetchedJobs.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
      
      setJobs(fetchedJobs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = Array.from(new Set(jobs.map(job => job?.department).filter(Boolean)));
  const types = Array.from(new Set(jobs.map(job => job?.employmentType).filter(Boolean)));

  // Filter Logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job?.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job?.department?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const locationString = "Quezon City, Metro Manila"; 
    const matchesLocation = locationFilter === '' || locationString.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesType = typeFilter === 'all' || job?.employmentType === typeFilter;
    const matchesCategory = categoryFilter === 'all' || job?.department === categoryFilter;
    
    const isRemote = job?.jobTitle?.toLowerCase().includes('remote') || job?.description?.toLowerCase().includes('remote');
    const matchesRemote = remoteFilter === 'all' || 
                         (remoteFilter === 'remote' && isRemote) ||
                         (remoteFilter === 'onsite' && !isRemote);

    return matchesSearch && matchesLocation && matchesType && matchesCategory && matchesRemote;
  });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="bg-[#810100] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Find Your Dream Job
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Discover thousands of opportunities that match your skills
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-lg">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Job title, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-stone-900 focus:outline-none text-lg bg-transparent"
              />
            </div>
            <div className="hidden md:block w-px bg-stone-200 my-2"></div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                placeholder="City or state"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-stone-900 focus:outline-none text-lg bg-transparent"
              />
            </div>
            <button className="bg-[#810100] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#630000] transition-colors flex items-center justify-center gap-2">
              <Search className="w-5 h-5" /> Search Jobs
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <button
            className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-stone-200 rounded-lg text-stone-700 font-medium"
            onClick={() => setShowMobileFilters(true)}
          >
            <Filter className="w-5 h-5" /> Filters
          </button>

          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 bg-white p-6 rounded-2xl border border-stone-200 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-stone-900">Filters</h2>
              <button onClick={() => { setSearchQuery(''); setTypeFilter('all'); setCategoryFilter('all'); setLocationFilter(''); setRemoteFilter('all'); }} className="text-sm text-[#810100] font-bold">Clear All</button>
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-4 uppercase tracking-wider">Category</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="category" value="all" checked={categoryFilter === 'all'} onChange={(e) => setCategoryFilter(e.target.value)} className="w-4 h-4 text-[#810100] focus:ring-[#810100]" />
                  <span className="text-stone-600 group-hover:text-stone-900">All Categories</span>
                </label>
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="category" value={cat} checked={categoryFilter === cat} onChange={(e) => setCategoryFilter(e.target.value)} className="w-4 h-4 text-[#810100] focus:ring-[#810100]" />
                    <span className="text-stone-600 group-hover:text-stone-900">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-900 mb-4 uppercase tracking-wider">Job Type</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="type" value="all" checked={typeFilter === 'all'} onChange={(e) => setTypeFilter(e.target.value)} className="w-4 h-4 text-[#810100] focus:ring-[#810100]" />
                  <span className="text-stone-600 group-hover:text-stone-900">All Types</span>
                </label>
                {types.map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="type" value={type} checked={typeFilter === type} onChange={(e) => setTypeFilter(e.target.value)} className="w-4 h-4 text-[#810100] focus:ring-[#810100]" />
                    <span className="text-stone-600 group-hover:text-stone-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Job List */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-stone-600 font-medium">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
              </span>
              <select className="border border-stone-200 rounded-lg px-4 py-2 bg-white text-stone-700 outline-none focus:border-[#810100]">
                <option>Most Recent</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-[#810100]" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Link 
                    key={job.id} 
                    to={`/jobs/${job.id}`}
                    className="block bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-stone-200 group hover:border-[#810100]/30"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-stone-900 group-hover:text-[#810100] transition-colors mb-2">
                          {job?.jobTitle}
                        </h3>
                        <p className="text-stone-600 font-medium mb-4">CrimsonCloud HR • {job?.level} Level</p>
                        <p className="text-stone-500 text-sm line-clamp-2 max-w-3xl">{job?.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full whitespace-nowrap font-medium h-fit">
                        <Clock className="w-4 h-4" />
                        <span>Posted {job?.datePosted}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-medium">
                      <div className="flex items-center gap-2 text-stone-500">
                        <MapPin className="w-4 h-4" />
                        <span>Quezon City, PH</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-500">
                        <Briefcase className="w-4 h-4" />
                        <span>{job?.employmentType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-500">
                        <Banknote className="w-4 h-4" /> {/* PINALITAN NA ANG DOLLARSIGN NG BANKNOTE DITO */}
                        <span>{job?.salaryRange}</span>
                      </div>
                      {job?.jobTitle?.toLowerCase().includes('remote') && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                          Remote
                        </span>
                      )}
                      <span className="px-3 py-1 bg-[#810100]/5 text-[#810100] rounded-full text-xs font-bold border border-[#810100]/10">
                        {job?.department}
                      </span>
                    </div>
                  </Link>
                ))}

                {filteredJobs.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-stone-400" />
                    </div>
                    <h3 className="text-stone-900 text-xl font-bold mb-2">No jobs found</h3>
                    <p className="text-stone-500 max-w-md mx-auto">We couldn't find any positions matching your search.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}