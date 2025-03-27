const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto text-center">
                <div className="mb-4">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-2 text-gray-400 hover:text-white"
                    >
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-2 text-gray-400 hover:text-white"
                    >
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-2 text-gray-400 hover:text-white"
                    >
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-2 text-gray-400 hover:text-white"
                    >
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div>
                <p className="text-gray-500">
                    © 2025 Your Company. All rights reserved.
                </p>
                <p className="text-gray-500">
                    Developed by{" "}
                    <a href="https://dielanwebdev.pt/" target="_blank">
                        Dielan Garve
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
