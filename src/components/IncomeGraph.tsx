import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Job {
  date: string;
  netProfit: number;
  expenses: number;
}

const IncomeGraph: React.FC = () => {
  const [data, setData] = useState<{ date: string; netIncome: number; grossIncome: number; expenses: number }[]>([]);
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - (timeRange === '7days' ? 7 : 30));

        const q = query(
          collection(db, 'jobs'),
          where('date', '>=', startDate.toISOString().split('T')[0]),
          where('date', '<=', endDate.toISOString().split('T')[0])
        );

        const querySnapshot = await getDocs(q);
        const jobs: Job[] = [];
        querySnapshot.forEach((doc) => {
          const jobData = doc.data() as Job;
          if (jobData.date && typeof jobData.netProfit === 'number' && typeof jobData.expenses === 'number') {
            jobs.push(jobData);
          } else {
            console.warn('Invalid job data:', jobData);
          }
        });

        const groupedData = groupJobsByDate(jobs, timeRange === '7days' ? 7 : 30);
        setData(groupedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, [timeRange]);

  const groupJobsByDate = (jobs: Job[], days: number) => {
    const grouped: { [key: string]: { netIncome: number; grossIncome: number; expenses: number } } = {};
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      grouped[dateString] = { netIncome: 0, grossIncome: 0, expenses: 0 };
    }

    jobs.forEach((job) => {
      if (job.date) {
        const dateString = job.date.split('T')[0]; // Ensure we're using just the date part
        if (grouped[dateString]) {
          grouped[dateString].netIncome += job.netProfit || 0;
          grouped[dateString].expenses += job.expenses || 0;
          grouped[dateString].grossIncome += (job.netProfit || 0) - (job.expenses || 0); // Corrected calculation
        }
      }
    });

    return Object.entries(grouped).map(([date, values]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
      ...values
    }));
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Income Overview</h2>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <button
            className={`mr-2 px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${timeRange === '7days' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeRange('7days')}
          >
            Last 7 Days
          </button>
          <button
            className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${timeRange === '30days' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeRange('30days')}
          >
            Last 30 Days
          </button>
        </div>
      </div>
      {data.length > 0 ? (
        <div className="h-64 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => value}
                interval={timeRange === '7days' ? 0 : 'preserveStartEnd'}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="netIncome"
                name="Net Income"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="grossIncome"
                name="Gross Income"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#ffc658"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-gray-500">No data available for the selected time range.</div>
      )}
    </div>
  );
};

export default IncomeGraph;