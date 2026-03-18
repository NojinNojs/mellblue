import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Ocean wave / drop icon representing "The Deep Ocean Blue" */}
            <path d="M12 2C8 2 4 6 4 10c0 5.5 4 10 8 12 4-2 8-6.5 8-12 0-4-4-8-8-8z" />
            <path d="M12 8c0 3-2 5-2 7" strokeOpacity="0.5" />
        </svg>
    );
}
