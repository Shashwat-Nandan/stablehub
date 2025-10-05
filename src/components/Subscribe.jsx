import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

const subscribeToNewsletter = async (email) => {
  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to subscribe';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch (e) {
      // If parsing fails, use default message
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export default function Subscribe() {
  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: subscribeToNewsletter,
    onSuccess: () => {
      alert('Thanks for subscribing! You will receive our weekly newsletter.');
      setEmail('');
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(email);
  };

  return (
    <section className="subscribe-section">
      <div className="container">
        <div className="subscribe-content">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest stablecoin insights and blockchain updates delivered to your inbox every week</p>
          <form className="subscribe-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="subscribe-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="subscribe-btn" disabled={mutation.isPending}>
              {mutation.isPending ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          <p className="subscribe-note">Join 10,000+ readers staying ahead in blockchain finance</p>
        </div>
      </div>
    </section>
  );
}
