import "../styles/static.css";

function About() {
  return (
    <div className="static-page">

      <div className="static-hero">
        <h1>About OFEZO</h1>
        <p>Your local offers discovery platform</p>
      </div>

      <div className="static-content">
        <h2>What is OFEZO?</h2>
        <p>
          OFEZO is a local offers discovery platform that connects
          nearby shops and customers. We help local businesses grow
          digitally while helping customers find the best deals
          around them.
        </p>

        <h2>Our Mission</h2>
        <p>
          To support local businesses by giving them a digital
          presence and helping customers save money through
          verified local offers.
        </p>

        <h2>Why Choose OFEZO?</h2>
        <ul>
          <li>📍 Nearby local offers</li>
          <li>🏪 Support small businesses</li>
          <li>💸 Best deals in your city</li>
          <li>⚡ Simple & fast experience</li>
        </ul>
      </div>

    </div>
  );
}

export default About;
