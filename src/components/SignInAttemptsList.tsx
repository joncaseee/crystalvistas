import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface SignInAttempt {
  uid: string;
  email: string;
  displayName: string;
  providerId: string;
  createdAt: Date;
  lastSignInTime: Date;
}

interface SignInAttemptsListProps {
  attempts: SignInAttempt[];
}

const SignInAttemptsList: React.FC<SignInAttemptsListProps> = ({ attempts }) => {
  const [approvedEmployees, setApprovedEmployees] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchApprovedEmployees = async () => {
      const approvedSet = new Set<string>();
      for (const attempt of attempts) {
        const employeeRef = doc(db, 'employees', attempt.uid);
        const employeeDoc = await getDoc(employeeRef);
        if (employeeDoc.exists()) {
          approvedSet.add(attempt.uid);
        }
      }
      setApprovedEmployees(approvedSet);
    };

    fetchApprovedEmployees();
  }, [attempts]);

  const toggleEmployeeApproval = async (attempt: SignInAttempt) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      const currentEmployeeRef = doc(db, 'employees', currentUser.uid);
      const currentEmployeeDoc = await getDoc(currentEmployeeRef);

      if (!currentEmployeeDoc.exists()) {
        throw new Error('You are not authorized to manage employees');
      }

      const employeeRef = doc(db, 'employees', attempt.uid);
      const isApproved = approvedEmployees.has(attempt.uid);

      if (isApproved) {
        await deleteDoc(employeeRef);
        setApprovedEmployees(prev => {
          const newSet = new Set(prev);
          newSet.delete(attempt.uid);
          return newSet;
        });
        console.log(`Employee ${attempt.displayName || attempt.email} has been disabled.`);
      } else {
        await setDoc(employeeRef, {
          email: attempt.email,
          displayName: attempt.displayName,
          approvedAt: new Date(),
        });
        setApprovedEmployees(prev => new Set(prev).add(attempt.uid));
        console.log(`Employee ${attempt.displayName || attempt.email} has been approved.`);
      }
    } catch (error) {
      console.error('Error toggling employee approval:', error);
      alert(error instanceof Error ? error.message : 'Failed to toggle employee approval. Please try again.');
    }
  };

  const deleteAccount = async (attempt: SignInAttempt) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      const currentEmployeeRef = doc(db, 'employees', currentUser.uid);
      const currentEmployeeDoc = await getDoc(currentEmployeeRef);

      if (!currentEmployeeDoc.exists()) {
        throw new Error('You are not authorized to manage employees');
      }

      // Delete from 'employees' collection if it exists
      const employeeRef = doc(db, 'employees', attempt.uid);
      await deleteDoc(employeeRef);

      // Delete from 'signInAttempts' collection
      const signInAttemptRef = doc(db, 'signInAttempts', attempt.uid);
      await deleteDoc(signInAttemptRef);

      setApprovedEmployees(prev => {
        const newSet = new Set(prev);
        newSet.delete(attempt.uid);
        return newSet;
      });

      console.log(`Account for ${attempt.displayName || attempt.email} has been deleted.`);
      alert(`Account for ${attempt.displayName || attempt.email} has been deleted.`);
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete account. Please try again.');
    }
  };

  return (
    <div className="mt-4 md:mt-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Sign-in Attempts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-gr border border-gray-300 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="py-2 px-2 md:px-4 border-b">Name</th>
              <th className="py-2 px-2 md:px-4 border-b">Email</th>
              <th className="py-2 px-2 md:px-4 border-b hidden md:table-cell">Provider</th>
              <th className="py-2 px-2 md:px-4 border-b hidden md:table-cell">Created On</th>
              <th className="py-2 px-2 md:px-4 border-b hidden md:table-cell">Last Sign In</th>
              <th className="py-2 px-2 md:px-4 border-b">Status</th>
              <th className="py-2 px-2 md:px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.uid} className="hover:bg-gray-50 bg-white text-gray-800">
                <td className="py-2 px-2 md:px-4 border-b">{attempt.displayName || 'N/A'}</td>
                <td className="py-2 px-2 md:px-4 border-b">{attempt.email}</td>
                <td className="py-2 px-2 md:px-4 border-b hidden md:table-cell">{attempt.providerId}</td>
                <td className="py-2 px-2 md:px-4 border-b hidden md:table-cell">{new Date(attempt.createdAt).toLocaleString()}</td>
                <td className="py-2 px-2 md:px-4 border-b hidden md:table-cell">{new Date(attempt.lastSignInTime).toLocaleString()}</td>
                <td className="py-2 px-2 md:px-4 border-b">
                  <button
                    onClick={() => toggleEmployeeApproval(attempt)}
                    className="focus:outline-none bg-slate-100"
                    title={approvedEmployees.has(attempt.uid) ? "Disable employee" : "Approve employee"}
                  >
                    {approvedEmployees.has(attempt.uid) ? (
                      <ToggleRight size={24} className="bg-slate-100 text-green-500" />
                    ) : (
                      <ToggleLeft size={24} className="bg-slate-100 text-gray-400" />
                    )}
                  </button>
                </td>
                <td className="py-2 px-2 md:px-4 border-b">
                  <button
                    onClick={() => deleteAccount(attempt)}
                    className="focus:outline-none bg-slate-100 ml-2"
                    title="Delete account"
                  >
                    <Trash2 size={24} className="bg-slate-100 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SignInAttemptsList;