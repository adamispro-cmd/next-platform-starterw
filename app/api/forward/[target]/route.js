export async function POST(request, { params }) {
    try {
        const { target } = await params;

        // Decode the target URL from base64
        let targetUrl;
        try {
            targetUrl = atob(target);
        } catch {
            return Response.json(
                { error: 'Invalid target encoding' },
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

        // Get the payload from the request body
        let payload;
        const contentType = request.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            payload = await request.json();
        } else {
            // Try to parse as text
            const text = await request.text();
            try {
                payload = JSON.parse(text);
            } catch {
                payload = { content: text };
            }
        }

        // Forward the payload to the target webhook
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // Get the response from the target
        let responseBody;
        const responseContentType = response.headers.get('content-type');

        if (responseContentType && responseContentType.includes('application/json')) {
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

export async function GET({ params }) {
    return Response.json({
        message: 'Webhook Forwarder - Ready to receive messages',
        usage: 'Send a POST request with your message payload to this URL and it will be forwarded automatically.',
    });
}
