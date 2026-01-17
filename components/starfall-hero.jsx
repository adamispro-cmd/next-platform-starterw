'use client';

import { useEffect, useRef } from 'react';

export function StarfallHero() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let stars = [];

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        class Star {
            constructor(canvasWidth, canvasHeight) {
                this.canvasWidth = canvasWidth / window.devicePixelRatio;
                this.canvasHeight = canvasHeight / window.devicePixelRatio;
                this.reset();
            }

            reset() {
                this.x = Math.random() * this.canvasWidth;
                this.y = Math.random() * -100;
                this.size = Math.random() * 2 + 1;
                this.speed = Math.random() * 3 + 2;
                this.opacity = Math.random() * 0.5 + 0.5;
                this.tail = Math.random() * 30 + 20;
                this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
                this.color = this.getRandomColor();
            }

            getRandomColor() {
                const colors = [
                    '#2bdcd2', // primary cyan
                    '#ffffff', // white
                    '#a855f7', // purple
                    '#3b82f6', // blue
                    '#f472b6', // pink
                    '#fbbf24', // yellow
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;

                if (this.y > this.canvasHeight + 50 || this.x > this.canvasWidth + 50) {
                    this.reset();
                }
            }

            draw(ctx) {
                ctx.save();

                // Draw tail
                const gradient = ctx.createLinearGradient(
                    this.x - Math.cos(this.angle) * this.tail,
                    this.y - Math.sin(this.angle) * this.tail,
                    this.x,
                    this.y
                );
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(1, this.color);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = this.size;
                ctx.lineCap = 'round';
                ctx.globalAlpha = this.opacity;

                ctx.beginPath();
                ctx.moveTo(
                    this.x - Math.cos(this.angle) * this.tail,
                    this.y - Math.sin(this.angle) * this.tail
                );
                ctx.lineTo(this.x, this.y);
                ctx.stroke();

                // Draw star head glow
                const glowGradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 3
                );
                glowGradient.addColorStop(0, this.color);
                glowGradient.addColorStop(1, 'transparent');

                ctx.fillStyle = glowGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        const initStars = () => {
            stars = [];
            const starCount = Math.floor((canvas.width / window.devicePixelRatio) / 15);
            for (let i = 0; i < starCount; i++) {
                const star = new Star(canvas.width, canvas.height);
                star.y = Math.random() * (canvas.height / window.devicePixelRatio);
                stars.push(star);
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

            stars.forEach(star => {
                star.update();
                star.draw(ctx);
            });

            animationId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        initStars();
        animate();

        const handleResize = () => {
            resizeCanvas();
            initStars();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <section className="relative -mx-6 sm:-mx-12 -mt-6 sm:-mt-12 overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ minHeight: '400px' }}
            />
            <div className="relative z-10 text-center py-16 sm:py-24 px-6 sm:px-12">
                <div className="mb-6">
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium backdrop-blur-sm border border-primary/30">
                        Webhook Forwarding Made Simple
                    </span>
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent">
                    Starfall
                </h1>
                <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto mb-4">
                    Forward messages between webhooks effortlessly
                </p>
                <p className="text-lg text-white/60 max-w-xl mx-auto">
                    Enter your source webhook URL, and your target webhook URL.<br />
                    We'll handle the forwarding for you.
                </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900 pointer-events-none" />
        </section>
    );
}
