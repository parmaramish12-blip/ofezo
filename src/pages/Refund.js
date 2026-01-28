import React from "react";
import "../styles/refund.css";

const Refund = () => {
  return (
    <div className="refund-container">

      <div className="refund-hero">
        <h1>Refund Policy</h1>
        <p>
          Transparency and clarity are important to us.
        </p>
      </div>

      <div className="refund-content">

        <section>
          <h2>Introduction</h2>
          <p>
            OFEZO is a local offers discovery platform. We do not sell products
            or services directly. Therefore, refund policies may vary depending
            on the seller.
          </p>
        </section>

        <section>
          <h2>Payments on OFEZO</h2>
          <p>
            Currently, OFEZO does not process payments between customers and
            sellers. All transactions take place directly between users and
            businesses.
          </p>
        </section>

        <section>
          <h2>Refund Responsibility</h2>
          <p>
            Any refund, cancellation, or dispute related to a purchase must be
            resolved directly with the respective seller or business.
          </p>
        </section>

        <section>
          <h2>Offer Accuracy</h2>
          <p>
            Sellers are responsible for ensuring the accuracy of their offers.
            OFEZO is not responsible for pricing errors, expired offers, or
            seller-side issues.
          </p>
        </section>

        <section>
          <h2>Dispute Support</h2>
          <p>
            While OFEZO does not handle refunds, we encourage users to report
            misleading offers or unfair practices. Appropriate action may be
            taken against sellers who violate platform rules.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            This Refund Policy may be updated periodically to reflect changes
            in our services or legal requirements.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            For refund-related questions, you may contact us at:
          </p>
          <p>
            <strong>Email:</strong> support@ofezo.com
          </p>
        </section>

      </div>

    </div>
  );
};

export default Refund;
