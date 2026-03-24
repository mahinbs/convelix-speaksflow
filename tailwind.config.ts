
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'system-ui', 'sans-serif'],
				'sans': ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				placeholder: 'hsl(var(--placeholder))',
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				brand: {
					50: '#fdf4ee',
					100: '#fbe5d3',
					200: '#f6c9a5',
					300: '#f0a870',
					400: '#e98844',
					500: '#e0722e',
					600: '#c85c1f',
					700: '#a8481a',
					800: '#87391b',
					900: '#6e3119',
					950: '#3c160a',
					DEFAULT: '#e0722e',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(100px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)',
						opacity: '1'
					},
					'33%': {
						transform: 'translateY(-8px) rotate(1deg)',
						opacity: '0.9'
					},
					'66%': {
						transform: 'translateY(-4px) rotate(-0.5deg)',
						opacity: '0.95'
					}
				},
				'gentle-bounce': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-6px)'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 8px rgba(224, 114, 46, 0.35), 0 4px 20px rgba(224, 114, 46, 0.12)',
						transform: 'scale(1)'
					},
					'50%': {
						boxShadow: '0 0 25px rgba(224, 114, 46, 0.45), 0 8px 40px rgba(224, 114, 46, 0.2)',
						transform: 'scale(1.02)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				},
				'slide-up-fade': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px) scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'slide-in-elegant': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-20px) scale(0.98)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0) scale(1)'
					}
				},
				'counter-up': {
					'0%': {
						transform: 'translateY(20px) scale(0.8)',
						opacity: '0'
					},
					'50%': {
						transform: 'translateY(-5px) scale(1.05)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'translateY(0) scale(1)',
						opacity: '1'
					}
				},
				'morphing-gradient': {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				},
				'stagger-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(25px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s infinite',
				'slide-up-fade': 'slide-up-fade 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
				'slide-in-elegant': 'slide-in-elegant 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
				'counter-up': 'counter-up 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
				'morphing-gradient': 'morphing-gradient 8s ease infinite',
				'stagger-up': 'stagger-up 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem'
			},
			backdropBlur: {
				'xs': '2px',
				'3xl': '64px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
