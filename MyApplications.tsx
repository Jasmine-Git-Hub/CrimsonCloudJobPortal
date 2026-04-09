import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FileText, Calendar, Building2, Briefcase, ChevronRight, Trash2, AlertTriangle } from 'lucide-react';
import { Application } from '../types/job';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from './config/firebaseSetup';

export function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; applicationId: string | null; jobTitle: string }>({
    show: false,
    applicationId: null,
    jobTitle: ''
  });

  useEffect(() => {
    // Query all applicants collection without user filtering
    const q = collection(db, 'applicants');

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps: Application[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          jobId: data.jobApplied,
          jobTitle: data.jobTitle,
          company: 'CrimsonCloud HR', // Could be fetched from jobs collection
          appliedDate: data.applicationDate,
          status: data.status?.toLowerCase() || 'pending'
        };
      });
      setApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching applications:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'reviewing':
        return 'bg-blue-100 text-blue-700';
      case 'interview':
        return 'bg-purple-100 text-purple-700';
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'reviewing':
        return 'Under Review';
      case 'interview':
        return 'Interview Scheduled';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Not Selected';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleDeleteClick = (applicationId: string, jobTitle: string | undefined) => {
    setDeleteConfirm({
      show: true,
      applicationId,
      jobTitle: jobTitle || ''
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.applicationId) return;

    try {
      await deleteDoc(doc(db, 'applicants', deleteConfirm.applicationId));
      setDeleteConfirm({ show: false, applicationId: null, jobTitle: '' });
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, applicationId: null, jobTitle: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl mb-4 text-stone-900">All Applications</h1>
        <p className="text-xl text-stone-600">
          Track the status of all job applications
        </p>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-12 text-center">
          <FileText className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h2 className="text-2xl mb-2 text-stone-900">No Applications Yet</h2>
          <p className="text-stone-600 mb-6">
            No applications have been submitted yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl mb-2 text-stone-900">
                    {application.jobTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-stone-600 mb-3">
                    <Building2 className="w-4 h-4" />
                    <span>{application.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Applied on {formatDate(application.appliedDate)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm ${getStatusColor(application.status)}`}>
                    {getStatusText(application.status)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/jobs/${application.jobId}`}
                      className="flex items-center gap-1 text-[#7A1010] hover:underline text-sm"
                    >
                      View Job
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(application.id, application.jobTitle || '')}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="mt-6 pt-6 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['pending', 'reviewing', 'interview', 'accepted', 'rejected'].includes(application.status)
                        ? 'bg-[#7A1010] text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}>
                      1
                    </div>
                    <span className="text-sm text-stone-600">Applied</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-stone-200 mx-4"></div>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['reviewing', 'interview', 'accepted', 'rejected'].includes(application.status)
                        ? 'bg-[#7A1010] text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}>
                      2
                    </div>
                    <span className="text-sm text-stone-600">Review</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-stone-200 mx-4"></div>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['interview', 'accepted'].includes(application.status)
                        ? 'bg-[#7A1010] text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}>
                      3
                    </div>
                    <span className="text-sm text-stone-600">Interview</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-stone-200 mx-4"></div>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      application.status === 'accepted'
                        ? 'bg-green-600 text-white'
                        : application.status === 'rejected'
                        ? 'bg-red-600 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}>
                      4
                    </div>
                    <span className="text-sm text-stone-600">Decision</span>
                  </div>
                </div>
              </div>
            </div>  
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {applications.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <p className="text-stone-600 text-sm mb-1">Total Applications</p>
            <p className="text-3xl text-stone-900">{applications.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <p className="text-stone-600 text-sm mb-1">Pending</p>
            <p className="text-3xl text-yellow-700">
              {applications.filter(a => a.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <p className="text-stone-600 text-sm mb-1">Under Review</p>
            <p className="text-3xl text-blue-700">
              {applications.filter(a => a.status === 'reviewing').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <p className="text-stone-600 text-sm mb-1">Interviews</p>
            <p className="text-3xl text-purple-700">
              {applications.filter(a => a.status === 'interview').length}
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl mb-2 text-stone-900">Delete Application</h3>
              <p className="text-stone-600 mb-6">
                Are you sure you want to delete your application for <strong>{deleteConfirm.jobTitle}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-3 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
