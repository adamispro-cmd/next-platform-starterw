'use client';

import { useState, useEffect } from 'react';
import { Alert } from 'components/alert';
import { Card } from 'components/card';

export function WebhookForwarderForm() {
    const [targetUrl, setTargetUrl] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [testPayload, setTestPayload] = useState('{"message": "Hello, webhook!"}');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Generate the source URL based on the current location
        if (typeof window !== 'undefined') {
            const baseUrl = window.location.origin;
            setSourceUrl(`${baseUrl}/api/webhook-forward`);
        }
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(sourceUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleTestForward = async (e) => {
        e.preventDefault();

        if (!targetUrl.trim()) {
            setStatus('error');
            setError('Please enter a target webhook URL');
            return;
        }

        try {
            setStatus('pending');
            setError(null);

            const response = await fetch('/api/webhook-forward', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetUrl: targetUrl.trim(),
                    payload: JSON.parse(testPayload),
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus('ok');
            } else {
                setStatus('error');
                setError(result.error || `${response.status} ${response.statusText}`);
            }
        } catch (err) {
            setStatus('error');
            setError(err.message || 'Failed to forward webhook');
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <Card title="Configure Webhook Forwarding">
                <form onSubmit={handleTestForward} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Source Webhook URL (send messages here)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={sourceUrl}
                                readOnly
                                className="input flex-1 bg-neutral-100"
                            />
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="btn"
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">
                            This is the URL you'll configure as your webhook endpoint
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Target Webhook URL (forward messages to)
                        </label>
                        <input
                            type="url"
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                            placeholder="https://your-target-webhook.com/endpoint"
                            className="input w-full"
                            required
                        />
                        <p className="text-sm text-neutral-500 mt-1">
                            The destination where messages will be forwarded
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Test Payload (JSON)
                        </label>
                        <textarea
                            value={testPayload}
                            onChange={(e) => setTestPayload(e.target.value)}
                            placeholder='{"message": "Hello, webhook!"}'
                            className="input w-full font-mono text-sm"
                            rows={4}
                        />
                        <p className="text-sm text-neutral-500 mt-1">
                            Optional: customize the test message payload
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        disabled={status === 'pending'}
                    >
                        {status === 'pending' ? 'Sending...' : 'Test Forward'}
                    </button>

                    {status === 'ok' && (
                        <Alert type="success">
                            Webhook forwarded successfully!
                        </Alert>
                    )}
                    {status === 'error' && (
                        <Alert type="error">
                            {error}
                        </Alert>
                    )}
                </form>
            </Card>

            <Card title="How to Use">
                <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">1</span>
                        <p>Copy the <strong>Source Webhook URL</strong> above</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">2</span>
                        <p>Enter your <strong>Target Webhook URL</strong> where you want messages forwarded</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">3</span>
                        <p>When sending to the source URL, include the target URL in the request body as <code>targetUrl</code></p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">4</span>
                        <p>The payload you send will be forwarded to the target webhook automatically</p>
                    </div>
                </div>
            </Card>

            <Card title="Example Request">
                <pre className="bg-neutral-800 text-green-400 p-4 rounded-sm overflow-x-auto text-sm">
{`POST ${sourceUrl}
Content-Type: application/json

{
  "targetUrl": "https://your-target-webhook.com/endpoint",
  "payload": {
    "message": "Hello from forwarder!",
    "data": { "key": "value" }
  }
}`}
                </pre>
            </Card>
        </div>
    );
}
