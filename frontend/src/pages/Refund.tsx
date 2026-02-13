const Refund = () => (
    <main className="min-h-screen bg-gradient-warm py-10 pt-24">
        <div className="container mx-auto max-w-3xl px-4">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Shipping, Returns & Refund Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">MRL Foods</p>

            <div className="space-y-10 text-base leading-relaxed text-muted-foreground">

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">🚚</span>
                        <h2 className="font-display text-xl font-bold text-foreground">Shipping & Delivery</h2>
                    </div>
                    <p className="mb-4">We strive to get your favorites to your doorstep as quickly as possible.</p>
                    <div className="pl-2 space-y-4">
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <span className="font-bold text-foreground block mb-2 text-gold">Shipping Charges</span>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li><strong>FREE shipping</strong> on all orders above ₹699.</li>
                                <li>A flat fee of <strong>₹35</strong> applies to orders below ₹699.</li>
                            </ul>
                        </div>
                        <div>
                            <span className="font-bold text-foreground block mb-2">Delivery Time Frame</span>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Product will be delivered within 3-4 days.</li>
                                <li>Replacement/exchanged products will be delivered within 4-5 days.</li>
                            </ul>
                        </div>
                        <div>
                            <span className="font-bold text-foreground block mb-1">Tracking</span>
                            <p>Once your order is on its way, we’ll email you the tracking details and AWB number so you can follow its journey.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">🛑</span>
                        <h2 className="font-display text-xl font-bold text-foreground">Cancellations</h2>
                    </div>
                    <p className="mb-4">Need to change your mind? Speed is key!</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Window:</strong> You can cancel your order within 1 hour of placement, provided the status is still "Pending" in your Order History.</li>
                        <li><strong>How to Cancel:</strong> Change the status in your Account section or email us immediately at <a href="mailto:mrlfoods2023@gmail.com" className="text-gold hover:underline">mrlfoods2023@gmail.com</a>.</li>
                        <li><strong>Note on Perishables:</strong> If you cancel an order containing perishable goods, the cost of those items must be borne by the customer.</li>
                        <li><strong>Processed Orders:</strong> Once an order is "Processed" or "Dispatched," it cannot be canceled.</li>
                    </ul>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">🔄</span>
                        <h2 className="font-display text-xl font-bold text-foreground">Returns & Replacements</h2>
                    </div>
                    <p className="mb-4">We take great care in packaging, but we know things happen. We offer replacements if your item arrives damaged, has a manufacturing defect, or if the wrong item was sent.</p>

                    <div className="pl-4 border-l-2 border-gold/30 mb-6">
                        <span className="font-bold text-foreground block mb-2">The "Must-Knows"</span>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Time Limit:</strong> You must inform us within 2 days of delivery.</li>
                            <li><strong>Evidence:</strong> Please email us a photograph of the package along with your Order Number and the reason for the return.</li>
                            <li><strong>Approval Required:</strong> Do not send items back until you receive confirmation from our team. We are not responsible for unconfirmed returns.</li>
                        </ul>
                    </div>

                    <div>
                        <span className="font-bold text-foreground block mb-2">Non-Returnable Items</span>
                        <p className="mb-2 text-sm">To maintain safety and hygiene, we cannot accept returns for:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <li className="flex items-center gap-2"><span className="text-red-400">×</span> Perishable items</li>
                            <li className="flex items-center gap-2"><span className="text-red-400">×</span> Opened or used items</li>
                            <li className="flex items-center gap-2"><span className="text-red-400">×</span> Not in original condition</li>
                            <li className="flex items-center gap-2"><span className="text-red-400">×</span> International orders</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">💰</span>
                        <h2 className="font-display text-xl font-bold text-foreground">Refund Policy</h2>
                    </div>
                    <p className="mb-4">If a refund is approved (due to product unavailability or a valid return), we make the process simple:</p>
                    <div className="bg-secondary/20 p-6 rounded-xl space-y-3">
                        <div className="flex gap-3">
                            <span className="font-bold text-foreground min-w-[120px]">Timeline:</span>
                            <span>We initiate refunds within 48 hours of confirmation.</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="font-bold text-foreground min-w-[120px]">Processing:</span>
                            <span>Typically takes 7–10 business days to reflect in your account.</span>
                        </div>
                        <div className="flex gap-3">
                            <span className="font-bold text-foreground min-w-[120px]">Method:</span>
                            <span>Refunds are issued via the original payment method.</span>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">⚠️</span>
                        <h2 className="font-display text-xl font-bold text-foreground">Important Notes</h2>
                    </div>
                    <ul className="list-disc pl-5 space-y-3">
                        <li><strong>Address Accuracy:</strong> Please double-check your delivery details! If a package is returned due to an incorrect address or the recipient being unavailable, any re-delivery costs will be charged to the user.</li>
                        <li><strong>State Taxes:</strong> Domestic customers are responsible for any state government duties or levies.</li>
                        <li><strong>Out of Stock:</strong> If an item is unavailable, we will contact you to offer an alternative or a 100% refund.</li>
                    </ul>
                </section>

                <section className="pt-8 border-t border-white/10 text-center">
                    <h2 className="font-display text-lg font-bold text-foreground mb-4">Questions? We're here to help!</h2>
                    <div className="flex flex-col md:flex-row justify-center gap-6 text-sm">
                        <a href="mailto:mrlfoods2023@gmail.com" className="hover:text-gold transition-colors block">
                            📧 mrlfoods2023@gmail.com
                        </a>
                        <a href="https://www.mrlfoods.in" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors block">
                            🌐 www.mrlfoods.in
                        </a>
                    </div>
                </section>

            </div>
        </div>
    </main>
);

export default Refund;
