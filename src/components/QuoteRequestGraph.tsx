import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '../firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

interface QuoteRequest {
  timestamp: Timestamp;
}

const QuoteRequestGraph: React.FC = () => {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');
  const [totalRequests, setTotalRequests] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - (timeRange === '7days' ? 7 : 30));

      const q = query(
        collection(db, 'quoteRequests'),
        where('timestamp', '>=', startDate),
        where('timestamp', '<=', endDate)
      );

      const querySnapshot = await getDocs(q);
      const requests: QuoteRequest[] = [];
      querySnapshot.forEach((doc) => {
        requests.push(doc.data() as QuoteRequest);
      });

      const groupedData = groupRequestsByDate(requests, timeRange === '7days' ? 7 : 30);
      setData(groupedData);
      setTotalRequests(requests.length);
    };

    fetchData();
  }, [timeRange]);

  const groupRequestsByDate = (requests: QuoteRequest[], days: number) => {
    const grouped: { [key: string]: number } = {};
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      grouped[d.toISOString().split('T')[0]] = 0;
    }

    requests.forEach((request) => {
      const date = request.timestamp.toDate().toISOString().split('T')[0];
      if (grouped[date] !== undefined) {
        grouped[date]++;
      }
    });

    return Object.entries(grouped).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
      count
    }));
  };

  return (
    <div className="mt-4 md:mt-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4">Quote Request Submissions</h2>
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0">
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
        <div className="text-base md:text-lg font-semibold">
          Total Requests: {totalRequests}
        </div>
      </div>
      <div className="h-64 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
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
              dataKey="count"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuoteRequestGraph;