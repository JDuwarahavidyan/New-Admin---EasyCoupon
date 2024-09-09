import './chart.css'
import React from 'react';
import { LineChart, Line, XAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Chart({title, data, dataKey, grid}) {
  const isMobile = useMediaQuery('(max-width:480px)');
  const isTablet = useMediaQuery('(max-width:768px)');

  const aspect = isMobile ? 16/9 : isTablet ? 2/1 : 4/1;
  
  return (
    <div className='chart'>
      <h3 className="chartTitle">{title}</h3>
      <ResponsiveContainer width="100%" aspect={aspect}> {/* if height is 4 units width is 1 unit*/}
        <LineChart data={data}>
            <XAxis dataKey="name" stroke="#5550bd" />
            <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
            <Tooltip/>
            {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
