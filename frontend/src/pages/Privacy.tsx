const Privacy = () => (
  <main className="min-h-screen bg-gradient-warm py-10 pt-24">
    <div className="container mx-auto max-w-2xl px-4">
      <h1 className="font-display text-3xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Effective Date: [Add Date]</p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          At MRL Foods, we respect your privacy and are fully committed to protecting your personal data.
          This Privacy Policy explains how we collect, use, store, and safeguard your information when you visit our website or purchase products from us.
        </p>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
          <p className="mb-2">When you use our services, we may collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Personal Information:</strong> Full Name, Mobile Number, Email Address, Billing Address, Shipping Address.</li>
            <li><strong>Order Information:</strong> Products purchased, Order value, Delivery details.</li>
            <li><strong>Technical Information:</strong> IP address, Browser type, Device information, Website usage data.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">2. Purpose of Data Collection</h2>
          <p className="mb-2">Your information is used for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Processing orders</li>
            <li>Delivering products</li>
            <li>Sending order confirmations</li>
            <li>Customer support</li>
            <li>Improving website experience</li>
            <li>Legal compliance</li>
            <li>Fraud prevention</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">3. Payment Information</h2>
          <p>All payments are securely processed through trusted third-party payment gateways.</p>
          <p className="mt-2 text-foreground font-medium">👉 MRL Foods does NOT store any debit card, credit card, UPI PIN, or bank credentials.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">4. Cookies</h2>
          <p>Our website may use cookies to enhance browsing experience and analyze traffic. You can disable cookies anytime from your browser settings.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">5. Data Protection</h2>
          <p className="mb-2">We implement strict security measures including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>SSL encryption</li>
            <li>Secure servers</li>
            <li>Restricted access to customer data</li>
          </ul>
          <p className="mt-2">However, no online system is 100% secure.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">6. Third-Party Services</h2>
          <p className="mb-2">We may share limited information with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Payment processors</li>
            <li>Delivery partners</li>
            <li>Government authorities (if legally required)</li>
          </ul>
          <p className="mt-2 text-foreground font-medium">We NEVER sell customer data.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">7. Children’s Information</h2>
          <p>Our services are not intended for children under 18 years.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">8. Changes to Privacy Policy</h2>
          <p>MRL Foods reserves the right to update this policy anytime without prior notice.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">9. Contact</h2>
          <p>For privacy concerns:</p>
          <p className="font-medium text-foreground">📧 mrlfoods2023@gmail.com</p>
        </section>
      </div>
    </div>
  </main>
);

export default Privacy;
