const Terms = () => (
  <main className="min-h-screen bg-gradient-warm py-10 pt-24">
    <div className="container mx-auto max-w-2xl px-4">
      <h1 className="font-display text-3xl font-bold text-foreground">Terms & Conditions</h1>
      <p className="mt-2 text-sm text-muted-foreground">MRL Foods</p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>By accessing or using our website, you agree to these Terms & Conditions.</p>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">1. Business Overview</h2>
          <p>MRL Foods is engaged in selling food-related products through online platforms.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">2. Website Usage</h2>
          <p className="mb-2">You agree NOT to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Misuse the website</li>
            <li>Attempt hacking</li>
            <li>Provide false information</li>
            <li>Engage in illegal activities</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">3. Account Responsibility</h2>
          <p>You are responsible for maintaining confidentiality of your account credentials.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">4. Product Availability</h2>
          <p>Products are subject to availability. We may discontinue any product anytime.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">5. Pricing</h2>
          <p>Prices may change without notice. Final price is confirmed during checkout.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">6. Order Acceptance</h2>
          <p className="mb-2">We reserve the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Reject orders</li>
            <li>Cancel orders</li>
            <li>Limit quantities</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">7. Delivery</h2>
          <p>Delivery timelines are estimates and may vary based on location and logistics.</p>
          <p className="mt-1">MRL Foods is not responsible for courier delays.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">8. Intellectual Property</h2>
          <p>All website content belongs to MRL Foods. Unauthorized use is prohibited.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">9. Limitation of Liability</h2>
          <p className="mb-2">MRL Foods shall not be liable for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Website downtime</li>
            <li>Third-party failures</li>
            <li>Indirect losses</li>
            <li>Delivery delays</li>
            <li>Customer misuse</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">10. Legal Jurisdiction</h2>
          <p>All disputes shall be governed by Indian law.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">11. Contact</h2>
          <p className="font-medium text-foreground">📧 mrlfoods2023@gmail.com</p>
        </section>
      </div>
    </div>
  </main>
);

export default Terms;
