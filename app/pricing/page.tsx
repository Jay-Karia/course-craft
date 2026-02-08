import Link from "next/link";

import { Button } from "@/components/ui/button";

const pricingTiers = [
	{
		name: "Starter",
		price: "$0",
		cadence: "/mo",
		description: "Perfect for exploring Course Craft and building your first course.",
		cta: "Start for free",
		href: "/dashboard",
		highlight: false,
		features: [
			"1 course",
			"AI-assisted outlines",
			"Up to 3 modules per course",
			"Community support",
		],
	},
	{
		name: "Creator",
		price: "$569",
		cadence: "/mo",
		description: "For creators publishing weekly content with advanced AI tools.",
		cta: "Upgrade to Creator",
		href: "/dashboard",
		highlight: true,
		features: [
			"5,000 minutes of AI video generation",
      "Custom AI voices",
			"Priority support",
		],
	},
	{
		name: "Studio",
		price: "$79",
		cadence: "/mo",
		description: "For teams shipping high-volume learning experiences.",
		cta: "Talk to sales",
		href: "/dashboard",
		highlight: false,
		features: [
			"Team workspaces",
			"Custom brand kits",
			"Bulk generation",
			"API access",
			"Dedicated success manager",
		],
	},
];

export const metadata = {
	title: "Pricing | Course Craft",
	description: "Simple, transparent pricing for building AI-powered courses.",
};

export default function PricingPage() {
	return (
		<div className="bg-background text-foreground">
			<section className="relative overflow-hidden border-b">
				<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_45%)]" />
				<div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 text-center">
					<h1 className="text-balance text-4xl font-semibold sm:text-5xl">
						Launch courses faster with plans built for every creator
					</h1>
					<p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
						Course Creator helps you turn prompts into polished courses, complete with
						scripts, quizzes, and cinematic AI videos.
					</p>
				</div>
			</section>

			<section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 lg:grid-cols-3">
				{pricingTiers.map((tier) => (
					<div
						key={tier.name}
						className={`relative flex h-full flex-col gap-6 rounded-2xl border p-6 shadow-sm transition ${
							tier.highlight
								? "border-primary/40 bg-primary/5 shadow-lg"
								: "bg-card"
						}`}
					>
						{tier.highlight ? (
							<span className="absolute right-6 top-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
								Most popular
							</span>
						) : null}
						<div className="space-y-2">
							<h2 className="text-xl font-semibold">{tier.name}</h2>
							<p className="text-sm text-muted-foreground">{tier.description}</p>
						</div>
						<div className="flex items-end gap-2">
							<span className="text-4xl font-semibold">{tier.price}</span>
							<span className="text-sm text-muted-foreground">{tier.cadence}</span>
						</div>
						<Button
							asChild
							size="lg"
							variant={tier.highlight ? "default" : "outline"}
							className="w-full"
						>
							<Link href={tier.href}>{tier.cta}</Link>
						</Button>
						<div className="space-y-3 text-sm">
							<p className="font-medium">What&apos;s included</p>
							<ul className="space-y-2 text-muted-foreground">
								{tier.features.map((feature) => (
									<li key={feature} className="flex items-start gap-2">
										<span className="mt-1 h-2 w-2 rounded-full bg-primary" />
										<span>{feature}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				))}
			</section>
		</div>
	);
}
