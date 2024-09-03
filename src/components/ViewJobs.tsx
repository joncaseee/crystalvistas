import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Job } from '../types/Job';
import JobDetails from './JobDetails';

interface ViewJobsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewJobs: React.FC<ViewJobsProps> = ({ isOpen, onClose }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    if (isOpen) {
      const q = query(collection(db, 'jobs'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const jobsData: Job[] = [];
        querySnapshot.forEach((doc) => {
          const jobData = doc.data() as Omit<Job, 'id'>;
          if (typeof jobData.netProfit === 'number' && typeof jobData.expenses === 'number') {
            jobsData.push({ id: doc.id, ...jobData } as Job);
          } else {
            console.warn('Invalid job data:', jobData);
          }
        });
        setJobs(jobsData);
      });

      return () => unsubscribe();
    }
  }, [isOpen]);

  const handleEdit = async (editedJob: Job) => {
    try {
      const { id, ...jobData } = editedJob;
      await updateDoc(doc(db, 'jobs', id), jobData);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error updating job: ', error);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteDoc(doc(db, 'jobs', jobId));
        setSelectedJob(null);
      } catch (error) {
        console.error('Error deleting job: ', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  };

  const calculateGrossIncome = (netProfit: number, expenses: number) => {
    return netProfit - expenses;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full m-4">
        <h2 className="text-2xl font-bold mb-4">View Jobs</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-300 text-gray-800">
                <th className="border p-2">Date</th>
                <th className="border p-2">Job ID</th>
                <th className="border p-2">Net Profit</th>
                <th className="border p-2">Expenses</th>
                <th className="border p-2">Gross Income</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-slate-100 bg-slate-200 text-gray-800 cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <td className="border p-2">{formatDate(job.date)}</td>
                  <td className="border p-2">{job.jobId}</td>
                  <td className="border p-2">${job.netProfit.toFixed(2)}</td>
                  <td className="border p-2">${job.expenses.toFixed(2)}</td>
                  <td className="border p-2">${calculateGrossIncome(job.netProfit, job.expenses).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={onClose} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ViewJobs;