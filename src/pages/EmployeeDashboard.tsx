import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { User } from 'firebase/auth';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import SignInAttemptsList from '../components/SignInAttemptsList';
import QuoteRequestGraph from '../components/QuoteRequestGraph';
import ViewJobs from '../components/ViewJobs';
import NewJob from '../components/NewJob';
import IncomeGraph from '../components/IncomeGraph';
import ReviewsModal from '../components/ReviewsModal';
import AverageRating from '../components/AverageRating';

interface SignInAttempt {
  uid: string;
  email: string;
  displayName: string;
  providerId: string;
  createdAt: Date;
  lastSignInTime: Date;
}

const EmployeeDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [signInAttempts, setSignInAttempts] = useState<SignInAttempt[]>([]);
  const [isViewJobsOpen, setIsViewJobsOpen] = useState(false);
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const employeeRef = doc(db, 'employees', currentUser.uid);
        const employeeSnap = await getDoc(employeeRef);
        setIsEmployee(employeeSnap.exists());
      } else {
        navigate('/employee-login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user && isEmployee) {
      const q = query(collection(db, 'signInAttempts'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const attempts: SignInAttempt[] = [];
        querySnapshot.forEach((doc) => {
          attempts.push(doc.data() as SignInAttempt);
        });
        setSignInAttempts(attempts);
      });

      return () => unsubscribe();
    }
  }, [user, isEmployee]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/employee-login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getReviewLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/reviews`;
  };

  if (!user || !isEmployee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">Employee Dashboard</h1>
      <div className="max-w-full md:max-w-4xl mx-auto">
        <p className="mb-2 md:mb-4 text-lg">Hello, {user.displayName || user.email}!</p>
        <p className="mb-4 md:mb-6 text-sm md:text-base">Welcome to the Employee Dashboard.</p>
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setIsViewJobsOpen(true)}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            View Jobs
          </button>
          <button
            onClick={() => setIsNewJobOpen(true)}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:shadow-outline"
          >
            New Job
          </button>
        </div>
        <AverageRating onClick={() => setIsReviewsModalOpen(true)} />
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Review Link</h2>
          <p className="mb-2">Share this link with customers to collect reviews:</p>
          <input
            type="text"
            value={getReviewLink()}
            readOnly
            className="w-full p-2 border rounded"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
        </div>
        <div className="mb-8">
          <IncomeGraph />
        </div>
        <div className="mb-8">
          <QuoteRequestGraph />
        </div>
        <div className="mb-8">
          <SignInAttemptsList attempts={signInAttempts} />
        </div>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:shadow-outline text-sm md:text-base"
        >
          Sign Out
        </button>
      </div>
      <ViewJobs isOpen={isViewJobsOpen} onClose={() => setIsViewJobsOpen(false)} />
      <NewJob isOpen={isNewJobOpen} onClose={() => setIsNewJobOpen(false)} />
      <ReviewsModal isOpen={isReviewsModalOpen} onClose={() => setIsReviewsModalOpen(false)} />
    </div>
  );
};

export default EmployeeDashboard;