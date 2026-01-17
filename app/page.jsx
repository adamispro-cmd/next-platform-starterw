import Link from 'next/link';
import { StarfallHero } from 'components/starfall-hero';
import { WebhookForwarderWidget } from 'components/webhook-forwarder-widget';

export const metadata = {
    title: 'Webhook Forwarder - Forward Messages Between Webhooks'
};

export default function Page() {
    return (
        <div className="flex flex-col gap-8 sm:gap-12">
            <StarfallHero />
            <section className="relative z-10">
                <WebhookForwarderWidget />
            </section>
            <section className="text-center py-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">How It Works</h2>
                <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                        <h3 className="font-bold mb-2">Enter Both Webhooks</h3>
                        <p className="text-sm text-white/70">Put the other webhook (source) and your webhook (where you want messages)</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                        <h3 className="font-bold mb-2">Generate URL</h3>
                        <p className="text-sm text-white/70">Click generate to create your forwarder URL - this replaces the source webhook</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                        <h3 className="font-bold mb-2">Auto Forward</h3>
                        <p className="text-sm text-white/70">Every message sent to the source now gets forwarded to your webhook automatically!</p>
                    </div>
                </div>
            </section>
            <section className="text-center pb-8">
                <Link href="/webhook-forwarder" className="btn btn-lg">
                    Advanced Settings & Documentation
                </Link>
            </section>
        </div>
    );
}
