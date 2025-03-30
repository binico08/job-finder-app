import { v4 as uuidv4 } from 'uuid';

export const getJobs = async () => {
  try {
    const response = await fetch('https://empllo.com/api/v1');
    const data = await response.json();

    return data.map((job) => ({
      ...job,
      id: uuidv4(),
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};
