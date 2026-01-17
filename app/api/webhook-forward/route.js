export async function POST(request) {
    try {
        const body = await request.json();
        const { targetUrl, payload } = body;

        if (!targetUrl) {
            return Response.json(
                { error: 'Target webhook URL is required. Include "targetUrl" in your request body.' },
                { status: 400 }
            );
        }

        // Validate the target URL
        try {
            new URL(targetUrl);
        } catch {
            return Response.json(
                { error: 'Invalid target URL format' },
                { status: 400 }
            );
        }

        // Forward the payload to the target webhook
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload || {}),
        });

        // Get the response from the target
        let responseBody;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            responseBody = await response.json();
        } else {
            responseBody = await response.text();
        }

        return Response.json({
            success: response.ok,
            status: response.status,
            statusText: response.statusText,
            response: responseBody,
        }, { status: response.ok ? 200 : response.status });

    } catch (error) {
        console.error('Error forwarding webhook:', error);
        return Response.json(
            { error: 'Failed to forward webhook: ' + error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    return Response.json({
        message: 'Webhook Forwarder API',
        usage: {
            method: 'POST',
            body: {
                targetUrl: 'The URL where you want to forward messages (required)',
                payload: 'The data to send to the target webhook (optional, defaults to empty object)',
            },
            example: {
                targetUrl: 'https://your-target-webhook.com/endpoint',
                payload: { message: 'Hello!', data: { key: 'value' } },
            },
        },
    });
}
