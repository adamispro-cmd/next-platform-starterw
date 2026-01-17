'use client';

import { useState, useEffect } from 'react';
import { Alert } from 'components/alert';

export function WebhookForwarderWidget() {
    const [sourceWebhook, setSourceWebhook] = useState('');
    const [targetWebhook, setTargetWebhook] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [testPayload, setTestPayload] = useState('{"content": "Hello from Starfall!"}');
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showTest, setShowTest] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setBaseUrl(window.location.origin);
        }
    }, []);

    const handleGenerate = () => {
        if (!targetWebhook.trim()) {
            setStatus('error');
            setError('Please enter your webhook URL (where you want messages sent)');
            return;
        }

        // Encode the target webhook URL
        const encoded = btoa(targetWebhook.trim());
        const url = `${baseUrl}/api/forward/${encoded}`;
        setGeneratedUrl(url);
        setStatus(null);
        setError(null);
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(generatedUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleTestForward = async () => {
        if (!generatedUrl) {
            setStatus('error');
            setError('Please generate a forwarder URL first');
            return;
        }

        try {
            setStatus('pending');
            setError(null);

            const response = await fetch(generatedUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: testPayload,
            });

            const result = await response.json();

            if (response.ok && result.success) {
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
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
            <div className="space-y-6">
                {/* Source Webhook Input */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                        Source Webhook
                        <span className="text-primary ml-1">(the other webhook that sends messages)</span>
                    </label>
                    <input
                        type="url"
                        value={sourceWebhook}
                        onChange={(e) => setSourceWebhook(e.target.value)}
                        placeholder="https://discord.com/api/webhooks/... (optional, for your reference)"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                    <p className="text-xs text-white/50 mt-1">Optional - just for your reference to remember which webhook is the source</p>
                </div>

                {/* Arrow indicator */}
                <div className="flex justify-center">
                    <div className="flex flex-col items-center text-white/40">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        <span className="text-xs">forwards to</span>
                    </div>
                </div>

                {/* Target Webhook Input */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                        Your Webhook
                        <span className="text-primary ml-1">(where you want messages sent)</span>
                    </label>
                    <input
                        type="url"
                        value={targetWebhook}
                        onChange={(e) => setTargetWebhook(e.target.value)}
                        placeholder="https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE"
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerate}
                    className="btn w-full text-lg py-4"
                >
                    Generate Forwarder URL
                </button>

                {/* Generated URL Display */}
                {generatedUrl && (
                    <div className="animate-fadeIn">
                        <label className="block text-sm font-semibold mb-2 text-white">
                            Your Forwarder URL
                            <span className="text-green-400 ml-1">(use this instead of the source webhook)</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={generatedUrl}
                                readOnly
                                className="flex-1 px-4 py-3 rounded-lg bg-green-900/30 border border-green-500/30 text-green-300 font-mono text-sm"
                            />
                            <button
                                onClick={handleCopyUrl}
                                className="btn whitespace-nowrap bg-green-600 hover:bg-green-700"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <p className="text-xs text-green-400/70 mt-2">
                            Any message sent to this URL will automatically forward to your webhook!
                        </p>
                    </div>
                )}

                {/* Test Section Toggle */}
                {generatedUrl && (
                    <div className="pt-2">
                        <button
                            onClick={() => setShowTest(!showTest)}
                            className="text-primary text-sm font-medium flex items-center gap-2 hover:text-primary/80 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 transition-transform ${showTest ? 'rotate-90' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            Test the forwarding
                        </button>

                        {showTest && (
                            <div className="mt-4 space-y-4 animate-fadeIn">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/70">
                                        Test Payload (JSON)
                                    </label>
                                    <textarea
                                        value={testPayload}
                                        onChange={(e) => setTestPayload(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono text-sm"
                                        rows={3}
                                    />
                                </div>

                                <button
                                    onClick={handleTestForward}
                                    disabled={status === 'pending'}
                                    className="btn w-full"
                                >
                                    {status === 'pending' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Forwarding...
                                        </span>
                                    ) : 'Send Test Message'}
                                </button>

                                {status === 'ok' && (
                                    <Alert type="success">
                                        Message forwarded successfully! Check your webhook.
                                    </Alert>
                                )}
                                {status === 'error' && (
                                    <Alert type="error">
                                        {error}
                                    </Alert>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* How it works */}
            {generatedUrl && (
                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-sm text-white/60 mb-3">How to use:</p>
                    <ol className="list-decimal list-inside text-sm text-white/70 space-y-2">
                        <li>Copy the generated forwarder URL above</li>
                        <li>Use this URL wherever you would use the source webhook</li>
                        <li>Every message sent to this URL will automatically forward to your webhook</li>
                    </ol>
                </div>
            )}
        </div>
    );
}
