import { useState } from 'react';

export default function Subscribe() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks for subscribing with: ${email}`);
    setEmail('');
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
            <button type="submit" className="subscribe-btn">Subscribe</button>
          </form>
          <p className="subscribe-note">Join 10,000+ readers staying ahead in blockchain finance</p>
        </div>
      </div>
    </section>
  );
}
