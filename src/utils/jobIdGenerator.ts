// src/utils/jobIdGenerator.ts

import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export async function generateNextJobId(): Promise<string> {
  try {
    const jobsRef = collection(db, 'jobs');
    const q = query(jobsRef, orderBy('jobId', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No existing jobs found. Starting from A0001.');
      return 'A0001';
    }

    const lastJobId = querySnapshot.docs[0].data().jobId;
    console.log('Last job ID found:', lastJobId);

    if (typeof lastJobId !== 'string' || lastJobId.length !== 5 || !/^[A-Z]\d{4}$/.test(lastJobId)) {
      console.error('Invalid job ID format:', lastJobId);
      return 'A0001';
    }

    const letter = lastJobId.charAt(0);
    const number = parseInt(lastJobId.slice(1), 10);

    if (isNaN(number)) {
      console.error('Invalid number in job ID:', lastJobId);
      return 'A0001';
    }

    if (number === 9999) {
      const nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
      return `${nextLetter}0001`;
    } else {
      const nextNumber = (number + 1).toString().padStart(4, '0');
      return `${letter}${nextNumber}`;
    }
  } catch (error) {
    console.error('Error generating next job ID:', error);
    return 'A0001';
  }
}