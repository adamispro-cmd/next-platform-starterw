import { WebhookForwarderForm } from './form';
import { ContextAlert } from 'components/context-alert';
import { Markdown } from 'components/markdown';

export const metadata = {
    title: 'Webhook Forwarder'
};

const explainer = `
Use this tool to forward messages from one webhook to another. Enter the **source webhook URL**
(where you'll send messages to this forwarder) and the **target webhook URL** (where messages should be forwarded).

Once configured, send your webhook messages to the source endpoint, and they'll be automatically forwarded to your target.
`;

export default function Page() {
    return (
        <>
            <ContextAlert className="mb-6" />
            <h1 className="mb-4">Webhook Forwarder</h1>
            <Markdown content={explainer} className="mb-8" />
            <WebhookForwarderForm />
        </>
    );
}
