import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Job } from '../screens/JobFinderScreen';

type SavedJobsContextType = {
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  removeJob: (id: string) => void;
};

const SavedJobsContext = createContext<SavedJobsContextType | null>(null);

export const SavedJobsProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  // Load saved jobs from storage on mount
  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const storedJobs = await AsyncStorage.getItem('savedJobs');
        if (storedJobs !== null) {
          setSavedJobs(JSON.parse(storedJobs));
        }
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      }
    };
    
    loadSavedJobs();
  }, []);

  // Store saved jobs whenever they change
  useEffect(() => {
    const storeSavedJobs = async () => {
      try {
        await AsyncStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      } catch (error) {
        console.error('Error saving jobs:', error);
      }
    };
    
    storeSavedJobs();
  }, [savedJobs]);

  // Save a job to the list
  const saveJob = (job: Job) => {
    if (!savedJobs.some((saved) => saved.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
    }
  };

  // Remove a job from the list
  const removeJob = (id: string) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== id));
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, saveJob, removeJob }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = (): SavedJobsContextType => {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error('useSavedJobs must be used within a SavedJobsProvider');
  }
  return context;
};