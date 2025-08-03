import { useEffect, useState } from 'react';

export default function useHandHistory(handId) {
  const [hand, setHand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!handId) return;
    const fetchHand = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/hands/${handId}`);
        if (!res.ok) throw new Error('Failed to fetch hand');
        const history = await res.json();
        setHand({ heroId: null, history });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHand();
  }, [handId]);

  return { hand, loading, error };
}
