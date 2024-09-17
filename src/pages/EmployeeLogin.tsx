import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const EmployeeLogin: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkEmployeeStatus(user);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await checkEmployeeStatus(result.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const checkEmployeeStatus = async (user: User) => {
    const employeeRef = doc(db, 'employees', user.uid);
    const employeeSnap = await getDoc(employeeRef);

    if (employeeSnap.exists()) {
      navigate('/employee-dashboard');
    } else {
      // Store sign-in attempt
      await setDoc(doc(db, 'signInAttempts', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        providerId: user.providerData[0]?.providerId,
        createdAt: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
      });

      // Sign out the user and show an error message
      await auth.signOut();
      alert('You are not authorized as an employee. Your sign-in attempt has been recorded for review.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Employee Login</h1>
      <div className="max-w-md mx-auto">
        <button
          onClick={signInWithGoogle}
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default EmployeeLogin;