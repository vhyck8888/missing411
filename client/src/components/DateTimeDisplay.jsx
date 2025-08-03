import React, { useEffect, useState } from 'react';

const DateTimeDisplay = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <span>{now.toLocaleString()}</span>;
};

export default DateTimeDisplay;
