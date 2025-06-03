import { assets, footerLinks } from "../assets/assets";

const Footer = () => {


    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                   <h1 className='text-2xl md:text-3xl font-bold group'>
                <span  style={{background:' linear-gradient(to right, #187CFA, #D210B0, #604AE9)'}} className='rounded' >
                <span className='text-white group-hover:scale-108 transition-transform duration-300 inline-block px-1.5 py-1'>
                    IN
                </span>
                </span>
                sta Rush
            </h1>
                    <p className="max-w-[410px] mt-6"> We deliver fresh groceries and snacks to your doorstep, ensuring convenience and quality. Your satisfaction is our priority, and we are here to assist you with any inquiries.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="hover:underline transition">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright {new Date().getFullYear()} © Dev All Right Reserved.
            </p>
        </div>
    );
};
export default Footer;