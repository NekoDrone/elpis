import type { SVGProps } from "react";

type ElpisMarkProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
	size?: number | string;
	strokeWidth?: number;
	hairline?: boolean;
	title?: string;
};

export function ElpisMark({
	size = 22,
	strokeWidth = 0.9,
	hairline = false,
	title,
	...props
}: ElpisMarkProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 22 22"
			width={size}
			height={size}
			fill="none"
			role={title ? "img" : undefined}
			aria-hidden={title ? undefined : true}
			{...props}
		>
			{title ? <title>{title}</title> : null}
			<path
				d="M11 0.5 L12.2 9.8 L21.5 11 L12.2 12.2 L11 21.5 L9.8 12.2 L0.5 11 L9.8 9.8Z"
				stroke="currentColor"
				strokeWidth={hairline ? 1 : strokeWidth}
				strokeLinejoin="round"
				vectorEffect={hairline ? "non-scaling-stroke" : undefined}
			/>
		</svg>
	);
}
