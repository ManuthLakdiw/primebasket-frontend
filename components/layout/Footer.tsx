import Link from 'next/link';

const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/categories' },
    { name: 'Contact', href: '/contact' },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
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
                            Contact Info
                        </h3>
                        <ul className="mt-4 space-y-3 text-base text-gray-500">
                            <li>
                                <span className="font-medium text-gray-700">Address:</span>{' '}
                                123 Prime Street, City, Country
                            </li>
                            <li>
                                <span className="font-medium text-gray-700">Phone:</span> +1
                                (123) 456-7890
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
                        &copy; 2026 PrimeBasket. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}