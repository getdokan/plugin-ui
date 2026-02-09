type CrownIconProps = {
	className?: string
}
const CrownIcon = ( { className = '', ...props }: CrownIconProps ) => {
	return (
		<svg
			viewBox="0 0 17 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			// Makes icon size match font size (e.g., text-xl)
			width="1em"
			height="1em"
			// Tells the SVG to inherit the parent's text color
			stroke="currentColor"
			// Basic alignment for inline text
			className={ `inline-block align-middle ${ className }` }
			{ ...props }
		>
			<path
				d="M8.30774 11.9615C6.42321 11.9612 4.53866 12.2407 2.70584 12.8L0.800049 3.87594L5.59987 6.01998L8.30774 0.800049L11.0002 6.01998L15.8 3.87594L13.8943 12.8C12.0614 12.2407 10.1769 11.9612 8.29236 11.9615"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export {
	CrownIcon,
	type CrownIconProps
}
