import AppFooter from '@/Components/AppFooter';
import AppNavbar from '@/Components/AppNavbar';
import ChatbotWidget from '@/Components/ChatbotWidget';

export default function LibraryLayout({ auth, title, children }) {
    return (
        <div className="min-h-screen bg-[#0F0F0F] font-body-md text-[#E5E2E1]">
            <AppNavbar auth={auth} title={title} />
            <main className="w-full pt-16">{children}</main>
            <AppFooter />
            <ChatbotWidget />
        </div>
    );
}
