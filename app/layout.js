import './globals.css';
import './enhancements.css';
import './floral.css';
import './admin-products.css';
export const metadata = { title: 'Evermoss | For the love of green spaces', description: 'Plants and mindful green spaces, thoughtfully selected in Gampaha.' };
export default function RootLayout({ children }) { return <html lang="en"><body style={{'--font-serif': "Georgia, 'Times New Roman', serif", '--font-sans': 'Arial, Helvetica, sans-serif'}}>{children}</body></html> }
