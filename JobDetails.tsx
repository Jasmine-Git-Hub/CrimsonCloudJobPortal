import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { MapPin, Briefcase, Banknote, Clock, ArrowLeft, CheckCircle2, X, Loader2, FileText, GraduationCap, Award } from 'lucide-react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
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

export function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    skills: '',
    coverLetter: '',
    resumeURL: '',
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'jobs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() } as Job);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // ==========================================
  // 🟢 FIXED SUBMIT FUNCTION PARA SA ADMIN PORTAL
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newApplicant = {
        // Personal Info
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        
        // Professional Background
        experience: formData.experience,
        education: formData.education,
        skills: formData.skills,
        coverLetter: formData.coverLetter,
        resumeURL: formData.resumeURL,
        
        // 🟢 ETO 'YUNG MGA FIELDS NA BINABASA NG SUPERVISOR PORTAL MO
        jobApplied: id, 
        appliedPosition: job?.jobTitle || "Unknown Position", // Para sa "Applied Position" column
        applicationDate: new Date().toISOString().split('T')[0], // Para sa "Applied Date" column
        status: "Pending", // Default status para lumitaw agad sa table
        department: job?.department || ""
      };

      // Sinisiguro nating 'applicants' na collection ang gamit
      await addDoc(collection(db, 'applicants'), newApplicant);
      
      setShowApplicationForm(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-stone-50">
        <Loader2 className="w-12 h-12 animate-spin text-[#810100]" />
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="min-h-screen bg-stone-50 py-20 px-4 text-center">
        <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Briefcase className="w-10 h-10 text-stone-400" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Job Not Found</h2>
        <p className="text-stone-600 text-lg max-w-md mx-auto">This position may have been filled or the posting was removed.</p>
        <Link to="/" className="inline-flex items-center px-6 py-3 bg-[#810100] text-white rounded-xl font-bold hover:bg-[#630000] transition-colors mt-8">
          Browse Other Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-stone-500 hover:text-stone-900 mb-8 transition-colors font-bold group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to job listings
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="h-4 bg-[#810100]"></div>
          
          <div className="p-8 md:p-10 border-b border-stone-100">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 tracking-tight">{job?.jobTitle}</h1>
                <p className="text-xl text-stone-600 font-medium">CrimsonCloud HR</p>
              </div>
              <button
                onClick={() => setShowApplicationForm(true)}
                className="w-full md:w-auto px-10 py-4 bg-[#810100] text-white font-bold rounded-xl hover:bg-[#630000] transition-colors shadow-lg shadow-[#810100]/20 active:scale-95 text-lg"
              >
                Apply Now
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-4 md:gap-8 text-stone-600 font-medium bg-stone-50 p-6 rounded-2xl border border-stone-100">
              <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-[#810100]" /><span>Quezon City, PH</span></div>
              <div className="flex items-center gap-3"><Briefcase className="w-5 h-5 text-[#810100]" /><span>{job?.employmentType} ({job?.level})</span></div>
              <div className="flex items-center gap-3"><Banknote className="w-5 h-5 text-[#810100]" /><span>{job?.salaryRange}</span></div>
              <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-[#810100]" /><span>Posted {job?.datePosted}</span></div>
            </div>
          </div>

          <div className="p-8 md:p-10 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#810100]" /> About the Role
              </h2>
              <div className="text-stone-600 leading-relaxed text-lg whitespace-pre-wrap">{job?.description}</div>
            </section>
            
            <div className="h-px bg-stone-100 w-full"></div>
            
            <section>
              <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-[#810100]" /> Requirements & Qualifications
              </h2>
              <div className="text-stone-600 leading-relaxed text-lg whitespace-pre-wrap">{job?.requirements}</div>
            </section>
          </div>
        </div>
      </div>

      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 py-8 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-full overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
            
            <div className="p-6 md:p-8 border-b border-stone-100 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">Application Form</h2>
                <p className="text-stone-500 font-medium mt-1">Applying for: {job?.jobTitle}</p>
              </div>
              <button onClick={() => setShowApplicationForm(false)} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>

            <div className="overflow-y-auto p-6 md:p-8">
              <form id="application-form" onSubmit={handleSubmit} className="space-y-8">
                
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-stone-700 mb-2">Full Name *</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-[#810100]/10 focus:border-[#810100] outline-none font-medium transition-all" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Email Address *</label>
                      <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-[#810100]/10 focus:border-[#810100] outline-none font-medium transition-all" placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Phone Number *</label>
                      <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-[#810100]/10 focus:border-[#810100] outline-none font-medium transition-all" placeholder="+63 912 345 6789" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">Professional Background</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Years of Experience *</label>
                      <select required value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-[#810100]/10 focus:border-[#810100] outline-none font-medium transition-all bg-white">
                        <option value="">Select experience</option>
                        <option value="0-1 years">0-1 years</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="10+ years">10+ years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Highest Education *</label>
                      <select required value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-[#810100]/10 focus:border-[#810100] outline-none font-medium transition-all bg-white">
                        <option value="">Select education</option>
                        <option value="High School">High School</option>
                        <option value="Associate Degree">Associate Degree</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctorate">Doctorate</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-stone-700 mb-2">Key Skills *</label>
                      <input type="text" required value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-[#810100]/10 focus:border-[#810100] outline-none font-medium transition-all" placeholder="e.g. React, Node.js, Project Management (comma separated)" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2">Additional Details</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="col-span-1">
                      <label className="block text-sm font-bold text-stone-700 mb-2">Cover Letter / Note</label>
                      <textarea rows={4} value={formData.coverLetter} onChange={e => setFormData({...formData, coverLetter: e.target.value})} className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-[#810100]/10 focus:border-[#810100] outline-none font-medium transition-all" placeholder="Tell us why you're a great fit for this role..." />
                    </div>
                    <div className="col-span-1 bg-[#810100]/5 p-6 rounded-2xl border border-[#810100]/10">
                      <label className="block text-sm font-black text-[#810100] mb-2 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" /> Resume / CV Link *
                      </label>
                      <p className="text-xs text-stone-600 mb-3 font-medium">Please provide a link to your resume (Google Drive, Dropbox, LinkedIn, etc.)</p>
                      <input type="url" required placeholder="https://" value={formData.resumeURL} onChange={e => setFormData({...formData, resumeURL: e.target.value})} className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-[#810100]/10 focus:border-[#810100] outline-none font-bold transition-all shadow-sm" />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-stone-100 bg-stone-50 flex gap-4 sticky bottom-0 z-10">
              <button type="button" onClick={() => setShowApplicationForm(false)} className="flex-1 px-4 py-4 border-2 border-stone-200 text-stone-700 rounded-xl font-bold hover:bg-white transition-colors">Cancel</button>
              <button type="submit" form="application-form" disabled={isSubmitting} className="flex-1 px-4 py-4 bg-[#810100] text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#630000] transition-all shadow-lg shadow-[#810100]/20 disabled:opacity-50 text-lg active:scale-95">
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin"/> : "Submit Application"}
              </button>
            </div>

          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-3xl font-black mb-3 text-stone-900 tracking-tight">Submitted!</h3>
            <p className="text-stone-600 mb-8 font-medium text-lg">Thank you for applying! Your application para sa <strong>{job?.jobTitle}</strong> ay matagumpay na naipadala.</p>
            <button onClick={() => { setShowSuccessModal(false); navigate('/'); }} className="w-full px-6 py-4 bg-[#1a1a1a] text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg active:scale-95 text-lg">
              Return to Job Board
            </button>
          </div>
        </div>
      )}
    </div>
  );
}