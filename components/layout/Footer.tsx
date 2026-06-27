import Link from 'next/link';

const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/category' },
];

const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-orange-500 tracking-wider uppercase">
                            About Us
                        </h3>
                        <p className="mt-4 text-base text-gray-500 leading-relaxed">
                            PrimeBasket is your one‑stop shop for fresh vegetables, fruits,
                            cakes, biscuits, and more. We deliver quality right to your
                            doorstep.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-orange-500 tracking-wider uppercase">
                            Quick Links
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-base text-gray-500 hover:text-orange-500 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-orange-500 tracking-wider uppercase">
                            Legal
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-base text-gray-500 hover:text-orange-500 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-orange-500 tracking-wider uppercase">
                            Contact Info
                        </h3>
                        <ul className="mt-4 space-y-3 text-base text-gray-500">
                            <li>
                                <span className="font-medium text-gray-700">Address:</span>{' '}
                                123 Prime Street, Colombo, Sri Lanka
                            </li>
                            <li>
                                <span className="font-medium text-gray-700">Phone:</span> +94 77 123 4567
                            </li>
                            <li>
                                <span className="font-medium text-gray-700">Email:</span>{' '}
                                support@primebasket.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-200 pt-8">
                    <p className="text-center text-base text-gray-400">
                        &copy; {new Date().getFullYear()} PrimeBasket. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}